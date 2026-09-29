<?php

// Initialize all variables as empty by default
$cl_home = '';
$cl_app = '';
$cl_login = '';

$href_home = RUTA_APP . 'home';//sin slash '/' para que apunte a 'projects/dtf/home'
$href_app = RUTA_APP . 'app';
$href_login = RUTA_APP . 'login';

if (!isset($li_active)) {
    $li_active = 'home';
}

if(isset($_SESSION['login'])){
    $img_src_login = RUTA_APP . "/../app/images/login2_green.svg";
}else{
    $img_src_login = RUTA_APP . "/../app/images/login2_grey.svg";
}


// Set the active class based on $li_active
switch ($li_active) {
    case 'app':
        $cl_app = 'active'; //aunque no se usa, dejo por si acaso...
        $href_app = '#';
        break;

    case 'login':
        $cl_login = 'active'; //aunque no se usa, dejo por si acaso...
        $href_login = '#';
        break;

    case 'home':
        $cl_home = 'active';
        $href_home = '#';
        break;

    default:
        $cl_home = 'active';
        $href_home = '#';
        break;
}

?>
<style>
    .li_login {
        float: right;
    }
    .a_login img {
        width: 21px;
        height: 21px;
    }
</style>
<header>
    <nav>
        <ul>
            <li><a class="<?= $cl_home ?>" href="<?= $href_home ?>" data-link="home">Home</a></li>
            <li><a class="<?= $cl_app ?>" href="<?= $href_app ?>" data-link="">App</a></li>

            <li class="li_login">
                <a class="a_login <?= $cl_login ?>" href="<?= $href_login ?>" data-link="login">
                    <img src="<?= $img_src_login ?>">
                </a>
            </li>

        </ul>
    </nav>
</header>