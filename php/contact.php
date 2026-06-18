<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
});

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        if (!headers_sent()) { http_response_code(500); header('Content-Type: application/json'); }
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $error['message']]);
    }
});

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { http_response_code(405); echo json_encode(['success' => false, 'message' => 'Method Not Allowed']); exit(); }

require_once __DIR__ . '/email_helper.php';

// ─── Parse & validate ────────────────────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

if (empty($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit();
}

$sanitize = fn($v) => htmlspecialchars(strip_tags(trim((string)($v ?? ''))), ENT_QUOTES, 'UTF-8');

$name    = $sanitize($input['name']    ?? '');
$email   = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone   = $sanitize($input['phone']   ?? '');
$role    = $sanitize($input['role']    ?? 'Not specified');
$message = $sanitize($input['message'] ?? '');

if (!$name) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Name is required']);
    exit();
}
if (!$email) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'A valid email address is required']);
    exit();
}
if (!$message) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Message is required']);
    exit();
}

// ─── Build email ─────────────────────────────────────────────────────────────
$navy  = C_NAVY;
$blue  = C_BLUE;
$gold  = C_GOLD;
$muted = C_MUTED;
$text  = C_TEXT;
$bdr   = C_BORDER;
$ts    = date('d M Y, g:i A T');

$roleColour = match ($role) {
    'Buyer'          => '#DBEAFE',
    'Seller'         => '#FEF9C3',
    'Just Exploring' => '#F0FDF4',
    default          => '#F1F5F9',
};
$roleText = match ($role) {
    'Buyer'          => C_BLUE,
    'Seller'         => '#92400E',
    'Just Exploring' => C_GREEN,
    default          => C_MUTED,
};

$phoneRow = $phone
    ? "<tr><td style='padding:10px 0;border-bottom:1px solid {$bdr};font-size:12px;color:{$muted};width:35%;'>Phone</td><td style='padding:10px 0;border-bottom:1px solid {$bdr};font-size:13px;color:{$text};font-weight:500;'><a href='tel:{$phone}' style='color:{$blue};text-decoration:none;'>{$phone}</a></td></tr>"
    : '';

$bodyHtml = <<<HTML
<!-- Badge -->
<div style="display:inline-block;background:{$gold};color:#FFFFFF;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:24px;">New Enquiry</div>

<h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:{$navy};">Contact Form Submission</h1>
<p style="margin:0 0 28px;font-size:13px;color:{$muted};">Received {$ts}</p>

<!-- Role badge -->
<div style="margin-bottom:28px;">
  <span style="display:inline-block;background:{$roleColour};color:{$roleText};font-size:12px;font-weight:600;padding:6px 16px;border-radius:100px;">
    {$role}
  </span>
</div>

<!-- Detail rows -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid {$bdr};font-size:12px;color:{$muted};width:35%;">Name</td>
    <td style="padding:10px 0;border-bottom:1px solid {$bdr};font-size:13px;color:{$text};font-weight:500;">{$name}</td>
  </tr>
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid {$bdr};font-size:12px;color:{$muted};width:35%;">Email</td>
    <td style="padding:10px 0;border-bottom:1px solid {$bdr};font-size:13px;color:{$text};font-weight:500;"><a href="mailto:{$email}" style="color:{$blue};text-decoration:none;">{$email}</a></td>
  </tr>
  {$phoneRow}
</table>

<!-- Message -->
<div style="background:#F8FAFF;border-left:3px solid {$blue};border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:32px;">
  <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:{$muted};text-transform:uppercase;letter-spacing:0.08em;">Message</p>
  <p style="margin:0;font-size:14px;color:{$text};line-height:1.7;">{$message}</p>
</div>

<!-- Reply CTA -->
<div style="text-align:center;margin-bottom:8px;">
  <a href="mailto:{$email}?subject=Re: Your Enquiry - SellMyBusiness.ae"
     style="display:inline-block;background:{$navy};color:#FFFFFF;font-size:13px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">
    Reply to {$name}
  </a>
</div>
HTML;

$subject = "New Enquiry from {$name} ({$role}) — SellMyBusiness.ae";
$html    = smb_wrap_email("New contact form message from {$name}", $bodyHtml);

$sent = smb_send_mail(NOTIFY_EMAIL, $subject, $html);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again or contact us directly.']);
}
