<?php

header('Content-Type: application/json');

include('includes/config.php');
session_start();//importante para ver al usuario logueado
include('includes/connect_db.php');
include('functions.php');


//si los datos NO VIENEN desde el metodo permitido
if (!in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
	// Manejar solicitudes incorrectas
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Solicitud incorrecta.',
        'dic_code' => 'd250'
    ],JSON_UNESCAPED_UNICODE);
    exit;
}



$id_user = (int)($_SESSION['id_user'] ?? 0);
$id_iglesia = 1;//luego modifico...

if (!$id_user) {
    echo json_encode([
        'success' => false,
        'error' => 'Usuario no autorizado'
    ]);
    exit;
}

// Obtener imagen activa
$sql = "SELECT
            id_image,
            filename,
            filepath,
            mime_type,
            file_size,
            created_at
        FROM images
        WHERE id_iglesia = ? AND is_active = 1
        LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_iglesia
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stmt->close();


if (!$row) {
    echo json_encode([
        'success' => false,
        'error' => 'No hay imagen activa. Debes subir una imagen o marcar como activa una de las disponibles.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


echo json_encode([
    'success' => true,
    'image' => [
        'id_image'   => (int)$row['id_image'],
        'filename'   => $row['filename'],
        'filepath'   => '/' . $row['filepath'],
        'mime_type'  => $row['mime_type'],
        'file_size'  => (int)$row['file_size'],
        'created_at' => $row['created_at']
    ]
], JSON_UNESCAPED_UNICODE);