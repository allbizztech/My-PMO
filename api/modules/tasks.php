<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle GET request
if ($method === 'GET') {
    $project_id = isset($_GET['project_id']) ? $_GET['project_id'] : null;

    try {
        if ($project_id) {
            $stmt = $pdo->prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC");
            $stmt->execute([$project_id]);
            $tasks = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $tasks]);
        } else {
            // Optional: Get all tasks (if needed)
            $stmt = $pdo->query("SELECT * FROM tasks ORDER BY created_at DESC");
            $tasks = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $tasks]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    // Cipta tugasan baru
    $project_id = $input['project_id'] ?? null;
    $title = $input['title'] ?? '';
    $description = $input['description'] ?? '';
    $priority = $input['priority'] ?? 'Sederhana';
    $due_date = $input['due_date'] ?? null;
    $assignee_id = $input['assignee_id'] ?? null;

    if (empty($project_id) || empty($title)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "project_id dan title adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO tasks (project_id, title, description, status, priority, due_date, assignee_id) VALUES (?, ?, ?, 'pending', ?, ?, ?)");
        $stmt->execute([$project_id, $title, $description, $priority, $due_date, $assignee_id]);

        $newId = $pdo->lastInsertId();

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('CREATE', 'Tasks', ?)");
        $auditStmt->execute(["Tugasan baru dicipta untuk projek ID: " . $project_id]);

        echo json_encode(["status" => "success", "message" => "Tugasan berjaya dicipta", "id" => $newId]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal mencipta tugasan: " . $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    // Kemas kini tugasan
    $id = $input['id'] ?? null;
    $status = $input['status'] ?? null;
    $priority = $input['priority'] ?? null;
    $title = $input['title'] ?? null;
    $description = $input['description'] ?? null;
    $due_date = $input['due_date'] ?? null;
    $assignee_id = $input['assignee_id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID tugasan diperlukan"]);
        exit;
    }

    try {
        $fields = [];
        $params = [];

        if ($status !== null) {
            $fields[] = "status = ?";
            $params[] = $status;
        }
        if ($priority !== null) {
            $fields[] = "priority = ?";
            $params[] = $priority;
        }
        if ($title !== null) {
            $fields[] = "title = ?";
            $params[] = $title;
        }
        if ($description !== null) {
            $fields[] = "description = ?";
            $params[] = $description;
        }
        if ($due_date !== null) {
            $fields[] = "due_date = ?";
            $params[] = $due_date;
        }
        if ($assignee_id !== null) {
            $fields[] = "assignee_id = ?";
            $params[] = $assignee_id;
        }

        if (empty($fields)) {
            echo json_encode(["status" => "success", "message" => "Tiada perubahan."]);
            exit;
        }

        $params[] = $id;
        $sql = "UPDATE tasks SET " . implode(", ", $fields) . " WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('UPDATE', 'Tasks', ?)");
        $auditStmt->execute(["Tugasan dikemas kini: ID " . $id]);

        echo json_encode(["status" => "success", "message" => "Tugasan dikemas kini"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat: " . $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    // Padam tugasan
    $id = $input['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID tugasan diperlukan"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->execute([$id]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('DELETE', 'Tasks', ?)");
        $auditStmt->execute(["Tugasan dipadam: ID " . $id]);

        echo json_encode(["status" => "success", "message" => "Tugasan berjaya dipadam"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam tugasan"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>