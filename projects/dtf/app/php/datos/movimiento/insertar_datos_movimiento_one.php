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
        if (isset($datos['importe']) ) {//campo obligatorio para rellenar en formulario
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
    $id_movimiento = $datos['id_movimiento'];
    $tipo_movimiento = $datos['tipo_movimiento'];
    $id_cliente = ($datos['id_cliente'] === '') ? null : $datos['id_cliente'];//si viene vacio => null
    $fecha_movimiento = $datos['fecha_movimiento'];
    $importe = ($datos['importe'] === '') ? null : $datos['importe'];//si viene vacio => null
    $metodo_pago = $datos['metodo_pago'];
    $titulo = $datos['titulo'];
    $comentario = $datos['comentario'];
    $confirmado = ($datos['confirmado'] === '') ? 1 : $datos['confirmado'];//si viene vacio => 1

    if ($tipo_movimiento == 'gasto') {
        $importe = -abs((float) $importe);//gasto -> importe negativo
    } else {
        $importe = abs((float) $importe);//ingreso -> importe positivo
    }
    
    //debug($title);
    //debug($arr, 'arr');
    //echo_json_x($arr_lista, 'arr_lista');
    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //busco si hay registro en la tabla a donde insertar array
    $sql_prep = "SELECT id_movimiento 
                FROM movimientos 
                WHERE id_movimiento = ? 
    ";
    $stmt = $conn->prepare($sql_prep);
    if(!$stmt) {
        die("Error SQL");
    }
    $stmt->bind_param("i", $id_movimiento);
    $stmt->execute();
    $result = $stmt->get_result();
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_movimiento = $row["id_movimiento"];//1
        $hay_id_movimiento_en_tabla = true;
    }else{
        $hay_id_movimiento_en_tabla = false;
    }

	//echo_json_x($hay_id_movimiento_en_tabla, 'hay_id_movimiento_en_tabla');



    //===============================================================//
    // start - UPSERT
    //===============================================================//
    $action_tipo = ($hay_id_movimiento_en_tabla)
        ? 'is_update_movimiento' 
        : 'is_insert_movimiento';

    $id_movimiento_upsert = ($hay_id_movimiento_en_tabla)
        ? $id_movimiento
        : null;

    //consulta UPSERT
    $sql2_upsert = "INSERT INTO movimientos
                    (
                        id_movimiento,
                        id_cliente,

                        tipo_movimiento,

                        fecha_movimiento,
                        importe,
                        metodo_pago,

                        titulo,
                        comentario,

                        confirmado,
                    
                        created_at
                    )        
                    VALUES
                    (
                        ?, ?,

                        ?, 
                    
                        ?, ?, ?,

                        ?, ?,
                        
                        ?,  
                    
                        NOW()
                    )
                    
                    ON DUPLICATE KEY UPDATE
                    
                        tipo_movimiento = VALUES(tipo_movimiento),
                        id_cliente = VALUES(id_cliente),
                        
                        fecha_movimiento = VALUES(fecha_movimiento),
                        importe = VALUES(importe),
                        metodo_pago = VALUES(metodo_pago),

                        titulo = VALUES(titulo),
                        comentario = VALUES(comentario),                    

                        confirmado = VALUES(confirmado),
                    
                        updated_at = NOW()
    ";
    //mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);//para ver el error exacto
    $stmt = $conn->prepare($sql2_upsert);

    if (!$stmt) {
        die('Error prepare: ' . $conn->error);
    }
    
    //IMPORTANTE! Normalizar Windows/Mac/Linux (debe estar con bind_param())
    $titulo = str_replace(["\r\n", "\r"], "\n", $titulo);
    $comentario = str_replace(["\r\n", "\r"], "\n", $comentario);

    $stmt->bind_param(
        "iissdsssi",
    
        $id_movimiento_upsert,
        $id_cliente,
    
        $tipo_movimiento,

        $fecha_movimiento,
        $importe,
        $metodo_pago,

        $titulo,
        $comentario,

        $confirmado    
    );
    $result2 = $stmt->execute();
    $id_movimiento_insertado = $conn->insert_id;//importante! si se inserta tendrá id de insert, lo guardo en esta variable ya que con otras consultas (si hay) $conn->insert_id se modifica y no es el valor correcto para mi!!!
    //===============================================================//
    // end - UPSERT
    //===============================================================//


    //Update o insert datos en la tabla $tabla
    if($result2 === TRUE) {

        if($hay_id_movimiento_en_tabla){//si es update, id_movimiento ya lo tengo
            $action_val = 'is_update';
            $action_tipo = 'is_update_movimiento';
            $id_movimiento_val = $stored_id_movimiento;
            $mensaje_val = 'Datos actualizados correctamente.';
        }else{//es insert
            $action_val = 'is_insert';
            $action_tipo = 'is_insert_movimiento';
            $id_movimiento_val = $id_movimiento_insertado;//es id insertado del movimiento nuevo de esta $conn
            $mensaje_val = 'Datos insertados correctamente.';
        }

        $respuesta = [
            'success' => true,
            'id_movimiento' => $id_movimiento_val,
            'action' => $action_val,
            'action_tipo' => $action_tipo,
            'mensaje' => $mensaje_val
        ];

    }else{

        if($hay_id_movimiento_en_tabla){
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

    // Enviar respuesta al movimiento en formato JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);	
}

?>
