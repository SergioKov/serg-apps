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
        $arr_songbooks_search = $datos['arr_songbooks_search'];
        $device_resolution = $datos['device_resolution'];
        $orientation = $datos['orientation'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $words_input = isset($_GET['words_input']) ? $_GET['words_input'] : null ;
        $modo = isset($_GET['modo']) ? $_GET['modo'] : 1 ;
        $buscar_en = isset($_GET['buscar_en']) ? $_GET['buscar_en'] : 1 ;
        $arr_songbooks_search = isset($_GET['arr_songbooks_search']) ? $_GET['arr_songbooks_search'] : [] ;
        $device_resolution = isset($_GET['device_resolution']) ? $_GET['device_resolution'] : null ;
        $orientation = isset($_GET['orientation']) ? $_GET['orientation'] : null ;

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



include('includes/connect_db.php');

$words_input = $conn->real_escape_string($words_input);//aki importante
$modo = $conn->real_escape_string($modo);
$buscar_en = $conn->real_escape_string($buscar_en);

$arr_songbooks_search_string = json_encode($arr_songbooks_search, JSON_UNESCAPED_UNICODE);//no usar $conn->real_escape_string($datos['arr']) ya que retorna NULL
$arr_songbooks_search_array = $arr_songbooks_search;//ya viene decodificado desde: $datos = json_decode($inputJSON, true);

$device_resolution = $conn->real_escape_string($device_resolution);
$orientation = $conn->real_escape_string($orientation);


//echo_json_x($datos, 'datos');
//echo_json_x($words_input);
//echo_json_x($modo);





$params = [];
$types  = "";
$arr_campos = [];
$arr_songbooks = [];
// $arr_songbooks = ['2'];//test

if(empty($arr_songbooks_search)){
    $arr_songbooks = [];//si no se indica arr_songbooks_search (si valor es []), es arr vacio
    //echo_json_x('entro en if');
}else{
    //con explode hago array
    //con array_filter filtro solo los numeros enteros
    $arr_songbooks = array_filter($arr_songbooks_search_array, function($item) {
        return filter_var($item, FILTER_VALIDATE_INT) !== false && (int)$item !== 0;
    });
    $arr_songbooks = array_map('intval', $arr_songbooks);

    //echo_json_x('entro en else');
    //echo_json_x($arr_songbooks, 'arr_songbooks');//hay que convertirlo en string para ver como .json()
}
//echo_json_x($arr_songbooks, 'arr_songbooks');


switch ($buscar_en) {
    case '1'://Todos los campos por defecto disponibles (rápido)
    default:
        $arr_campos = ['s.id_song', 's.song_number', 's.title', 's.title2', 's.title_note', 's.title_search', 's.song_text', 's.song_text_search', 's.notes'];
        break;

    case '2'://Todos los campos disponibles (lento)
        $arr_campos = ['s.id_song', 's.song_number', 's.title', 's.title2', 's.title_note', 's.title_search',  'ct.name', 'ct.lang_name', 's.song_text', 's.song_text_search', 's.notes'];
        break;
    
    case '3'://Todos los campos de texto disponibles
        $arr_campos = ['s.title', 's.title2', 's.title_note', 's.title_search', 'ct.name', 's.song_text', 's.song_text_search', 's.notes'];
        break;

    case '4'://Sólo el título de canción
        $arr_campos = ['s.title', 's.title2', 's.title_note', 's.title_search'];
        break;

    case '5'://Sólo el texto de canción
        // $arr_campos = ['s.song_text'];//antes
        $arr_campos = ['s.song_text', 's.song_text_search'];//campo optimizado para busquedas
        break;

    case '6':// Sólo las notas de canción
        $arr_campos = ['s.notes'];
        break;

    case '7'://Identificador y número de canción
        $arr_campos = ['s.id_song', 's.song_number'];
        break;

    case '8'://Sólo el identificador de canción
        $arr_campos = ['s.id_song'];
        break;

    case '9'://Sólo el número de canción
        $arr_campos = ['s.song_number'];
        break;

    case '10'://Sólo el identificador de categoría
        $arr_campos = ['s.category'];
        break;

    case '11'://Sólo el nombre de categoría
        $arr_campos = ['ct.name'];
        break;

    case '12'://Sólo el idioma de canción
        $arr_campos = ['ct.lang_name'];
        break;
}



// Buscar "Jesús Pedro" en varios campos
$where = buildWhere($modo, $words_input, $arr_campos, $params, $types, $arr_songbooks);


//test modos de where
$sql_init = "SELECT 
                s.id_song, 
                s.song_number, 
                s.title, 
                s.title2, 
                s.title_note, 
                s.title_search,

                s.category,
                ct.name AS category_name,
                ct.lang_name AS lang_name,

                s.songbook,
                sb.title AS songbook_title,

                s.song_text, 
                s.song_text_search,

                s.arr_esquema, 
                
                s.tune, 
                s.tune_transpose,                
                s.tipo_acorde, 
                s.tipo_fuente, 
                s.url_youtube, 
                s.url_recurso, 
                s.tempo_bpm, 
                s.lang,
                s.notes, 
                s.count, 

                s.created_at, 
                s.updated_at
            FROM songs s
            
            LEFT JOIN category_translations ct 
                ON ct.id_category = s.category AND ct.lang = s.lang
            
            LEFT JOIN songbooks sb 
                ON sb.id_songbook = s.songbook
            
            WHERE $where
            ORDER BY s.title, s.title2, s.title_note, s.song_number, s.id_song DESC, s.songbook
";

//sql join antes
// sa.device_resolution,
// sa.orientation,
// sa.font_size,
// sa.num_columns,
// sa.acordes_visible,
// sa.texto_visible,
// sa.contenido_width,
//
//LEFT JOIN songs_ajustes sa 
//                ON sa.id_song = s.id_song AND sa.device_resolution = '$device_resolution' AND sa.orientation = '$orientation'


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
//echo_json_x($finalSQL, 'finalSQL');//para ver la consulta preparada para debuguear


$stmt = $conn->prepare($sql_init);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();


//-- AND id_song = '$id_song'
//$sql_prep = "SELECT $campo 
//            FROM $tabla 
//            WHERE id_user = '$id_user_logged' 
//";
//$arr_params = [$campo, $tabla, $id_user_logged];
//$sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
//$result = $conn->query($sql_init);
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

    // SQL ajustes
    $sql_ajustes = "SELECT
                        device_resolution,
                        orientation,
                        font_size,
                        num_columns,
                        acordes_visible,
                        texto_visible,
                        contenido_width,
                        created_at,
                        updated_at
                    FROM songs_ajustes
                    WHERE
                        id_song = ?
                        AND id_user = ?
                        AND device_resolution = ?
    ";
    // preparar UNA vez
    $stmt_ajustes = $conn->prepare($sql_ajustes);

    if(!$stmt_ajustes){
        die("Error SQL ajustes");
    }

    //recorrer los registros de canciones encontrados
    while ($row = $result->fetch_assoc()) {

        $id_song_bd = $row['id_song'];

        // start --- buscar ajustes
        $stmt_ajustes->bind_param(
            "iis",
            $id_song_bd,
            $id_user,
            $device_resolution
        );

        $stmt_ajustes->execute();
        $result_ajustes = $stmt_ajustes->get_result();

        // ajustes agrupados
        $ajustes = [
            'portrait' => null,
            'landscape' => null
        ];

        while($row_ajustes = $result_ajustes->fetch_assoc()){

            $orientation = $row_ajustes['orientation'];

            $ajustes[$orientation] = [
                'device_resolution'       => $row_ajustes['device_resolution'],
                'font_size'               => $row_ajustes['font_size'],
                'num_columns'             => $row_ajustes['num_columns'],
                'acordes_visible'         => $row_ajustes['acordes_visible'],
                'texto_visible'           => $row_ajustes['texto_visible'],
                'contenido_width'         => $row_ajustes['contenido_width']
            ];
        }
        // end --- buscar ajustes


        $title_bd = $row['title'];
        $song_text_bd = $row['song_text'];
        $data = [
            'success' => true,

            'id_song' => $row['id_song'],
            'song_number' => $row['song_number'],
            'title' => $row['title'],
            'title2' => $row['title2'],
            'title_note' => $row['title_note'],

            'category' => $row['category'],
            'category_name' => $row['category_name'],

            'songbook' => $row['songbook'],
            'songbook_title' => $row['songbook_title'],

            'lang_name' => $row['lang_name'],
            'song_text' => $row['song_text'],
            'arr_esquema' => $row['arr_esquema'],
            'tune' => $row['tune'],
            'tune_transpose' => $row['tune_transpose'],
            'tipo_acorde' => $row['tipo_acorde'],
            'tipo_fuente' => $row['tipo_fuente'],
            'url_youtube' => $row['url_youtube'],
            'url_recurso' => $row['url_recurso'],
            'tempo_bpm' => $row['tempo_bpm'],
            'lang' => $row['lang'],
            'notes' => $row['notes'],
            'count' => $row['count'],

            // ajustes por orientación
            'ajustes' => $ajustes,
    
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
