import sys
import paramiko

sys.stdout.reconfigure(encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect('10.19.30.69', port=22, username='root', password='AppsPOJ123', timeout=10)

    commands = [
        "ls -la /var/www/html",
        "which php || echo 'PHP not found'",
        "which mariadb || which mysql || echo 'DB client not found'",
        "systemctl list-units --type=service --state=running | grep -E 'http|nginx|sql|maria|db'"
    ]

    for cmd in commands:
        print(f"\n>>> CMD: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode('utf-8', errors='ignore').strip()
        err = stderr.read().decode('utf-8', errors='ignore').strip()
        if out: print(out)
        if err: print("ERR: " + err)

    ssh.close()
except Exception as e:
    print("EXCEPTION:", e)
