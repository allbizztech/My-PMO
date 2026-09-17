<?php
// api/modules/procurement_checklist.php
// Modul Senarai Semak Perolehan ICT di Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)
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
        // Ignore
    }
}

// Master standard template definition for PKPMP 8 Phases
function getStandardPhasesTemplate($procurementMethod, $requiresContract) {
    $approvalBody = ($procurementMethod === 'tender') 
        ? 'Lembaga Perolehan (LP)' 
        : (($procurementMethod === 'quotation') ? 'Jawatankuasa Sebutharga (JKSH)' : 'Pegawai Pengawal / Ketua Jabatan (Pembelian Terus)');

    return [
        [
            'phase_number' => 1,
            'phase_name' => 'Kelulusan Teknikal (JPICT)',
            'items' => [
                [
                    'item_code' => 'F1-01',
                    'item_title' => 'Kertas Cadangan JPICT',
                    'description' => 'Dokumen kertas cadangan perolehan ICT lengkap mengikut format standard JPICT PKPMP.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F1-02',
                    'item_title' => 'Slaid Pembentangan JPICT',
                    'description' => 'Bahan slaid pembentangan mesyuarat jawatankuasa teknikal ICT.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F1-03',
                    'item_title' => 'Surat / Minit Kelulusan JPICT',
                    'description' => 'Salinan surat atau cabutan minit mesyuarat yang mengesahkan kelulusan perolehan.',
                    'is_mandatory' => 1
                ]
            ]
        ],
        [
            'phase_number' => 2,
            'phase_name' => 'Permohonan Lampiran J',
            'items' => [
                [
                    'item_code' => 'F2-01',
                    'item_title' => 'Borang Format Kod Objek Sebagai',
                    'description' => 'Borang permohonan pengesahan kod Objek Sebagai bagi pecahan peruntukan ICT.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F2-02',
                    'item_title' => 'Salinan Kelulusan JPICT Disahkan',
                    'description' => 'Salinan sokongan kelulusan JPICT yang disahkan pegawai penyelaras.',
                    'is_mandatory' => 1
                ]
            ]
        ],
        [
            'phase_number' => 3,
            'phase_name' => 'Permohonan Kelulusan Belanja',
            'items' => [
                [
                    'item_code' => 'F3-01',
                    'item_title' => 'Memo Iringan Kelulusan Belanja',
                    'description' => 'Memo rasmi kepada Bahagian Kewangan / Pegawai Pengawal bagi kelulusan perbelanjaan.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F3-02',
                    'item_title' => 'Kertas Belanja Terperinci',
                    'description' => 'Justifikasi dan pecahan kos terperinci perbelanjaan yang dipohon.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F3-03',
                    'item_title' => 'Salinan Lampiran J Disahkan',
                    'description' => 'Pengesahan Lampiran J daripada Bahagian Kewangan.',
                    'is_mandatory' => 1
                ]
            ]
        ],
        [
            'phase_number' => 4,
            'phase_name' => 'Permohonan ezApply (Aset Tak Ketara / Harta Modal)',
            'items' => [
                [
                    'item_code' => 'F4-01',
                    'item_title' => 'Memo Permohonan ezApply',
                    'description' => 'Memo rasmi permohonan peruntukan ezApply bagi Harta Modal atau Lesen Perisian (Aset Tak Ketara).',
                    'is_mandatory' => 0
                ],
                [
                    'item_code' => 'F4-02',
                    'item_title' => 'Kertas Belanja & Lampiran J Sokongan',
                    'description' => 'Dokumen salinan kelulusan belanja dan Lampiran J.',
                    'is_mandatory' => 0
                ],
                [
                    'item_code' => 'F4-03',
                    'item_title' => '3 Sebutharga Pasaran (Kajian Pasaran)',
                    'description' => 'Tiga (3) salinan sebut harga pasaran daripada pembekal berdaftar bagi perbandingan nilai.',
                    'is_mandatory' => 0
                ]
            ]
        ],
        [
            'phase_number' => 5,
            'phase_name' => 'Permohonan Tapak ePerolehan (eP)',
            'items' => [
                [
                    'item_code' => 'F5-01',
                    'item_title' => 'Memo Iringan Permohonan Tapak eP',
                    'description' => 'Memo kepada Unit Perolehan PKPMP untuk pembukaan tapak sistem ePerolehan.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F5-02',
                    'item_title' => 'Salinan Kelulusan Belanja',
                    'description' => 'Surat / Memo kelulusan peruntukan belanja yang telah diluluskan.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F5-03',
                    'item_title' => 'Borang Senarai Semak Lampiran 2',
                    'description' => 'Senarai semak permohonan tapak ePerolehan mengikut format Unit Perolehan PKPMP.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F5-04',
                    'item_title' => 'Anggaran Jabatan (Departmental Estimate)',
                    'description' => 'Anggaran harga siling jabatan yang dimeterai dan disimpan dalam kerahsiaan.',
                    'is_mandatory' => 1
                ]
            ]
        ],
        [
            'phase_number' => 6,
            'phase_name' => 'Pelantikan Jawatankuasa Perolehan',
            'items' => [
                [
                    'item_code' => 'F6-01',
                    'item_title' => 'Surat Lantikan Jawatankuasa Spesifikasi',
                    'description' => 'Surat lantikan rasmi ahli JK Penyedia Spesifikasi Teknikal.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F6-02',
                    'item_title' => 'Surat Lantikan Jawatankuasa Pembuka',
                    'description' => 'Surat lantikan pegawai pembuka dokumen tawaran sebutharga/tender.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F6-03',
                    'item_title' => 'Surat Lantikan Jawatankuasa Penilai Teknikal & Kewangan',
                    'description' => 'Surat lantikan JK Penilaian Teknikal dan JK Penilaian Kewangan.',
                    'is_mandatory' => 1
                ]
            ]
        ],
        [
            'phase_number' => 7,
            'phase_name' => 'Penyediaan Dokumen Pelawaan',
            'items' => [
                [
                    'item_code' => 'F7-01',
                    'item_title' => 'Dokumen Sebutharga / Tender Lengkap',
                    'description' => 'Draf dokumen pelawaan lengkap yang disahkan oleh JK Spesifikasi.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F7-02',
                    'item_title' => 'Jadual Pematuhan Spesifikasi Teknikal',
                    'description' => 'Format matriks pematuhan teknikal (Compliance Matrix) untuk diisi oleh petender/pembekal.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F7-03',
                    'item_title' => 'Jadual Harga & Pecahan Kos Pembekal',
                    'description' => 'Format tawaran harga dan senarai kuantiti (Bill of Quantities).',
                    'is_mandatory' => 1
                ]
            ]
        ],
        [
            'phase_number' => 8,
            'phase_name' => 'Perakuan, Keputusan & Surat Setuju Terima (SST)',
            'items' => [
                [
                    'item_code' => 'F8-01',
                    'item_title' => 'Kertas Perakuan Pelantikan Pembekal',
                    'description' => "Kertas pertimbangan perakuan untuk diangkat kepada {$approvalBody}.",
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F8-02',
                    'item_title' => 'Laporan Penilaian Teknikal & Kewangan',
                    'description' => 'Laporan penuh penilaian perolehan yang ditandatangani oleh semua ahli jawatankuasa penilai.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F8-03',
                    'item_title' => "Minit / Keputusan Kelulusan {$approvalBody}",
                    'description' => "Cabutan keputusan rasmi kelulusan pelantikan pembekal berjaya oleh {$approvalBody}.",
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F8-04',
                    'item_title' => 'Surat Setuju Terima (SST) Bertandatangan',
                    'description' => 'Salinan Surat Setuju Terima (SST) yang telah ditandatangani dan diakui penerimaan oleh pembekal berjaya.',
                    'is_mandatory' => 1
                ],
                [
                    'item_code' => 'F8-05',
                    'item_title' => 'Bon Pelaksanaan & Dokumen Perjanjian Kontrak',
                    'description' => 'Jaminan Bank / Bon Pelaksanaan dan Dokumen Kontrak Rasmi Kerajaan (Wajib jika tempoh pelaksanaan melebihi 4 bulan).',
                    'is_mandatory' => $requiresContract ? 1 : 0
                ]
            ]
        ]
    ];
}

