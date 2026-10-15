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



//Consula todos los productos no eliminados 
$sql_init = "SELECT 
                p.id_producto, 
                p.nombre, 
                p.descripcion, 

                p.precio_compra,
                p.precio_venta,

                p.created_at, 
                p.updated_at
                
            FROM productos p
            
            WHERE p.is_deleted = 0
            ORDER BY p.id_producto DESC, p.nombre, p.descripcion
";
$stmt = $conn->prepare($sql_init);
//$stmt->bind_param();//aki no hace falta por no haber '?'; //ejemplo: $stmt->bind_param("i", $id_producto);
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

    //recorrer los registros de productos encontrados
    while ($row = $result->fetch_assoc()) {

        $data = [
            'success' => true,

            'id_producto' => $row['id_producto'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],

            'precio_compra' => $row['precio_compra'],
            'precio_venta' => $row['precio_venta'],
    
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

// Enviar respuesta al producto en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($result_data,JSON_UNESCAPED_UNICODE);

?>
