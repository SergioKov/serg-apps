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

        //$id_song = $datos['id_song'];
        $tipo_consulta = $datos['tipo_consulta'];
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        // $id_song = isset($_GET['id_song']) ? $_GET['id_song'] : null ;
        $tipo_consulta = isset($_GET['tipo_consulta']) ? $_GET['tipo_consulta'] : null ;

        if ($tipo_consulta === null) {
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
        //$datos['id_song'] = $id_song;
        $datos['tipo_consulta'] = $tipo_consulta;
    }
}



include('includes/connect_db.php');

//$id_song = $conn->real_escape_string($datos['id_song']);//antes. aki importante
$tipo_consulta = $conn->real_escape_string($datos['tipo_consulta']);//como ejemplo para futuro...
//echo_json_x($datos, 'datos');


//busco todos los registros
$sql_init = "SELECT 
                id_songbook, 
                title, 
                info, 
                created_at, 
                updated_at  
            FROM songbooks             
";
$result = $conn->query($sql_init);
//echo_json_x($sql_init, 'sql');
//debug_x($sql_init, 'sql');

// Crear un array para almacenar todos los registros
$arr_songbooks = array();

// Verificar si hay resultados
if($result->num_rows > 0){   
    
    // Recorrer cada fila
    while($row = $result->fetch_assoc()) {
        // Agregar cada fila al array principal
        //echo_json_x($row, 'row']);
        $arr_songbooks[$row['id_songbook']] = $row;
    }
    
    $data = [
        'success' => true,
        'arr_songbooks' => $arr_songbooks,
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