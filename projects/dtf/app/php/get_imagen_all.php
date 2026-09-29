<?php

header('Content-Type: application/json; charset=utf-8');

include('includes/config.php');
session_start();
include('includes/connect_db.php');
include('functions.php');


// si los datos NO VIENEN desde el método permitido
if (!in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Solicitud incorrecta.',
        'dic_code' => 'd250'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


$id_user = (int)($_SESSION['id_user'] ?? 0);

if (!$id_user) {
    echo json_encode([
        'success' => false,
        'error' => 'Usuario no autorizado'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// TODO: obtener la iglesia del usuario
$id_iglesia = 1;


$sql = "SELECT
            id_image,
            filename,
            filepath,
            mime_type,
            file_size,
            created_at,
            is_active
        FROM images
        WHERE id_iglesia = ?
        ORDER BY created_at DESC
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_iglesia
);
$stmt->execute();
$result = $stmt->get_result();

$arr_images = [];

while ($row = $result->fetch_assoc()) {

    $arr_images[] = [
        'id_image'    => (int)$row['id_image'],
        'filename'    => $row['filename'],
        'filepath'    => '/' . $row['filepath'],
        'mime_type'   => $row['mime_type'],
        'file_size'   => (int)$row['file_size'],
        'created_at'  => $row['created_at'],
        'is_active'   => (int)$row['is_active']
    ];
}

$stmt->close();


//hay imagenes
if (count($arr_images) > 0) {//hay imagenes

    echo json_encode([
        'success' => true,
        'images' => $arr_images
    ], JSON_UNESCAPED_UNICODE);

} else {//no hay imagenes

    echo json_encode([
        'success' => false,
        'error' => 'No hay imágenes personalizadas.',
        'images' => []
    ], JSON_UNESCAPED_UNICODE);

}


?>