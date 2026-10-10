//JSDoc de abajo indica: puede devolver promise. 
//esto es para que no me muestere vscode el error en deleteCliente() donde llamo await openModal()
/**
 * @returns {Promise<boolean>|undefined}
 */
function openModal(param = null, headerTitle = null, htmlTrans = null, action = null, modalFadeIn = true, args = null){
    console.log('=== function openModal() ===');
    console.log(`param: ${param} --- headerTitle: ${headerTitle}`); 
    console.log(`args:`, args); 
    
    //Reset
    eid_myModalContent.removeAttribute('class');
    eid_myModalContent.classList.add('modal-content');
    eid_modcont_body.removeAttribute('class');//reset    

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
    });

    eid_bl_modalCenterInner.innerHTML = '';
    eid_bl_modalBottomInner.innerHTML = '';
    eid_bl_modalFullInner.innerHTML = '';
    //reset_spFiltro();

    mySizeModal();//IMPORTANTE!!! ajusta el modal al tamaño de la pantalla
    


    //Tipos de ModalContent
    switch (param) {

        //Меню
        case 'top':
            eid_modcont_body.style.overflow = 'auto';//habilita scroll  
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
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');  
                    eid_h4_text.innerHTML = headerTitle;//'Меню'; 
                    //console.log('aki llamar showLogin()');

                    // eid_topLogin.style.display = 'block';
                    // eid_topMenu.style.display = 'none';

                    //listenLoginFormInput();

                    buildForm();
                    //showLogin(htmlTrans, param);
                    break;

                case 'showMenu':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');  
                    eid_h4_text.innerHTML = headerTitle;//'Меню'; 

                    buildMenu();                   
            
            
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'center':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            //eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '25vh';
            eid_myModalContent.classList.add('modalContentCenter');
            eid_bl_modalCenter.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentCenter .wr_modcont').classList.add('mooved');
            },10);
            

            switch (action) {
            
                case 'showAviso':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, param);//es arr_p_id en este caso
                    break;
                                
                case 'showAviso2'://se introduce objeto HTML (y no elemento.innerHTML como en 'showAviso')
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso2()');
                    //alert('aki showAviso2()');
                    showAviso2(htmlTrans, param);//es arr_p_id en este caso
                    break;

                case 'confirmDelete'://se introduce objeto HTML (y no elemento.innerHTML como en 'showAviso')
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';    
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey'); 
                    
                    return new Promise(resolve => {
                        console.log('aki llamar mostrarConfirm()');
                        mostrarConfirm(htmlTrans, param, resolve);
                    });
                    //break; aki no hace falta break porque hago return de la promise
                                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //pendiente de desarrollo
        case 'bottom':
            eid_h4_text.innerHTML = headerTitle;//'verse Меню';
            //eid_btn_sp_atras.style.display = 'none';//?
            eid_myModal.style.paddingTop = '50vh';
            eid_myModalContent.classList.add('modalContentBottom');
            eid_bl_modalBottom.style.display = 'block';

            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentBottom .wr_modcont').classList.add('mooved');
            },10);

            switch (action) {
                        
                case 'showAviso':
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, param);//es arr_p_id en este caso
                    break;
                
                default:
                    //console.log('indica action en openModal()');
                    break;
            }
            break;

        //Выбор модуля Библии из Избранных
        case 'full':
            //eid_btn_sp_atras.style.display = 'block';
            eid_myModal.style.paddingTop = '0vh';
            eid_myModalContent.classList.add('modalContentFull');
            eid_bl_modalFull.style.display = 'block';
            
            setTimeout(()=>{
                eid_myModalContent.querySelector('.modalContentFull .wr_modcont')?.classList.add('mooved');
            },10);
            
            switch (action) {

                case 'showAviso':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии'; 
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso()');
                    //alert('aki showAviso()');
                    showAviso(htmlTrans, param);//es arr_p_id en este caso
                    break;

                case 'showAviso2'://se introduce objeto HTML (y no elemento.innerHTML como en 'showAviso')
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';    
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    //console.log('aki llamar showAviso2()');
                    //alert('aki showAviso2()');
                    showAviso2(htmlTrans, param);//es arr_p_id en este caso
                    break; 

                case 'confirmDelete'://se introduce objeto HTML (y no elemento.innerHTML como en 'showAviso')
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';    
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey'); 
                    
                    return new Promise(resolve => {
                        console.log('aki llamar mostrarConfirm()');
                        mostrarConfirm(htmlTrans, param, resolve);
                    });
                    break;


                case 'buildAlmacen':
                    eid_h4_text.innerHTML = `
                        <span class="dbtn_fx">
                            <img class="btn_img" src="./images/login2_white.svg">
                            <span>${headerTitle}</span> 
                        </span>
                    `;
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildAlmacen()');
                    let almacen_action = args;
                    console.log('almacen_action:', almacen_action);

                    buildAlmacen(almacen_action);
                    break;


                case 'buildCliente':
                    eid_h4_text.innerHTML = `
                        <span class="dbtn_fx">
                            <img class="btn_img" src="./images/login2_white.svg">
                            <span>${headerTitle}</span> 
                        </span>
                    `;
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildCliente()');
                    // alert('hasta aki...');
                    let cliente_action = args;
                    console.log('cliente_action:', cliente_action);

                    buildCliente(cliente_action);
                    break;


                case 'buildBuscarCliente':
                    eid_h4_text.innerHTML = `
                        <span class="dbtn_fx">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                            <span>${headerTitle}</span> 
                        </span>
                    `;
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildBuscarCliente()');
                    let cliente_action2 = args;
                    console.log('cliente_action2:', cliente_action2);

                    buildBuscarCliente();
                    break;


                case 'buildBuscarAlmacen':
                    eid_h4_text.innerHTML = `
                        <span class="dbtn_fx">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                            <span>${headerTitle}</span> 
                        </span>
                    `;
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildBuscarAlmacen()');
                    let almacen_action2 = args;
                    console.log('almacen_action2:', almacen_action2);

                    buildBuscarAlmacen();
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


// When the user clicks on <span> (x), close the eid_myModal
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


function mySizeModal(){
    console.log('=== function mySizeModal() ===');
    
    let modcont_body_max_h = 
      window.innerHeight 
    - eid_modcont_header.offsetHeight 
    //- (10 * 2)//10 es margin top y bottom de class '.inner'
    ;
    console.log('modcont_body_max_h: ', modcont_body_max_h);    
    eid_modcont_body.style.maxHeight = modcont_body_max_h + 'px';//comento para no duplicat
}


function showAviso(htmlTrans, positionModal){
    console.log('=== showAviso(htmlTrans, param) ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'full'){
        eid_bl_modalFullInner.innerHTML = '';
    }
    
    const p = document.createElement('p');
    p.className = 'p_aviso';
    p.innerHTML = htmlTrans;

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(contenedor_aviso);    
    }else if(positionModal == 'full'){
        eid_bl_modalFullInner.append(contenedor_aviso);
    }

}

