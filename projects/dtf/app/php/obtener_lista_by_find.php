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

        $words_input = $datos['words_input'];
        $modo = $datos['modo'];
        $buscar_en = $datos['buscar_en'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $words_input = isset($_GET['words_input']) ? $_GET['words_input'] : null ;
        $modo = isset($_GET['modo']) ? $_GET['modo'] : 1 ;
        $buscar_en = isset($_GET['buscar_en']) ? $_GET['buscar_en'] : 1 ;

        if ($words_input === null) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'valorData' => 'no_tiene_datos',
                'error' => 'No hay todos los parametros necesarios.',
                'dic_code' => 'd251'
            ],JSON_UNESCAPED_UNICODE);
            exit;
        }        
    }
}

$id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;




include('includes/connect_db.php');

$words_input = $conn->real_escape_string($words_input);//aki importante
$modo = $conn->real_escape_string($modo);
$buscar_en = $conn->real_escape_string($buscar_en);
//echo_json_x($datos, 'datos');
//echo_json_x($words_input);
//echo_json_x($modo);


//busco si hay registro
//Preparar y ejecutar la consulta
$params = [];
$types  = '';

$arr_campos = [];

switch ($buscar_en) {
    case '1'://Todos los campos por defecto disponibles - (rápido)
    default:
        $arr_campos = ['l.id_lista', 'l.title', 'l.title_search', 'l.id_grupo', 'g.nombre', 'l.notes', 'l.fecha'];
        break;

    case '2'://Todos los campos disponibles, los títulos de canciones incluidos - (lento)
        $arr_campos = ['l.id_lista', 'l.title', 'l.title_search', 'l.notes', 'l.fecha'];
        break;
    
    case '3'://Todos los campos de texto disponibles
        $arr_campos = ['l.title', 'l.title_search', 'l.notes'];
        break;

    case '4'://Sólo el título de lista
        $arr_campos = ['l.title'];
        break;

    case '5'://Sólo las notas de lista
        $arr_campos = ['l.notes'];
        break;

    case '6'://Sólo el identificador de lista
        $arr_campos = ['l.id_lista'];
        break;

    case '7'://Sólo la fecha de lista
        $arr_campos = ['l.fecha'];
        break;
}

$arr_songbooks = [];//es necesario este parametro para buildWhere() con valor []


// Buscar "Jesús Pedro" en varios campos
$where = buildWhere($modo, $words_input, $arr_campos, $params, $types, $arr_songbooks);


//test modos de where
$sql_init = "SELECT 
                l.id_lista, 
                l.title,
                l.title_search,
                l.id_grupo,
                g.nombre AS grupo_nombre,
                l.notes,
                l.arr_lista_ids,
                l.fecha,
                l.created_at,
                l.updated_at 
            FROM listas l
            LEFT JOIN grupos g 
                ON g.id_grupo = l.id_grupo
            WHERE $where
            ORDER BY l.fecha DESC, l.id_lista DESC, l.title ASC, g.nombre ASC
";

// Si quieres ver la consulta “final” (sólo para debug, no ejecutar así en producción):
// reconstruir consulta final para debug
$finalSQL = $sql_init;
foreach ($params as $p) {
    $safe = "'" . $p . "'";
    $pos = strpos($finalSQL, "?");
    if ($pos !== false) {
        $finalSQL = substr_replace($finalSQL, $safe, $pos, 1);
    }
}
//debug_x($finalSQL, 'finalSQL');//para ver la consulta preparada para debuguear

$stmt = $conn->prepare($sql_init);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

//echo_json_x($sql_init, 'sql');
//debug_x($sql_init, 'sql');



//hacer test en HOSTALIA
/*
if (!$result) {
    die("Error en la consulta: " . $conn->error);
}else{
	echo "Filas encontradas: " . $result->num_rows;
	die("<p>ok en la consulta</p>");
}
*/



if($result->num_rows > 0){   
    
    $result_data = [
        'success' => true,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'hay_datos',
        'totalRows' => $result->num_rows,
        'arr_data' => []
    ];

    while ($row = $result->fetch_assoc()) {

        $id_lista_bd = $row['id_lista'];
        $title_bd = $row['title'];

        $arr_lista_from_table_songs = [];//por defecto. si hay, se rellena
        $arr_lista_from_table_songs_ordenado = [];//por defecto. si hay, se rellena

        if($row['arr_lista_ids'] != ''){
            //echo_json_x($row, 'row');
            //echo_json_x($row['arr_lista_ids'], 'arr_lista_ids');        
            
            //hago consulta para sacar las canciones desde arr_lista_ids
            //1. Reemplazar las comillas simples por dobles para un JSON válido
            $valid_arr_lista_ids_string = str_replace(["'", '"'], '', $row['arr_lista_ids']);//quito (") y (')

            //2. Decodificar la cadena JSON en un array de PHP
            $from_string_to_array = json_decode($valid_arr_lista_ids_string);//['1', '2', '3']       
            //debug_x($string_array, 'string_array');

            $arr_lista_ids_array = array_map('intval', $from_string_to_array);//[1, 2, 3]
            $string_ids = implode(',', $arr_lista_ids_array);//'1, 2, 3'
            
            //consulta:
            $sql_s = "SELECT
                    s.id_song, 
                    s.song_number, 
                    s.title, 
                    s.title2, 
                    s.title_note, 
                    s.tune,
                    s.tune_transpose,

                    ua.ajustes_pers,
                    ua.tune_transpose_pers,
                    ua.capo_pers

                FROM songs s
                
                LEFT JOIN users_ajustes ua
                    ON s.id_song = ua.id_song AND ua.id_user = $id_user

                WHERE s.id_song IN ($string_ids)

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
                        'tune_transpose' => $row_s['tune_transpose'],
                        'ajustes_pers' => $row_s['ajustes_pers'],
                        'tune_transpose_pers' => $row_s['tune_transpose_pers'],
                        'capo_pers' => $row_s['capo_pers']
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

        $result_data['arr_data'][] = $data;
    }
    
}else{
    
    $result_data = [
        'success' => false,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'no_tiene_datos'
    ];

}

//Cierro conexion con bd
$conn->close();

// Enviar respuesta al cliente en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result_data,JSON_UNESCAPED_UNICODE);

?>
