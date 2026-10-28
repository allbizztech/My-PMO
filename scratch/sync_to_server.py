import paramiko
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

SERVER_IP = "10.19.30.69"
USERNAME = "root"
PASSWORD = "AppsPOJ123"

print(f"[*] Menyambung ke pelayan {SERVER_IP} melalui SSH/SFTP...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(SERVER_IP, port=22, username=USERNAME, password=PASSWORD, timeout=15)
sftp = ssh.open_sftp()
print("[+] SSH & SFTP disambung berjaya!")

def sftp_mkdir_p(remote_directory):
    dirs = []
    current = remote_directory
    while len(current) > 1:
        dirs.append(current)
        current = os.path.dirname(current).replace('\\', '/')
    while len(dirs):
        d = dirs.pop()
        try:
            sftp.stat(d)
        except IOError:
            try:
                sftp.mkdir(d)
            except Exception:
                pass

def upload_dir(local_dir, remote_dir):
    sftp_mkdir_p(remote_dir)
    for root, dirs, files in os.walk(local_dir):
        # Abaikan folder yang tidak patut dimuat naik
        if any(ignored in root for ignored in ['.git', 'node_modules', 'backups', 'scratch', '.kilo', '.vscode']):
            continue
        rel_path = os.path.relpath(root, local_dir).replace('\\', '/')
        if rel_path == '.':
            target_remote = remote_dir
        else:
            target_remote = f"{remote_dir}/{rel_path}".replace('//', '/')
            sftp_mkdir_p(target_remote)

        for f in files:
            local_file = os.path.join(root, f)
            remote_file = f"{target_remote}/{f}".replace('//', '/')
            print(f"Uploading: {rel_path}/{f} -> {remote_file}")
            sftp.put(local_file, remote_file)

# 1. Muat naik fail Frontend Build (client/dist/*) ke /var/www/html/My-PMO/
print("\n[*] 1. Memuat naik fail Frontend Production (client/dist) ke pelayan...")
upload_dir(r"d:\xampp\htdocs\My-PMO\client\dist", "/var/www/html/My-PMO")

# 2. Muat naik folder api/ ke /var/www/html/My-PMO/api/
print("\n[*] 2. Memuat naik folder Backend API (api) ke pelayan...")
upload_dir(r"d:\xampp\htdocs\My-PMO\api", "/var/www/html/My-PMO/api")

# 3. Muat naik fail .htaccess
print("\n[*] 3. Memuat naik .htaccess...")
sftp.put(r"d:\xampp\htdocs\My-PMO\.htaccess", "/var/www/html/My-PMO/.htaccess")

sftp.close()

# 4. Set keizinan dan SELinux di pelayan
print("\n[*] 4. Menetapkan pemilikan dan keizinan fail di pelayan...")
commands = [
    "chown -R apache:apache /var/www/html/My-PMO",
    "find /var/www/html/My-PMO -type d -exec chmod 755 {} \\;",
    "find /var/www/html/My-PMO -type f -exec chmod 644 {} \\;",
    "chmod -R 777 /var/www/html/My-PMO/api/uploads",
    "restorecon -Rv /var/www/html/My-PMO",
    "systemctl restart httpd php-fpm",
    "curl -IL http://localhost/My-PMO/",
    "curl -s http://localhost/My-PMO/api/modules/projects.php | head -c 200"
]

for cmd in commands:
    print(f"\n>>> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if out: print(out)
    if err: print("ERR/INFO: " + err)

ssh.close()
print("\n[+] PENYEBARAN PRODUCTION SELESAI!")
