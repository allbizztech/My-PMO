<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle GET request - Senarai projek
if ($method === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    try {
        if ($id) {
            $stmt = $pdo->prepare("SELECT p.*, u.name AS manager FROM projects p LEFT JOIN users u ON p.manager_id = u.id WHERE p.id = ?");
            $stmt->execute([$id]);
            $project = $stmt->fetch();

            if ($project) {
                echo json_encode(["status" => "success", "data" => $project]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Projek tidak dijumpai"]);
            }
        } else {
            $stmt = $pdo->query("SELECT p.*, u.name AS manager FROM projects p LEFT JOIN users u ON p.manager_id = u.id ORDER BY p.created_at DESC");
            $projects = $stmt->fetchAll();
            echo json_encode(["status" => "success", "data" => $projects]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

// Untuk POST, PUT, DELETE kita perlu baca input JSON
$input = json_decode(file_get_contents('php://input'), true);

// Auto-check for mof_approval_date column in projects table
try {
    $checkCol = $pdo->query("SHOW COLUMNS FROM projects LIKE 'mof_approval_date'");
    if (!$checkCol->fetch()) {
        $pdo->exec("ALTER TABLE projects ADD COLUMN mof_approval_date DATE NULL DEFAULT NULL");
    }
} catch (\PDOException $e) {
    // Ignore schema exception
}

if ($method === 'POST') {
    // Cipta projek baru
    $unit = $input['unit'] ?? null;
    $projectCode = $input['project_code'] ?? 'PRJ-' . time();
    $name = $input['name'] ?? '';
    $agency = $input['agency'] ?? '';
    $division = $input['division'] ?? 'Bahagian Teknologi Maklumat (BTM)';
    $budget = $input['budget'] ?? 0;
    $mofApprovalDate = $input['mofApprovalDate'] ?? ($input['mof_approval_date'] ?? '2025-01-12');
    $manager = $input['manager'] ?? '';
    $pmoVendor = $input['pmoVendor'] ?? ($input['vendor_manager'] ?? '');
    $vendor = $input['vendor'] ?? '';
    $startDate = $input['startDate'] ?? ($input['start_date'] ?? null);
    $dueDate = $input['dueDate'] ?? ($input['end_date'] ?? null);
    $description = $input['description'] ?? '';

    if (empty($name) || empty($agency)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Nama projek dan Agensi adalah wajib."]);
        exit;
    }

    try {
        $managerId = null;
        if (!empty($manager)) {
            $stmt = $pdo->prepare("SELECT id FROM users WHERE name = ?");
            $stmt->execute([$manager]);
            $userRow = $stmt->fetch();
            if ($userRow) {
                $managerId = $userRow['id'];
            } else {
                $email = "manager_" . uniqid() . "@kehakiman.gov.my";
                $hash = password_hash('password', PASSWORD_BCRYPT);
                $insertUser = $pdo->prepare("INSERT INTO users (name, email, password, role, agency, status) VALUES (?, ?, ?, 'pmo_gov', 'PKPMP', 'Aktif')");
                $insertUser->execute([$manager, $email, $hash]);
                $managerId = $pdo->lastInsertId();
            }
        }

        $status = $input['status'] ?? 'Aktif';
        $health = $input['health'] ?? ($status === 'Lewat' ? 'Amaran' : 'Baik');
        $progress = $input['progress'] ?? 0;

        $stmt = $pdo->prepare("INSERT INTO projects (project_code, name, agency, division, unit, budget, mof_approval_date, vendor, vendor_manager, start_date, end_date, description, status, health, progress, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$projectCode, $name, $agency, $division, $unit, $budget, $mofApprovalDate, $vendor, $pmoVendor, $startDate, $dueDate, $description, $status, $health, $progress, $managerId]);

        $newId = $pdo->lastInsertId();

        // Rekod Jejak Audit
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('CREATE', 'Projects', ?)");
        $auditStmt->execute(["Projek baru dicipta: " . $projectCode]);

        echo json_encode(["status" => "success", "message" => "Projek berjaya dicipta", "id" => $newId]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal mencipta projek: " . $e->getMessage()]);
    }
} elseif ($method === 'PUT') {
    // Kemas kini projek
    $unit = $input['unit'] ?? null;
    $id = $input['id'] ?? null;
    $status = $input['status'] ?? null;
    $health = $input['health'] ?? null;
    $progress = $input['progress'] ?? null;
    $name = $input['name'] ?? null;
    $description = $input['description'] ?? null;
    $agency = $input['agency'] ?? null;
    $division = $input['division'] ?? null;
    $budget = $input['budget'] ?? null;
    $mofApprovalDate = $input['mofApprovalDate'] ?? ($input['mof_approval_date'] ?? null);
    $manager = $input['manager'] ?? null;
    $vendor = $input['vendor'] ?? null;
    $pmoVendor = $input['pmoVendor'] ?? ($input['vendor_manager'] ?? null);
    $startDate = $input['startDate'] ?? ($input['start_date'] ?? null);
    $dueDate = $input['dueDate'] ?? ($input['end_date'] ?? null);

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID projek diperlukan"]);
        exit;
    }

    try {
        $fields = [];
        $params = [];

        if ($unit !== null) {
            $fields[] = "unit = ?";
            $params[] = $unit;
        }
        if ($budget !== null) {
            $fields[] = "budget = ?";
            $params[] = $budget;
        }
        if ($mofApprovalDate !== null) {
            $fields[] = "mof_approval_date = ?";
            $params[] = $mofApprovalDate;
        }

        if ($status !== null && trim($status) !== '') {
            $fields[] = "status = ?";
            $params[] = $status;
        }
        if ($health !== null) {
            $fields[] = "health = ?";
            $params[] = $health;
        }
        if ($progress !== null) {
            $fields[] = "progress = ?";
            $params[] = $progress;
        }
        if ($name !== null) {
            $fields[] = "name = ?";
            $params[] = $name;
        }
        if ($description !== null) {
            $fields[] = "description = ?";
            $params[] = $description;
        }
        if ($agency !== null) {
            $fields[] = "agency = ?";
            $params[] = $agency;
        }
        if ($division !== null) {
            $fields[] = "division = ?";
            $params[] = $division;
        }
        if ($vendor !== null) {
            $fields[] = "vendor = ?";
            $params[] = $vendor;
        }
        if ($pmoVendor !== null) {
            $fields[] = "vendor_manager = ?";
            $params[] = $pmoVendor;
        }
        if ($startDate !== null) {
            $fields[] = "start_date = ?";
            $params[] = $startDate;
        }
        if ($dueDate !== null) {
            $fields[] = "end_date = ?";
            $params[] = $dueDate;
        }
        if ($manager !== null) {
            $managerId = null;
            if (!empty($manager)) {
                $stmt = $pdo->prepare("SELECT id FROM users WHERE name = ?");
                $stmt->execute([$manager]);
                $userRow = $stmt->fetch();
                if ($userRow) {
                    $managerId = $userRow['id'];
                } else {
                    $email = "manager_" . uniqid() . "@pmo.gov.my";
                    $hash = password_hash('password', PASSWORD_BCRYPT);
                    $insertUser = $pdo->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'pmo_gov', 'Aktif')");
                    $insertUser->execute([$manager, $email, $hash]);
                    $managerId = $pdo->lastInsertId();
                }
            }
            $fields[] = "manager_id = ?";
            $params[] = $managerId;
        }
        if ($vendor !== null) {
            $fields[] = "vendor = ?";
            $params[] = $vendor;
        }
        if ($dueDate !== null) {
            $fields[] = "end_date = ?";
            $params[] = $dueDate;
        }

        if (empty($fields)) {
            echo json_encode(["status" => "success", "message" => "Tiada perubahan."]);
            exit;
        }

        $params[] = $id;
        $sql = "UPDATE projects SET " . implode(", ", $fields) . " WHERE id = ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('UPDATE', 'Projects', ?)");
        $auditStmt->execute(["Projek dikemas kini: ID " . $id]);

        echo json_encode(["status" => "success", "message" => "Projek dikemas kini"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat: " . $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    // Padam projek
    $id = $input['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID projek diperlukan"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('DELETE', 'Projects', ?)");
        $auditStmt->execute(["Projek dipadam: ID " . $id]);

        echo json_encode(["status" => "success", "message" => "Projek berjaya dipadam"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam projek"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>