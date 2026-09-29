<?php
// Iniciar sesión
session_start();

error_reporting(E_ALL);

// if($entorno == 'localhost'){
//     //En localhost mostrar errores.
//     ini_set('display_errors', 1);//0 => no mostrar errores en pantalla, 1 => mostrar errores en pantalla. 
// }

// if($entorno == 'production'){
//     //En producción siempre 0.
//     ini_set('display_errors', 1);//0 => no mostrar errores en pantalla, 1 => mostrar errores en pantalla. 
// }

ini_set('display_errors', 1);//0 => no mostrar errores en pantalla, 1 => mostrar errores en pantalla. 
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/mail_error.log');

include('functions.php');
include('includes/connect_db.php');
include('includes/base_url.php');
include('includes/config.php');


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/includes/PHPMailer/src/Exception.php';
require __DIR__ . '/includes/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/includes/PHPMailer/src/SMTP.php';




/*
//HACER PRUEBAS...
echo json_encode([
    'HACIENDO_PRUEBAS' => 'DESCOMENTAR EN PROD',
    'success' => false, 
    // 'mensaje' => 'Error al registrar el usuario: ' . mysqli_error($conn), 
    'mensaje' => 'Error al registrar el usuario: ',
    'conn_error' => 'aki $conn->error', 
    'dic_code' => 'd238'
],JSON_UNESCAPED_UNICODE);
exit;
*/


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



//si los datos SÍ VIENEN desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obtener datos del cuerpo de la solicitud (en formato JSON)
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        //debug($inputJSON, 'inputJSON');

        // Verificar si se recibió correctamente el JSON
        if ($input === null) {
            //echo "Error al procesar el JSON.";
            echo json_encode([
                'success' => false, 
                'error' => 'Error al procesar el JSON.',
                'dic_code' => 'd235'
            ],JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Obtener usuario y contraseña del cuerpo de la solicitud
        $username = (isset($input['username'])) ? $input['username'] : '' ;
        $email = (isset($input['email'])) ? strtolower($input['email']) : '' ;
        $password = (isset($input['password'])) ? $input['password'] : '' ;
        $lang = (isset($input['lang'])) ? $input['lang'] : '' ;
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $username = (isset($_GET['username'])) ? $_GET['username'] : '' ;
        $email = (isset($_GET['email'])) ? strtolower($_GET['email']) : '' ;
        $password = (isset($_GET['password'])) ? $_GET['password'] : '' ;
        $lang = (isset($_GET['lang'])) ? $_GET['lang'] : '' ;
        //debug($email, 'email');
        //debug($password, 'password');
    }

}


//echo json_encode(['info' => 'aki 1']);
//die();


//Consulta con prepararQuery($conn, $query, $arr_params)
//saco datos de user de la bd.
// $checkQuery_init = "SELECT  `username`, `email` 
//                     FROM users 
//                     WHERE email = '$email'
// ";
// $checkQuery_prep = "SELECT username, email 
//                     FROM users 
//                     WHERE email = ?
// ";
// $arr_params = [$email];
// $checkQuery_preparada = prepararQuery($conn, $checkQuery_prep, $arr_params);
// $result = $conn->query($checkQuery_preparada);
// $result_num_rows = $result->num_rows;
//debug_x($checkQuery_init);
//debug_x($checkQuery_preparada);


//new
// buscar usuario por email
$sql = "SELECT username, email 
                    FROM users 
                    WHERE email = ?
";
$stmt = $conn->prepare($sql);

if(!$stmt) {
    die("Error SQL");
}

$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();



//echo_json_x('aki 2');

