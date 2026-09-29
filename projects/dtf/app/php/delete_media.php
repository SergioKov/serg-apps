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

$id_media = (int)($data['id_media'] ?? 0);

if (!$id_media) {
    echo json_encode([
        'success' => false,
        'error' => 'id_media no válido.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}





// Obtener datos de la imagen
$sql = "SELECT
            id_iglesia,
            filepath,
            is_active
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
        'error' => 'Fichero no encontrado.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_iglesia = (int)$row['id_iglesia'];
$is_active  = (int)$row['is_active'];
$filepathDb = $row['filepath'];








// Transacción
$conn->begin_transaction();

try {

    // Eliminar imagen de la BD
    $sql = "DELETE FROM media
            WHERE id_media = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "i",
        $id_media
    );
    $stmt->execute();
    $stmt->close();

    $new_id_media = null;//luego la reasigno

    // Si era la imagen activa,
    // activar la última añadida
    if ($is_active) {

        $sql = "SELECT id_media
                FROM media
                WHERE id_iglesia = ?
                ORDER BY created_at DESC
                LIMIT 1
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "i",
            $id_iglesia
        );
        $stmt->execute();
        $result = $stmt->get_result();
        $newImage = $result->fetch_assoc();
        $stmt->close();

        if ($newImage) {

            $new_id_media = (int)$newImage['id_media'];

            $sql = "UPDATE media
                    SET is_active = 1
                    WHERE id_media = ?
            ";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param(
                "i",
                $new_id_media
            );
            $stmt->execute();
            $stmt->close();
        }
    }

    $conn->commit();

    // Eliminar fichero físico
    $physicalPath = '../' . $filepathDb;

    if (file_exists($physicalPath) && is_file($physicalPath) ) {
        if (!unlink($physicalPath)) {
            echo json_encode([
                'success' => true,
                'mensaje' => 'Fichero eliminado correctamente de la base de datos pero hubo problemas al eliminarlo físicamente.',
                'id_media' => $id_media,
                'new_id_media_active' => $new_id_media
            ], JSON_UNESCAPED_UNICODE);

            error_log(
                'No se pudo eliminar: '
                . $physicalPath
            );
        }
    }


    echo json_encode([
        'success' => true,
        'mensaje' => 'Fichero eliminado correctamente.',
        'id_media' => $id_media,
        'new_id_media_active' => $new_id_media
    ], JSON_UNESCAPED_UNICODE);


} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        'success' => false,
        'error' => 'Error al eliminar el fichero.',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

    exit;
}







