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

        $id_lista = $datos['id_lista'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $id_lista = isset($_GET['id_lista']) ? $_GET['id_lista'] : null ;

        if ($id_lista === null) {
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
        $datos['id_lista'] = $id_lista;
    }
}



include('includes/connect_db.php');

$id_lista = $conn->real_escape_string($datos['id_lista']);//aki importante
//echo_json_x($datos, 'datos');


//busco si hay registro
// Preparar y ejecutar la consulta
$sql_init = "SELECT
                l.id_lista, 
                l.title, 
                l.id_grupo, 
                g.nombre AS grupo_nombre, 
                l.notes, 
                l.arr_lista_ids, 
                l.fecha, 
                l.created_at, 
                l.updated_at
            FROM listas l
                LEFT JOIN grupos g ON l.id_grupo = g.id_grupo 
            WHERE l.id_lista = '$id_lista'
";
//-- AND id_lista = '$id_lista'
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

    $arr_lista_from_table_songs = [];//por defecto. si hay, se rellena
    $arr_lista_from_table_songs_ordenado = [];//por defecto. si hay, se rellena

    if($row['arr_lista_ids'] != ''){
        //echo_json_x($row, 'row');
        //echo_json_x($row['arr_lista_ids'], 'arr_lista_ids');        
        
        //hago consulta para sacar las canciones desde arr_lista_ids
        //1. Reemplazar las comillas simples por dobles para un JSON válido
        $valid_arr_lista_ids_string = str_replace(["'", '"'], '', $row['arr_lista_ids']);//quito (") y (') 
        //debug_x($valid_arr_lista_ids_string, 'valid_arr_lista_ids_string');

        //2. Decodificar la cadena JSON en un array de PHP
        $from_string_to_array = json_decode($valid_arr_lista_ids_string);//['1', '2', '3']       
        //debug_x($string_array, 'string_array');

        $arr_lista_ids_array = array_map('intval', $from_string_to_array);//[1, 2, 3]
        $string_ids = implode(',', $arr_lista_ids_array);//'1, 2, 3'
        
        //consulta:
        $sql_s = "SELECT
                id_song, 
                song_number, 
                title, 
                title2, 
                title_note, 
                tune,
                tune_transpose
            FROM songs
            WHERE id_song IN ($string_ids)
        ";
        $result_s = $conn->query($sql_s);
        //echo_json_x($sql_s, 'sql_s');
        //debug_x($sql_s, 'sql_s');

        if($result_s->num_rows > 0){
            while ($row_s = $result_s->fetch_assoc()) {
                $data_s = [
                    'id_song' => $row_s['id_song'],
                    'song_number' => $row_s['song_number'],
                    'title' => $row_s['title'],
                    'title2' => $row_s['title2'],
                    'title_note' => $row_s['title_note'],
                    'tune' => $row_s['tune'],
                    'tune_transpose' => $row_s['tune_transpose']
                ];
                $arr_lista_from_table_songs[] = $data_s;
            }            
        }

        $arr_lista_from_table_songs_ordenado = ordenarResultByArray($arr_lista_from_table_songs, $arr_lista_ids_array);
    }
    
    $data = [
        'success' => true,
        'id_lista' => $row['id_lista'],
        'title' => $row['title'],
        'id_grupo' => $row['id_grupo'],
        'grupo_nombre' => $row['grupo_nombre'],
        'notes' => $row['notes'],
        'arr_lista' => $arr_lista_from_table_songs_ordenado,
        'arr_lista_ids' => $row['arr_lista_ids'],
        'fecha' => $row['fecha'],
        'fecha_ver' => convertirFecha($row['fecha'], '/'),
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
        'valorData' => 'hay_datos'
    ];
    //echo_json_x($data, 'data');
    //debug_x($data, 'data');

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