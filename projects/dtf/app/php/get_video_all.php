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
            v.id_video,
            v.title,
            v.note,

            m.id_media,
            m.filename,
            m.filepath,
            m.media_type,
            m.mime_type,
            m.file_size,
            m.created_at,
            m.is_active
        FROM videos v
        LEFT JOIN media m ON v.id_media = m.id_media
        WHERE m.id_iglesia = ? AND m.es_pelicula = 1
        ORDER BY v.created_at DESC
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_iglesia
);
$stmt->execute();
$result = $stmt->get_result();

$arr_video = [];

while ($row = $result->fetch_assoc()) {

    $arr_video[] = [
        'id_video'    => (int)$row['id_video'],
        'title'       => $row['title'],
        'note'        => $row['note'],
        'id_media'    => (int)$row['id_media'],
        'filename'    => $row['filename'],
        'filepath'    => '/' . $row['filepath'],
        'media_type'  => $row['media_type'],
        'mime_type'   => $row['mime_type'],
        'file_size'   => (int)$row['file_size'],
        'created_at'  => $row['created_at'],
        'is_active'   => (int)$row['is_active']
    ];
}

$stmt->close();


//hay videos
if (count($arr_video) > 0) {//hay videos

    echo json_encode([
        'success' => true,
        'video' => $arr_video
    ], JSON_UNESCAPED_UNICODE);

} else {//no hay videos

    echo json_encode([
        'success' => false,
        'error' => 'No hay vídeos subidos.',
        'video' => []
    ], JSON_UNESCAPED_UNICODE);

}


?>