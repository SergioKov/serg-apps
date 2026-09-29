<?php

session_start(); //aki obligatorio ya que no tiene header.php (header.php tienen dentro session_start())

//es: auth/index.php
//si alguien mete 'http://holy-songs.local/auth/' que le redirija a '/login'
include __DIR__ . '/../includes/templates/check_login.php';//new. 
?>


<?php
//es: auth
    
    // Autenticar el usuario
    $errores = [];
    $correct_password = "demosongs";

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        // echo "<pre>";
        //     var_dump($_POST);
        // echo "</pre>";

        $password = $_POST['password'];

        if(!$password) {
            $errores[] = "La contraseña es obligatoria";
        }

        if(empty($errores)) {

            // Verificar si la contraseña es correcta
            if ($password === $correct_password) {
                // Establecer una cookie de autenticación válida por 1 hora
                setcookie("authenticated", "true", time() + 3600, "/");
                
                // Redirigir al contenido protegido
                // header("Location: /home");
                header("Location: /");
                exit();
            } else {
                // Si la contraseña es incorrecta, mostrar un mensaje de error
                //echo "Contraseña incorrecta.";
                $errores[] = 'La contraseña es incorrecta';
            }
             
        }

    }

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HS - Auth</title>
    <link rel="icon" type="image/png" href="../images/hs.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_slideshow" rel="stylesheet" href="../css/sa_index.css">
</head>
<body>

    <header>
        <nav>
            <ul>
                <li><a href="#" style="visibility: hidden;" data-link="">Inicio</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="container">

        <h1 class="h1_title">
            Serg-Apps.com
            <span>(Demo)</span>
        </h1>
    
        <div class="wr_block">

            <h1>Autentícate para ver el demo</h1>
            
            <div class="wr_links" style="flex-direction: column;">

                <?php foreach($errores as $error): ?>
                    <div class="alerta error">
                        <?php echo $error; ?>
                    </div>
                <?php endforeach; ?>

                <form method="POST" class="formulario" novalidate>
                    <fieldset>
                        <legend>Contraseña de autentificación</legend>

                        <input id="password" type="password" name="password" placeholder="Tu contraseña...">
                    </fieldset>
                    <button id="btn_submit" class="btn_wide" type="submit">Entrar</button>
                </form>

            </div>
                
        </div>

    </div><!--/container-->


    <?php
        include __DIR__ . '/../includes/templates/footer.php';
    ?>


</body>
</html>