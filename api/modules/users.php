<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, name, email, role, agency, status, avatar FROM users ORDER BY name ASC");
        $users = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $users]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    // Cipta pengguna baru
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $role = $input['role'] ?? 'pmo_gov';
    $agency = $input['agency'] ?? null;
    $status = $input['status'] ?? 'Aktif';
    $raw_password = !empty($input['password']) ? $input['password'] : 'password123';

    $password_hash = password_hash($raw_password, PASSWORD_BCRYPT);

    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Nama dan Emel adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, agency, status) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $password_hash, $role, $agency, $status]);

        $newId = $pdo->lastInsertId();

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('CREATE', 'Users', ?)");
        $auditStmt->execute(["Pengguna baru dicipta: " . $email]);

        echo json_encode(["status" => "success", "message" => "Pengguna berjaya dicipta", "id" => $newId]);
    } catch (\PDOException $e) {
        http_response_code(500);
        if ($e->getCode() == 23000) { // Duplicate entry
            echo json_encode(["status" => "error", "message" => "Emel sudah wujud."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal mencipta pengguna: " . $e->getMessage()]);
        }
    }
} elseif ($method === 'PUT') {
    // Kemas kini pengguna
    $id = $input['id'] ?? null;
    $name = $input['name'] ?? null;
    $email = $input['email'] ?? null;
    $role = $input['role'] ?? null;
    $agency = $input['agency'] ?? null;
    $status = $input['status'] ?? null;
    $password = $input['password'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID pengguna diperlukan"]);
        exit;
    }

    try {
        $fields = [];
        $params = [];

        if ($name !== null) {
            $fields[] = "name = ?";
            $params[] = $name;
        }
        if ($email !== null) {
            $fields[] = "email = ?";
            $params[] = $email;
        }
        if ($role !== null) {
            $fields[] = "role = ?";
            $params[] = $role;
        }
        if ($agency !== null) {
            $fields[] = "agency = ?";
            $params[] = $agency;
        }
        if ($status !== null) {
            $fields[] = "status = ?";
            $params[] = $status;
        }
        if (!empty($password)) {
            $fields[] = "password = ?";
            $params[] = password_hash($password, PASSWORD_BCRYPT);
        }

        if (empty($fields)) {
            echo json_encode(["status" => "success", "message" => "Tiada perubahan."]);
            exit;
        }

        $params[] = $id;
        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('UPDATE', 'Users', ?)");
        $auditStmt->execute(["Profil pengguna dikemas kini: ID " . $id]);

        echo json_encode(["status" => "success", "message" => "Pengguna berjaya dikemas kini"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat: " . $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    // Padam pengguna
    $id = intval($input['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID pengguna diperlukan"]);
        exit;
    }

    // Perlindungan Akaun Superadmin Utama (System Safeguard)
    if ($id === 1) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Akaun Superadmin Utama sistem tidak boleh dipadam."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('DELETE', 'Users', ?)");
        $auditStmt->execute(["Pengguna dipadam: ID " . $id]);

        echo json_encode(["status" => "success", "message" => "Pengguna berjaya dipadam"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam pengguna"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>