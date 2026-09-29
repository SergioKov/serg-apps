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

$id_image = (int)($data['id_image'] ?? 0);

if (!$id_image) {
    echo json_encode([
        'success' => false,
        'error' => 'id_image no válido.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}





// Obtener datos de la imagen
$sql = "SELECT
            id_iglesia,
            filepath,
            is_active
        FROM images
        WHERE id_image = ?
        LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_image
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$stmt->close();

if (!$row) {
    echo json_encode([
        'success' => false,
        'error' => 'Imagen no encontrada.'
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
    $sql = "DELETE FROM images
            WHERE id_image = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "i",
        $id_image
    );
    $stmt->execute();
    $stmt->close();

    $new_id_image = null;//luego la reasigno

    // Si era la imagen activa,
    // activar la última añadida
    if ($is_active) {

        $sql = "SELECT id_image
                FROM images
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

            $new_id_image = (int)$newImage['id_image'];

            $sql = "UPDATE images
                    SET is_active = 1
                    WHERE id_image = ?
            ";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param(
                "i",
                $new_id_image
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
                'mensaje' => 'Imagen eliminada correctamente de la base de datos peru hubo problemas al eliminarla físicamente.',
                'id_image' => $id_image,
                'new_id_image_active' => $new_id_image
            ], JSON_UNESCAPED_UNICODE);

            error_log(
                'No se pudo eliminar: '
                . $physicalPath
            );
        }
    }


    echo json_encode([
        'success' => true,
        'mensaje' => 'Imagen eliminada correctamente.',
        'id_image' => $id_image,
        'new_id_image_active' => $new_id_image
    ], JSON_UNESCAPED_UNICODE);


} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        'success' => false,
        'error' => 'Error al eliminar la imagen.',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);

    exit;
}







