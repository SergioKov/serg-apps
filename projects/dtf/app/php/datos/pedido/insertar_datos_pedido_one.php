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
    $id_almacen = ($datos['id_almacen'] === '') ? null : $datos['id_almacen'];//si viene vacio => null;
    $id_cliente = $datos['id_cliente'];
    $id_taquilla = ($datos['id_taquilla'] === '') ? null : $datos['id_taquilla'];//si viene vacio => null
    $fecha_pedido = $datos['fecha_pedido'];
    $canal_venta = $datos['canal_venta'];
    $canal_aviso = $datos['canal_aviso'];
    $tipo_pago = $datos['tipo_pago'];
    $comentario = $datos['comentario'];
    $estado_pedido = $datos['estado_pedido'];
    $estado_pago = $datos['estado_pago'];
    $metodo_pago = $datos['metodo_pago'];

    $subtotal = ($datos['subtotal'] === '') ? null : (float) $datos['subtotal'];//si viene vacio => null
    $iva_incluido = ($datos['iva_incluido'] === '') ? 0 : $datos['iva_incluido'];//si viene vacio => 0
    $iva_total = ($datos['iva_total'] === '') ? null : (float) $datos['iva_total'];//si viene vacio => null
    $total = ($datos['total'] === '') ? null : (float) $datos['total'];//si viene vacio => null
    $importe_pagado = ($datos['importe_pagado'] === '') ? null : (float) $datos['importe_pagado'];//si viene vacio => null

    $arr_items = $datos['arr_items'] ?? [];//si no existe -> asigno array vacío
    $arr_pagos = $datos['arr_pagos'] ?? [];//si no existe -> asigno array vacío
    
    //===========================================================//
    // start - Validar el array plano de artículos recibido
    //===========================================================//
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

        if (!isset($item['tipo_item']) ||
            !in_array($item['tipo_item'], $tipos_validos, true)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "El tipo_item del artículo en la posición $indice no es válido.",
                'dic_code' => 'd235'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    //===========================================================//
    // end - Validar el array plano de artículos recibido
    //===========================================================//


    //si es nuevo pedido necesito esto
    $stored_id_cliente = null;//si se edita pedido se reasigna
    $stored_id_taquilla = null;//si se edita pedido se reasigna
    $stored_importe_pagado = 0;//si se edita pedido se reasigna
    
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
                p.id_pedido, 
                p.id_cliente,
                p.id_taquilla,
                p.importe_pagado 
                FROM pedidos p
                LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
                WHERE p.id_pedido = ?
    ";
    $stmt = $conn->prepare($sql_prep);
    if(!$stmt) {
        die("1. Error SQL");
    }
    $stmt->bind_param("i", $id_pedido);
    $stmt->execute();
    $result = $stmt->get_result();
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_pedido = $row["id_pedido"];//1
        $stored_id_cliente = $row["id_cliente"];//1
        $stored_id_taquilla = $row["id_taquilla"];//1
        $stored_importe_pagado = (float) $row["importe_pagado"];

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



    //verifico el cliente
    if($id_cliente){
        //busco si existe cliente indicado
        $sql_cliente = "SELECT     
                        id_cliente,
                        nombre

                        FROM clientes 
                        WHERE id_cliente = ?
        ";
        $stmt = $conn->prepare($sql_cliente);
        if (!$stmt) {
            throw new Exception(
                'Error al preparar la consulta de cliente: ' . $conn->error
            );
        }
        $stmt->bind_param("i", $id_cliente);
        $stmt->execute();
        $result_cliente = $stmt->get_result();

        if($result_cliente->num_rows > 0){
            $row_cliente = $result_cliente->fetch_assoc();
            $hay_cliente = true;
        }else{
            $hay_cliente = false;
        }

        if($hay_cliente == false){            
            //echo_json_x($row,'row');
            
            $respuesta = [
                'success' => false,
                'error' => 'No existe el cliente indicado. Selecciona al cliente que existe por favor.',
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
                            id_almacen,
                            id_cliente,
                            id_taquilla,
                        
                            fecha_pedido,
                            canal_venta,
                            canal_aviso,
                            comentario,

                            estado_pedido,

                            tipo_pago,
                            metodo_pago,
                            estado_pago,
                        
                            subtotal,
                            iva_incluido,
                            iva_total,
                            total,
                            importe_pagado,
                        
                            created_at
                        )        
                        VALUES
                        (
                            ?, ?, ?, ?,
                            ?, ?, ?, ?,
                            ?, 
                            ?, ?, ?,
                            ?, ?, ?, ?, ?,
                            NOW()
                        )
                        
                        ON DUPLICATE KEY UPDATE
                        
                            id_almacen = VALUES(id_almacen),
                            id_cliente = VALUES(id_cliente),
                            id_taquilla = VALUES(id_taquilla),

                            fecha_pedido = VALUES(fecha_pedido),
                            comentario = VALUES(comentario),                    
                            canal_venta = VALUES(canal_venta),
                            canal_aviso = VALUES(canal_aviso),
                        
                            estado_pedido = VALUES(estado_pedido),

                            tipo_pago = VALUES(tipo_pago),
                            metodo_pago = VALUES(metodo_pago),
                            estado_pago = VALUES(estado_pago),

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
            "iiiissssssssdiddd",
        
            $id_pedido_upsert,
            $id_almacen,
            $id_cliente,
            $id_taquilla,
        
            $fecha_pedido,
            $canal_venta,
            $canal_aviso,
            $comentario, 
            
            $estado_pedido,

            $tipo_pago,
            $metodo_pago,
            $estado_pago,

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




        // Obtener el ID definitivo del pedido
        $id_pedido_val = $hay_id_pedido_en_tabla
            ? $stored_id_pedido
            : $id_pedido_insertado;



        //===============================================================//
        // START - INSERTAR ITEMS DEL PEDIDO - VERSIÓN OLD OK
        //===============================================================//
        //NO EJECUTAR ESTE BLOQUE. ES CORRECTO PERO VERSIÓN NUEVA ES MEJOR. DEJO EL BLOQUE COMO EJEMPLO!
        if(FALSE){
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
            //$arr_items = $datos['arr_items'] ?? [];//aki no hace falta esta linea ya que lo tengo de arriba (linea 141)

            // 4. Recorrer todos los artículos
            foreach ($arr_items as $item) {

                $tipo_item = $item['tipo_item'];

                $id_producto = null;
                $id_bono = null;
                $id_servicio = null;

                $id_item = (int) ($item['id'] ?? 0);

                $nombre = $item['nombre'] ?? '';
                $cantidad = (float) ($item['cantidad'] ?? 0);
                $precio = (float) ($item['precio'] ?? 0);
                $importe = (float) ($item['importe'] ?? 0);

                // Asignar el ID según el tipo de item
                switch ($tipo_item) {
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
                    $tipo_item,
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
                        'Error al guardar el item del pedido ' . $nombre . ': ' . $stmt_item->error
                    );
                }
            }
            $stmt_item->close();
        }
        //===============================================================//
        // END - INSERTAR ITEMS DEL PEDIDO - VERSIÓN OLD OK
        //===============================================================//



        //===============================================================//
        // START - SINCRONIZAR ITEMS DEL PEDIDO - VERSIÓN NEW
        //===============================================================//
        //SIEMPRE EJECUTAR ESTE BLOQUE! incluso cuando arr_items viene vacio!
        //Si $arr_items está vacío:
        // - No se ejecutará ningún UPDATE.
        // - No se ejecutará ningún INSERT.
        // - Se eliminarán todos los artículos anteriores del pedido.
        if(TRUE){

            // 1. Obtener los IDs de los items que ya existen en BD
            $sql_existentes = "
                SELECT id_pedido_item
                FROM pedido_items
                WHERE id_pedido = ?
            ";
            $stmt_existentes = $conn->prepare($sql_existentes);
            if (!$stmt_existentes) {
                throw new Exception($conn->error);
            }
            $stmt_existentes->bind_param("i", $id_pedido_val);
            if (!$stmt_existentes->execute()) {
                throw new Exception($stmt_existentes->error);
            }
            $result_existentes = $stmt_existentes->get_result();

            $arr_items_existentes = [];
            while ($row = $result_existentes->fetch_assoc()) {
                $arr_items_existentes[(int)$row['id_pedido_item']] = true;//asi formo array: [15 => true,16 => true,18 => true] para comprobar luego la existencia de id 
            }
            $stmt_existentes->close();

            // 2. Preparar consulta UPDATE
            $sql_update = "
                UPDATE pedido_items 
                SET
                    tipo_item = ?,
                    id_producto = ?,
                    id_bono = ?,
                    id_servicio = ?,
                    nombre = ?,
                    cantidad = ?,
                    precio = ?,
                    importe = ?
                WHERE id_pedido_item = ?
                AND id_pedido = ?
            ";
            $stmt_update = $conn->prepare($sql_update);
            if (!$stmt_update) {
                throw new Exception($conn->error);
            }


            // 3. Preparar consulta INSERT
            $sql_insert = "
                INSERT INTO pedido_items
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
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ";
            $stmt_insert = $conn->prepare($sql_insert);
            if (!$stmt_insert) {
                throw new Exception($conn->error);
            }

            // 4. Recorrer los items recibidos
            //$arr_items = $datos['arr_items'] ?? [];//aki no hace falta esta linea ya que lo tengo de arriba (linea 141)

            // Aquí guardaremos los IDs que llegan desde JS
            $arr_ids_items_recibidos = [];

            foreach ($arr_items as $item) {

                $id_pedido_item = (int)($item['id_pedido_item'] ?? 0);
                $tipo_item = $item['tipo_item'] ?? '';
                $id_item = (int)($item['id'] ?? 0);

                $id_producto = null;
                $id_bono = null;
                $id_servicio = null;

                $nombre = $item['nombre'] ?? '';
                $cantidad = (float)($item['cantidad'] ?? 0);
                $precio = (float)($item['precio'] ?? 0);
                $importe = (float)($item['importe'] ?? 0);

                // Asignar el ID según el tipo de item
                switch ($tipo_item) {
                    case 'producto':
                        $id_producto = $id_item;
                        break;

                    case 'bono':
                        $id_bono = $id_item;
                        break;

                    case 'servicio':
                        $id_servicio = $id_item;
                        break;

                    default:
                        throw new Exception('Tipo de item no válido.');
                }


                // Si tiene ID, comprobar que pertenece al pedido
                if ($id_pedido_item > 0) {

                    // Si no pertenece al pedido, ignorar este elemento y no lanzar exepción ya que rompería la ejecusión de consulta
                    if (!isset($arr_items_existentes[$id_pedido_item])) {
                        continue;
                    }

                    // Evitar IDs duplicados
                    if (isset($arr_ids_items_recibidos[$id_pedido_item])) {
                        continue;
                    }

                    // UPDATE del item existente
                    $stmt_update->bind_param(
                        "siiisdddii",
                        $tipo_item,
                        $id_producto,
                        $id_bono,
                        $id_servicio,
                        $nombre,
                        $cantidad,
                        $precio,
                        $importe,
                        $id_pedido_item,
                        $id_pedido_val
                    );

                    if (!$stmt_update->execute()) {
                        throw new Exception($stmt_update->error);
                    }

                    $arr_ids_items_recibidos[$id_pedido_item] = true;

                } else {

                    // INSERT de un item nuevo
                    $stmt_insert->bind_param(
                        "isiiisddd",
                        $id_pedido_val,
                        $tipo_item,
                        $id_producto,
                        $id_bono,
                        $id_servicio,
                        $nombre,
                        $cantidad,
                        $precio,
                        $importe
                    );

                    if (!$stmt_insert->execute()) {
                        throw new Exception($stmt_insert->error);
                    }
                }

            }

            $stmt_update->close();
            $stmt_insert->close();

            // 7. Eliminar los items que ya no vienen en el array
            $sql_delete = "
                DELETE FROM pedido_items
                WHERE id_pedido_item = ?
                AND id_pedido = ?
            ";
            $stmt_delete = $conn->prepare($sql_delete);

            if (!$stmt_delete) {
                throw new Exception($conn->error);
            }

            foreach ($arr_items_existentes as $id_pedido_item => $valor) {

                if (!isset($arr_ids_items_recibidos[$id_pedido_item])) {

                    $stmt_delete->bind_param(
                        "ii",
                        $id_pedido_item,
                        $id_pedido_val
                    );

                    if (!$stmt_delete->execute()) {
                        throw new Exception($stmt_delete->error);
                    }
                }
            }
            $stmt_delete->close();
        }
        //===============================================================//
        // END - SINCRONIZAR ITEMS DEL PEDIDO - VERSIÓN NEW
        //===============================================================//



        


        //===============================================================//
        // START - INSERTAR PAGOS DEL PEDIDO EN MOVIMIENTOS - VERSIÓN OLD OK
        //===============================================================//
        //NO EJECUTAR ESTE BLOQUE. ES CORRECTO PERO VERSIÓN NUEVA ES MEJOR. DEJO EL BLOQUE COMO EJEMPLO!
        if(FALSE){

            // 1. Si es una actualización, eliminar las líneas anteriores
            // para sustituirlas por las líneas recibidas
            if ($hay_id_pedido_en_tabla) {
                $sql_delete_mov = "DELETE FROM movimientos
                                WHERE id_pedido = ?
                ";
                $stmt_delete_mov = $conn->prepare($sql_delete_mov);
                if (!$stmt_delete_mov) {
                    throw new Exception(
                        'Error al preparar la consulta de eliminar movimientos del pedido: ' . $conn->error
                    );
                }    
                $stmt_delete_mov->bind_param("i", $id_pedido_val);
                $result_delete_mov = $stmt_delete_mov->execute();
                if (!$result_delete_mov) {
                    throw new Exception(
                        'Error al ejecutar la consulta de eliminar movimientos del pedido: ' . $conn->error
                    );
                }
                $stmt_delete_mov->close();
            }

            //busco concepto con pago_pedido
            //busco si hay registro en la tabla a donde insertar array
            $sql_prep_con = "SELECT id_concepto 
                FROM conceptos 
                WHERE tipo_uso = 'pago_pedido' 
            ";
            $stmt_con = $conn->prepare($sql_prep_con);
            if (!$stmt_con) {
                throw new Exception($conn->error);
            }
            $stmt_con->execute();
            $result_con = $stmt_con->get_result();
            $row_con = $result_con->fetch_assoc();
            $id_concepto_pago_pedido = $row_con['id_concepto'] ?? null;
            $stmt_con->close();

            // 2. Preparar INSERT de las líneas
            $sql_mov = "INSERT INTO movimientos 
                (
                    id_concepto,
                    id_cliente,
                    id_pedido,

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
                    ?, ?, ?,
                    ?,
                    ?, 
                    ?, ?, ?, ?,
                    ?,
                    NOW()
                )
            ";
            $stmt_mov = $conn->prepare($sql_mov);
            if (!$stmt_mov) {
                throw new Exception(
                    'Error al preparar la consulta de pagos en movimientos: ' . $conn->error
                );
            }
            
            // 3. Obtener el array plano de artículos recibido
            //$arr_pagos = $datos['arr_pagos'] ?? [];//aki no hace falta esta linea ya que lo tengo de arriba (linea 142)

            // 4. Recorrer todos los artículos
            foreach ($arr_pagos as $item) {

                //$id_concepto = $id_concepto_pago_pedido;//es 27
                //$id_cliente;//es el mismo cliente
                //$id_pedido_val;//es el mismo id_pedido_val
                
                $tipo_movimiento = 'ingreso';//aki siempre ingreso ya que es pago de pedido
                $fecha_movimiento = $item['fecha_movimiento'] ?? '';

                $importe = (float) ($item['importe'] ?? 0);
                $metodo_pago = $item['metodo_pago'] ?? '';
                $titulo = $item['titulo'] ?? '';
                $comentario = $item['comentario'] ?? '';
                $confirmado = 1;//aki siempre 1

                //IMPORTANTE! Normalizar Windows/Mac/Linux (debe estar con bind_param())
                $titulo = str_replace(["\r\n", "\r"], "\n", $titulo);
                $comentario = str_replace(["\r\n", "\r"], "\n", $comentario);

                // Insertar la línea
                $stmt_mov->bind_param(
                    "iiissdsssi",
                    
                    $id_concepto_pago_pedido,
                    $id_cliente,
                    $id_pedido_val,

                    $tipo_movimiento,
                    $fecha_movimiento,

                    $importe,
                    $metodo_pago,
                    $titulo,
                    $comentario,
                    $confirmado
                );
                if (!$stmt_mov->execute()) {
                    throw new Exception(
                        'Error al guardar el movimiento con importe ' . $importe . ': ' . $stmt_mov->error
                    );
                }
            }
            $stmt_mov->close();
        }
        //===============================================================//
        // END - INSERTAR PAGOS DEL PEDIDO EN MOVIMIENTOS - VERSIÓN OLD OK
        //===============================================================//






        //===============================================================//
        // START - INSERTAR PAGOS DEL PEDIDO EN MOVIMIENTOS - VERSIÓN NEW
        //===============================================================//
        //SIEMPRE EJECUTAR ESTE BLOQUE! incluso cuando arr_items viene vacio!
        //Si $arr_pagos está vacío:
        // - No se ejecutará ningún UPDATE.
        // - No se ejecutará ningún INSERT.
        // - Se eliminarán todos los pagos anteriores del pedido.
        if(TRUE){
            // 1. Obtener los IDs de los movimientos existentes del pedido
            $sql_existentes = "
                SELECT id_movimiento
                FROM movimientos
                WHERE id_pedido = ?
            ";
            $stmt_existentes = $conn->prepare($sql_existentes);
            if (!$stmt_existentes) {
                throw new Exception(
                    'Error al preparar la consulta de movimientos existentes del pedido: ' . $conn->error
                );
            }
            $stmt_existentes->bind_param("i", $id_pedido_val);
            if (!$stmt_existentes->execute()) {
                throw new Exception(
                    'Error al ejecutar la consulta de movimientos existentes del pedido: ' . $stmt_existentes->error
                );
            }
            $result_existentes = $stmt_existentes->get_result();

            $arr_movimientos_existentes = [];

            while ($row = $result_existentes->fetch_assoc()) {
                $arr_movimientos_existentes[(int)$row['id_movimiento']] = true;
            }
            $stmt_existentes->close();

            
            //busco concepto con pago_pedido
            //busco si hay registro en la tabla a donde insertar array
            $sql_prep_con = "SELECT id_concepto 
                FROM conceptos 
                WHERE tipo_uso = 'pago_pedido' 
            ";
            $stmt_con = $conn->prepare($sql_prep_con);
            if (!$stmt_con) {
                throw new Exception($conn->error);
            }
            $stmt_con->execute();
            $result_con = $stmt_con->get_result();
            $row_con = $result_con->fetch_assoc();
            $id_concepto_pago_pedido = $row_con['id_concepto'] ?? null;
            $stmt_con->close();


            // 2. Preparar consulta UPDATE
            $sql_update = "
                UPDATE movimientos SET
                    id_concepto = ?,
                    id_cliente = ?,
                    tipo_movimiento = ?,
                    fecha_movimiento = ?,
                    importe = ?,
                    metodo_pago = ?,
                    titulo = ?,
                    comentario = ?,
                    confirmado = ?
                WHERE id_movimiento = ?
                    AND id_pedido = ?
            ";
            $stmt_update = $conn->prepare($sql_update);
            if (!$stmt_update) {
                throw new Exception(
                    'Error al preparar la consulta de actualizar movimientos del pedido: ' . $conn->error
                );
            }

            // 3. Preparar consulta INSERT
            $sql_insert = "
                INSERT INTO movimientos
                (
                    id_concepto,
                    id_cliente,
                    id_pedido,
                    tipo_movimiento,
                    fecha_movimiento,
                    importe,
                    metodo_pago,
                    titulo,
                    comentario,
                    confirmado,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ";
            $stmt_insert = $conn->prepare($sql_insert);
            if (!$stmt_insert) {
                throw new Exception(
                    'Error al preparar la consulta de insertar movimientos del pedido: ' . $conn->error
                );
            }

            // 4. Obtener pagos recibidos
            //$arr_pagos = $datos['arr_pagos'] ?? [];//aki no hace falta esta linea ya que lo tengo de arriba (linea 142)

            $arr_ids_movimientos_recibidos = [];

            foreach ($arr_pagos as $item) {

                $id_movimiento = (int)($item['id_movimiento'] ?? 0);

                $tipo_movimiento = 'ingreso';
                $fecha_movimiento = str_replace(
                    'T',
                    ' ',
                    $item['fecha_movimiento'] ?? ''
                );

                $importe = (float)($item['importe'] ?? 0);
                $metodo_pago = $item['metodo_pago'] ?? '';
                $titulo = $item['titulo'] ?? '';
                $comentario = $item['comentario'] ?? '';

                $confirmado = 1;

                // Normalizar saltos de línea
                $titulo = str_replace(["\r\n", "\r"], "\n", $titulo);
                $comentario = str_replace(["\r\n", "\r"], "\n", $comentario);

                // 5. Si tiene ID, actualizar el movimiento
                if ($id_movimiento > 0) {

                    // Si no pertenece al pedido, ignorar este elemento y no lanzar exepción ya que rompería la ejecusión de consulta
                    if (!isset($arr_movimientos_existentes[$id_movimiento])) {
                        continue;
                    }

                    // Evitar IDs duplicados en el array recibido
                    if (isset($arr_ids_movimientos_recibidos[$id_movimiento])) {
                        continue;
                    }

                    $stmt_update->bind_param(
                        "iissdsssiii",
                        $id_concepto_pago_pedido,
                        $id_cliente,
                        $tipo_movimiento,
                        $fecha_movimiento,
                        $importe,
                        $metodo_pago,
                        $titulo,
                        $comentario,
                        $confirmado,
                        $id_movimiento,
                        $id_pedido_val
                    );

                    if (!$stmt_update->execute()) {
                        throw new Exception($stmt_update->error);
                    }

                    $arr_ids_movimientos_recibidos[$id_movimiento] = true;

                } else {

                    // 6. Si no tiene ID, insertar un nuevo movimiento
                    $stmt_insert->bind_param(
                        "iiissdsssi",
                        $id_concepto_pago_pedido,
                        $id_cliente,
                        $id_pedido_val,
                        $tipo_movimiento,
                        $fecha_movimiento,
                        $importe,
                        $metodo_pago,
                        $titulo,
                        $comentario,
                        $confirmado
                    );

                    if (!$stmt_insert->execute()) {
                        throw new Exception($stmt_insert->error);
                    }

                    // MySQL genera automáticamente el nuevo ID
                }
            }

            $stmt_update->close();
            $stmt_insert->close();

            // 7. Eliminar los movimientos que ya no vienen en el array
            $sql_delete = "
                DELETE FROM movimientos
                WHERE id_movimiento = ?
                AND id_pedido = ?
            ";
            $stmt_delete = $conn->prepare($sql_delete);

            if (!$stmt_delete) {
                throw new Exception($conn->error);
            }

            foreach ($arr_movimientos_existentes as $id_movimiento => $valor) {

                if (!isset($arr_ids_movimientos_recibidos[$id_movimiento])) {

                    $stmt_delete->bind_param(
                        "ii",
                        $id_movimiento,
                        $id_pedido_val
                    );

                    if (!$stmt_delete->execute()) {
                        throw new Exception($stmt_delete->error);
                    }
                }
            }
            $stmt_delete->close();
        }
        //===============================================================//
        // END - INSERTAR PAGOS DEL PEDIDO EN MOVIMIENTOS - VERSIÓN NEW
        //===============================================================//








        
        //===============================================================//
        // start - Gestionar cambios de taquilla
        //===============================================================//
        if ($id_taquilla != $stored_id_taquilla) {

            // Si hay una nueva taquilla, marcarla como ocupada
            if ($id_taquilla) {
                $sql = "UPDATE taquillas
                        SET estado_taquilla = 'ocupado'
                        WHERE id_taquilla = ?
                ";
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
                        WHERE id_taquilla = ?
                ";
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
        //===============================================================//
        // end - Gestionar cambios de taquilla
        //===============================================================//

        
        //ahora ya no hace falta!
        //===============================================================//
        // start - Gestionar cambios de importe_pagado en movimientos
        //===============================================================//
        if (FALSE /* $importe_pagado != $stored_importe_pagado */){

            
            // 2. Registrar el ingreso si existe un pago
            if ((float) $importe_pagado > 0) {

                //busco concepto con pago_pedido
                //busco si hay registro en la tabla a donde insertar array
                $sql_prep = "SELECT id_concepto 
                    FROM conceptos 
                    WHERE tipo_uso = 'pago_pedido' 
                ";
                $stmt = $conn->prepare($sql_prep);
                if (!$stmt) {
                    throw new Exception($conn->error);
                }
                $stmt->execute();
                $result = $stmt->get_result();

                $row = $result->fetch_assoc();
                $id_concepto_pago_pedido = $row['id_concepto'] ?? null;
                $stmt->close();


                //saco movimiento vinculado con este pedido
                $sql = "SELECT id_movimiento
                        FROM movimientos
                        WHERE id_pedido = ?
                        AND id_concepto = ?
                ";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param(
                    'ii',
                    $id_pedido_val,
                    $id_concepto_pago_pedido
                );
                $stmt->execute();
                $result_mov = $stmt->get_result();
                
                $row_mov = $result_mov->fetch_assoc();
                $id_movimiento = $row_mov['id_movimiento'] ?? null;
                $stmt->close();

                if ($id_movimiento !== null) {
                    // Actualizar movimiento existente
                    $sql = "UPDATE movimientos SET
                                id_cliente = ?,
                                importe = ?,
                                fecha_movimiento = ?,
                                updated_at = NOW()
                            WHERE id_movimiento = ?
                    ";
                    $stmt = $conn->prepare($sql);

                    $stmt->bind_param(
                        'idsi',
                        $id_cliente,
                        $importe_pagado,
                        $fecha_pedido,
                        $id_movimiento
                    );

                }else{
                    
                    //aki $tipo_movimiento siempre ingreso, ya que se paga por el pedido
                    $tipo_movimiento = 'ingreso';
                    $titulo = 'Pago de pedido ' . $id_pedido_val;
                    $comentario .= ' | El pago se ha hecho automáticamente al introducir importe pagado de ' . $importe_pagado . ' €.';
                    $confirmado = 1;//aki si

                    // Crear movimiento nuevo
                    $sql = "INSERT INTO movimientos (
                            id_concepto,
                            id_cliente,
                            id_pedido,

                            tipo_movimiento,
                            fecha_movimiento,
                            importe,

                            metodo_pago,
                            titulo,
                            comentario,
                            confirmado,

                            created_at

                        ) VALUES (
                            ?, ?, ?,

                            ?, ?, ?,

                            ?, ?, ?, ?,

                            NOW()
                        )
                    ";
                    $stmt = $conn->prepare($sql);
                    if (!$stmt) {
                        die("2. Error SQL: " . $conn->error);
                    }
                    $stmt->bind_param(
                        'iiissdsssi',
                        $id_concepto_pago_pedido,
                        $id_cliente,
                        $id_pedido_val,

                        $tipo_movimiento,
                        $fecha_pedido,
                        $importe_pagado,

                        $metodo_pago,
                        $titulo,
                        $comentario,
                        $confirmado
                    );
                }

                //ejecuto
                $result_ex_mov = $stmt->execute();
                if (!$result_ex_mov) {
                    throw new Exception($stmt->error);
                }
                $stmt->close();                
            }                  
        }
        //=============================================//
        // end - Gestionar cambios de importe_pagado en movimientos
        //=============================================//
        
  


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
