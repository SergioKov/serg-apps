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
            id_media,
            filename,
            filepath,
            media_type,
            mime_type,
            file_size,
            created_at,
            is_active
        FROM media
        WHERE id_iglesia = ? AND es_pelicula = 0
        ORDER BY created_at DESC
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_iglesia
);
$stmt->execute();
$result = $stmt->get_result();

$arr_media = [];

while ($row = $result->fetch_assoc()) {

    $arr_media[] = [
        'id_media'    => (int)$row['id_media'],
        'filename'    => $row['filename'],
        'filepath'    => '/' . $row['filepath'],
        'media_type'   => $row['media_type'],
        'mime_type'   => $row['mime_type'],
        'file_size'   => (int)$row['file_size'],
        'created_at'  => $row['created_at'],
        'is_active'   => (int)$row['is_active']
    ];
}

$stmt->close();


//hay imagenes
if (count($arr_media) > 0) {//hay imagenes

    echo json_encode([
        'success' => true,
        'media' => $arr_media
    ], JSON_UNESCAPED_UNICODE);

} else {//no hay imagenes

    echo json_encode([
        'success' => false,
        'error' => 'No hay imágenes personalizadas.',
        'media' => []
    ], JSON_UNESCAPED_UNICODE);

}


?>