crear_obj_lang(); // Llamamos a la función para que crea obj_lang

//llamo listener al input de campos
listenResetPwdFormInput();

async function crear_obj_lang() {
    obj_lang = await make_obj_lang();
    //console.log(obj_lang);

    //llamo funcion de pintar la traduccion
    pintLang();
}

async function make_obj_lang(){
    //console.log('=== function make_obj_lang() ===');
    
    try {

        if(!arr_langs.includes(lang)){
            console.error(`No existe este idioma '${lang}' para las traducciones. Creo objeto con lang '${arr_langs[0]}' por defecto`);
            lang = arr_langs[0];
        }            
        
        let obj_lang_f = await fetchDataToJson(`/song/json/idiomas/${lang}.json`);
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


function pintLang(){
    document.querySelectorAll('[data-dic]').forEach(element => {
        const dic = element.dataset.dic;

        if(dic.startsWith('d') && dic.length > 1){            

            if(typeof obj_lang[dic] !== 'undefined'){
                //console.log(` dic válido --- ${dic} => ${obj_lang[dic]}`);

                if(dic.includes('_')){
                    dic_place = dic.split('_')[1];//title
                    //console.log(`[if] --- dic_place: ${dic_place} --- ${dic} => ${obj_lang[dic]}`);

                    switch (dic_place) {
                        case 't'://title
                            element.title = obj_lang[dic];
                            break;
                    
                        case 'ph'://placeholder
                            element.placeholder = obj_lang[dic];
                            break;

                        case 'lab'://label
                            element.label = obj_lang[dic];
                            break;
                    
                        case 'ttip'://tooltip
                            element.dataset.tooltip = obj_lang[dic];
                            break;
                    
                        default:
                            console.error(`El valor '${dic}' en el atributo data-dic="${dic}" no se encuentra en el objeto de idiomas 'obj_lang'. Revisar ${lang}.json o el attributo data-dic="${dic}"`);
                            //console.log(element);
                            break;
                    }
                    
                }else{
                    element.innerHTML = obj_lang[dic];//para que se vean bien los elementos html! <br>, <span>, etc. 
                    //console.log(`[else] --- textContent --- ${dic} => ${obj_lang[dic]}`);
                }

            }else{
                //console.log(` dic inválido --- ${dic} => ${obj_lang[dic]} --- NO HAGO NADA`);
            }

        }//end
    });
}

function listenResetPwdFormInput(){
    document.querySelectorAll('.reset-pwd-form input').forEach(el =>{    
        el.oninput = () =>{
            //console.log(el.value);
            const p_mensaje = document.querySelector('.reset-pwd-form .mensaje');
            if(p_mensaje.classList.contains('color_red')){
                p_mensaje.classList.remove('color_red');
                p_mensaje.innerHTML = obj_lang.d277;//Introduce tu contraseña nueva.
            }
        }
    });
}


async function saveNewPassword(){
    //console.log('=== function saveNewPassword() ===');

    try {

        let email = document.getElementById("email").value.trim();
        let token = document.getElementById("token").value;
        let password = document.getElementById("password").value.trim();
        let password_rep = document.getElementById("password_rep").value.trim();
        email = email.toLowerCase();
    
        let errors = [];

        if(password == '' || password_rep == ''){
            errors.push(obj_lang.d274);//Los dos campos de contraseña son obligatorios.
        }
        if(password != '' && password_rep != '' && password != password_rep){
            errors.push(obj_lang.d275);//Las contraseñas introducidas no son iguales.
        }
        if(email == '' || token == ''){
            errors.push(obj_lang.d276);//El enlace está dañado. Haz click en el enlace enviado a tu email.
        }
        if(!validarEmail(email)){
            errors.push(obj_lang.d278);//El email no es válido.
        }
        if(!validarPassword(password)){
            errors.push(obj_lang.d279);//La contraseña no es válida. Debe tener al menos 6 carácteres.
        }
        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += error + '<br>';
            });
            const p_mensaje = document.querySelector('.reset-pwd-form .mensaje');
            p_mensaje.classList.add('color_red');
            p_mensaje.innerHTML = error_text;
            return;
        }

        const response = await fetch('../song/php/reset_password_form_action.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                token: token,
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
            throw new Error(`HTTP (error reset_password_form_action.php) ${response.status}`);
        }


        try {

            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {
                //console.log(`Su contraseña ha sido actualizada con éxito.`);
                let frase = obj_lang.d232 || 'La contraseña para el email __VAR__ ha sido actualizada con éxito.';
                let arr_valores = [email];
                let text_show = reemplazarValores(frase, arr_valores);
                
                let text_show2 = '';
                if(data.mail_sent){
                    text_show2 = '<br>' + `${obj_lang.d273 || 'Se te ha enviado un mensaje de este cambio a tu correo electrónico.'}`;
                }
        
                document.querySelector('#bl_reset_pwd_form .mensaje').innerHTML = `<span class="clr_gr-een">${text_show} ${text_show2}</span>`;


                //para evitar que presionen otra vez, quito los elementos del formulario
                document.querySelectorAll('#bl_reset_pwd_form input').forEach(el=>{
                    el.remove();//cada input
                });
                document.querySelector('#bl_reset_pwd_form .ch_lab').remove();//checkbox mostrar contraseña
                document.querySelector('#bl_reset_pwd_form .btn_wide').remove();//botón Cambiar
                
        
                setTimeout(()=>{
                    // Redirigir a la página de inicio si cambio de contraseña es exitoso
                    window.location.href = "/login";
                },3000);            
        
                
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

    } catch (error) {
        console.error('Error en la función saveNewPassword: Error: ', error);
    }
}


function showHidePassword(el){
    if(el.checked){
        el.parentElement.parentElement.parentElement.querySelectorAll('.type_password').forEach(input => {
            input.type = 'text';
        });
    }else{
        el.parentElement.parentElement.parentElement.querySelectorAll('.type_password').forEach(input => {
            input.type = 'password';
        });
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