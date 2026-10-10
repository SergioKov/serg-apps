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

        $id_almacen = $datos['id_almacen'];
    } 

}



include('includes/connect_db.php');

$id_almacen = $datos['id_almacen'];//aki no hace falta $conn->real_escape_string(...) ya que uso consultas preparadas

$id_user_logged = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null ;
//echo_json_x($datos, 'datos');

//luego añadire comprobacion de permisos de usuario para eliminar almacenes
//por ahora lo comento...!
// if(/*!$_SESSION['id_user'] || */ $_SESSION['email'] != 'sergiokovalchuk@gmail.com'){
//     echo json_encode([
//         'success' => false,
//         'valorData' => '80.no_tiene_datos',
//         'error' => 'El usuario no tiene permisos para eliminar almacenes.',
//         'dic_code' => 'd...'
//     ],JSON_UNESCAPED_UNICODE);
//     exit;
// }


//busco si hay registro
// Preparar y ejecutar la consulta
$sql_init = "SELECT 
                id_almacen, 
                nombre, 
                direccion, 
                comentario, 
                created_at, 
                updated_at  
            FROM almacenes 
            WHERE id_almacen = ?
";
$stmt = $conn->prepare($sql_init);
$stmt->bind_param("i", $id_almacen);
$stmt->execute();
$result = $stmt->get_result();

//echo_json_x($sql_init, 'sql');
//debug_x($sql_init, 'sql');


if($result->num_rows > 0){   
    $row = $result->fetch_assoc();
    //echo_json_x($row, 'row']);
    
    $id_almacen_bd = $row['id_almacen'];
    $data = [
        'success' => true,
        'id_almacen' => $row['id_almacen'],
        'nombre' => $row['nombre'],
        'direccion' => $row['direccion'],
        'comentario' => $row['comentario'],
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
        'valorData' => 'hay_datos'
    ];

    //consulta para eliminar
    $sql_delete = "DELETE FROM 
                    almacenes 
                   WHERE id_almacen = ?
    ";
    $stmt = $conn->prepare($sql_delete);
    $stmt->bind_param("i", $id_almacen_bd);
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

// Enviar respuesta al cliente en formato JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data,JSON_UNESCAPED_UNICODE);

?>