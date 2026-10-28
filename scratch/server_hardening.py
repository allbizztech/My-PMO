import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('10.19.30.69', port=22, username='root', password='AppsPOJ123', timeout=10)

commands = [
    'systemctl is-active firewalld',
    "cat << 'EOF' > /etc/httpd/conf.d/security.conf\nServerTokens Prod\nServerSignature Off\nTraceEnable Off\nEOF",
    'systemctl restart httpd',
    'curl -I http://localhost/My-PMO/ | grep -E "Server|X-Frame|Content-Security|X-Content-Type"'
]

for cmd in commands:
    print('>>>', cmd)
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode('utf-8').strip())

ssh.close()
