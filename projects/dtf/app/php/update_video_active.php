<?php

header('Content-Type: application/json; charset=utf-8');

include('includes/config.php');
session_start();
include('includes/connect_db.php');
include('functions.php');


// Validar método
if (!in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Solicitud incorrecta.',
        'dic_code' => 'd250'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// Usuario logueado
$id_user = (int)($_SESSION['id_user'] ?? 0);
$id_iglesia = 1;//luego modifico...

if (!$id_user) {
    echo json_encode([
        'success' => false,
        'error' => 'Usuario no autorizado.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// Datos recibidos
$data = json_decode(
    file_get_contents('php://input'),
    true
);

$id_video = (int)($data['id_video'] ?? 0);

//teniendo id_video, saco su id_media de la tabla 'media'
// Obtener iglesia de la imagen
$sql = "SELECT id_media
        FROM videos
        WHERE id_video = ?
        LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_video
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$stmt->close();

if (!$row) {
    echo json_encode([
        'success' => false,
        'error' => 'Según el identificador de vídeo no se ha encontrado ningún fichero media.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_media = (int)$row['id_media'];//sacado de la tabla 'videos' con el id_video recibido

if (!$id_media) {
    echo json_encode([
        'success' => false,
        'error' => 'id_media no válido.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// Obtener iglesia de la imagen
$sql = "SELECT id_iglesia
        FROM media
        WHERE id_media = ?
        LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_media
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$stmt->close();

if (!$row) {
    echo json_encode([
        'success' => false,
        'error' => 'Fichero Media no encontrado.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_iglesia = (int)$row['id_iglesia'];


// Transacción
$conn->begin_transaction();

try {

    // Desactivar todos los videos de la iglesia que son como pelicula
    $sql = "UPDATE media
            SET is_active = 0
            WHERE id_iglesia = ? AND es_pelicula = 1
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "i",
        $id_iglesia
    );
    $stmt->execute();
    $stmt->close();


    // Activar la seleccionada
    $sql = "UPDATE media
            SET is_active = 1
            WHERE id_media = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "i",
        $id_media
    );
    $stmt->execute();
    $stmt->close();


    $conn->commit();

    echo json_encode([
        'success' => true,
        'mensaje' => 'Vídeo activado correctamente.',
        'id_video' => $id_video,
        'id_media' => $id_media
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        'success' => false,
        'error' => 'Error al actualizar el vídeo.',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

}