<?php

    //exit("check_login");
    //exit("__DIR__:" . __DIR__);

    //al entrar en joly-songs.com si no está autenticado se redirige al '/login'
    //=========================================================================//
    //test start ...
    //=========================================================================//
    //compruebo aki sesion no cookie!
    if (empty($_SESSION['id_user'])) {
        header('Location:' . RUTA_APP . 'login');
        exit;
    }
    //=========================================================================//
    //test end ...
    //=========================================================================//

?>