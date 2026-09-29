<?php
    //el trozo que voy a insertar en cada index.php TEMPORALMENTE
    //AL TERMINAR EL LOGIN LO QUITO...
    //=========================================================================//
    //test start ...
    //=========================================================================//
    // Verificar si el usuario está autenticado PARA VER DEMO!!! EN PROD CUANDO ESTÉ LISTO -> QUITAR!!!
    //if(!isset($demo)){        
        if (!isset($_COOKIE["authenticated"]) || $_COOKIE["authenticated"] !== "true") {
            // Si no está autenticado, redirigir al formulario de login
            //echo'<p>redirijo a demo para introducir password';
            header("Location: /auth");
            exit();
        }
    //}
    //=========================================================================//
    //test end ...
    //=========================================================================//

?>