// Inisialisasi semula senarai semak bagi projek
function initializeChecklistForProject($pdo, $projectId, $method = null, $estimatedValue = null, $requiresContract = null, $contractMonths = null, $userId = null) {
    // Semak maklumat projek
    $stmtP = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
    $stmtP->execute([$projectId]);
    $project = $stmtP->fetch(PDO::FETCH_ASSOC);

    if (!$project) {
        throw new \Exception("Projek tidak wujud");
    }

    $budget = floatval($estimatedValue !== null ? $estimatedValue : ($project['budget'] ?? 0));
    
    // Tentukan kaedah automatik jika tidak dinyatakan
    if (!$method) {
        if ($budget > 500000) {
            $method = 'tender';
        } elseif ($budget > 50000) {
            $method = 'quotation';
        } else {
            $method = 'direct_purchase';
        }
    }

    // Kira tempoh kontrak jika ada tarikh mula dan tamat
    $months = 0;
    if ($contractMonths !== null) {
        $months = intval($contractMonths);
    } elseif (!empty($project['start_date']) && !empty($project['end_date'])) {
        $start = new DateTime($project['start_date']);
        $end = new DateTime($project['end_date']);
        $diff = $start->diff($end);
        $months = ($diff->y * 12) + $diff->m;
    }

    $reqContract = ($requiresContract !== null) ? intval($requiresContract) : ($months > 4 ? 1 : 0);

    // Dapatkan atau cipta induk senarai semak
    $stmtCheck = $pdo->prepare("SELECT id FROM procurement_checklists WHERE project_id = ?");
    $stmtCheck->execute([$projectId]);
    $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    $checklistId = null;
    if ($existing) {
        $checklistId = $existing['id'];
        $stmtUp = $pdo->prepare("UPDATE procurement_checklists SET 
            procurement_method = ?, estimated_value = ?, requires_contract = ?, contract_period_months = ?, updated_at = NOW() 
            WHERE id = ?");
        $stmtUp->execute([$method, $budget, $reqContract, $months, $checklistId]);
    } else {
        $stmtIn = $pdo->prepare("INSERT INTO procurement_checklists 
            (project_id, procurement_method, estimated_value, requires_contract, contract_period_months, status, created_by) 
            VALUES (?, ?, ?, ?, ?, 'in_progress', ?)");
        $stmtIn->execute([$projectId, $method, $budget, $reqContract, $months, $userId]);
        $checklistId = $pdo->lastInsertId();
    }

    // Padam item lama jika inisialisasi semula dipanggil
    $pdo->prepare("DELETE FROM procurement_checklist_items WHERE checklist_id = ?")->execute([$checklistId]);

    // Masukkan templat 8 fasa
    $phases = getStandardPhasesTemplate($method, $reqContract);
    $totalCount = 0;

    $stmtItem = $pdo->prepare("INSERT INTO procurement_checklist_items 
        (checklist_id, phase_number, phase_name, item_code, item_title, description, is_mandatory, is_checked, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending')");

    foreach ($phases as $phase) {
        foreach ($phase['items'] as $item) {
            $stmtItem->execute([
                $checklistId,
                $phase['phase_number'],
                $phase['phase_name'],
                $item['item_code'],
                $item['item_title'],
                $item['description'],
                $item['is_mandatory']
            ]);
            $totalCount++;
        }
    }

    // Kemaskini jumlah item
    $pdo->prepare("UPDATE procurement_checklists SET total_items = ?, completed_items = 0 WHERE id = ?")
        ->execute([$totalCount, $checklistId]);

    recordAudit($pdo, $userId, 'INITIALIZE', 'Senarai Semak Perolehan', "Inisialisasi senarai semak perolehan bagi projek #{$projectId} ({$method})");

    return $checklistId;
}

// -------------------------------------------------------------
// ROUTE: GET
// -------------------------------------------------------------
if ($method === 'GET') {
    $projectId = isset($_GET['project_id']) ? intval($_GET['project_id']) : null;

    if (!$projectId) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'project_id diperlukan']);
        exit;
    }

    try {
        // Semak rekod induk
        $stmt = $pdo->prepare("SELECT * FROM procurement_checklists WHERE project_id = ?");
        $stmt->execute([$projectId]);
        $checklist = $stmt->fetch(PDO::FETCH_ASSOC);

        // Jika belum ada senarai semak, inisialisasi secara automatik
        if (!$checklist) {
            $checklistId = initializeChecklistForProject($pdo, $projectId);
            $stmt = $pdo->prepare("SELECT * FROM procurement_checklists WHERE id = ?");
            $stmt->execute([$checklistId]);
            $checklist = $stmt->fetch(PDO::FETCH_ASSOC);
        }

        // Ambil semua item semakan beserta maklumat dokumen berkaitan dari DMS
        $stmtItems = $pdo->prepare("
            SELECT i.*, 
                   d.file_name as doc_file_name, 
                   d.file_path as doc_file_path, 
                   d.file_size as doc_file_size,
                   d.created_at as doc_created_at
            FROM procurement_checklist_items i
            LEFT JOIN documents d ON i.document_id = d.id
            WHERE i.checklist_id = ?
            ORDER BY i.phase_number ASC, i.id ASC
        ");
        $stmtItems->execute([$checklist['id']]);
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        // Kumpulkan mengikut fasa (Phase 1 to 8)
        $phasesGrouped = [];
        $totalItems = count($items);
        $completedItems = 0;

        foreach ($items as $item) {
            $pNum = intval($item['phase_number']);
            if (!isset($phasesGrouped[$pNum])) {
                $phasesGrouped[$pNum] = [
                    'phase_number' => $pNum,
                    'phase_name' => $item['phase_name'],
                    'total_items' => 0,
                    'completed_items' => 0,
                    'items' => []
                ];
            }

            $phasesGrouped[$pNum]['total_items']++;
            if (intval($item['is_checked']) === 1 || $item['status'] === 'verified') {
                $phasesGrouped[$pNum]['completed_items']++;
                $completedItems++;
            }

            $phasesGrouped[$pNum]['items'][] = $item;
        }

        // Susun fasa dalam bentuk array index
        $phasesArray = array_values($phasesGrouped);
        $progressPct = $totalItems > 0 ? round(($completedItems / $totalItems) * 100) : 0;

        // Ambil maklumat projek untuk rujukan nama dan bajet
        $stmtP = $pdo->prepare("SELECT p.id, p.name, p.project_code, p.budget, p.start_date, p.end_date, p.vendor, p.vendor_manager, u.name as manager FROM projects p LEFT JOIN users u ON p.manager_id = u.id WHERE p.id = ?");
        $stmtP->execute([$projectId]);
        $projMeta = $stmtP->fetch(PDO::FETCH_ASSOC);

        // Ambil senarai fail DMS sedia ada untuk projek ini bagi memudahkan pautan
        $stmtDocs = $pdo->prepare("SELECT id, file_name, category, file_size, created_at FROM documents WHERE project_id = ? ORDER BY id DESC");
        $stmtDocs->execute([$projectId]);
        $availableDocs = $stmtDocs->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'status' => 'success',
            'data' => [
                'checklist' => $checklist,
                'project' => $projMeta,
                'progress_percentage' => $progressPct,
                'completed_items' => $completedItems,
                'total_items' => $totalItems,
                'phases' => $phasesArray,
                'available_dms_documents' => $availableDocs
            ]
        ]);
    } catch (\Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// -------------------------------------------------------------
// ROUTE: POST
// -------------------------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    if (!is_array($input) || empty($input)) {
        $input = $_POST;
    }

    $action = $input['action'] ?? '';

    try {
        switch ($action) {
            // 1. Inisialisasi semula / Ubah kaedah perolehan
            case 'initialize':
                $projectId = intval($input['project_id'] ?? 0);
                $method = $input['procurement_method'] ?? null;
                $val = isset($input['estimated_value']) ? floatval($input['estimated_value']) : null;
                $contract = isset($input['requires_contract']) ? intval($input['requires_contract']) : null;
                $months = isset($input['contract_period_months']) ? intval($input['contract_period_months']) : null;
                $userId = intval($input['user_id'] ?? 1);

                if (!$projectId) {
                    throw new \Exception("project_id diperlukan");
                }

                $checklistId = initializeChecklistForProject($pdo, $projectId, $method, $val, $contract, $months, $userId);

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Senarai semak perolehan berjaya diinisialisasi.',
                    'checklist_id' => $checklistId
                ]);
                break;

            // 2. Kemas kini status item semakan
            case 'update_item':
                $itemId = intval($input['item_id'] ?? 0);
                if (!$itemId) {
                    throw new \Exception("item_id diperlukan");
                }

                $isChecked = isset($input['is_checked']) ? intval($input['is_checked']) : null;
                $status = $input['status'] ?? null; // 'pending', 'submitted', 'verified', 'not_applicable'
                $refNo = $input['reference_no'] ?? null;
                $remarks = $input['remarks'] ?? null;
                $docId = isset($input['document_id']) ? ($input['document_id'] ? intval($input['document_id']) : null) : null;
                $checkedBy = $input['checked_by'] ?? 'Pegawai PMO';
                $userId = intval($input['user_id'] ?? 1);

                // Dapatkan rekod item semasa
                $stmtGet = $pdo->prepare("SELECT * FROM procurement_checklist_items WHERE id = ?");
                $stmtGet->execute([$itemId]);
                $currentItem = $stmtGet->fetch(PDO::FETCH_ASSOC);

                if (!$currentItem) {
                    throw new \Exception("Item semakan tidak dijumpai.");
                }

                $newChecked = ($isChecked !== null) ? $isChecked : $currentItem['is_checked'];
                $newStatus = ($status !== null) ? $status : ($newChecked ? 'verified' : 'pending');
                $checkedAt = ($newChecked == 1) ? date('Y-m-d H:i:s') : null;
                $newCheckedBy = ($newChecked == 1) ? $checkedBy : null;

                $stmtUp = $pdo->prepare("UPDATE procurement_checklist_items SET 
                    is_checked = ?, 
                    status = ?, 
                    reference_no = COALESCE(?, reference_no), 
                    remarks = COALESCE(?, remarks),
                    document_id = ?,
                    checked_by = ?,
                    checked_at = ?,
                    updated_at = NOW()
                    WHERE id = ?");
                
                $stmtUp->execute([
                    $newChecked,
                    $newStatus,
                    $refNo,
                    $remarks,
                    $docId,
                    $newCheckedBy,
                    $checkedAt,
                    $itemId
                ]);

                // Kira semula jumlah siap bagi induk checklist
                $chkId = $currentItem['checklist_id'];
                $stmtCount = $pdo->prepare("SELECT COUNT(*) as total, SUM(CASE WHEN is_checked = 1 OR status = 'verified' THEN 1 ELSE 0 END) as completed FROM procurement_checklist_items WHERE checklist_id = ?");
                $stmtCount->execute([$chkId]);
                $counts = $stmtCount->fetch(PDO::FETCH_ASSOC);

                $tot = intval($counts['total']);
                $comp = intval($counts['completed']);
                $newChkStatus = ($comp >= $tot && $tot > 0) ? 'completed' : 'in_progress';

                $pdo->prepare("UPDATE procurement_checklists SET total_items = ?, completed_items = ?, status = ? WHERE id = ?")
                    ->execute([$tot, $comp, $newChkStatus, $chkId]);

                recordAudit($pdo, $userId, 'UPDATE', 'Senarai Semak Perolehan', "Kemas kini item {$currentItem['item_code']}: " . ($newChecked ? 'Selesai' : 'Belum Selesai'));

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Status item semakan berjaya dikemas kini.',
                    'item_id' => $itemId,
                    'is_checked' => $newChecked,
                    'status' => $newStatus,
                    'completed_items' => $comp,
                    'total_items' => $tot
                ]);
                break;

            // 3. Pautkan fail DMS sedia ada ke item
            case 'link_document':
                $itemId = intval($input['item_id'] ?? 0);
                $docId = isset($input['document_id']) && $input['document_id'] ? intval($input['document_id']) : null;
                $userId = intval($input['user_id'] ?? 1);

                if (!$itemId) {
                    throw new \Exception("item_id diperlukan");
                }

                $stmtLink = $pdo->prepare("UPDATE procurement_checklist_items SET document_id = ?, updated_at = NOW() WHERE id = ?");
                $stmtLink->execute([$docId, $itemId]);

                recordAudit($pdo, $userId, 'LINK_DOC', 'Senarai Semak Perolehan', "Pautkan dokumen DMS #{$docId} ke item semakan #{$itemId}");

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Dokumen berjaya dipautkan kepada item semakan.'
                ]);
                break;

            // 4. Muat naik fail terus dan pautkan ke senarai semak & DMS
            case 'upload_and_link':
                $projectId = intval($_POST['project_id'] ?? 0);
                $itemId = intval($_POST['item_id'] ?? 0);
                $userId = intval($_POST['user_id'] ?? 1);
                $category = $_POST['category'] ?? 'Senarai Semak Perolehan';

                if (!$projectId || !$itemId || !isset($_FILES['file'])) {
                    throw new \Exception("project_id, item_id, dan fail muat naik diperlukan.");
                }

                $file = $_FILES['file'];
                if ($file['error'] !== UPLOAD_ERR_OK) {
                    throw new \Exception("Ralat memuat naik fail: Kod " . $file['error']);
                }

                // Simpan ke direktori api/uploads/
                $uploadDir = __DIR__ . '/../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
                $uniqueName = 'doc_' . uniqid('', true) . '.' . $ext;
                $targetPath = $uploadDir . $uniqueName;

                if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                    throw new \Exception("Gagal menyimpan fail yang dimuat naik ke pelayan.");
                }

                // Cipta rekod dalam jadual documents (DMS)
                $stmtDoc = $pdo->prepare("INSERT INTO documents (project_id, file_name, file_path, category, uploader_id, file_size) VALUES (?, ?, ?, ?, ?, ?)");
                $stmtDoc->execute([$projectId, $file['name'], $uniqueName, $category, $userId, $file['size']]);
                $newDocId = $pdo->lastInsertId();

                // Pautkan ke item senarai semak dan tandakan sebagai submitted
                $stmtItemUp = $pdo->prepare("UPDATE procurement_checklist_items SET document_id = ?, status = 'submitted', updated_at = NOW() WHERE id = ?");
                $stmtItemUp->execute([$newDocId, $itemId]);

                recordAudit($pdo, $userId, 'UPLOAD_DOC', 'Senarai Semak Perolehan', "Muat naik fail '{$file['name']}' ke item semakan #{$itemId}");

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Dokumen berjaya dimuat naik dan dipautkan.',
                    'document_id' => $newDocId,
                    'file_name' => $file['name'],
                    'file_size' => $file['size']
                ]);
                break;

            // 5. Kemas kini tetapan induk senarai semak
            case 'update_settings':
                $checklistId = intval($input['checklist_id'] ?? 0);
                if (!$checklistId) {
                    throw new \Exception("checklist_id diperlukan");
                }

                $method = $input['procurement_method'] ?? 'quotation';
                $val = floatval($input['estimated_value'] ?? 0);
                $contract = intval($input['requires_contract'] ?? 0);
                $months = intval($input['contract_period_months'] ?? 0);
                $notes = $input['notes'] ?? null;
                $userId = intval($input['user_id'] ?? 1);

                $stmtUp = $pdo->prepare("UPDATE procurement_checklists SET 
                    procurement_method = ?, estimated_value = ?, requires_contract = ?, 
                    contract_period_months = ?, notes = ?, updated_at = NOW() 
                    WHERE id = ?");
                $stmtUp->execute([$method, $val, $contract, $months, $notes, $checklistId]);

                recordAudit($pdo, $userId, 'UPDATE_SETTINGS', 'Senarai Semak Perolehan', "Kemas kini tetapan senarai semak #{$checklistId}");

                echo json_encode([
                    'status' => 'success',
                    'message' => 'Tetapan senarai semak berjaya disimpan.'
                ]);
                break;

            default:
                throw new \Exception("Tindakan '{$action}' tidak sah.");
        }
    } catch (\Exception $e) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}
