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




/*
//HACER PRUEBAS...
echo json_encode([
    'HACIENDO_PRUEBAS' => 'DESCOMENTAR EN PROD',
    'success' => false, 
    'error' => 'Este correo electrónico no está registrado en nuestro sistema.', 
    'dic_code' => 'd231'
],JSON_UNESCAPED_UNICODE);
exit;
*/


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //echo_json_x('es un POST');

    // Obtener datos del cuerpo de la solicitud (en formato JSON)
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
    
    // Obtener usuario y contraseña del cuerpo de la solicitud
    $email = isset($input['email']) ? $input['email'] : '';
    $password = isset($input['password']) ? $input['password'] : '';
    $new_password = isset($input['new_password']) ? $input['new_password'] : '';
    $new_password_rep = isset($input['new_password_rep']) ? $input['new_password_rep'] : '';
    $lang = isset($input['lang']) ? $input['lang'] : '';

    if($email == '' && $password == '' && $new_password == '' && $new_password_rep == ''){
        echo json_encode([
            'success' => false, 
            'error' => 'Email y contraseñas vacios.',
            'dic_code' => 'd263'
        ]);
        return;
    }
    if($email == '' || $password == '' || $new_password == '' || $new_password_rep == ''){
        echo json_encode([
            'success' => false, 
            'error' => 'Email o contraseñas vacios.',
            'dic_code' => 'd264'
        ],JSON_UNESCAPED_UNICODE);
        return;
    }
    if($new_password !=  $new_password_rep){
        echo json_encode([
            'success' => false, 
            'error' => 'La contraseña nueva y su repetición no son iguales.',
            'dic_code' => 'd265'
        ],JSON_UNESCAPED_UNICODE);
        return;
    }
 

    // aplicar el hash bcrypt
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $hashedNewPassword = password_hash($new_password, PASSWORD_DEFAULT);
    //echo"<p>$ hashedPassword; $hashedPassword</p>";


    // buscar usuario por email
    $sql = "SELECT id_user, username, email, password_text, password 
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



    // comprobar si existe usuario
    if($resultado->num_rows === 1) {
        
        // Usuario encontrado, verificar la contraseña
        $row = $resultado->fetch_assoc();

        $storedId_user = $row["id_user"];//1
        $storedUsername = $row["username"];//Sergio
        $storedEmail = $row["email"];//sergiokovalchuk@gmail.com
        $storedHashedPassword = $row["password"];//123123

        //funcción password_verify(contraseña_input, contraseña_hasheada_de_bd)
        if(password_verify($password, $storedHashedPassword)) { 
            //echo "¡Contraseña correcta! Usuario autenticado.";
            //echo_json_x('dentro de password_verify');

            // Obtener la fecha y hora actual
            $updated_at = date("Y-m-d H:i:s");

            //aki no hago consulta preparada ya que los datos son de bd y seguras
            $sql_up = "UPDATE users SET 
                        `password` = '$hashedNewPassword',
                        `password_text` = '$new_password',
                        `updated_at` = '$updated_at'
                        WHERE id_user = '$storedId_user'
            ";
            $result_up = $conn->query($sql_up);
            //echo_json_x($sql_up, 'sql_up');

            //si se ha actualizdo el password en bd...
            if($result_up){

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

                writeLog("Contrasena actualizada con éxito. email: [" . $email . "] old_password: [" . $password . "] new_password: [" . $new_password . "]");

                // Enviar un correo electrónico al usuario con el enlace de restablecimiento
                $subject = $obj_lang['d297'];//"Actualizar Contraseña";
                //$message = "Tu contraseña ha sido actualizada con éxito.";
                // $linkLogin = $host . "/bible/?login";//mal
                // $linkLogin = $host . "/?login";//mal
                $linkLogin = $_SERVER['HTTP_HOST'] . "/login/?login";//'http://holy-songs.local/login/?login' o ''https://holy-songs.com/login/?login' ok. 

                $frase_hola = $obj_lang['d287'];//'Hola';
                $frase2 = $obj_lang['d292'];//Tu contraseña ha sido actualizada con éxito. Pulsa "Entrar" para loguearte con la nueva contraseña.
                $frase3 = $obj_lang['d289'];//'Por seguridad, nunca compartas este enlace con otras personas. Desde Bibleqt en ningún caso te pediremos que lo hagas.';
                $frase_link = $obj_lang['d293'];//'Entrar';
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
                                    href="' .$linkLogin . '" 
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
                // $headers .= "From: Bibleqt <contact@holy-songs.com>" . "\r\n"; 
                // $headers .= "Reply-To: Bibleqt <contact@holy-songs.com>" . "\r\n";
                // $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";//opcional. necesario para debuguear  
                //echo_json_x('ccc');

                
                // Aquí deberías usar una biblioteca de envío de correo electrónico como PHPMailer o similar
                if($host == 'holy-songs.local'){//LOCALHOST

                    echo json_encode([
                        'success' => true, 
                        'localhost' => true,
                        'linkLogin' => $linkLogin,
                        'host' => $host,
                        'mensaje' => 'Su contraseña ha sido actualizada con éxito.',
                        'dic_code' => 'd266'
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
                        $mail->Password   = SMTP_PASS;//REEMPLAZAR POR LA CONTRASEÑA REAL de Username 'contact@holy-songs.com'
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


                    if($result_mail) {
                        //El correo electrónico se envió correctamente.";
                        echo json_encode([
                            'success' => true, 
                            'mail_sent' => true,
                            'mensaje' => 'Su contraseña ha sido actualizada con éxito.',
                            'dic_code' => 'd266'
                        ],JSON_UNESCAPED_UNICODE);
                    } else {
                        //El correo electrónico NO se envió";
                        echo json_encode([
                            'success' => true, 
                            'mail_sent' => false,
                            'mensaje' => 'Su contraseña ha sido actualizada con éxito.',
                            'dic_code' => 'd266'
                        ],JSON_UNESCAPED_UNICODE);
                    }
                }

            }else{
                echo json_encode([
                    'success' => false, 
                    'error' => 'Su contraseñaa no se ha actualizado. <br>Error en la consulta.',
                    'dic_code' => 'd272'
                ],JSON_UNESCAPED_UNICODE);
    
            }

        }else{
            
            //echo "Contraseña incorrecta. Usuario no autenticado.";
            // Autenticación fallida
            echo json_encode([
                'success' => false, 
                'error' => 'la contrasena actual es incorrecta. Los datos no se han actualizado.',
                'dic_code' => 'd234'
            ],JSON_UNESCAPED_UNICODE);

        }

    } else {
        
        echo json_encode([
            'success' => false, 
            'error' => 'Este correo electrónico no está registrado en nuestro sistema.', 
            'dic_code' => 'd231'
        ],JSON_UNESCAPED_UNICODE);

    }

}else{
    
    // Establecer la redirección después de 5 segundos
    header("Refresh: 0; url=../aviso.php?m=d256");
    //echo '<p>El método de pasar los parametros no es correcto.</p>';
    return;

}

// mysqli_close($conn);
$conn->close();

?>
