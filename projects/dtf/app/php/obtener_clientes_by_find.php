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

}



include('includes/connect_db.php');

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
        //'c.cliente_search' -> campo optimizado para busquedas con indice fulltext 
        $arr_campos = ['c.id_cliente', 'c.nombre', 'c.telefono', 'c.codigo_cliente', 'c.comentario', 'c.cliente_search'];
        break;

    case '2'://Todos los campos disponibles (lento)
        $arr_campos = ['c.id_cliente', 'c.nombre', 'c.telefono', 'c.codigo_cliente', 'c.comentario', 'c.cliente_search', 'c.taquilla', 'c.descuento', 'c.precio_fijo_dtf', 'c.precio_fijo_uv', 'c.saldo'];
        break;
    
    case '3'://Todos los campos de texto disponibles
        $arr_campos = ['c.nombre', 'c.telefono', 'c.codigo_cliente', 'c.comentario'];
        break;

    case '4'://Todos los campos de números disponibles
        $arr_campos = ['c.id_cliente', 'c.telefono', 'c.codigo_cliente', 'c.taquilla', 'c.descuento', 'c.precio_fijo_dtf', 'c.precio_fijo_uv', 'c.saldo'];
        break;

    case '5'://Sólo el identificador de cliente
        $arr_campos = ['c.id_cliente'];
        break;

    case '6'://Sólo el nombre
        $arr_campos = ['c.nombre'];
        break;

    case '7'://Sólo el teléfono
        $arr_campos = ['c.telefono'];
        break;
}



// Buscar "Jesús Pedro" en varios campos
$where = buildWhere($modo, $words_input, $arr_campos, $params, $types);


//test modos de where
$sql_init = "SELECT 
                c.id_cliente, 
                c.nombre, 
                c.telefono, 
                c.codigo_cliente, 
                c.comentario, 

                c.taquilla,
                c.descuento,
                c.precio_fijo_dtf,
                c.precio_fijo_uv,
                c.saldo,

                c.created_at, 
                c.updated_at
            FROM clientes c
            
            WHERE $where
            ORDER BY c.id_cliente DESC, c.nombre, c.telefono, c.comentario
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


//-- AND id_cliente = '$id_cliente'
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
            'info' => '$ finalSQL:' . $finalSQL,//ocultar en PROD
        'totalRows' => $result->num_rows,
        'arr_data' => []
    ];

    //recorrer los registros de canciones encontrados
    while ($row = $result->fetch_assoc()) {

        $id_cliente_bd = $row['id_cliente'];

        $data = [
            'success' => true,

            'id_cliente' => $row['id_cliente'],
            'nombre' => $row['nombre'],
            'telefono' => $row['telefono'],
            'codigo_cliente' => $row['codigo_cliente'],
            'comentario' => $row['comentario'],

            'taquilla' => $row['taquilla'],
            'descuento' => $row['descuento'],
            'precio_fijo_dtf' => $row['precio_fijo_dtf'],
            'precio_fijo_uv' => $row['precio_fijo_uv'],
            'saldo' => $row['saldo'],
    
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
