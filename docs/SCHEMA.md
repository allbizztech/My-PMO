# SCHEMA.md
> Sumber kebenaran struktur database projek ini.
> Kemaskini fail ini setiap kali table atau column ditambah, diubah atau dipadam.
> AI mesti cadang struktur table dalam chat dahulu — tulis ke sini selepas diluluskan sahaja.

---

## Konvensyen


---

## Tables

### 1. `users` (Pengguna Sistem)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | ID unik pengguna |
| `name` | VARCHAR(100) NOT NULL | Nama penuh |
| `email` | VARCHAR(100) UNIQUE NOT NULL | Emel rasmi (ID log masuk) |
| `password` | VARCHAR(255) NOT NULL | Hash kata laluan |
| `role` | VARCHAR(50) NOT NULL | 'superadmin', 'admin_agency', 'kewangan', 'pmo_gov', 'pmo_vendor', 'management' |
| `agency` | VARCHAR(100) NULL | Agensi pengguna (NULL untuk superadmin) |
| `status` | ENUM('Aktif', 'Tidak Aktif') | DEFAULT 'Aktif' |
| `avatar` | VARCHAR(255) NULL | Singkatan nama / URL gambar |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### 2. `projects` (Profil Projek)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | ID unik projek |
| `project_code` | VARCHAR(20) UNIQUE | Contoh: PRJ-101 |
| `name` | VARCHAR(200) NOT NULL | Tajuk projek |
| `description` | TEXT | Keterangan penuh projek |
| `agency` | VARCHAR(100) NOT NULL | Pemilik projek (Kementerian/Agensi) |
| `status` | ENUM('Aktif', 'Tertunda', 'Selesai')| DEFAULT 'Aktif' |
| `progress` | INT | Peratus siap (0-100) |
| `health` | ENUM('Cemerlang', 'Baik', 'Amaran', 'Berisiko')| Indikator kesihatan |
| `manager_id` | INT NULL (FK) | Rujuk `users.id` (PMO Kerajaan) |
| `vendor` | VARCHAR(150) | Nama syarikat pembangun/vendor |
| `start_date` | DATE | Tarikh mula |
| `end_date` | DATE | Tarikh akhir (jangkaan) |
| `budget` | DECIMAL(15,2) | Peruntukan |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | DEFAULT ON UPDATE CURRENT_TIMESTAMP |

### 3. `tasks` (Tugasan Projek Kanban)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | |
| `project_id` | INT NOT NULL (FK) | Rujuk `projects.id` |
| `title` | VARCHAR(200) NOT NULL | Nama tugas |
| `status` | ENUM('pending', 'in_progress', 'completed')| Status tugasan |
| `priority` | ENUM('Sederhana', 'Tinggi', 'Segera') | Keutamaan |
| `assignee_id` | INT NULL (FK) | Rujuk `users.id` (pegawai ditugaskan) |
| `due_date` | DATE | Tarikh akhir tugasan |
| `created_at` | TIMESTAMP | |

### 4. `finances` (Rekod Kewangan)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | |
| `project_id` | INT NOT NULL (FK) | Rujuk `projects.id` |
| `invoice_no` | VARCHAR(50) | Nombor rujukan invois/baucar |
| `description` | VARCHAR(255) | Keterangan perbelanjaan |
| `vendor` | VARCHAR(150) | Penerima bayaran |
| `amount` | DECIMAL(15,2) NOT NULL | Jumlah bayaran |
| `status` | ENUM('Selesai', 'Menunggu Kelulusan', 'Ditolak')| |
| `date` | DATE | Tarikh transaksi |
| `type` | VARCHAR(50) | 'Invois' / 'Denda' |
| `milestone_id` | INT NULL | Pautan ke fasa dalam jadual bayaran projek |
| `created_at` | TIMESTAMP | |

