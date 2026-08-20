<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = '../uploads/';

// Pastikan folder uploads wujud
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Handle GET request
if ($method === 'GET') {
    $project_id = isset($_GET['project_id']) ? $_GET['project_id'] : null;

    if (!$project_id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Parameter project_id diperlukan."]);
        exit;
    }

    try {
        // Auto-migrate sebarang rekod kategori 'Spesifikasi Sistem' kepada 'Kanban File'
        $pdo->exec("UPDATE documents SET category = 'Kanban File' WHERE category = 'Spesifikasi Sistem'");

        $stmt = $pdo->prepare("SELECT documents.*, users.name AS uploader_name FROM documents LEFT JOIN users ON documents.uploader_id = users.id WHERE documents.project_id = ? ORDER BY documents.created_at DESC");
        $stmt->execute([$project_id]);
        $docs = $stmt->fetchAll();
        echo json_encode(["status" => "success", "data" => $docs]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

// Handle POST request (File Upload)
if ($method === 'POST') {
    $project_id = $_POST['project_id'] ?? null;
    $category = $_POST['category'] ?? 'Lain-lain';
    $uploader_id = $_POST['uploader_id'] ?? null;
    $fileNameInput = $_POST['fileName'] ?? '';

    $file = $_FILES['file'] ?? null;

    if (empty($project_id) || empty($uploader_id)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Medan project_id dan uploader_id adalah wajib."]);
        exit;
    }

    if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Sila pilih fail untuk dimuat naik."]);
        exit;
    }

    // 1. Validasi Saiz Fail (Maksimum 10MB)
    if ($file['size'] > 10485760) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Saiz fail melebihi had maksimum 10MB."]);
        exit;
    }

    // 2. Validasi MIME type menggunakan finfo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowedTypes = [
        'application/pdf' => 'pdf',
        'image/png' => 'png',
        'image/jpeg' => 'jpg',
        'image/gif' => 'gif',
        'application/msword' => 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'application/vnd.ms-excel' => 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
        'text/plain' => 'txt',
        'application/zip' => 'zip',
        'application/x-zip-compressed' => 'zip'
    ];

    if (!array_key_exists($mimeType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Format fail tidak sah. Format dibenarkan: PDF, Word, Excel, PNG, JPG, GIF sahaja."]);
        exit;
    }
    $ext = $allowedTypes[$mimeType];

    // 3. Nama Fail Paparan & Nama Fail Unik di Server
    $cleanFileNameInput = trim($fileNameInput);
    $displayDocName = !empty($cleanFileNameInput) ? $cleanFileNameInput . '.' . $ext : basename($file['name']);
    $uniqueName = uniqid('doc_', true) . '.' . $ext;
    $uploadPath = $uploadDir . $uniqueName;

    // 4. Pindah fail fizikal
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO documents (project_id, file_name, file_path, category, uploader_id, file_size) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$project_id, $displayDocName, $uniqueName, $category, $uploader_id, $file['size']]);
            $newId = $pdo->lastInsertId();

            // Rekod log audit
            $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'CREATE', 'Documents', ?, ?)");
            $auditStmt->execute([
                $uploader_id,
                "Fail dimuat naik: " . $displayDocName . " (ID: " . $newId . ") bagi projek ID: " . $project_id,
                $_SERVER['REMOTE_ADDR']
            ]);

            echo json_encode(["status" => "success", "message" => "Fail berjaya dimuat naik", "id" => $newId]);
        } catch (\PDOException $e) {
            // Padam semula fail jika DB error
            if (file_exists($uploadPath)) {
                unlink($uploadPath);
            }
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Gagal merekod dokumen ke DB: " . $e->getMessage()]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan fail fizikal ke pelayan."]);
    }
    exit;
}

// Handle DELETE request
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    $user_id = $input['user_id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID dokumen diperlukan."]);
        exit;
    }

    try {
        // Ambil info dokumen untuk padam fail fizikal
        $stmt = $pdo->prepare("SELECT file_path, file_name, project_id FROM documents WHERE id = ?");
        $stmt->execute([$id]);
        $doc = $stmt->fetch();

        if ($doc) {
            $filePath = $uploadDir . $doc['file_path'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            $deleteStmt = $pdo->prepare("DELETE FROM documents WHERE id = ?");
            $deleteStmt->execute([$id]);

            // Rekod log audit
            $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'DELETE', 'Documents', ?, ?)");
            $auditStmt->execute([
                $user_id,
                "Fail dipadam: " . $doc['file_name'] . " (ID: " . $id . ") bagi projek ID: " . $doc['project_id'],
                $_SERVER['REMOTE_ADDR']
            ]);

            echo json_encode(["status" => "success", "message" => "Dokumen berjaya dipadam."]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Dokumen tidak ditemui."]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

// Handle PUT request (Update Document Metadata)
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? null;
    $file_name = $input['file_name'] ?? null;
    $category = $input['category'] ?? null;
    $user_id = $input['user_id'] ?? null;

    if (!$id || !$file_name) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "ID dan Nama Dokumen adalah wajib."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE documents SET file_name = ?, category = ? WHERE id = ?");
        $stmt->execute([$file_name, $category, $id]);

        // Rekod log audit
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, module, details, ip_address) VALUES (?, 'UPDATE', 'Documents', ?, ?)");
        $auditStmt->execute([
            $user_id,
            "Dokumen dikemaskini: " . $file_name . " (ID: " . $id . ")",
            $_SERVER['REMOTE_ADDR']
        ]);

        echo json_encode(["status" => "success", "message" => "Dokumen berjaya dikemas kini."]);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
?>