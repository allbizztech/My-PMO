<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $notifications = [];

        // 1. Fetch recent audit log actions
        $auditSql = "SELECT a.id, a.action, a.module, a.details, a.created_at, u.name as user_name 
                     FROM audit_logs a 
                     LEFT JOIN users u ON a.user_id = u.id 
                     ORDER BY a.created_at DESC LIMIT 4";
        $auditStmt = $pdo->query($auditSql);
        $audits = $auditStmt->fetchAll();

        foreach ($audits as $index => $audit) {
            $timeAgo = $index === 0 ? "Baru Sahaja" : ($index * 15 . " minit lepas");
            $title = "Aktiviti Sistem: " . $audit['action'] . " (" . $audit['module'] . ")";
            $msg = ($audit['user_name'] ? $audit['user_name'] : "Pengguna") . " " . strtolower($audit['details']);

            $notifications[] = [
                "id" => "audit_" . $audit['id'],
                "title" => $title,
                "message" => $msg,
                "time" => $timeAgo,
                "unread" => $index < 2
            ];
        }

        // 2. Fetch project risk alerts
        $projectSql = "SELECT id, name, progress, health, end_date FROM projects WHERE health = 'Amaran' OR progress < 40 LIMIT 3";
        $projStmt = $pdo->query($projectSql);
        $projects = $projStmt->fetchAll();

        foreach ($projects as $p) {
            $notifications[] = [
                "id" => "proj_" . $p['id'],
                "title" => "Amaran Prestasi: " . $p['name'],
                "message" => "Kemajuan projek kini berada pada " . $p['progress'] . "% dengan status kesihatan '" . $p['health'] . "'.",
                "time" => "Hari Ini",
                "unread" => true
            ];
        }

        // Return JSON
        echo json_encode([
            "status" => "success",
            "data" => $notifications
        ]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Ralat pelayan: " . $e->getMessage()
        ]);
    }
    exit;
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
}
?>