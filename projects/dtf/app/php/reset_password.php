<?php

include('functions.php');
include('includes/connect_db.php');
include('includes/base_url.php');

//debug_x('file: /php/reset_password.php');


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    
    //debug_x($_GET);
    
    // Escapar el valor de $_GET['email'] para evitar inyecciones SQL
    $email = (isset($_GET['email'])) ? $conn->real_escape_string(strtolower($_GET['email'])) : '' ;
    $token = (isset($_GET['token'])) ? $conn->real_escape_string($_GET['token']) : '' ;

    if($email == '' || $token == ''){
        // Establecer la redirección después de 5 segundos
        header("Refresh: 0; url=../aviso.php?m=d258");
        //echo '<p>Email o token vacios. <br>Para restablecer la contraseña son imprescindibles estos datos.</p>';
        return;
    }
    
    // Verificar si el correo electrónico y el token son válidos
    $checkQuery_prep = "SELECT id_user, email, reset_token, reset_token_expiry 
                        FROM users 
                        WHERE email = ? 
                        AND reset_token = ? 
                        AND reset_token_expiry > NOW()
    ";
    $arr_params = [$email, $token];
    $checkQuery_preparada = prepararQuery($conn, $checkQuery_prep, $arr_params);
    $result = $conn->query($checkQuery_preparada);
    //debug_x($checkQuery_preparada, 'checkQuery_preparada');

    if($result->num_rows > 0){             
        $location = "Location: " . $protocol . "://" . $host . "/song/reset_password_form.php?email=$email&token=$token";
        //echo "<br>$ location: $location";
        //exit();
        
        // Permitir al usuario restablecer la contraseña
        // Puedes redirigir al usuario a un formulario para ingresar la nueva contraseña
        header($location);

    } else {
        
        // Establecer la redirección después de 5 segundos
        header("Refresh: 0; url=../aviso.php?m=d260");
        //echo '<p>Enlace no válido o expirado. <br>Intenta recuperar la contraseña de nuevo por favor.</p>'; 
    }
}

// mysqli_close($conn);
$conn->close();

?>
