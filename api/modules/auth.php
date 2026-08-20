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
            // Gagal
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Emel atau kata laluan tidak sah"]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Tindakan tidak sah"]);
}
?>