<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

// Cuma benarkan POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

if ($action === 'login') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Sila masukkan emel dan kata laluan"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = 'Aktif'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Berjaya log masuk

            // Rekod jejak audit
            $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'LOGIN', 'Authentication', 'Pengguna berjaya log masuk', ?)");
            $auditStmt->execute([$user['id'], $_SERVER['REMOTE_ADDR']]);

            $roleMap = [
                'superadmin' => 'Superadmin',
                'admin_agency' => 'Pentadbir PKPMP',
                'kewangan' => 'Kewangan PKPMP',
                'pmo_gov' => 'Pegawai PMO PKPMP',
                'pmo_vendor' => 'PMO Vendor',
                'management' => 'Pengurusan PKPMP'
            ];
            $roleName = $roleMap[$user['role']] ?? $user['role'];

            echo json_encode([
                "status" => "success",
                "message" => "Log masuk berjaya",
                "user" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $roleName,
                    "roleId" => $user['role'],
                    "agency" => $user['agency'],
                    "avatar" => $user['avatar'] ?: substr(str_replace(' ', '', $user['name']), 0, 2)
                ]
            ]);
        } else {
            // Rekod percubaan gagal untuk jejak keselamatan (Brute-force tracking)
            try {
                $failedAuditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (NULL, 'FAILED_LOGIN', 'Authentication', ?, ?)");
                $failedAuditStmt->execute(["Percubaan log masuk gagal untuk emel: " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8'), $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);
            } catch (\Exception $ex) {}

            // Gagal
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Emel atau kata laluan tidak sah"]);
        }
    } catch (\PDOException $e) {
        error_log("Auth Error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan semasa memproses log masuk"]);
    }
} elseif ($action === 'check_email_reset') {
    $email = trim($input['email'] ?? '');
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Sila masukkan format alamat e-mel yang sah."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, name, email, role, agency FROM users WHERE email = ? AND status = 'Aktif'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode([
                "status" => "success",
                "message" => "Akaun sah ditemui dalam pangkalan data PKPMP.",
                "data" => [
                    "id" => $user['id'],
                    "name" => $user['name'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "status" => "error",
                "message" => "Alamat e-mel '$email' tidak dijumpai atau akaun tidak aktif dalam sistem PKPMP."
            ]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
} elseif ($action === 'self_reset_password') {
    $email = trim($input['email'] ?? '');
    $newPassword = $input['new_password'] ?? '';

    if (empty($email) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "E-mel dan kata laluan baharu adalah wajib."]);
        exit;
    }

    if (strlen($newPassword) < 6) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Kata laluan baharu mestilah sekurang-kurangnya 6 aksara."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ? AND status = 'Aktif'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Akaun dengan e-mel ini tidak ditemui."]);
            exit;
        }

        $hash = password_hash($newPassword, PASSWORD_BCRYPT);
        $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $updateStmt->execute([$hash, $user['id']]);

        // Rekod audit log
        try {
            $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'RESET_PASSWORD', 'Authentication', ?, ?)");
            $auditStmt->execute([$user['id'], "Pengguna '{$user['name']}' telah menetapkan semula kata laluan sendiri melalui e-mel ($email)", $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1']);
        } catch (\Exception $ex) {}

        echo json_encode([
            "status" => "success",
            "message" => "Kata laluan baharu berjaya disimpan. Sila log masuk dengan kata laluan baharu anda."
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat mengemas kini kata laluan: " . $e->getMessage()]);
    }
    exit;
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Tindakan tidak sah"]);
}
?>