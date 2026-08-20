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

---

## Changelog

| Tarikh | Perubahan | Oleh |
|--------|-----------|------|
| 20 Mei 2026 | Penciptaan schema pangkalan data awal (6 jadual) | Antigravity AI |
| 20 Mei 2026 | Integrasi API & UI Modul Kewangan (`finances`) sepenuhnya | Antigravity AI |
