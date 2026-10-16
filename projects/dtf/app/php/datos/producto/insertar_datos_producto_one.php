<?php
$niveles_para_subir = '../../';

include($niveles_para_subir . 'includes/config.php');
session_start();//importante para ver al usuario logueado
include($niveles_para_subir . 'functions.php');





//si los datos NO VIENEN desde el metodo permitido
if (!in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
	// Manejar solicitudes incorrectas
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Solicitud incorrecta.',
        'dic_code' => 'd250'
    ],JSON_UNESCAPED_UNICODE);
    exit;
}

//si los datos SÍ VIENEN desde desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
    
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $jsonString = file_get_contents('php://input');//saco datos del cuerpo de la solicitud. 
        //debug($jsonString, 'jsonString');
    }    
    
    // Recuperar datos JSON
    $datos = json_decode($jsonString, true);
    //debug($datos, 'datos');
	//echo_json($datos, 'datos');
	//echo_json_x($datos, 'datos');


    // Validar si la decodificación fue exitosa
    if (json_last_error() === JSON_ERROR_NONE) {
        // Validar estructura y contenido del JSON
        if (isset($datos['nombre']) ) {//campo obligatorio para rellenar en formulario
            //echo "JSON es válido y contiene las claves esperadas.";
            //sigo adelante...
        } else {
            //echo "JSON no contiene las claves esperadas.";
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Error al procesar el JSON. El objeto no contiene las claves esperadas.',
                'dic_code' => 'd301'
            ],JSON_UNESCAPED_UNICODE);
            exit;
        }
    } else {
        //echo "Error al decodificar JSON: " . json_last_error_msg();
        //writeLog("Error al decodificar JSON. Error: [" . json_last_error_msg() . "]", 'ERROR');

        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Error al decodificar JSON.',
            'json_last_error_msg' => json_last_error_msg(),
            'dic_code' => 'd302'
        ],JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Verificar que se decodificó correctamente
    if ($datos === null) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Error al procesar el JSON.',
            'dic_code' => 'd235'
        ],JSON_UNESCAPED_UNICODE);
        exit;
    }
    

    //exit('<br>hasta aki');


    // Recuperar los valores
    if(true /*isset($_SESSION['username']) && isset($_SESSION['id_user']) */) {
        //$id_user_logged = $_SESSION['id_user'];
        //$username_logged = $_SESSION['username'];
        $id_user_logged = 1;
        $username_logged = 'demo_user';
        //echo json_encode(['mensaje' => 'sesion username_logged: ' . $username_logged ]);        
    } else {
        $id_user_logged = 5;
        $username_logged = 'user_test_no_borrar';
        //echo json_encode(['mensaje' => $username_logged]);
        
        //writeLog("No existe sessión. Para insertar datos hay que loguearse antes. Solicitud incorrecta.");
        
        // Manejar solicitudes incorrectas
        //http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No existe sessión. Para insertar datos hay que loguearse antes. Solicitud incorrecta.',
            'dic_code' => 'd245'
        ],JSON_UNESCAPED_UNICODE);
        die();
    }
	//echo_json_x($id_user_logged, 'id_user_logged');

    include($niveles_para_subir . 'includes/connect_db.php');

    
    //ya que uso consulta preparada (prepared statements + bind_param()), no hay que usar $conn->real_escape_string()
    $id_producto = $datos['id_producto'];
    $nombre = $datos['nombre'];
    $descripcion = $datos['descripcion'];
    $precio_compra = ($datos['precio_compra'] === '') ? null : $datos['precio_compra'];//si viene vacio => null
    $precio_venta = ($datos['precio_venta'] === '') ? null : $datos['precio_venta'];//si viene vacio => null
    
    //variables de busqueda
    $producto_search = normalizeSearchText($nombre ?? '');
    
    if($descripcion){
        $producto_search .= ' __|__ ' . normalizeSearchText($descripcion ?? '');
    }


    //debug($title);
    //debug($arr, 'arr');
    //echo_json_x($arr_lista, 'arr_lista');
    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //busco si hay registro en la tabla a donde insertar array
    $sql_prep = "SELECT id_producto 
                FROM productos 
                WHERE id_producto = ? 
    ";
    $stmt = $conn->prepare($sql_prep);
    if(!$stmt) {
        die("Error SQL");
    }
    $stmt->bind_param("i", $id_producto);
    $stmt->execute();
    $result = $stmt->get_result();
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_producto = $row["id_producto"];//1
        $hay_id_producto_en_tabla = true;
    }else{
        $hay_id_producto_en_tabla = false;
    }

	//echo_json_x($hay_id_producto_en_tabla, 'hay_id_producto_en_tabla');



    //===============================================================//
    // start - UPSERT
    //===============================================================//
    $action_tipo = ($hay_id_producto_en_tabla)
        ? 'is_update_producto' 
        : 'is_insert_producto';

    $id_producto_upsert = ($hay_id_producto_en_tabla)
        ? $id_producto
        : null;

    //consulta UPSERT
    $sql2_upsert = "INSERT INTO productos
                    (
                        id_producto,
                    
                        nombre,
                        producto_search,
                        descripcion,
                    
                        precio_compra,
                        precio_venta,
                    
                        created_at
                    )        
                    VALUES
                    (
                        ?,
                    
                        ?, ?, ?,
                        
                        ?, ?, 
                    
                        NOW()
                    )
                    
                    ON DUPLICATE KEY UPDATE
                    
                        nombre = VALUES(nombre),
                        producto_search = VALUES(producto_search),
                        descripcion = VALUES(descripcion),                    
                    
                        precio_compra = VALUES(precio_compra),
                        precio_venta = VALUES(precio_venta),
                    
                        updated_at = NOW()
    ";
    //mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);//para ver el error exacto
    $stmt = $conn->prepare($sql2_upsert);

    if (!$stmt) {
        die('Error prepare: ' . $conn->error);
    }
    
    //IMPORTANTE! Normalizar Windows/Mac/Linux (debe estar con bind_param())
    $nombre = str_replace(["\r\n", "\r"], "\n", $nombre);
    $descripcion = str_replace(["\r\n", "\r"], "\n", $descripcion);

    $stmt->bind_param(
        "isssdd",
    
        $id_producto_upsert,
    
        $nombre,
        $producto_search,
        $descripcion,
    
        $precio_compra,
        $precio_venta
    );
    $result2 = $stmt->execute();
    //===============================================================//
    // end - UPSERT
    //===============================================================//


    //Update o insert datos en la tabla $tabla
    if($result2 === TRUE) {

        if($hay_id_producto_en_tabla){//si es update, id_producto ya lo tengo
            $action_val = 'is_update';
            $action_tipo = 'is_update_producto';
            $id_producto_val = $stored_id_producto;
            $mensaje_val = 'Datos actualizados correctamente.';
        }else{//es insert
            $action_val = 'is_insert';
            $action_tipo = 'is_insert_producto';
            $id_producto_val = $conn->insert_id;//es id insertado del producto nuevo de esta $conn
            $mensaje_val = 'Datos insertados correctamente.';
        }

        $respuesta = [
            'success' => true,
            'id_producto' => $id_producto_val,
            'action' => $action_val,
            'action_tipo' => $action_tipo,
            'mensaje' => $mensaje_val
        ];

    }else{

        if($hay_id_producto_en_tabla){
            $error_text = 'Error al actualizar datos: ';
        }else{
            $error_text = 'Error al insertar datos: ';
        }
        //writeLog($error_text . " [" . $conn->error . "]");

        $respuesta = [
            'success' => false,
            'error' => $error_text,
            'conn_error' => $conn->error
        ];
    }

    //Cierro conexion con bd
    $conn->close();	

    // Enviar respuesta al producto en formato JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);	
}

?>
