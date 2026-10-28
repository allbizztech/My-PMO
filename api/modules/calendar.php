<?php
// api/modules/calendar.php
// Modul Kalendar Projek Bersepadu Dinamik & Integrasi Mesyuarat Outlook/Zimbra/Gmail MY-PMO PKPMP
require_once '../config/db.php';
require_once '../functions/cors.php';
require_once '../functions/mailer.php';

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

// Helper: Jana kandungan RFC 5545 iCalendar (.ics) untuk Microsoft Outlook, Zimbra, Gmail & Apple Calendar
function generateICSContent($event, $ccList = []) {
    $id = $event['id'] ?? rand(100, 999);
    $title = $event['title'] ?? 'Mesyuarat PMO PKPMP';
    $eventDate = $event['event_date'] ?? date('Y-m-d');
    $startTime = !empty($event['start_time']) ? substr($event['start_time'], 0, 8) : '09:00:00';
    $endTime = !empty($event['end_time']) ? substr($event['end_time'], 0, 8) : '10:00:00';
    $location = $event['location'] ?? 'Bilik Mesyuarat Utama Istana Kehakiman';
    $meetingLink = $event['meeting_link'] ?? '';
    $description = $event['description'] ?? '';
    $agenda = $event['agenda'] ?? '';

    // Tukar format tarikh dan masa ke UTC (Asia/Kuala_Lumpur UTC+8)
    try {
        $tzKL = new DateTimeZone('Asia/Kuala_Lumpur');
        $tzUTC = new DateTimeZone('UTC');

        $startObj = new DateTime($eventDate . ' ' . $startTime, $tzKL);
        $startObj->setTimezone($tzUTC);
        $dtStart = $startObj->format('Ymd\THis\Z');

        $endObj = new DateTime($eventDate . ' ' . $endTime, $tzKL);
        $endObj->setTimezone($tzUTC);
        $dtEnd = $endObj->format('Ymd\THis\Z');
    } catch (\Exception $e) {
        $dtStart = gmdate('Ymd\T010000\Z', strtotime($eventDate));
        $dtEnd = gmdate('Ymd\T020000\Z', strtotime($eventDate));
    }

    $dtStamp = gmdate('Ymd\THis\Z');
    $uid = "mypmo-meeting-{$id}-" . time() . "@kehakiman.gov.my";

    $descText = "";
    if (!empty($description)) {
        $descText .= "Keterangan: " . $description . "\n\n";
    }
    if (!empty($agenda)) {
        $descText .= "AGENDA MESYUARAT:\n" . $agenda . "\n\n";
    }
    if (!empty($meetingLink)) {
        $descText .= "Pautan Mesyuarat (Online): " . $meetingLink . "\n\n";
    }
    $descText .= "---\nDijana oleh Sistem MY-PMO PKPMP (Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia)";

    // Escape aksara khas iCal mengikut RFC 5545
    $summaryEscaped = preg_replace('/([\,;])/', '\\\$1', $title);
    $locationEscaped = preg_replace('/([\,;])/', '\\\$1', $location);
    $descEscaped = str_replace(["\r\n", "\n", "\r"], "\\n", $descText);
    $descEscaped = preg_replace('/([\,;])/', '\\\$1', $descEscaped);

    $attendeesLines = [];
    
    // 1. Peserta Wajib (To - REQ-PARTICIPANT)
    if (!empty($event['attendees'])) {
        $att = is_array($event['attendees']) ? $event['attendees'] : json_decode($event['attendees'], true);
        if (is_array($att)) {
            foreach ($att as $email) {
                $email = trim($email);
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $attendeesLines[] = "ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN={$email}:mailto:{$email}";
                }
            }
        }
    }

    // 2. Peserta Salinan (CC - OPT-PARTICIPANT)
    if (!empty($ccList) && is_array($ccList)) {
        foreach ($ccList as $ccEmail) {
            $ccEmail = trim($ccEmail);
            if (filter_var($ccEmail, FILTER_VALIDATE_EMAIL)) {
                $attendeesLines[] = "ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=OPT-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN={$ccEmail}:mailto:{$ccEmail}";
            }
        }
    }

    $ics = "BEGIN:VCALENDAR\r\n";
    $ics .= "VERSION:2.0\r\n";
    $ics .= "PRODID:-//MY-PMO PKPMP//Sistem Pengurusan Projek Kehakiman//MY\r\n";
    $ics .= "CALSCALE:GREGORIAN\r\n";
    $ics .= "METHOD:REQUEST\r\n";
    $ics .= "BEGIN:VEVENT\r\n";
    $ics .= "UID:{$uid}\r\n";
    $ics .= "DTSTAMP:{$dtStamp}\r\n";
    $ics .= "DTSTART:{$dtStart}\r\n";
    $ics .= "DTEND:{$dtEnd}\r\n";
    $ics .= "SUMMARY:{$summaryEscaped}\r\n";
    $ics .= "DESCRIPTION:{$descEscaped}\r\n";
    if (!empty($location)) {
        $ics .= "LOCATION:{$locationEscaped}\r\n";
    }
    if (!empty($meetingLink)) {
        $ics .= "URL:{$meetingLink}\r\n";
    }
    $ics .= "ORGANIZER;CN=Urusetia PMO PKPMP:mailto:noreply-mypmo@kehakiman.gov.my\r\n";
    foreach ($attendeesLines as $attLine) {
        $ics .= "{$attLine}\r\n";
    }
    $ics .= "STATUS:CONFIRMED\r\n";
    $ics .= "SEQUENCE:0\r\n";
    $ics .= "TRANSP:OPAQUE\r\n";
    $ics .= "END:VEVENT\r\n";
    $ics .= "END:VCALENDAR\r\n";

    return $ics;
}

