crear_obj_lang(); // Llamamos a la función para que crea obj_lang

async function crear_obj_lang() {
    obj_lang = await make_obj_lang();
    //console.log(obj_lang);
}

async function make_obj_lang(){
    console.log('=== function make_obj_lang() ===');
    
    try {

        if(!arr_langs.includes(lang)){
            console.error(`No existe este idioma '${lang}' para las traducciones. Creo objeto con lang '${arr_langs[0]}' por defecto`);
            lang = arr_langs[0];
        }            
        
        let obj_lang_f = await fetchDataToJson(`../app/json/idiomas/${lang}.json`);
        //console.log('obj_lang_f:');
        //console.log(obj_lang_f);
        //localStorage.setItem('lang',lang);

        return obj_lang_f;

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('make_obj_lang. error: ',error);
    }    
}

async function fetchDataToJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}



function mostrarForm(id_form){
    //console.log('=== function mostrarForm() ===');
    //console.log(id_form);
    if(arrIdForms.includes(id_form)){
        buildForm(id_form);
    }
}

function mostrarLoginForm(){
    //console.log('=== function mostrarLoginForm() ===');

    //cuando Sesion está cerrada, se muestra Formulario de Inicio de Sesión
    mostrarForm('bl_login_form');

    // eid_bl_login_form.querySelector("h1").textContent = obj_lang.d184;//'Iniciar sesión.';
    // eid_bl_login_form.querySelector(".mensaje").textContent = obj_lang.d188;//'Tendrás acceso a tus ajustes personales.';
}

function showHidePassword(el){
    if(el.checked){
        document.querySelectorAll('.form .type_password').forEach(input => {
            input.type = 'text';
        });
    }else{
        document.querySelectorAll('.form .type_password').forEach(input => {
            input.type = 'password';
        });
    }
}



