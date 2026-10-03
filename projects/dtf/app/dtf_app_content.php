<?php

session_start(); //aki obligatorio ya que no tiene header.php (header.php tienen dentro session_start())

require_once __DIR__ . '/../includes/config/app.php';

//es: app/index.php
//include('../includes/templates/check_auth.php');//antes (sin el enrutador en /index.php)
// include __DIR__ . '/../includes/templates/check_auth.php';//antes
include __DIR__ . '/../includes/templates/check_login.php';
?>

<?php

//sesion iniciada correctamente
if (isset($_SESSION['login']) && $_SESSION['login'] === true) {
    $img_login_src = "./images/login2_green.svg";

    echo '
            <script>
                let hay_usuario_logueado = true;
                let username = "' . addslashes($_SESSION['username']) . '";
                let email = "' . addslashes($_SESSION['email']) . '";
                //alert("username: " + username);        
            </script>
        ';

    if (isset($_SESSION['success'])) {
        echo '
                <script>
                    window.addEventListener("DOMContentLoaded", () => {
    
                        showToast(
                            "ok",
                            "' . addslashes($_SESSION['success']) . '",
                            2000,
                            "center"
                        );
            
                    });            
                </script>
            ';
        unset($_SESSION['success']);
    }
} else {
    $img_login_src = "./images/login2_grey.svg";
    echo '
            <script>
                let hay_usuario_logueado = false;        
            </script>
        ';
}


?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DTF - App</title>
    <link rel="icon" type="image/png" href="<?= RUTA_APP ?>images/dtf_favicon_76x76.png">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Noto+Music&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=PT+Sans+Narrow:wght@400;700&family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Chivo+Mono:ital,wght@0,100..900;1,100..900&family=Fira+Sans+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&family=Michroma&family=Noto+Music&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=PT+Sans+Narrow:wght@400;700&family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="./css/app.css">
    <link rel="stylesheet" href="./css/toast.css">
    <link rel="stylesheet" href="./css/app_form.css">
    <link rel="stylesheet" href="./css/app_modal.css">
    <link rel="stylesheet" href="./css/app_scroll.css">
    <link rel="stylesheet" href="./css/app_public.css">
    <link rel="stylesheet" href="./css/app_resp.css">

    <style id="style_item_h"></style>
</head>

