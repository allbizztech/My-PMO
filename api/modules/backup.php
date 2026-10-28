<?php
// api/modules/backup.php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$backupDir = __DIR__ . '/../../backups/';
$uploadDir = __DIR__ . '/../uploads/';

// Ensure backups directory exists
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0777, true);
}

// Auto-create required database tables if missing
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `backup_settings` (
          `id` INT PRIMARY KEY DEFAULT 1,
          `frequency` ENUM('off', 'daily', 'weekly', 'monthly', 'yearly') DEFAULT 'off',
          `scope` ENUM('both', 'db', 'files') DEFAULT 'both',
          `last_backup_at` DATETIME DEFAULT NULL,
          `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $pdo->exec("
        INSERT IGNORE INTO `backup_settings` (`id`, `frequency`, `scope`) VALUES (1, 'off', 'both');
    ");

    $pdo->exec("
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
    ");
} catch (\PDOException $e) {
    // Ignore schema auto-creation errors if table exists
}

/**
 * Helper: Export database structure & data to SQL string
 */
function dumpDatabaseSql($pdo)
{
    $sql = "-- ========================================================\n";
    $sql .= "-- MY-PMO Database Export Backup\n";
    $sql .= "-- Generated at: " . date('Y-m-d H:i:s') . "\n";
    $sql .= "-- ========================================================\n\n";
    $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

    $tablesStmt = $pdo->query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
    $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($tables as $rawTable) {
        // Pengesahan ketat identifier SQL (SAST Compliance & Whitelist)
        // Hanya membenarkan jadual yang mematuhi format alfanumerik selamat
        if (!preg_match('/^[a-zA-Z0-9_]+$/', (string)$rawTable)) {
            continue;
        }
        $table = preg_replace('/[^a-zA-Z0-9_]/', '', (string)$rawTable);

        // Table structure
        $createStmt = $pdo->query("SHOW CREATE TABLE `{$table}`")->fetch(PDO::FETCH_ASSOC);
        $createSql = $createStmt['Create Table'] ?? '';

        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- Structure for table `{$table}` \n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `{$table}`;\n";
        $sql .= $createSql . ";\n\n";

        // Table data
        $rowsStmt = $pdo->query("SELECT * FROM `{$table}`");
        $rows = $rowsStmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($rows) > 0) {
            $sql .= "-- Data for table `{$table}` \n";
            foreach ($rows as $row) {
                $cols = array_keys($row);
                $escapedCols = [];
                foreach ($cols as $c) {
                    $cleanCol = preg_replace('/[^a-zA-Z0-9_]/', '', (string)$c);
                    $escapedCols[] = "`" . $cleanCol . "`";
                }

                $escapedValues = [];
                foreach (array_values($row) as $v) {
                    if ($v === null) {
                        $escapedValues[] = 'NULL';
                    } else {
                        $escapedValues[] = $pdo->quote((string)$v);
                    }
                }

                $sql .= "INSERT INTO `{$table}` (" . implode(', ', $escapedCols) . ") VALUES (" . implode(', ', $escapedValues) . ");\n";
            }
            $sql .= "\n";
        }
    }

    $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";
    return $sql;
}

/**
 * Helper: Create Backup Archive (SQL Dump + Upload Files)
 */
function createBackupArchive($pdo, $backupDir, $uploadDir, $type = 'manual', $label = 'Manual', $createdBy = 'Admin')
{
    $timestamp = date('Y-m-d_H-i-s');
    $zipFilename = "backup_mypmo_" . $timestamp . ".zip";
    $zipPath = $backupDir . $zipFilename;

    $zip = new ZipArchive();
    if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
        return ["status" => "error", "message" => "Gagal mencipta fail ZIP sandaran pelayan."];
    }

    // 1. Add SQL Dump to Zip
    $sqlDump = dumpDatabaseSql($pdo);
    $zip->addFromString("database_backup.sql", $sqlDump);

    // 2. Add Manifest JSON to Zip
    $manifest = [
        "app" => "MY-PMO",
        "timestamp" => date('Y-m-d H:i:s'),
        "type" => $type,
        "label" => $label,
        "created_by" => $createdBy,
        "database" => "my_pmo_db"
    ];
    $zip->addFromString("manifest.json", json_encode($manifest, JSON_PRETTY_PRINT));

    // 3. Add Uploaded Files to Zip organized by Project Folders & Original Readable Filenames
    $docMap = [];
    try {
        $docStmt = $pdo->query("
            SELECT 
                d.file_name, 
                d.file_path, 
                p.id AS project_id, 
                p.project_code, 
                p.name AS project_name 
            FROM documents d 
            LEFT JOIN projects p ON d.project_id = p.id
        ");
        $docRows = $docStmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($docRows as $docRow) {
            if (!empty($docRow['file_path']) && !empty($docRow['file_name'])) {
                $cleanKey = basename($docRow['file_path']);

                // Construct clean project subfolder name
                $projCode = trim($docRow['project_code'] ?? '');
                $projName = trim($docRow['project_name'] ?? '');

                if (!empty($projCode) && !empty($projName)) {
                    $folder = $projCode . ' - ' . $projName;
                } else if (!empty($projName)) {
                    $folder = $projName;
                } else if (!empty($projCode)) {
                    $folder = $projCode;
                } else {
                    $folder = 'Fail Tanpa Projek';
                }

                // Sanitize folder name for filesystem / ZIP compatibility
                $cleanFolder = preg_replace('/[\/\\\\:\*\?"<>\|]/', '_', $folder);
                $cleanFolder = trim(preg_replace('/\s+/', ' ', $cleanFolder));

                $docMap[$cleanKey] = [
                    'folder' => $cleanFolder,
                    'file_name' => basename($docRow['file_name'])
                ];
            }
        }
    } catch (\Exception $e) {
        // Fallback to empty map if query fails
    }

    if (is_dir($uploadDir)) {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($uploadDir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        $usedZipPaths = [];

        foreach ($files as $name => $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $diskFilename = basename($filePath);

                if (isset($docMap[$diskFilename])) {
                    $folder = $docMap[$diskFilename]['folder'];
                    $targetName = $docMap[$diskFilename]['file_name'];
                } else {
                    $folder = 'Fail Umum';
                    $targetName = $diskFilename;
                }

                // Build unique path inside ZIP under uploads/<Project Folder>/<Original Filename>
                $counter = 1;
                $pathInfo = pathinfo($targetName);
                $filenameOnly = $pathInfo['filename'] ?? $targetName;
                $ext = isset($pathInfo['extension']) && $pathInfo['extension'] !== '' ? '.' . $pathInfo['extension'] : '';

                $uniqueZipName = $targetName;
                $zipSubPath = 'uploads/' . $folder . '/' . $uniqueZipName;

                while (isset($usedZipPaths[strtolower($zipSubPath)])) {
                    $uniqueZipName = $filenameOnly . " ($counter)" . $ext;
                    $zipSubPath = 'uploads/' . $folder . '/' . $uniqueZipName;
                    $counter++;
                }

                $usedZipPaths[strtolower($zipSubPath)] = true;
                $zip->addFile($filePath, $zipSubPath);
            }
        }
    }

    // 4. Add System Source Code Files to Zip (system_files/)
    $rootDir = realpath(__DIR__ . '/../../');
    if ($rootDir && is_dir($rootDir)) {
        $systemFiles = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($rootDir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        $excludePatterns = [
            'node_modules',
            'dist',
            '.git',
            'backups',
            'api/uploads',
            'api\\uploads'
        ];

        foreach ($systemFiles as $name => $file) {
            if (!$file->isDir()) {
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($rootDir) + 1);
                $normalizedPath = str_replace('\\', '/', $relativePath);

                $shouldExclude = false;
                foreach ($excludePatterns as $pattern) {
                    if (strpos($normalizedPath, $pattern) !== false) {
                        $shouldExclude = true;
                        break;
                    }
                }

                if (!$shouldExclude) {
                    $zipSubPath = 'My-PMO/' . $normalizedPath;
                    $zip->addFile($filePath, $zipSubPath);
                }
            }
        }
    }

    $zip->close();

    $filesize = file_exists($zipPath) ? filesize($zipPath) : 0;

    // Log in Database
    $stmt = $pdo->prepare("INSERT INTO backup_logs (filename, filepath, filesize, type, frequency_label, created_by) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$zipFilename, $zipFilename, $filesize, $type, $label, $createdBy]);
    $newId = $pdo->lastInsertId();

    // Update last_backup_at in backup_settings
    $pdo->exec("UPDATE backup_settings SET last_backup_at = NOW() WHERE id = 1");

    // Log Audit
    $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (1, 'CREATE', 'Backup', ?, ?)");
    $auditStmt->execute(["Fail sandaran dicipta: " . $zipFilename . " (" . round($filesize / 1024 / 1024, 2) . " MB)", $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);

    return [
        "status" => "success",
        "message" => "Sandaran sistem berjaya dihasilkan!",
        "data" => [
            "id" => $newId,
            "filename" => $zipFilename,
            "filesize" => $filesize,
            "type" => $type,
            "label" => $label,
            "created_at" => date('Y-m-d H:i:s')
        ]
    ];
}

/**
 * Helper: Check & Run Scheduled Auto Backup if due
 */
function checkAutoBackup($pdo, $backupDir, $uploadDir)
{
    try {
        $stmt = $pdo->query("SELECT * FROM backup_settings WHERE id = 1");
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$settings || $settings['frequency'] === 'off') {
            return;
        }

        $freq = $settings['frequency'];
        $lastBackup = $settings['last_backup_at'];
        $now = time();
        $shouldRun = false;

        if (!$lastBackup) {
            $shouldRun = true;
        } else {
            $lastTime = strtotime($lastBackup);
            $diffSeconds = $now - $lastTime;

            switch ($freq) {
                case 'daily':
                    if ($diffSeconds >= 86400)
                        $shouldRun = true;
                    break;
                case 'weekly':
                    if ($diffSeconds >= 604800)
                        $shouldRun = true;
                    break;
                case 'monthly':
                    if ($diffSeconds >= 2592000)
                        $shouldRun = true;
                    break;
                case 'yearly':
                    if ($diffSeconds >= 31536000)
                        $shouldRun = true;
                    break;
            }
        }

        if ($shouldRun) {
            $labels = [
                'daily' => 'Auto (Harian)',
                'weekly' => 'Auto (Mingguan)',
                'monthly' => 'Auto (Bulanan)',
                'yearly' => 'Auto (Tahunan)'
            ];
            $label = $labels[$freq] ?? 'Auto Scheduled';
            createBackupArchive($pdo, $backupDir, $uploadDir, 'auto', $label, 'Sistem Auto-Backup');
        }
    } catch (\Exception $e) {
        // Silently skip on background auto-check errors
    }
}

// Automatically trigger auto-backup check on any request
checkAutoBackup($pdo, $backupDir, $uploadDir);

// =========================================================================
// ROUTING HANDLERS
// =========================================================================

// Handle Download
if (isset($_GET['action']) && $_GET['action'] === 'download') {
    $file = $_GET['file'] ?? '';
    $cleanFile = basename($file);
    $filePath = $backupDir . $cleanFile;

    if (!empty($cleanFile) && file_exists($filePath)) {
        header('Content-Description: File Transfer');
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename="' . $cleanFile . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Fail sandaran tidak ditemui."]);
        exit;
    }
}

// Handle GET requests
if ($method === 'GET') {
    $action = $_GET['action'] ?? 'list_backups';

    if ($action === 'get_settings') {
        $stmt = $pdo->query("SELECT * FROM backup_settings WHERE id = 1");
        $settings = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $settings]);
        exit;
    }

    if ($action === 'list_backups') {
        // Sync physical files with backup_logs database table
        $logsStmt = $pdo->query("SELECT * FROM backup_logs ORDER BY created_at DESC");
        $logs = $logsStmt->fetchAll(PDO::FETCH_ASSOC);

        // Also check if any physical zip files exist in folder not in DB
        $physicalFiles = glob($backupDir . '*.zip');
        $existingFileNames = array_column($logs, 'filename');

        foreach ($physicalFiles as $file) {
            $fname = basename($file);
            if (!in_array($fname, $existingFileNames)) {
                $fsize = filesize($file);
                $ftime = date('Y-m-d H:i:s', filemtime($file));
                $stmt = $pdo->prepare("INSERT INTO backup_logs (filename, filepath, filesize, type, frequency_label, created_by, created_at) VALUES (?, ?, ?, 'manual', 'Manual', 'Admin System', ?)");
                $stmt->execute([$fname, $fname, $fsize, $ftime]);
            }
        }

        // Re-fetch clean list
        $logsStmt = $pdo->query("SELECT * FROM backup_logs ORDER BY created_at DESC");
        $logs = $logsStmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate total database size and upload storage size
        $dbSizeStmt = $pdo->prepare("SELECT SUM(data_length + index_length) AS db_size FROM information_schema.TABLES WHERE table_schema = ?");
        $dbSizeStmt->execute([$db]);
        $dbSizeRow = $dbSizeStmt->fetch(PDO::FETCH_ASSOC);
        $totalDbSize = $dbSizeRow['db_size'] ?? 0;

        $totalUploadsSize = 0;
        if (is_dir($uploadDir)) {
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($uploadDir, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
                $totalUploadsSize += $file->getSize();
            }
        }

        $settingsStmt = $pdo->query("SELECT * FROM backup_settings WHERE id = 1");
        $settings = $settingsStmt->fetch(PDO::FETCH_ASSOC);

        $totalBackupsSize = 0;
        foreach ($logs as $l) {
            $totalBackupsSize += (int)($l['filesize'] ?? 0);
        }

        echo json_encode([
            "status" => "success",
            "data" => [
                "logs" => $logs,
                "settings" => $settings,
                "stats" => [
                    "db_size" => (int)$totalDbSize,
                    "uploads_size" => (int)$totalUploadsSize,
                    "backups_size" => (int)$totalBackupsSize,
                    "total_backups" => count($logs)
                ]
            ]
        ]);
        exit;
    }
}

// Handle POST requests
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? $_POST['action'] ?? '';

    if ($action === 'update_settings') {
        $frequency = $input['frequency'] ?? 'off';
        $scope = $input['scope'] ?? 'both';

        $allowedFreqs = ['off', 'daily', 'weekly', 'monthly', 'yearly'];
        if (!in_array($frequency, $allowedFreqs)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Pilihan frekuensi tidak sah."]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE backup_settings SET frequency = ?, scope = ? WHERE id = 1");
        $stmt->execute([$frequency, $scope]);

        // Audit Log
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (1, 'UPDATE', 'Backup', ?, ?)");
        $auditStmt->execute(["Tetapan automatik sandaran ditukar: Frekuensi = " . $frequency, $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);

        // Immediately check if auto backup is due under new settings
        checkAutoBackup($pdo, $backupDir, $uploadDir);

        echo json_encode(["status" => "success", "message" => "Tetapan automatik sandaran berjaya dikemas kini!"]);
        exit;
    }

    if ($action === 'create_backup') {
        $createdBy = $input['created_by'] ?? 'Admin';
        $result = createBackupArchive($pdo, $backupDir, $uploadDir, 'manual', 'Manual', $createdBy);
        echo json_encode($result);
        exit;
    }
}

// Handle DELETE requests
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID fail sandaran diperlukan."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT filename FROM backup_logs WHERE id = ?");
        $stmt->execute([$id]);
        $log = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($log) {
            $filePath = $backupDir . $log['filename'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            $deleteStmt = $pdo->prepare("DELETE FROM backup_logs WHERE id = ?");
            $deleteStmt->execute([$id]);

            // Audit log
            $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (1, 'DELETE', 'Backup', ?, ?)");
            $auditStmt->execute(["Fail sandaran dipadam: " . $log['filename'], $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);

            echo json_encode(["status" => "success", "message" => "Fail sandaran berjaya dipadam."]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Rekod sandaran tidak ditemui."]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
?>