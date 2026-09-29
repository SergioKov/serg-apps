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
    




    if (isValidJson($jsonString)) {
        //echo "JSON válido";

        // decodificar
        $datos = json_decode($jsonString, true); // Decodificación a array asociativo
        //echo_json_x($datos, 'datos');

        // Validar estructura y contenido del JSON
        if (isset($datos['song_text']) ) {
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
    //         ],JSON_UNESCAPED_UNICODE);
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
    //     ],JSON_UNESCAPED_UNICODE);
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
    if(isset($_SESSION['username']) && isset($_SESSION['id_user']) ) {
        $id_user_logged = $_SESSION['id_user'];
        $username_logged = $_SESSION['username'];
        //$id_user_logged = 1;
        //$username_logged = 'demo_user';
        //echo json_encode(['mensaje' => 'sesion username_logged: ' . $username_logged ],JSON_UNESCAPED_UNICODE);        
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


    $id_song = $datos['id_song'];
    $song_number = $datos['song_number'];
    $title = $datos['title'];
    $title2 = $datos['title2'];
    $title_note = $datos['title_note'];
    $category  = $datos['category'];
    $songbook  = $datos['songbook'];
    $song_text  = $datos['song_text'];

    //variables de busqueda
    $title_search = normalizeSearchText($title ?? '');
    
    if($title2){
        $title_search .= ' __|__ ' . normalizeSearchText($title2 ?? '');
    }
    if($title_note){
        $title_search .= ' __|__ ' . normalizeSearchText($title_note ?? '');
    }

    $song_text_search  = normalizeSearchText($song_text);//quito puntuación, acentos, etc para mejorar búsquedas
    

   
    //$arr_esquema = $datos['arr_esquema'];
    $arr_esquema_array = $datos['arr_esquema'];
    //echo_json_x($arr_esquema_array, 'arr_esquema_array');

    $arr_esquema_string = json_encode($datos['arr_esquema'], JSON_UNESCAPED_UNICODE);

    $tune  = $datos['tune'];
    $tune_transpose  = $datos['tune_transpose'];
    $tipo_acorde  = $datos['tipo_acorde'];
    $tipo_fuente  = $datos['tipo_fuente'];
    $url_youtube  = $datos['url_youtube'];
    $url_recurso  = $datos['url_recurso'];
    $tempo_bpm  = $datos['tempo_bpm'];
    $lang  = $datos['lang'];
    $notes  = $datos['notes'];

    //ajustes de song
    $device_resolution = $datos['device_resolution'] ?? null;
    $orientation = $datos['orientation'] ?? null;
    $font_size  = $datos['font_size'] ?? null;
    $num_columns  = $datos['num_columns'] ?? null;
    $acordes_visible  = $datos['acordes_visible'] ?? null;
    $texto_visible  = $datos['texto_visible'] ?? null;
    $contenido_width  = $datos['contenido_width'] ?? null;

    //ajustes personalizados
    $ajustes_pers  = $datos['ajustes_pers'] ?? null;
    //$ajustes_pers = $ajustes_pers !== null ? (int)$ajustes_pers : null;
    //$ajustes_pers = 0;//test

    $tune_transpose_pers  = $datos['tune_transpose_pers'] ?? null;
    $capo_pers  = $datos['capo_pers'] ?? null;
    $tipo_acorde_pers  = $datos['tipo_acorde_pers'] ?? null;
    $tempo_bpm_pers  = $datos['tempo_bpm_pers'] ?? null;
    $notes_pers  = $datos['notes_pers'] ?? null;

    //debug($tabla);
    //debug($campo);
    //debug($arr, 'arr');
    //echo_json_x($arr_esquema, 'arr_esquema');
    //echo_json_x($arr_esquema_array, 'arr_esquema_array');
    //echo_json_x($ajustes_pers, 'ajustes_pers');

    //exit('<br>hasta aki-2');

    // Obtener la fecha y hora actual
    //$fechaHoraActual = date("Y-m-d H:i:s");//es lo mismo que 'NOW()' en sql. lo comento
    

    //busco si hay registro en la tabla a donde insertar array
    // $sql_prep = "SELECT id_song 
    //             FROM songs 
    //             WHERE id_song = ? 
    // ";
    // $arr_params = [$id_song];
    // $sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
	// $result = $conn->query($sql_preparada);
    // //debug_x($sql_preparada, 'sql_preparada');


    $sql_prep = "SELECT id_song 
                FROM songs 
                WHERE id_song = ?
                LIMIT 1 
    ";
    $stmt = $conn->prepare($sql_prep);
    if(!$stmt) {
        die("Error SQL");
    }
    $stmt->bind_param("i", $id_song);
    $stmt->execute();
    $result = $stmt->get_result();

    // //debug
    // echo json_encode([
    //     'success' => false,
    //     'error' => 'test info. $result->num_rows: ' . $result->num_rows . ' --- id_song: ' . $id_song,
    //     'dic_code' => 'd250'
    // ],JSON_UNESCAPED_UNICODE);
    // exit;


    if($result->num_rows === 1){
        $row = $result->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_song = $row["id_song"];//1
        $hay_id_song_en_tabla = true;
    }else{
        $hay_id_song_en_tabla = false;
    }


    //PASO 1. Buscar canción anterior
    $sql_old = "SELECT
                    id_song,
                    title,
                    title2,
                    title_note,
                    song_text,
                    notes
                FROM songs
                WHERE id_song = ?
                LIMIT 1
    ";
    $stmt_old = $conn->prepare($sql_old);
    $stmt_old->bind_param(
        "i",
        $id_song
    );
    $stmt_old->execute();
    $result_old = $stmt_old->get_result();
    $song_old = $result_old->fetch_assoc();


    //PASO 2. Determinar acción: 
    $action = ($song_old)
        ? 'updated'
        : 'created';

    //PASO 3. Guardar valores antiguos
    $title_old = $song_old['title'] ?? null;
    $title2_old = $song_old['title2'] ?? null;
    $title_note_old = $song_old['title_note'] ?? null;
    $song_text_old = $song_old['song_text'] ?? null;
    $notes_old = $song_old['notes'] ?? null;

    //PASO 2.2. Crear snapshot completo
    $song_data = [
        'title' => $title,
        'title2' => $title2,
        'title_note' => $title_note,
        'song_text' => $song_text,
        'notes' => $notes
    ];

    //PASO 2.3. Crear changes_json
    $changes = [];

    if($title_old !== $title){
        $changes['title'] = [
            'old' => $title_old,
            'new' => $title
        ];
    }

    if($title2_old !== $title2){
        $changes['title2'] = [
            'old' => $title2_old,
            'new' => $title2
        ];
    }

    if($title_note_old !== $title_note){
        $changes['title_note'] = [
            'old' => $title_note_old,
            'new' => $title_note
        ];
    }

    if($song_text_old !== $song_text){
        $changes['song_text'] = [
            'old' => $song_text_old,
            'new' => $song_text
        ];
    }

    if($notes_old !== $notes){
        $changes['notes'] = [
            'old' => $notes_old,
            'new' => $notes
        ];
    }

    //PASO 4. Guardar ambos
    $song_data_json = json_encode(
        $song_data,
        JSON_UNESCAPED_UNICODE
    );
    
    $changes_json = json_encode(
        $changes,
        JSON_UNESCAPED_UNICODE
    );


    //song ajustes
    // $sql_prep_aj = "SELECT id_song 
    //             FROM songs_ajustes 
    //             WHERE id_song = ? 
    // ";
    // $arr_params_aj = [$id_song];
    // $sql_preparada_aj = prepararQuery($conn, $sql_prep_aj, $arr_params_aj);
	// $result_aj = $conn->query($sql_preparada_aj);
    // //debug_x($sql_preparada, 'sql_preparada');



    //song ajustes
    $sql_prep_aj = "SELECT id_song 
                FROM songs_ajustes 
                WHERE id_song = ? 
    ";
    $stmt_aj = $conn->prepare($sql_prep_aj);
    if(!$stmt_aj) {
        die("Error SQL");
    }
    $stmt_aj->bind_param("s", $id_song);
    $stmt_aj->execute();
    $result_aj = $stmt_aj->get_result();


    if($result_aj->num_rows > 0){
        $row_aj = $result_aj->fetch_assoc();
		//echo_json_x($row,'row');		
        $stored_id_song_aj = $row_aj["id_song"];//1
        $hay_id_song_en_ajustes = true;
    }else{
        $hay_id_song_en_ajustes = false;
    }
	//echo_json_x($hay_id_song_en_tabla, 'hay_id_song_en_tabla');



    //===============================================================//
    // start - UPSERT
    //===============================================================//
    if (is_array($arr_esquema_array) && !empty($arr_esquema_array)) {// Es un array y tiene elementos
        $action_tipo = $hay_id_song_en_tabla 
            ? 'is_update_arr_esquema_ok' 
            : 'is_insert_arr_esquema_ok';
        $arr_esquema_final = $arr_esquema_string;        
    }else{
        $action_tipo = $hay_id_song_en_tabla 
            ? 'is_update_arr_esquema_vacio' 
            : 'is_insert_arr_esquema_vacio';
        $arr_esquema_final = '';
    }

    $id_song_upsert =
        $hay_id_song_en_tabla
        ? $id_song
        : null;

    //consulta UPSERT
    $sql2_upsert = "INSERT INTO songs
                    (
                        id_song,
                    
                        song_number,
                        title,
                        title2,
                        title_note,
                        title_search,
                    
                        category,
                        songbook,
                    
                        song_text,
                        song_text_search,
                    
                        arr_esquema,
                    
                        tune,
                        tune_transpose,
                    
                        tipo_acorde,
                        tipo_fuente,
                    
                        url_youtube,
                        url_recurso,
                    
                        tempo_bpm,
                        lang,
                    
                        notes,
                    
                        created_at,
                        updated_at
                    )        
                    VALUES
                    (
                        ?,
                    
                        ?, ?, ?, ?, ?,
                    
                        ?, ?,
                    
                        ?, ?,
                    
                        ?,
                    
                        ?, ?,
                    
                        ?, ?,
                    
                        ?, ?,
                    
                        ?, ?,
                    
                        ?,
                    
                        NOW(),
                        NOW()
                    )
                    
                    ON DUPLICATE KEY UPDATE
                    
                        song_number = VALUES(song_number),
                    
                        title = VALUES(title),
                        title2 = VALUES(title2),
                        title_note = VALUES(title_note),
                        title_search = VALUES(title_search),
                    
                        category = VALUES(category),
                        songbook = VALUES(songbook),
                    
                        song_text = VALUES(song_text),
                        song_text_search = VALUES(song_text_search),
                    
                        arr_esquema = VALUES(arr_esquema),
                    
                        tune = VALUES(tune),
                        tune_transpose = VALUES(tune_transpose),
                    
                        tipo_acorde = VALUES(tipo_acorde),
                        tipo_fuente = VALUES(tipo_fuente),
                    
                        url_youtube = VALUES(url_youtube),
                        url_recurso = VALUES(url_recurso),
                    
                        tempo_bpm = VALUES(tempo_bpm),
                        lang = VALUES(lang),
                    
                        notes = VALUES(notes),
                    
                        updated_at = NOW()
    ";
    $stmt = $conn->prepare($sql2_upsert);
    
    //IMPORTANTE! Normalizar Windows/Mac/Linux (debe estar con bind_param())
    $song_text = str_replace(["\r\n", "\r"], "\n", $song_text);
    $notes = str_replace(["\r\n", "\r"], "\n", $notes);

    $stmt->bind_param(
        "iissssssssssssssssss",
    
        $id_song_upsert,
    
        $song_number,
        $title,
        $title2,
        $title_note,
        $title_search,
    
        $category,
        $songbook,
    
        $song_text,
        $song_text_search,
    
        $arr_esquema_final,
    
        $tune,
        $tune_transpose,
    
        $tipo_acorde,
        $tipo_fuente,
    
        $url_youtube,
        $url_recurso,
    
        $tempo_bpm,
        $lang,
    
        $notes
    );
    $result2 = $stmt->execute();
    //===============================================================//
    // end - UPSERT
    //===============================================================//






    //===============================================================//
    // start - UPDATE/INSERT si falla UPSERT
    //===============================================================//
    // if (is_array($arr_esquema_array) && !empty($arr_esquema_array)) {// Es un array y tiene elementos
    //     $action_tipo = $hay_id_song_en_tabla 
    //         ? 'is_update_arr_esquema_ok' 
    //         : 'is_insert_arr_esquema_ok';
    //     $arr_esquema_final = $arr_esquema_string;        
    // }else{
    //     $action_tipo = $hay_id_song_en_tabla 
    //         ? 'is_update_arr_esquema_vacio' 
    //         : 'is_insert_arr_esquema_vacio';
    //     $arr_esquema_final = '';
    // }

    // $id_song_upsert =
    //     $hay_id_song_en_tabla
    //     ? $id_song
    //     : null;

    // //IMPORTANTE! Normalizar Windows/Mac/Linux (debe estar con bind_param())
    // $song_text = str_replace(["\r\n", "\r"], "\n", $song_text);
    // $notes = str_replace(["\r\n", "\r"], "\n", $notes);

    // //debug
    // // echo json_encode([
    // //     'success' => false,
    // //     'error' => 'test info. id_song_upsert: ' . $id_song_upsert . ' --- action_tipo: ' . $action_tipo,
    // //     'dic_code' => 'd250'
    // // ],JSON_UNESCAPED_UNICODE);
    // // exit;


    // //==================================================
    // // start - UPDATE
    // //==================================================
    // if($id_song_upsert !== null){// existe id_song, hago update

    //     $sql_update = "UPDATE songs
    //                     SET
    //                         song_number = ?,

    //                         title = ?,
    //                         title2 = ?,
    //                         title_note = ?,
    //                         title_search = ?,

    //                         category = ?,
    //                         songbook = ?,

    //                         song_text = ?,
    //                         song_text_search = ?,

    //                         arr_esquema = ?,

    //                         tune = ?,
    //                         tune_transpose = ?,

    //                         tipo_acorde = ?,
    //                         tipo_fuente = ?,

    //                         url_youtube = ?,
    //                         url_recurso = ?,

    //                         tempo_bpm = ?,
    //                         lang = ?,

    //                         notes = ?,

    //                         updated_at = NOW()

    //                     WHERE id_song = ?
    //     ";
    //     $stmt = $conn->prepare($sql_update);
    //     $stmt->bind_param(
    //         "issssiissssssssssssi",

    //         $song_number,

    //         $title,
    //         $title2,
    //         $title_note,
    //         $title_search,

    //         $category,
    //         $songbook,

    //         $song_text,
    //         $song_text_search,

    //         $arr_esquema_final,

    //         $tune,
    //         $tune_transpose,

    //         $tipo_acorde,
    //         $tipo_fuente,

    //         $url_youtube,
    //         $url_recurso,

    //         $tempo_bpm,
    //         $lang,

    //         $notes,

    //         $id_song_upsert
    //     );

    //     $result2 = $stmt->execute();

    // }
    // //==================================================
    // // end - UPDATE
    // //==================================================


    // //==================================================
    // // start - INSERT
    // //==================================================
    // if($id_song_upsert == null){// no existe id_song, hago insert
    //     $sql_insert = "INSERT INTO songs
    //                     (
    //                         song_number,

    //                         title,
    //                         title2,
    //                         title_note,
    //                         title_search,

    //                         category,
    //                         songbook,

    //                         song_text,
    //                         song_text_search,

    //                         arr_esquema,

    //                         tune,
    //                         tune_transpose,

    //                         tipo_acorde,
    //                         tipo_fuente,

    //                         url_youtube,
    //                         url_recurso,

    //                         tempo_bpm,
    //                         lang,

    //                         notes,

    //                         created_at,
    //                         updated_at
    //                     )
    //                     VALUES
    //                     (

    //                         ?,

    //                         ?, ?, ?, ?,

    //                         ?, ?,

    //                         ?, ?,

    //                         ?,

    //                         ?, ?,

    //                         ?, ?,

    //                         ?, ?,

    //                         ?, ?,

    //                         ?,

    //                         NOW(),
    //                         NOW()
    //                     )
    //     ";
    //     $stmt = $conn->prepare($sql_insert);
    //     $stmt->bind_param(
    //         "issssiissssssssssss",

    //         $song_number,

    //         $title,
    //         $title2,
    //         $title_note,
    //         $title_search,

    //         $category,
    //         $songbook,

    //         $song_text,
    //         $song_text_search,

    //         $arr_esquema_final,

    //         $tune,
    //         $tune_transpose,

    //         $tipo_acorde,
    //         $tipo_fuente,

    //         $url_youtube,
    //         $url_recurso,

    //         $tempo_bpm,
    //         $lang,

    //         $notes
    //     );
    //     $result2 = $stmt->execute();

    // }
    // //==================================================
    // // end - INSERT
    // //==================================================
    
    //===============================================================//
    // end - UPDATE/INSERT si falla UPSERT
    //===============================================================//




    //Update o insert datos en la tabla 'songs'
    if($result2){//todo ok
        
        if($hay_id_song_en_tabla){//si es update, id_song ya lo tengo
            $id_song_ajustes = $id_song;
            $id_song_users_ajustes = $id_song;
            $consulta_info = 'upsert songs_ajustes -> id_song ya existe en tabla songs, por lo tanto se hace update o insert en ajustes con id_song';
        }else{//es insert
            $id_song_ajustes = $conn->insert_id;//es id insertado de la cancion nueva de esta $conn
            $id_song_users_ajustes = $conn->insert_id;//es id insertado de la cancion nueva de esta $conn
            $consulta_info = 'upsert songs_ajustes -> id_song no existe en tabla songs, por lo tanto se hace insert en ajustes con id_song_ajustes:' . $id_song_ajustes . ' que es id_song_bd de la nueva canción insertada';            
        }

        $mensaje_text = '';
        $mas_ajustes_text = '';
        $mas_users_ajustes_text = '';
        $mas_ajustes_error = '';
        $mas_users_ajustes_error = '';

        //si viene desde js guardarEsquema() => no hago nada
        //si viene desde js guardarSong() => sí hago upsert en ajustes (porque hay device_resolution, etc...)

        if($device_resolution !== null){//viene desde js guardarSong() 
            
            //consulta UPSERT
            $sql2_upsert_ajustes = "INSERT INTO songs_ajustes
                                    (
                                        id_user,
                                        id_song,
                                        device_resolution,
                                        orientation,
    
                                        font_size,
                                        num_columns,
                                        acordes_visible,
                                        texto_visible,
                                        contenido_width,
    
                                        created_at,
                                        updated_at
                                    )
                                    VALUES
                                    (
                                        '$id_user_logged',
                                        '$id_song_ajustes',
                                        '$device_resolution',
                                        '$orientation',
    
                                        '$font_size',
                                        '$num_columns',
                                        '$acordes_visible',
                                        '$texto_visible',
                                        '$contenido_width',
    
                                        NOW(),
                                        NOW()
                                    )
                                    ON DUPLICATE KEY UPDATE
                                        font_size = VALUES(font_size),
                                        num_columns = VALUES(num_columns),
                                        acordes_visible = VALUES(acordes_visible),
                                        texto_visible = VALUES(texto_visible),
                                        contenido_width = VALUES(contenido_width),
                                        updated_at = NOW()
            ";
            $result2_ajustes = $conn->query($sql2_upsert_ajustes);
    
    
    
            if($result2_ajustes){
                
                if($hay_id_song_en_tabla){
                    $mensaje_text = 'Datos actualizados correctamente.';
                }else{
                    $mensaje_text = 'Datos insertados correctamente.';
                }
                $mas_ajustes_text = ' 1.(Ajustes ok)';
                $mas_ajustes_error = ' 1.(no hay error en ajustes)';
    
            }else{
    
                if($hay_id_song_en_tabla){
                    $mensaje_text = 'Error al actualizar datos en ajustes.';
                }else{
                    $mensaje_text = 'Error al insertar datos en ajustes.';
                }    
                $mas_ajustes_text = ' 1.(Ajustes error)';
                $mas_ajustes_error = ' 1.(Error en ajustes: ' . $conn->error . ')';
            }
        
        }


        
        //PASO 5. Guardar versión (si hay cambios)
        if(!empty($changes)){
            // guardar versión
            $sql_version = "INSERT INTO songs_versions
                            (
                                id_song,
                                id_user,
                        
                                action,

                                changes_json, 
                                song_data,
                        
                                created_at
                            )
                            VALUES
                            (
                                ?,
                                ?,
                        
                                ?,
                        
                                ?,
                                ?,
                        
                                NOW()
                            )
            ";
            $stmt_version = $conn->prepare($sql_version);
            $stmt_version->bind_param(
                "iisss",

                $id_song,
                $id_user_logged,

                $action,

                $changes_json,
                $song_data_json
            );
            $result_version = $stmt_version->execute();
            
            if($result_version){
                //echo 'Versión guardada';
                $consulta_info .= ' 2.(Versión guardada)';
            }else{
                $consulta_info .= ' 2.(Versión NO guardada)';
                //echo 'Error';
            }

        }





        //PASO 6. Guardar ajustes personalizados del usuario (si están habilitados)
        if($ajustes_pers !== null){//viene desde js guardarSong() 
            
            //consulta UPSERT
            $sql3_upsert_users_ajustes = "INSERT INTO users_ajustes
                                    (
                                        id_user,
                                        id_song,

                                        ajustes_pers,
                                        tune_transpose_pers,
                                        capo_pers,
                                        tipo_acorde_pers,
                                        tempo_bpm_pers,
                                        notes_pers,
    
                                        created_at,
                                        updated_at
                                    )
                                    VALUES
                                    (
                                        '$id_user_logged',
                                        '$id_song_users_ajustes',

                                        '$ajustes_pers',
                                        '$tune_transpose_pers',
                                        '$capo_pers',
                                        '$tipo_acorde_pers',
                                        '$tempo_bpm_pers',
                                        '$notes_pers',
    
                                        NOW(),
                                        NOW()
                                    )
                                    ON DUPLICATE KEY UPDATE
                                        ajustes_pers = VALUES(ajustes_pers),
                                        tune_transpose_pers = VALUES(tune_transpose_pers),
                                        capo_pers = VALUES(capo_pers),
                                        tipo_acorde_pers = VALUES(tipo_acorde_pers),
                                        tempo_bpm_pers = VALUES(tempo_bpm_pers),
                                        notes_pers = VALUES(notes_pers),
                                        updated_at = NOW()
            ";
            $result3_users_ajustes = $conn->query($sql3_upsert_users_ajustes);
    
    
    
            if($result3_users_ajustes){
                
                if($hay_id_song_en_tabla){
                    $mensaje_text = 'Datos actualizados correctamente.';
                }else{
                    $mensaje_text = 'Datos insertados correctamente.';
                }
                $mas_users_ajustes_text = ' 3.(Ajustes personalizados ok)';
                $mas_users_ajustes_error = ' 3.(no hay error en ajustes personalizados)';
    
            }else{
    
                if($hay_id_song_en_tabla){
                    $mensaje_text = 'Error al actualizar datos en ajustes personalizados.';
                }else{
                    $mensaje_text = 'Error al insertar datos en ajustes personalizados.';
                }    
                $mas_users_ajustes_text = ' 3.(Ajustes personalizados error)';
                $mas_users_ajustes_error = ' 3.(Error en ajustes personalizados: ' . $conn->error . ')';
            }
        
        }else{
            $mas_users_ajustes_text = ' 993.(entra en else - ajustes_pers es [' . $ajustes_pers .  '] - Ajustes personalizados error)';
        }


        $respuesta = [
            'success' => true,
            'id_song' => $id_song_ajustes,
            'action' => 'is_upsert',
            'action_tipo' => $action_tipo,
            'mensaje' => $mensaje_text . $mas_ajustes_text . $mas_users_ajustes_text,
            'conn_error_ajustes' => $mas_ajustes_error . $mas_users_ajustes_error,
            'consulta_info' => $consulta_info
        ];

    }else{//error en insert/update en la tabla songs

        $info_text = ' 3.(Solo en songs hubo error, no se ejecutó consulta en ajustes)';

        if($hay_id_song_en_tabla){
            //writeLog("Error al actualizar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'error' => 'Error al actualizar datos: ',
                'conn_error' => $conn->error,
                'info' => $info_text
            ];
        }else{
            //writeLog("Error al insertar datos. Error: [" . $conn->error . "]");

            $respuesta = [
                'success' => false,
                'mensaje' => 'Error al insertar datos: ',
                'conn_error' => $conn->error,
                'info' => $info_text
            ];
        }

    }

    //Cierro conexion con bd
    $conn->close();	

    // Enviar respuesta al cliente en formato JSON
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(
        $respuesta,
        JSON_UNESCAPED_UNICODE
    );
	
}

?>
