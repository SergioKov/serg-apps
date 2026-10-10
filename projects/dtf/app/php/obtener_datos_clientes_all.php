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
        //aki no uso parámetros. solo consulto datos.
        //meteré algun codigo aki luego, pero lo dejo por si acaso...

    } 

}



include('includes/connect_db.php');


//echo_json_x($datos, 'datos');
//echo_json_x($words_input);
//echo_json_x($modo);



//Consula todos los clientes no eliminados 
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
            
            WHERE c.is_deleted = 0
            ORDER BY c.id_cliente DESC, c.nombre, c.telefono, c.comentario
";
$stmt = $conn->prepare($sql_init);
//$stmt->bind_param();//aki no hace falta por no haber '?'; //ejemplo: $stmt->bind_param("i", $id_cliente);
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



if($result->num_rows > 0){   
    
    $result_data = [
        'success' => true,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'hay_datos',
        'totalRows' => $result->num_rows,
        'arr_data' => []
    ];

    //recorrer los registros de clientes encontrados
    while ($row = $result->fetch_assoc()) {

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
