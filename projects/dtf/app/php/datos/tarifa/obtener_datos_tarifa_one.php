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
        $id_tarifa = $datos['id_tarifa'];
    } 

}

$id_user = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;



include($niveles_para_subir . 'includes/connect_db.php');

//Consula el tarifas por su id 
$sql = "SELECT
            t.id_tarifa, 
            t.nombre, 
            t.descripcion,

            t.id_producto, 

            t.cantidad_desde,
            t.cantidad_hasta,

            t.precio,

            t.created_at, 
            t.updated_at

        FROM tarifas t

        WHERE t.id_tarifa = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    "i",
    $id_tarifa
);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();



if($row){   
    //echo_json_x($row, 'row']);

    $data = [
        'success' => true,

        'id_tarifa' => $row['id_tarifa'],
        'nombre' => $row['nombre'],
        'descripcion' => $row['descripcion'],

        'id_producto' => $row['id_producto'],

        'cantidad_desde' => $row['cantidad_desde'],
        'cantidad_hasta' => $row['cantidad_hasta'],
        
        'precio' => $row['precio'],

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

// Enviar respuesta al tarifa en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data,JSON_UNESCAPED_UNICODE);

?>