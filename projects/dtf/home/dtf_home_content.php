<?php 
//es home
session_start();

require_once __DIR__ . '/../includes/config/app.php';

//include('../includes/templates/check_auth.php');//antes (sin el enrutador en /index.php)
// include __DIR__ . '/../includes/templates/check_auth.php';//antes
//include __DIR__ . '/../includes/templates/check_login.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTF - Home</title>
    <link rel="icon" type="image/png" href="<?= RUTA_APP ?>images/dtf_favicon_76x76.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_slideshow" rel="stylesheet" href="../css/dtf_index.css">
</head>
<body>

    <?php
        $li_active = 'home';
        include __DIR__ . '/../includes/templates/header.php';
    ?>
    
    <div class="container">

        <div class="wr_block_logo">
            <img class="logo" src="<?= RUTA_APP ?>images/dtf_app_logo.png" alt="Logo de DTF App">
        </div>
       

        <div class="wr_block">

            <h1>Acceso restringido</h1>

            <p>Esta plataforma se encuentra en desarrollo continuo y su contenido está disponible únicamente para usuarios registrados y autorizados.</p>

            <p>Si ya dispones de una cuenta creada en la plataforma, inicia sesión para acceder.</p>

            <div class="wr_links" style="flex-direction: column;">                           

                <button id="test" class="btn" onclick="window.location.href = '<?= RUTA_APP ?>login'">Iniciar sesión</button>

            </div>

        </div>

    </div><!--/container-->

<?php
    include __DIR__ . '/../includes/templates/footer.php';
?>

</body>
</html>