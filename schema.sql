-- schema.sql
-- Pangkalan Data: my_pmo_db (Pejabat Ketua Pendaftar Mahkamah Persekutuan - PKPMP)

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `agency` VARCHAR(100) DEFAULT 'PKPMP',
  `status` ENUM('Aktif', 'Tidak Aktif') DEFAULT 'Aktif',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_code` VARCHAR(20) UNIQUE,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `agency` VARCHAR(100) NOT NULL DEFAULT 'PKPMP',
  `division` VARCHAR(150) DEFAULT 'Bahagian Teknologi Maklumat (BTM)',
  `status` ENUM('Aktif', 'Lewat', 'Tertunda', 'Selesai') DEFAULT 'Aktif',
  `progress` INT DEFAULT 0,
  `health` ENUM('Cemerlang', 'Baik', 'Amaran', 'Berisiko') DEFAULT 'Baik',
  `manager_id` INT DEFAULT NULL,
  `vendor` VARCHAR(150),
  `vendor_manager` VARCHAR(150),
  `start_date` DATE,
  `end_date` DATE,
  `budget` DECIMAL(15,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `status` ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  `priority` ENUM('Sederhana', 'Tinggi', 'Segera') DEFAULT 'Sederhana',
  `assignee_id` INT DEFAULT NULL,
  `due_date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `finances` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `invoice_no` VARCHAR(50),
  `description` VARCHAR(255),
  `vendor` VARCHAR(150),
  `amount` DECIMAL(15,2) NOT NULL,
  `status` ENUM('Selesai', 'Menunggu Kelulusan', 'Ditolak') DEFAULT 'Menunggu Kelulusan',
  `date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `uploader_id` INT NOT NULL,
  `file_size` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`uploader_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gantt_tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `planned_start` DATE NOT NULL,
  `planned_end` DATE NOT NULL,
  `actual_start` DATE DEFAULT NULL,
  `actual_end` DATE DEFAULT NULL,
  `progress` INT DEFAULT 0,
  `status` ENUM('Belum Mula', 'Sedang Berjalan', 'Selesai', 'Tertunda') DEFAULT 'Belum Mula',
  `is_milestone` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `action` VARCHAR(50) NOT NULL,
  `module` VARCHAR(50) NOT NULL,
  `details` TEXT,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `backup_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `frequency` ENUM('off', 'daily', 'weekly', 'monthly', 'yearly') DEFAULT 'off',
  `scope` ENUM('both', 'db', 'files') DEFAULT 'both',
  `last_backup_at` DATETIME DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `backup_settings` (`id`, `frequency`, `scope`) VALUES (1, 'off', 'both');

CREATE TABLE IF NOT EXISTS `backup_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `filepath` VARCHAR(255) NOT NULL,
  `filesize` BIGINT DEFAULT 0,
  `type` ENUM('manual', 'auto') DEFAULT 'manual',
  `frequency_label` VARCHAR(50) DEFAULT 'Manual',
  `created_by` VARCHAR(100) DEFAULT 'Admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `smtp_settings` (
  `id` INT PRIMARY KEY DEFAULT 1,
  `smtp_host` VARCHAR(255) NOT NULL DEFAULT 'smtp.kehakiman.gov.my',
  `smtp_port` INT NOT NULL DEFAULT 587,
  `smtp_encryption` ENUM('tls', 'ssl', 'none') DEFAULT 'tls',
  `smtp_user` VARCHAR(150) DEFAULT 'pmo@kehakiman.gov.my',
  `smtp_pass` VARCHAR(255) DEFAULT '',
  `from_email` VARCHAR(150) NOT NULL DEFAULT 'noreply-mypmo@kehakiman.gov.my',
  `from_name` VARCHAR(100) NOT NULL DEFAULT 'Sistem MY-PMO PKPMP',
  `is_active` TINYINT(1) DEFAULT 1,
  `notify_on_risk` TINYINT(1) DEFAULT 1,
  `notify_on_overdue_task` TINYINT(1) DEFAULT 1,
  `notify_on_payment_due` TINYINT(1) DEFAULT 1,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `smtp_settings` (`id`, `smtp_host`, `smtp_port`, `smtp_encryption`, `smtp_user`, `from_email`, `from_name`, `is_active`) 
