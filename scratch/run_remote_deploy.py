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

# 1. Muat naik fail deploy_rocky.sh dan db_dump_utf8.sql ke /root/
print("[*] Memuat naik fail skrip pemasangan dan pangkalan data ke pelayan...")
sftp.put(r"d:\xampp\htdocs\My-PMO\deploy_rocky.sh", "/root/deploy_rocky.sh")
sftp.put(r"d:\xampp\htdocs\My-PMO\scratch\db_dump_utf8.sql", "/root/my_pmo_db.sql")
sftp.close()
print("[+] Fail berjaya dimuat naik ke /root/deploy_rocky.sh dan /root/my_pmo_db.sql")

# 2. Tukar permission dan jalankan pemasangan pakej
commands = [
    "chmod +x /root/deploy_rocky.sh",
    "/root/deploy_rocky.sh",
    "mysql my_pmo_db < /root/my_pmo_db.sql",
    "mysql -e 'USE my_pmo_db; SHOW TABLES;'",
    "mysql -e 'SELECT id, name, email, role FROM my_pmo_db.users LIMIT 5;'",
    "php -v",
    "systemctl status httpd --no-pager | head -n 4",
    "systemctl status mariadb --no-pager | head -n 4"
]

for cmd in commands:
    print(f"\n========================================================")
    print(f"MENJALANKAN: {cmd}")
    print(f"========================================================")
    stdin, stdout, stderr = ssh.exec_command(cmd, get_pty=True)
    
    # Cetak stream secara langsung
    for line in iter(stdout.readline, ""):
        print(line, end="")
        sys.stdout.flush()
        
    exit_status = stdout.channel.recv_exit_status()
    print(f"\n[Status Selesai: {exit_status}]")

ssh.close()
print("\n[+] SEMUA PROSES SELESAI DENGAN JAYANYA!")
