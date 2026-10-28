import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.19.30.69', port=22, username='root', password='AppsPOJ123', timeout=10)

commands = [
    'ls -la /var/www/html/My-PMO',
    'grep DocumentRoot /etc/httpd/conf/httpd.conf',
    'curl -IL http://localhost/My-PMO/',
    'tail -n 25 /var/log/httpd/error_log'
]

for cmd in commands:
    print(f"\n=== CMD: {cmd} ===")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode('utf-8', errors='ignore').strip())
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if err:
        print("ERR: " + err)

ssh.close()
