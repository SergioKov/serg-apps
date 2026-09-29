<?php

include('functions.php');
include('includes/connect_db.php');
include('includes/base_url.php');

//debug_x("file: /php/verify_email.php");




if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    
    //debug($_GET);
    //exit();
    
    // Valores GET
    $email = isset($_GET['email'])
        ? strtolower(trim($_GET['email']))
        : '';

    $token = isset($_GET['token'])
        ? trim($_GET['token'])
        : '';

    $lang = isset($_GET['lang'])
        ? trim($_GET['lang'])
        : '';

    if($email == '' || $token == ''){
        // Establecer la redirección después de 5 segundos
        header("Refresh: 0; url=../aviso.php?m=d281");
        //echo '<p>Email o token vacios. <br>Para confirmar tu correo electrónico son imprescindibles estos datos.</p>';
        return;
    }
    
    // Verificar si el correo electrónico y el token son válidos
    $checkQuery_prep = "SELECT id_user, username, email_token, email_token_expiry 
                        FROM users 
                        WHERE email = ? AND email_token = ?
                        LIMIT 1 
    ";
    $stmt = $conn->prepare($checkQuery_prep);

    if(!$stmt) {
        die("Error SQL");
    }

    $stmt->bind_param("ss", $email, $token);
    $stmt->execute();
    $result = $stmt->get_result();
    //debug_x($checkQuery_preparada, 'checkQuery_preparada');


    if($result->num_rows === 1){
         $row = $result->fetch_assoc();

        //verifico si todavía no han pasado 24 horas desde inicio de creacion de cuenta        
        $now = date('Y-m-d H:i:s');

        //si la fecha de caducidad de email_token es posterior a ahora...
        if($row['email_token_expiry'] > $now){//sql equivalente => 'AND email_token_expiry > NOW()'
            //todo ok. todavia no han pasado los 24 horas desde inicio de creación de cuenta. le dejo continuar

            // Actualizar email_token y borrar el token
            $updateQuery = "UPDATE users 
                            SET 
                                is_email_verified = 1,
                                email_token = NULL, 
                                email_token_expiry = NULL 
                            WHERE email = ? AND email_token = ?
                            LIMIT 1
            ";
            $stmt_up = $conn->prepare($updateQuery);

            if(!$stmt_up){
                die("Error SQL");
            }
            
            $stmt_up->bind_param("ss", $email, $token);            
            $result_up = $stmt_up->execute();

            if($result_up){
                $dic_code = 'd282';//Tu email ha sido verificado correctamente. Tu cuenta se ha creado con éxito.
                writeLog("Email verificado con éxito. email: [" . $email . "]");
                
            }else{
                $dic_code = 'd285';//Tu email no ha sido verificado. Intenta de nuevo.
                writeLog("Email no verificado. email: [" . $email . "]");
            }
            
            $location = "Location: " . $protocol . "://" . $host . "/song/aviso.php?m=$dic_code";
            //echo "<br>$ location: $location";
            //exit();
            
            // Puedes redirigir al usuario a un aviso
            header($location);

        }else{
            
            //demasiado tarde. elimino el registro del usuario y le pido registrarse de nuevo
            // Eliminar el registro de usuario
            $deleteQuery = "DELETE FROM users
                            WHERE email = ? AND email_token = ?
                            LIMIT 1
            ";
            $stmt_del = $conn->prepare($deleteQuery);

            if(!$stmt_del){
                die("Error SQL");
            }

            $stmt_del->bind_param("ss", $email, $token);
            $result_del = $stmt_del->execute();

            if($result_del){
                $dic_code = 'd299';//Ha pasado más de 24 horas desde el inicio del proceso de creación de tu cuenta. Tu email no ha sido confirmado a tiempo y tu cuenta no se ha creado. Vuelve a crear tu cuenta de nuevo por favor.
                writeLog("El usuario eliminado de la bd por superar 24 horas para l averificación. email: [" . $email . "]");

                // Establecer la redirección después de 5 segundos
                header("Refresh: 0; url=../song/aviso.php?m=d299");                

            }else{
                $dic_code = 'd300';//Ha ocurrido un error al crear tu cuenta. Ponte en contacto con el administrador de Bibleqt.

                writeLog("Error d300 al crear la cuenta.");

                // Establecer la redirección después de 5 segundos
                header("Refresh: 0; url=../song/aviso.php?m=d300");
            }
        }

    } elseif ($result->num_rows > 1){

        // error grave
        writeLog("Error grave al crear la cuenta. Múltiples usuarios con mismo email/token.");

        // Establecer la redirección después de 5 segundos
        header("Refresh: 0; url=../aviso.php?m=error_mu");
    
    } else {

        writeLog("Error d283 al crear la cuenta. Enlace no válido.");

        // Establecer la redirección después de 5 segundos
        header("Refresh: 0; url=../aviso.php?m=d283");
        //echo '<p>Enlace no válido. <br>Intenta confirmar tu correo electrónico de nuevo por favor.</p>'; 
    }
}

// mysqli_close($conn);
$conn->close();

?>