if($resultado->num_rows > 0) {
    //echo "El nombre de usuario o correo electrónico ya está en uso.";
    echo json_encode([
        'success' => false, 
        'error' => 'El correo electrónico ya está en uso.',
        'dic_code' => 'd236'
    ],JSON_UNESCAPED_UNICODE);
} else {
    // Insertar el nuevo usuario si no existe

    // Concatenar el salt con la contraseña y aplicar el hash bcrypt
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    //echo"<p>$ hashedPassword; $hashedPassword</p>";

    // Obtener la fecha y hora actual
    $created_at = date("Y-m-d H:i:s");

    // //inserto en la bd los datos
    // $insertQuery_init = "INSERT INTO users 
    //                     (
    //                         username, 
    //                         password_text, 
    //                         password, 
    //                         email, 
    //                         created_at
    //                     )
    //                     VALUES 
    //                     (
    //                         '$username', 
    //                         '$password', 
    //                         '$hashedPassword', 
    //                         '$email', 
    //                         '$created_at'
    //                     )
    // ";
    // $insertQuery_prep = "INSERT INTO users 
    //                     (
    //                         username, 
    //                         password_text, 
    //                         password, 
    //                         email, 
    //                         created_at
    //                     )
    //                     VALUES 
    //                     (
    //                         ?, 
    //                         ?, 
    //                         ?, 
    //                         ?, 
    //                         NOW()
    //                     )
    // ";
    // $arr_params = [$username, $password, $hashedPassword, $email, $created_at];
    // $insertQuery_preparada = prepararQuery($conn, $insertQuery_prep, $arr_params);
    // $result_in = $conn->query($insertQuery_preparada);
    //debug_x($insertQuery_init);
    //debug_x($insertQuery_preparada);    


    $insertQuery_prep = "INSERT INTO users 
                        (
                            username, 
                            password_text, 
                            password, 
                            email, 
                            created_at
                        )
                        VALUES 
                        (
                            ?, 
                            ?, 
                            ?, 
                            ?, 
                            NOW()
                        )
    ";
    $stmt_in = $conn->prepare($insertQuery_prep);

    if(!$stmt_in) {
        die("Error SQL");
    }

    $stmt_in->bind_param("ssss", $username, $password, $hashedPassword, $email);
    $result_in = $stmt_in->execute();//en 'insert' no hace falta '$result_in = $stmt_in->get_result();//solo en SELECT'

    //echo json_encode(['info' => 'aki 3']);
    //die();

    if($result_in){
        //Cuando se ha creado el usuario, mando un email para que él confirme su correo y así finalice el proceso de creación de su cuenta    
        
        //$username;//ya lo tengo mas arriba
        // Generar un token único y establecer la fecha de expiración
        $emailToken = bin2hex(random_bytes(32));
        $emailTokenExpiry = date('Y-m-d H:i:s', strtotime('+24 hour'));
        
        //Consulta segura preparada
        // Almacenar el token y la fecha de expiración en la base de datos
        // $updateQuery = "UPDATE users SET 
        //                 email_token = ? , 
        //                 email_token_expiry = ?  
        //                 WHERE email = ? 
        // ";
        // $arr_params = [$emailToken, $emailTokenExpiry, $email];
        // $updateQuery_preparada = prepararQuery($conn, $updateQuery, $arr_params);
        // $result_up = $conn->query($updateQuery_preparada);
        

        //new
        $updateQuery = "UPDATE users SET 
                        email_token = ? , 
                        email_token_expiry = ?  
                        WHERE email = ? 
        ";
        $stmt_up = $conn->prepare($updateQuery);

        if(!$stmt_up) {
            die("Error SQL");
        }

        $stmt_up->bind_param("sss", $emailToken, $emailTokenExpiry, $email);
        $result_up = $stmt_up->execute();//en 'update' no hace falta '$result_in = $stmt_in->get_result();//solo en SELECT'


        $filename_lang = '../json/idiomas/' . $lang . '.json';
        if(file_exists($filename_lang)) {
            // Leer el contenido del archivo
            $obj_lang_content = file_get_contents($filename_lang);

            // Convertir el contenido JSON en un array asociativo de PHP
            $obj_lang = json_decode($obj_lang_content, true);

            //echo json_encode ([
            //    'filename_lang' => $filename_lang,
            //    'test' => "$ obj_lang['d287']: " . $obj_lang['d287'] 
            //]);
            //exit;
        }else{
            //echo json_encode ([
            //    'filename_lang' => 'no existe'
            //]);
            //exit;    
        }


        // Enviar un correo electrónico al usuario con el enlace de restablecimiento
        $subject = $obj_lang['d296'];//"Confirmar el correo electrónico";
        $verifyLink = $baseUrl . "verify_email.php?email=$email&token=$emailToken&lang=$lang";
        //$message = "Para finalizar el proceso de creación de tu cuenta haz clic en el siguiente enlace para confirmar tu correo elecctrónico: $verifyLink";

        $frase_hola = $obj_lang['d287'];//'Hola';
        $frase2 = $obj_lang['d288'];//'Hemos recibido una solicitud para crear la cuenta. Pulsa "Confirmar email" para confirmar tu correo electrónico. Si no has sido tú quien lo ha solicitado, puedes ignorar este mensaje.';
        $frase3 = $obj_lang['d289'];//'Por seguridad, nunca compartas este enlace con otras personas. Desde Bibleqt en ningún caso te pediremos que lo hagas.';
        $frase_link = $obj_lang['d290'];//'Confirmar email';
        $frase_gracias = $obj_lang['d291'];//'Gracias, <br>El equipo de Bibleqt';

        $username_safe = htmlspecialchars($username, ENT_QUOTES, 'UTF-8');//para mostrar el nombre de usuario en el email sin riesgo de inyección de código. aunque el username no debería contener caracteres peligrosos, es una buena práctica sanitizarlo antes de incluirlo en el HTML del email.

        $message_html = '
            <div marginheight="0" marginwidth="0" style="width:100%!important;margin:0;padding:0;background: white;">    
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin: 0 auto; max-width: 480px;">
                    <tbody>
                    <tr>
                        <td align="left" style="font-size:0px;padding:32px 44px;word-break:break-word">
                            <div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;text-align:left;color:#253238">
                                ' . $frase_hola . ', <b>' . $username_safe . '</b>.
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="font-size:0px;padding:0px 40px;padding-bottom:10px;word-break:break-word">
                            <div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;text-align:left;color:#253238">
                            ' . $frase2 . '
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="font-size:0px;padding:0px 40px;padding-bottom:10px;word-break:break-word">
                            <div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;text-align:left;color:#253238">
                                <b>' . $frase3 . '</b>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="font-size:0px;padding:32px 44px;padding-bottom:10px;word-break:break-word">
                            <a 
                            href="' . $verifyLink . '" 
                            style="background:#2196f3;color:#ffffff;font-family:Raleway,Arial;font-size:16px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;border-radius:40px;padding:10px 25px" 
                            target="_blank"
                            >
                                ' . $frase_link . '
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="font-size:0px;padding:32px 44px;word-break:break-word">
                            <div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.4;text-align:left;color:#253238">
                                ' . $frase_gracias . '    
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        ';
        
        //no lo uso ya que uso PHPMailer
        // $headers  = "MIME-Version: 1.0" . "\r\n";
        // $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
        // $headers .= "From: Bible Text <contact@bible-text.com>" . "\r\n"; 
        // $headers .= "Reply-To: <contact@bible-text.com>" . "\r\n";
        // $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";//opcional. necesario para debuguear        


        // Aquí deberías usar una biblioteca de envío de correo electrónico como PHPMailer o similar
        if($host == 'holy-songs.local'){//LOCALHOST

            echo json_encode([
                'success' => true, 
                'localhost' => true,
                'verifyLink' => $verifyLink,
                'mensaje' => 'Se ha enviado un enlace de confirmación a tu correo electrónico. Para finalizar el proceso de creación de tu cuenta, pincha sobre el enlace.',
                'dic_code' => 'd284' 
            ],JSON_UNESCAPED_UNICODE);
            //exit;

        }else{//PRODUCCION

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode([
                    'success' => false,
                    'mensaje' => 'Email inválido',
                    'dic_code' => 'd241'
                ],JSON_UNESCAPED_UNICODE);
                exit;
            }
            


            //Envio mail
            //$result_mail = mail($email, $subject, $message_html, $headers);//antes. no funciona en hostalia


            //creo instancia de mailer
            $mail = new PHPMailer(true);

            try {
                // ===== CONFIGURACIÓN SMTP =====
                $mail->isSMTP();//estás diciendo: “Conéctate al servidor de correo y haz login como este buzón”
                $mail->Host       = SMTP_HOST;//significa “Conéctate al servidor de correo de Hostalia para enviar este email”
                $mail->SMTPAuth   = true;
                $mail->Username   = SMTP_USER;//el usuario que manda correos
                $mail->Password   = SMTP_PASS;//REEMPLAZAR POR LA CONTRASEÑA REAL de Username 'contact@bible-text.com'
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;
            
                // ===== REMITENTE =====
                $mail->setFrom(SMTP_USER, 'Holy Songs');
            
                // ===== DESTINATARIO =====
                // $mail->addAddress('sergiokovalchuk@gmail.com');
                $mail->addAddress($email);
            
                // ===== CONTENIDO =====
                $mail->isHTML(true);
                $mail->CharSet = 'UTF-8';
                // $mail->Subject = 'Prueba con PHPMailer';//test
                // $mail->Body    = '<b>Email enviado correctamente con PHPMailer</b>';//test
                //$mail->AltBody = 'Email enviado correctamente con PHPMailer';
                $mail->Subject = $subject;
                $mail->Body    = $message_html;
                $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $mail->Body));//para no escribir 2 veces el mensaje en texto plano, lo genero a partir del HTML eliminando las etiquetas y convirtiendo los saltos de línea. es importante para que el mensaje se vea bien en clientes de correo que no soportan HTML.
            
                // ===== DEBUG SOLO EN PRUEBAS !!! (opcional) =====
                //$mail->SMTPDebug = 2;
                //$mail->Debugoutput = 'error_log';
            
                /*
                //Forzar TLS sin verificar certificado (solo para pruebas)
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer'       => false,
                        'verify_peer_name'  => false,
                        'allow_self_signed' => true,
                    ],
                ];
                */
            
                // ===== ENVIAR =====
                //$mail->send();
                $result_mail = $mail->send();
                
                //echo 'EMAIL ENVIADO OK';
            
            } catch (Exception $e) {
                $result_mail = false;
                //echo 'ERROR: ' . $mail->ErrorInfo;
            }



            if (!$result_mail) {
                error_log('phpmailer FALLÓ para: ' . $email . ' - Error: ' . $mail->ErrorInfo);
                echo json_encode([
                    'success' => false, 
                    'mensaje' => '1. Error al enviar el correo electrónico. result_mail es false',
                    'dic_code' => 'd240'
                ],JSON_UNESCAPED_UNICODE);
                exit;
            }

            if ($result_mail) {
                echo json_encode([
                    'success' => true, 
                    'mensaje' => 'Se ha enviado un enlace de confirmación a tu correo electrónico. Para finalizar el proceso de creación de tu cuenta, pincha sobre el enlace.',
                    'dic_code' => 'd284'
                ],JSON_UNESCAPED_UNICODE);
            } else {
                echo json_encode([
                    'success' => false, 
                    'mensaje' => 'Error al enviar el correo electrónico.',
                    'dic_code' => 'd240'
                ],JSON_UNESCAPED_UNICODE);
            }
        }
        
        //echo json_encode([
        //    'success' => true, 
        //    'mensaje' => 'Usuario registrado con éxito.',
        //    'dic_code' => 'd237'
        //],JSON_UNESCAPED_UNICODE);

    } else {
        writeLog("Error al registrar el usuario. Error: [" . $conn->error . "]");
        echo json_encode([
            'success' => false, 
            'mensaje' => 'Error al registrar el usuario: ',
            'conn_error' => $conn->error, 
            'dic_code' => 'd238'
        ],JSON_UNESCAPED_UNICODE);

    }
}

// Cerrar la conexión
$conn->close();

?>
