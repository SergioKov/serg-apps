<?php
include('includes/config.php');
session_start();//importante para ver al usuario logueado
include('functions.php');

/*
//HACER PRUEBAS...
echo json_encode([
    'HACIENDO_PRUEBAS' => 'DESCOMENTAR EN PROD',
    'success' => false,
    'valorCampo' => 'no_tiene_datos',
    'error' => 'No hay todos los parametros necesarios.',
    'dic_code' => 'd251'
],JSON_UNESCAPED_UNICODE);
exit;
*/





//si los datos SÍ VIENEN desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
    
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obtener datos del cuerpo de la solicitud (en formato JSON)
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);
        //debug($inputJSON, 'inputJSON');
        //echo json_encode(['$datos' => $datos],JSON_UNESCAPED_UNICODE);
        // Verificar que se decodificó correctamente

        if ($datos === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'valorData' => 'no_tiene_datos',
                'error' => 'No hay todos los parametros necesarios.',
                'dic_code' => 'd251'
            ],JSON_UNESCAPED_UNICODE);
            exit;
        }

        $id_song = $datos['id_song'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $id_song = isset($_GET['id_song']) ? $_GET['id_song'] : null ;

        if ($id_song === null /*|| $campo === null */) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'valorData' => 'no_tiene_datos',
                'error' => 'No hay todos los parametros necesarios.',
                'dic_code' => 'd251'
            ],JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        //para que los datos sean iguales como en POST
        $datos['id_song'] = $id_song;
    }
}



include('includes/connect_db.php');

$id_song = $conn->real_escape_string($datos['id_song']);//aki importante

$id_user_logged = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;
//echo_json_x($datos, 'datos');

if(/*!$_SESSION['id_user'] || */ $_SESSION['email'] != 'sergiokovalchuk@gmail.com'){
    echo json_encode([
        'success' => false,
        'valorData' => '80.no_tiene_datos',
        'error' => 'El usuario no tiene permisos para eliminar canciones.',
        'dic_code' => 'd...'
    ],JSON_UNESCAPED_UNICODE);
    exit;
}


//busco si hay registro
// Preparar y ejecutar la consulta
$sql_init = "SELECT 
                id_song, 
                song_number, 
                title, 
                category, 
                song_text, 
                arr_esquema, 
                tune, 
                tune_transpose, 
                tipo_acorde, 
                tipo_fuente, 
                url_youtube, 
                url_recurso, 
                tempo_bpm, 
                notes, 
                count, 
                created_at, 
                updated_at  
            FROM songs 
            WHERE id_song = '$id_song'
";
//-- AND id_song = '$id_song'
//$sql_prep = "SELECT $campo 
//            FROM $tabla 
//            WHERE id_user = '$id_user_logged' 
//";
//$arr_params = [$campo, $tabla, $id_user_logged];
//$sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
$result = $conn->query($sql_init);
//echo_json_x($sql_init, 'sql');
//debug_x($sql_init, 'sql');


if($result->num_rows > 0){   
    $row = $result->fetch_assoc();
    //echo_json_x($row, 'row']);
    
    $id_song_bd = $row['id_song'];
    $title_bd = $row['title'];
    $song_text_bd = $row['song_text'];
    $data = [
        'success' => true,
        'id_song' => $row['id_song'],
        'song_number' => $row['song_number'],
        'title' => $row['title'],
        'category' => $row['category'],
        'song_text' => $row['song_text'],
        'arr_esquema' => $row['arr_esquema'],
        'tune' => $row['tune'],
        'tune_transpose' => $row['tune_transpose'],
        'tipo_acorde' => $row['tipo_acorde'],
        'tipo_fuente' => $row['tipo_fuente'],
        'url_youtube' => $row['url_youtube'],
        'url_recurso' => $row['url_recurso'],
        'tempo_bpm' => $row['tempo_bpm'],
        'notes' => $row['notes'],
        'count' => $row['count'],
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
        'valorData' => 'hay_datos'
    ];

    //consulta para eliminar
    $sql_delete = "DELETE FROM songs WHERE id_song = '$id_song_bd'";
    $result_delete = $conn->query($sql_delete);

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");


    if($result_delete === TRUE){
        $data['success'] = true;
        $data['valorData'] = 'cancion_eliminada';
        $data['fecha_hora'] = $fechaHoraActual;
    }

}else{
    
    $data = [
        'success' => true,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'no_tiene_datos'
    ];

}

//Cierro conexion con bd
$conn->close();

// Enviar respuesta al cliente en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data,JSON_UNESCAPED_UNICODE);

?>