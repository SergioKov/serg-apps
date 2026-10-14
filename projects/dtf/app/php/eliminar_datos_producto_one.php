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
        //echo json_encode(['$datos' => $datos],JSON_UNESCAPED_UNICODE);
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

        $id_producto = $datos['id_producto'];
    } 

}



include('includes/connect_db.php');

$id_producto = $datos['id_producto'];//aki no hace falta $conn->real_escape_string(...) ya que uso consultas preparadas

$id_user_logged = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;
//echo_json_x($datos, 'datos');

//luego añadire comprobacion de permisos de usuario para eliminar productos
//por ahora lo comento...!
// if(/*!$_SESSION['id_user'] || */ $_SESSION['email'] != 'sergiokovalchuk@gmail.com'){
//     echo json_encode([
//         'success' => false,
//         'valorData' => '80.no_tiene_datos',
//         'error' => 'El usuario no tiene permisos para eliminar productos.',
//         'dic_code' => 'd...'
//     ],JSON_UNESCAPED_UNICODE);
//     exit;
// }


//busco si hay registro
// Preparar y ejecutar la consulta
$sql_init = "SELECT 
                id_producto, 
                nombre, 
                descripcion, 
                precio_compra,
                precio_venta,
                created_at, 
                updated_at
                
            FROM productos 
            WHERE id_producto = ?
";
$stmt = $conn->prepare($sql_init);
$stmt->bind_param("i", $id_producto);
$stmt->execute();
$result = $stmt->get_result();

//echo_json_x($sql_init, 'sql');
//debug_x($sql_init, 'sql');


if($result->num_rows > 0){   
    $row = $result->fetch_assoc();
    //echo_json_x($row, 'row']);
    
    $id_producto_bd = $row['id_producto'];
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

    //consulta para eliminar
    $sql_delete = "DELETE FROM 
                    productos 
                   WHERE id_producto = ?
    ";
    $stmt = $conn->prepare($sql_delete);
    $stmt->bind_param("i", $id_producto_bd);
    $result_delete = $stmt->execute();

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");


    if($result_delete === TRUE){
        $data['success'] = true;
        $data['valorData'] = 'registro_eliminado';
        $data['fecha_hora'] = $fechaHoraActual;
    }

}else{
    
    $data = [
        'success' => true,//AUNQUE NO TIENE DATOS , PONGO TRUE PARA QUE ENTRE EN EL BLOQUE
        'valorData' => 'no_tiene_datos'
    ];

}

//Cierro conexion con bd
$conn->close();

// Enviar respuesta al producto en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data,JSON_UNESCAPED_UNICODE);

?>