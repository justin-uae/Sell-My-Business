<?php
// submit.php — Receives business submission from React frontend

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ─── Always return JSON, even on fatal errors ─────────────────────────────────
set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
});

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json');
        }
        echo json_encode(['success' => false, 'message' => 'Server error: ' . $error['message']]);
    }
});

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

require_once __DIR__ . '/email_helper.php';

// ─── Database Configuration ───────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'selsiness_Sellmybusiness_db');
define('DB_USER', 'selsiness_Sellmybusiness_dbuser');
define('DB_PASS', 'xu9k5wj2fahky1ry');

// ─── Upload Configuration ─────────────────────────────────────────────────────
define('UPLOAD_DIR', __DIR__ . '/uploads/submissions/');
define('UPLOAD_URL_BASE', 'uploads/submissions/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('MAX_FILES', 8);

const ALLOWED_TYPES = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

// ─── Parse Input ─────────────────────────────────────────────────────────────
$input = $_POST;

if (empty($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid form data']);
    exit();
}

// ─── Validate Required Fields ─────────────────────────────────────────────────
$required = ['shopify_customer_id', 'business_name', 'industry'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
        exit();
    }
}

// ─── Sanitize ────────────────────────────────────────────────────────────────
$sanitize = fn($v) => htmlspecialchars(strip_tags(trim((string)($v ?? ''))), ENT_QUOTES, 'UTF-8');

// ─── Handle Image Uploads ──────────────────────────────────────────────────────
$imagePaths  = [];
$uploadErrors = [];

if (!empty($_FILES['images']) && !empty($_FILES['images']['name'])) {
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
    }

    $businessSlug = strtolower(trim($input['business_name'] ?? ''));
    $businessSlug = preg_replace('/[^a-z0-9]+/', '-', $businessSlug);
    $businessSlug = trim($businessSlug, '-');
    if ($businessSlug === '') $businessSlug = 'business';

    // Normalise to arrays — some PHP configs flatten single-file uploads
    $names    = (array) $_FILES['images']['name'];
    $tmpNames = (array) $_FILES['images']['tmp_name'];
    $errors   = (array) $_FILES['images']['error'];
    $sizes    = (array) $_FILES['images']['size'];
    $types    = (array) $_FILES['images']['type'];

    $count = min(count($names), MAX_FILES);

    for ($i = 0; $i < $count; $i++) {
        if ($errors[$i] !== UPLOAD_ERR_OK) {
            $uploadErrors[] = "file_{$i}: upload error code {$errors[$i]}";
            continue;
        }
        if ($sizes[$i] > MAX_FILE_SIZE) {
            $uploadErrors[] = "file_{$i}: exceeds 10 MB ({$sizes[$i]} bytes)";
            continue;
        }

        $tmpPath  = $tmpNames[$i];
        $mimeType = function_exists('mime_content_type') ? mime_content_type($tmpPath) : $types[$i];

        if (!isset(ALLOWED_TYPES[$mimeType])) {
            $uploadErrors[] = "file_{$i}: unsupported type '{$mimeType}'";
            continue;
        }

        $filename = $businessSlug . '-' . ($i + 1) . '-' . bin2hex(random_bytes(4)) . '.' . ALLOWED_TYPES[$mimeType];

        if (move_uploaded_file($tmpPath, UPLOAD_DIR . $filename)) {
            $imagePaths[] = UPLOAD_URL_BASE . $filename;
        } else {
            $uploadErrors[] = "file_{$i}: move_uploaded_file failed (check UPLOAD_DIR permissions)";
        }
    }
}

$data = [
    'shopify_customer_id' => $sanitize($input['shopify_customer_id']),
    'business_name'       => $sanitize($input['business_name']),
    'description'         => $sanitize($input['description'] ?? ''),
    'industry'            => $sanitize($input['industry']),
    'location'            => $sanitize($input['location'] ?? ''),
    'year_established'    => $sanitize($input['year_established'] ?? ''),
    'reason_for_sale'     => $sanitize($input['reason_for_sale'] ?? ''),
    'asking_price'        => floatval($input['asking_price'] ?? 0),
    'revenue'             => floatval($input['revenue'] ?? 0),
    'profit'              => floatval($input['profit'] ?? 0),
    'ebitda'              => floatval($input['ebitda'] ?? 0),
    'images'              => implode(',', $imagePaths),
    'status'              => 'pending',
];

// ─── Database Connection ──────────────────────────────────────────────────────
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit();
}

// ─── Create Table If Not Exists ───────────────────────────────────────────────
$pdo->exec("
    CREATE TABLE IF NOT EXISTS business_submissions (
        id                  INT AUTO_INCREMENT PRIMARY KEY,
        shopify_customer_id VARCHAR(64)     NOT NULL,
        business_name       VARCHAR(255)    NOT NULL,
        description         TEXT,
        industry            VARCHAR(100)    NOT NULL,
        location            VARCHAR(100),
        year_established    VARCHAR(10),
        reason_for_sale     TEXT,
        asking_price        DECIMAL(15, 2)  DEFAULT 0,
        revenue             DECIMAL(15, 2)  DEFAULT 0,
        profit              DECIMAL(15, 2)  DEFAULT 0,
        ebitda              DECIMAL(15, 2)  DEFAULT 0,
        images              TEXT,
        status              ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
        updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customer  (shopify_customer_id),
        INDEX idx_status    (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
");

// ─── Insert ───────────────────────────────────────────────────────────────────
try {
    $stmt = $pdo->prepare("
        INSERT INTO business_submissions
            (shopify_customer_id, business_name, description, industry, location,
             year_established, reason_for_sale, asking_price, revenue, profit, ebitda, images, status)
        VALUES
            (:shopify_customer_id, :business_name, :description, :industry, :location,
             :year_established, :reason_for_sale, :asking_price, :revenue, :profit, :ebitda, :images, :status)
    ");
    $stmt->execute($data);
    $insertId = $pdo->lastInsertId();

    // ── Send notification email ───────────────────────────────────────────────
    smb_send_submission_email($data, $imagePaths, (int) $insertId);

    echo json_encode([
        'success'       => true,
        'message'       => 'Submission received successfully',
        'id'            => (int) $insertId,
        'images_saved'  => count($imagePaths),
        'upload_errors' => $uploadErrors,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save submission']);
}
