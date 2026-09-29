<?php 
//es home
session_start();

//include('../includes/templates/check_auth.php');//antes (sin el enrutador en /index.php)
// include __DIR__ . '/../includes/templates/check_auth.php';//antes
//include __DIR__ . '/../includes/templates/check_login.php';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects</title>
    <link rel="icon" type="image/png" sizes="16x16" href="../images/sa_favicon_16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../images/sa_favicon_32x32.png">
    <link rel="icon" type="image/png" sizes="180x180" href="../images/sa_favicon_180x180.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_slideshow" rel="stylesheet" href="../css/sa_index.css">
</head>
<body>

<?php
    $li_active = 'projects';
    include __DIR__ . '/../includes/templates/header.php';
?>
    
    <div class="container">

        <h1 class="h1_title">Proyectos</h1>      

        <div class="wr_block">

            <h1>Selecciona un proyecto para ver la demo</h1>

            <div class="wr_links" style="flex-direction: column;">                           

                <button id="test" class="btn" onclick="window.location.href = '/projects/dtf'">DTF App</button>

            </div>

        </div>

    </div><!--/container-->

<?php
    include __DIR__ . '/../includes/templates/footer.php';
?>

</body>
</html>