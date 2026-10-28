<?php
$niveles_para_subir = '../../';

include($niveles_para_subir . 'includes/config.php');
session_start();//importante para ver al usuario logueado
include($niveles_para_subir . 'functions.php');

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

}



include($niveles_para_subir . 'includes/connect_db.php');

//aquí no hace falta $conn->real_escape_string() porque uso consulta preparada con bind_param()
$words_input = $datos['words_input'];
$modo = $datos['modo'];
$buscar_en = $datos['buscar_en'];

//echo_json_x($datos, 'datos');
//echo_json_x($words_input);
//echo_json_x($modo);





$params = [];
$types  = "";
$arr_campos = [];


switch ($buscar_en) {
    case '1'://Todos los campos por defecto disponibles (rápido)
    default:
        //'b.bono_search' -> campo optimizado para busquedas con indice fulltext //aki no hace falta
        $arr_campos = ['b.id_bono', 'b.nombre', 'b.descripcion'];
        break;

    case '2'://Todos los campos disponibles (lento)
        $arr_campos = ['b.id_bono', 'b.nombre', 'b.descripcion',  'b.cantidad', 'b.cantidad_bonificada', 'b.envio_gratis', 'b.precio'];
        break;
    
    case '3'://Todos los campos de texto disponibles
        $arr_campos = ['b.nombre', 'b.descripcion'];
        break;

    case '4'://Todos los campos de números disponibles
        $arr_campos = ['b.id_bono', 'b.cantidad', 'b.cantidad_bonificada', 'b.envio_gratis', 'b.precio'];
        break;

    case '5'://Sólo el identificador de bono
        $arr_campos = ['b.id_bono'];
        break;

    case '6'://Sólo el nombre
        $arr_campos = ['b.nombre'];
        break;

    case '7'://Sólo el descripcion
        $arr_campos = ['b.descripcion'];
        break;
}



// Buscar "Jesús Pedro" en varios campos
$where = buildWhere($modo, $words_input, $arr_campos, $params, $types);


//test modos de where
$sql_init = "SELECT 
                b.id_bono,
                b.id_producto,

                b.nombre, 
                b.descripcion, 

                b.cantidad,
                b.cantidad_bonificada,

                b.envio_gratis,
                b.precio,

                b.created_at, 
                b.updated_at
                
            FROM bonos b
            
            WHERE $where
            ORDER BY b.id_bono DESC, b.nombre, b.descripcion
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
//echo_json_x($finalSQL, 'finalSQL');//para ver la consulta preparada para debuguear


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
            'info' => '$ finalSQL:' . $finalSQL,//ocultar en PROD
        'totalRows' => $result->num_rows,
        'arr_data' => []
    ];

    //recorrer los registros de canciones encontrados
    while ($row = $result->fetch_assoc()) {

        $id_bono_bd = $row['id_bono'];

        $data = [
            'success' => true,

            'id_bono' => $row['id_bono'],
            'id_producto' => $row['id_producto'],

            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],

            'cantidad' => $row['cantidad'],
            'cantidad_bonificada' => $row['cantidad_bonificada'],

            'envio_gratis' => $row['envio_gratis'],
            'precio' => $row['precio'],
    
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

// Enviar respuesta al bono en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result_data,JSON_UNESCAPED_UNICODE);

?>
