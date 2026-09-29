<?php

error_reporting(E_ALL);

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




//si los datos NO VIENEN desde el metodo permitido
if (!in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){
    // Establecer la redirección después de 5 segundos
    header("Refresh: 5; url=../aviso.php");
        
    writeLog("El método de pasar los parametros no es correcto.");

    echo json_encode([
        'success' => false, 
        'error' => 'El método de pasar los parametros no es correcto.',
        'dic_code' => 'd256'
    ],JSON_UNESCAPED_UNICODE);    
}

//echo_json_x('aaa');


//si los datos SÍ VIENEN desde el metodo permitido
//es lo mismo que => if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'GET'){
if (in_array($_SERVER['REQUEST_METHOD'], $arr_metodos)){

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        // Obtener datos del cuerpo de la solicitud (en formato JSON)
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
        //debug($inputJSON, 'inputJSON');

        $email = $conn->real_escape_string(strtolower($input['email']));
        $lang = $conn->real_escape_string(strtolower($input['lang']));
    } 

    if($_SERVER['REQUEST_METHOD'] === 'GET'){//para hacer test...
        // Obtener usuario y contraseña del cuerpo de la solicitud
        $email = isset($_GET['email']) ? $conn->real_escape_string(strtolower($_GET['email'])) : '' ;
        $lang = isset($_GET['lang']) ? $conn->real_escape_string(strtolower($_GET['lang'])) : '' ;
        //debug($email, 'email');
        //debug($lang, 'lang');
    }
}


if($email == ''){
    writeLog("El correo electrónico no está indicado. email: [" . $email . "]");    
    echo json_encode([
        'success' => false, 
        'error' => 'Email vacío',
        'dic_code' => 'd303'
    ],JSON_UNESCAPED_UNICODE);
    return;
}

//echo_json_x('aaa');
    
// Verificar si el correo electrónico existe en la base de datos
// $checkQuery_init = "SELECT `id_user`, `username` 
//                     FROM users 
//                     WHERE email = '$email' 
// ";
$checkQuery_prep = "SELECT `id_user`, `username` 
                    FROM users 
                    WHERE email = ?  
";
$arr_params = [$email];
$checkQuery_preparada = prepararQuery($conn, $checkQuery_prep, $arr_params);
$result = $conn->query($checkQuery_preparada);
$result_num_rows = $result->num_rows;

//echo_json_x('bbb');


if($result_num_rows > 0) {
    
    // Usuario encontrado, verificar la contraseña
    $row = $result->fetch_assoc();
    //$storedId_user = $row['id_user'];//1
    $storedUsername = $row['username'];//Sergio

    // Generar un token único y establecer la fecha de expiración
    $resetToken = bin2hex(random_bytes(32));
    $resetTokenExpiry = date('Y-m-d H:i:s', strtotime('+1 hour'));        

    // Almacenar el token y la fecha de expiración en la base de datos
    // $updateQuery_init = "UPDATE users SET 
    //                     reset_token = '$resetToken', 
    //                     reset_token_expiry = '$resetTokenExpiry' 
    //                     WHERE email = '$email' 
    // ";
    $updateQuery_prep = "UPDATE users SET 
                        reset_token = ?, 
                        reset_token_expiry = ? 
                        WHERE email = ? 
    ";
    $arr_params = [$resetToken, $resetTokenExpiry, $email];
    $updateQuery_preparada = prepararQuery($conn, $updateQuery_prep, $arr_params);
    $result_up = $conn->query($updateQuery_preparada);

    if($result_up){
        writeLog("Se ha generado el token para el correo para resetear la contraseña. email: [" . $email . "] caducidad del token: [" . $resetTokenExpiry . "]");
    }else{
        writeLog("No se ha podido guardar datos en la bd del token generado para el correo para resetear la contraseña. email: [" . $email . "]");
    }


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
    $subject = $obj_lang['d295'];//'Restablecer contraseña';
    $resetLink = $baseUrl . "reset_password.php?email=$email&token=$resetToken";
    //$message = "Haga clic en el siguiente enlace para restablecer su contraseña: $resetLink";

    $frase_hola = $obj_lang['d287'];//'Hola';
    $frase2 = $obj_lang['d294'];//Hemos recibido una solicitud para restablecer la contraseña. Pulsa "Restablecer contraseña" para crear una nueva contraseña. Si no has sido tú quien lo ha solicitado, puedes ignorar este mensaje.
    $frase3 = $obj_lang['d289'];//'Por seguridad, nunca compartas este enlace con otras personas. Desde Bibleqt en ningún caso te pediremos que lo hagas.';
    $frase_link = $obj_lang['d295'];//'Restablecer contraseña';
    $frase_gracias = $obj_lang['d291'];//'Gracias, <br>El equipo de Bibleqt';

    $username_safe = htmlspecialchars($storedUsername, ENT_QUOTES, 'UTF-8');//para mostrar el nombre de usuario en el email sin riesgo de inyección de código. aunque el username no debería contener caracteres peligrosos, es una buena práctica sanitizarlo antes de incluirlo en el HTML del email.

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
                        href="' . $resetLink . '" 
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
    // $headers .= "From: Bibleqt <contact@bible-text.com>" . "\r\n"; 
    // $headers .= "Reply-To: Bibleqt <contact@bible-text.com>" . "\r\n";
    // $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";//opcional. necesario para debuguear  
    //echo_json_x('ccc');
    

    // Aquí deberías usar una biblioteca de envío de correo electrónico como PHPMailer o similar
    if($host == 'holy-songs.local'){//LOCALHOST
        writeLog("Se ha generado el enlace para resetear la contraseña. email: [" . $email . "] resetLink: [" . $resetLink . "]");

        echo json_encode([
            'success' => true, 
            'localhost' => true, 
            'resetLink' => $resetLink
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
        //$result_mail = mail($email, $subject, $message_html, $headers);


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
            $mail->setFrom(SMTP_USER, 'Bible Text');
        
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
            writeLog("Se ha enviado el enlace para resetear la contraseña. email: [" . $email . "] resetLink: [" . $resetLink . "]");            
            echo json_encode([
                'success' => true, 
                'mensaje' => 'Se ha enviado un enlace de restablecimiento de contraseña a su correo electrónico.',
                'dic_code' => 'd239'
            ],JSON_UNESCAPED_UNICODE);
        } else {
            writeLog("Error al enviar el correo electrónico. email: [" . $email . "]");
            echo json_encode([
                'success' => false, 
                'mensaje' => 'Error al enviar el correo electrónico.',
                'dic_code' => 'd240'
            ],JSON_UNESCAPED_UNICODE);
        }
    }

} else {
    
    writeLog("El correo electrónico no está registrado en nuestro sistema. email: [" . $email . "]");

    //echo "El correo electrónico no está registrado en nuestro sistema.";
    echo json_encode([
        'success' => false, 
        'error' => 'El correo electrónico no está registrado en nuestro sistema.', 
        'dic_code' => 'd231'
    ],JSON_UNESCAPED_UNICODE);//d231 = Este correo electrónico no está registrado en nuestro sistema.
}

$conn->close();

?>
