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

        //aquí no hace falta $conn->real_escape_string() porque uso consulta preparada con bind_param()
        $id_cliente = $datos['id_cliente'];
    } 

}

$id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;



include('includes/connect_db.php');

//Consula el clientes por su id 
$sql = "SELECT
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

        WHERE c.id_cliente = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_cliente
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();



if($row){   
    //echo_json_x($row, 'row']);

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