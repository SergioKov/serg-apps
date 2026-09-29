<?php

session_start();

// vaciar variables de sesión
$_SESSION = [];

// destruir sesión
session_destroy();

// eliminar cookie si existe
if(isset($_COOKIE['authenticated'])) {

    setcookie(
        'authenticated',
        '',
        time() - 3600,
        '/'
    );
}

// redirect
header('Location: /login?logout=1');//logout - para mostrar aviso con showToast()
exit;