<?php
// api/modules/notifications.php
// Sistem Notifikasi Pintar (Auto-Alert) MY-PMO PKPMP
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

// Ensure notifications table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        project_id INT DEFAULT NULL,
        type ENUM('danger', 'warning', 'info', 'success') DEFAULT 'info',
        category VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        link_view VARCHAR(100) DEFAULT 'dashboard',
        is_read TINYINT(1) DEFAULT 0,
        email_sent TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_read (is_read),
        INDEX idx_user (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
} catch (\Exception $e) {
    // Table exists
}

// Helper to format Malay relative time
function getRelativeTimeMalay($timestamp) {
    $diff = time() - strtotime($timestamp);
    if ($diff < 60) return "Baru sahaja";
    if ($diff < 3600) return floor($diff / 60) . " minit lepas";
    if ($diff < 86400) return floor($diff / 3600) . " jam lepas";
    if ($diff < 172800) return "Semalam";
    return date('d M Y', strtotime($timestamp));
}

if ($method === 'GET') {
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

    try {
        $notifications = [];
        $today = date('Y-m-d');
        $todayTime = strtotime($today);

        // 1. AUTO-ALERT: Projek Berisiko / Amaran
        $projSql = "SELECT id, project_code, name, progress, health, end_date 
                    FROM projects 
                    WHERE (health IN ('Berisiko', 'Amaran') OR progress < 40) 
                    AND status = 'Aktif' 
                    ORDER BY (health = 'Berisiko') DESC, progress ASC LIMIT 4";
        $projects = $pdo->query($projSql)->fetchAll();

        foreach ($projects as $p) {
            $isHighRisk = ($p['health'] === 'Berisiko' || $p['progress'] < 30);
            $notifications[] = [
                "id" => "auto_proj_" . $p['id'],
                "category" => "project_risk",
                "type" => $isHighRisk ? "danger" : "warning",
                "title" => ($isHighRisk ? "🚨 Amaran Risiko: " : "⚠️ Pantauan Prestasi: ") . $p['name'],
                "message" => "Kemajuan projek (" . ($p['project_code'] ?? 'PRJ') . ") kini pada " . $p['progress'] . "% dengan status kesihatan '" . $p['health'] . "'. Tindakan mitigasi diperlukan.",
                "project_id" => $p['id'],
                "link_view" => "project_detail",
                "time" => "Hari Ini",
                "unread" => true,
                "is_smart_alert" => true
            ];
        }

        // 2. AUTO-ALERT: Jadual Bayaran & Milestone Matang / Lewat
        $ganttSql = "SELECT g.id, g.project_id, g.title, g.planned_end, g.status, p.name as project_name 
                     FROM gantt_tasks g 
                     JOIN projects p ON g.project_id = p.id 
                     WHERE g.is_milestone = 1 AND g.status != 'Selesai' 
                     ORDER BY g.planned_end ASC LIMIT 4";
        $milestones = $pdo->query($ganttSql)->fetchAll();

        foreach ($milestones as $m) {
            $endDate = $m['planned_end'];
            $endTimestamp = strtotime($endDate);
            $diffDays = ceil(($endTimestamp - $todayTime) / 86400);

            if ($diffDays < 0) {
                // Lewat
                $daysOverdue = abs($diffDays);
                $notifications[] = [
                    "id" => "auto_ms_" . $m['id'],
                    "category" => "payment_due",
                    "type" => "danger",
                    "title" => "🔴 Jadual Bayaran Lewat: " . $m['title'],
                    "message" => "Sasaran pembayaran/pencapaian bagi projek '" . $m['project_name'] . "' telah melepasi tarikh akhir sebanyak " . $daysOverdue . " hari!",
                    "project_id" => $m['project_id'],
                    "link_view" => "project_detail",
                    "time" => $daysOverdue . " hari lewat",
                    "unread" => true,
                    "is_smart_alert" => true
                ];
            } else if ($diffDays <= 30) {
                // Hampir Matang
                $notifications[] = [
                    "id" => "auto_ms_" . $m['id'],
                    "category" => "payment_due",
                    "type" => "warning",
                    "title" => "🔔 Peringatan Bayaran: " . $m['title'],
                    "message" => "Fasa tuntutan bayaran projek '" . $m['project_name'] . "' akan matang dalam " . $diffDays . " hari lagi (" . date('d M Y', $endTimestamp) . ").",
                    "project_id" => $m['project_id'],
                    "link_view" => "project_detail",
                    "time" => $diffDays . " hari lagi",
                    "unread" => true,
                    "is_smart_alert" => true
                ];
            }
        }

        // 3. AUTO-ALERT: Tugasan Kanban Melepasi Had Masa (Overdue Tasks)
        $taskSql = "SELECT t.id, t.project_id, t.title, t.priority, t.due_date, p.name as project_name 
                    FROM tasks t 
                    JOIN projects p ON t.project_id = p.id 
                    WHERE t.status != 'completed' AND t.due_date IS NOT NULL AND t.due_date < ? 
                    ORDER BY t.due_date ASC LIMIT 4";
        $taskStmt = $pdo->prepare($taskSql);
        $taskStmt->execute([$today]);
        $overdueTasks = $taskStmt->fetchAll();

        foreach ($overdueTasks as $t) {
            $diffDays = abs(ceil((strtotime($t['due_date']) - $todayTime) / 86400));
            $isUrgent = ($t['priority'] === 'Segera' || $t['priority'] === 'Tinggi');

            $notifications[] = [
                "id" => "auto_task_" . $t['id'],
                "category" => "task_overdue",
                "type" => $isUrgent ? "danger" : "warning",
                "title" => "⏱ Tugasan Tertunggak: " . $t['title'],
                "message" => "Tugasan keutamaan " . $t['priority'] . " bagi projek '" . $t['project_name'] . "' telah lewat " . $diffDays . " hari.",
                "project_id" => $t['project_id'],
                "link_view" => "project_detail",
                "time" => $diffDays . " hari lepas",
                "unread" => true,
                "is_smart_alert" => true
            ];
        }

        // 4. Rekod Notifikasi Tersimpan dari Pangkalan Data (Custom/Disimpan)
        $customSql = "SELECT n.id, n.project_id, n.type, n.category, n.title, n.message, n.link_view, n.is_read, n.created_at 
                      FROM notifications n 
                      WHERE (n.user_id IS NULL " . ($userId ? "OR n.user_id = " . intval($userId) : "") . ") 
                      ORDER BY n.created_at DESC LIMIT 10";
        $customNotes = $pdo->query($customSql)->fetchAll();

        foreach ($customNotes as $cn) {
            $notifications[] = [
                "id" => "db_" . $cn['id'],
                "category" => $cn['category'],
                "type" => $cn['type'],
                "title" => $cn['title'],
                "message" => $cn['message'],
                "project_id" => $cn['project_id'],
                "link_view" => $cn['link_view'] ?? 'dashboard',
                "time" => getRelativeTimeMalay($cn['created_at']),
                "unread" => $cn['is_read'] == 0,
                "is_smart_alert" => false
            ];
        }

        // 5. Aktiviti Jejak Audit Keselamatan Terkini (Jika tiada amaran kritikal)
        if (count($notifications) < 4) {
            $auditSql = "SELECT a.id, a.action, a.module, a.details, a.created_at, u.name as user_name 
                         FROM audit_logs a 
                         LEFT JOIN users u ON a.user_id = u.id 
                         ORDER BY a.created_at DESC LIMIT 3";
            $audits = $pdo->query($auditSql)->fetchAll();
            foreach ($audits as $audit) {
                $notifications[] = [
                    "id" => "audit_" . $audit['id'],
                    "category" => "audit_security",
                    "type" => "info",
                    "title" => "Aktiviti: " . $audit['action'] . " (" . $audit['module'] . ")",
                    "message" => ($audit['user_name'] ?: "Sistem") . " - " . $audit['details'],
                    "time" => getRelativeTimeMalay($audit['created_at']),
                    "unread" => false,
                    "is_smart_alert" => false
                ];
            }
        }

        // Calculate counts
        $unreadCount = 0;
        $criticalCount = 0;
        $warningCount = 0;

        foreach ($notifications as $n) {
            if (!empty($n['unread'])) {
                $unreadCount++;
            }
            if ($n['type'] === 'danger') {
                $criticalCount++;
            } else if ($n['type'] === 'warning') {
                $warningCount++;
            }
        }

        echo json_encode([
            "status" => "success",
            "counts" => [
                "unread" => $unreadCount,
                "critical" => $criticalCount,
                "warning" => $warningCount,
                "total" => count($notifications)
            ],
            "data" => $notifications
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? 'mark_as_read';

    if ($action === 'mark_as_read') {
        $notifId = $input['id'] ?? null;
        try {
            if ($notifId && str_starts_with($notifId, 'db_')) {
                $cleanId = intval(substr($notifId, 3));
                $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
                $stmt->execute([$cleanId]);
            } else if (!$notifId || $notifId === 'all') {
                $pdo->exec("UPDATE notifications SET is_read = 1");
            }
            echo json_encode(["status" => "success", "message" => "Notifikasi ditanda telah dibaca."]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat: " . $e->getMessage()]);
        }
        exit;
    }

    if ($action === 'create_alert') {
        $title = trim($input['title'] ?? '');
        $message = trim($input['message'] ?? '');
        $type = in_array($input['type'] ?? '', ['danger', 'warning', 'info', 'success']) ? $input['type'] : 'info';
        $category = trim($input['category'] ?? 'general');
        $projectId = $input['project_id'] ?? null;
        $userId = $input['user_id'] ?? null;

        if (empty($title) || empty($message)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Tajuk dan mesej amaran adalah wajib."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO notifications (user_id, project_id, type, category, title, message) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $projectId, $type, $category, $title, $message]);
            echo json_encode(["status" => "success", "message" => "Notifikasi berjaya dicipta.", "id" => $pdo->lastInsertId()]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat menyimpan: " . $e->getMessage()]);
        }
        exit;
    }

    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Tindakan tidak sah."]);
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);