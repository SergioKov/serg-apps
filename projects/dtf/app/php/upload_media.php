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
    !isset($_FILES['media']) ||
    empty($_FILES['media']['name'])
) {
    echo json_encode([
        'success' => false,
        'error' => 'No se recibió ningún fichero media.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}


// Tamaño máximo: 10 MB
//$maxSize = 10 * 1024 * 1024;
$maxImageSize = 200 * 1024 * 1024;   // antes 40 MB para imagenes
$maxVideoSize = 200 * 1024 * 1024;  // antes 100 MB para vídeo

// Tipos permitidos
$allowedMimeTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'video/mp4' => 'mp4',
    'video/webm' => 'webm'
];



$resultados = [];

foreach ($_FILES['media']['tmp_name'] as $index => $tmpName) {

    $file = [
        'name'     => $_FILES['media']['name'][$index],
        'tmp_name' => $_FILES['media']['tmp_name'][$index],
        'type'     => $_FILES['media']['type'][$index],
        'size'     => $_FILES['media']['size'][$index],
        'error'    => $_FILES['media']['error'][$index]
    ];

    $resultados[] = guardarMedia(
        $file,
        $conn,
        $id_user,
        $id_iglesia,
        $maxImageSize,
        $maxVideoSize,
        $allowedMimeTypes
    );
}


// Respuesta final
$result_data = [
    'success' => true,
    'media' => $resultados
];

echo json_encode($result_data,JSON_UNESCAPED_UNICODE);




//funciones
function guardarMedia(
    array $file,
    mysqli $conn,
    int $id_user,
    int $id_iglesia,
    int $maxImageSize,
    int $maxVideoSize,
    array $allowedMimeTypes
) {

    // Comprobar errores de subida
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return [
            'success'  => false,
            'filename' => $file['name'],
            'error'    => 'Error al subir el archivo.'
        ];
    }

    // MIME real
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    // Tipo de media (compatible con PHP 7.4)
    $media_type = (strpos($mimeType, 'video/') === 0)
        ? 'video'
        : 'image';

    $maxSize = ($media_type === 'video')
        ? $maxVideoSize
        : $maxImageSize;

    // Tamaño máximo
    if ($file['size'] > $maxSize) {
        return [
            'success'  => false,
            'filename' => $file['name'],
            'error'    => ($media_type === 'video')
                ? 'El vídeo supera los 100 MB permitidos.'
                : 'La imagen supera los 40 MB permitidos.'
        ];
    }        

    // Formato permitido
    if (!isset($allowedMimeTypes[$mimeType])) {
        return [
            'success' => false,
            'filename' => $file['name'],
            'error' => 'Formato de archivo no permitido.'
        ];
    }

    // Carpeta destino
    $subcarpeta = ($media_type === 'video')
        ? 'videos'
        : 'imagenes';

    $uploadDir = "../uploads/{$id_iglesia}/fondos/{$subcarpeta}/";

    // Crear la carpeta si no existe
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            return [
                'success'  => false,
                'filename' => $file['name'],
                'error'    => 'No se pudo crear la carpeta de destino.'
            ];
        }
    }

    // Hash SHA256
    $fileHash = hash_file(
        'sha256',
        $file['tmp_name']
    );

    // Buscar duplicados
    $sql = "SELECT
                id_media,
                filepath
            FROM media
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
            'success'    => true,
            'duplicado'  => true,
            'mensaje'    => 'El archivo ya existe.',
            'id_media'   => (int)$row['id_media'],
            'media_type' => $media_type,
            'filepath'   => '/' . $row['filepath']
        ];
    }

    $stmt->close();

    // Extensión
    $extension = $allowedMimeTypes[$mimeType];

    $palabra_inicio_fichero = ($media_type === 'video')
        ? 'video_'
        : 'imagen_';

    // Nombre único
    $filename = uniqid($palabra_inicio_fichero, true) . '.' . $extension;
        

    // Ruta física
    $filepath = $uploadDir . $filename;

    // Guardar fichero
    if (!move_uploaded_file($file['tmp_name'],$filepath) ){
        return [
            'success' => false,
            'filename' => $file['name'],
            'error' => 'No se pudo guardar el archivo.'
        ];
    }

    // Ruta BD
    //$filepathDb = 'uploads/fondos/' . $id_iglesia . '/' . $filename;
    //$filepathDb = 'uploads/media/' . $id_iglesia . '/' . $filename;

    // Ruta relativa para BD
    $filepathDb = "uploads/{$id_iglesia}/fondos/{$subcarpeta}/{$filename}";

    // Insertar en BD
    $sql = "INSERT INTO media
            (
                filename,
                filepath,
                media_type,
                mime_type,
                file_size,
                file_hash,
                id_user,
                id_iglesia
            )
            VALUES
            (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssisii",
        $file['name'],
        $filepathDb,
        $media_type,
        $mimeType,
        $file['size'],
        $fileHash,
        $id_user,
        $id_iglesia
    );
    $result = $stmt->execute();
    $id_media = $conn->insert_id;
    $stmt->close();

    if (!$result) {
        return [
            'success' => false,
            'filename' => $file['name'],
            'error' => $conn->error
        ];
    }

    return [
        'success'   => true,
        'duplicado' => false,
        'mensaje'   => ucfirst($media_type) . ' guardado correctamente.',
        'id_media'  => $id_media,
        'media_type'=> $media_type,
        'filepath'  => '/' . $filepathDb
    ];
}