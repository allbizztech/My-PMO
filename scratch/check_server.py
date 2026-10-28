import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect('10.19.30.69', port=22, username='root', password='AppsPOJ123', timeout=10)
    print("SSH CONNECTED SUCCESSFULLY!")

    commands = [
        "hostname && cat /etc/os-release | grep PRETTY_NAME",
        "systemctl is-active httpd mariadb",
        "ls -ld /var/www/html/My-PMO",
        "ls -la /var/www/html/My-PMO",
        "mysql -e 'SHOW DATABASES;'",
        "mysql -e 'USE my_pmo_db; SHOW TABLES;'",
        "cat /etc/httpd/conf.d/pmo.conf"
    ]

    for cmd in commands:
        print(f"\n>>> CMD: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='ignore').strip()
        err = stderr.read().decode('utf-8', errors='ignore').strip()
        if out:
            print(out)
        if err:
            print("ERR: " + err)

    ssh.close()
except Exception as e:
    print("EXCEPTION:", e)
