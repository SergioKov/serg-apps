<?php
//es: index.php (Inicio)
//exit("dtf");

require_once __DIR__ . '/includes/config/app.php';

// include('./includes/templates/check_auth.php');//antes
include('./includes/templates/check_login.php');

//exit();

header('Location: ' . RUTA_APP . 'home');//
exit();




//===============================================//
// test
//===============================================//


?>