function showAviso2(elemento_aviso, positionModal){// elemento_aviso es objeto HTML y no elemento.innerHTML
    console.log('=== showAviso2(elemento_aviso, param) ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'full'){
        eid_bl_modalFullInner.innerHTML = '';
    }
    
    const contenedor_aviso = document.createElement('div');
    contenedor_aviso.className = 'contenedor_aviso';
    contenedor_aviso.append(elemento_aviso);

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(contenedor_aviso);    
    }else if(positionModal == 'full'){
        eid_bl_modalFullInner.append(contenedor_aviso);
    }

}

function mostrarConfirm(htmlTrans, positionModal, resolve){
    console.log('=== mostrarConfirm() ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'full'){
        eid_bl_modalFullInner.innerHTML = '';
    }

    const wr_confirm_aviso = document.createElement('div');
    wr_confirm_aviso.className = 'wr_confirm_aviso';
    wr_confirm_aviso.innerHTML = `
        ${htmlTrans}
        <div class="wr_btns_confirm">
            <button id="btn_cancelar" class="btn btn_big">Cancelar</button>            
            <button id="btn_aceptar" class="btn btn_big">Aceptar</button>            
        </div>
    `;

    wr_confirm_aviso.onclick = (e) => {
        if(e.target.closest('.wr_btns_confirm')){//si el click es en los botones de confirm
            
            if(e.target.id === 'btn_cancelar'){
                console.log('clic en btn_cancelar');
                closeModal(null, true);
                resolve(false);
            }
            else if(e.target.id === 'btn_aceptar'){
                console.log('clic en btn_aceptar');
                closeModal(null, true);
                resolve(true);
            }
        }
    }

    const contenedor_aviso = document.createElement('div');
    contenedor_aviso.className = 'contenedor_aviso';
    contenedor_aviso.append(wr_confirm_aviso);

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(contenedor_aviso);    
    }else if(positionModal == 'full'){
        eid_bl_modalFullInner.append(contenedor_aviso);
    }
    
}

