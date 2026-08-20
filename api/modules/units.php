<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $divisionId = isset($_GET['division_id']) ? $_GET['division_id'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    try {
        if ($id) {
            $stmt = $pdo->prepare("SELECT u.*, d.name AS division_name, d.code AS division_code FROM units u JOIN divisions d ON u.division_id = d.id WHERE u.id = ?");
            $stmt->execute([$id]);
            $unit = $stmt->fetch();
            if ($unit) {
                echo json_encode(["status" => "success", "data" => $unit]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Unit tidak dijumpai."]);
            }
        } elseif ($divisionId) {
            $stmt = $pdo->prepare("SELECT * FROM units WHERE division_id = ? ORDER BY id ASC");
            $stmt->execute([$divisionId]);
            $units = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $units]);
        } else {
            $stmt = $pdo->query("SELECT u.*, d.name AS division_name, d.code AS division_code FROM units u JOIN divisions d ON u.division_id = d.id ORDER BY u.division_id ASC, u.id ASC");
            $units = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $units]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $divisionId = $input['division_id'] ?? null;
    $code = trim($input['code'] ?? '');
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');

    if (!$divisionId || empty($name)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Bahagian dan Nama Unit adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO units (division_id, code, name, description) VALUES (?, ?, ?, ?)");
        $stmt->execute([$divisionId, $code, $name, $description]);
        $newId = $pdo->lastInsertId();

        echo json_encode([
            "status" => "success",
            "message" => "Unit berjaya ditambah.",
            "data" => ["id" => $newId, "division_id" => $divisionId, "code" => $code, "name" => $name, "description" => $description]
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat menyimpan unit: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? $_GET['id'] : ($input['id'] ?? null);
    $divisionId = $input['division_id'] ?? null;
    $code = trim($input['code'] ?? '');
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');

    if (!$id || empty($name)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID Unit dan Nama Unit adalah wajib."]);
        exit;
    }

    try {
        if ($divisionId) {
            $stmt = $pdo->prepare("UPDATE units SET division_id = ?, code = ?, name = ?, description = ? WHERE id = ?");
            $stmt->execute([$divisionId, $code, $name, $description, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE units SET code = ?, name = ?, description = ? WHERE id = ?");
            $stmt->execute([$code, $name, $description, $id]);
        }

        echo json_encode(["status" => "success", "message" => "Unit berjaya dikemas kini."]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat kemas kini unit: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : ($input['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID Unit diperlukan."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM units WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["status" => "success", "message" => "Unit berjaya dipadam."]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam unit: " . $e->getMessage()]);
    }
    exit;
}
?>