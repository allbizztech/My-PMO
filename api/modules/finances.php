<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

// Ensure type column exists
try {
    $pdo->exec("ALTER TABLE finances ADD COLUMN type VARCHAR(50) DEFAULT 'Invois'");
} catch (\Exception $e) {
    // Column already exists
}

// Handle GET request
if ($method === 'GET') {
    $project_id = isset($_GET['project_id']) ? $_GET['project_id'] : null;

    try {
        if ($project_id) {
            $stmt = $pdo->prepare("SELECT * FROM finances WHERE project_id = ? ORDER BY date DESC, id DESC");
            $stmt->execute([$project_id]);
            $finances = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $finances]);
        } else {
            $stmt = $pdo->query("SELECT * FROM finances ORDER BY date DESC, id DESC");
            $finances = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $finances]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $project_id = $input['project_id'] ?? null;
    $invoice_no = $input['invoice_no'] ?? '';
    $description = $input['description'] ?? '';
    $vendor = $input['vendor'] ?? '';
    $amount = $input['amount'] ?? 0;
    $status = $input['status'] ?? 'Menunggu Kelulusan';
    $type = $input['type'] ?? ($input['status'] === 'Denda SLA' ? 'Denda' : 'Invois');
    $date = $input['date'] ?? null;
    $user_id = $input['user_id'] ?? null;

    if (empty($project_id) || empty($invoice_no) || empty($amount) || empty($date)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Medan project_id, invoice_no, amount dan date adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO finances (project_id, invoice_no, description, vendor, amount, status, type, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$project_id, $invoice_no, $description, $vendor, $amount, $status, $type, $date]);

        $newId = $pdo->lastInsertId();

        // Rekod Jejak Audit dengan user_id
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'CREATE', 'Finances', ?, ?)");
        $auditStmt->execute([
            $user_id,
            ($type === 'Denda' ? "Denda SLA baru dicipta: " : "Tuntutan baru dicipta: ") . $invoice_no . " (RM" . number_format($amount, 2) . ") bagi projek ID: " . $project_id,
            $_SERVER['REMOTE_ADDR']
        ]);

        echo json_encode(["status" => "success", "message" => ($type === 'Denda' ? "Denda SLA berjaya dicipta" : "Rekod kewangan berjaya dicipta"), "id" => $newId]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal mencipta rekod kewangan: " . $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    $id = $input['id'] ?? null;
    $invoice_no = $input['invoice_no'] ?? null;
    $description = $input['description'] ?? null;
    $vendor = $input['vendor'] ?? null;
    $amount = $input['amount'] ?? null;
    $status = $input['status'] ?? null;
    $date = $input['date'] ?? null;
    $type = $input['type'] ?? null;
    $user_id = $input['user_id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID rekod kewangan diperlukan"]);
        exit;
    }

    try {
        $fields = [];
        $params = [];

        if ($invoice_no !== null) {
            $fields[] = "invoice_no = ?";
            $params[] = $invoice_no;
        }
        if ($description !== null) {
            $fields[] = "description = ?";
            $params[] = $description;
        }
        if ($vendor !== null) {
            $fields[] = "vendor = ?";
            $params[] = $vendor;
        }
        if ($amount !== null) {
            $fields[] = "amount = ?";
            $params[] = $amount;
        }
        if ($status !== null) {
            $fields[] = "status = ?";
            $params[] = $status;
        }
        if ($type !== null) {
            $fields[] = "type = ?";
            $params[] = $type;
        }
        if ($date !== null) {
            $fields[] = "date = ?";
            $params[] = $date;
        }

        if (empty($fields)) {
            echo json_encode(["status" => "success", "message" => "Tiada perubahan dilakukan."]);
            exit;
        }

        $params[] = $id;
        $sql = "UPDATE finances SET " . implode(", ", $fields) . " WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // Dapatkan maklumat invois untuk butiran log audit
        $infoStmt = $pdo->prepare("SELECT invoice_no, project_id FROM finances WHERE id = ?");
        $infoStmt->execute([$id]);
        $finInfo = $infoStmt->fetch();
        $invName = $finInfo ? $finInfo['invoice_no'] : $id;
        $projId = $finInfo ? $finInfo['project_id'] : '?';

        // Rekod Jejak Audit dengan user_id
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'UPDATE', 'Finances', ?, ?)");
        $auditStmt->execute([
            $user_id,
            "Rekod kewangan dikemas kini: " . $invName . " (ID: " . $id . ") bagi projek ID: " . $projId,
            $_SERVER['REMOTE_ADDR']
        ]);

        echo json_encode(["status" => "success", "message" => "Rekod kewangan dikemas kini"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat mengemas kini rekod kewangan: " . $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    $id = $input['id'] ?? null;
    $user_id = $input['user_id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID rekod kewangan diperlukan"]);
        exit;
    }

    try {
        // Dapatkan maklumat invois sebelum padam
        $infoStmt = $pdo->prepare("SELECT invoice_no, project_id FROM finances WHERE id = ?");
        $infoStmt->execute([$id]);
        $finInfo = $infoStmt->fetch();
        $invName = $finInfo ? $finInfo['invoice_no'] : $id;
        $projId = $finInfo ? $finInfo['project_id'] : '?';

        $stmt = $pdo->prepare("DELETE FROM finances WHERE id = ?");
        $stmt->execute([$id]);

        // Rekod Jejak Audit dengan user_id
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'DELETE', 'Finances', ?, ?)");
        $auditStmt->execute([
            $user_id,
            "Rekod kewangan dipadam: " . $invName . " (ID: " . $id . ") bagi projek ID: " . $projId,
            $_SERVER['REMOTE_ADDR']
        ]);

        echo json_encode(["status" => "success", "message" => "Rekod kewangan berjaya dipadam"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam rekod kewangan: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>