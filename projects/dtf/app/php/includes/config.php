<?php

if($_SERVER['HTTP_HOST'] == 'holy-songs.com'){//HOSTALIA
    $entorno = 'production';   
    $arr_metodos = ['POST'];//en PROD siempre!
}else{//LOCALHOST
    $entorno = 'localhost';   
    $arr_metodos = ['POST', 'GET'];//para hacer test...  
}

//$arr_metodos = ['POST', 'GET'];//descomentar para hacer test y comentar en PROD... 


//lo defino luego....
// define('DB_HOST', 'localhost');
// define('DB_NAME', 'database_name');
// define('DB_USER', 'db_user');
// define('DB_PASS', ''); // ← aquí va la contraseña REAL

// Configuración para PHPMailer
define('SMTP_HOST', 'smtp.servidor-correo.net');//servidor SMTP que se usa en phpmailer
define('SMTP_USER', 'contact@holy-songs.com');//el usuario que manda correos
define('SMTP_PASS', 'SergioKov78');//REEMPLAZAR POR LA CONTRASEÑA REAL de Username 'contact@bible-text.com'



//para que funcione CORS en Safari
$allowed_origins = [
    'http://holy-songs.local',
    'https://holy-songs.local',
    'http://holy-songs.com',
    'https://holy-songs.com'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Preflight (Safari)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>