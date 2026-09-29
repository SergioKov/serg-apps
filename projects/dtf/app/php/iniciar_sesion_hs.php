<?php
// Iniciar sesión
session_start();

header('Content-Type: application/json; charset=utf-8');

//include __DIR__ . '/../song/php/includes/connect_db.php';//antes
include('includes/connect_db.php');

//si conexion es ok
// if (!$conn->connect_error){
//     echo json_encode([
//         'success' => true, 
//         'info' => 'conn ok'
//     ],JSON_UNESCAPED_UNICODE);
//     return;
// }


//test
// echo json_encode([
//     'success' => true, 
//     'info' => 'test'
// ],JSON_UNESCAPED_UNICODE);
// return;


    
// Autenticar el usuario
$errores = [];


if($_SERVER['REQUEST_METHOD'] === 'POST'){
    // Obtener datos del cuerpo de la solicitud (en formato JSON)
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
    //debug($inputJSON, 'inputJSON');

    // Obtener usuario y contraseña del cuerpo de la solicitud
    $email = isset($input['email']) ? $input['email'] : '';
    $password = isset($input['password']) ? $input['password'] : '';
} 


if($email == '' && $password == ''){
    echo json_encode([
        'success' => false, 
        'error' => 'Email y contraseña vacios',
        'dic_code' => 'd241'
    ],JSON_UNESCAPED_UNICODE);
    return;
}
if($email == '' || $password == ''){
    echo json_encode([
        'success' => false, 
        'error' => 'Email o contraseña vacios',
        'dic_code' => 'd242'
    ],JSON_UNESCAPED_UNICODE);
    return;
}




if($_SERVER['REQUEST_METHOD'] === 'POST') {
    //solo para debug
    // echo "<pre>";
    // var_dump($_POST);
    // echo "</pre>";

    // limpiar datos
    $email = strtolower(trim($email ?? ''));
    $password = trim($password ?? '');
    // $email = strtolower(trim($_POST['email'] ?? ''));
    // $password = trim($_POST['password'] ?? '');

    if(!$email) {
        $errores[] = "El correo electrónico es obligatorio";        
    } elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)) {        
        $errores[] = "El email no es válido";
    }

    if(!$password) {
        $errores[] = "La contraseña es obligatoria";
    }

    //test
    // echo json_encode([
    //     'success' => true, 
    //     'info' => "$ email [$email] --- $ password [$password] "
    // ],JSON_UNESCAPED_UNICODE);
    // exit;

    //si hay errores, los muestro y no hago nada más
    if(!empty($errores)){
        // Autenticación fallida
        echo json_encode([
            'success' => false,
            'error' => implode('<br>', $errores),//en realidad es 'La contraseña es incorrecta',
            'dic_code' => 'd243.3'
        ],JSON_UNESCAPED_UNICODE);
        exit;
    }

    if(empty($errores)) {

        //test
        // echo json_encode([
        //     'success' => true, 
        //     'info' => 'no hay erores. todo ok.'
        // ],JSON_UNESCAPED_UNICODE);
        // exit;


        //revisar y validar si el email es correcto
        //comprobar si existe usuario con el email
        //si existe, obtener su contraseña y compararla con la introducida


        // buscar usuario por email
        $sql = "SELECT id_user, username, email, password 
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

            $row = $resultado->fetch_assoc();

            $storedId_user = $row["id_user"];//1
            $storedUsername = $row["username"];//Sergio
            $storedEmail = $row["email"];//sergiokovalchuk@gmail.com
            $storedHashedPassword = $row["password"];// password hash de la BD //123456
            //$storedIs_email_verified = $row["is_email_verified"];//1 or 0

            //verifico si tiene email verificado
            // if(!$storedIs_email_verified){
            //     echo json_encode([
            //         'success' => false,
            //         'email_verificado' => false,
            //         'error' => 'El correo electrónico del usuario no está verificado. Revisa tu email y pincha sobre el enlace enviado para verificarlo. Después de hacerlo podrás iniciar sesión.',
            //         'dic_code' => 'd298'
            //     ],JSON_UNESCAPED_UNICODE);
            //     exit;
            // }
        
                        //test
                        //$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                        //exit("password input [$password] --- hashedPassword: [$hashedPassword]");

                        //$password = '123456';
                        //echo password_hash('123456', PASSWORD_DEFAULT);
                        //exit;

                        // $hash = password_hash($password, PASSWORD_DEFAULT);
                        
                        // echo "hash: " . $hash;
                        
                        // echo '<hr>';
                        
                        // var_dump(password_verify($password, $hash));
                        // echo '<hr>';

                        // var_dump($storedHashedPassword);
                        // echo '<hr>';
                        // var_dump(password_verify($password, $storedHashedPassword));                
                        // exit;



            // Verificar si la contraseña es correcta
            if(password_verify($password, $storedHashedPassword)) {
                //echo("Contraseña correcta $ storedHashedPassword: $storedHashedPassword");
                //exit("Contraseña correcta");

                // evitar session fixation
                session_regenerate_id(true);

                // crear sesión
                $_SESSION['login'] = true;
                $_SESSION['id_user'] = $storedId_user;
                $_SESSION['username'] = $storedUsername;
                $_SESSION['email'] = $storedEmail;
    
                // mensaje flash
                $_SESSION['success'] = 'Inicio de sesión correcto';

                //aki no preparo la consulta ya que los datos son seguros porque son sacados de la bd
                $sql_up = "UPDATE users SET 
                            `last_login` = NOW()
                            WHERE id_user = '$storedId_user'
                ";
                $result_up = $conn->query($sql_up);

                // Establecer una cookie de autenticación válida por 1 hora
                //setcookie("authenticated", "true", time() + 3600, "/");//antes
                // cookie opcional
                // setcookie(
                //     "authenticated",
                //     "true",
                //     [
                //         'expires' => time() + 3600,
                //         'path' => '/',
                //         'httponly' => true,
                //         'samesite' => 'Lax'
                //     ]
                // );

                echo json_encode([
                    'success' => true, 
                    'email_verificado' => true, 
                    'username' => $storedUsername,
                                'email' => $storedEmail,//luego quitar
                                'id_user' => $storedId_user //luego quitar
                ],JSON_UNESCAPED_UNICODE);                

                // Redirigir al contenido protegido
                //header("Location: /song");
                //exit;

            } else {
                
                //$errores[] = "La contraseña es incorrecta";
                $errores[] = "Email o contraseña incorrectos";//aunque el mensaje verdadero es "La contraseña es incorrecta", muestro el mensaje genérico para no dar pistas a posibles atacantes
                // echo("Contraseña incorrecta. $ storedHashedPassword: $storedHashedPassword");
                //exit("Contraseña incorrecta.");

                // Autenticación fallida
                echo json_encode([
                    'success' => false,
                    'error' => 'Email o contraseña incorrectos',//en realidad es 'La contraseña es incorrecta',
                    'dic_code' => 'd243.4'
                ],JSON_UNESCAPED_UNICODE);

            }

        } else {
            //$errores[] = "El usuario no existe";
            $errores[] = "Email o contraseña incorrectos";//aunque el mensaje verdadero es "El usuario no existe", muestro el mensaje genérico para no dar pistas a posibles atacantes

            // Autenticación fallida
            echo json_encode([
                'success' => false,
                'error' => 'Email o contraseña incorrectos',//en realidad es 'El usuario no existe',
                'dic_code' => 'd243.5'
            ],JSON_UNESCAPED_UNICODE);

        }

        $stmt->close();

    }  

}

?>