<?php
include('functions.php');
include('includes/connect_db.php');

//echo "<p>1. estoy aki";


/*
//HACER PRUEBAS...
echo json_encode([
    'HACIENDO_PRUEBAS' => 'DESCOMENTAR EN PROD', 
    'success' => false, 
    'error' => 'El método de pasar los parametros no es correcto.',
    'dic_code' => 'd256'
],JSON_UNESCAPED_UNICODE);
exit;
*/


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //echo "<p>estoy aki";
    //exit;

    // Obtener datos del cuerpo de la solicitud (en formato JSON)
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // Obtener usuario y contraseña del cuerpo de la solicitud
    $email = isset($input['email']) ? $input['email'] : '';
    $token = isset($input['token']) ? $input['token'] : '';
    $password = isset($input['password']) ? $input['password'] : '';

    if($email == '' || $token == '' || $password == ''){
        writeLog("Al intentar restablecer la contraseña no hay todos los parametros necesarios: (email, token, password)."); 

        echo json_encode([
            'success' => false, 
            'error' => 'No hay todos los parametros necesarios.',
            'dic_code' => 'd251'
        ],JSON_UNESCAPED_UNICODE);
        return; 
    }

    // $email = $conn->real_escape_string(strtolower($email));
    // $token = $conn->real_escape_string($token);

    //saco datos de user de la bd.
    // $sql_prep = "SELECT id_user, username, reset_token, reset_token_expiry 
    //             FROM users 
    //             WHERE email = ? 
    // ";
    // $arr_params = [$email];
    // $sql_preparada = prepararQuery($conn, $sql_prep, $arr_params);
    // $result = $conn->query($sql_preparada);
    // //debug_x($sql_preparada, 'sql_preparada');




    // buscar usuario por email
    $sql = "SELECT id_user, username, reset_token, reset_token_expiry  
            FROM users 
            WHERE email = ? 
            LIMIT 1
    ";
    $stmt = $conn->prepare($sql);

    if(!$stmt) {
        die("Error SQL");
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();



    // comprobar si existe usuario
    if($resultado->num_rows === 1) {

        // Usuario encontrado, reviso si el token es valido
        $row = $resultado->fetch_assoc();

        $now = date('Y-m-d H:i:s');

        if($token !== $row['reset_token'] || $now > $row['reset_token_expiry']){
            writeLog("Enlace de restablecer email no válido o expirado. email: [" . $email . "]"); 

            echo json_encode([
                'success' => false, 
                'mensaje' => 'Enlace no válido o expirado. <br>Intenta recuperar la contraseña de nuevo.',
                'dic_code' => 'd260'
            ],JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Concatenar el salt con la contraseña y aplicar el hash bcrypt
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        //echo"<p>$ hashedPassword; $hashedPassword</p>";
        
        $password = $conn->real_escape_string($password);

        // Actualizar la contraseña y borrar el token
        //aki no hago consulta preparada ya que los datos son de bd y son correctos
        $updateQuery = "UPDATE users SET 
                        password = '$hashedPassword', 
                        password_text = '$password', 
                        reset_token = NULL, 
                        reset_token_expiry = NULL 
                        WHERE email = '$email' AND reset_token = '$token'
        ";
        $result_up = $conn->query($updateQuery);

        if($result_up){
            writeLog("Contraseña restablecida con éxito. email: [" . $email . "] new password: [" . $password . "]");

            echo json_encode([
                'success' => true, 
                'mensaje' => 'La contraseña ha sido restablecida con éxito.',
                'dic_code' => 'd253'
            ],JSON_UNESCAPED_UNICODE);
        }else{
            echo json_encode([
                'success' => false, 
                'mensaje' => 'la Contraseña no se ha restablecido. Error en la consulta.',
                'dic_code' => 'd254'
            ],JSON_UNESCAPED_UNICODE);
        }

    }else{
        echo json_encode([
            'success' => false, 
            'mensaje' => 'No existe usuario con el email introducido.',
            'dic_code' => 'd255'
        ],JSON_UNESCAPED_UNICODE);
    }

}else{
    
    echo json_encode([
        'success' => false, 
        'error' => 'El método de pasar los parametros no es correcto.',
        'dic_code' => 'd256'
    ],JSON_UNESCAPED_UNICODE);
    
}

$conn->close();

?>