function showToastLogin(tipo = 'info', mensaje, duration = null, position = 'default', with_head = false, text_head = 'Info', contenedor = null) {//default -> abajo derecha
    //position = 'default'// => abajo derecha
    //position = 'center'// => center y center

    let toast_container;
    let inner_position;

    if(!contenedor){//si no se indica el contenedor, cojo el por defecto
        toast_container = document.getElementById("toast_container");
        toast_container.innerHTML = '';//reset
        inner_position = 'inner_fixed';
    }else{
        toast_container = contenedor;
        contenedor.querySelector('.toast_container_inner')?.remove();
        inner_position = 'inner_absolute';
    }
   

    // eid_toast_container.innerHTML = '';//reset

    // Crear div outer para cubrir toda la pantalla
    const ecl_toast_container_inner = document.createElement('div');
    ecl_toast_container_inner.className = `toast_container_inner ${position} ${inner_position}`;
    ecl_toast_container_inner.onclick = (e) => {
        console.log('toast_close ecl_toast_container_inner. e.currentTarget: ', e.currentTarget);
        console.log('toast_close ecl_toast_container_inner. e.target: ', e.target);
        e.stopPropagation();

        //click en ecl_toast_container_inner pero fuera del toast, para cerrar el toast
        if(!e.target.closest('.toast')){//si el click es fuera del toast
            closeToastWithFade();
        }
    };


    function closeToastWithFade(duration = 10){//por defecto cerrar inmediatamente (10ms)
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => ecl_toast_container_inner.remove(), 1000);
        }, duration);
    }


    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast`;

    if(with_head){
        
        toast.innerHTML = `
            <div class="toast_inner">
                <div class="toast_head">
                    <div>${text_head}</div>
                    <!-- aki btn de cerrar toast -->
                </div>
                <div class="toast_body ${tipo}">
                    <div class="toast_mensaje">${mensaje}</div>
                </div>
            </div>
        `;
    
    }else{//default simple

        toast.innerHTML = `
            <div class="toast_body simple ${tipo}">
                <div class="toast_mensaje">${mensaje}</div>
                <!-- aki btn de cerrar toast -->
            </div>
        `;
    }


    //si no hay duration, muestro btn de cerrar
    if(!duration || duration  <= 1000){
        const ejemplo_btn = '<button class="toast_close" onclick="this.parentElement.remove()">×</button>';

        const toast_close = document.createElement('button');
        toast_close.className = 'toast_close';
        toast_close.textContent = '×';
        toast_close.onclick = (e) => {
            console.log('toast_close clicked. e.currentTarget: ', e.currentTarget);
            closeToastWithFade();
        }

        //añado al toast
        if(with_head){
            toast.querySelector('.toast_head').append(toast_close);
        }else{
            toast.querySelector('.toast_body').append(toast_close);
        }
    }

    //Añado al DOM
    // eid_toast_container.appendChild(toast);
    toast_container.appendChild(ecl_toast_container_inner);
    ecl_toast_container_inner.appendChild(toast);
    

    ecl_toast_container_inner.classList.add('show');

    // Forzar reflow para activar transición
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    if(duration > 1000){
       console.log('hay duration: ', duration);
        // Auto eliminar
        closeToastWithFade(duration);
    }
}


async function iniciarSesion(){//antes login() //username,password
    console.log('=== function iniciarSesion() ===');

    try {
        
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        email = email.toLowerCase();

        let errors = [];
    
        if(email == '' || password == ''){
            errors.push('Ambos campos son obligatorios. Introduce tu email y contraseña.');
        }else{
            if(!validarEmail(email)){
                errors.push('El email no es válido.');
            }
            if(!validarPassword(password)){
                errors.push('La contraseña no es válida. Debe tener al menos 6 carácteres.');
            }        
        }

        
        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += error + '<br>';
            });
            showToastLogin(
                'error',
                error_text,
                null,
                'center',
                true,
                'Error'
            );
            return;
        }

    
        // Enviar los datos al servidor para la autenticación
        const response = await fetch("../app/php/iniciar_sesion_hs.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error iniciar_sesion_hs.php) ${response.status}`);
        }

        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {
                hay_sesion = true;
    
                //Redirect:    
                window.location.href = '../app';
                
                //console.log(`Usuario autentificado con éxito. Sessión creada para el usuario ${username} . Hago redireccion...`);    
                
            } else {
                hay_sesion = false;

                showToastLogin(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en iniciar_sesion_hs.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en iniciar_sesion_hs.php',
                { cause: error }
            );
        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('iniciarSesion. error: ',error);
    }
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);//.test() returns true or false
}

function validarPassword(password) {
    // Al menos 6 caracteres
    const longitud = /^.{6,}$/;

    // Al menos una letra mayúscula
    //const mayuscula = /[A-Z]/;

    // Al menos una letra minúscula
    //const minuscula = /[a-z]/;

    // Al menos un número
    //const numero = /[0-9]/;

    // Al menos un carácter especial
    //const caracterEspecial = /[!@#$%^&*(),.?":{}|<>]/;

    return longitud.test(password) 
        //&& mayuscula.test(password) 
        //&& minuscula.test(password) 
        //&& numero.test(password) 
        //&& caracterEspecial.test(password)
        ;//.test() returns true or false
}

function mySizeModal(){
    //console.log('=== function mySizeModal() ===');

    // if(eid_myModal.style.opacity != '1'){//si está mostrado
    //     //console.log('eid_myModal no está mostrado. no hago nada...');
    //     return;
    // }

    //console.log('eid_myModal está mostrado. recalculo altura...');
    eid_style_modcont_body.innerHTML = '';//reseteo su contenido
    
    let modcont_body_max_h = 
      window.innerHeight 
    - eid_modcont_header.offsetHeight 
    //- (10 * 2)//10 es margin top y bottom de class '.inner'
    ;
    //console.log('modcont_body_max_h: ', modcont_body_max_h);    
    //eid_modcont_body.style.maxHeight = modcont_body_max_h + 'px';//comento para no duplicat

    eid_style_modcont_body.innerHTML = `
        #modcont_body{
            max-height: ${modcont_body_max_h}px;
        }
    `;
}


