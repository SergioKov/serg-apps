<?php
include('includes/config.php');
session_start();//importante para ver al usuario logueado
include('functions.php');





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

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        $jsonString = $_GET['datos'];//saco datos del url.
        //debug($jsonString, 'jsonString');
        //echo_json_x($jsonString, 'jsonString');
    } 
    
    
    // Recuperar datos JSON
    $datos = json_decode($jsonString, true);
    //debug($datos, 'datos');
	//echo_json($datos, 'datos');
	//echo_json_x($datos, 'datos');


    // Validar si la decodificación fue exitosa
    if (json_last_error() === JSON_ERROR_NONE) {
        // Validar estructura y contenido del JSON
        if (isset($datos['title']) ) {
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

    include('includes/connect_db.php');

    
    $id_lista = $conn->real_escape_string($datos['id_lista']);//get parameter
    $title = $conn->real_escape_string($datos['title']);//get parameter
    $id_grupo = $conn->real_escape_string($datos['id_grupo']);//get parameter
    $fecha  = $conn->real_escape_string($datos['fecha']);//get parameter
    $arr_lista_ids_string = $conn->real_escape_string($datos['arr_lista_ids']);
    $arr_lista_ids_array = json_decode($datos['arr_lista_ids'], true);//'true' obligatorio ya que 'JSON_UNESCAPED_UNICODE' se usa con json_encode
    $notes  = $conn->real_escape_string($datos['notes']);//get parameter   
    
    //variables de busqueda
    $title_search = normalizeSearchText($title ?? '');
    
    if($notes){
        $title_search .= ' __|__ ' . normalizeSearchText($notes ?? '');
    }


    //debug($title);
    //debug($arr, 'arr');
    //echo_json_x($arr_lista, 'arr_lista');

    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //busco si hay registro en la tabla a donde insertar array
    $sql_prep = "SELECT id_lista 
                FROM listas 
                WHERE id_lista = ? 
    ";
    $arr_params = [$id_lista];
    $sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
	$result = $conn->query($sql_preparada);
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_lista = $row["id_lista"];//1
        $hay_id_lista_en_tabla = true;
    }else{
        $hay_id_lista_en_tabla = false;
    }

	//echo_json_x($hay_id_lista_en_tabla, 'hay_id_lista_en_tabla');

    $sign = '__[(&)]__';//IMPORTANTE! para que ho haya errores con $arr en json
    
    // Realizar la inserción o (update) en la base de datos 
    if($hay_id_lista_en_tabla){
        //hago update
        //echo_json_x($arr_lista_ids_array, 'en hay_id_lista_en_tabla --- arr_lista_ids_array');
        if (is_array($arr_lista_ids_array) && !empty($arr_lista_ids_array) ) {// Es un array y tiene elementos
            $action_tipo = 'is_update_arr_lista_ok';
            $sql2_up_init = "UPDATE listas SET
                    title = '$title',
                    title_search = '$title_search',
                    id_grupo = '$id_grupo',
                    arr_lista_ids = '$arr_lista_ids_string',
                    notes = '$notes',
                    fecha = '$fecha',
                    updated_at = '$fechaHoraActual'
                WHERE id_lista = '$id_lista'
            ";
        }else{//no es array o está vacío. no incluyo arr_lista en la SQL
            $action_tipo = 'is_update_arr_lista_vacio';
            $sql2_up_init = "UPDATE listas SET
                    title = '$title',
                    title_search = '$title_search',
                    id_grupo = '$id_grupo',
                    arr_lista_ids = '',
                    notes = '$notes',
                    fecha = '$fecha',
                    updated_at = '$fechaHoraActual'
                WHERE id_lista = '$id_lista'
            ";
        }
        //$sql2_up_prep = "UPDATE $tabla SET 
        //            $campo = $sign,
        //            updated_at = '$fechaHoraActual' 
        //            WHERE id_user = $sign 
        //";
        ////$arr paso tal cual ya que los datos pueden tener dentro '?' y romper sql
        //$arr_params = [$arr, $id_user_logged];
        //$sql2_up_preparada = prepararQuery($conn, $sql2_up_prep, $arr_params, $sign);
        $result2 = $conn->query($sql2_up_init);
        //debug_x($sql2_up_preparada, 'sql2_up_preparada');
        //echo_json_x($sql2_up_preparada, 'sql2_up_preparada');	
    }else{        
        //hago insert
        if (is_array($arr_lista_ids_array) && !empty($arr_lista_ids_array) ) {// Es un array y tiene elementos
            $action_tipo = 'is_insert_arr_lista_ok';
            $sql2_in_init = "INSERT INTO listas 
                    (
                        title,
                        title_search,
                        id_grupo,
                        arr_lista_ids,
                        fecha,
                        notes,
                        created_at
                    ) 
                VALUES 
                    (
                        '$title',
                        '$title_search',
                        '$id_grupo',
                        '$arr_lista_ids_string',
                        '$fecha',
                        '$notes',
                        '$fechaHoraActual'
                    )
            ";
        }else{//no es array o está vacío. no incluyo arr_lista en la SQL
            $action_tipo = 'is_insert_arr_lista_vacio';
            $sql2_in_init = "INSERT INTO listas 
                    (
                        title,
                        title_search,
                        id_grupo,
                        fecha,
                        notes,
                        created_at
                    ) 
                VALUES 
                    (
                        '$title',
                        '$title_search',
                        '$id_grupo',
                        '$fecha',
                        '$notes',
                        '$fechaHoraActual'
                    )
            ";
        }
        // $sql2_in_prep = "INSERT INTO $tabla (id_user, $campo, created_at) 
        //                 VALUES ($sign,              $sign, '$fechaHoraActual')
        // ";
        //$arr paso tal cual ya que los datos pueden tener dentro '?' y romper sql
        //$arr_params = [$id_user_logged, $arr];
        //$sql2_in_preparada = prepararQuery($conn, $sql2_in_prep, $arr_params, $sign);
        //$result2 = $conn->query($sql2_in_preparada);
        $result2 = $conn->query($sql2_in_init);
        //debug_x($sql2_in_preparada, 'sql2_in_preparada');
        
    }
	//echo_json_x($result2, 'result2');


    //Update o insert datos en la tabla $tabla
    if($result2 === TRUE) {
        if($hay_id_lista_en_tabla){
            $respuesta = [
                'success' => true,
                'id_lista' => $id_lista,
                'action' => 'is_update',
                'action_tipo' => $action_tipo,
                'mensaje' => 'Datos actualizados correctamente.'
            ];
        }else{
            //consulta para saber id_lista de la lista añadida
            $sql_id_lista = "SELECT id_lista 
                            FROM listas
                            ORDER BY id_lista DESC
                            LIMIT 1 
            ";
            $result_id_lista = $conn->query($sql_id_lista);

            if($result_id_lista->num_rows > 0){
                $row_id_lista = $result_id_lista->fetch_assoc();
                //echo_json_x($row_id_lista,'row_id_lista');		
                $id_lista_bd = $row_id_lista["id_lista"];//1    
            }else{
                $id_lista_bd = null;
            }

            $respuesta = [
                'success' => true,
                'id_lista' => $id_lista_bd,
                'action' => 'is_insert',
                'action_tipo' => $action_tipo,
                'mensaje' => 'Datos insertados correctamente.'
            ];
        }

    }else{

        if($hay_id_lista_en_tabla){
            //writeLog("Error al actualizar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'error' => 'Error al actualizar datos: ',
                'conn_error' => $conn->error
            ];
        }else{
            //writeLog("Error al insertar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'mensaje' => 'Error al insertar datos: ',
                'conn_error' => $conn->error
            ];
        }
    }

    //Cierro conexion con bd
    $conn->close();	

    // Enviar respuesta al cliente en formato JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($respuesta,JSON_UNESCAPED_UNICODE);	
}

?>
