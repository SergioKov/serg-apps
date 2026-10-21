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

        //aquí no hace falta $conn->real_escape_string() porque uso consulta preparada con bind_param()
        $id_pedido = $datos['id_pedido'];
    } 

}

$id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;



include($niveles_para_subir . 'includes/connect_db.php');

//Consula el pedidos por su id 
$sql = "SELECT
            p.id_pedido, 
            p.id_cliente, 
            p.id_taquilla, 

            c.nombre,
            c.telefono,
            c.codigo_cliente,
            
            t.nombre AS t_nombre,
            t.estado_taquilla,

            p.fecha_pedido, 
            p.canal_venta, 
            p.canal_aviso, 

            p.estado_pedido,
            p.estado_pago,
            p.metodo_pago,

            p.subtotal,
            p.iva_total,
            p.total,

            p.comentario,

            p.created_at, 
            p.updated_at

        FROM pedidos p

        LEFT JOIN clientes c ON c.id_cliente = p.id_cliente  

        LEFT JOIN taquillas t ON t.id_taquilla = p.id_taquilla

        WHERE p.id_pedido = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_pedido
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();



if($row){   
    //echo_json_x($row, 'row']);

    $data = [
        'success' => true,

        'id_pedido' => $row['id_pedido'],
        'id_cliente' => $row['id_cliente'],
        'id_taquilla' => $row['id_taquilla'],
        
        //cliente
        'nombre' => $row['nombre'],
        'telefono' => $row['telefono'],
        'codigo_cliente' => $row['codigo_cliente'],
        
        //taquilla
        't_nombre' => $row['t_nombre'],
        'estado_taquilla' => $row['estado_taquilla'],

        'fecha_pedido' => $row['fecha_pedido'],
        'canal_venta' => $row['canal_venta'],
        'canal_aviso' => $row['canal_aviso'],

        'estado_pedido' => $row['estado_pedido'],
        'estado_pago' => $row['estado_pago'],
        'metodo_pago' => $row['metodo_pago'],
        
        'subtotal' => $row['subtotal'],
        'iva_total' => $row['iva_total'],
        'total' => $row['total'],

        'comentario' => $row['comentario'],

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

// Enviar respuesta al pedido en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data,JSON_UNESCAPED_UNICODE);

?>