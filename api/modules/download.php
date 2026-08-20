<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$id = $_GET['id'] ?? null;
$user_id = $_GET['user_id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo "Ralat: ID dokumen diperlukan.";
    exit;
}

try {
    // Dapatkan maklumat fail dari pangkalan data
    $stmt = $pdo->prepare("SELECT * FROM documents WHERE id = ?");
    $stmt->execute([$id]);
    $doc = $stmt->fetch();

    if (!$doc) {
        http_response_code(404);
        echo "Ralat: Dokumen tidak ditemui.";
        exit;
    }

    $filePath = '../uploads/' . $doc['file_path'];

    if (!file_exists($filePath)) {
        http_response_code(404);
        echo "Ralat: Fail fizikal tidak ditemui di pelayan.";
        exit;
    }

    // Rekod log audit tindakan READ (muat turun)
    $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'READ', 'Documents', ?, ?)");
    $auditStmt->execute([
        $user_id,
        "Fail dimuat turun: " . $doc['file_name'] . " (ID: " . $id . ") bagi projek ID: " . $doc['project_id'],
        $_SERVER['REMOTE_ADDR']
    ]);

    // Hantar header HTTP untuk memaksa muat turun fail dengan nama asalnya
    header('Content-Description: File Transfer');
    header('Content-Type: ' . mime_content_type($filePath));
    header('Content-Disposition: attachment; filename="' . basename($doc['file_name']) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));
    
    // Clear output buffer sebelum streaming fail
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    readfile($filePath);
    exit;
} catch (\PDOException $e) {
    http_response_code(500);
    echo "Ralat pelayan: " . $e->getMessage();
    exit;
}
?>
