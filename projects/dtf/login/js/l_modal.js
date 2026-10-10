function old_openModal(
    param = null, //'top', 'center', 'bottom', 'full' 
    headerTitle = null, //lo que se verá en el header del modal. 'Aviso', 'Login' etc...
    htmlTrans = null, //html del contenido. lo que estará en el body del modal.
    action = null, //acción de switch-case: 'buildVerseMenu', 'showAviso', ...
    modalFadeIn = true, 
    showSettings = false, 
    is_click_from_tsk_body = false
){
    //antes
}




function openModal(...args){
    console.log('=== function openModal() ===');

    let config = {};

    //Caso 1: estilo nuevo (objeto)
    if (typeof args[0] === 'object' && args[0] !== null) {
        config = args[0];
    } else {//Caso 2: estilo antiguo (argumentos sueltos)
        const [
            positionModal = null, //'top', 'center', 'bottom', 'full' 
            headerTitle = null, //lo que se verá en el header del modal. 'Aviso', 'Login' etc...
            htmlTrans = null, //html del contenido. lo que estará en el body del modal.
            action = null, //acción de switch-case: 'buildVerseMenu', 'showAviso', ...
            modalFadeIn = true, 
            showSettings = false, 
            is_click_from_tsk_body = false
        ] = args;

        config = {
            positionModal,
            headerTitle,
            htmlTrans,
            action,
            modalFadeIn,
            showSettings,
            is_click_from_tsk_body
        };
    }

    // Destructuring final (con defaults)
    // Saca estas propiedades de config, y si no existen, usa estos valores por defecto
    // si en config no se pasa alguna de estas propiedades, se asignará el valor por defecto especificado después del signo '='
    const {
        positionModal = 'center',
        headerTitle = '',
        htmlTrans = '',
        action = '',
        modalFadeIn = true,
        showSettings = false,
        is_click_from_tsk_body = false
    } = config;


    console.log(`positionModal: ${positionModal} --- headerTitle: ${headerTitle}`); 
    
    //Reset
    eid_myModalContent.removeAttribute('class');
    eid_myModalContent.classList.add('modal-content');
    eid_modcont_body.removeAttribute('class');//reset    
    //eid_modcont_body.removeAttribute('style');//reset    

    if(modalFadeIn){
        eid_myModal.style.display = "block";
        eid_myModal.style.opacity = 0;//start efecto fade
        setTimeout(()=>{
            eid_myModal.style.opacity = 1;//end efecto fade
        },10);
    }else{
        eid_myModal.style.display = "block";
        eid_myModal.style.opacity = 1;//start efecto fade
    }
 
    Array.from(document.querySelectorAll('.body_bls')).forEach((el,i)=>{
        el.style.display = 'none';
        //el.removeAttribute('class');
        //el.classList.add('modal-content');//default
    });

    eid_bl_modalCenterInner.innerHTML = '';
    eid_bl_modalBottomInner.innerHTML = '';
    eid_bl_modalFullInner.innerHTML = '';

    eid_bl_modalFullInner.classList.remove('dragg_margin');//luego si es 'sortTabs' o 'sortModule2()' lo añado... 

    //reset_spFiltro();

    mySizeModal();//IMPORTANTE!!! ajusta el modal al tamaño de la pantalla
    

    // setTimeout(()=>{
    //     mySizeVersesCompare();
    // },500);
        
    //Reset div de filtro en el modal
    //eid_bl_modalFilter.classList.remove('shown');
            // eid_bl_modalFilter_inner.innerHTML = '';
            // clearSpFiltro();//reset boton de mostrar filtro en shapka
            // hideModalFilter();//contiene dentro mySizeModal();

    //Tipos de positionModal de ModalContent
    switch (positionModal) {

        //Меню
        case 'top':
            eid_modcont_body.style.overflowY = 'auto';//habilita scroll  
            eid_modcont_body.classList.add('theme_grey');   
            //eid_h4_text.innerHTML = headerTitle;//'Меню';
            //eid_btn_sp_atras.style.display = 'none'; //mo muestro flecha atras
            eid_myModal.style.paddingTop = '0px';
            eid_myModalContent.classList.add('modalContentTop');
            eid_bl_modalTop.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentTop .wr_modcont').classList.add('mooved');
            },10);

            let eid_topLogin = document.getElementById('topLogin');
            let eid_topMenu = document.getElementById('topMenu');

            switch (action) {
            
                case 'showLogin':
                    eid_h4_text.innerHTML = `
                        <span data-dic="d209">${'Login'}</span>
                    `;//headerTitle;
                    eid_modcont_body.style.overflowY = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');  
                    //console.log('aki llamar showLogin()');

                    buildForm();
                    break;
            
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'center':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '25vh';
            eid_myModalContent.classList.add('modalContentCenter');
            eid_bl_modalCenter.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentCenter .wr_modcont').classList.add('mooved');
            },10);
            

            switch (action) {

                case 'showAviso':
                    eid_modcont_body.style.overflowY = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, positionModal);//es arr_p_id en este caso
                    break;
                                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'bottom':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '50vh';
            eid_myModalContent.classList.add('modalContentBottom');
            eid_bl_modalBottom.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentBottom .wr_modcont').classList.add('mooved');
            },10);

            switch (action) {
                       
                case 'showAviso':
                    eid_modcont_body.style.overflowY = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, positionModal);//es arr_p_id en este caso
                    break;
                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //Выбор модуля Библии из Избранных
        case 'full':
            eid_btn_sp_atras.style.display = 'block';
            eid_myModal.style.paddingTop = '0vh';
            eid_myModalContent.classList.add('modalContentFull');
            eid_bl_modalFull.style.display = 'block';
            
            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentFull .wr_modcont').classList.add('mooved');
            },10);
            
            switch (action) {
                
                case 'showModules':
                    eid_h4_text.innerHTML = headerTitle || `${'Selección de módulo de la Biblia'}`;
                    eid_modcont_body.style.overflowY = 'auto';//habilita scroll 
                    eid_modcont_body.classList.add('theme_grey');   
                    selectModule2(htmlTrans);
                    break;
            
            
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;


        default:
            //console.log('---case default: nada---');
            break;
    }
}


