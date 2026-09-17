<?php
// api/modules/smtp_settings.php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper function to log audit
function recordAudit($pdo, $userId, $action, $module, $details) {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $action, $module, $details, $ip]);
    } catch (\Exception $e) {
        // Ignore audit failure to not block operation
    }
}

// Ensure table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS smtp_settings (
        id INT PRIMARY KEY DEFAULT 1,
        smtp_host VARCHAR(255) NOT NULL DEFAULT 'smtp.kehakiman.gov.my',
        smtp_port INT NOT NULL DEFAULT 587,
        smtp_encryption ENUM('tls', 'ssl', 'none') DEFAULT 'tls',
        smtp_user VARCHAR(150) DEFAULT 'pmo@kehakiman.gov.my',
        smtp_pass VARCHAR(255) DEFAULT '',
        from_email VARCHAR(150) NOT NULL DEFAULT 'noreply-mypmo@kehakiman.gov.my',
        from_name VARCHAR(100) NOT NULL DEFAULT 'Sistem MY-PMO PKPMP',
        is_active TINYINT(1) DEFAULT 1,
        notify_on_risk TINYINT(1) DEFAULT 1,
        notify_on_overdue_task TINYINT(1) DEFAULT 1,
        notify_on_payment_due TINYINT(1) DEFAULT 1,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $check = $pdo->query("SELECT COUNT(*) FROM smtp_settings WHERE id = 1")->fetchColumn();
    if ($check == 0) {
        $pdo->exec("INSERT INTO smtp_settings (id, smtp_host, smtp_port, smtp_encryption, smtp_user, from_email, from_name, is_active) 
                    VALUES (1, 'smtp.kehakiman.gov.my', 587, 'tls', 'pmo@kehakiman.gov.my', 'noreply-mypmo@kehakiman.gov.my', 'Sistem MY-PMO PKPMP', 1)");
    }
} catch (\Exception $e) {
    // Table ready
}

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM smtp_settings WHERE id = 1 LIMIT 1");
        $settings = $stmt->fetch();

        if (!$settings) {
            $settings = [
                'id' => 1,
                'smtp_host' => 'smtp.kehakiman.gov.my',
                'smtp_port' => 587,
                'smtp_encryption' => 'tls',
                'smtp_user' => 'pmo@kehakiman.gov.my',
                'smtp_pass' => '',
                'from_email' => 'noreply-mypmo@kehakiman.gov.my',
                'from_name' => 'Sistem MY-PMO PKPMP',
                'is_active' => 1,
                'notify_on_risk' => 1,
                'notify_on_overdue_task' => 1,
                'notify_on_payment_due' => 1
            ];
        }

        // Mask password for security
        $hasPassword = !empty($settings['smtp_pass']);
        $settings['smtp_pass'] = $hasPassword ? '••••••••••••' : '';
        $settings['has_password'] = $hasPassword;

        echo json_encode([
            "status" => "success",
            "data" => $settings
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'save_settings';
    $userId = $input['user_id'] ?? 1;

    if ($action === 'test_connection') {
        $host = trim($input['smtp_host'] ?? '');
        $port = intval($input['smtp_port'] ?? 587);
        $encryption = trim($input['smtp_encryption'] ?? 'tls');
        $user = trim($input['smtp_user'] ?? '');
        $pass = trim($input['smtp_pass'] ?? '');
        $testEmail = trim($input['test_email'] ?? ($input['from_email'] ?? 'admin@kehakiman.gov.my'));

        if (empty($host) || $port <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Hos pelayan dan port SMTP yang sah diperlukan."]);
            exit;
        }

        // If password was masked, retrieve existing password from DB
        if ($pass === '••••••••••••' || empty($pass)) {
            $stmt = $pdo->query("SELECT smtp_pass FROM smtp_settings WHERE id = 1");
            $existing = $stmt->fetch();
            if ($existing && !empty($existing['smtp_pass'])) {
                $pass = $existing['smtp_pass'];
            }
        }

        // Test Socket Connection
        $targetHost = ($encryption === 'ssl' ? 'ssl://' : '') . $host;
        $timeout = 6;
        $errno = 0;
        $errstr = '';

        $socket = @fsockopen($targetHost, $port, $errno, $errstr, $timeout);

        if (!$socket) {
            recordAudit($pdo, $userId, 'TEST_FAILED', 'Tetapan SMTP', "Ujian sambungan SMTP ke $host:$port gagal: $errstr ($errno)");
            echo json_encode([
                "status" => "error",
                "message" => "Gagal menyambung ke pelayan SMTP ($host:$port). Kod ralat $errno: $errstr. Sila pastikan hos dan port boleh dicapai."
            ]);
            exit;
        }

        // Read server response with strict timeout
        stream_set_timeout($socket, 3);
        $greeting = fgets($socket, 512);
        $info = stream_get_meta_data($socket);
        fclose($socket);

        if ($info['timed_out'] && empty($greeting)) {
            $greeting = "Sambungan port terbuka (tiada banner teks SMTP segera dipulangkan).";
        }

        recordAudit($pdo, $userId, 'TEST_SUCCESS', 'Tetapan SMTP', "Ujian sambungan soket SMTP ke $host:$port berjaya. Respon: " . trim($greeting));

        echo json_encode([
            "status" => "success",
            "message" => "Sambungan ke pelayan SMTP ($host:$port) berjaya! Maklum balas pelayan: " . trim($greeting),
            "details" => [
                "host" => $host,
                "port" => $port,
                "encryption" => $encryption,
                "server_greeting" => trim($greeting),
                "tested_to" => $testEmail
            ]
        ]);
        exit;
    }

    if ($action === 'save_settings') {
        $host = trim($input['smtp_host'] ?? 'smtp.kehakiman.gov.my');
        $port = intval($input['smtp_port'] ?? 587);
        $encryption = in_array($input['smtp_encryption'] ?? '', ['tls', 'ssl', 'none']) ? $input['smtp_encryption'] : 'tls';
        $user = trim($input['smtp_user'] ?? '');
        $pass = trim($input['smtp_pass'] ?? '');
        $fromEmail = trim($input['from_email'] ?? 'noreply-mypmo@kehakiman.gov.my');
        $fromName = trim($input['from_name'] ?? 'Sistem MY-PMO PKPMP');
        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $notifyOnRisk = isset($input['notify_on_risk']) ? ($input['notify_on_risk'] ? 1 : 0) : 1;
        $notifyOnOverdue = isset($input['notify_on_overdue_task']) ? ($input['notify_on_overdue_task'] ? 1 : 0) : 1;
        $notifyOnPayment = isset($input['notify_on_payment_due']) ? ($input['notify_on_payment_due'] ? 1 : 0) : 1;

        if (empty($host) || $port <= 0 || empty($fromEmail)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Hos SMTP, Port, dan E-mel Pengirim adalah wajib diisi."]);
            exit;
        }

        try {
            // Update settings; only update pass if not masked
            if (!empty($pass) && $pass !== '••••••••••••') {
                $sql = "UPDATE smtp_settings SET 
                            smtp_host = ?, smtp_port = ?, smtp_encryption = ?, smtp_user = ?, smtp_pass = ?, 
                            from_email = ?, from_name = ?, is_active = ?, notify_on_risk = ?, 
                            notify_on_overdue_task = ?, notify_on_payment_due = ? 
                        WHERE id = 1";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$host, $port, $encryption, $user, $pass, $fromEmail, $fromName, $isActive, $notifyOnRisk, $notifyOnOverdue, $notifyOnPayment]);
            } else {
                $sql = "UPDATE smtp_settings SET 
                            smtp_host = ?, smtp_port = ?, smtp_encryption = ?, smtp_user = ?, 
                            from_email = ?, from_name = ?, is_active = ?, notify_on_risk = ?, 
                            notify_on_overdue_task = ?, notify_on_payment_due = ? 
                        WHERE id = 1";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$host, $port, $encryption, $user, $fromEmail, $fromName, $isActive, $notifyOnRisk, $notifyOnOverdue, $notifyOnPayment]);
            }

            recordAudit($pdo, $userId, 'UPDATE', 'Tetapan SMTP', "Mengemas kini konfigurasi pelayan SMTP ($host:$port, $fromEmail)");

            echo json_encode([
                "status" => "success",
                "message" => "Konfigurasi pelayan SMTP berjaya disimpan."
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat menyimpan tetapan SMTP: " . $e->getMessage()]);
        }
        exit;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Tindakan (action) tidak sah."]);
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
