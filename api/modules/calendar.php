<?php
// api/modules/calendar.php
// Modul Kalendar Projek Bersepadu Dinamik MY-PMO PKPMP
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

// Ensure table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS calendar_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT DEFAULT NULL,
        title VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        event_type ENUM('meeting', 'milestone', 'deadline', 'task', 'review') DEFAULT 'meeting',
        description TEXT DEFAULT NULL,
        created_by INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (event_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (\Exception $e) {
    // Ready
}

if ($method === 'GET') {
    $month = $_GET['month'] ?? null; // e.g. '2026-09'
    $projectId = isset($_GET['project_id']) && !empty($_GET['project_id']) ? intval($_GET['project_id']) : null;

    try {
        $events = [];

        // 1. Tasks due dates
        $taskSql = "SELECT t.id, t.project_id, t.title, t.due_date as event_date, t.priority, t.status, p.name as project_name 
                    FROM tasks t 
                    JOIN projects p ON t.project_id = p.id 
                    WHERE t.due_date IS NOT NULL " . ($projectId ? "AND t.project_id = $projectId " : "");
        $tasks = $pdo->query($taskSql)->fetchAll();

        foreach ($tasks as $t) {
            $isUrgent = ($t['priority'] === 'Segera' || $t['priority'] === 'Tinggi');
            $events[] = [
                "id" => "task_" . $t['id'],
                "real_id" => $t['id'],
                "title" => "Tugasan: " . $t['title'],
                "event_date" => $t['event_date'],
                "type" => "task",
                "category_label" => "Tugasan Kanban",
                "project_id" => $t['project_id'],
                "project_name" => $t['project_name'],
                "status" => $t['status'],
                "priority" => $t['priority'],
                "color" => $isUrgent ? "bg-rose-500" : "bg-blue-500",
                "is_editable" => false
            ];
        }

        // 2. Gantt Milestones & Phases
        $ganttSql = "SELECT g.id, g.project_id, g.title, g.planned_end as event_date, g.is_milestone, g.status, p.name as project_name 
                     FROM gantt_tasks g 
                     JOIN projects p ON g.project_id = p.id 
                     WHERE g.planned_end IS NOT NULL " . ($projectId ? "AND g.project_id = $projectId " : "");
        $gantts = $pdo->query($ganttSql)->fetchAll();

        foreach ($gantts as $g) {
            $isMilestone = $g['is_milestone'] == 1;
            $events[] = [
                "id" => "gantt_" . $g['id'],
                "real_id" => $g['id'],
                "title" => ($isMilestone ? "Pencapaian: " : "Fasa: ") . $g['title'],
                "event_date" => $g['event_date'],
                "type" => "milestone",
                "category_label" => $isMilestone ? "Jadual Bayaran / Milestone" : "Fasa Kerja Gantt",
                "project_id" => $g['project_id'],
                "project_name" => $g['project_name'],
                "status" => $g['status'],
                "color" => "bg-indigo-600",
                "is_editable" => false
            ];
        }

        // 3. Project Deadlines
        $projSql = "SELECT id, name, end_date as event_date, status, health 
                    FROM projects 
                    WHERE end_date IS NOT NULL " . ($projectId ? "AND id = $projectId " : "");
        $projects = $pdo->query($projSql)->fetchAll();

        foreach ($projects as $p) {
            $events[] = [
                "id" => "proj_" . $p['id'],
                "real_id" => $p['id'],
                "title" => "Penyerahan Projek: " . $p['name'],
                "event_date" => $p['event_date'],
                "type" => "deadline",
                "category_label" => "Tarikh Akhir Projek",
                "project_id" => $p['id'],
                "project_name" => $p['name'],
                "status" => $p['status'],
                "health" => $p['health'],
                "color" => "bg-emerald-600",
                "is_editable" => false
            ];
        }

        // 4. Custom Calendar Events (Meetings, Reviews, Sessions)
        $calSql = "SELECT c.id, c.project_id, c.title, c.event_date, c.event_type, c.description, p.name as project_name 
                   FROM calendar_events c 
                   LEFT JOIN projects p ON c.project_id = p.id 
                   WHERE 1=1 " . ($projectId ? "AND (c.project_id = $projectId OR c.project_id IS NULL) " : "");
        $customs = $pdo->query($calSql)->fetchAll();

        foreach ($customs as $c) {
            $cType = $c['event_type'] ?? 'meeting';
            $color = ($cType === 'meeting' ? 'bg-slate-800' : ($cType === 'review' ? 'bg-amber-500' : ($cType === 'deadline' ? 'bg-rose-500' : 'bg-indigo-600')));
            $label = ($cType === 'meeting' ? 'Mesyuarat PMO' : ($cType === 'review' ? 'Semakan Bajet/Kontrak' : 'Acara Khas'));

            $events[] = [
                "id" => "custom_" . $c['id'],
                "real_id" => $c['id'],
                "title" => $c['title'],
                "event_date" => $c['event_date'],
                "type" => $cType,
                "category_label" => $label,
                "project_id" => $c['project_id'],
                "project_name" => $c['project_name'] ?? 'Umum PKPMP',
                "description" => $c['description'],
                "color" => $color,
                "is_editable" => true
            ];
        }

        // Filter by month if specified (YYYY-MM)
        if ($month) {
            $filtered = [];
            foreach ($events as $ev) {
                if (substr($ev['event_date'], 0, 7) === $month) {
                    $filtered[] = $ev;
                }
            }
            $events = $filtered;
        }

        // Sort chronologically
        usort($events, function($a, $b) {
            return strcmp($a['event_date'], $b['event_date']);
        });

        echo json_encode([
            "status" => "success",
            "count" => count($events),
            "month" => $month ?: date('Y-m'),
            "data" => $events
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'create_event';
    $userId = $input['user_id'] ?? null;

    if ($action === 'create_event') {
        $title = trim($input['title'] ?? '');
        $eventDate = trim($input['event_date'] ?? '');
        $eventType = in_array($input['event_type'] ?? '', ['meeting', 'milestone', 'deadline', 'task', 'review']) ? $input['event_type'] : 'meeting';
        $projectId = !empty($input['project_id']) ? intval($input['project_id']) : null;
        $description = trim($input['description'] ?? '');

        if (empty($title) || empty($eventDate)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Tajuk dan tarikh acara adalah wajib."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO calendar_events (project_id, title, event_date, event_type, description, created_by) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$projectId, $title, $eventDate, $eventType, $description, $userId]);
            $newId = $pdo->lastInsertId();

            recordAudit($pdo, $userId, 'CREATE', 'Kalendar', "Mencipta acara kalendar: $title ($eventDate)");

            echo json_encode([
                "status" => "success",
                "message" => "Acara kalendar berjaya ditambah.",
                "data" => [
                    "id" => "custom_" . $newId,
                    "real_id" => $newId,
                    "title" => $title,
                    "event_date" => $eventDate,
                    "type" => $eventType,
                    "project_id" => $projectId,
                    "description" => $description,
                    "is_editable" => true
                ]
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat menyimpan acara: " . $e->getMessage()]);
        }
        exit;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Tindakan tidak sah."]);
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 1;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID acara diperlukan."]);
        exit;
    }

    // Clean prefix if custom_
    $cleanId = str_starts_with($id, 'custom_') ? intval(substr($id, 7)) : intval($id);

    try {
        $stmt = $pdo->prepare("DELETE FROM calendar_events WHERE id = ?");
        $stmt->execute([$cleanId]);

        recordAudit($pdo, $userId, 'DELETE', 'Kalendar', "Memadam acara kalendar ID $cleanId");

        echo json_encode([
            "status" => "success",
            "message" => "Acara berjaya dipadam."
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat memadam acara: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