<body>

    <!-- Header de arriba - contenedor de ajustes de Transponer... -->
    <header>

        <!-- Menu de Header arriba - contenedor de transponer arriba ... -->
        <div id="menu_contenido" class="">
            <div id="menu_contenido_inner">

                <div id="head_block_l" onclick="hideShowPuntosMenu()">
                    <div id="hamburger" class="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div id="head_block_c">
                    <a href="<?= RUTA_APP ?>home">
                        <img class="logo_sm" src="<?= RUTA_APP ?>images/dtf_app_logo_sm.png" alt="Logo de DTF App">
                    </a>
                </div>

                <div id="head_block_r">
                    <div class="wr_login" onclick="manejarLogin();" data-block_name="login" title="Login">
                        <img id="img_login" class="btn_img" src="<?= RUTA_APP ?>./app/images/login2_yellow.svg">
                    </div>
                </div>

            </div>
        </div><!--/#menu_contenido-->

        <!-- Puntos Menu - contenedor de menu desplegable... -->
        <div id="puntosMenu" class="">
            <ul>
                <li onclick="showBlockName(this.dataset.block_name)" class="active" data-block_name="clientes">Clientes</li>
                <li onclick="showBlockName(this.dataset.block_name)" class="" data-block_name="productos">Productos</li>
                <li onclick="showBlockName(this.dataset.block_name)" class="" data-block_name="pedidos">Pedidos</li>
                <li on-click="" data-block_name="">Taquillas</li>
                <li on-click="" data-block_name="">Ingresos</li>
                <li on-click="" data-block_name="">Gastos</li>
                <li on-click="" data-block_name="">Usuarios</li>
                <li>---</li>
                <li><a href="/home">Serg-Apps.com</a></li>
            </ul>
        </div><!--/#puntosMenu-->

    </header><!--/header--><!---->



    <!-- Main -->
    <div id="main" class="">



        <div id="block_clientes" class="main_block active">
            <div id="block_clientes_inner" class="main_block_inner">

            <div class="wr_bl_buscar">
                <h4>Clientes</h4>
                <div class="wr_btn_img" onclick="openModal('full','Buscar Cliente',null,'buildBuscarCliente', true, 'ver');">
                    <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                </div>
            </div>

            <div id="contenedor_clientes" class="wr_d_clientes wr_d_arts">

                <div class="d_cliente d_art" data-tipo_art="cliente" data-id_cliente="5">
                    <div class="datos_cliente datos_art">
                        <div class="da_nombre">Nombre Apellido (Ejemplo)</div>
                        <div class="da_tel">622 315 345</div>
                        <div class="da_com">cliente fiel</div>
                    </div>

                    <div class="tres_puntos">
                        <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                    </div>
                    <div class="tres_puntos_menu">
                        <div onclick="openModal('full','Cliente actual',null,'buildCliente',true, 'ver');">
                            <img class="img_acts img_ver" src="./images/img_ver_white_24x24.png">
                        </div>
                        <div onclick="openModal('full','Cliente actual',null,'buildCliente',true, 'editar');">
                            <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
                        </div>
                        <div onclick="openModal('full','Cliente actual',null,'buildCliente',true, 'eliminar');">
                            <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
                        </div>
                    </div>
                    
                </div>

        
            </div><!--/.wr_d_clientes -->

            <button id="btn_add_cliente" class="btn_add" onclick="openModal('full','Crear Cliente',null,'buildCliente',true, 'nuevo');">+</button>           
            
            </div><!--/#block_clientes_inner -->
        </div><!--/#block_clientes -->






        <div id="block_productos" class="main_block">
            <div id="block_productos_inner" class="main_block_inner">

                <h4>Productos</h4>

                <div class="wr_d_productos wr_d_arts">

                    <div class="d_producto d_art">
                        <div class="datos_producto datos_art">
                            <div class="da_nombre">DTF Textil</div>
                            <div class="da_com">DTF Textil por metros</div>
                        </div>
                        <div class="art_col3">
                            <div>10 €</div>
                        </div>

                        <div class="tres_puntos">
                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                        </div>
                        <div class="tres_puntos_menu">
                            <div>ver 3</div>
                            <div>editar</div>
                            <div>eliminar</div>
                        </div>

                    </div>


                    <div class="d_producto d_art">
                        <div class="datos_producto datos_art">
                            <div class="da_nombre">DTF Textil</div>
                            <div class="da_com">DTF Textil por metros</div>
                        </div>
                        <div class="art_col3">
                            <div>24 €</div>
                        </div>

                        <div class="tres_puntos">
                            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                        </div>
                        <div class="tres_puntos_menu">
                            <div>ver 3</div>
                            <div>editar</div>
                            <div>eliminar</div>
                        </div>

                    </div>


                </div><!--/.wr_d_productos -->

                <button id="btn_add_producto" class="btn_add">+</button>

            </div><!--/#block_productos_inner -->
        </div><!--/#block_productos -->







        <div id="block_pedidos" class="main_block">
            <div id="block_pedidos_inner" class="main_block_inner">
                
            <h4>Pedidos</h4>

            <div class="wr_d_pedidos wr_d_arts">

                <div class="d_pedido d_art">
                    <div class="datos_pedido datos_art">
                        <div class="da_diasem">Lunes</div>
                        <div class="da_fecha">28.09.2026</div>
                        <div class="da_hora">15:45</div>
                    </div>
                    <div class="art_col2">
                        <div>100m</div>
                    </div>
                    <div class="art_col3">
                        <div>150 €</div>
                    </div>

                    <div class="tres_puntos">
                        <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                    </div>
                    <div class="tres_puntos_menu">
                        <div>ver 3</div>
                        <div>editar</div>
                        <div>eliminar</div>
                    </div>

                </div>


                <div class="d_pedido d_art">
                    <div class="datos_pedido datos_art">
                        <div class="da_diasem">Lunes</div>
                        <div class="da_fecha">28.09.2026</div>
                        <div class="da_hora">15:45</div>
                    </div>
                    <div class="art_col2">
                        <div>200m</div>
                    </div>
                    <div class="art_col3">
                        <div>550 €</div>
                    </div>

                    <div class="tres_puntos">
                        <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
                    </div>
                    <div class="tres_puntos_menu">
                        <div>ver 3</div>
                        <div>editar</div>
                        <div>eliminar</div>
                    </div>

                </div>



            </div><!--/.wr_d_productos -->

            <button id="btn_add_producto" class="btn_add">+</button>

            
            </div><!--/#block_productos_inner -->
        </div><!--/#block_pedidos -->







    </div><!--/#main-->



    <!-- Modal -->
    <div id="myModal" class="modal">

        <!-- Modal Content -->
        <div id="myModalContent" class="modal-content">

            <div class="wr_modcont">

                <header id="modcont_header" class="elementos_modales">
                    <div class="inner">
                        <h4>
                            <span id="h4_text">aki modal content header</span>
                            <span class="close" onclick="closeModal(null,true)">&#10005;</span><!-- x -->
                        </h4>
                    </div>
                    <div id="bl_modalFilter">
                        <div id="bl_modalFilter_inner"></div>
                    </div>
                </header>

                <div id="modcont_body" class="elementos_modales">
                    <div class="inner">

                        <div id="bl_modalTop" class="body_bls" style="display:none;">
                            <div id="bl_modalTopInner">

                                <div id="topLogin" style="display: none;">
                                    <div id="topLoginInner">
                                    </div><!--/#topLoginInner-->
                                </div><!--/#topLogin-->

                                <div id="topMenu" style="display: none;">
                                    <div id="topMenuInner">
                                    </div><!--/#topMenuInner-->
                                </div><!--/#topMenu-->

                            </div><!--/#bl_modalTopInner-->
                        </div><!--/#bl_modalTop-->


                        <div id="bl_modalCenter" class="body_bls" style="display:none;">
                            <div id="bl_modalCenterInner">
                                ...
                            </div>
                        </div>


                        <div id="bl_modalBottom" class="body_bls" style="display:none;">
                            <div id="bl_modalBottomInner">
                                ...
                            </div>

                        </div>


                        <div id="bl_modalFull" class="body_bls" style="display:none;">
                            <div id="bl_modalFullInner" class="vyb_trans">
                                ...
                            </div>
                        </div>


                    </div><!--/inner-->
                </div><!--/modcont_body-->

                <footer id="modcont_footer" class="elementos_modales" style="display:none;">
                    <div class="inner">
                        <p>
                            <span class="close" onclick="closeModal(null,true)">&#10005;</span>
                            aki modal content footer
                        </p>
                    </div>
                </footer>

            </div><!--/wr_modcont-->

        </div><!--/myModalContent-->
    </div><!--/myModal-->



    <!-- Contenedor de Toasts - ventanas emergentes -->
    <div id="toast_container"></div>
    <!--/ contenedor de toasts -->



    <script src="js/a_config.js"></script>
    <script src="js/a_app.js"></script>
    <script src="js/a_modal.js"></script>
    <script src="js/a_listen.js"></script>
    <script src="js/a_new.js"></script>
    <script src="js/a_new2.js"></script>
    <script src="js/a_test.js"></script>

</body>

</html>