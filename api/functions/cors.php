<?php
// api/functions/cors.php

// 1. CORS Dynamic Origin Handling (Sokong intranet PKPMP & localhost dengan selamat)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedHostsPattern = '/^(http:\/\/)?(localhost|127\.0\.0\.1|10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|192\.168\.[0-9]{1,3}\.[0-9]{1,3}|.*\.kehakiman\.gov\.my)(:[0-9]+)?$/';

if (!empty($origin)) {
    $parsedHost = parse_url($origin, PHP_URL_HOST);
    $parsedPort = parse_url($origin, PHP_URL_PORT);
    $hostToCheck = $parsedHost . ($parsedPort ? ':' . $parsedPort : '');
    
    if (preg_match($allowedHostsPattern, $hostToCheck)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Credentials: true");
    }
} else {
    // Permintaan dari domain yang sama
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 2. HTTP Security Headers (OWASP Top 10 & Arahan Keselamatan Siber PKPMP)
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: geolocation=(), camera=(), microphone=()");
header("Content-Security-Policy: default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: blob:; connect-src 'self' http: https:;");

// 3. Pastikan format output piawai JSON
header("Content-Type: application/json; charset=UTF-8");
?>
