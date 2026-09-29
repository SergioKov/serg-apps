<?php

// Initialize all variables as empty by default
$cl_home = '';
$cl_projects = '';
$cl_login = '';

$href_home = '/home';
$href_projects = '/projects';
$href_login = '/login';

if (!isset($li_active)) {
    $li_active = 'home';
}

if(isset($_SESSION['login'])){
    $img_src_login = "../images/login2_green.svg";
}else{
    $img_src_login = "../images/login2_grey.svg";
}


// Set the active class based on $li_active
switch ($li_active) {
    case 'projects':
        $cl_projects = 'active'; //aunque no se usa, dejo por si acaso...
        $cl_login = 'd-none'; //por ahora en /projects no lo muestro...
        $href_projects = '#';
        break;

    case 'login':
        $cl_login = 'active'; //aunque no se usa, dejo por si acaso...
        $href_login = '#';
        break;

    case 'home':
        $cl_home = 'active';
        $cl_login = 'd-none'; //por ahora en /home no lo muestro...
        $href_login = '#';
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
            <li><a class="<?= $cl_projects ?>" href="<?= $href_projects ?>" data-link="">Projects</a></li>

            <li class="li_login">
                <a class="a_login <?= $cl_login ?>" href="<?= $href_login ?>" data-link="login">
                    <img src="<?= $img_src_login ?>">
                </a>
            </li>

        </ul>
    </nav>
</header>