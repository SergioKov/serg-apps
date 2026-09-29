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
    } 
    

    // limpiar caracteres de control ilegales
    //$jsonString = cleanControlChars($jsonString);
    $jsonString = escapeControlChars($jsonString);
	//echo_json_x($jsonString, 'jsonString');

    // escapar saltos de línea
    $jsonString = escapeNewlines($jsonString);
	//echo_json_x($jsonString, 'jsonString');

    
    


    if (isValidJson($jsonString)) {
        //echo "JSON válido";

        // decodificar
        $datos = json_decode($jsonString, true); // Decodificación a array asociativo
        //echo_json_x($datos, 'datos');

        // Validar estructura y contenido del JSON
        if (isset($datos['id_song']) ) {
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
        //echo "JSON inválido";
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Error al decodificar JSON. jsonErrorMessage: ' . jsonErrorMessage($jsonString),
            'json_last_error_msg' => json_last_error_msg(),
            'dic_code' => 'd302'
        ],JSON_UNESCAPED_UNICODE);
        exit;
    }


    //$datos = json_decode($jsonString, true);
    //debug($datos, 'datos');
	//echo_json($datos, 'datos');
	//echo_json_x($datos, 'datos');



    // // Validar si la decodificación fue exitosa
    // if (json_last_error() === JSON_ERROR_NONE) {
    //     // Validar estructura y contenido del JSON
    //     if (isset($datos['song_text']) ) {
    //         //echo "JSON es válido y contiene las claves esperadas.";
    //         //sigo adelante...
    //     } else {
    //         //echo "JSON no contiene las claves esperadas.";
    //         http_response_code(400);
    //         echo json_encode([
    //             'success' => false,
    //             'error' => 'Error al procesar el JSON. El objeto no contiene las claves esperadas.',
    //             'dic_code' => 'd301'
    //         ]);
    //         exit;
    //     }
    // } else {
    //     //echo "Error al decodificar JSON: " . json_last_error_msg();
    //     //writeLog("Error al decodificar JSON. Error: [" . json_last_error_msg() . "]", 'ERROR');

    //     http_response_code(400);
    //     echo json_encode([
    //         'success' => false,
    //         'error' => 'Error al decodificar JSON.',
    //         'json_last_error_msg' => json_last_error_msg(),
    //         'dic_code' => 'd302'
    //     ]);
    //     exit;
    // }

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

    
    //$id_songslide = $conn->real_escape_string($datos['id_songslide']);//get parameter
    $id_song = $conn->real_escape_string($datos['id_song']);//get parameter

    $pantalla_show = $conn->real_escape_string($datos['pantalla_show']);//get parameter
    $show_logo_en_fondo = $conn->real_escape_string($datos['show_logo_en_fondo']);//get parameter
    $show_imagen_en_fondo = $conn->real_escape_string($datos['show_imagen_en_fondo']);//get parameter
    $show_bible_en_fondo = $conn->real_escape_string($datos['show_bible_en_fondo']);//get parameter
    $show_black_en_fondo = $conn->real_escape_string($datos['show_black_en_fondo']);//get parameter
    $user_view_control = $conn->real_escape_string($datos['user_view_control']);//get parameter
    $show_legend = $conn->real_escape_string($datos['show_legend']);//get parameter
    $show_acordes = $conn->real_escape_string($datos['show_acordes']);//get parameter
    $show_next_slide = $conn->real_escape_string($datos['show_next_slide']);//get parameter
    $show_en_top = $conn->real_escape_string($datos['show_en_top']);//get parameter
    $show_en_parte_top = $conn->real_escape_string($datos['show_en_parte_top']);//get parameter
    $show_en_center = $conn->real_escape_string($datos['show_en_center']);//get parameter

    //debug($arr, 'arr');
    //echo_json_x($arr_esquema_array, 'arr_esquema_array');

    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    $fechaHoraActual = date("Y-m-d H:i:s");
    

    //===================================================================//
    //1. busco id_song en la bd.
    //===================================================================//
    //busco si hay registro en la tabla a donde insertar array
    $sql_prep = "SELECT id_song 
                FROM songs 
                WHERE id_song = ? 
    ";
    $arr_params = [$id_song];
    $sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
	$result = $conn->query($sql_preparada);
    //debug_x($sql_preparada, 'sql_preparada');

    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_song = $row["id_song"];//1
        $hay_id_song_en_tabla = true;
    }else{
        $hay_id_song_en_tabla = false;
    }

    //si no hay cancion con ese id_song en la bd, salgo
    if($hay_id_song_en_tabla === false){
        echo json_encode([
            'success' => false,
            'error' => 'No existe id_song de la cancion. Selecciona cancion que existe.',
            'dic_code' => 'd245---'
        ],JSON_UNESCAPED_UNICODE);
        die();        
    }



    //===================================================================//
    //2. busco id del usuario en la bd.
    //===================================================================//
    $sql_prep_user = "SELECT id_songslide, id_user
                FROM songslides 
                WHERE id_user = ? 
    ";
    $arr_params_user = [$id_user_logged];
    $sql_preparada_user = prepararQuery($conn, $sql_prep_user, $arr_params_user);
	$result_user = $conn->query($sql_preparada_user);

    if($result_user->num_rows > 0){
        $row_user = $result_user->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_user = $row_user["id_user"];//1
        $stored_id_songslide = $row_user["id_songslide"];//1
        $hay_id_user_en_tabla = true;
    }else{
        $hay_id_user_en_tabla = false;
    }


    /* Uso */
    $ip_user_short = get_client_ip_short();
    if ($ip_user_short !== null) {
        $ip_user = htmlspecialchars($ip_user_short, ENT_QUOTES, 'UTF-8');
        //echo "IP del usuario: " . $ip_user;
    } else {
        //echo "No se pudo determinar la IP del cliente.";
        $ip_user = '';
    }

	//echo_json_x($hay_id_song_en_tabla, 'hay_id_song_en_tabla');

    $sign = '__[(&)]__';//IMPORTANTE! para que ho haya errores con $arr en json
    
    // Realizar la inserción o (update) en la base de datos 
    if($hay_id_user_en_tabla){
        //hago update        
        $action_tipo = 'is_update_pantalla_params';
        $sql2_up_init = "UPDATE songslides SET
                ip_user = '$ip_user',
                pantalla_show = '$pantalla_show',
                show_logo_en_fondo = '$show_logo_en_fondo',
                show_imagen_en_fondo = '$show_imagen_en_fondo',
                show_bible_en_fondo = '$show_bible_en_fondo',
                show_black_en_fondo = '$show_black_en_fondo',
                user_view_control = '$user_view_control',
                show_legend = '$show_legend',
                show_acordes = '$show_acordes',
                show_next_slide = '$show_next_slide',
                show_en_top = '$show_en_top',
                show_en_parte_top = '$show_en_parte_top',
                show_en_center = '$show_en_center',
                updated_at = '$fechaHoraActual'
            WHERE id_user = '$id_user_logged'
        ";
        //echo_json_x($sql2_up_init, 'sql2_up_init');
        
        $result2 = $conn->query($sql2_up_init);
        //debug_x($sql2_up_preparada, 'sql2_up_preparada');
        //echo_json_x($sql2_up_preparada, 'sql2_up_preparada');	

    }else{
        
        //hago insert
        $action_tipo = 'is_insert_pantalla_params';
        $sql2_in_init = "INSERT INTO songslides 
                (
                    id_user,
                    ip_user,
                    pantalla_show,
                    show_logo_en_fondo,
                    show_imagen_en_fondo,
                    show_bible_en_fondo,
                    show_black_en_fondo,
                    show_legend,
                    user_view_control,
                    show_acordes,
                    show_next_slide,
                    show_en_top,
                    show_en_parte_top,
                    show_en_center,
                    created_at
                ) 
            VALUES 
                (
                    '$id_user_logged',
                    '$ip_user',
                    '$pantalla_show',
                    '$show_logo_en_fondo',
                    '$show_imagen_en_fondo',
                    '$show_bible_en_fondo',
                    '$show_black_en_fondo',
                    '$show_legend',
                    '$user_view_control',
                    '$show_acordes',
                    '$show_next_slide',
                    '$show_en_top',
                    '$show_en_parte_top',
                    '$show_en_center',
                    '$fechaHoraActual'
                )
        ";
        $result2 = $conn->query($sql2_in_init);
        //debug_x($sql2_in_preparada, 'sql2_in_preparada');
        
    }
	//echo_json_x($result2, 'result2');


    //Update o insert datos en la tabla $tabla
    if($result2 === TRUE) {
        if($hay_id_user_en_tabla){
            $respuesta = [
                'success' => true,
                'id_songslide' => $stored_id_songslide,
                'id_song' => $id_song,
                'action' => 'is_update',
                'action_tipo' => $action_tipo,
                'mensaje' => 'Datos actualizados correctamente.'
            ];
        }else{
            //consulta para saber id_song de la cancion añadida
            $sql_id_songslide = "SELECT id_songslide
                            FROM songslides
                            ORDER BY id_songslide DESC
                            LIMIT 1 
            ";
            $result_id_songslide = $conn->query($sql_id_songslide);

            if($result_id_songslide->num_rows > 0){
                $row_id_songslide = $result_id_songslide->fetch_assoc();
                //echo_json_x($row_id_song,'row_id_song');		
                $id_songslide_bd = $row_id_songslide["id_songslide"];//1    
            }else{
                $id_songslide_bd = null;
            }

            $respuesta = [
                'success' => true,
                'id_songslide' => $id_songslide_bd,
                'id_song' => $id_song,
                'action' => 'is_insert',
                'action_tipo' => $action_tipo,
                'mensaje' => 'Datos insertados correctamente.'
            ];
        }

    }else{

        if($hay_id_user_en_tabla){
            //writeLog("Error al actualizar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'error' => 'params. Error al actualizar datos: ',
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