### 5. `documents` (Repositori Fail DMS)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | |
| `project_id` | INT NOT NULL (FK) | Rujuk `projects.id` |
| `file_name` | VARCHAR(255) NOT NULL | Nama dokumen asal |
| `file_path` | VARCHAR(255) NOT NULL | Laluan fail dalam pelayan |
| `category` | VARCHAR(100) | Cth: Dokumen Kontrak |
| `uploader_id`| INT NOT NULL (FK) | Rujuk `users.id` |
| `file_size` | INT | Saiz dokumen (bytes) |
| `created_at` | TIMESTAMP | |

### 6. `audit_logs` (Jejak Audit)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | |
| `user_id` | INT NULL (FK) | Rujuk `users.id` (Boleh null jika gagal login) |
| `action` | VARCHAR(50) NOT NULL | CREATE, UPDATE, DELETE, LOGIN |
| `module` | VARCHAR(50) NOT NULL | Nama modul terlibat |
| `details` | TEXT | Butiran operasi |
| `ip_address` | VARCHAR(45) | IP Pengguna |
| `created_at` | TIMESTAMP | |

### 7. `smtp_settings` (Konfigurasi Pelayan E-mel)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT PRIMARY KEY DEFAULT 1 | ID singleton rekod konfigurasi |
| `smtp_host` | VARCHAR(255) NOT NULL | Pelayan SMTP (cth: `smtp.kehakiman.gov.my`) |
| `smtp_port` | INT NOT NULL DEFAULT 587 | Port SMTP (587, 465, 25) |
| `smtp_encryption` | ENUM('tls', 'ssl', 'none') DEFAULT 'tls' | Kaedah enkripsi |
| `smtp_user` | VARCHAR(150) NULL | ID / Pengguna akaun SMTP |
| `smtp_pass` | VARCHAR(255) NULL | Kata laluan SMTP |
| `from_email` | VARCHAR(150) NOT NULL | E-mel pengirim rasmi |
| `from_name` | VARCHAR(100) NOT NULL | Nama paparan pengirim rasmi |
| `is_active` | TINYINT(1) DEFAULT 1 | Suis status aktif e-mel sistem |
| `notify_on_risk` | TINYINT(1) DEFAULT 1 | Notifikasi e-mel bagi projek berisiko |
| `notify_on_overdue_task` | TINYINT(1) DEFAULT 1 | Notifikasi e-mel bagi tugasan lewat |
| `notify_on_payment_due` | TINYINT(1) DEFAULT 1 | Notifikasi e-mel bagi bayaran tertunggak/hampir matang |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### 8. `notifications` (Notifikasi Pintar Auto-Alert)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | ID unik rekod notifikasi |
| `user_id` | INT NULL (FK) | Penerima notifikasi (NULL jika untuk semua/pentadbir) |
| `project_id` | INT NULL (FK) | Rujuk `projects.id` |
| `type` | ENUM('danger', 'warning', 'info', 'success') | Tahap amaran notifikasi |
| `category` | VARCHAR(50) NOT NULL | 'project_risk', 'payment_due', 'task_overdue', 'audit_security' |
| `title` | VARCHAR(200) NOT NULL | Tajuk notifikasi |
| `message` | TEXT NOT NULL | Keterangan amaran terperinci |
| `link_view` | VARCHAR(100) NULL | Paparan sasaran navigasi (cth: 'project_detail') |
| `is_read` | TINYINT(1) DEFAULT 0 | 0: Belum baca, 1: Telah dibaca |
| `email_sent` | TINYINT(1) DEFAULT 0 | Status penghantaran emel |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Changelog

| Tarikh | Perubahan | Oleh |
|--------|-----------|------|
| 20 Mei 2026 | Penciptaan schema pangkalan data awal (6 jadual) | Antigravity AI |
| 20 Mei 2026 | Integrasi API & UI Modul Kewangan (`finances`) sepenuhnya | Antigravity AI |
| 17 Sep 2026 | Tambah lajur `milestone_id` dalam `finances` untuk menghubungkan tuntutan dengan Jadual Bayaran Projek | Antigravity AI |
| 17 Sep 2026 | Tambah jadual `smtp_settings` dan `notifications` untuk modul Sistem Notifikasi Pintar (Auto-Alert) & Konfigurasi E-mel SMTP | Antigravity AI |
