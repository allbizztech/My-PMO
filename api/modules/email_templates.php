<?php
// api/modules/email_templates.php
// Modul Pengurusan Templat Jemputan E-mel PMO PKPMP
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to log audit
function recordAudit($pdo, $userId, $action, $module, $details) {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $action, $module, $details, $ip]);
    } catch (\Exception $e) {
        // Continue
    }
}

if ($method === 'GET') {
    try {
        $category = $_GET['category'] ?? null;
        $sql = "SELECT * FROM email_templates " . ($category ? "WHERE category = ? " : "") . "ORDER BY is_default DESC, id ASC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($category ? [$category] : []);
        $templates = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "data" => $templates
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'create_template';
    $userId = $input['user_id'] ?? 1;

    if ($action === 'create_template') {
        $name = trim($input['name'] ?? '');
        $category = trim($input['category'] ?? 'meeting');
        $subject = trim($input['subject'] ?? '');
        $body = trim($input['body'] ?? '');
        $isDefault = !empty($input['is_default']) ? 1 : 0;

        if (empty($name) || empty($subject) || empty($body)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Nama templat, subjek, dan kandungan e-mel adalah wajib."]);
            exit;
        }

        try {
            if ($isDefault) {
                // Reset other defaults in category
                $pdo->prepare("UPDATE email_templates SET is_default = 0 WHERE category = ?")->execute([$category]);
            }

            $stmt = $pdo->prepare("INSERT INTO email_templates (name, category, subject, body, is_default, created_by) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $category, $subject, $body, $isDefault, $userId]);
            $newId = $pdo->lastInsertId();

            recordAudit($pdo, $userId, 'CREATE', 'Templat E-mel', "Mencipta templat e-mel jemputan baharu: $name (ID: $newId)");

            echo json_encode([
                "status" => "success",
                "message" => "Templat jemputan e-mel berjaya disimpan.",
                "data" => [
                    "id" => $newId,
                    "name" => $name,
                    "category" => $category,
                    "subject" => $subject,
                    "body" => $body,
                    "is_default" => $isDefault
                ]
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat menyimpan templat: " . $e->getMessage()]);
        }
        exit;
    }

    if ($action === 'update_template') {
        $id = intval($input['id'] ?? $_GET['id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $category = trim($input['category'] ?? 'meeting');
        $subject = trim($input['subject'] ?? '');
        $body = trim($input['body'] ?? '');
        $isDefault = !empty($input['is_default']) ? 1 : 0;

        if (!$id || empty($name) || empty($subject) || empty($body)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID templat, nama, subjek, dan kandungan e-mel adalah wajib."]);
            exit;
        }

        try {
            if ($isDefault) {
                $pdo->prepare("UPDATE email_templates SET is_default = 0 WHERE category = ?")->execute([$category]);
            }

            $stmt = $pdo->prepare("UPDATE email_templates SET name = ?, category = ?, subject = ?, body = ?, is_default = ? WHERE id = ?");
            $stmt->execute([$name, $category, $subject, $body, $isDefault, $id]);

            recordAudit($pdo, $userId, 'UPDATE', 'Templat E-mel', "Mengemas kini templat e-mel ID $id ($name)");

            echo json_encode([
                "status" => "success",
                "message" => "Templat jemputan e-mel berjaya dikemas kini."
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat mengemas kini templat: " . $e->getMessage()]);
        }
        exit;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Tindakan tidak sah."]);
    exit;
}

if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = intval($input['id'] ?? $_GET['id'] ?? 0);
    $name = trim($input['name'] ?? '');
    $category = trim($input['category'] ?? 'meeting');
    $subject = trim($input['subject'] ?? '');
    $body = trim($input['body'] ?? '');
    $isDefault = !empty($input['is_default']) ? 1 : 0;
    $userId = intval($input['user_id'] ?? $_GET['user_id'] ?? 1);

    if (!$id || empty($name) || empty($subject) || empty($body)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID, nama, subjek, dan badan templat diperlukan."]);
        exit;
    }

    try {
        if ($isDefault) {
            $pdo->prepare("UPDATE email_templates SET is_default = 0 WHERE category = ?")->execute([$category]);
        }

        $stmt = $pdo->prepare("UPDATE email_templates SET name = ?, category = ?, subject = ?, body = ?, is_default = ? WHERE id = ?");
        $stmt->execute([$name, $category, $subject, $body, $isDefault, $id]);

        recordAudit($pdo, $userId, 'UPDATE', 'Templat E-mel', "Mengemas kini templat e-mel ID $id ($name)");

        echo json_encode([
            "status" => "success",
            "message" => "Templat jemputan e-mel berjaya dikemas kini."
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = intval($_GET['id'] ?? $input['id'] ?? 0);
    $userId = intval($_GET['user_id'] ?? $input['user_id'] ?? 1);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID templat diperlukan."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM email_templates WHERE id = ?");
        $stmt->execute([$id]);

        recordAudit($pdo, $userId, 'DELETE', 'Templat E-mel', "Memadam templat e-mel ID $id");

        echo json_encode([
            "status" => "success",
            "message" => "Templat e-mel berjaya dipadam."
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam templat: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
