<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

// Memastikan jadual project_members wujud
try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS project_members (
            id INT AUTO_INCREMENT PRIMARY KEY,
            project_id INT NOT NULL,
            user_id INT NOT NULL,
            role VARCHAR(100) DEFAULT 'Ahli Pasukan',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY project_user (project_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
} catch (\PDOException $e) {
    // Abaikan jika ralat kebenaran table creation
}

if ($method === 'GET') {
    $projectId = isset($_GET['project_id']) ? $_GET['project_id'] : null;

    if (!$projectId) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID projek (project_id) diperlukan"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT 
                pm.id AS member_id,
                pm.project_id,
                pm.role AS project_role,
                pm.created_at AS joined_at,
                u.id AS user_id,
                u.name,
                u.email,
                u.role AS system_role,
                u.agency,
                u.status
            FROM project_members pm
            JOIN users u ON pm.user_id = u.id
            WHERE pm.project_id = ?
            ORDER BY u.name ASC
        ");
        $stmt->execute([$projectId]);
        $members = $stmt->fetchAll();

        echo json_encode(["status" => "success", "data" => $members]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $projectId = $input['project_id'] ?? null;
    $userId = $input['user_id'] ?? null;
    $role = $input['role'] ?? 'Ahli Pasukan';

    if (!$projectId || !$userId) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "project_id dan user_id adalah wajib"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)");
        $stmt->execute([$projectId, $userId, $role]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('CREATE', 'Project Members', ?)");
        $auditStmt->execute(["Ahli pasukan ditambah ke projek ID: " . $projectId . " (User ID: " . $userId . ")"]);

        echo json_encode(["status" => "success", "message" => "Ahli pasukan berjaya ditambah."]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal menambah ahli pasukan: " . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    $id = $input['id'] ?? null;
    $projectId = $input['project_id'] ?? null;
    $userId = $input['user_id'] ?? null;

    try {
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM project_members WHERE id = ?");
            $stmt->execute([$id]);
        } elseif ($projectId && $userId) {
            $stmt = $pdo->prepare("DELETE FROM project_members WHERE project_id = ? AND user_id = ?");
            $stmt->execute([$projectId, $userId]);
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID atau (project_id & user_id) diperlukan"]);
            exit;
        }

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('DELETE', 'Project Members', ?)");
        $auditStmt->execute(["Ahli pasukan dikeluarkan dari projek ID: " . $projectId]);

        echo json_encode(["status" => "success", "message" => "Ahli pasukan berjaya dikeluarkan."]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam ahli pasukan: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>