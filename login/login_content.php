<?php
//es: login

    session_start();

    //include __DIR__ . '/../song/php/includes/connect_db.php';
    
    // Autenticar el usuario
    $errores = [];

    if(false /*$_SERVER['REQUEST_METHOD'] === 'POST'*/) {
        //solo para debug
        // echo "<pre>";
        // var_dump($_POST);
        // echo "</pre>";
        echo"<script> console.log(888)<script>";

        // limpiar datos
        $email = strtolower(trim($_POST['email'] ?? ''));
        $password = trim($_POST['password'] ?? '');

        if(!$email) {
            $errores[] = "El correo electrónico es obligatorio";        
        } elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)) {        
            $errores[] = "El email no es válido";
        }
    
        if(!$password) {
            $errores[] = "La contraseña es obligatoria";
        }

        if(empty($errores)) {

            //revisar y validar si el email es correcto
            //comprobar si exuste usuario con el email
            //si existe, obtener su contraseña y compararla con la introducida


            // buscar usuario por email
            $sql = "SELECT id_user, username, email, password FROM users WHERE email = ? LIMIT 1";
            $stmt = $conn->prepare($sql);

            if(!$stmt) {
                die("Error SQL");
            }

            $stmt->bind_param("s", $email);
            $stmt->execute();

            $resultado = $stmt->get_result();


            // comprobar si existe usuario
            if($resultado->num_rows === 1) {

                $usuario = $resultado->fetch_assoc();

                // password hash de la BD
                $password_bd = $usuario['password'];
                //$salt = bin2hex(2000);

                //test
                //$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                //exit("password input [$password] --- hashedPassword: [$hashedPassword]");

                //$password = '123456';
                //echo password_hash('123456', PASSWORD_DEFAULT);
                //exit;

                            // $hash = password_hash($password, PASSWORD_DEFAULT);
                            
                            // echo "hash: " . $hash;
                            
                            // echo '<hr>';
                            
                            // var_dump(password_verify($password, $hash));
                            // echo '<hr>';

                            // var_dump($password_bd);
                            // echo '<hr>';
                            // var_dump(password_verify($password, $password_bd));                
                            // exit;



                // Verificar si la contraseña es correcta
                if(password_verify($password, $password_bd)) {
                    //echo("Contraseña correcta $ password_bd: $password_bd");
                    //exit("Contraseña correcta");

                    // evitar session fixation
                    session_regenerate_id(true);

                    // crear sesión
                    $_SESSION['login'] = true;
                    $_SESSION['id_user'] = $usuario['id_user'];
                    $_SESSION['username'] = $usuario['username'];
                    $_SESSION['email'] = $usuario['email'];
                    // mensaje flash
                    $_SESSION['success'] = 'Inicio de sesión correcto';

                    // Establecer una cookie de autenticación válida por 1 hora
                    //setcookie("authenticated", "true", time() + 3600, "/");//antes
                    // cookie opcional
                    // setcookie(
                    //     "authenticated",
                    //     "true",
                    //     [
                    //         'expires' => time() + 3600,
                    //         'path' => '/',
                    //         'httponly' => true,
                    //         'samesite' => 'Lax'
                    //     ]
                    // );

                    // Redirigir al contenido protegido
                    // header("Location: /home");
                    header("Location: /song");
                    exit;

                } else {
                    //$errores[] = "La contraseña es incorrecta";
                    $errores[] = "Email o contraseña incorrectos";//aunque el mensaje verdadero es "La contraseña es incorrecta", muestro el mensaje genérico para no dar pistas a posibles atacantes
                    // echo("Contraseña incorrecta. $ password_bd: $password_bd");
                    //exit("Contraseña incorrecta.");
                }

            } else {
                //$errores[] = "El usuario no existe";
                $errores[] = "Email o contraseña incorrectos";//aunque el mensaje verdadero es "El usuario no existe", muestro el mensaje genérico para no dar pistas a posibles atacantes
            }

            $stmt->close();
        }    

    }


        //sesion iniciada correctamente
    if(isset($_SESSION['login']) && $_SESSION['login'] === true){

        if(isset($_SESSION['email']) && 
           $_SESSION['email'] === 'sergiokovalchuk@gmail.com' &&
           isset($_GET['crear_cuenta'])
        ){
            //class para mostrar el enlace de crear cuenta
            echo '
                <script>
                    let cl_crear_cuenta = "d-block";       
                </script>
            ';
        }else{
            //no muestro el enlace de crear cuenta
            echo '
                <script>
                    let cl_crear_cuenta = "d-none";       
                </script>
            ';
        }
        

        echo '
            <script>
                let hay_sesion = true;
                let hay_usuario_logueado = true;
                let username = "'.addslashes($_SESSION['username']).'";
                let email = "'.addslashes($_SESSION['email']).'";
                let frase_bienvenida = "¡Bienvenido, ' . addslashes($_SESSION['username']). '!"
                let mensaje = "Sesión iniciada correctamente. Se cargan tus ajustes personales.</span>";
                //alert("username: " + username);        
            </script>
        ';

        if(isset($_SESSION['success'])){
            echo '
                <script>
                    window.addEventListener("DOMContentLoaded", () => {
    
                        showToast(
                            "ok",
                            "'.addslashes($_SESSION['success']).'",
                            2000,
                            "center"
                        );
            
                    });            
                </script>
            ';
            unset($_SESSION['success']);
        }

    
    }else{
        //no hay sesion
        //no muestro el enlace de crear cuenta
        echo '
            <script>
                let hay_sesion = false; 
                let hay_usuario_logueado = false; 
                let frase_bienvenida = "No estás logueado.";
                let mensaje = "Sesión no iniciada.";
                let cl_crear_cuenta = "d-none";
            </script>
        ';
    }

?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="icon" type="image/png" href="../images/sa_icon2.png">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <link id="estilos_slideshow" rel="stylesheet" href="../css/sa_index.css">
    <link rel="stylesheet" href="./css/login.css">
    <link rel="stylesheet" href="./css/login_form.css">
    <!-- <link rel="stylesheet" href="./css/login_resp.css"> -->
    <link rel="stylesheet" href="./css/toast.css">
    <link rel="stylesheet" href="./css/sa_modal.css">
    <style id="style_modcont_body"></style>
</head>

<body data-logout="<?= isset($_GET['logout']) ? 1 : 0 ?>">

    <?php
        $li_active = 'login';
        include __DIR__ . '/../includes/templates/header.php';
    ?>

    <div class="container">

        <div class="wr_block_logo">
            <img class="logo" src="/images/sa_logotipo_big2.png" alt="Logo de Serg-Apps.com">
        </div>


        <div class="wr_block">

            <h1>Autentícate como usuario</h1>

            <div class="wr_links" style="flex-direction: column;">

            <?php if(!empty($errores)): ?>
                <div
                    id="login_errors"
                    data-errors="<?= htmlspecialchars(json_encode($errores), ENT_QUOTES, 'UTF-8') ?>"
                ></div>
            <?php endif; ?>                

                <button id="test" class="btn" onclick="openModal('top',null,null,'showLogin')">Pulsa aquí para iniciar sesión</button>

            </div>

        </div>




    </div><!--/container-->


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




    <?php
    include __DIR__ . '/../includes/templates/footer.php';
    ?>

    <script src="js/var_lang.js"></script>
    <script src="js/get_globals.js"></script>

    <script src="js/l_config.js"></script>
    <script src="js/l_login.js"></script>
    <script src="js/l_modal.js"></script>
    <script src="js/l_listen.js"></script>

</body>

</html>