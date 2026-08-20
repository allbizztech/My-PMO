<?php
require_once '../config/db.php';
require_once '../functions/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

try {
    // Fetch dashboard statistics (Dynamic DB queries)

    // Total Projects
    $stmt1 = $pdo->query("SELECT COUNT(*) as total FROM projects");
    $totalProjects = (int) $stmt1->fetch()['total'];

    // Active Projects
    $stmt2 = $pdo->query("SELECT COUNT(*) as active FROM projects WHERE status = 'Aktif'");
    $activeProjects = (int) $stmt2->fetch()['active'];

    // High Risk & Overdue (Lewat) Projects
    $stmt3 = $pdo->query("SELECT COUNT(*) as risk FROM projects WHERE status = 'Lewat' OR health = 'Berisiko'");
    $riskProjects = (int) $stmt3->fetch()['risk'];

    // Total Active Agencies
    $stmt4 = $pdo->query("SELECT COUNT(DISTINCT agency) as agencies FROM projects");
    $totalAgencies = (int) $stmt4->fetch()['agencies'];

    // Completed Projects
    $stmt5 = $pdo->query("SELECT COUNT(*) as completed FROM projects WHERE status = 'Selesai'");
    $completedProjects = (int) $stmt5->fetch()['completed'];

    // Overdue Projects (Lewat)
    $stmt6 = $pdo->query("SELECT COUNT(*) as pending FROM projects WHERE status = 'Lewat'");
    $pendingProjects = (int) $stmt6->fetch()['pending'];

    // Projects On Track (health is Cemerlang or Baik)
    $stmt7 = $pdo->query("SELECT COUNT(*) as on_track FROM projects WHERE health IN ('Cemerlang', 'Baik')");
    $onTrackProjects = (int) $stmt7->fetch()['on_track'];

    // Calculate percentages
    $completedPct = $totalProjects > 0 ? round(($completedProjects / $totalProjects) * 100) : 0;
    $activePct = $totalProjects > 0 ? round(($activeProjects / $totalProjects) * 100) : 0;
    $pendingPct = $totalProjects > 0 ? round(($pendingProjects / $totalProjects) * 100) : 0;
    $onTrackPct = $totalProjects > 0 ? round(($onTrackProjects / $totalProjects) * 100) : 0;

    echo json_encode([
        "status" => "success",
        "data" => [
            "total_projects" => $totalProjects,
            "active_projects" => $activeProjects,
            "risk_projects" => $riskProjects,
            "completed_projects" => $completedProjects,
            "total_agencies" => $totalAgencies,
            "completed_pct" => $completedPct,
            "active_pct" => $activePct,
            "pending_pct" => $pendingPct,
            "on_track_pct" => $onTrackPct
        ]
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Ralat pangkalan data: " . $e->getMessage()]);
}
?>