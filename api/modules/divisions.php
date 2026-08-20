<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    try {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM divisions WHERE id = ?");
            $stmt->execute([$id]);
            $division = $stmt->fetch();
            if ($division) {
                $unitStmt = $pdo->prepare("SELECT * FROM units WHERE division_id = ? ORDER BY id ASC");
                $unitStmt->execute([$id]);
                $division['units'] = $unitStmt->fetchAll();
                echo json_encode(["status" => "success", "data" => $division]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Bahagian tidak dijumpai."]);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM divisions ORDER BY id ASC");
            $divisions = $stmt->fetchAll();
            $unitStmt = $pdo->query("SELECT * FROM units ORDER BY division_id ASC, id ASC");
            $allUnits = $unitStmt->fetchAll();

            $unitsByDivision = [];
            foreach ($allUnits as $u) {
                $unitsByDivision[$u['division_id']][] = $u;
            }

            foreach ($divisions as &$div) {
                $div['units'] = $unitsByDivision[$div['id']] ?? [];
            }

            echo json_encode(["status" => "success", "data" => $divisions]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $code = trim($input['code'] ?? '');
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');

    if (empty($code) || empty($name)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Kod Bahagian dan Nama Bahagian adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO divisions (code, name, description) VALUES (?, ?, ?)");
        $stmt->execute([$code, $name, $description]);
        $newId = $pdo->lastInsertId();

        echo json_encode([
            "status" => "success",
            "message" => "Bahagian berjaya ditambah.",
            "data" => ["id" => $newId, "code" => $code, "name" => $name, "description" => $description]
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat menyimpan bahagian: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? $_GET['id'] : ($input['id'] ?? null);
    $code = trim($input['code'] ?? '');
    $name = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');

    if (!$id || empty($code) || empty($name)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID, Kod Bahagian dan Nama Bahagian adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE divisions SET code = ?, name = ?, description = ? WHERE id = ?");
        $stmt->execute([$code, $name, $description, $id]);

        echo json_encode(["status" => "success", "message" => "Bahagian berjaya dikemas kini."]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat kemas kini bahagian: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : ($input['id'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID Bahagian diperlukan."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM divisions WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(["status" => "success", "message" => "Bahagian berjaya dipadam."]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam bahagian: " . $e->getMessage()]);
    }
    exit;
}
?>