async function crearCuenta(){
    console.log('=== function crearCuenta() ===');

    try {
        
        //LUEGO LO CONECTO
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `<span>${obj_lang.d315}</span>`;//Si no aceptas cookies no puedes crear una cuenta.
        //     aviso_text += ` <a onclick="showBlockCookies(); closeModal(null,true);">${obj_lang.d316}</a>.`;//Seleccionar Coockies
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        let username = document.getElementById("reg_username").value.trim();
        let password = document.getElementById("reg_password").value.trim();
        let email = document.getElementById("reg_email").value.trim();
        email = email.toLowerCase();
        let ch_consentir = document.getElementById("ch_consentir");
    
        let errors = [];

        if(username == '' || password == '' || email == ''){
            errors.push(obj_lang.d210 || 'Todos los campos son obligatorios. Introduce tu usuario, contraseña y email por favor.');
        }else{
            if(!validarEmail(email)){
                errors.push(obj_lang.d278 || 'El email no es válido.');
            }
            if(!validarPassword(password)){
                errors.push(obj_lang.d279 || 'La contraseña no es válida. Debe tener al menos 6 carácteres.');
            }
            if(!ch_consentir.checked){
                errors.push(obj_lang.d520 || 'Debes aceptar la política de privacidad.');
            }         
        }

        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += error + '<br>';
            });
            showToastLogin(
                'error',
                error_text,
                null,
                'center',
                true,
                'Error'
            );
            return;
        }
    
        // Enviar los datos al servidor para la autenticación
        const response = await fetch("../app/php/crear_cuenta.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                lang: lang 
            })
        });

        const text = await response.text(); // primero texto
        console.log('RAW response:', text);

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error crear_cuenta.php) ${response.status}`);
        }
    
        try {
            const data = JSON.parse(text);
            console.log('data:', data);

            if(data.localhost){
                console.log('verifyLink: ', data.verifyLink); 
                //alert(`verifyLink: ${data.verifyLink}`);//solo en localhost
                setTimeout(()=>{
                    window.open(data.verifyLink, "_blank");
                },5000);
            }
        
            if(data.success){                
                console.log(`Usuario registrado con éxito.`);
    
                //let text_show = reemplazarValores(obj_lang.d211, [username]);//Usuario ${username} se ha registrado con éxito.
                let text_show = obj_lang[data.dic_code];
        
                document.querySelector('#bl_register_form .mensaje').innerHTML = `<span class="clr_gr-een">${text_show}</span>`;
        
                setTimeout(()=>{
                    mostrarLoginForm();
                },3000);
        
                // Redirigir a la página de inicio si la autenticación es exitosa
                //window.location.href = "index.php?auth_ok";  //de momento comento para no hacer la redirección...
            
            } else {
                
                //"Error al registrar el usuario";
                console.error(data.error);
                console.error(data.dic_code);
    
                let error_text;
                let frase2 = obj_lang.d212 || 'Hubo problemas al crear el usuario __VAR__. <br>__VAR__';

                if(data.conn_error){
                    let frase = obj_lang.d238 || 'Error al registrar el usuario: __VAR__';
                    let arr_valores = [data.conn_error];
                    let text_conn_error = reemplazarValores(frase, arr_valores);//con traduccion
                    console.error('text_conn_error:', text_conn_error);

                    let arr_valores2 = [username, text_conn_error];
                    error_text = reemplazarValores(frase2, arr_valores2);//"Hubo problemas al crear el usuario __VAR__. <br>__VAR__" + (php) $conn->error
                    
                }else{
                    let arr_valores2 = [username, obj_lang[data.dic_code]];
                    error_text = reemplazarValores(frase2, arr_valores2);//"Hubo problemas al crear el usuario __VAR__. <br>__VAR__"
                }
        
                document.querySelector('#bl_register_form .mensaje').innerHTML = `<span>${error_text}</span>`;
                document.querySelector('#bl_register_form .mensaje').classList.add('color_red');
            }
        
            //mySizeWindow();

        } catch (error) {
            
            console.error('❌ JSON inválido en crear_cuenta.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en crear_cuenta.php',
                { cause: error }
            );
        }        

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('crearCuenta. error: ',error);
    }
}

async function enviarEmail(){
    console.log('=== function enviarEmail() ===');

    try {
        
        let email = document.getElementById("rec_email").value.trim();
        email = email.toLowerCase();

        let errors = [];

        if(email == ''){
            errors.push('El campo email es obligatorio.');
        }else{
            if(!validarEmail(email)){
                errors.push('El email no es válido.');
            }
        }
        
        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += error + '<br>';
            });
            showToastLogin(
                'error',
                error_text,
                null,
                'center',
                true,
                'Error'
            );
            return;
        }
        
    
        // Enviar los datos al servidor para la autenticación
        const response = await fetch("../app/php/generar_reset_token_hs.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                lang: 'es' //lang
            })
        });    

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error generar_reset_token_hs.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);

            if(data.localhost){
                if(typeof data.resetLink !== 'undefined'){
                    console.log('resetLink: ', data.resetLink);
                    //alert(`resetLink: ${data.resetLink}`);//solo en localhost
                    window.open(data.resetLink, "_blank"); 
                }
            }
    
    
            if (data.success) {
                console.log(`Email enviado con éxito.`);

                // let frase = obj_lang.d214 || 'Email __VAR__ se ha enviado con éxito.';
                // let arr_valores = [email];
                // let text_show = reemplazarValores(frase, arr_valores);    
                
                let text_show = `Email ${email} se ha enviado con éxito.`;//temporal   
                document.querySelector('#bl_email_form .mensaje').innerHTML = `<span class="clr_gr-een">${text_show}</span>`;
        
                setTimeout(()=>{
                    mostrarLoginForm();
                },3000);            
        
                // Redirigir a la página de inicio si la autenticación es exitosa
                //window.location.href = "index.php?auth_ok";  //de momento comento para no hacer la redirección...        
                
            } else {
                console.error('Error al enviar el email');
                console.error('data.error: ', data.error);
                console.error('data.dic_code: ', data.dic_code);
                //console.error(obj_lang[data.dic_code]);//pongo con [] ya que viene  obj_lang['d231']

                // let frase = obj_lang.d215 || 'Hubo problemas al enviar el correo de restauración de contraseña al __VAR__. <br><br>__VAR__';
                // let arr_valores = [email, obj_lang[data.dic_code]];
                // let text_show = reemplazarValores(frase, arr_valores);
                
                let text_show = `Hubo problemas al enviar el correo de restauración de contraseña al ${email}.`;
                document.querySelector('#bl_email_form .mensaje').innerHTML = `<span class="clr_red">${text_show}</span>`;

                showToastLogin(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en generar_reset_token_hs.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en generar_reset_token_hs.php',
                { cause: error }
            );
        }
    
        //mySizeWindow();

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('enviarEmail. error: ',error);
    }
}


async function enviarChangeEmail(){
    //console.log('=== function enviarChangeEmail() ===');

    try {
        
        let email = document.getElementById("act_email").value.trim();
        let password = document.getElementById("act_password").value.trim();
        let new_password = document.getElementById("new_password").value.trim();
        let new_password_rep = document.getElementById("new_password_rep").value.trim();
        email = email.toLowerCase();

        let errors = [];

        if(email == ''){
            errors.push(obj_lang.d213 || 'El campo email es obligatorio.');
        }
        if(password == ''){
            errors.push(obj_lang.d268 || 'El campo contraseña es obligatorio.');
        }
        if(new_password == ''){
            errors.push(obj_lang.d269 || 'El campo nueva contraseña es obligatorio.');
        }
        if(new_password_rep == ''){
            errors.push(obj_lang.d270 || 'El campo repite la contraseña es obligatorio.');
        }
        if(new_password != new_password_rep){
            errors.push(obj_lang.d271 || 'El campo nueva contraseña y su repetición no son iguales.');
        }
        if(!validarEmail(email)){
            errors.push(obj_lang.d278 || 'El email no es válido.');
        }
        if(!validarPassword(password)){
            errors.push(obj_lang.d279 || 'La contraseña no es válida. Debe tener al menos 6 carácteres.');
        }        
        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += error + '<br>';
            });
            const p_mensaje = document.querySelector('.change-email-form .mensaje');
            p_mensaje.classList.add('color_red');
            p_mensaje.innerHTML = error_text;
            return;
        }
    
        // Enviar los datos al servidor para la autenticación
        const response = await fetch("../app/php/update_password.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
                new_password: new_password,
                new_password_rep: new_password_rep,
                lang: 'es' //lang
            })
        });

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error update_password.php) ${response.status}`);
        }

        try {

            const data = JSON.parse(text);
            console.log('data:', data);

            if(data.localhost){
                if(typeof data.linkLogin !== 'undefined'){
                    console.log('linkLogin: ', data.linkLogin);
                    //alert(`linkLogin: ${data.linkLogin}`);//solo en localhost
                    //window.open(data.linkLogin, "_self"); //no hace falta ya que cambie en la misma ventana
                }
            }    
    
    
            if (data.success) {
                //console.log(`Su contraseña ha sido actualizada con éxito.`);
                let frase = obj_lang.d232 || 'La contraseña para el email __VAR__ ha sido actualizada con éxito.';
                let arr_valores = [email];
                let text_show = reemplazarValores(frase, arr_valores);
                
                let text_show2 = '';
                if(data.mail_sent){
                    text_show2 = '<br>' + `${obj_lang.d273 || 'Se te ha enviado un mensaje de este cambio a tu correo electrónico.'}`;
                }
        
                document.querySelector('#bl_change_email_form .mensaje').innerHTML = `<span class="clr_gr-een">${text_show} ${text_show2}</span>`;


                //para evitar que presionen otra vez, quito los elementos del formulario
                document.querySelectorAll('#bl_change_email_form input').forEach(el=>{
                    el.remove();//cada input
                });
                document.querySelector('#bl_change_email_form .ch_lab').remove();//checkbox mostrar contraseña
                document.querySelector('#bl_change_email_form .btn_wide').remove();//botón Cambiar
                
        
                setTimeout(()=>{
                    mostrarLoginForm();
                },3000);            
        
                // Redirigir a la página de inicio si la autenticación es exitosa
                //window.location.href = "index.php?auth_ok";  //de momento comento para no hacer la redirección...      
                
            } else {
                
                console.error('Error al actualizar la contraseña');
                console.error('data.error: ', data.error);
                console.error('data.dic_code: ', data.dic_code);
                console.error(obj_lang[data.dic_code]);//pongo con [] ya que viene  obj_lang['d231']
    
                let text_show = obj_lang.d267 || 'Error al actualizar la contraseña';
                let text_show2 = obj_lang[data.dic_code];
        
                document.querySelector('#bl_change_email_form .mensaje').innerHTML = `<span class="clr_red">${text_show} <br>${text_show2}</span>`;                
               
                showToastLogin(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en update_password.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en update_password.php',
                { cause: error }
            );
        }
    
        //mySizeWindow();

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('enviarChangeEmail. error: ',error);
    }
}


async function cerrarSesion(){
    console.log('=== function cerrarSession() ===');

    window.location.href = '../logout';   
}


function reemplazarValores(frase, arr_valores) {
    // uso
    // let frase = obj_lang.d238 || 'Error al registrar el usuario: __VAR__';
    // let arr_valores = [data.conn_error];
    // let aviso_text = reemplazarValores(frase, arr_valores);//con traduccion

    //let frase = 'Usuario __VAR__ se ha registrado y usuario2 __VAR__ no.';
    //let arr_valores = ['Sergio', 'Pedro'];
    // let aviso_text = reemplazarValores(frase, arr_valores);//con traduccion

    if(arr_valores && arr_valores.length > 0){
        arr_valores.forEach(valor => {
            // Reemplaza la primera ocurrencia de __VAR__ con el valor actual
            frase = frase.replace('__VAR__', valor);
        });
    }
    return frase;
}