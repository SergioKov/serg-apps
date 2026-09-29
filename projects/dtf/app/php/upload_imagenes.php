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
    !isset($_FILES['images']) ||
    empty($_FILES['images']['name'])
) {
    echo json_encode([
        'success' => false,
        'error' => 'No se recibió ninguna imagen'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// Tamaño máximo: 10 MB
$maxSize = 10 * 1024 * 1024;

// Tipos permitidos
$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif'
];






























// Carpeta destino
$uploadDir = '../uploads/fondos/' . $id_iglesia .'/';

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}


$resultados = [];

foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {

    $file = [
        'name'     => $_FILES['images']['name'][$index],
        'tmp_name' => $_FILES['images']['tmp_name'][$index],
        'size'     => $_FILES['images']['size'][$index],
        'error'    => $_FILES['images']['error'][$index]
    ];

    $resultados[] = guardarImagen(
        $file,
        $conn,
        $id_user,
        $id_iglesia,
        $uploadDir,
        $maxSize,
        $allowedMimeTypes
    );
}


// Respuesta final
$result_data = [
    'success' => true,
    'imagenes' => $resultados
];

echo json_encode($result_data,JSON_UNESCAPED_UNICODE);




//funciones
function guardarImagen(
    array $file,
    mysqli $conn,
    int $id_user,
    int $id_iglesia,
    string $uploadDir,
    int $maxSize,
    array $allowedMimeTypes
) {

    // Tamaño
    if ($file['size'] > $maxSize) {
        return [
            'success' => false,
            'filename' => $file['name'],
            'error' => 'La imagen supera los 10 MB'
        ];
    }

    // MIME real
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    // Formato permitido
    if (!isset($allowedMimeTypes[$mimeType])) {
        return [
            'success' => false,
            'filename' => $file['name'],
            'error' => 'Formato de imagen no permitido'
        ];
    }

    // Hash SHA256
    $fileHash = hash_file(
        'sha256',
        $file['tmp_name']
    );

    // Buscar duplicados
    $sql = "SELECT
                id_image,
                filepath
            FROM images
            WHERE file_hash = ?
            AND id_iglesia = ?
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
        
        return [
            'success' => true,
            'duplicado' => true,
            'mensaje' => 'La imagen ya existe.',
            'id_image' => (int)$row['id_image'],
            'filepath' => '/' . $row['filepath']
        ];
    }

    $stmt->close();

    // Extensión
    $extension = $allowedMimeTypes[$mimeType];

    // Nombre único
    $filename = uniqid('bg_', true) . '.' . $extension;

    // Ruta física
    $filepath = $uploadDir . $filename;

    // Guardar fichero
    if (!move_uploaded_file($file['tmp_name'],$filepath) ){
        return [
            'success' => false,
            'filename' => $file['name'],
            'error' => 'No se pudo guardar la imagen'
        ];
    }

    // Ruta BD
    $filepathDb = 'uploads/fondos/' . $id_iglesia . '/' . $filename;

    // Insertar en BD
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
                ?, ?, ?, ?, ?, ?, ?
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

    if (!$result) {
        return [
            'success' => false,
            'filename' => $file['name'],
            'error' => $conn->error
        ];
    }

    return [
        'success' => true,
        'duplicado' => false,
        'mensaje' => 'Fondo guardado correctamente.',
        'id_image' => $id_image,
        'filepath' => '/' . $filepathDb
    ];
}