<?php
// api/functions/mailer.php
// Enjin Penghantaran E-mel SMTP Sebenar (Universal: Outlook, Zimbra, Gmail, Apple Mail)
// Pejabat Ketua Pendaftar Mahkamah Persekutuan Malaysia (PKPMP)

function sendSmtpEmail($smtpConfig, $toEmails, $subject, $htmlContent, $plainText = '', $icsAttachment = null, $ccEmails = [], $bccEmails = []) {
    $host = trim($smtpConfig['smtp_host'] ?? '');
    $port = intval($smtpConfig['smtp_port'] ?? 587);
    $encryption = strtolower(trim($smtpConfig['smtp_encryption'] ?? 'tls'));
    $user = trim($smtpConfig['smtp_user'] ?? '');
    $pass = trim($smtpConfig['smtp_pass'] ?? '');
    $fromEmail = trim($smtpConfig['from_email'] ?? 'noreply-mypmo@kehakiman.gov.my');
    $fromName = trim($smtpConfig['from_name'] ?? 'Sistem MY-PMO PKPMP');

    // Pastikan senarai penerima sah
    $normalize = function($list) {
        if (is_array($list)) return array_unique(array_filter(array_map('trim', $list)));
        if (is_string($list)) {
            $parts = explode(',', str_replace([';', "\n", "\r"], ',', $list));
            return array_unique(array_filter(array_map('trim', $parts)));
        }
        return [];
    };

    $toList = array_filter($normalize($toEmails), function($e) { return filter_var($e, FILTER_VALIDATE_EMAIL); });
    $ccList = array_filter($normalize($ccEmails), function($e) { return filter_var($e, FILTER_VALIDATE_EMAIL); });
    $bccList = array_filter($normalize($bccEmails), function($e) { return filter_var($e, FILTER_VALIDATE_EMAIL); });

    $allRecipients = array_unique(array_merge($toList, $ccList, $bccList));

    if (empty($allRecipients)) {
        return [
            "status" => "error",
            "message" => "Tiada alamat e-mel penerima yang sah dibekalkan."
        ];
    }

    if (empty($host) || $port <= 0) {
        return [
            "status" => "error",
            "message" => "Pelayan SMTP belum dikonfigurasikan (Hos atau Port tidak sah)."
        ];
    }

    // Semakan kata laluan: Jika pelayan memerlukan pengesahan tetapi pass kosong
    if (empty($pass) && !empty($user)) {
        return [
            "status" => "warning",
            "code" => "SMTP_NO_AUTH",
            "message" => "Pelayan SMTP ($host:$port) belum mempunyai kata laluan sah dalam tetapan sistem. Sila masukkan kata laluan SMTP di menu Tetapan untuk membolehkan e-mel dihantar secara automatik ke peti masuk Outlook/Zimbra/Gmail.",
            "recipients" => $allRecipients
        ];
    }

    // Sambungan Socket SMTP
    $socketHost = ($encryption === 'ssl' ? 'ssl://' : '') . $host;
    $errno = 0;
    $errstr = '';
    $timeout = 3.5;

    $socket = @fsockopen($socketHost, $port, $errno, $errstr, $timeout);
    if (!$socket) {
        return [
            "status" => "warning",
            "code" => "SMTP_CONNECT_FAILED",
            "message" => "Tidak dapat menyambung ke pelayan SMTP ($host:$port). Kod ralat $errno: $errstr. Sila semak hos dan port dalam menu Tetapan Sistem.",
            "recipients" => $allRecipients
        ];
    }

    stream_set_timeout($socket, 5);

    $readResponse = function($socket) {
        $data = '';
        while ($str = fgets($socket, 515)) {
            $data .= $str;
            if (substr($str, 3, 1) === ' ') break;
        }
        return $data;
    };

    $sendCommand = function($socket, $cmd) use ($readResponse) {
        fputs($socket, $cmd . "\r\n");
        return $readResponse($socket);
    };

    // 1. Baca Greeting awal pelayan
    $greeting = $readResponse($socket);
    if (substr($greeting, 0, 3) !== '220') {
        fclose($socket);
        return [
            "status" => "error",
            "message" => "Pelayan SMTP tidak memulangkan sambutan yang sah: " . trim($greeting)
        ];
    }

    // 2. EHLO
    $ehlo = $sendCommand($socket, "EHLO mypmo.kehakiman.gov.my");

    // 3. STARTTLS jika mod TLS dipilih dan port bukan SSL tulen
    if ($encryption === 'tls') {
        $tlsRes = $sendCommand($socket, "STARTTLS");
        if (substr($tlsRes, 0, 3) === '220') {
            $crypto = @stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if (!$crypto) {
                fclose($socket);
                return [
                    "status" => "error",
                    "message" => "Ralat memulakan sambungan enkripsi TLS dengan pelayan SMTP ($host)."
                ];
            }
            // Hantar EHLO sekali lagi selepas TLS aktif
            $sendCommand($socket, "EHLO mypmo.kehakiman.gov.my");
        }
    }

    // 4. AUTH LOGIN jika ada pengguna & kata laluan
    if (!empty($user) && !empty($pass)) {
        $authRes = $sendCommand($socket, "AUTH LOGIN");
        if (substr($authRes, 0, 3) === '334') {
            $userRes = $sendCommand($socket, base64_encode($user));
            if (substr($userRes, 0, 3) === '334') {
                $passRes = $sendCommand($socket, base64_encode($pass));
                if (substr($passRes, 0, 3) !== '235') {
                    fclose($socket);
                    return [
                        "status" => "error",
                        "code" => "SMTP_AUTH_FAILED",
                        "message" => "Gagal mengotentikasi akaun SMTP ($user). Maklum balas: " . trim($passRes) . ". Sila pastikan kata laluan e-mel di menu Tetapan adalah tepat."
                    ];
                }
            }
        }
    }

    // 5. MAIL FROM
    $mailFromRes = $sendCommand($socket, "MAIL FROM:<{$fromEmail}>");
    if (substr($mailFromRes, 0, 3) !== '250') {
        fclose($socket);
        return [
            "status" => "error",
            "message" => "Ralat menetapkan pengirim e-mel (MAIL FROM): " . trim($mailFromRes)
        ];
    }

    // 6. RCPT TO bagi setiap penerima (To, CC, BCC)
    $acceptedCount = 0;
    foreach ($allRecipients as $rcpt) {
        $rcptRes = $sendCommand($socket, "RCPT TO:<{$rcpt}>");
        if (substr($rcptRes, 0, 3) === '250' || substr($rcptRes, 0, 3) === '251') {
            $acceptedCount++;
        }
    }

    if ($acceptedCount === 0) {
        fclose($socket);
        return [
            "status" => "error",
            "message" => "Pelayan SMTP menolak kesemua alamat e-mel penerima yang dibekalkan."
        ];
    }

    // 7. DATA
    $dataRes = $sendCommand($socket, "DATA");
    if (substr($dataRes, 0, 3) !== '354') {
        fclose($socket);
        return [
            "status" => "error",
            "message" => "Pelayan SMTP tidak bersedia menerima data e-mel: " . trim($dataRes)
        ];
    }

    // 8. BINA MESEJ UNIVERSAL MIME (Sokongan Outlook, Zimbra, Gmail, Apple Mail)
    $boundaryMixed = "----=_Mixed_Boundary_" . md5(uniqid(time(), true));
    $boundaryAlt = "----=_Alt_Boundary_" . md5(uniqid(time(), true));

    $toHeader = implode(', ', $toList);
    $ccHeader = !empty($ccList) ? implode(', ', $ccList) : '';

    $headers = [];
    $headers[] = "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <{$fromEmail}>";
    $headers[] = "To: {$toHeader}";
    if (!empty($ccHeader)) {
        $headers[] = "Cc: {$ccHeader}";
    }
    // Nota: BCC TIDAK dimasukkan ke dalam pengepala terbuka bagi menjamin kerahsiaan
    $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
    $headers[] = "Date: " . date('r');
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Message-ID: <" . md5(uniqid(time(), true)) . "@kehakiman.gov.my>";
    $headers[] = "X-Mailer: MY-PMO PKPMP Universal Enterprise Mailer";
    $headers[] = "Content-Class: urn:content-classes:calendarmessage"; // Microsoft Outlook & Exchange auto-RSVP detector
    $headers[] = "Content-Type: multipart/mixed; boundary=\"{$boundaryMixed}\"";

    $mimeMessage = implode("\r\n", $headers) . "\r\n\r\n";

    // Bahagian 1: Multipart Alternative (Plain Text & HTML)
    $mimeMessage .= "--{$boundaryMixed}\r\n";
    $mimeMessage .= "Content-Type: multipart/alternative; boundary=\"{$boundaryAlt}\"\r\n\r\n";

    // 1A. Text Plain (Fallback)
    $plainBody = !empty($plainText) ? $plainText : strip_tags(str_replace(['<br>', '<br/>', '</p>'], "\n", $htmlContent));
    $mimeMessage .= "--{$boundaryAlt}\r\n";
    $mimeMessage .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $mimeMessage .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $mimeMessage .= chunk_split(base64_encode($plainBody)) . "\r\n";

    // 1B. Text HTML (Paparan kaya rasmi)
    $mimeMessage .= "--{$boundaryAlt}\r\n";
    $mimeMessage .= "Content-Type: text/html; charset=UTF-8\r\n";
    $mimeMessage .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $mimeMessage .= chunk_split(base64_encode($htmlContent)) . "\r\n";

    $mimeMessage .= "--{$boundaryAlt}--\r\n\r\n";

    // Bahagian 2: Text Calendar RFC 5545 iCalendar (.ics)
    if (!empty($icsAttachment)) {
        $mimeMessage .= "--{$boundaryMixed}\r\n";
        $mimeMessage .= "Content-Type: text/calendar; method=REQUEST; charset=UTF-8; component=VEVENT; name=\"invite.ics\"\r\n";
        $mimeMessage .= "Content-Transfer-Encoding: 8bit\r\n";
        $mimeMessage .= "Content-Disposition: inline; filename=\"invite.ics\"\r\n\r\n";
        $mimeMessage .= $icsAttachment . "\r\n\r\n";
    }

    $mimeMessage .= "--{$boundaryMixed}--\r\n";

    // Escape mana-mana titik tunggal pada baris baru (SMTP Data Transparency)
    $mimeMessage = preg_replace('/^\./m', '..', $mimeMessage);

    // Hantar data mesej dan penamat '.'
    fputs($socket, $mimeMessage . "\r\n.\r\n");
    $sendRes = $readResponse($socket);

    // 9. QUIT
    $sendCommand($socket, "QUIT");
    fclose($socket);

    if (substr($sendRes, 0, 3) === '250') {
        return [
            "status" => "success",
            "message" => "E-mel jemputan kalendar berjaya dihantar ke pelayan e-mel.",
            "accepted_count" => $acceptedCount,
            "to" => $toList,
            "cc" => $ccList,
            "bcc" => $bccList
        ];
    } else {
        return [
            "status" => "error",
            "message" => "Pelayan SMTP menolak mesej data: " . trim($sendRes)
        ];
    }
}
