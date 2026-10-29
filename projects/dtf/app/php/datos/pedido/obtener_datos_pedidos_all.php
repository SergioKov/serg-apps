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
        //aki no uso parámetros. solo consulto datos.
        //meteré algun codigo aki luego, pero lo dejo por si acaso...

    } 

}



include($niveles_para_subir . 'includes/connect_db.php');


//echo_json_x($datos, 'datos');
//echo_json_x($words_input);
//echo_json_x($modo);



//Consula todos los pedidos no eliminados 
$sql_init = "SELECT 
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
            p.iva_incluido,
            p.iva_total,
            p.total,
            p.importe_pagado,

            p.comentario,

            p.created_at, 
            p.updated_at
                
            FROM pedidos p

            LEFT JOIN clientes c ON c.id_cliente = p.id_cliente
            
            LEFT JOIN taquillas t ON t.id_taquilla = p.id_taquilla
            
            WHERE p.is_deleted = 0

            ORDER BY p.id_pedido DESC, p.fecha_pedido, p.canal_venta
";
$stmt = $conn->prepare($sql_init);
//$stmt->bind_param();//aki no hace falta por no haber '?'; //ejemplo: $stmt->bind_param("i", $id_pedido);
$stmt->execute();
$result = $stmt->get_result();


//hacer test en HOSTALIA
/*
if (!$result) {
    die("Error en la consulta: " . $conn->error);
}else{
	echo "Filas encontradas: " . $result->num_rows;
	die("<p>ok en la consulta</p>");
}
*/





// Consultar todas las líneas de los pedidos no eliminados
$sql_items = "SELECT
                pi.id_pedido,
                pi.id_pedido_item,
                pi.tipo_item,
                pi.id_producto,
                pi.id_bono,
                pi.id_servicio,
                pi.nombre,
                pi.cantidad,
                pi.precio,
                pi.importe
              FROM pedido_items pi
              INNER JOIN pedidos p ON p.id_pedido = pi.id_pedido
              WHERE p.is_deleted = 0
              ORDER BY pi.id_pedido, pi.id_pedido_item";

$stmt_items = $conn->prepare($sql_items);

if (!$stmt_items) {
    error_log('Error al preparar consulta de pedido_items: ' . $conn->error);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudieron consultar las líneas de los pedidos.'
    ], JSON_UNESCAPED_UNICODE);
    $conn->close();
    exit;
}

$stmt_items->execute();
$result_items = $stmt_items->get_result();


// Agrupar las líneas por pedido
$arr_items_por_pedido = [];

while ($item = $result_items->fetch_assoc()) {

    $id_pedido_item = $item['id_pedido'];

    // Obtener el ID según el tipo de concepto
    switch ($item['tipo_item']) {

        case 'producto':
            $id_item = $item['id_producto'];
            break;

        case 'bono':
            $id_item = $item['id_bono'];
            break;

        case 'servicio':
            $id_item = $item['id_servicio'];
            break;

        default:
            // Ignorar tipos de artículo no reconocidos y pasar a la siguiente línea
            continue 2;
    }

    // Añadir la línea al array único del pedido
    $arr_items_por_pedido[$id_pedido_item][] = [
        'id_pedido_item' => $item['id_pedido_item'],
        'tipo_concepto'  => $item['tipo_item'],
        'id'             => $id_item,
        'nombre'         => $item['nombre'],
        'cantidad'       => (float) $item['cantidad'],
        'precio'         => (float) $item['precio'],
        'importe'        => (float) $item['importe']
    ];
}

$stmt_items->close();



if($result->num_rows > 0){   
    
    $result_data = [
        'success' => true,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'hay_datos',
        'totalRows' => $result->num_rows,
        'arr_data' => []
    ];

    //recorrer los registros de pedidos encontrados
    while ($row = $result->fetch_assoc()) {

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
            'iva_incluido' => $row['iva_incluido'],
            'iva_total' => $row['iva_total'],
            'total' => $row['total'],
            'importe_pagado' => $row['importe_pagado'],

            'comentario' => $row['comentario'],
    
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],

            'arr_items' => $arr_items_por_pedido[$row['id_pedido']] ?? [],    

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

// Enviar respuesta al pedido en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result_data,JSON_UNESCAPED_UNICODE);

?>
