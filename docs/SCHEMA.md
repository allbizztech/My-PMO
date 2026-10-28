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

### 9. `calendar_events` (Acara & Mesyuarat Kalendar Projek)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | ID unik rekod acara kalendar |
| `project_id` | INT NULL (FK) | Rujuk `projects.id` (pilihan) |
| `title` | VARCHAR(255) NOT NULL | Tajuk acara / mesyuarat |
| `event_date` | DATE NOT NULL | Tarikh acara berlangsung |
| `start_time` | TIME DEFAULT '09:00:00' | Masa mula mesyuarat |
| `end_time` | TIME DEFAULT '10:00:00' | Masa tamat mesyuarat |
| `event_type` | ENUM('meeting', 'milestone', 'deadline', 'task', 'review') | Jenis kategori acara kalendar |
| `location` | VARCHAR(255) NULL | Lokasi fizikal bilik mesyuarat / dewan |
| `meeting_link` | VARCHAR(500) NULL | Pautan mesyuarat maya (Microsoft Teams, Webex, Meet) |
| `description` | TEXT NULL | Butiran tambahan acara |
| `agenda` | TEXT NULL | Senarai butiran agenda mesyuarat berstruktur |
| `attendees` | TEXT NULL | Senarai emel peserta jemputan (format JSON) |
| `cc_emails` | TEXT NULL | Senarai emel penerima salinan (CC) format JSON / teks |
| `bcc_emails` | TEXT NULL | Senarai emel salinan tersembunyi (BCC) format JSON / teks |
| `template_id` | INT NULL (FK) | Rujukan templat emel daripada `email_templates.id` |
| `invite_status` | ENUM('draft', 'sent') DEFAULT 'draft' | Status jemputan e-mel kalendar Outlook |
| `created_by` | INT NULL (FK) | Rujuk `users.id` (pegawai yang mendaftar) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### 10. `procurement_checklists` (Induk Senarai Semak Perolehan ICT PKPMP)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | ID unik senarai semak |
| `project_id` | INT NOT NULL UNIQUE (FK) | Rujukan projek `projects.id` |
| `procurement_method` | ENUM('direct_purchase', 'quotation', 'tender') | Kaedah perolehan mengikut had nilai |
| `estimated_value` | DECIMAL(15,2) DEFAULT 0.00 | Nilai anggaran perolehan (RM) |
| `requires_contract` | TINYINT(1) DEFAULT 0 | 1 jika tempoh perolehan melebihi 4 bulan |
| `contract_period_months` | INT DEFAULT 0 | Tempoh kontrak dalam bulan |
| `status` | ENUM('draft', 'in_progress', 'completed') | Status pematuhan senarai semak |
| `completed_items` | INT DEFAULT 0 | Bilangan item dokumen selesai |
| `total_items` | INT DEFAULT 0 | Jumlah item dokumen yang perlu disemak |
| `notes` | TEXT NULL | Catatan keseluruhan perolehan |
| `created_by` | INT NULL | Pegawai PMO pencipta |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

### 11. `procurement_checklist_items` (Item 8 Fasa Semakan Dokumen)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | ID unik item semakan |
| `checklist_id` | INT NOT NULL (FK) | Rujukan `procurement_checklists.id` |
| `phase_number` | INT NOT NULL | Nombor fasa SOP PKPMP (1 hingga 8) |
| `phase_name` | VARCHAR(150) NOT NULL | Nama fasa (cth: Kelulusan Teknikal JPICT, Lampiran J, dll) |
| `item_code` | VARCHAR(50) NOT NULL | Kod item semakan (cth: 'F1-01', 'F2-01') |
| `item_title` | VARCHAR(255) NOT NULL | Tajuk dokumen/keperluan semakan |
| `description` | TEXT NULL | Panduan atau keperluan dokumen |
| `is_mandatory` | TINYINT(1) DEFAULT 1 | 1: Wajib, 0: Pilihan / Bersyarat |
| `is_checked` | TINYINT(1) DEFAULT 0 | 1: Disahkan selesai, 0: Belum |
| `checked_by` | VARCHAR(100) NULL | Nama pegawai yang membuat semakan |
| `checked_at` | DATETIME NULL | Tarikh & masa semakan disahkan |
| `document_id` | INT NULL (FK) | Pautan ke fail fail fizikal dalam `documents.id` (DMS) |
| `reference_no` | VARCHAR(100) NULL | No. Rujukan Surat / Minit / Kelulusan |
| `status` | ENUM('pending', 'submitted', 'verified', 'not_applicable') | Status item dokumen |
| `remarks` | TEXT NULL | Catatan pegawai semakan |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

### 12. `email_templates` (Templat Jemputan E-mel Dinamik)
| Column | Type | Keterangan |
|--------|------|------------|
| `id` | INT AUTO_INCREMENT PK | ID unik templat e-mel |
| `name` | VARCHAR(150) NOT NULL | Nama rujukan templat (cth: Jemputan Mesyuarat Pemandu ICT) |
| `category` | VARCHAR(50) DEFAULT 'meeting' | Kategori templat (`meeting`, `review`, `general`) |
| `subject` | VARCHAR(255) NOT NULL | Format subjek e-mel dengan pembolehubah |
| `body` | TEXT NOT NULL | Kandungan e-mel rasmi dengan pembolehubah `{TAJUK_MESYUARAT}`, `{TARIKH}`, `{MASA}`, `{LOKASI}`, `{AGENDA}`, dll |
| `is_default` | TINYINT(1) DEFAULT 0 | 1 jika templat piawai sistem |
| `created_by` | INT NULL (FK) | Rujuk `users.id` (pentadbir pencipta templat) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

---

## Changelog

| Tarikh | Perubahan | Oleh |
|--------|-----------|------|
| 20 Mei 2026 | Penciptaan schema pangkalan data awal (6 jadual) | Antigravity AI |
| 20 Mei 2026 | Integrasi API & UI Modul Kewangan (`finances`) sepenuhnya | Antigravity AI |
| 17 Sep 2026 | Tambah lajur `milestone_id` dalam `finances` untuk menghubungkan tuntutan dengan Jadual Bayaran Projek | Antigravity AI |
| 17 Sep 2026 | Tambah jadual `smtp_settings` dan `notifications` untuk modul Sistem Notifikasi Pintar (Auto-Alert) & Konfigurasi E-mel SMTP | Antigravity AI |
| 17 Sep 2026 | Tambah jadual `calendar_events` untuk sokongan modul Kalendar Projek Bersepadu Dinamik | Antigravity AI |
| 17 Sep 2026 | Tambah jadual `procurement_checklists` dan `procurement_checklist_items` bagi Modul Senarai Semak Perolehan ICT PKPMP | Antigravity AI |
| 19 Sep 2026 | Tambah lajur masa (`start_time`, `end_time`), lokasi (`location`), pautan mesyuarat (`meeting_link`), agenda (`agenda`), senarai peserta (`attendees`), dan status jemputan (`invite_status`) dalam `calendar_events` untuk sokongan jemputan mesyuarat & integrasi Outlook | Antigravity AI |
| 19 Sep 2026 | Tambah jadual `email_templates` bagi pengurusan templat jemputan e-mel dinamik serta lajur `cc_emails`, `bcc_emails`, dan `template_id` dalam `calendar_events` | Antigravity AI |

