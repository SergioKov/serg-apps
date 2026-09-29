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

        $id_song = $datos['id_song'];
        $device_resolution = $datos['device_resolution'];
        $orientation = $datos['orientation'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $id_song = isset($_GET['id_song']) ? $_GET['id_song'] : null ;
        $device_resolution = isset($_GET['device_resolution']) ? $_GET['device_resolution'] : null ;
        $orientation = isset($_GET['orientation']) ? $_GET['orientation'] : null ;

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
        $datos['device_resolution'] = $device_resolution;
        $datos['orientation'] = $orientation;
    }
}

$id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;



include('includes/connect_db.php');

//$id_song = $conn->real_escape_string($datos['id_song']);//aki importante
//echo_json_x($datos, 'datos');


//busco si hay registro
// Preparar y ejecutar la consulta
        // $sql_init = "SELECT
        //                 s.id_song, 
        //                 s.song_number, 
        //                 s.title, 
        //                 s.title2, 
        //                 s.title_note, 
        //                 s.category,
        //                 ct.name AS category_name,
        //                 ct.lang_name AS lang_name,
        //                 s.songbook,
        //                 sb.title AS songbook_title,
        //                 s.song_text, 
        //                 s.arr_esquema, 
        //                 s.tune, 
        //                 s.tune_transpose, 
        //                 s.tipo_acorde, 
        //                 s.tipo_fuente, 
        //                 s.url_youtube, 
        //                 s.url_recurso, 
        //                 s.tempo_bpm, 
        //                 s.lang,
        //                 s.notes, 
        //                 s.count, 

        //                 s.created_at, 
        //                 s.updated_at
        //             FROM songs s
        //             LEFT JOIN category_translations ct 
        //                 ON ct.id_category = s.category AND ct.lang = s.lang
        //             LEFT JOIN songbooks sb 
        //                 ON sb.id_songbook = s.songbook
        //             WHERE s.id_song = '$id_song'
        // ";

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

$sql = "SELECT

            s.id_song,
            s.song_number,
            s.title,
            s.title2,
            s.title_note,

            s.category,
            ct.name AS category_name,
            ct.lang_name AS lang_name,

            s.songbook,
            sb.title AS songbook_title,

            s.song_text,

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
                        
            ua.ajustes_pers,
            ua.tune_transpose_pers,
            ua.capo_pers,
            ua.tipo_acorde_pers,
            ua.tempo_bpm_pers,
            ua.notes_pers,

            s.created_at,
            s.updated_at

        FROM songs s

        LEFT JOIN category_translations ct
            ON ct.id_category = s.category AND ct.lang = s.lang

        LEFT JOIN songbooks sb
            ON sb.id_songbook = s.songbook

        LEFT JOIN users_ajustes ua
            ON s.id_song = ua.id_song AND ua.id_user = ?

        WHERE s.id_song = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "ii",
    $id_user,
    $id_song
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();



if($row){   
    //echo_json_x($row, 'row']);

    // SQL songs_ajustes
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
        
        // ajustes personalizados
        'ajustes_pers' => $row['ajustes_pers'],
        'tune_transpose_pers' => $row['tune_transpose_pers'],
        'capo_pers' => $row['capo_pers'],
        'tipo_acorde_pers' => $row['tipo_acorde_pers'],
        'tempo_bpm_pers' => $row['tempo_bpm_pers'],
        'notes_pers' => $row['notes_pers'],

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