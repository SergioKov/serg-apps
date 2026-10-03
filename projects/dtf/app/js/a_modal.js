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
                    console.log('aki llamar buildCliente()');
                    let cliente_action2 = args;
                    console.log('cliente_action2:', cliente_action2);

                    buildBuscarCliente();
                    break;





                case 'buildFormCancion':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildFormCancion()');
                    // alert('hasta aki...');
                    let contenedor = eid_bl_modalFullInner;//solo aki
                    let cancion_action = args;
                    console.log('contenedor:', contenedor);
                    console.log('cancion_action:', cancion_action);

                    buildFormCancion(contenedor, cancion_action);
                    break;

                case 'buildFormEjemplo':
                    eid_h4_text.innerHTML = `${headerTitle} `;//'Избранныe модули Библии';
                    eid_modcont_body.style.overflow = 'auto';//habilita scroll
                    eid_modcont_body.classList.add('theme_grey');   
                    console.log('aki llamar buildFormCancion()');
                    // alert('hasta aki...');
                    let contenedor_ejemplo = eid_bl_modalFullInner;//solo aki
                    let lang_ejemplo = args;
                    console.log('contenedor_ejemplo:', contenedor_ejemplo);
                    console.log('lang_ejemplo:', lang_ejemplo);

                    buildFormEjemplo(contenedor_ejemplo, lang_ejemplo);
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



function buildTest(){//NO SE USA
    console.log('=== function buildTest() ===');

    eid_bl_modalFullInner.innerHTML = '';//reset

    const ejemplo_html = `
    
        <div class="wr_show">
            <div class="show_song_head">
                <button class="btn">Nueva canción</button>
                <button class="btn">Editar canción</button>
                <button class="btn">Eliminar canción</button>
                <button class="btn">Crear esquema</button>
            </div>
        </div>      
    `;

    const d_ejemplo = document.createElement('div');
    d_ejemplo.innerHTML = ejemplo_html;

    //eid_bl_modalFullInner.append(p);
    eid_bl_modalFullInner.append(d_ejemplo);
}


function buildEsquema(){//NO SE USA
    console.log('=== function buildEsquema() ===');

    eid_bl_modalFullInner.innerHTML = '';//reset

    const ejemplo_html = `
    
        <div class="wr_show">
            <div class="show_song_head">
                zxcvzxc
            </div>
            <div class="show_song_body">
                <p>algo...</p>                
            </div>
        </div>      
    `;

    const d_ejemplo = document.createElement('div');
    d_ejemplo.innerHTML = ejemplo_html;

    //eid_bl_modalFullInner.append(p);
    eid_bl_modalFullInner.append(d_ejemplo);
}