// Helper: Hantar emel jemputan kalendar melalui Socket SMTP Mailer Sebenar
function dispatchMeetingEmail($pdo, $event, $attendeesArr, $ccArr = [], $bccArr = [], $templateId = null) {
    if (empty($attendeesArr)) {
        return [
            "status" => "error",
            "message" => "Tiada penerima e-mel utama (To) dibekalkan."
        ];
    }

    // Ambil tetapan SMTP
    $smtpStmt = $pdo->query("SELECT * FROM smtp_settings WHERE id = 1 LIMIT 1");
    $smtp = $smtpStmt->fetch(PDO::FETCH_ASSOC);

    // Ambil Templat E-mel jika dipilih atau ambil default
    $template = null;
    if (!empty($templateId)) {
        $tStmt = $pdo->prepare("SELECT * FROM email_templates WHERE id = ?");
        $tStmt->execute([$templateId]);
        $template = $tStmt->fetch(PDO::FETCH_ASSOC);
    }
    if (!$template) {
        $tStmt = $pdo->query("SELECT * FROM email_templates WHERE is_default = 1 LIMIT 1");
        $template = $tStmt->fetch(PDO::FETCH_ASSOC);
    }

    // Gantian pembolehubah pintar
    $timeStr = substr($event['start_time'] ?? '09:00:00', 0, 5) . " - " . substr($event['end_time'] ?? '10:00:00', 0, 5);
    $locationStr = !empty($event['location']) ? $event['location'] : 'Bilik Mesyuarat Utama Istana Kehakiman';
    $agendaStr = !empty($event['agenda']) ? $event['agenda'] : 'Tiada agenda terperinci dinyatakan.';
    $meetingLinkStr = !empty($event['meeting_link']) ? $event['meeting_link'] : 'Tiada pautan maya';
    $projectNameStr = !empty($event['project_name']) ? $event['project_name'] : 'Umum PKPMP';

    $replacements = [
        '{TAJUK_MESYUARAT}' => $event['title'],
        '{TAJUK}' => $event['title'],
        '{TARIKH}' => $event['event_date'],
        '{MASA}' => $timeStr,
        '{LOKASI}' => $locationStr,
        '{AGENDA}' => $agendaStr,
        '{PAUTAN_MEETING}' => $meetingLinkStr,
        '{PAUTAN}' => $meetingLinkStr,
        '{PROJEK}' => $projectNameStr
    ];

    if ($template) {
        $subject = str_replace(array_keys($replacements), array_values($replacements), $template['subject']);
        $rawBody = str_replace(array_keys($replacements), array_values($replacements), $template['body']);
    } else {
        $subject = "Jemputan Mesyuarat: " . $event['title'] . " (" . $event['event_date'] . ")";
        $rawBody = "Dengan hormatnya dimaklumkan bahawa mesyuarat {$event['title']} akan diadakan pada {$event['event_date']} jam {$timeStr} bertempat di {$locationStr}.\n\nAGENDA:\n{$agendaStr}";
    }

    // Format HTML universal serasi Outlook, Zimbra, Gmail
    $htmlContent = "
    <div style='font-family: Arial, Helvetica, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 12px; overflow: hidden; background-color: #ffffff;'>
        <div style='background-color: #0f172a; padding: 24px; color: #ffffff; text-align: left;'>
            <div style='font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #818cf8; margin-bottom: 4px;'>
                Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)
            </div>
            <h2 style='margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.3;'>
                " . htmlspecialchars($event['title'], ENT_QUOTES, 'UTF-8') . "
            </h2>
        </div>
        <div style='padding: 24px; color: #334155; font-size: 13.5px; line-height: 1.6;'>
            <div style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px;'>
                <table style='width: 100%; border-collapse: collapse; font-size: 13px;'>
                    <tr>
                        <td style='padding: 6px 0; font-weight: bold; color: #64748b; width: 120px;'>Tarikh:</td>
                        <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$event['event_date']}</td>
                    </tr>
                    <tr>
                        <td style='padding: 6px 0; font-weight: bold; color: #64748b;'>Masa:</td>
                        <td style='padding: 6px 0; font-weight: bold; color: #0f172a;'>{$timeStr}</td>
                    </tr>
                    <tr>
                        <td style='padding: 6px 0; font-weight: bold; color: #64748b;'>Lokasi:</td>
                        <td style='padding: 6px 0; color: #0f172a;'>" . htmlspecialchars($locationStr, ENT_QUOTES, 'UTF-8') . "</td>
                    </tr>" .
                    (!empty($event['meeting_link']) ? "
                    <tr>
                        <td style='padding: 6px 0; font-weight: bold; color: #64748b;'>Pautan Maya:</td>
                        <td style='padding: 6px 0;'><a href='{$event['meeting_link']}' target='_blank' style='color: #4f46e5; font-weight: bold; text-decoration: underline;'>Sertai Microsoft Teams / Sesi Maya</a></td>
                    </tr>" : "") .
                    (!empty($event['project_name']) ? "
                    <tr>
                        <td style='padding: 6px 0; font-weight: bold; color: #64748b;'>Projek:</td>
                        <td style='padding: 6px 0; color: #0f172a;'>" . htmlspecialchars($event['project_name'], ENT_QUOTES, 'UTF-8') . "</td>
                    </tr>" : "") . "
                </table>
            </div>

            <div style='margin-bottom: 20px; white-space: pre-wrap;'>
                " . nl2br(htmlspecialchars($rawBody, ENT_QUOTES, 'UTF-8')) . "
            </div>

            " . (!empty($event['agenda']) ? "
            <div style='background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;'>
                <strong style='color: #1e3a8a; display: block; margin-bottom: 6px; font-size: 13px;'>AGENDA MESYUARAT:</strong>
                <pre style='font-family: inherit; margin: 0; white-space: pre-wrap; font-size: 13px; color: #1e293b; line-height: 1.5;'>" . htmlspecialchars($event['agenda'], ENT_QUOTES, 'UTF-8') . "</pre>
            </div>" : "") . "

            <div style='border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 11.5px; color: #64748b;'>
                <p style='margin: 0;'>
                    E-mel ini disertakan bersama fail kalendar rasmi (<strong>invite.ics</strong>). Sila tekan butang <strong>Accept / Terima</strong> di perisian Microsoft Outlook, Zimbra, atau Google Calendar anda untuk menyimpan temujanji ini ke dalam kalendar peribadi secara automatik.
                </p>
            </div>
        </div>
        <div style='background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;'>
            Sistem Pengurusan & Pemantauan Projek (MY-PMO) | Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia
        </div>
    </div>";

    $plainBody = $rawBody . "\n\nAGENDA:\n" . $agendaStr . "\n\nTarikh: {$event['event_date']}\nMasa: {$timeStr}\nLokasi: {$locationStr}";

    // Jana fail .ics lengkap dengan To dan CC
    $icsData = generateICSContent($event, $ccArr);

    // Hantar melalui soket SMTP
    return sendSmtpEmail($smtp, $attendeesArr, $subject, $htmlContent, $plainBody, $icsData, $ccArr, $bccArr);
}

if ($method === 'GET') {
    // Tindakan Muat Turun Fail .ics (Outlook Desktop, Zimbra, Apple Calendar)
    if (isset($_GET['action']) && $_GET['action'] === 'download_ics') {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $cleanId = str_starts_with($id, 'custom_') ? intval(substr($id, 7)) : intval($id);
        
        if (!$cleanId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID acara diperlukan."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("SELECT * FROM calendar_events WHERE id = ?");
            $stmt->execute([$cleanId]);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$event) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Acara mesyuarat tidak ditemui."]);
                exit;
            }

            $ccList = [];
            if (!empty($event['cc_emails'])) {
                $decodedCc = json_decode($event['cc_emails'], true);
                $ccList = is_array($decodedCc) ? $decodedCc : [];
            }

            $icsContent = generateICSContent($event, $ccList);
            $safeTitle = preg_replace('/[^a-zA-Z0-9_-]/', '_', $event['title']);
            $filename = "mesyuarat_" . $safeTitle . ".ics";

            header('Content-Type: text/calendar; charset=utf-8; method=REQUEST');
            header('Content-Disposition: attachment; filename="' . $filename . '"');
            header('Content-Length: ' . strlen($icsContent));
            echo $icsContent;
            exit;
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat menjana fail kalendar: " . $e->getMessage()]);
            exit;
        }
    }

    $month = $_GET['month'] ?? null; // cth: '2026-09'
    $projectId = isset($_GET['project_id']) && !empty($_GET['project_id']) ? intval($_GET['project_id']) : null;

    try {
        $events = [];

        // 1. Tasks due dates
        $taskSql = "SELECT t.id, t.project_id, t.title, t.due_date as event_date, t.priority, t.status, p.name as project_name 
                    FROM tasks t 
                    JOIN projects p ON t.project_id = p.id 
                    WHERE t.due_date IS NOT NULL " . ($projectId ? "AND t.project_id = ? " : "");
        $taskStmt = $pdo->prepare($taskSql);
        $taskStmt->execute($projectId ? [$projectId] : []);
        $tasks = $taskStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($tasks as $t) {
            $isUrgent = ($t['priority'] === 'Segera' || $t['priority'] === 'Tinggi');
            $events[] = [
                "id" => "task_" . $t['id'],
                "real_id" => $t['id'],
                "title" => "Tugasan: " . $t['title'],
                "event_date" => $t['event_date'],
                "start_time" => "09:00",
                "end_time" => "17:00",
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
                     WHERE g.planned_end IS NOT NULL " . ($projectId ? "AND g.project_id = ? " : "");
        $ganttStmt = $pdo->prepare($ganttSql);
        $ganttStmt->execute($projectId ? [$projectId] : []);
        $gantts = $ganttStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($gantts as $g) {
            $isMilestone = $g['is_milestone'] == 1;
            $events[] = [
                "id" => "gantt_" . $g['id'],
                "real_id" => $g['id'],
                "title" => ($isMilestone ? "Pencapaian: " : "Fasa: ") . $g['title'],
                "event_date" => $g['event_date'],
                "start_time" => "09:00",
                "end_time" => "17:00",
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
                    WHERE end_date IS NOT NULL " . ($projectId ? "AND id = ? " : "");
        $projStmt = $pdo->prepare($projSql);
        $projStmt->execute($projectId ? [$projectId] : []);
        $projs = $projStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($projs as $p) {
            $events[] = [
                "id" => "proj_" . $p['id'],
                "real_id" => $p['id'],
                "title" => "Penyerahan Projek: " . $p['name'],
                "event_date" => $p['event_date'],
                "start_time" => "09:00",
                "end_time" => "17:00",
                "type" => "deadline",
                "category_label" => "Tarikh Akhir Projek",
                "project_id" => $p['id'],
                "project_name" => $p['name'],
                "status" => $p['status'],
                "color" => "bg-rose-600",
                "is_editable" => false
            ];
        }

        // 4. Custom Calendar Events (Meetings, Reviews, Sessions)
        $calSql = "SELECT c.id, c.project_id, c.title, c.event_date, c.start_time, c.end_time, 
                          c.event_type, c.location, c.meeting_link, c.description, c.agenda, 
                          c.attendees, c.cc_emails, c.bcc_emails, c.template_id, c.invite_status, 
                          p.name as project_name 
                   FROM calendar_events c 
                   LEFT JOIN projects p ON c.project_id = p.id 
                   WHERE 1=1 " . ($projectId ? "AND (c.project_id = ? OR c.project_id IS NULL) " : "");
        $calStmt = $pdo->prepare($calSql);
        $calStmt->execute($projectId ? [$projectId] : []);
        $customs = $calStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($customs as $c) {
            $cType = $c['event_type'] ?? 'meeting';
            $color = ($cType === 'meeting' ? 'bg-slate-800' : ($cType === 'review' ? 'bg-amber-500' : ($cType === 'deadline' ? 'bg-rose-500' : 'bg-indigo-600')));
            $label = ($cType === 'meeting' ? 'Mesyuarat PMO' : ($cType === 'review' ? 'Semakan Bajet/Kontrak' : 'Acara Khas'));

            $attArray = [];
            if (!empty($c['attendees'])) {
                $decoded = json_decode($c['attendees'], true);
                if (is_array($decoded)) $attArray = $decoded;
            }

            $ccArray = [];
            if (!empty($c['cc_emails'])) {
                $decodedCc = json_decode($c['cc_emails'], true);
                if (is_array($decodedCc)) $ccArray = $decodedCc;
            }

            $bccArray = [];
            if (!empty($c['bcc_emails'])) {
                $decodedBcc = json_decode($c['bcc_emails'], true);
                if (is_array($decodedBcc)) $bccArray = $decodedBcc;
            }

            $events[] = [
                "id" => "custom_" . $c['id'],
                "real_id" => $c['id'],
                "title" => $c['title'],
                "event_date" => $c['event_date'],
                "start_time" => substr($c['start_time'] ?? '09:00:00', 0, 5),
                "end_time" => substr($c['end_time'] ?? '10:00:00', 0, 5),
                "type" => $cType,
                "category_label" => $label,
                "project_id" => $c['project_id'],
                "project_name" => $c['project_name'] ?? 'Umum PKPMP',
                "location" => $c['location'] ?? '',
                "meeting_link" => $c['meeting_link'] ?? '',
                "description" => $c['description'] ?? '',
                "agenda" => $c['agenda'] ?? '',
                "attendees" => $attArray,
                "cc_emails" => $ccArray,
                "bcc_emails" => $bccArray,
                "template_id" => $c['template_id'] ?? null,
                "invite_status" => $c['invite_status'] ?? 'draft',
                "color" => $color,
                "is_editable" => true
            ];
        }

        // Filter mengikut bulan (YYYY-MM)
        if ($month) {
            $filtered = [];
            foreach ($events as $ev) {
                if (substr($ev['event_date'], 0, 7) === $month) {
                    $filtered[] = $ev;
                }
            }
            $events = $filtered;
        }

        // Susun mengikut kronologi tarikh & masa
        usort($events, function($a, $b) {
            $cmp = strcmp($a['event_date'], $b['event_date']);
            if ($cmp === 0) {
                return strcmp($a['start_time'] ?? '00:00', $b['start_time'] ?? '00:00');
            }
            return $cmp;
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
    $userId = $input['user_id'] ?? 1;

    if ($action === 'create_event') {
        $title = trim($input['title'] ?? '');
        $eventDate = trim($input['event_date'] ?? '');
        $startTime = !empty($input['start_time']) ? trim($input['start_time']) : '09:00:00';
        $endTime = !empty($input['end_time']) ? trim($input['end_time']) : '10:00:00';
        $eventType = in_array($input['event_type'] ?? '', ['meeting', 'milestone', 'deadline', 'task', 'review']) ? $input['event_type'] : 'meeting';
        $location = trim($input['location'] ?? '');
        $meetingLink = trim($input['meeting_link'] ?? '');
        $projectId = !empty($input['project_id']) ? intval($input['project_id']) : null;
        $description = trim($input['description'] ?? '');
        $agenda = trim($input['agenda'] ?? '');
        $templateId = !empty($input['template_id']) ? intval($input['template_id']) : null;
        
        // Pengendalian To, CC, BCC
        $formatList = function($raw) {
            if (is_array($raw)) return array_values(array_unique(array_filter(array_map('trim', $raw))));
            if (is_string($raw)) {
                $parts = explode(',', str_replace([';', "\n", "\r"], ',', $raw));
                return array_values(array_unique(array_filter(array_map('trim', $parts))));
            }
            return [];
        };

        $attendeesArr = $formatList($input['attendees'] ?? []);
        $ccArr = $formatList($input['cc_emails'] ?? []);
        $bccArr = $formatList($input['bcc_emails'] ?? []);

        $attendeesJson = json_encode($attendeesArr);
        $ccJson = json_encode($ccArr);
        $bccJson = json_encode($bccArr);

        $sendInvite = !empty($input['send_invite']);
        $inviteStatus = $sendInvite ? 'sent' : 'draft';

        if (empty($title) || empty($eventDate)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Tajuk dan tarikh acara adalah wajib."]);
            exit;
        }

        try {
            $sql = "INSERT INTO calendar_events (project_id, title, event_date, start_time, end_time, event_type, location, meeting_link, description, agenda, attendees, cc_emails, bcc_emails, template_id, invite_status, created_by) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$projectId, $title, $eventDate, $startTime, $endTime, $eventType, $location, $meetingLink, $description, $agenda, $attendeesJson, $ccJson, $bccJson, $templateId, $inviteStatus, $userId]);
            $newId = $pdo->lastInsertId();

            $eventRecord = [
                "id" => $newId,
                "title" => $title,
                "event_date" => $eventDate,
                "start_time" => $startTime,
                "end_time" => $endTime,
                "location" => $location,
                "meeting_link" => $meetingLink,
                "description" => $description,
                "agenda" => $agenda,
                "attendees" => $attendeesArr,
                "cc_emails" => $ccArr,
                "bcc_emails" => $bccArr,
                "template_id" => $templateId
            ];

            $mailReport = null;
            if ($sendInvite && !empty($attendeesArr)) {
                $mailReport = dispatchMeetingEmail($pdo, $eventRecord, $attendeesArr, $ccArr, $bccArr, $templateId);
            }

            recordAudit($pdo, $userId, 'CREATE', 'Kalendar', "Mencipta acara kalendar: $title ($eventDate $startTime)");

            echo json_encode([
                "status" => "success",
                "message" => "Acara mesyuarat berjaya disimpan.",
                "mail_report" => $mailReport,
                "data" => [
                    "id" => "custom_" . $newId,
                    "real_id" => $newId,
                    "title" => $title,
                    "event_date" => $eventDate,
                    "start_time" => substr($startTime, 0, 5),
                    "end_time" => substr($endTime, 0, 5),
                    "type" => $eventType,
                    "location" => $location,
                    "meeting_link" => $meetingLink,
                    "project_id" => $projectId,
                    "description" => $description,
                    "agenda" => $agenda,
                    "attendees" => $attendeesArr,
                    "cc_emails" => $ccArr,
                    "bcc_emails" => $bccArr,
                    "template_id" => $templateId,
                    "invite_status" => $inviteStatus,
                    "is_editable" => true
                ]
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat menyimpan acara: " . $e->getMessage()]);
        }
        exit;
    }

    // Tindakan Hantar Semula Jemputan E-mel Kalendar (Universal SMTP)
    if ($action === 'send_invitation') {
        $id = isset($input['event_id']) ? $input['event_id'] : null;
        $cleanId = str_starts_with($id, 'custom_') ? intval(substr($id, 7)) : intval($id);

        if (!$cleanId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "ID acara mesyuarat diperlukan."]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("SELECT c.*, p.name as project_name FROM calendar_events c LEFT JOIN projects p ON c.project_id = p.id WHERE c.id = ?");
            $stmt->execute([$cleanId]);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$event) {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Acara mesyuarat tidak ditemui."]);
                exit;
            }

            $formatList = function($raw) {
                if (is_array($raw)) return array_values(array_unique(array_filter(array_map('trim', $raw))));
                if (is_string($raw)) {
                    $parts = explode(',', str_replace([';', "\n", "\r"], ',', $raw));
                    return array_values(array_unique(array_filter(array_map('trim', $parts))));
                }
                return [];
            };

            $attendeesArr = isset($input['attendees']) ? $formatList($input['attendees']) : $formatList(json_decode($event['attendees'] ?? '[]', true));
            $ccArr = isset($input['cc_emails']) ? $formatList($input['cc_emails']) : $formatList(json_decode($event['cc_emails'] ?? '[]', true));
            $bccArr = isset($input['bcc_emails']) ? $formatList($input['bcc_emails']) : $formatList(json_decode($event['bcc_emails'] ?? '[]', true));
            $templateId = !empty($input['template_id']) ? intval($input['template_id']) : ($event['template_id'] ?? null);

            if (empty($attendeesArr)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Tiada alamat e-mel penerima utama (To) didaftarkan."]);
                exit;
            }

            // Kemaskini dalam pangkalan data
            $updateStmt = $pdo->prepare("UPDATE calendar_events SET attendees = ?, cc_emails = ?, bcc_emails = ?, template_id = ?, invite_status = 'sent' WHERE id = ?");
            $updateStmt->execute([json_encode($attendeesArr), json_encode($ccArr), json_encode($bccArr), $templateId, $cleanId]);

            $event['attendees'] = $attendeesArr;
            $event['cc_emails'] = $ccArr;
            $event['bcc_emails'] = $bccArr;

            $mailResult = dispatchMeetingEmail($pdo, $event, $attendeesArr, $ccArr, $bccArr, $templateId);

            recordAudit($pdo, $userId, 'SEND_INVITE', 'Kalendar', "Menghantar jemputan mesyuarat universal bagi: {$event['title']}");

            echo json_encode([
                "status" => "success",
                "message" => "Permintaan penghantaran jemputan mesyuarat telah diproses.",
                "mail_report" => $mailResult
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Ralat pelayan: " . $e->getMessage()]);
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
