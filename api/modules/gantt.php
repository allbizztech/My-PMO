<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

// Auto create gantt_tasks table if not exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `gantt_tasks` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `project_id` INT NOT NULL,
      `title` VARCHAR(255) NOT NULL,
      `planned_start` DATE NOT NULL,
      `planned_end` DATE NOT NULL,
      `actual_start` DATE DEFAULT NULL,
      `actual_end` DATE DEFAULT NULL,
      `progress` INT DEFAULT 0,
      `status` ENUM('Belum Mula', 'Sedang Berjalan', 'Selesai', 'Tertunda') DEFAULT 'Belum Mula',
      `is_milestone` TINYINT(1) DEFAULT 0,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
} catch (\PDOException $e) {
    // Continue
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $project_id = isset($_GET['project_id']) ? intval($_GET['project_id']) : null;

    if (!$project_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "project_id diperlukan."]);
        exit;
    }

    try {
        // Fetch project dates
        $pStmt = $pdo->prepare("SELECT start_date, end_date, created_at FROM projects WHERE id = ?");
        $pStmt->execute([$project_id]);
        $projData = $pStmt->fetch();

        $pStartStr = !empty($projData['start_date']) ? $projData['start_date'] : '2026-03-01';
        $pEndStr = !empty($projData['end_date']) ? $projData['end_date'] : date('Y-m-d', strtotime('+1 year', strtotime($pStartStr)));

        $pStartTimestamp = strtotime($pStartStr);

        $stmt = $pdo->prepare("SELECT * FROM gantt_tasks WHERE project_id = ? ORDER BY planned_start ASC, id ASC");
        $stmt->execute([$project_id]);
        $items = $stmt->fetchAll();

        // Auto-fix old hardcoded seed items (2026-01-15) if present for this project to match real start_date
        if (count($items) > 0 && $items[0]['planned_start'] === '2026-01-15' && $pStartStr !== '2026-01-15') {
            $pdo->prepare("DELETE FROM gantt_tasks WHERE project_id = ?")->execute([$project_id]);
            $items = [];
        }

        // Seed initial default phases if none exist for this project
        if (count($items) === 0) {
            $f1Start = date('Y-m-d', $pStartTimestamp);
            $f1End = date('Y-m-d', strtotime('+2 months', $pStartTimestamp));

            $m1Date = $f1End;

            $f2Start = date('Y-m-d', strtotime('+3 months', $pStartTimestamp));
            $f2End = date('Y-m-d', strtotime('+5 months', $pStartTimestamp));

            $f3Start = date('Y-m-d', strtotime('+6 months', $pStartTimestamp));
            $f3End = date('Y-m-d', strtotime('+8 months', $pStartTimestamp));

            $m2Date = $f3End;

            $f4Start = date('Y-m-d', strtotime('+9 months', $pStartTimestamp));
            $f4End = $pEndStr;

            $sampleItems = [
                [
                    'title' => 'Fasa 1: Pengumpulan Keperluan & Reka Bentuk',
                    'planned_start' => $f1Start,
                    'planned_end' => $f1End,
                    'actual_start' => $f1Start,
                    'actual_end' => $f1End,
                    'progress' => 100,
                    'status' => 'Selesai',
                    'is_milestone' => 0
                ],
                [
                    'title' => 'Pencapaian 1: Kelulusan SRS & Senibina Sistem',
                    'planned_start' => $m1Date,
                    'planned_end' => $m1Date,
                    'actual_start' => $m1Date,
                    'actual_end' => $m1Date,
                    'progress' => 100,
                    'status' => 'Selesai',
                    'is_milestone' => 1
                ],
                [
                    'title' => 'Fasa 2: Pembangunan Infrastruktur & Pangkalan Data',
                    'planned_start' => $f2Start,
                    'planned_end' => $f2End,
                    'actual_start' => $f2Start,
                    'actual_end' => $f2End,
                    'progress' => 100,
                    'status' => 'Selesai',
                    'is_milestone' => 0
                ],
                [
                    'title' => 'Fasa 3: Pembangunan Modul & Pengujian UAT',
                    'planned_start' => $f3Start,
                    'planned_end' => $f3End,
                    'actual_start' => $f3Start,
                    'actual_end' => date('Y-m-d', strtotime('-15 days', strtotime($f3End))),
                    'progress' => 65,
                    'status' => 'Sedang Berjalan',
                    'is_milestone' => 0
                ],
                [
                    'title' => 'Pencapaian 2: Sijil Kelulusan Audit Keselamatan & UAT',
                    'planned_start' => $m2Date,
                    'planned_end' => $m2Date,
                    'actual_start' => null,
                    'actual_end' => null,
                    'progress' => 50,
                    'status' => 'Sedang Berjalan',
                    'is_milestone' => 1
                ],
                [
                    'title' => 'Fasa 4: Latihan Pengguna & Pelancaran Go-Live',
                    'planned_start' => $f4Start,
                    'planned_end' => $f4End,
                    'actual_start' => null,
                    'actual_end' => null,
                    'progress' => 0,
                    'status' => 'Belum Mula',
                    'is_milestone' => 0
                ]
            ];

            $insertStmt = $pdo->prepare("INSERT INTO gantt_tasks (project_id, title, planned_start, planned_end, actual_start, actual_end, progress, status, is_milestone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($sampleItems as $s) {
                $insertStmt->execute([
                    $project_id,
                    $s['title'],
                    $s['planned_start'],
                    $s['planned_end'],
                    $s['actual_start'],
                    $s['actual_end'],
                    $s['progress'],
                    $s['status'],
                    $s['is_milestone']
                ]);
            }

            // Re-fetch items
            $stmt->execute([$project_id]);
            $items = $stmt->fetchAll();
        }

        echo json_encode(["status" => "success", "data" => $items]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $project_id = $input['project_id'] ?? null;
    $title = $input['title'] ?? '';
    $planned_start = $input['planned_start'] ?? null;
    $planned_end = $input['planned_end'] ?? null;
    $actual_start = !empty($input['actual_start']) ? $input['actual_start'] : null;
    $actual_end = !empty($input['actual_end']) ? $input['actual_end'] : null;
    $progress = intval($input['progress'] ?? 0);
    $status = $input['status'] ?? 'Belum Mula';
    $is_milestone = !empty($input['is_milestone']) ? 1 : 0;

    if (!$project_id || empty($title) || !$planned_start || !$planned_end) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "project_id, title, planned_start, dan planned_end adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO gantt_tasks (project_id, title, planned_start, planned_end, actual_start, actual_end, progress, status, is_milestone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$project_id, $title, $planned_start, $planned_end, $actual_start, $actual_end, $progress, $status, $is_milestone]);
        $newId = $pdo->lastInsertId();

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('CREATE', 'Gantt', ?)");
        $auditStmt->execute(["Item Carta Gantt dicipta: $title (Projek ID: $project_id)"]);

        echo json_encode(["status" => "success", "message" => "Item Gantt berjaya dicipta", "id" => $newId]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal mencipta item Gantt: " . $e->getMessage()]);
    }

} elseif ($method === 'PUT') {
    $id = $input['id'] ?? null;
    $title = $input['title'] ?? null;
    $planned_start = $input['planned_start'] ?? null;
    $planned_end = $input['planned_end'] ?? null;
    $actual_start = array_key_exists('actual_start', $input) ? (!empty($input['actual_start']) ? $input['actual_start'] : null) : null;
    $actual_end = array_key_exists('actual_end', $input) ? (!empty($input['actual_end']) ? $input['actual_end'] : null) : null;
    $progress = isset($input['progress']) ? intval($input['progress']) : null;
    $status = $input['status'] ?? null;
    $is_milestone = isset($input['is_milestone']) ? (!empty($input['is_milestone']) ? 1 : 0) : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID item Gantt diperlukan"]);
        exit;
    }

    try {
        $fields = [];
        $params = [];

        if ($title !== null) {
            $fields[] = "title = ?";
            $params[] = $title;
        }
        if ($planned_start !== null) {
            $fields[] = "planned_start = ?";
            $params[] = $planned_start;
        }
        if ($planned_end !== null) {
            $fields[] = "planned_end = ?";
            $params[] = $planned_end;
        }
        if (array_key_exists('actual_start', $input)) {
            $fields[] = "actual_start = ?";
            $params[] = $actual_start;
        }
        if (array_key_exists('actual_end', $input)) {
            $fields[] = "actual_end = ?";
            $params[] = $actual_end;
        }
        if ($progress !== null) {
            $fields[] = "progress = ?";
            $params[] = $progress;
        }
        if ($status !== null) {
            $fields[] = "status = ?";
            $params[] = $status;
        }
        if ($is_milestone !== null) {
            $fields[] = "is_milestone = ?";
            $params[] = $is_milestone;
        }

        if (empty($fields)) {
            echo json_encode(["status" => "success", "message" => "Tiada perubahan."]);
            exit;
        }

        $params[] = $id;
        $sql = "UPDATE gantt_tasks SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('UPDATE', 'Gantt', ?)");
        $auditStmt->execute(["Item Gantt dikemas kini: ID $id"]);

        echo json_encode(["status" => "success", "message" => "Item Gantt berjaya dikemas kini"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat: " . $e->getMessage()]);
    }

} elseif ($method === 'DELETE') {
    $id = $input['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID item Gantt diperlukan"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM gantt_tasks WHERE id = ?");
        $stmt->execute([$id]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (action, module, details) VALUES ('DELETE', 'Gantt', ?)");
        $auditStmt->execute(["Item Gantt dipadam: ID $id"]);

        echo json_encode(["status" => "success", "message" => "Item Gantt dipadam"]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam item Gantt"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>