function buildFormCancion(contenedor, cancion_action = null){
    console.log('=== function buildFormCancion() ===');

    console.log('cancion_action: ', cancion_action);
    console.log('objSong: ', objSong);

    if(!contenedor){
        alert('no hay contenedor, hago return...');
        return;
    }

    let id_vstavka = '';
    if(contenedor.id == 'bl_modalFullInner'){
        id_vstavka = 'mod_';
    }


    //eid_bl_modalFullInner.innerHTML = '';//reset
    contenedor.innerHTML = '';//reset

    let mensaje_html = '';
    //let contenedor;//general. se asigna luego

    if(cancion_action !== 'nueva'){
        if(!hay_id_song('buildFormCancion()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ninguna canción.</p>
                <p class="p_aviso">Busca una canción introduciendo el texto en la pestaña <b>Buscar</b>.</p>
                <button class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('Buscar');">Buscar</button>
            `;
            openModal('center','Aviso Canción',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_lista
        }
    }
  

    //Botones ELIMINAR - FORMULARIO
    const wr_btns_eliminar = document.createElement('div');
    wr_btns_eliminar.className = 'wr_btns_eliminar';
    wr_btns_eliminar.innerHTML = `
        <button class="btn btn_big btn_eliminar" onclick="deleteSong(event, '${contenedor.id}');">Eliminar Canción DEFINITIVAMENTE</button>
    `;

    
    //Boton REVISAR - FORMULARIO
    const wr_revisar_y_guardar = document.createElement('div');
    wr_revisar_y_guardar.className = 'wr_btns_form wr_revisar_y_guardar';
    wr_revisar_y_guardar.innerHTML = `
        <button id="btn_GuardarFormRevisar" class="btn btn_big w_100" onclick="guardarSong(event, '${contenedor.id}','${cancion_action}', revisar = true);">Revisar</button>
    `;

    //Botones GUARDAR - FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarSong(event, '${contenedor.id}','${cancion_action}');">Guardar</button>
    `;

    //si no hay creado el boton de fullscreen izdo
    if(!block_cancion.querySelector('.bl_parte_l .wr_dbtn_fullscreen')){
        //Botón FULLSCREEN - FORMULARIO
        const wr_dbtn_fullscreen = document.createElement('div');
        wr_dbtn_fullscreen.className = 'wr_dbtn_fullscreen';
        wr_dbtn_fullscreen.innerHTML = `
            <div class="dbtn_fullscreen">
                <img src="/song/images/fullscreen.png">
            </div>
        `;
        wr_dbtn_fullscreen.onclick = (e)=> {
            //e.stopPropagation();
            if(e.target.closest('.dbtn_fullscreen')){
                btnFullscreenActive = e.target.closest('.dbtn_fullscreen');
                console.log('1. btnFullscreenActive: ', btnFullscreenActive);
                toggleFullscreen('#block_cancion .bloques_outer', btnFullscreenActive);
            }
        }
    
        cancion_song_bloques.parentElement.prepend(wr_dbtn_fullscreen);
    }



    //FORMULARIO
    const form_cancion = document.createElement('div');
    //form_cancion.id = 'form_cancion';
    form_cancion.className = 'form_cancion';
    form_cancion.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje"></p>



                <!-- Título -->
                <div class="form_group wr_detalles">
                    <div class="wr_detalles_head" onclick="hideShowBlock('title_detalles');">
                        Título (detalles)
                    </div>                
                
                    <div id="title_detalles" class="wr_detalles_body" style="display: ${display_title_detalles};">
                        
                        <div class="form_group wr_input_general">
                            <div class="d_limpiar_input" onclick="limpiarInput('#${id_vstavka}nombre')">
                                <img src="images/x_white.png">
                            </div>
                            <input id="${id_vstavka}nombre" name="nombre" type="text" required="" placeholder=" " value="">
                            <label for="${id_vstavka}nombre">Título de la canción (o su primera frase)</label>
                        </div>

                        <div class="form_group wr_title2">
                            <div class="d_limpiar_input" onclick="limpiarInput('#${id_vstavka}title2')">
                                <img src="images/x_white.png">
                            </div>
                            <input id="${id_vstavka}title2" name="title2" type="text" required="" placeholder=" ">
                            <label for="${id_vstavka}title2">Coro u otro texto de la canción</label>
                        </div>

                        <div class="form_group wr_title_note">
                            <div class="d_limpiar_input" onclick="limpiarInput('#${id_vstavka}title_note')">
                                <img src="images/x_white.png">
                            </div>
                            <input id="${id_vstavka}title_note" name="title_note" type="text" required="" placeholder=" ">
                            <label for="${id_vstavka}title_note">Cantante, variante o nota al título</label>
                        </div>

                    </div><!--/#title_detalles-->
                </div><!--/#wr_detalles-->
                <!-- /Título -->


                <!-- Detalles de la canción -->
                <div class="form_group wr_detalles">
                    <div class="wr_detalles_head" onclick="hideShowBlock('form_detalles');">
                        Detalles de la canción
                    </div>

                    <div id="form_detalles" class="wr_detalles_body" style="display: ${display_form_detalles};">

                        <div class="wr_sel_category select_container">
                            <select id="${id_vstavka}category" name="category" class="sel_opt" required="">
                                <option value="" disabled selected hidden></option>
                                <option value="1">1. Наприкінці церковного зібрання</option>
                                <option value="2">2. На рукопокладення</option>
                                <option value="3">3. Хрещення</option>
                                <option value="4">4. Перед церковним зібранням</option>
                                <option value="5">5. Біблійні історії</option>
                                <option value="6">6. Заклик до покаяння</option>
                                <option value="7">7. Діти та сім'я</option>
                                <option value="8">8. Християнська радість</option>
                                <option value="9">9. Різдво</option>
                                <option value="10">10. Церква</option>
                                <option value="11">11. Утіха та підбадьорення</option>
                                <option value="12">12. Рішучість і вірність</option>
                                <option value="13">13. Слідування за Христом</option>
                                <option value="14">14. Для новонавернених</option>
                                <option value="15">15. Похорон</option>
                                <option value="16">16. Бог, Його любов і велич</option>
                                <option value="17">17. Євангеліє</option>
                                <option value="18">18. Жнива</option>
                                <option value="19">19. Небесне житло</option>
                                <option value="20">20. Святий Дух</option>
                                <option value="21">21. Настанови та самоперевірка</option>
                                <option value="22">22. Ісус Христос</option>
                                <option value="23">23. Шлях віри, віра і надія</option>
                                <option value="24">24. Останні дні</option>
                                <option value="25">25. Любов</option>
                                <option value="26">26. Мама</option>
                                <option value="27">27. Новий рік</option>
                                <option value="28">28. Вечеря Господня</option>
                                <option value="29">29. Різне</option>
                                <option value="30">30. Практичне життя з Богом</option>
                                <option value="31" selected>31. Хвала і подяка</option>
                                <option value="32">32. Молитва</option>
                                <option value="33">33. Спасіння</option>
                                <option value="34">34. Духовна боротьба і перемога</option>
                                <option value="35">35. Страждання і смерть Христа</option>
                                <option value="36">36. Захід / Схід сонця</option>
                                <option value="37">37. Воскресіння Христа</option>
                                <option value="38">38. Слово Боже</option>
                                <option value="39">39. Заклик до праці</option>
                                <option value="40">40. Друге пришестя Христа і суд</option>
                                <option value="41">41. Час</option>
                                <option value="42">42. Різні християнські свята</option>
                                <option value="43">43. Весілля</option>
                                <option value="44">44. Привітання та прощання</option>
                                <option value="45">45. Молодь</option>
                                <option value="46">46. Інструментальна</option>
                                <option value="47">47. Колискові</option>
                                <option value="48">48. Дитячі</option>
                                <option value="49">49. Табірні</option>
                                <option value="50">50. Зцілення</option>
                                <option value="51">51. Прощення</option>
                                <option value="52">52. В’їзд до Єрусалима</option>
                                <option value="53">53. Вознесіння Господнє</option>
                                <option value="54">54. Пасхальні</option>
                                <option value="55">55. Трійця</option>
                            </select>
                            <label for="${id_vstavka}category">Category</label>
                        </div>


                        <div class="wr_sel_category select_container">
                            <select id="${id_vstavka}songbook" name="songbook" class="sel_opt" required="">
                                <!-- se pintan los songbook aki desde bd -->
                            </select>
                            <label for="${id_vstavka}songbook">Пісенник (Збірник пісень)</label>
                        </div>




                        <div class="wr_group">

                            <div class="form_group wr_id_song">
                                <input id="${id_vstavka}id_song" name="id_song" class="inpt_id_song" type="number" required="" placeholder=" ">
                                <label for="${id_vstavka}id_song">Id</label>
                            </div>

                            <div class="form_group wr_song_number">
                                <input id="${id_vstavka}song_number" name="song_number" type="number" maxlength="6" pattern="\d*" inputmode="numeric" required placeholder=" ">
                                <label for="${id_vstavka}song_number">Número</label>
                            </div>

                            <div class="form_group wr_lang">
                                <select id="${id_vstavka}lang" name="lang" class="sel_opt" required="">
                                    <option value="" disabled selected hidden></option>
                                    <option value="ua" selected>Українська</option>
                                    <option value="ru">Русский</option>
                                    <option value="es">Español</option>
                                    <option value="en">English</option>
                                </select>
                                <label for="${id_vstavka}lang">Idioma</label>
                            </div>

                            <div class="form_group wr_tipo_fuente">
                                <select id="${id_vstavka}tipo_fuente" name="tipo_fuente" class="sel_opt" required="">
                                    <option value="" disabled selected hidden></option>
                                    <option value="a" selected>Normal - (Arial)</option>
                                    <option value="m">Monospace - (espacios iguales a letras)</option>
                                </select>
                                <label for="${id_vstavka}lang">Tipo Fuente</label>
                            </div>

                        </div>
                    




                        <div class="wr_group">

                            <div class="form_group wr_tune select_container">
                                <select id="${id_vstavka}tune" name="tune" class="sel_opt" required="">
                                    <option value="" disabled selected hidden></option>

                                    <option></option><!--tonalidad sin asignar-->

                                    <option>C</option>
                                    <option>Cm</option>
                                    <option>C#</option>
                                    <option>C#m</option>
                                        <option disabled></option>
                                    <option>Db</option>
                                    <option>Dbm</option>
                                    <option>D</option>
                                    <option>Dm</option>
                                    <option>D#</option>
                                    <option>D#m</option>
                                        <option disabled></option>
                                    <option>Eb</option>
                                    <option>Ebm</option>
                                    <option>E</option>
                                    <option>Em</option>
                                        <option disabled></option>
                                    <option>F</option>
                                    <option>Fm</option>
                                    <option>F#</option>
                                    <option>F#m</option>
                                        <option disabled></option>
                                    <option>Gb</option>
                                    <option>Gbm</option>
                                    <option>G</option>
                                    <option>Gm</option>
                                    <option>G#</option>
                                    <option>G#m</option>
                                        <option disabled></option>
                                    <option>Ab</option>
                                    <option>Abm</option>
                                    <option>A</option>
                                    <option>Am</option>
                                    <option>A#</option>
                                    <option>A#m</option>
                                        <option disabled></option>
                                    <option>Bb</option>
                                    <option>Bbm</option>
                                        <option disabled></option>
                                    <option>H</option>
                                    <option>Hm</option>
                                </select>
                                <label for="${id_vstavka}tune">Tonalidad</label>
                            </div>
                            
                            <!--
                            <div class="form_group wr_tipo_acorde d-none">
                                <select id="${id_vstavka}tipo_acorde" name="tipo_acorde" class="sel_opt" required="">
                                    <option value="" disabled selected hidden></option>
                                    <option selected>#</option>
                                    <option>b</option>
                                </select>
                                <label for="${id_vstavka}tipo_acorde">Tipo Acorde</label>
                            </div> 
                            -->
                            
                            <div class="form_group wr_tipo_acorde" style="display: block;">
                                <label class="${id_vstavka} lab_di_bem">Tipo Acorde</label>
                                <div id="d_tipo_acorde" class="wr_di_bem aj_general">
                                    <div class="dbtn" data-value="#">#</div>
                                    <div class="dbtn" data-value="b">b</div>
                                </div>
                                <input id="tipo_acorde_hidden" type="hidden" name="tipo_acorde" value=""> 
                            </div>

                            <div class="form_group wr_tune_transpose select_container">
                                <select id="${id_vstavka}tune_transpose" name="tune_transpose" class="sel_opt aj_general" required="">
                                    <option value="" disabled selected hidden></option>
                                    
                                    <option>+12</option>
                                    <option>+11</option>
                                    <option>+10</option>
                                    <option>+9</option>
                                    <option>+8</option>
                                    <option>+7</option>
                                    <option>+6</option>
                                    <option>+5</option>
                                    <option>+4</option>
                                    <option>+3</option>
                                    <option>+2</option>
                                    <option>+1</option>
                                    
                                    <option selected>0</option>
                                    
                                    <option>-1</option>
                                    <option>-2</option>
                                    <option>-3</option>
                                    <option>-4</option>
                                    <option>-5</option>
                                    <option>-6</option>
                                    <option>-7</option>
                                    <option>-8</option>
                                    <option>-9</option>
                                    <option>-10</option>
                                    <option>-11</option>
                                    <option>-12</option>
                                    
                                </select>
                                <label for="${id_vstavka}tune_transpose">Transpose</label>
                            </div>

                            <div class="form_group wr_tempo_bpm">
                                <input id="${id_vstavka}tempo_bpm" class="aj_general" name="tempo_bpm" type="number" maxlength="3" pattern="\d*" inputmode="numeric" required placeholder=" " value="0">
                                <label for="${id_vstavka}tempo_bpm">Tempo (BPM)</label>
                            </div>

                        </div>

                        <div class="form_group wr_url_youtube">
                            <div class="d_limpiar_input" onclick="limpiarInput('#${id_vstavka}url_youtube')">
                                <img src="images/x_white.png">
                            </div>
                            <div class="d_go_to_link" onclick="goToLinkById('${id_vstavka}url_youtube')">
                                <img src="images/link_white.png">
                            </div>
                            <input id="${id_vstavka}url_youtube" class="pad_2_btms" name="url_youtube" type="text" required="" placeholder=" ">
                            <label for="${id_vstavka}url_youtube">Enlace de vídeo de YouTube</label>
                        </div>

                        <div id="d_ajustes_pers" onclick="toggle_ajustes_pers()">
                            <span>---Habilitar ajustes personalizados---</span>
                        </div>

                    </div>
                </div><!-- /Detalles de la canción -->
            




                <!-- Ajustes personalizados -->
                <div id="wr_form_detalles_pers" class="form_group wr_detalles">
                    <div id="head_pers_shapka" class="wr_detalles_head head_pers" onclick="hideShowBlock('form_detalles_pers');">
                        Ajustes personalizados
                    </div>

                    <div id="form_detalles_pers" class="wr_detalles_body body_pers" style="display: ${display_form_detalles_pers};">

                        <div class="wr_group">

                            <div class="form_group wr_tipo_acorde" style="display: block;">
                                <label class="${id_vstavka} lab_di_bem">Tipo Acorde (Usuario)</label>
                                <div id="d_tipo_acorde_pers" class="wr_di_bem aj_pers">
                                    <div class="dbtn" data-value="#">#</div>
                                    <div class="dbtn" data-value="b">b</div>
                                </div>
                                <input id="tipo_acorde_pers_hidden" type="hidden" name="tipo_acorde_pers" value=""> 
                            </div>


                            <div class="form_group wr_tune_transpose_pers select_container">
                                <select id="${id_vstavka}tune_transpose_pers" name="tune_transpose_pers" class="sel_opt aj_pers" required="">
                                    <option value="" disabled selected hidden></option>
                                    
                                    <option>+12</option>
                                    <option>+11</option>
                                    <option>+10</option>
                                    <option>+9</option>
                                    <option>+8</option>
                                    <option>+7</option>
                                    <option>+6</option>
                                    <option>+5</option>
                                    <option>+4</option>
                                    <option>+3</option>
                                    <option>+2</option>
                                    <option>+1</option>
                                    
                                    <option selected>0</option>
                                    
                                    <option>-1</option>
                                    <option>-2</option>
                                    <option>-3</option>
                                    <option>-4</option>
                                    <option>-5</option>
                                    <option>-6</option>
                                    <option>-7</option>
                                    <option>-8</option>
                                    <option>-9</option>
                                    <option>-10</option>
                                    <option>-11</option>
                                    <option>-12</option>
                                    
                                </select>
                                <label for="${id_vstavka}tune_transpose_pers">Transpose (Usuario)</label>
                            </div>



                            <div class="form_group wr_capo_pers select_container">
                                <select id="${id_vstavka}capo_pers" name="capo_pers" class="sel_opt aj_pers" required="">
                                    <option value="" disabled selected hidden></option>
                                    
                                    <option>+12</option>
                                    <option>+11</option>
                                    <option>+10</option>
                                    <option>+9</option>
                                    <option>+8</option>
                                    <option>+7</option>
                                    <option>+6</option>
                                    <option>+5</option>
                                    <option>+4</option>
                                    <option>+3</option>
                                    <option>+2</option>
                                    <option>+1</option>
                                    
                                    <option selected>0</option>
                                                                        
                                </select>
                                <label for="${id_vstavka}capo_pers">Capo (Usuario)</label>
                            </div>

                            <div class="form_group wr_tempo_bpm_pers">
                                <input id="${id_vstavka}tempo_bpm_pers" class="aj_pers" name="tempo_bpm_pers" type="number" maxlength="3" pattern="\d*" inputmode="numeric" required placeholder=" " value="0">
                                <label for="${id_vstavka}tempo_bpm_pers">Tempo (BPM) (Usuario)</label>
                            </div>

                            
        
                        </div><!-- /.wr_group -->


                        <!-- Notas personalizadas --> 
                        <div class="form_group form_group_last">
                            <textarea id="${id_vstavka}notes_pers" name="notes_pers" rows="3" required="" placeholder=" "></textarea>
                            <label for="${id_vstavka}notes_pers" class="lab_textarea">Notas personalizadas del Usuario</label>
                        </div>

                    </div>
                </div>
                <!-- /Ajustes personalizados -->





                <div class="form_group">
                    <textarea id="${id_vstavka}song_text" name="song_text" rows="25" required="" placeholder=" "></textarea>
                    <label for="${id_vstavka}song_text" class="lab_textarea">Texto de la canción</label>
                </div>
                
                <!-- Esquema -->
                <div class="d_esquema_titulos parte_lista"></div>

                <div class="form_group wr_url_recurso">
                    <div class="d_limpiar_input" onclick="limpiarInput('#${id_vstavka}url_recurso')">
                        <img src="images/x_white.png">
                    </div>
                    <div class="d_go_to_link" onclick="goToLinkById('${id_vstavka}url_recurso')">
                        <img src="images/link_white.png">
                    </div>

                    <input id="${id_vstavka}url_recurso" class="pad_2_btms" name="url_recurso" type="text" required="" placeholder=" ">
                    <label for="${id_vstavka}url_recurso">Enlace de recurso (Ej.: https://holychords.pro/1275)</label>
                </div>

                <div class="form_group">
                    <textarea id="${id_vstavka}notes" name="notes" rows="7" required="" placeholder=" "></textarea>
                    <label for="${id_vstavka}notes" class="lab_textarea">Notas (apuntes generales a la canción)</label>
                </div>

            </form>
        </div>     
    `;


    

    const form = form_cancion.querySelector('form');
    //form.prepend(wr_dbtn_fullscreen);

    const eid_d_tipo_acorde = form.querySelector('#d_tipo_acorde');
    const eid_d_tipo_acorde_pers = form.querySelector('#d_tipo_acorde_pers');


    switch (cancion_action) {
        case 'nueva'://Nueva lista
            mensaje_html = `
                <span>Canción <b class="c_blue">NUEVA</b>.</span>
            `;
            id_song = null;
            form_cancion.querySelector('.mensaje').innerHTML = mensaje_html;

            form.reset();//reseteo formulario

            form.elements["id_song"].disabled = true;//deshabilito input id_song   
            form.querySelector('.wr_id_song').style.display = 'none';//oculto el wr_id_song
            requestAnimationFrame(() => {
                hideShowBlock('title_detalles', 'hide');
                hideShowBlock('form_detalles', 'hide');
                ajustes_pers = 0;
                ocultar_ajustes_pers();
                hideShowBlock('form_detalles_pers', 'hide');
                form.elements["song_text"].focus();//pongo cursor en textarea 
            });
            
            pintSongbooksOptions(form.elements['songbook']);           
            break;
                    
        default:
        case 'ver'://Ver Cancion - FORMULARIO
        case 'editar'://Editar Cancion - FORMULARIO
        case 'eliminar'://Eliminar Cancion - FORMULARIO
            mensaje_html = `
                <span class="sp_id">
                    <span>Id: <b class="c_green">${id_song}</b></span>
                    <span><b class="actual">(ACTUAL)</b></span>
                </span>
            `;
            form.querySelector('.mensaje').innerHTML = mensaje_html;

            pintSongbooksOptions(form.elements['songbook']);   
            
            // cancion_song_bloques.querySelector('.puntos_def').style.display = 'none';//oculto '...'
            // cancion_form_container.style.display = 'block';//mostrar formulario de canción

            form.reset();//reseteo formulario    
            
            form.elements['title'].value = objSong.title || '';
            form.elements['title2'].value = objSong.title2 || '';
            form.elements['title_note'].value = objSong.title_note || '';
            form.elements['category'].value = objSong.category || '';
            form.elements['songbook'].value = objSong.songbook || '';
            form.elements['id_song'].value = objSong.id_song;
            form.elements['id_song'].disabled = true;//deshabilito input id_song
            form.querySelector('.wr_id_song').style.display = 'block';//muestro el wr_id_song
            form.elements['song_number'].value = objSong.song_number || '';
            form.elements['tune'].value = objSong.tune || '';
            form.elements['tune_transpose'].value = objSong.tune_transpose || 0;
            form.elements['tipo_acorde'].value = objSong.tipo_acorde || '#';
            form.elements['tipo_fuente'].value = objSong.tipo_fuente || 'a';
            form.elements['url_youtube'].value = objSong.url_youtube || '';
            form.elements['url_recurso'].value = objSong.url_recurso || '';
            form.elements['tempo_bpm'].value = objSong.tempo_bpm || 0;
            form.elements['lang'].value = objSong.lang;
            form.elements['song_text'].value = objSong.song_text || '';
            form.elements['notes'].value = objSong.notes || '';

            //1. importante para que pinte bloques al añadir form (sin hacer oninput)
            handleFormInput(form.elements['song_text'], eid_block_cancion);
            handleFormTranspose(Number(objSong.tune_transpose));//para transponer al cargar el form
            handleFormTipoAcorde(objSong.tipo_acorde);//para cambiar tipo acorde al cargar el form
            handleFormTipoFuente(objSong.tipo_fuente);//para cambiar tipo fuente al cargar el form

            //songs ajustes
            aplicarSongAjustes();

            //ajustes personalizados
            ajustes_pers = Number(objSong.ajustes_pers);
            form.elements['tune_transpose_pers'].value = objSong.tune_transpose_pers || 0;
            form.elements['capo_pers'].value = objSong.capo_pers || 0;
            form.elements['tipo_acorde_pers'].value = objSong.tipo_acorde_pers || '#';
            form.elements['tempo_bpm_pers'].value = objSong.tempo_bpm_pers || 0;
            form.elements['notes_pers'].value = objSong.notes_pers || '';

            aplicarUsersAjustes();

            document.querySelector('.vista_fixed .d_contenedor').scrollTop = 0;//voy al inicio del contenedor
            refreshSwipeLayout();
            
            buildEsquemaSoloTitulos(form.querySelector('.d_esquema_titulos'), objSong.arr_esquema);             
            break;
    }


    //codigo para ambos casos: 'nueva' y  'ver, editar, eliminar'
    //2. escucho al cambiar el texto...
    form.elements['song_text'].oninput = (e) => {
        handleFormInput(e, eid_block_cancion);
    }

    //3. añado escuchador de change al 'tipo_fuente' // 'Monospace' o 'Arial'
    form.elements['tipo_fuente'].onchange = (e) => {
        console.log('e.currentTarget.value: ', e.currentTarget.value);
        
        const tipo_fuente_val = e.currentTarget.value;
        handleFormTipoFuente(tipo_fuente_val);
    }  
    
    //antes. tipo_acorde como '<select></select>'
    //4. añado escuchador de change al 'tipo_acorde' 
    // form.elements['tipo_acorde'].onchange = (e) => {
    //     console.log('e.currentTarget.value: ', e.currentTarget.value);
        
    //     const tipo_acorde_val = e.currentTarget.value;
    //     handleFormTipoAcorde(tipo_acorde_val);
    // }
    
    //4. añado escuchador de change al 'tipo_acorde' como '<div></div>' 
    eid_d_tipo_acorde.onclick = (e) => {
        console.log('e.currentTarget.value: ', e.currentTarget.value);
        console.log('e.target.value: ', e.target.value);
        let tipo_acorde_val;

        if(e.target.dataset.value == '#'){
            tipo_acorde_val = '#';
        }
        if(e.target.dataset.value == 'b'){
            tipo_acorde_val = 'b';
        }
        meterTipoAcorde(eid_d_tipo_acorde, tipo_acorde_val);

        handleFormTipoAcorde(tipo_acorde_val);
    }    

    //5. añado escuchador de change al 'transpose' 
    form.elements['tune_transpose'].onchange = (e) => {
        console.log('e.currentTarget.value: ', e.currentTarget.value);
        
        const transpose_val = Number(e.currentTarget.value);
        handleFormTranspose(transpose_val);
    }
        




    //------------------------------------------------------------------//
    // start - Ajustes personalizados
    //------------------------------------------------------------------//
    //4.pers añado escuchador de change al 'tipo_acorde' como '<div></div>'
    eid_d_tipo_acorde_pers.onclick = (e) => {
        console.log('e.currentTarget.value: ', e.currentTarget.value);
        console.log('e.target.value: ', e.target.value);
        let tipo_acorde_val;

        if(e.target.dataset.value == '#'){
            tipo_acorde_val = '#';
        }
        if(e.target.dataset.value == 'b'){
            tipo_acorde_val = 'b';
        }
        meterTipoAcorde(eid_d_tipo_acorde_pers, tipo_acorde_val);

        handleFormTipoAcorde(tipo_acorde_val);
    }

    //5.pers añado escuchador de change al 'transpose' 
    form.elements['tune_transpose_pers'].onchange = (e) => {
        console.log('e.currentTarget.value: ', e.currentTarget.value);
        
        const transpose_pers_val = Number(e.currentTarget.value);
        const capo_pers_val = Number(form.elements['capo_pers'].value);

        const transpose_val_new = getTransposeFromCapo(transpose_pers_val, capo_pers_val);        
        handleFormTranspose(transpose_val_new);
    }    
    

    //6.pers añado escuchador de change al 'transpose' 
    form.elements['capo_pers'].onchange = (e) => {
        console.log('e.currentTarget.value: ', e.currentTarget.value);

        const tune_transpose_pers_val = Number(form.elements['tune_transpose_pers'].value);
        const capo_pers_val = Number(e.currentTarget.value);

        const transpose_val_new = getTransposeFromCapo(tune_transpose_pers_val, capo_pers_val);        
        handleFormTranspose(transpose_val_new);
    }    

    
    //------------------------------------------------------------------//
    // end - Ajustes personalizados
    //------------------------------------------------------------------//




    if(['ver'].includes(cancion_action)){
        //no apendo nada;
        makeInputsDisabled(form_cancion, true);//deshabilito los inputs
    }
    else if(['nueva','editar'].includes(cancion_action)){
        form_cancion.querySelector('form').append(wr_btns_form);
        form_cancion.querySelector('form').append(wr_revisar_y_guardar);
        if(['nueva'].includes(cancion_action)){
            makeInputsDisabled(form_cancion, false);//habilito los inputs
        }
    }
    else if(['eliminar'].includes(cancion_action)){
        form_cancion.querySelector('form').append(wr_btns_eliminar);
        makeInputsDisabled(form_cancion, true);//deshabilito los inputs
    }

    //añado al DOM
    // eid_bl_modalFullInner.append(form_cancion);
    contenedor.append(form_cancion);

    meterTipoAcorde(eid_d_tipo_acorde, objSong.tipo_acorde);
    
    //si hay ajustes personalizados
    if(ajustes_pers){
        meterTipoAcorde(eid_d_tipo_acorde_pers, objSong.tipo_acorde_pers);
    }

    check_ajustes_pers();

    console.log('fin func --- buildFormCancion');
}

function meterTipoAcorde(contenedor, valor){
    console.log('=== function meterTipoAcorde() ===');
    console.log('contenedor: ', contenedor);
    console.log('valor: ', valor);

    const dbtnAll = contenedor.querySelectorAll('.dbtn');
    dbtnAll.forEach(dbtn => {
        if(dbtn.dataset.value == valor){
            dbtn.classList.add('active');
        } else {
            dbtn.classList.remove('active');
        }
    });

    if(contenedor.id === 'd_tipo_acorde'){
        const tipo_acorde_input = document.querySelector('#tipo_acorde_hidden');
        if(tipo_acorde_input){
            tipo_acorde_input.value = valor;
            handleFormTipoAcorde(valor);
        }
    }

    if(contenedor.id === 'd_tipo_acorde_pers'){
        const tipo_acorde_pers_input = document.querySelector('#tipo_acorde_pers_hidden');
        if(tipo_acorde_pers_input){
            tipo_acorde_pers_input.value = valor;
            handleFormTipoAcorde(valor);
        }
    }    
}


function handleFormTranspose(transpose_val){
    console.log('=== function handleFormTranspose() ===');

    //if(transpose_val != 0){
        transponerTodosLosAcordes(Number(transpose_val));
    //}
}

function handleFormTipoAcorde(tipo_acorde_val){
    console.log('=== function handleFormTipoAcorde() ===');

    if(tipo_acorde_val == 'b'){
        changeTipoAcorde('bemol');
    } else {//si es '#' o por defecto es '#'
        changeTipoAcorde('diez');
    }
}

function handleFormTipoFuente(tipo_fuente_val){
    console.log('=== function handleFormTipoFuente() ===');

    if(['a','m'].includes(tipo_fuente_val)){
        changeTipoFuente(tipo_fuente_val);
    }
}

function buildFormEjemplo(contenedor, lang){
    console.log('=== function buildFormEjemplo() ===');

    //console.log('cancion_action: ', cancion_action);
    //console.log('objSong: ', objSong);

    if(!contenedor){
        alert('no hay contenedor, hago return...');
        return;
    }

    if(!lang){
        alert('no hay lang, hago return...');
        return;
    }

    let id_vstavka = '';
    if(contenedor.id == 'bl_modalFullInner'){
        id_vstavka = 'mod_ej_';
    }


    //eid_bl_modalFullInner.innerHTML = '';//reset
    contenedor.innerHTML = '';//reset

    let mensaje_html = '';

    //FORMULARIO
    const form_ejemplo = document.createElement('div');
    //form_ejemplo.id = 'form_ejemplo';
    form_ejemplo.className = 'form_ejemplo';
    form_ejemplo.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje">Ejemplo de cómo rellenar el campo de texto de la canción.</p>

                <div class="form_group">
                    <textarea id="${id_vstavka}song_text_ejemplo" name="song_text_ejemplo" rows="140" required="" placeholder=" "></textarea>
                    <label for="${id_vstavka}song_text_ejemplo" class="lab_textarea">Texto de la canción</label>
                </div>

            </form>
        </div>     
    `;


    const form = form_ejemplo.querySelector('form');
    form.reset();//reseteo formulario
    form.elements['song_text_ejemplo'].value = obj_ejemplos_song[lang];    

    //1. importante para que pinte bloques al añadir form (si hace oninput)
    handleFormInput(form.elements['song_text_ejemplo'], eid_block_ejemplo);

    //2. escucho al cambiar el texto...
    form.elements['song_text_ejemplo'].oninput = (e) => {
        console.log('654 - song_text_ejemplo.oninput()... ');
        handleFormInput(e, eid_block_ejemplo);
    }

    //añado al DOM
    contenedor.append(form_ejemplo);

    console.log('fin func --- buildFormEjemplo');
}

















function meter_title_fast(text) {
    const input_title = document.querySelector('#form_lista .form_container #title');
    if(!input_title) return;

    let title_text_actual = input_title.value;
    let probel = (title_text_actual.length > 1) ? " " : "";
    input_title.value = title_text_actual + probel + text + ';';//вставляю coment в инпут
}

function reset_title_fast() {
    const input_title = document.querySelector('#form_lista .form_container #title');
    if (!input_title) return;

    let title_text_actual = input_title.value;


    let arr = title_text_actual.split(";");//превращаю из строки в аррай
    //alert('arr: '+arr);
    let title_text_last = arr[arr.length - 2];// отнимаю -2 , так как последний ел массива пустой , ведь строка заканчивается ";"
    let title_text_new = arr.slice(0, -2);//slice(start,end) // -2 значит, что отрезаю 2 елемента с конца.


    let text = '';//iniciar variable
    for (let i = 0; i < (arr.length - 2); i++) {
        text = text + title_text_new[i] + ";";
        //alert(i+' text[i]: ' + text);
    }

    input_title.value = text;//вставляю coment в инпут
}


function buildListaSoloSongs(contenedor, arr_lista_bucle){
    console.log('=== function buildListaSoloSongs() ===');

    contenedor.innerHTML = '';//reset - SIEMPRE
    
    const wr_p_lista = document.createElement('div');
    wr_p_lista.className = 'wr_p_lista';
    
    if(Array.isArray(arr_lista_bucle) && arr_lista_bucle.length > 0){
        
        //Head
        const d_canciones_head = document.createElement('div');
        d_canciones_head.className = 'canciones_head';
        d_canciones_head.innerHTML = `
            <div class="dbtn_fx">
                <span>Canciones</span> 
                <span class="n_songs">(${arr_lista.length})</span>
            </div>
            <div class="btns_fx">
                <button class="btn btn_action_ordenar">Ordenar</button>
                <button class="btn btn_action_editar">Editar</button>
            </div>
        `;
        d_canciones_head.onclick = (e) => {
            e.preventDefault();
            console.log('click en d_canciones_head');
    
            if(e.target.closest('.btn_action_ordenar')){
                openModal('full','Ordenar lista',null,'buildLista',true, 'sort');
            }
            else if(e.target.closest('.btn_action_editar')){
                openModal('full','Editar lista',null,'buildLista',true, 'editar');
            }else{
                // hideShowBlock('l_canciones_detalles');
                const element = e.target.closest('.wr_p_lista').querySelector('#l_canciones_detalles');
                console.log('element: ', element);
                hideShowBlock(element);
            }
        }
        wr_p_lista.append(d_canciones_head);


        //Body - Detalles
        const l_canciones_detalles = document.createElement('div');
        l_canciones_detalles.id = 'l_canciones_detalles';
        wr_p_lista.append(l_canciones_detalles);

        //Body
        const d_canciones_body = document.createElement('div');
        d_canciones_body.className = 'canciones_body';
        l_canciones_detalles.append(d_canciones_body);


        //Recorrer array
        arr_lista_bucle.forEach((item, i) => {
            console.log('item: ', item);

            const p_lista = document.createElement('p');            

            if(item.id_song == lista_id_song){
                p_lista.className = `p_lista active`;
            }else{
                p_lista.className = `p_lista`;
            }

            const html_title2 = (item.title2) ? `<span class="cl_title2">${item.title2}</span>` : '';
            const html_title_note = (item.title_note) ? `<span class="cl_title_note">${item.title_note}</span>` : '';

            p_lista.dataset.id_song = item.id_song;

            let tune_transpose_val = '';
            let cl_tune_transpose = '';

            if(Number(item.ajustes_pers)){

                if(item.tune_transpose_pers != 0 || item.capo_pers != 0){
                    const transpose = getTransposeFromCapo(item.tune_transpose_pers, item.capo_pers);
                    tune_transpose_val = (transpose > 0)
                        ? `+${transpose}`
                        : `${transpose}`;
                    cl_tune_transpose = 'sp_pers';
                }else{
                    tune_transpose_val = '';
                    cl_tune_transpose = '';
                }

            }else{
                
                cl_tune_transpose = '';
                
                if(item.tune_transpose != 0){
                    tune_transpose_val = item.tune_transpose;
                }else{
                    tune_transpose_val = '';
                }
            }




            p_lista.innerHTML = `
                <span class="wn_2_flex">
                    
                    <span class="sp_flex_btns">
                        <span class="l_tune">${item.tune || ''}</span>
                        <span class="l_tune_transpose ${cl_tune_transpose}">${tune_transpose_val}</span>
                        <span class="l_id">${item.id_song}</span>
                        <span class="l_edit"><img src="images/icon_edit_white.svg"></span>
                        <span class="btn_song_x" data-id_song_to_del="${item.id_song}">✕</span>
                    </span>

                    <span class="sp_flex_n_title">
                        <span class="l_kvadrat">
                            <img src="./images/icon_ok_white.svg">
                        </span>
                        <span class="l_n">${i + 1}.</span>
                        <span class="l_title">
                            <span class="cl_title">${item.title}</span>
                            ${html_title2}
                            ${html_title_note}
                        </span>
                    </span>

                </span>
            `;
            
            p_lista.onclick = (e) => {
                // showToast('info', '2. p_lista clicked en 1378', 1500);//test

                lista_id_song = e.currentTarget.dataset.id_song;
                const element_clicked = e.currentTarget;// guardar referencia real del evento (aki e.currentTarget es p_lista)
                console.log('lista_id_song: ', lista_id_song);

                if(e.target.classList.contains('btn_song_x')){
                    //Eliminar canción de la lista
                    console.log('Eliminar canción de la lista. id_song: ', lista_id_song);
                    e.stopPropagation();//evita que se dispare el onclick del padre

                    eliminarSongDeLista(lista_id_song);

                }else if(e.target.closest('.l_id')){
                    //Editar canción de la lista
                    console.log('ir a slide_select de canción de la lista. id_song: ', lista_id_song);
                    e.stopPropagation();//evita que se dispare el onclick del padre
                    
                    id_song = lista_id_song;
                    
                    //llamo async ya que en crearSlidesForSongOfLista() hay awaits a la bd
                    llamar_func(e);
                    async function llamar_func(e){
                        showEdit('esquema');//para abrir si no se ve
                        showBlockName('esquema');//para abrir si no se ve

                        const btnElement = eid_block_esquema.querySelector('#btn_select_slide');
                        showVklad(btnElement, param = 'select_slide');//función select_slide() se llama dentro
                        
                        await crearSlidesForSongOfLista(e, lista_id_song, cerrar_modales = false);
                        closeModal(null,true);
                    }

                }else if(e.target.closest('.l_edit')){
                    //Editar canción de la lista
                    console.log('Editar canción de la lista. id_song: ', lista_id_song);
                    e.stopPropagation();//evita que se dispare el onclick del padre
                    
                    //llamo async autoejecutable ya que en editSongOfLista() hay awaits a la bd
                    (async () => {
                        await editSongOfLista(element_clicked, lista_id_song);
                    })();

                }else{
                    
                    
                    //antes. comento por ahra...
                    //ver los slides en slideContainer (con acordes) cerrando ventanas modales
                    //llamo async autoejecutable ya que en crearSlidesForSongOfLista() hay awaits a la bd
                    // (async (e)=>{
                    //     await crearSlidesForSongOfLista(e, lista_id_song, cerrar_modales = true);
                    // })(e);


                    console.log('Editar canción de la lista. id_song: ', lista_id_song);
                    e.stopPropagation();//evita que se dispare el onclick del padre

                    // if(window.innerWidth < pantallaTabletMinPx){//mobile
                    //     const element_this = eid_block_cancion.querySelector('.v_lcr_r');//btn vista derecha
                    //     clickLCR(element_this,'r','block_cancion');
                    // }
                    
                    // //funcion anónima autoejecutable para esperar un tiempo antes de ejecutar editSongOfLista() y así evitar errores de carga de datos al ir a vista mobile (slide_select) y luego editar canción
                    // (async (e) =>{
                    //     await sleep(5000);
                    // })(e);

                    //llamo async autoejecutable ya que en editSongOfLista() hay awaits a la bd
                    (async (e) => {
                        //await sleep(5000);                        
                        
                        await editSongOfLista(element_clicked, lista_id_song);
                        
                        //await sleep(5000);  

                        // if(window.innerWidth < pantallaTabletMinPx){//mobile
                        //     const element_this = eid_block_cancion.querySelector('.v_lcr_r');//btn vista derecha
                        //     clickLCR(element_this,'r','block_cancion');
                        // }
                        
                        //alert('1. ahra click en fullscreen para ver los cambios al instante');
                        
                        //await sleep(5000);
                        //alert('2. ahra click en fullscreen para ver los cambios al instante');

                        //eid_block_cancion_body.querySelector('.wr_vista_blocks .dbtn_fullscreen').click();//para ir a fullscreen
                        eid_block_cancion_body.querySelector('.vista_fixed #d_state_fullscreen').click();//para ir a fullscreen de vista_fixed
                    })(e);
                }
            }

            d_canciones_body.append(p_lista);
        });

        contenedor.append(wr_p_lista);        

    }else{//lista vacía
            
        const p_prim = document.createElement('p');
        p_prim.className = 'prim';
        p_prim.innerHTML = `
            No hay canciones 
        `;
        wr_p_lista.append(p_prim);

        const d_info = document.createElement('div');
        d_info.className = 'd_info';
        d_info.innerHTML = `
            <p class="prim">
                Lista vacía 
            </p>
            <p class="prim">
                Para añadir canciones pincha en la canción deseada y añádela a la lista seleccionada. 
            </p>
            <button class="btn" onclick="showBlockName('buscar')">Buscar Canciones</button>
        `;

        contenedor.append(wr_p_lista);
    }

}

























function buildEsquemaSoloTitulos(contenedor, arr_esquema_bucle){
    console.log('=== function buildEsquemaSoloTitulos() ===');

    contenedor.innerHTML = '';//reset - SIEMPRE
    
    const wr_p_esquema = document.createElement('div');
    wr_p_esquema.className = 'wr_p_esquema';
            
    //Head
    const d_esquema_head = document.createElement('div');
    d_esquema_head.className = 'esquema_head';
    d_esquema_head.innerHTML = `
        <span>Esquema</span>
        <div class="btns_fx">
            <button class="btn btn_ver_esquema">Ver</button>
            <button class="btn btn_crear_esquema">Editar</button>
        </div>
    `;
    d_esquema_head.onclick = (e) => {
        e.preventDefault();
        console.log('click en esquema_head');

        if(e.target.closest('.btn_ver_esquema')){
            showEdit('esquema');
            showVklad(e.currentTarget,'ver_esquema');
        }
        else if(e.target.closest('.btn_crear_esquema')){
            showEdit('esquema');
            showVklad(e.currentTarget,'crear_esquema');
        }else{
            hideShowBlock('s_esquema_detalles');
        }
    }
    wr_p_esquema.append(d_esquema_head);


    //Body - Detalles
    const s_esquema_detalles = document.createElement('div');
    s_esquema_detalles.id = 's_esquema_detalles';
    wr_p_esquema.append(s_esquema_detalles);
    
    //Body
    const d_esquema_body = document.createElement('div');
    d_esquema_body.className = 'canciones_body';
    s_esquema_detalles.append(d_esquema_body);

    if(Array.isArray(arr_esquema_bucle) && arr_esquema_bucle.length > 0){

        //Recorrer array
        arr_esquema_bucle.forEach((item, i) => {
            console.log('item: ', item);

            if(i == 0){
                return;//no dejo mostrar '_titulo_cancion_'
            }

            const p = document.createElement('p');            
            p.className = 'p_esquema linea';

            let veces_html = '';
            if(item.veces > 1){
                veces_html = `<span class="veces">(x${item.veces})</span>`;
            }

            p.innerHTML = `
                <span class="titulo">${item.nombre}</span>
                ${veces_html}
            `;

            d_esquema_body.append(p);
        });

        contenedor.append(wr_p_esquema);        

    }else{//lista vacía
            
        const p = document.createElement('p');
        p.className = 'prim';
        p.innerHTML = `
            La esquema por efecto. <br>Las partes de la canción se verán tal cual como en el texto de la canción.
        `;
        d_esquema_body.append(p);

        contenedor.append(wr_p_esquema);
    }

} 




























function buildListaSort(contenedor, arr_lista_bucle){
    console.log('=== function buildListaSort() ===');
    made_draggable_once = false;//aki SIEPRE false

    contenedor.innerHTML = '';//reset - SIEMPRE
    
    const wr_p_lista = document.createElement('div');
    wr_p_lista.className = 'wr_p_lista';
    
    if(Array.isArray(arr_lista_bucle) && arr_lista_bucle.length > 0){
        
        //Head
        const d_canciones_head = document.createElement('div');
        d_canciones_head.className = 'canciones_head';
        d_canciones_head.innerHTML = `
            <div class="dbtn_fx">
                <span>Canciones</span> 
                <span class="n_songs">(${arr_lista.length})</span>
            </div>
            <div class="btns_fx">
                <button class="btn btn_action_ver">Ver</button>
                <button class="btn btn_action_editar">Editar</button>
            </div>
        `;
        d_canciones_head.onclick = (e) => {
            e.preventDefault();
            console.log('click en d_canciones_head');
    
            if(e.target.closest('.btn_action_ver')){
                openModal('full','Lista actual',null,'buildLista',true, 'ver_sm');
            }
            else if(e.target.closest('.btn_action_editar')){
                openModal('full','Editar lista',null,'buildLista',true, 'editar');
            }else{
                hideShowBlock('ls_canciones_detalles');
            }
        }
        wr_p_lista.append(d_canciones_head);       



        //Body - Detalles
        const ls_canciones_detalles = document.createElement('div');
        ls_canciones_detalles.id = 'ls_canciones_detalles';
        wr_p_lista.append(ls_canciones_detalles);

        //Body
        const d_canciones_body = document.createElement('div');
        d_canciones_body.id = 'd_canciones_body_drag';
        d_canciones_body.className = 'canciones_body';
        ls_canciones_detalles.append(d_canciones_body);


        //Recorrer array
        arr_lista_bucle.forEach((item, i) => {
            console.log('item: ', item);

            const p = document.createElement('p');
            p.draggable = true;
            
            if(item.id_song == lista_id_song){
                p.className = `p_lista p_drag draggable active`;
            }else{
                p.className = `p_lista p_drag draggable`;
            }

            const html_title2 = (item.title2) ? `<span class="cl_title2">${item.title2}</span>` : '';
            const html_title_note = (item.title_note) ? `<span class="cl_title_note">${item.title_note}</span>` : '';

            p.dataset.id_song = item.id_song;
            p.innerHTML = `
                <span class="l_kvadrat">
                    <img src="./images/icon_ok_white.svg">
                </span>
                <span class="l_n">${i + 1}.</span>
                <span class="l_title">
                    <span class="cl_title">${item.title}</span>
                    ${html_title2}
                    ${html_title_note}
                </span>
                <span class="l_tune">${item.tune || ''}</span>
                <span class="l_tune_transpose">${(item.tune_transpose != 0) ? item.tune_transpose : ''}</span>
                <span class="l_id">${item.id_song}</span>
                <span class="l_drag">
                    <span></span>
                    <span></span>
                </span>
            `;

            // wr_p_lista.append(p);
            d_canciones_body.append(p);
        });

        contenedor.append(wr_p_lista);        

    }else{//lista vacía
            
        const p = document.createElement('p');
        p.className = 'prim';
        p.innerHTML = `
            No hay canciones 
        `;
        wr_p_lista.append(p);

        const d_info = document.createElement('div');
        d_info.className = 'd_info';
        d_info.innerHTML = `
            <p class="prim">
                Lista vacía 
            </p>
            <p class="prim">
                Para añadir canciones pincha en la canción deseada y añádela a la lista seleccionada. 
            </p>
            <button class="btn" onclick="showBlockName('buscar')">Buscar Canciones</button>
        `;

        contenedor.append(wr_p_lista);
    }

    setTimeout(() => {
        makeItemsDraggable('d_canciones_body_drag', 'p_drag');       
    }, 500);

}







async function getDataSongFromBd(){
    console.log('=== function getDataSongFromBd() ===');

    try {
        
        if(!hay_id_song('getDataSongFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        }


        const {
            deviceResolution,
            orientation
        } = getDeviceData();
               
        const response = await fetch('../song/php/obtener_song_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_song: id_song,
                device_resolution: deviceResolution,
                orientation: orientation
            }), // Convertir los datos a formato JSON
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
            throw new Error(`HTTP (error obtener_song_datos.php) ${response.status}`);
        }

        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {
                console.log('success is true');

                let song_title = data.title; 
                let song_text = data.song_text; 
                // data.arr_esquema = (data.arr_esquema != '') ? JSON.parse(data.arr_esquema) : data.arr_esquema ; 
                data.arr_esquema = (esString(data.arr_esquema) && data.arr_esquema != '' && data.arr_esquema.length > 0) ? JSON.parse(data.arr_esquema) : [] ;// test arr vacio 

                console.log(`id_song: [${id_song}] --- song_title: [${song_title}] --- song_text: [${song_text}] --- data.arr_esquema: `, data.arr_esquema);

                return data;    
                
            } else {
                console.log('success is false');
                return 'no_hay_datos';              
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en obtener_song_datos.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en obtener_song_datos.php',
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en getDataSongFromBd(): error.message: ', error.message);
    }
}


async function getDataListaFromBd(){
    console.log('=== function getDataListaFromBd() ===');

    try {
        
        if(!hay_id_lista('getDataListaFromBd()')){
            return; // <- se detiene aquí si no hay id_lista
        } 
               
        const response = await fetch('../song/php/obtener_lista_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_lista: id_lista
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        let data;

        if(debug){
            data = await response.text();//test
        }else{
            data = await response.json();
        }
        console.log('data:', data);  
        
        if(data.success){
            console.log('success is true');

            let lista_title = data.title; 
            //data.arr_lista = (esString(data.arr_lista) && data.arr_lista != '' && data.arr_lista.length > 0) ? JSON.parse(data.arr_lista) : [] ;// test arr vacio 

            console.log(`id_lista: [${id_lista}] --- lista_title: [${lista_title}] --- data.arr_lista: `, data.arr_lista);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getDataListaFromBd(): error.message: ', error.message);
    }
}


async function getSongbooksFromBd(){//sacar TODOS los SongBooks para rellenar el <select></select>
    console.log('=== function getSongbooksFromBd() ===');

    try {
        
        // if(!hay_id_song('getDataSongFromBd()')){
        //     return; // <- se detiene aquí si no hay id_song
        // } 
               
        const response = await fetch('../song/php/obtener_songbooks_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                tipo_consulta: 'todo'//sacar todos los datos
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');
            console.log(`data.arr_songbooks: `, data.arr_songbooks);
            
            objSongbooksBd = data.arr_songbooks; //asigno a variable global
            console.log(`objSongbooksBd: `, objSongbooksBd);

            return objSongbooksBd;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getSongbooksFromBd(): error.message: ', error.message);
    }
}


async function getGruposFromBd(){//sacar TODOS los grupos para rellenar el <select></select> de lista
    console.log('=== function getGruposFromBd() ===');

    try {
        
        // if(!hay_id_song('getDataSongFromBd()')){
        //     return; // <- se detiene aquí si no hay id_song
        // } 
               
        const response = await fetch('../song/php/obtener_grupos_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                tipo_consulta: 'todo'//sacar todos los datos
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');
            console.log(`data.arr_grupos: `, data.arr_grupos);
            
            objGruposBd = data.arr_grupos; //asigno a variable global
            console.log(`objGruposBd: `, objGruposBd);

            return objGruposBd;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en getSongbooksFromBd(): error.message: ', error.message);
    }
}






async function getDataListasFromBdByFind(objFindListaParams){
    console.log('=== function getDataListasFromBdByFind(objFindListaParams) ===');

    let {words_input, modo, buscar_en} = objFindListaParams;

    try {
        
        if(!words_input){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }
               
        const response = await fetch('../song/php/obtener_lista_by_find.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            credentials: 'include', // importante para Safari (cookies/sesión)
            body: JSON.stringify({
                words_input,
                modo,
                buscar_en
            }), // Convertir los datos a formato JSON
        });


        const text = await response.text();
        console.log('text:', text);


        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error obtener_lista_by_find.php) ${response.status}`);
        }
    
        try {
            const data = JSON.parse(text);
            console.log('data:', data);

            if(data.success){
                console.log('success is true');
    
                let arr_data = data.arr_data; 
    
                console.log(`arr_data: `, arr_data);
    
                return data;
    
            }else{
                console.log('success is false');
                return 'no_hay_datos';
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en read_book_to_json.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en read_book_to_json.php',
                { cause: error }
            );
        } 

    } catch (error) {
        console.error('Error en getDataListasFromBdByFind(): error.message: ', error.message);
    }
}




async function insertarSongDatos(objSong) {
    console.log('=== function insertarSongDatos(objSong) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objSong || Object.keys(objSong).length == 0){
            alert('No hay todos los parametros necesarios de la cancion...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objSong: ',objSong);
        
        const objSong_str = JSON.stringify(objSong);
        console.log('objSong_str: ', objSong_str);

        const response = await fetch('../song/php/insertar_song_datos.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objSong_str
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
            throw new Error(`HTTP (error insertar_song_datos.php) ${response.status}`);
        }
    
        try {
            const data = JSON.parse(text);
            console.log('data:', data);

            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en insertar_song_datos.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en insertar_song_datos.php',
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en la función insertarSongDatos: ', error);
    }
}


async function deleteSongFromBd(){
    console.log('=== function deleteSongFromBd() ===');

    try {
        
        if(!hay_id_song('deleteSongFromBd()')){
            return; // <- se detiene aquí si no hay id_song
        } 
               
        const response = await fetch('../song/php/eliminar_song_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_song: id_song
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let song_title = data.title; 
            let song_text = data.song_text; 
            data.arr_esquema = (data.arr_esquema != '') ? JSON.parse(data.arr_esquema) : data.arr_esquema ; 

            console.log(`[ELIMINADA] id_song: [${id_song}] --- song_title: [${song_title}] --- song_text: [${song_text}] --- data.arr_esquema: `, data.arr_esquema);

            return data;

        }else{
            console.log('success is false');
            return data;
        }

    } catch (error) {
        console.error('Error en deleteSongFromBd(): error.message: ', error.message);
    }
}







async function deleteListaFromBd(){
    console.log('=== function deleteListaFromBd() ===');

    try {
        
        if(!hay_id_lista('deleteListaFromBd()')){
            return; // <- se detiene aquí si no hay id_lista
        } 
               
        const response = await fetch('../song/php/eliminar_lista_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_lista: id_lista
            }), // Convertir los datos a formato JSON
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const data = await response.json();
        //const data = await response.text();//test
        console.log(data);  
        
        if(data.success){
            console.log('success is true');

            let lista_title = data.title; 
            let lista_nota = data.notes; 
            //data.arr_lista = (data.arr_lista != '') ? JSON.parse(data.arr_lista) : data.arr_lista ; 

            console.log(`[ELIMINADA] id_lista: [${id_lista}] --- lista_title: [${lista_title}] --- lista_nota: [${lista_nota}] --- data.arr_lista: `, data.arr_lista);

            return data;

        }else{
            console.log('success is false');
            return 'no_hay_datos';
        }

    } catch (error) {
        console.error('Error en deleteListaFromBd(): error.message: ', error.message);
    }
}



function showAviso(htmlTrans, positionModal){
    console.log('=== showAviso(htmlTrans, param) ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.innerHTML = '';
    }
    
    const p = document.createElement('p');
    p.className = 'p_aviso';
    p.innerHTML = htmlTrans;

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(p);    
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.append(p);
    }

}

function showAviso2(elemento_aviso, positionModal){// elemento_aviso es objeto HTML y no elemento.innerHTML
    console.log('=== showAviso2(elemento_aviso, param) ===');

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.innerHTML = '';
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.innerHTML = '';
    }
    
    const contenedor_aviso = document.createElement('div');
    contenedor_aviso.className = 'contenedor_aviso';
    contenedor_aviso.append(elemento_aviso);

    if(positionModal == 'center'){
        eid_bl_modalCenterInner.append(contenedor_aviso);    
    }else if(positionModal == 'bottom'){
        eid_bl_modalBottomInner.append(contenedor_aviso);
    }

}