<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $sql = "SELECT 
                    a.id, 
                    a.user_id, 
                    a.action, 
                    a.module, 
                    a.details, 
                    a.ip_address, 
                    a.created_at, 
                    u.name AS user_name, 
                    u.role AS user_role 
                FROM audit_logs a 
                LEFT JOIN users u ON a.user_id = u.id 
                ORDER BY a.created_at DESC";
        
        $stmt = $pdo->query($sql);
        $logs = $stmt->fetchAll();
        
        echo json_encode([
            "status" => "success",
            "data" => $logs
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
