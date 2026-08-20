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

-- SEED DATA (PKPMP Exclusively)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `agency`) VALUES
(1, 'Datuk Dr. Azman', 'admin@kehakiman.gov.my', '$2y$10$LNWzN8f6h4h3yTEL.r8lZ.51PrMWcnEyYt7GUM2Nd9l/t3XEQe2ZC', 'superadmin', 'PKPMP'),
(2, 'Ahmad Faiz', 'faiz@kehakiman.gov.my', '$2y$10$LNWzN8f6h4h3yTEL.r8lZ.51PrMWcnEyYt7GUM2Nd9l/t3XEQe2ZC', 'pmo_gov', 'PKPMP'),
(3, 'Sarah Lee', 'sarah@kehakiman.gov.my', '$2y$10$LNWzN8f6h4h3yTEL.r8lZ.51PrMWcnEyYt7GUM2Nd9l/t3XEQe2ZC', 'admin_agency', 'PKPMP');


