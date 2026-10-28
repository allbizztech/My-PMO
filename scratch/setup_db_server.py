import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.19.30.69', port=22, username='root', password='AppsPOJ123', timeout=15)

commands = [
    # 1. Enable & start MariaDB, Apache, PHP-FPM
    "systemctl enable --now mariadb httpd php-fpm",
    
    # 2. Setup Database & User
    "mysql -e \"CREATE DATABASE IF NOT EXISTS my_pmo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\"",
    "mysql -e \"CREATE USER IF NOT EXISTS 'pmo_user'@'localhost' IDENTIFIED BY 'PmoSecure2026!';\"",
    "mysql -e \"GRANT ALL PRIVILEGES ON my_pmo_db.* TO 'pmo_user'@'localhost';\"",
    "mysql -e \"FLUSH PRIVILEGES;\"",
    
    # 3. Import full SQL schema & data
    "mysql my_pmo_db < /root/my_pmo_db.sql",
    
    # 4. Sediakan direktori & keizinan
    "mkdir -p /var/www/html/My-PMO/api/uploads",
    "cat << 'EOF' > /etc/httpd/conf.d/pmo.conf\n<Directory \"/var/www/html\">\n    AllowOverride All\n    Require all granted\n</Directory>\nEOF",
    "chown -R apache:apache /var/www/html/My-PMO",
    "chmod -R 775 /var/www/html/My-PMO",
    "chmod -R 777 /var/www/html/My-PMO/api/uploads",
    
    # 5. SELinux & Firewall
    "if command -v semanage &> /dev/null; then semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/My-PMO/api/uploads(/.*)?' && restorecon -Rv /var/www/html/My-PMO/api/uploads; else chcon -R -t httpd_sys_rw_content_t /var/www/html/My-PMO/api/uploads; fi",
    "setsebool -P httpd_can_network_connect_db 1 2>/dev/null || true",
    "setsebool -P httpd_can_sendmail 1 2>/dev/null || true",
    "systemctl restart httpd php-fpm",
    
    # 6. Verifikasi Tables & Data
    "mysql -u pmo_user -pPmoSecure2026! my_pmo_db -e 'SHOW TABLES;'",
    "mysql -u pmo_user -pPmoSecure2026! my_pmo_db -e 'SELECT count(*) as total_users FROM users; SELECT count(*) as total_projects FROM projects;'"
]

for cmd in commands:
    print(f"\n========================================================")
    print(f">>> {cmd[:60]}...")
    print(f"========================================================")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if out: print(out)
    if err: print("ERR/INFO: " + err)

ssh.close()
print("\n[+] PERSINGGAHAN DATABASE & PERSEKITARAN BERJAYA SELESAI!")
