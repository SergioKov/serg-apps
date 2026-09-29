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
        //echo json_encode(['$datos' => $datos]);
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

        $id_songslide = $datos['id_songslide'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $id_songslide = isset($_GET['id_songslide']) ? $_GET['id_songslide'] : null ;

        if ($id_songslide === null) {
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
        $datos['id_songslide'] = $id_songslide;
    }
}



include('includes/connect_db.php');

$id_songslide = $conn->real_escape_string($datos['id_songslide']);//aki importante
//echo_json_x($datos, 'datos');


//busco si hay registro
// Preparar y ejecutar la consulta
$sql_init = "SELECT
                id_songslide, 
                id_user, 
                ip_user, 
                id_song, 
                slide_actual, 
                arr_pantalla, 

                pantalla_show, 
                show_logo_en_fondo,
                show_imagen_en_fondo,
                show_bible_en_fondo,
                show_black_en_fondo,
                user_view_control,

                show_legend,
                show_acordes,
                show_next_slide,
                show_en_top,
                show_en_parte_top,
                show_en_center,

                created_at, 
                updated_at
            FROM songslides
            WHERE id_songslide = '$id_songslide'
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

    //1. Reemplazar las comillas simples por dobles para un JSON válido
    //$valid_arr_pantalla_string = str_replace(['""'], '"', $row['arr_pantalla']);//quito ("") pongo (")
    //$valid_arr_pantalla_string = json_decode($row['arr_pantalla']);
    
    $id_songslide_bd = $row['id_songslide'];
    $id_song_bd = $row['id_song'];
    $data = [
        'success' => true,
        
        'id_songslide' => $row['id_songslide'],
        'id_user' => $row['id_user'],
        'ip_user' => $row['ip_user'],
        'id_song' => $row['id_song'],
        'slide_actual' => $row['slide_actual'],
        'arr_pantalla' => $row['arr_pantalla'],

        'pantalla_show' => $row['pantalla_show'],
        'show_logo_en_fondo' => $row['show_logo_en_fondo'],
        'show_imagen_en_fondo' => $row['show_imagen_en_fondo'],
        'show_bible_en_fondo' => $row['show_bible_en_fondo'],
        'show_black_en_fondo' => $row['show_black_en_fondo'],
        'user_view_control' => $row['user_view_control'],

        'show_legend' => $row['show_legend'],
        'show_acordes' => $row['show_acordes'],
        'show_next_slide' => $row['show_next_slide'],
        'show_en_top' => $row['show_en_top'],
        'show_en_parte_top' => $row['show_en_parte_top'],
        'show_en_center' => $row['show_en_center'],

        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
        'valorData' => 'hay_datos'
    ];

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