VALUES (1, 'smtp.kehakiman.gov.my', 587, 'tls', 'pmo@kehakiman.gov.my', 'noreply-mypmo@kehakiman.gov.my', 'Sistem MY-PMO PKPMP', 1);

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `project_id` INT DEFAULT NULL,
  `type` ENUM('danger', 'warning', 'info', 'success') DEFAULT 'info',
  `category` VARCHAR(50) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `link_view` VARCHAR(100) DEFAULT 'dashboard',
  `is_read` TINYINT(1) DEFAULT 0,
  `email_sent` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `calendar_events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `event_date` DATE NOT NULL,
  `event_type` ENUM('meeting', 'milestone', 'deadline', 'task', 'review') DEFAULT 'meeting',
  `description` TEXT DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `calendar_events` (`id`, `project_id`, `title`, `event_date`, `event_type`, `description`) VALUES
(1, 1, 'Mesyuarat Lembaga PMO PKPMP Bil. 2/2026', '2026-09-22', 'meeting', 'Bilik Mesyuarat Utama Istana Kehakiman, Putrajaya'),
(2, 1, 'Sesi Semakan Bajet & Kontrak ICT', '2026-09-28', 'review', 'Penyelarasan bersama Unit Kewangan & BTM PKPMP');

-- SEED DATA (PKPMP Exclusively)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `agency`) VALUES
(1, 'Datuk Dr. Azman', 'admin@kehakiman.gov.my', '$2y$10$LNWzN8f6h4h3yTEL.r8lZ.51PrMWcnEyYt7GUM2Nd9l/t3XEQe2ZC', 'superadmin', 'PKPMP'),
(2, 'Ahmad Faiz', 'faiz@kehakiman.gov.my', '$2y$10$LNWzN8f6h4h3yTEL.r8lZ.51PrMWcnEyYt7GUM2Nd9l/t3XEQe2ZC', 'pmo_gov', 'PKPMP'),
-- PROCURMENT CHECKLIST TABLES (SOP SENARAI SEMAK PEROLEHAN ICT PKPMP)
CREATE TABLE IF NOT EXISTS `procurement_checklists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL UNIQUE,
  `procurement_method` ENUM('direct_purchase', 'quotation', 'tender') NOT NULL DEFAULT 'quotation',
  `estimated_value` DECIMAL(15,2) DEFAULT 0.00,
  `requires_contract` TINYINT(1) DEFAULT 0 COMMENT '1 jika tempoh melebihi 4 bulan',
  `contract_period_months` INT DEFAULT 0,
  `status` ENUM('draft', 'in_progress', 'completed') DEFAULT 'in_progress',
  `completed_items` INT DEFAULT 0,
  `total_items` INT DEFAULT 0,
  `notes` TEXT NULL,
  `created_by` INT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_checklist_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `procurement_checklist_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `checklist_id` INT NOT NULL,
  `phase_number` INT NOT NULL,
  `phase_name` VARCHAR(150) NOT NULL,
  `item_code` VARCHAR(50) NOT NULL,
  `item_title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `is_mandatory` TINYINT(1) DEFAULT 1,
  `is_checked` TINYINT(1) DEFAULT 0,
  `checked_by` VARCHAR(100) NULL,
  `checked_at` DATETIME NULL,
  `document_id` INT NULL COMMENT 'Pautan ke fail documents.id (DMS)',
  `reference_no` VARCHAR(100) NULL COMMENT 'No. Rujukan Surat / Minit / Kelulusan',
  `status` ENUM('pending', 'submitted', 'verified', 'not_applicable') DEFAULT 'pending',
  `remarks` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_checklist_items_parent` FOREIGN KEY (`checklist_id`) REFERENCES `procurement_checklists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_checklist_item_doc` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




