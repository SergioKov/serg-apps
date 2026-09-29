
<?php
include('./php/includes/base_url.php');

$email = (isset($_GET['email']) && $_GET['email'] != '') ? $_GET['email'] : '';
$token = (isset($_GET['token']) && $_GET['token'] != '') ? $_GET['token'] : '';

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-dic="d181">Recuperar contraseña</title>
    <link rel="icon" type="image/png" href="../images/hs.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href='https://fonts.googleapis.com/css?family=Muli' rel='stylesheet'>    
    <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital@1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Open+Sans:wght@300&family=Raleway:wght@100&display=swap" rel="stylesheet">

    <!-- <link rel="stylesheet" href="./css/b_app.css"> -->
    <link rel="stylesheet" href="./css/bt_app_sm.css">
    <!-- <link rel="stylesheet" href="./css/b_app_resp.css"> -->

</head>
<body id="body_reset_pwd">

    <header id="header_fijo"></header>

    <div class="container">
        <div class="container_inner">

            <h1 class="h1_title">
                Holy-Songs.com
            </h1>

            <div id="wrapper_pwd_form">

                <div class="pwd-page">

                    <div class="form">

                        <div id="bl_reset_pwd_form">
                            <form class="reset-pwd-form" novalidate>
                                <h1 data-dic="d181">Recuperar contraseña</h1>
                                <p class="mensaje" data-dic="d277">Introduce tu contraseña nueva.</p>
                                <input id="email" name="email" type="hidden" value="<?=$email?>"/>
                                <input id="token" name="token" type="hidden" value="<?=$token?>"/>
                                <input id="password" name="password" class="type_password" type="password" autocomplete="off" placeholder="password" required/>
                                <input id="password_rep" name="password" class="type_password m_bot0" type="password" autocomplete="off" placeholder="repeat password" required/>
                                <label class="ch_lab">
                                    <input class="ch_mostrar" type="checkbox" onchange="showHidePassword(this)">
                                    <span class="ch_mostrar_sp" data-dic="d417">mostrar contraseña</span>
                                </label>
                                <button id="btn_guardar" class="btn_wide" type="button" onclick="saveNewPassword();" data-dic="d515">Guardar</button>
                                <p class="message"><a href="#" onclick="window.location.href = '<?=$baseUrl?>'" data-dic="d262">Ir al inicio</a></p>
                            </form>
                        </div>
                        
                    </div>

                </div>

            </div>

        </div><!--/container_inner-->
    </div><!--/container-->

    <footer id="footer_fijo">
        <p>&copy; <?=date("Y");?> Holy-Songs.com. <span data-dic="d516">Todos los derechos reservados.</span></p>
    </footer>


<script src="./js/var_lang.js"></script>
<script src="./js/get_globals.js"></script>

<script src="../login/js/l_config.js"></script>

<?php include('incl_aviso_cookies.html'); ?>

<script src="./js/reset_password_form.js"></script>

</body>
</html>