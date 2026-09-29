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
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

// Verificar archivo
if (
    !isset($_FILES['image']) ||
    $_FILES['image']['error'] !== UPLOAD_ERR_OK
) {
    echo json_encode([
        'success' => false,
        'error' => 'No se recibió ninguna imagen'
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

$file = $_FILES['image'];

// Tamaño máximo: 10 MB
$maxSize = 10 * 1024 * 1024;

if ($file['size'] > $maxSize) {
    echo json_encode([
        'success' => false,
        'error' => 'La imagen supera los 10 MB'
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

// Tipos permitidos
$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp'
];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!isset($allowedMimeTypes[$mimeType])) {
    echo json_encode([
        'success' => false,
        'error' => 'Formato de imagen no permitido'
    ],JSON_UNESCAPED_UNICODE);
    exit;
}



// HASH DEL FICHERO
$fileHash = hash_file(
    'sha256',
    $file['tmp_name']
);

// Buscar duplicados
$sql = "SELECT
            id_image,
            filepath
        FROM images
        WHERE file_hash = ? AND id_iglesia = ?
        LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "si",
    $fileHash,
    $id_iglesia
);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $stmt->close();

    echo json_encode([
        'success'    => true,
        'duplicado'  => true,
        'mensaje'    => 'La imagen ya existe.',
        'id_image'   => (int)$row['id_image'],
        'filepath'   => '/' . $row['filepath']
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt->close();



// Carpeta destino
$uploadDir = '../uploads/fondos/' . $id_iglesia .'/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Extensión
$extension = $allowedMimeTypes[$mimeType];

// Nombre único
$filename = uniqid('bg_', true) . '.' . $extension;

// Ruta física para guardar
$filepath = $uploadDir . $filename;

// Guardar archivo
if (!move_uploaded_file($file['tmp_name'], $filepath)) {

    echo json_encode([
        'success' => false,
        'error' => 'No se pudo guardar la imagen'
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

// Ruta relativa para BD y para mostrar en web
$filepathDb = 'uploads/fondos/' . $id_iglesia . '/' . $filename;

// Guardar en tabla images
$sql = "INSERT INTO images
        (
            filename,
            filepath,
            mime_type,
            file_size,
            file_hash,
            id_user,
            id_iglesia
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "sssisii",
    $file['name'],
    $filepathDb,
    $mimeType,
    $file['size'],
    $fileHash,
    $id_user,
    $id_iglesia
);
$result = $stmt->execute();

$id_image = $conn->insert_id;

$stmt->close();

// Opcional: asociar el fondo al usuario
/*
$sql = "
    UPDATE users
    SET id_background_image = ?
    WHERE id_user = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id_image, $id_user);
$stmt->execute();
$stmt->close();
*/

if($result){
    $result_data = [
        'success'  => true,
        'mensaje' => 'Fondo guardado correctamente.',
        'id_image' => $id_image,
        'filepath' => '/' . $filepathDb
    ];
}else{
    $result_data = [
        'success'  => false,
        'mensaje' => 'Error al subir la imagen.',
        'conn_error' => $conn->error
    ];
}

echo json_encode($result_data,JSON_UNESCAPED_UNICODE);