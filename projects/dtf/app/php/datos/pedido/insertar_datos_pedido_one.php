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

    if (!is_array($datos)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Los datos del pedido no son válidos.',
            'dic_code' => '...'
        ],JSON_UNESCAPED_UNICODE);
        exit;
    }


    // Validar si la decodificación fue exitosa
    if (json_last_error() === JSON_ERROR_NONE) {
        // Validar estructura y contenido del JSON
        if (isset($datos['id_cliente']) ) {//campo obligatorio para rellenar en formulario
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


    // Validar el array plano de artículos recibido
    $arr_items = $datos['arr_items'] ?? [];

    if (!is_array($arr_items)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'El array arr_items no es válido.',
            'dic_code' => 'd235'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $tipos_validos = ['producto', 'bono', 'servicio'];


    foreach ($arr_items as $indice => $item) {
        if (!is_array($item)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "El artículo en la posición $indice no es válido.",
                'dic_code' => 'd235'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if (!isset($item['tipo_concepto']) ||
            !in_array($item['tipo_concepto'], $tipos_validos, true)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "El tipo_concepto del artículo en la posición $indice no es válido.",
                'dic_code' => 'd235'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
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
    $id_pedido = $datos['id_pedido'];
    $id_cliente = $datos['id_cliente'];
    $id_taquilla = ($datos['id_taquilla'] === '') ? null : $datos['id_taquilla'];//si viene vacio => null
    $fecha_pedido = $datos['fecha_pedido'];
    $canal_venta = $datos['canal_venta'];
    $canal_aviso = $datos['canal_aviso'];
    $comentario = $datos['comentario'];
    $estado_pedido = $datos['estado_pedido'];
    $estado_pago = $datos['estado_pago'];
    $metodo_pago = $datos['metodo_pago'];

    $subtotal = ($datos['subtotal'] === '') ? null : $datos['subtotal'];//si viene vacio => null
    $iva_incluido = ($datos['iva_incluido'] === '') ? 0 : $datos['iva_incluido'];//si viene vacio => 0
    $iva_total = ($datos['iva_total'] === '') ? null : $datos['iva_total'];//si viene vacio => null
    $total = ($datos['total'] === '') ? null : $datos['total'];//si viene vacio => null
    $importe_pagado = ($datos['importe_pagado'] === '') ? null : $datos['importe_pagado'];//si viene vacio => null

    //si es nuevo pedido necesito esto
    $stored_id_taquilla = null;//si se edita pedido se reasigna
    
    //variables de busqueda
    // $pedido_search = normalizeSearchText($fecha_pedido ?? '');
    
    // if($comentario){
    //     $pedido_search .= ' __|__ ' . normalizeSearchText($comentario ?? '');
    // }

    
    //debug($title);
    //debug($arr, 'arr');
    //echo_json_x($arr_lista, 'arr_lista');
    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //busco si hay registro en la tabla a donde insertar datos
    $sql_prep = "SELECT 
                
                id_pedido, 
                id_taquilla

                FROM pedidos 
                WHERE id_pedido = ? 
    ";
    $stmt = $conn->prepare($sql_prep);
    if(!$stmt) {
        die("Error SQL");
    }
    $stmt->bind_param("i", $id_pedido);
    $stmt->execute();
    $result = $stmt->get_result();
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_pedido = $row["id_pedido"];//1
        $stored_id_taquilla = $row["id_taquilla"];//1
        $hay_id_pedido_en_tabla = true;
    }else{
        $hay_id_pedido_en_tabla = false;
    }

	//echo_json_x($hay_id_pedido_en_tabla, 'hay_id_pedido_en_tabla');


    //solo reviso si la nueva taquilla es distinta a la taquilla de la bd.
    //es decir, si se asigna nueva taquilla, y no se guardan los mismos datos al editar pedido
    if($id_taquilla && $id_taquilla != $stored_id_taquilla ){
        
        //busco si la taquilla está libre para poder ocuparse
        $sql_taq = "SELECT     
                        id_taquilla,
                        nombre,
                        estado_taquilla

                        FROM taquillas 
                        WHERE id_taquilla = ? AND estado_taquilla = 'libre'
        ";
        $stmt = $conn->prepare($sql_taq);

        if (!$stmt) {
            throw new Exception(
                'Error al preparar la consulta de si hay taquilla libre en taquillas: ' . $conn->error
            );
        }

        $stmt->bind_param("i", $id_taquilla);
        $stmt->execute();
        $result_taq = $stmt->get_result();
        //debug_x($sql_preparada, 'sql_preparada');

        if($result_taq->num_rows > 0){
            $row_taq = $result_taq->fetch_assoc();
            //echo_json_x($row,'row');
            $hay_taquilla_libre = true;
        }else{
            $hay_taquilla_libre = false;
        }

        if($hay_taquilla_libre == false){
            
            //echo_json_x($row,'row');
            
            $respuesta = [
                'success' => false,
                'error' => 'La taquilla indicada está ocupada. Selecciona otra taquilla por favor.',
                'conn_error' => $conn->error
            ];

            //Cierro conexion con bd
            $conn->close();	

            // Enviar respuesta al pedido en formato JSON
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);
            exit();
        }
    }




    try {
        
        //start transacción
        $conn->begin_transaction();

        //===============================================================//
        // start - UPSERT
        //===============================================================//
        $action_tipo = ($hay_id_pedido_en_tabla)
            ? 'is_update_pedido' 
            : 'is_insert_pedido';

        $id_pedido_upsert = ($hay_id_pedido_en_tabla)
            ? $id_pedido
            : null;

        //echo_json_x($id_pedido_upsert,'id_pedido_upsert');

        //consulta UPSERT
        $sql2_upsert = "INSERT INTO pedidos
                        (
                            id_pedido,
                            id_cliente,
                            id_taquilla,
                        
                            fecha_pedido,
                            canal_venta,
                            canal_aviso,
                            comentario,

                            estado_pedido,
                            estado_pago,
                            metodo_pago,
                        
                            subtotal,
                            iva_incluido,
                            iva_total,
                            total,
                            importe_pagado,
                        
                            created_at
                        )        
                        VALUES
                        (
                            ?, ?, ?,
                        
                            ?, ?, ?, ?,
                            
                            ?, ?, ?,
                            
                            ?, ?, ?, ?, ?,
                                                
                            NOW()
                        )
                        
                        ON DUPLICATE KEY UPDATE
                        
                            id_cliente = VALUES(id_cliente),
                            id_taquilla = VALUES(id_taquilla),

                            fecha_pedido = VALUES(fecha_pedido),
                            canal_venta = VALUES(canal_venta),
                            canal_aviso = VALUES(canal_aviso),
                            comentario = VALUES(comentario),                    
                        
                            estado_pedido = VALUES(estado_pedido),
                            estado_pago = VALUES(estado_pago),
                            metodo_pago = VALUES(metodo_pago),

                            subtotal = VALUES(subtotal),
                            iva_incluido = VALUES(iva_incluido),
                            iva_total = VALUES(iva_total),
                            total = VALUES(total),                        
                            importe_pagado = VALUES(importe_pagado),                        
                        
                            updated_at = NOW()
        ";
        //mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);//para ver el error exacto
        $stmt = $conn->prepare($sql2_upsert);

        if (!$stmt) {
            throw new Exception(
                'Error al preparar la consulta: ' . $conn->error
            );
        }
        
        //IMPORTANTE! Normalizar Windows/Mac/Linux (debe estar con bind_param())
        $comentario = str_replace(["\r\n", "\r"], "\n", $comentario);

        $stmt->bind_param(
            "iiisssssssdiddd",
        
            $id_pedido_upsert,
            $id_cliente,
            $id_taquilla,
        
            $fecha_pedido,
            $canal_venta,
            $canal_aviso,
            $comentario, 
            
            $estado_pedido,
            $estado_pago,
            $metodo_pago,

            $subtotal,
            $iva_incluido,
            $iva_total,
            $total,
            $importe_pagado
        );
        $result2 = $stmt->execute();

        if (!$result2) {
            throw new Exception(
                'Error al guardar la cabecera del pedido: ' . $stmt->error
            );
        }

        $id_pedido_insertado = $conn->insert_id;//importante! si se inserta tendrá id de insert, lo guardo en esta variable ya que con otras consultas (si hay) $conn->insert_id se modifica y no es el valor correcto para mi!!!


        // echo_json_x([
        //     'hay_id_pedido_en_tabla' => $hay_id_pedido_en_tabla,
        //     'id_pedido_upsert' => $id_pedido_upsert,
        //     'insert_id' => $conn->insert_id,
        //     'affected_rows' => $stmt->affected_rows,
        //     'error' => $stmt->error
        // ], 'debug_upsert');

        //===============================================================//
        // end - UPSERT
        //===============================================================//





        //===============================================================//
        // START - INSERTAR ITEMS DEL PEDIDO
        //===============================================================//

        // Obtener el ID definitivo del pedido
        $id_pedido_val = $hay_id_pedido_en_tabla
            ? $stored_id_pedido
            : $id_pedido_insertado;


        // 1. Si es una actualización, eliminar las líneas anteriores
        // para sustituirlas por las líneas recibidas
        if ($hay_id_pedido_en_tabla) {

            $sql_delete = "DELETE FROM pedido_items
                            WHERE id_pedido = ?
            ";
            $stmt_delete = $conn->prepare($sql_delete);

            if (!$stmt_delete) {
                throw new Exception(
                    'Error al preparar la consulta de eliminar en pedido_items: ' . $conn->error
                );
            }
    
            $stmt_delete->bind_param("i", $id_pedido_val);
            $result_delete = $stmt_delete->execute();

            if (!$result_delete) {
                throw new Exception(
                    'Error al ejecutar la consulta de eliminar en pedido_items: ' . $conn->error
                );
            }

            $stmt_delete->close();
        }


        // 2. Preparar INSERT de las líneas
        $sql_item = "INSERT INTO pedido_items 
            (
                id_pedido,

                tipo_item,
                
                id_producto,
                id_bono,
                id_servicio,

                nombre,            
                cantidad,
                precio,
                importe,
                
                created_at
            ) 
            VALUES 
            (
                ?, 
                
                ?, 
                
                ?, ?, ?,
                
                ?, ?, ?, ?, 
                
                NOW()
            )
        ";
        $stmt_item = $conn->prepare($sql_item);

        if (!$stmt_item) {
            throw new Exception(
                'Error al preparar la consulta de pedido_items: ' . $conn->error
            );
        }

        // 3. Obtener el array plano de artículos recibido
        $arr_items = $datos['arr_items'] ?? [];

        // 4. Recorrer todos los artículos
        foreach ($arr_items as $item) {

            $tipo_concepto = $item['tipo_concepto'];

            $id_producto = null;
            $id_bono = null;
            $id_servicio = null;

            $id_item = (int) ($item['id'] ?? 0);

            $nombre = $item['nombre'] ?? '';
            $cantidad = (float) ($item['cantidad'] ?? 0);
            $precio = (float) ($item['precio'] ?? 0);
            $importe = (float) ($item['importe'] ?? 0);

            // Asignar el ID según el tipo de concepto
            switch ($tipo_concepto) {
                case 'producto':
                    $id_producto = $id_item;
                    break;

                case 'bono':
                    $id_bono = $id_item;
                    break;

                case 'servicio':
                    $id_servicio = $id_item;
                    break;
            }

            // Insertar la línea
            $stmt_item->bind_param(
                "isiiisddd",
                $id_pedido_val,
                $tipo_concepto,
                $id_producto,
                $id_bono,
                $id_servicio,
                $nombre,
                $cantidad,
                $precio,
                $importe
            );

            if (!$stmt_item->execute()) {
                throw new Exception(
                    'Error al guardar el item ' . $nombre . ': ' . $stmt_item->error
                );
            }
        }

        $stmt_item->close();

        //===============================================================//
        // END - INSERTAR ITEMS DEL PEDIDO
        //===============================================================//


        
        // Gestionar cambios de taquilla - new
        if ($id_taquilla != $stored_id_taquilla) {

            // Si hay una nueva taquilla, marcarla como ocupada
            if ($id_taquilla) {
                $sql = "UPDATE taquillas
                        SET estado_taquilla = 'ocupado'
                        WHERE id_taquilla = ?";

                $stmt = $conn->prepare($sql);

                if (!$stmt) {
                    throw new Exception(
                        'Error al preparar la actualización de la nueva taquilla: '
                        . $conn->error
                    );
                }

                $stmt->bind_param("i", $id_taquilla);

                if (!$stmt->execute()) {
                    throw new Exception(
                        'Error al marcar la nueva taquilla como ocupada: '
                        . $stmt->error
                    );
                }

                $stmt->close();
            }

            // Si existía una taquilla anterior, liberarla
            if ($stored_id_taquilla) {
                $sql = "UPDATE taquillas
                        SET estado_taquilla = 'libre'
                        WHERE id_taquilla = ?";

                $stmt = $conn->prepare($sql);

                if (!$stmt) {
                    throw new Exception(
                        'Error al preparar la liberación de la taquilla anterior: '
                        . $conn->error
                    );
                }

                $stmt->bind_param("i", $stored_id_taquilla);

                if (!$stmt->execute()) {
                    throw new Exception(
                        'Error al liberar la taquilla anterior: '
                        . $stmt->error
                    );
                }

                $stmt->close();
            }
        }
        


        // Todas las operaciones se han completado correctamente
        $conn->commit();

        //Update o insert datos en la tabla $tabla
        if($result2 === TRUE) {

            if($hay_id_pedido_en_tabla){//si es update, id_pedido ya lo tengo
                $action_val = 'is_update';
                $action_tipo = 'is_update_pedido';
                $id_pedido_val = $stored_id_pedido;
                $mensaje_val = 'Datos actualizados correctamente.';
            }else{//es insert
                $action_val = 'is_insert';
                $action_tipo = 'is_insert_pedido';
                $id_pedido_val = $id_pedido_insertado;//es id insertado del pedido nuevo de esta $conn
                $mensaje_val = 'Datos insertados correctamente.';
            }

            $respuesta = [
                'success' => true,
                'id_pedido' => $id_pedido_val,
                'action' => $action_val,
                'action_tipo' => $action_tipo,
                'mensaje' => $mensaje_val
            ];

        }else{

            if($hay_id_pedido_en_tabla){
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


    } catch (Throwable $e) {

        // Deshacer UPSERT, líneas y modificaciones de taquillas
        $conn->rollback();

        error_log('Error al guardar pedido: ' . $e->getMessage());

        http_response_code(500);

        $respuesta = [
            'success' => false,
            'error' => 'No se pudo guardar el pedido. No se aplicaron los cambios.',
            'conn_error' => $conn->error
        ];

        $conn->close();
    }

    // Enviar respuesta al pedido en formato JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);	
}

?>
