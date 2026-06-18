<?php
// Shared email helper — included by submit.php and contact.php

define('NOTIFY_EMAIL', 'info@sellmybusiness.ae');
define('FROM_EMAIL',   'no-reply@sellmybusiness.ae');
define('FROM_NAME',    'SellMyBusiness.ae');
define('BRAND_SITE',   'https://sellmybusiness.ae');

// ─── Primary brand colours (kept in sync with Tailwind theme) ────────────────
define('C_NAVY',   '#0B1F3A');
define('C_BLUE',   '#1A56DB');
define('C_GOLD',   '#C9A733');
define('C_GREEN',  '#16A34A');
define('C_BG',     '#F1F5F9');
define('C_CARD',   '#FFFFFF');
define('C_TEXT',   '#0F172A');
define('C_MUTED',  '#64748B');
define('C_BORDER', '#E2E8F0');

function smb_send_mail(string $to, string $subject, string $htmlBody): bool
{
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . FROM_EMAIL . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    return mail($to, $subject, $htmlBody, $headers);
}

function smb_wrap_email(string $preheader, string $bodyHtml): string
{
    $year  = date('Y');
    $navy  = C_NAVY;
    $blue  = C_BLUE;
    $gold  = C_GOLD;
    $bg    = C_BG;
    $card  = C_CARD;
    $text  = C_TEXT;
    $muted = C_MUTED;
    $bdr   = C_BORDER;
    $site  = BRAND_SITE;

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>SellMyBusiness.ae</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:{$bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:{$bg};">{$preheader}&nbsp;‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:{$bg};padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">

        <!-- ── HEADER ── -->
        <tr>
          <td style="background:{$navy};border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
            <a href="{$site}" style="text-decoration:none;">
              <span style="font-size:22px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;">Sell<span style="color:{$blue};">My</span>Business<span style="color:#FFFFFF;">.ae</span></span>
            </a>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="background:{$card};padding:40px;border-left:1px solid {$bdr};border-right:1px solid {$bdr};">
            {$bodyHtml}
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="background:{$navy};border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.05em;text-transform:uppercase;">SellMyBusiness.ae &mdash; Lunar Marketing &amp; Commercial Brokerage</p>
            <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.4);">M Floor, Khalidiya Towers A, Khalidiya, Abu Dhabi, UAE</p>
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);">&copy; {$year} SellMyBusiness.ae. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

// ── Metric box helper (used in submission email) ──────────────────────────────
function smb_metric(string $label, string $value): string
{
    $navy  = C_NAVY;
    $blue  = C_BLUE;
    $muted = C_MUTED;
    return <<<HTML
<td width="25%" style="padding:4px;">
  <div style="background:#F8FAFF;border:1px solid #DBEAFE;border-radius:10px;padding:14px 12px;text-align:center;">
    <p style="margin:0 0 4px;font-size:10px;color:{$muted};text-transform:uppercase;letter-spacing:0.08em;">{$label}</p>
    <p style="margin:0;font-size:16px;font-weight:700;color:{$navy};">{$value}</p>
  </div>
</td>
HTML;
}

// ── Detail row helper ─────────────────────────────────────────────────────────
function smb_row(string $label, string $value): string
{
    $muted = C_MUTED;
    $text  = C_TEXT;
    $bdr   = C_BORDER;
    if ($value === '' || $value === '0' || $value === '0.00') return '';
    return <<<HTML
<tr>
  <td style="padding:10px 0;border-bottom:1px solid {$bdr};font-size:12px;color:{$muted};width:35%;vertical-align:top;">{$label}</td>
  <td style="padding:10px 0;border-bottom:1px solid {$bdr};font-size:13px;color:{$text};font-weight:500;">{$value}</td>
</tr>
HTML;
}

function smb_fmt_aed(float $v): string
{
    return $v > 0 ? 'AED ' . number_format($v, 0) : '—';
}

// ── Full business submission notification email ───────────────────────────────
function smb_send_submission_email(array $data, array $imagePaths, int $id): void
{
    $navy  = C_NAVY;
    $blue  = C_BLUE;
    $gold  = C_GOLD;
    $green = C_GREEN;
    $muted = C_MUTED;
    $text  = C_TEXT;
    $bdr   = C_BORDER;
    $gst  = new DateTimeZone('Asia/Dubai');
    $ts   = (new DateTime('now', $gst))->format('d M Y, g:i A') . ' GST';

    // Data is already HTML-sanitized by submit.php — use directly to avoid double-encoding
    $name         = $data['business_name'];
    $industry     = $data['industry'];
    $location     = $data['location'];
    $yearEst      = $data['year_established'];
    $description  = nl2br($data['description']);
    $reasonSale   = nl2br($data['reason_for_sale']);

    $askingPrice  = smb_fmt_aed((float)$data['asking_price']);
    $revenue      = smb_fmt_aed((float)$data['revenue']);
    $profit       = smb_fmt_aed((float)$data['profit']);
    $ebitda       = smb_fmt_aed((float)$data['ebitda']);

    // Metric grid
    $metrics = '<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;"><tr>'
        . smb_metric('Asking Price', $askingPrice)
        . smb_metric('Revenue', $revenue)
        . smb_metric('Net Profit', $profit)
        . smb_metric('EBITDA', $ebitda)
        . '</tr></table>';

    // Detail rows
    $detailRows = smb_row('Industry',         $industry)
                . smb_row('Location',          $location)
                . smb_row('Year Established',  $yearEst);

    // Description block
    $descBlock = $description ? <<<HTML
<div style="background:#F8FAFF;border-left:3px solid {$blue};border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:20px;">
  <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:{$muted};text-transform:uppercase;letter-spacing:0.08em;">Description</p>
  <p style="margin:0;font-size:13px;color:{$text};line-height:1.7;">{$description}</p>
</div>
HTML : '';

    $reasonBlock = $reasonSale ? <<<HTML
<div style="background:#FFFBEB;border-left:3px solid {$gold};border-radius:0 10px 10px 0;padding:20px 24px;margin-bottom:20px;">
  <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:{$muted};text-transform:uppercase;letter-spacing:0.08em;">Reason for Sale</p>
  <p style="margin:0;font-size:13px;color:{$text};line-height:1.7;">{$reasonSale}</p>
</div>
HTML : '';

    $bodyHtml = <<<HTML
<!-- Badge -->
<div style="display:inline-block;background:{$green};color:#FFFFFF;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:5px 12px;border-radius:100px;margin-bottom:24px;">New Listing #$id</div>

<h1 style="margin:0 0 4px;font-size:28px;font-weight:800;color:{$navy};">{$name}</h1>
<p style="margin:0 0 28px;font-size:13px;color:{$muted};">Submitted {$ts}</p>

{$metrics}

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:28px;">
  {$detailRows}
</table>

{$descBlock}
{$reasonBlock}
HTML;

    $subject = "New Business Submission: {$name} (#{$id}) — SellMyBusiness.ae";
    $html    = smb_wrap_email("New listing submitted: {$name}", $bodyHtml);
    smb_send_mail(NOTIFY_EMAIL, $subject, $html);
}