function closeModal(modal_head_text = null, click_fuera_o_x = false) {    
    let actual_h4_text = eid_myModal.querySelector('#h4_text').textContent;
    console.log('actual_h4_text: ',actual_h4_text);
    
    const ecl_mooved = document.querySelector('.mooved');

    if(ecl_mooved){
        let classList_new = Array.from(ecl_mooved.classList).filter(el => el != 'mooved');
        ecl_mooved.className = classList_new.join(' ');
    }

    if(modal_head_text == actual_h4_text || click_fuera_o_x){
        //console.log(`[if]. el titulo es igual. ${modal_head_text} == ${actual_h4_text}. o click_fuera_o_x -> Cierro modal.`);

        eid_myModal.style.opacity = 0;//start efecto fade
        setTimeout(()=>{
            eid_myModal.style.display = "none";
        },400);

    }else{
        //console.log(`[else] --- NO. el titulo no es igual. ${modal_head_text} != ${actual_h4_text}`);
        //no hago nada
    }

}

function buildForm(id_form){
    //console.log('=== function buildLogin() ===');

    eid_bl_modalTopInner.innerHTML = '';//reset        
    // eid_bl_modalFilter_inner.innerHTML = '';//reset
    


    
    const topLogin_form = document.createElement('div');
    topLogin_form.id = 'topLogin';
    topLogin_form.innerHTML = `
        <div id="topLoginInner">
            <div class="login-page">
                <div class="form">
                    <!-- aki contenido -->
                </div>
            </div>
        </div>
    `;
    

    const bl_register_form = document.createElement('div');
    bl_register_form.id = 'bl_register_form';
    bl_register_form.innerHTML = `
        <form class="register-form">
            <h1 data-dic="d177">${'Crear cuenta'}</h1>
            <p class="mensaje" data-dic="d178">${'Al crear la cuenta tendrás acceso a tus ajustes personales.'}</p>
            <input id="reg_username" name="username" type="text" autocomplete="off" placeholder="${'Nombre'}" data-dic="d192_ph" />
            <input id="reg_email" name="email" type="email" autocomplete="username" placeholder="${ 'Email'}" required data-dic="d194_ph" />
            <input id="reg_password" name="password" class="type_password m_bot0" type="password" autocomplete="off" placeholder="${ 'Contraseña'}" data-dic="d193_ph" />
            <label class="ch_lab">
                <input class="ch_mostrar" type="checkbox" onchange="showHidePassword(this)">
                <span class="ch_mostrar_sp" data-dic="d417">${ 'mostrar contraseña'}</span>
            </label>
            <label class="ch_lab cons_lab">
                <input id="ch_consentir" class="ch_consentir" type="checkbox">
                <span class="ch_consentir_sp">
                    <span data-dic="d418">${ 'Acepto la siguiente política de privacidad:'}</span> 
                    <span data-dic="d419">
                        ${'<small>Acepto que el Holy-Songs puede almacenar, procesar y usar mis datos mencionados anteriormente para obtener soporte e información sobre problemas relacionados con Holy-Songs dentro del marco legalmente prescrito. Puedo revocar este consentimiento en cualquier momento con efecto para el futuro.</small>'}
                    </span>
                </span>
            </label>
            <button class="btn_wide" type="button" onclick="crearCuenta()" data-dic="d177">${ 'Crear cuenta'}</button>
            <p class="message"><span data-dic="d179">¿Ya estás registrado?</span> <a href="#" onclick="mostrarLoginForm()" data-dic="d180">${'Entrar'}</a></p>
        </form>
    `;
    bl_register_form.onclick = (e) => {
        //console.log('bl_register_form.onclick');
    }

    const bl_email_form = document.createElement('div');
    bl_email_form.id = 'bl_email_form';
    bl_email_form.innerHTML = `
        <form class="email-form">
            <h1 data-dic="d181">Recuperar contraseña</h1>
            <p class="mensaje" data-dic="d182">Introduce tu correo electrónico para recibir instrucciones sobre cómo establecer una nueva contraseña.</p>
            <input id="rec_email" name="email" type="email" required autocomplete="on" placeholder="Email" data-dic="d194_ph" />
            <button class="btn_wide" type="button" onclick="enviarEmail()" data-dic="d183">Enviar</button>
            <p class="message"><a href="#" onclick="mostrarLoginForm()" data-dic="d184">Iniciar sesión</a></p>
        </form>
    `;
    bl_email_form.onclick = (e) => {
        //console.log('bl_email_form.onclick');
    }

    const bl_change_email_form = document.createElement('div');
    bl_change_email_form.id = 'bl_change_email_form';
    bl_change_email_form.innerHTML = `
        <form class="change-email-form">
            <h1 data-dic="d185">Cambiar contraseña</h1>
            <p class="mensaje" data-dic="d186">Introduce tu correo electrónico actual y las contraseñas, actual y nueva.</p>
            <input id="act_email" name="email" type="email" required autocomplete="on" placeholder="Actual email" data-dic="d195_ph" />
            <input id="act_password" name="password" class="type_password" type="password" autocomplete="on" placeholder="Actual contraseña" data-dic="d196_ph" />
            <input id="new_password" name="password" class="type_password" type="password" autocomplete="off" placeholder="Nueva contraseña" data-dic="d197_ph" />
            <input id="new_password_rep" name="password" class="type_password m_bot0" type="password" autocomplete="off" placeholder="Repite nueva contraseña" data-dic="d198_ph" />
            <label class="ch_lab">
                <input class="ch_mostrar" type="checkbox" onchange="showHidePassword(this)">
                <span class="ch_mostrar_sp" data-dic="d417">mostrar contraseña</span>
            </label>
            <button class="btn_wide" type="button" onclick="enviarChangeEmail()" data-dic="d187">Cambiar</button>
            <p class="message"><a href="#" onclick="mostrarLoginForm()" data-dic="d184">Iniciar sesión</a></p>
        </form>
    `;
    bl_change_email_form.onclick = (e) => {
        //console.log('bl_change_email_form.onclick');
    }


    const bl_login_form = document.createElement('div');
    bl_login_form.id = 'bl_login_form';
    bl_login_form.innerHTML = `
        <form class="login-form">
            <h1 data-dic="d184">Iniciar sesión</h1>
            <p class="mensaje">
                <span data-dic="d188">Tendrás acceso a tus ajustes personales.</span>
            </p>
            <input id="email" name="email" type="email" autocomplete="username" placeholder="Email" data-dic="d194_ph" required />
            <input id="password" name="password" class="type_password m_bot0" type="password" autocomplete="on" placeholder="Contraseña" data-dic="d193_ph" required />
            <label class="ch_lab">
                <input class="ch_mostrar" type="checkbox" onchange="showHidePassword(this)">
                <span class="ch_mostrar_sp" data-dic="d417">mostrar contraseña</span>
            </label>
            <button class="btn_wide" type="button" onclick="iniciarSesion()" data-dic="d184">Iniciar Sesión</button>
            <p class="message">
                <span class="${cl_crear_cuenta}">
                    <span data-dic="d189">¿No estás registrado?</span> <a href="#" onclick="mostrarForm('bl_register_form')" data-dic="d177">Crear cuenta</a>
                </span>
                <br><span data-dic="d190">¿Has olvidado la contraseña?</span> <a href="#" onclick="mostrarForm('bl_email_form')" data-dic="d181">Recuperar contraseña</a>
                <br><span data-dic="d191">¿Quieres cambiar la contraseña?</span> <a href="#" onclick="mostrarForm('bl_change_email_form')" data-dic="d185">Cambiar contraseña</a>
            </p>
        </form>
    `;
    bl_login_form.onclick = (e) => {
        //console.log('bl_login_form.onclick');
    }


    const bl_sesion_iniciada = document.createElement('div');
    bl_sesion_iniciada.id = 'bl_sesion_iniciada';
    bl_sesion_iniciada.innerHTML = `
        <h1>${frase_bienvenida}</h1>
        <p class="mensaje">${mensaje}</p>
        <br>
        <p class="p_svit">
            <img src="../images/dtf_app_logo_kvadrat.png">
        </p>
        <p class="p_cerr_ses">
            <a href="#" class="a_cerr_ses" onclick="cerrarSesion()" data-dic="d153">Cerrar sesión</a>
        </p>

        <div class="${cl_crear_cuenta}" style="border-top: 1px solid grey; margin-top: 15px;">
            <p style="margin-bottom: 0;">Puedes crear cuenta para alguien 
                <br>(Opción temporal) 
                <br>
                <br>
                <button onclick="mostrarForm('bl_register_form')">Crear cuenta para álguien</button>
            </p>
        </div>
    `;
    bl_sesion_iniciada.onclick = (e) => {
        //console.log('bl_sesion_iniciada.onclick');
    }





    if(arrIdForms.includes(id_form)){
        switch (id_form) {
            case 'bl_register_form':
                topLogin_form.querySelector('.form').append(bl_register_form);                
                break;

            case 'bl_email_form':
                topLogin_form.querySelector('.form').append(bl_email_form);                
                break;

            case 'bl_change_email_form':
                topLogin_form.querySelector('.form').append(bl_change_email_form);                
                break;

            case 'bl_login_form':
                topLogin_form.querySelector('.form').append(bl_login_form);                
                break;

            case 'bl_sesion_iniciada':
                topLogin_form.querySelector('.form').append(bl_sesion_iniciada);                
                break;
        
            default:
                topLogin_form.querySelector('.form').append(bl_login_form);//Login               
                break;
        }
    }else{
        if(hay_sesion){
            topLogin_form.querySelector('.form').append(bl_sesion_iniciada);
        }else{
            topLogin_form.querySelector('.form').append(bl_login_form);//Login tambien
        }
    }

    //changeLang(obj_ajustes.lang);//para que se traduzcan los textos de los formularios dinámicos

    eid_bl_modalTopInner.append(topLogin_form);
    
    //console.log('=== function buildLogin() --- END ===');
}