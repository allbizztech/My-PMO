#!/bin/bash
# ========================================================
# Skrip Pemasangan & Konfigurasi MY-PMO untuk Rocky Linux
# ========================================================

set -e

echo "[1/6] Mengemaskini sistem & memasang pakej yang diperlukan..."
dnf update -y
dnf install -y httpd mariadb-server mariadb php php-mysqlnd php-pdo php-json php-mbstring php-gd php-xml git unzip

echo "[2/6] Memulakan perkhidmatan Apache & MariaDB..."
systemctl enable httpd mariadb
systemctl start httpd mariadb

# Konfigurasi Database 
DB_NAME="my_pmo_db"
DB_USER="pmo_user"
DB_PASS="PmoSecure2026!"

echo "[3/6] Mengkonfigurasi MariaDB Database..."
mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

echo "[4/6] Menyediakan direktori projek..."
WEB_ROOT="/var/www/html/My-PMO"
mkdir -p ${WEB_ROOT}/api/uploads

# Membenarkan .htaccess (AllowOverride All) dalam Apache
cat <<EOF > /etc/httpd/conf.d/pmo.conf
<Directory "/var/www/html">
    AllowOverride All
    Require all granted
</Directory>
EOF

echo "[5/6] Mengkonfigurasi Pemilikan Fail & SELinux..."
chown -R apache:apache ${WEB_ROOT}
chmod -R 755 ${WEB_ROOT}
chmod -R 775 ${WEB_ROOT}/api/uploads

# Konfigurasi SELinux untuk Rocky Linux
if command -v semanage &> /dev/null; then
    semanage fcontext -a -t httpd_sys_rw_content_t "${WEB_ROOT}/api/uploads(/.*)?"
    restorecon -Rv ${WEB_ROOT}/api/uploads
else
    chcon -R -t httpd_sys_rw_content_t ${WEB_ROOT}/api/uploads
fi

setsebool -P httpd_can_sendmail 1 2>/dev/null || true
setsebool -P httpd_can_network_connect_db 1 2>/dev/null || true

echo "[6/6] Memuat semula perkhidmatan Apache & Firewall..."
systemctl restart httpd

if systemctl is-active --quiet firewalld; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --reload
fi

echo "=========================================================="
echo " Pemasangan asas SELESAI!"
echo " Lokasi Web Root: ${WEB_ROOT}"
echo " Database: ${DB_NAME} | User: ${DB_USER} | Password: ${DB_PASS}"
echo "=========================================================="
