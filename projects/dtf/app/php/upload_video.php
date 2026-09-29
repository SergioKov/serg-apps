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
    !isset($_FILES['video']) ||
    empty($_FILES['video']['name'])
) {
    echo json_encode([
        'success' => false,
        'error' => 'No se recibió ningún fichero de vídeo.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}




// Tamaño máximo: 200 MB
$maxVideoSize = 200 * 1024 * 1024;  // antes 100 MB para vídeo

// Tipos permitidos
$allowedMimeTypes = [
    'video/mp4' => 'mp4',
    'video/webm' => 'webm'
];

$file = $_FILES['video'];
$title = trim($_POST['title'] ?? '');
$note = trim($_POST['note'] ?? '');

if($title === ''){
    echo json_encode([
        'success' => false,
        'error'   => 'Debe indicar un título.'
    ]);
    exit;
}

$resultado = guardarVideo(
    $file,
    $conn,
    $id_user,
    $id_iglesia,
    $maxVideoSize,
    $allowedMimeTypes,
    $title,
    $note,
);


// Respuesta final
$result_data = [
    'success' => true,
    'video' => $resultado
];

echo json_encode($result_data,JSON_UNESCAPED_UNICODE);




//funciones
function guardarVideo(
    array $file,
    mysqli $conn,
    int $id_user,
    int $id_iglesia,
    int $maxVideoSize,
    array $allowedMimeTypes,
    $title,
    $note
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
    $media_type = 'video';

    $maxSize = $maxVideoSize;

    // Tamaño máximo
    if ($file['size'] > $maxSize) {
        return [
            'success'  => false,
            'filename' => $file['name'],
            'error'    => 'El vídeo supera los 200 MB permitidos.'
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
    $uploadDir = "../uploads/{$id_iglesia}/videos/";

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
            AND es_pelicula = 1
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

    // Nombre único
    $filename = uniqid('video_', true) . '.' . $extension;

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
    $filepathDb = "uploads/{$id_iglesia}/videos/{$filename}";



    // Transacción
    $conn->begin_transaction();

    try {
        
        // INSERT media
        $sql = "INSERT INTO media
                (
                    es_pelicula,
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
                    1, ?, ?, ?, ?, ?, ?, ?, ?
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
        $resultMedia = $stmt->execute();

        if(!$resultMedia){
            throw new Exception($stmt->error);
        }

        $id_media = $conn->insert_id;
        $stmt->close();

        // INSERT video
        $sql = "INSERT INTO videos
                (
                    id_media,
                    title,
                    note,
                    created_at
                )
                VALUES
                (
                    ?, ?, ?, NOW()
                )
        ";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "iss",
            $id_media,
            $title,
            $note
        );
        $resultVideo = $stmt->execute();

        if(!$resultVideo){
            throw new Exception($stmt->error);
        }

        $id_video = $conn->insert_id;
        $stmt->close();

        $conn->commit();

        return [
            'success'   => true,
            'duplicado' => false,
            'mensaje'   => ucfirst($media_type) . ' guardado correctamente.',
            'id_video'  => $id_video,
            'id_media'  => $id_media,
            'media_type'=> $media_type,
            'filepath'  => '/' . $filepathDb
        ];

    } catch (Exception $e) {
    
        if(isset($stmt) && $stmt instanceof mysqli_stmt){
            $stmt->close();
        }

        $conn->rollback();

        return [
            'success' => false,
            'error' => 'Error al subir el vídeo.',
            'details' => $e->getMessage()
        ];

    }

}