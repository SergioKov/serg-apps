
<?php
include('./php/functions.php');
include('./php/includes/base_url.php');


//mensaje
$m = (isset($_GET['m']) && $_GET['m'] != '') ? $_GET['m'] : '';

if($m != ''){
print<<<HERE
<script>
    //alert('$m');
    let dic_code = '$m';
</script>
HERE;
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aviso</title>
    <link rel="icon" type="image/png" href="./images/bt.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href='https://fonts.googleapis.com/css?family=Muli' rel='stylesheet'>   
    <link href="https://fonts.googleapis.com/css2?family=Oswald&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital@1&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Open+Sans:wght@300&family=Raleway:wght@100&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="./css/bt_app_sm.css">
    <link rel="stylesheet" href="./css/bt_resp.css">

</head>
<body id="body_aviso">

    <header id="header_fijo"></header>

    <div class="container">
        <div class="container_inner">

        <h1 class="h1_title">
            Holy-Songs.com
        </h1>

        <div id="wrapper_pwd_form">

            <div class="pwd-page">

                <div class="form">

                    <div id="bl_aviso_form">
                        <form class="aviso-form">
                            <h1>Aviso</h1>
                            <p id="aviso" class="mensaje"></p>
                            <p class="message"><a id="a_inicio" href="/">Ir al inicio</a></p>
                        </form>
                    </div>
                    
                </div>

            </div>

        </div>

        </div><!--/container_inner-->
    </div><!--/container-->

    <footer id="footer_fijo">
        <p>&copy; <?=date("Y");?> Bible-Text.com. Todos los derechos reservados.</p>
    </footer>


<script src="./js/var_lang.js"></script>
<script src="./js/get_globals.js"></script>

<?php include('incl_aviso_cookies.html'); ?>

<script src="./js/aviso.js"></script>

</body>
</html>