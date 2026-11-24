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
    $id_concepto = $datos['id_concepto'];
    $id_concepto_padre = ($datos['id_concepto_padre'] === '') ? null : $datos['id_concepto_padre'];//si viene vacio => null
    $tipo_concepto = $datos['tipo_concepto'];
    $tipo_uso = ($datos['tipo_uso'] === '') ? null : $datos['tipo_uso'];//si viene vacio => null
    $nombre = $datos['nombre'];
    $comentario = $datos['comentario'];

    //importante
    $stored_id_concepto = null;
    $stored_tipo_uso = null;
    
    //variables de busqueda
    //$concepto_search = normalizeSearchText($nombre ?? '');
    
    // if($comentario){
    //     $concepto_search .= ' __|__ ' . normalizeSearchText($comentario ?? '');
    // }

    
    //debug($title);
    //debug($arr, 'arr');
    //echo_json_x($arr_lista, 'arr_lista');
    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //busco si hay registro en la tabla a donde insertar array
    $sql_prep = "SELECT 
                    id_concepto, 
                    tipo_uso 
                FROM conceptos 
                WHERE id_concepto = ? 
    ";
    $stmt = $conn->prepare($sql_prep);
    if(!$stmt) {
        throw new Exception('2. Error prepare: ' . $conn->error);
    }
    $stmt->bind_param("i", $id_concepto);
    $stmt->execute();
    $result = $stmt->get_result();
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_concepto = $row["id_concepto"];//1
        $stored_tipo_uso = $row["tipo_uso"];//1
        $hay_id_concepto_en_tabla = true;
    }else{
        $hay_id_concepto_en_tabla = false;
    }

	//echo_json_x($hay_id_concepto_en_tabla, 'hay_id_concepto_en_tabla');


    try {
        
        //start transacción
        $conn->begin_transaction();

        //=============================================//
        // start - Gestionar cambios de tipo_uso
        //=============================================//
        if($tipo_uso != $stored_tipo_uso){

            // 1. Desasignar el uso especial del concepto anterior
            $sql = "UPDATE conceptos
                    SET tipo_uso = NULL
                    WHERE tipo_uso = 'pago_pedido'
            ";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception($conn->error);
            }
            $result_ex1 = $stmt->execute();
            if (!$result_ex1) {
                throw new Exception($stmt->error);
            }
            $stmt->close();

            
            // 2. Asignar solamente si se ha seleccionado pago_pedido
            if ($tipo_uso === 'pago_pedido') {
            
                $sql = "UPDATE conceptos
                        SET tipo_uso = 'pago_pedido'
                        WHERE id_concepto = ?
                ";
                $stmt = $conn->prepare($sql);
                if (!$stmt) {
                    throw new Exception($conn->error);
                }
                $stmt->bind_param("i", $id_concepto);
                $result_ex2 = $stmt->execute();
                if (!$result_ex2) {
                    throw new Exception($stmt->error);
                }
                $stmt->close();
            }

        }
        //=============================================//
        // start - Gestionar cambios de tipo_uso
        //=============================================//



        //===============================================================//
        // start - UPSERT
        //===============================================================//
        $action_tipo = ($hay_id_concepto_en_tabla)
            ? 'is_update_concepto' 
            : 'is_insert_concepto';

        $id_concepto_upsert = ($hay_id_concepto_en_tabla)
            ? $id_concepto
            : null;

        //consulta UPSERT
        $sql2_upsert = "INSERT INTO conceptos
                        (
                            id_concepto,
                            id_concepto_padre,
                        
                            tipo_concepto,
                            tipo_uso,
                            nombre,
                            comentario,
                                            
                            created_at
                        )        
                        VALUES
                        (
                            ?, ?,
                            
                            ?, ?, ?, ?,
                                                
                            NOW()
                        )
                        
                        ON DUPLICATE KEY UPDATE
                        
                            id_concepto_padre = VALUES(id_concepto_padre),
                            tipo_concepto = VALUES(tipo_concepto),
                            tipo_uso = VALUES(tipo_uso),
                            nombre = VALUES(nombre),
                            comentario = VALUES(comentario),                    
                                            
                            updated_at = NOW()
        ";
        //mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);//para ver el error exacto
        $stmt = $conn->prepare($sql2_upsert);

        if (!$stmt) {
            throw new Exception('Error prepare: ' . $conn->error);
        }
        
        //IMPORTANTE! Normalizar Windows/Mac/Linux (debe estar con bind_param())
        $nombre = str_replace(["\r\n", "\r"], "\n", $nombre);
        $comentario = str_replace(["\r\n", "\r"], "\n", $comentario);

        $stmt->bind_param(
            "iissss",
        
            $id_concepto_upsert,
            $id_concepto_padre,
            
            $tipo_concepto,
            $tipo_uso,
            $nombre,
            $comentario    
        );
        $result2 = $stmt->execute();

        if (!$result2) {
            throw new Exception('Error UPSERT: ' . $stmt->error);
        }

        $id_concepto_insertado = $conn->insert_id;//importante! si se inserta tendrá id de insert, lo guardo en esta variable ya que con otras consultas (si hay) $conn->insert_id se modifica y no es el valor correcto para mi!!!
        //===============================================================//
        // end - UPSERT
        //===============================================================//


        // Todas las operaciones se han completado correctamente
        $conn->commit();

        //si no hay errores y se ha guradado upsert correctamente
        //sigo adelante...
        //si hay errores, salto a catch()

        if($hay_id_concepto_en_tabla){//si es update, id_concepto ya lo tengo
            $action_val = 'is_update';
            $id_concepto_val = $stored_id_concepto;
            $mensaje_val = 'Datos actualizados correctamente.';
        }else{//es insert
            $action_val = 'is_insert';
            $id_concepto_val = $id_concepto_insertado;//es id insertado del concepto nuevo de esta $conn
            $mensaje_val = 'Datos insertados correctamente.';
        }

        $respuesta = [
            'success' => true,
            'id_concepto' => $id_concepto_val,
            'action' => $action_val,
            'action_tipo' => $action_tipo,
            'mensaje' => $mensaje_val
        ];


        //Cierro conexion con bd
        $conn->close();	

    } catch (Throwable $e) {

        // Deshacer UPSERT, líneas y modificaciones de taquillas
        $conn->rollback();

        error_log('Error al guardar pedido: ' . $e->getMessage());

        if($hay_id_concepto_en_tabla){
            $error_text = 'Error al actualizar datos: ';
        }else{
            $error_text = 'Error al insertar datos: ';
        }
        //writeLog($error_text . " [" . $conn->error . "]");

        http_response_code(500);
        $respuesta = [
            'success' => false,
            'error' => $error_text . 'No se aplicaron los cambios.',
            'conn_error' => $conn->error
        ];
        
        //Cierro conexion con bd
        $conn->close();
    }


    // Enviar respuesta al concepto en formato JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);	
}

?>
