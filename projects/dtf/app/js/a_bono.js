//bono
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildBono(bono_action = null){
    console.log('=== function buildBono() ===');

    console.log('bono_action: ', bono_action);
    console.log('objBono: ', objBono);

    eid_bl_modalFullInner.innerHTML = '';//reset

    //campos de input
    let id_bono_val = '';
    let nombre_val = '';
    let descripcion_val = '';

    let longitud_m_val = '';
    let longitud_m_text = '';

    let longitud_bonificada_m_val = '';
    let longitud_bonificada_m_text = '';

    let envio_gratis_val = '';
    let envio_gratis_text = '';

    let precio_val = '';
    let precio_text = '';
        
    //otras vars
    let mensaje_html = '';
    let cl_id_bono = 'd-none';//oculto
    let cl_envio_gratis = (objBono?.envio_gratis) ? 'marcado_si' : 'marcado_no';//oculto
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(bono_action == 'nuevo'){//si es nueva
        
        //mostrarPrim = false;    
        //ocultarElementosPrimEn(lista_option_inner);
        //ocultarElementosEditablesEn(lista_option_inner);
        //mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit 

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id(id_bono, 'id_bono', 'buildBono()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún bono.</p>
                <p class="p_aviso">Crea un bono pulsando "+".</p>
            `;
            openModal('center','Aviso Bono',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_bono
        } 
        id_bono_val = objBono.id_bono;
        nombre_val = escaparHTML(objBono.nombre) || '';
        descripcion_val = escaparHTML(objBono.descripcion) || '';
        
        longitud_m_val = (objBono.longitud_m) ? escaparHTML(objBono.longitud_m) : '';
        longitud_m_text = (objBono.longitud_m) ? `${longitud_m_val} m` : '--';
        
        longitud_bonificada_m_val = (objBono.longitud_bonificada_m) ? escaparHTML(objBono.longitud_bonificada_m) : '';
        longitud_bonificada_m_text = (objBono.longitud_bonificada_m) ? `${longitud_bonificada_m_val} m` : '--';
        
        envio_gratis_val = (objBono.envio_gratis) ? escaparHTML(objBono.envio_gratis) : '';
        envio_gratis_text = (objBono.envio_gratis) ? 'Sí' : 'No';
        
        precio_val = (objBono.precio) ? escaparHTML(objBono.precio) : '';
        precio_text = (objBono.precio) ? `${precio_val} €` : '--';
    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(bono_action)){
        mensaje_html = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_bono}</b></span>
            </span>
        `;
    }

    switch (bono_action) {
        case 'nuevo'://Nueva Bono
            mensaje_html = `
                <span>Rellena los campos del formulario con los datos de un bono <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_bono
            if(id_bono){
                id_bono = null;//reset ya que se va a crear un id_bono nuevo
            }else{
                //id_bono es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objBono = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            //resetBlockLista();        
            break;
        
        default:
        case 'ver'://Ver Bono - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_bono = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            break;

        case 'editar'://Editar Bono - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Bono - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_bono = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'eliminar'
            break;
    }
    


    //Descripción si hay
    let descripcion_detalles = '';
    if(descripcion_val){
        descripcion_detalles = document.createElement('div');
        descripcion_detalles.className = 's_detalles ';
        descripcion_detalles.innerHTML = `
            <p class="p_titulo" onclick="hideShowBlock('l_notes_detalles_sm');">Descripción</p>
            <p id="l_notes_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">            
                    <span class="linea_fx ">
                        <span>${descripcion_val}</span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>
        `;
    }

    //Botones ELIMINAR - SM
    const wr_btns_eliminar = document.createElement('div');
    wr_btns_eliminar.className = 'wr_btns_eliminar';
    wr_btns_eliminar.innerHTML = `
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteBono(event);">Eliminar Bono DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_bono_sm = document.createElement('div'); 
    contenedor_bono_sm.id = 'contenedor_bono_sm';
    contenedor_bono_sm.className = 'contenedor_form_sm';
    contenedor_bono_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Bono <span class="f_r ${cl_id_bono}">id: ${id_bono_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx ${!longitud_m_val ? 'd-none' : ''}">
                        <span class="cl_campo">Longitud:</span>
                        <span>${longitud_m_text}</span>
                    </span>
                    <span class="linea_fx ${!precio_val ? 'd-none' : ''}">
                        <span class="cl_campo">Precio:</span>
                        <span>${precio_text}</span>
                    </span>

                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(descripcion_val) ? descripcion_detalles.outerHTML : '' }
        
        ${(bono_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarBono(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_bono = document.createElement('div');
    form_bono.id = 'form_bono';
    form_bono.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje" data-dic="">
                    ${mensaje_html}
                </p>

                <!-- nombre -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#nombre')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="nombre" type="text" name="nombre" required="" placeholder=" " value="${nombre_val}">
                    <label for="nombre">Nombre del bono</label>
                </div>
               

                <!-- longitud_m -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#longitud_m')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="longitud_m" type="text" name="longitud_m" required="" placeholder=" " value="${longitud_m_val}">
                    <label for="longitud_m">Longitud (metros)</label>
                </div>
               

                <!-- longitud_bonificada_m -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#longitud_bonificada_m')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="longitud_bonificada_m" type="text" name="longitud_bonificada_m" required="" placeholder=" " value="${longitud_bonificada_m_val}">
                    <label for="longitud_bonificada_m">Longitud bonificada (metros)</label>
                </div>


                <!-- envio_gratis -->
                <div id="wr_envio_gratis" class="wr_sel_opt_estado ${cl_envio_gratis}">
                    <h5>Envío gratis:</h5>
                    <select id="envio_gratis" class="sel_opt_find">
                        <option value="0">No</option>
                        <option value="1">Sí</option>
                    </select>
                </div>


                <!-- precio -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#precio')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="precio" type="text" name="precio" required="" placeholder=" " value="${precio_val}">
                    <label for="precio">Precio</label>
                </div>


                <!-- descripcion -->
                <div class="form_group">
                    <textarea id="descripcion" name="descripcion" rows="4" required="" placeholder=" ">${descripcion_val}</textarea>
                    <label class="lab_textarea" for="descripcion">Descripción</label>
                </div>

                ${ (['nuevo','editar'].includes(bono_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //envio_gratis
    const eid_envio_gratis = form_bono.querySelector('#envio_gratis');
    const eid_wr_envio_gratis = form_bono.querySelector('#wr_envio_gratis');

    eid_envio_gratis.value = objBono?.envio_gratis || 0;

    eid_envio_gratis.onchange = async (e) => {
        pintContenedorEnvioGratis(eid_wr_envio_gratis, eid_envio_gratis.value);
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(bono_action)){ 
        contenedor = contenedor_bono_sm;        
    }else{
        contenedor = form_bono;
        if(bono_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}

function pintContenedorEnvioGratis(contenedor, val){
    
    if(!contenedor){
        return;
    }

    if(['0','1'].includes(val)){
        if(val == '1'){
            contenedor.classList.remove('marcado_no');
            contenedor.classList.add('marcado_si');
        }
        else if(val == '0'){
            contenedor.classList.remove('marcado_si');
            contenedor.classList.add('marcado_no');
        }
    }else{
        contenedor.classList.remove('marcado_si');
        contenedor.classList.remove('marcado_no');
    }
}


async function guardarBono(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarBono() ===');
    
    if(event){
        console.log('hay event. no lo propago...')
        event.preventDefault();
    }

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `<span>${obj_lang.d315}</span>`;//Si no aceptas cookies no puedes crear una cuenta.
        //     aviso_text += ` <a onclick="showBlockCookies(); closeModal(null,true);">${obj_lang.d316}</a>.`;//Seleccionar Coockies
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        const form_bono = document.getElementById('form_bono');

        let nombre = form_bono?.querySelector('#nombre').value.trim();
        let descripcion = form_bono?.querySelector('#descripcion').value.trim();
        let longitud_m = form_bono?.querySelector('#longitud_m').value.trim();
        let longitud_bonificada_m = form_bono?.querySelector('#longitud_bonificada_m').value.trim();
        let envio_gratis = form_bono?.querySelector('#envio_gratis').value.trim();
        let precio = form_bono?.querySelector('#precio').value.trim();
    
        let errors = [];

        if(modo_guardar === 'fast'){
            nombre = objBono.nombre;
        }

        if(nombre == ''){
            errors.push('Nombre del bono');
        }
        if(longitud_m == ''){
            errors.push('Longitud del bono en metros');
        }
        if(precio == ''){
            errors.push('Precio del bono');
        }
       
        if(errors.length > 0){
            
            let error_text = '';
            errors.forEach(error => {
                error_text += `<p> - ${error}</p>`;
            });
            
            let aviso_text = `<p>Por favor, rellena los siguientes datos: </p> ${error_text}`;
            
            showToast('error', aviso_text, 50, 'center', true, 'Error en los campos introducidos');
            return;
        }


        const objBonoToSend = {
            id_bono: id_bono || null, //ya que se añade un nuevo bono, entonces no hay id_bono
            nombre,
            descripcion,
            longitud_m,
            longitud_bonificada_m,
            envio_gratis,
            precio,
        }
        console.log('objBonoToSend: ',objBonoToSend);
    
        const data = await insertarBonoDatos(objBonoToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_bono':
                    text_show = 'Datos del bono han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_bono':
                    text_show = 'Datos del bono han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_bono){
                console.log('id_bono: ', data.id_bono);
                id_bono = data.id_bono;//guardo el id del bono recién creada

                //Cojo datos del bono desde BD
                objBono = await getDataBonoFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objBono: ', objBono);

                const itemBonoUpdate = objDataBonos.arr_data?.find(item => item.id_bono == id_bono);
                if (itemBonoUpdate) {//es update del bono existente
    
                    Object.assign(itemBonoUpdate, objBono);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintBonoActiveSoloDatos();//en el contenedor_bonos

                } else {//es insert del bono nuevo
    
                    console.warn('No encontrado objBono.id_bono en objDataBonos.arr_data');
                    //entonces es un bono nuevo que se crea

                    //1.debo añadir objBono en objDataBonos.arr_data al inicio (si existe!)
                    objDataBonos?.arr_data?.unshift(objBono);

                    //2.debo aumentar el numero de total bonos (si existe!)
                    if (objDataBonos?.totalRows != null){
                        objDataBonos.totalRows++;
                    }

                    //3. old -> debo pintar d_bono en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintBonoOne(objBono, 'arriba');//div de bono se pinta al inicio (arriba)
                    loadBonosAll();
                }

                closeModal(null,true);
            }
           
        }else{

            let text_show = 'Error al guardar el bono.';
            console.log(text_show);
            console.error('data.error: ', data.error);

            showToast('error', text_show, 5000);

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarBono(). error: ',error);
    }

}

async function insertarBonoDatos(objBono) {
    console.log('=== function insertarBonoDatos(objBono) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objBono || Object.keys(objBono).length == 0){
            alert('No hay todos los parametros necesarios del bono...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objBono: ',objBono);

        const objBono_str = JSON.stringify(objBono);
        console.log('objBono_str: ',objBono_str);

        const nombre_fichero = 'insertar_datos_bono_one.php';

        const response = await fetch(`../app/php/datos/bono/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objBono_str
        });

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }
        console.log('text:', text);

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error ${nombre_fichero}) ${response.status}`);
        }

        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {
                console.log('success is true');

                return data;    
                
            } else {
                console.log('success is false');
                return 'no_hay_datos';              
            }

        } catch (error) {
            
            console.error(`❌ JSON inválido en ${nombre_fichero}`);
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                `JSON inválido en ${nombre_fichero}`,
                { cause: error }
            );
        }        

    } catch (error) {
        console.error('Error en la función insertarBonoDatos: ', error);
    }
}

async function deleteBono(event){
    console.log('=== function deleteBono() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_bono = objBono.id_bono;
        console.log('id_bono: ', id_bono);

        if(!id_bono){
            alert('id_bono no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el bono con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_bono}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objBono.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Descripción:</span> ${escaparHTML(objBono.descripcion) || '(sin descripcion)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar bono',
            pregunta,
            'confirmDelete',
            true,
            id_bono
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el bono...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteBonoFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Bono eliminado con éxito.';
            console.log(text_show);

            if(data.id_bono){
                console.log('id_bono: ', data.id_bono);

                const totalAntes = objDataBonos.arr_data.length;

                //elimino el objeto del bono eliminado desde objeto de todos los bonos encontrados usando filter
                objDataBonos.arr_data = objDataBonos.arr_data.filter(
                    item => item.id_bono !== id_bono
                );

                const totalDespues = objDataBonos.arr_data.length;
                const bono_is_deleted = totalDespues < totalAntes;

                if(bono_is_deleted){
                    console.log('bono eliminado de objDataBonos');
                }else{
                    console.log('bono NO eliminado de objDataBonos');
                }

                //Elimino elemento d_bono de los bonos encontrados en 'contenedor_bonos'
                eid_contenedor_bonos.querySelector(`.d_bono[data-id_bono="${id_bono}"]`).remove();
                eid_block_bonos.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_bono = null;
                objBono = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                loadBonosAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar el bono.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteBono. error: ',error);        
    }

}

async function deleteBonoFromBd(){
    console.log('=== function deleteBonoFromBd() ===');

    try {
        
        if(!hay_id(id_bono, 'id_bono', 'deleteBonoFromBd()')){
            return; // <- se detiene aquí si no hay id_bono
        }

        const nombre_fichero = 'eliminar_datos_bono_one.php';
               
        const response = await fetch(`../app/php/datos/bono/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_bono: id_bono
            }), // Convertir los datos a formato JSON
        });


        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        console.log('text:', text);

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error ${nombre_fichero}) ${response.status}`);
        }

        try {

            const data = JSON.parse(text);
            console.log('data:', data);   
    
            if(data.success){
                console.log('success is true');   
                console.log(`[ELIMINADO] id_bono: [${data.id_bono}] --- nombre: [${data.nombre}]`);
    
                return data;
    
            }else{
                console.log('success is false');
                return data;
            }

        } catch (error) {
            
            console.error(`❌ JSON inválido en ${nombre_fichero}`);
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                `JSON inválido en ${nombre_fichero}`,
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en deleteBonoFromBd(): error.message: ', error.message);
    }
}


function pintBonoActive(){//click en div del contenedor de bonos que ya están en el DOM
    console.log('=== function pintBonoActive(e) === ');

    console.log('asignado global --- id_bono: ', id_bono);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_bonos, 'd_bono');
    eid_contenedor_bonos.querySelector(`.d_bono[data-id_bono="${id_bono}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_bono viene como string: "925"
    objBono = objDataBonos.arr_data.find(v => v.id_bono == id_bono);
    console.log('objBono: ', objBono);

    pintBonoActiveSoloDatos();

}

async function loadBonosAll(){
    console.log('=== function loadBonosAll() === ');

    objDataBonos = await getBonosAll();

    const wr_filtros_aplicados_inner = document.createElement('div');
    wr_filtros_aplicados_inner.className = 'wr_filtros_aplicados_inner';
    wr_filtros_aplicados_inner.innerHTML = `
        <div class="fa_busqueda">
            <span>Mostrado:</span>
        </div>

        <div class="fa_option">
            <span>Todos registros</span>
        </div>   
    `;
    
    const objDataPint = {
        f_frase: '(Todos bonos)',
        f_num: objDataBonos?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_bonos, objDataPint);
    
    pintBonosAll();

}

async function pintBonosAll(){//pintar todos los div de bonos, o al load o al find
    console.log('=== function pintBonosAll() === '); 
    
    console.time('time_pintBonosAlll');

    // if(!objDataBonos?.arr_data?.length){//si length === 0, entonces no hay bonos
    //     console.warn('No hay bonos en objDataBonos.arr_data');
    //     return;
    // }

    eid_contenedor_bonos.innerHTML = '';//reset contenedor de bonos

    const hay_datos = (esObjeto(objDataBonos) && objDataBonos.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_bonos.innerHTML = `
            <p class="prim">No existe ningún registro de bono en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataBonos: ', objDataBonos);        
        
        //eid_titulo_tabla_song.querySelector('b').style.display = 'inline';
        //eid_titulo_tabla_song.querySelector('b').textContent = objDataSongs.arr_data.length;        
        
        //eid_sp_icon_filtro.classList.remove('d-none');//muestro el boton de filtro
        
        /*
        //Parametros para filtrar resultados de buscar
        const contenedor_filtro = eid_d_filter_results;
        const sp_icon_filtro = eid_sp_icon_filtro;
        const el_input = eid_inpt_filter;
        // const selector_items = '.tr_song';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const selector_items = '.p_song';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const arr_spans = [
            '.l_title',    
            '.l_title2',    
            '.l_title_note',    
            '.l_id',    
            '.l_idioma',    
            '.l_tune',    
            '.l_tune_transpose',    
            // '.td_id_song',    
            // '.td_numero',    
            // '.td_titulo',    
            // '.td_esquema',    
            // '.td_category',    
            // '.td_songbook',    
            // '.td_idioma',  
            // '.td_tonalidad'
        ];//se buscará texto en cada elemento de estos span's
        addFilterListener(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans);
        */

        //CREAR DIV'S Y P'S
        //Recorrer bonos encontradas... 
        objDataBonos.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintBonoOne(obj, 'abajo');//cada div de bono se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintBonosAlll');
   
}


function pintBonoOne(objBonoOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un bono, o al load, o al crear, o al find
    console.log('=== function pintBonoOne() === ');

    if(!objBonoOne){
        console.warn('No hay objeto de bono. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objBonoOne.descripcion) ? '' : 'd-none';//si no hay título, lo oculto
    
    const longitud_m_text = (objBonoOne.longitud_m) ? `${objBonoOne.longitud_m} m` : '--' ;
    const precio_text = (objBonoOne.precio) ? `${objBonoOne.precio} €` : '--' ;

    const d_bono = document.createElement('div');
    d_bono.className = 'd_bono d_art';
    d_bono.dataset.id_bono = objBonoOne.id_bono;
    d_bono.dataset.tipo_art = 'bono';
    d_bono.innerHTML = `
        <div class="datos_bono datos_art">
            <div class="da_nombre">${escaparHTML(objBonoOne.nombre) || '(nombre no asignado)'}</div>
            <div class="da_com ${cl_da_comm}">${escaparHTML(objBonoOne.descripcion) || '(sin descripcion)'}</div>
        </div>
        <div class="art_cols art_col3">
            <div class="da_longitud_m">${longitud_m_text}</div>
        </div>
        <div class="art_cols art_col4">
            <div class="da_precio">${precio_text}</div>
        </div>


        <div class="tres_puntos">
            <img class="btn_img" src="./images/tres_puntos_vertical_white.svg">
        </div>

        <div class="tres_puntos_menu">
            <div class="d_ver">
                <img class="img_acts img_ver" src="./images/img_ver_white_24x24.png">
            </div>
            <div class="d_editar">
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            </div>
            <div class="d_eliminar">
                <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
            </div>
        </div>    
    `;

    d_bono.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_bono = e.currentTarget.dataset.id_bono;
        console.log('asigno global --- id_bono: ', id_bono); 

        // siempre al clicar en cualquier parte del d_bono se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintBonoActive();
        

        //tres_puntos
        if(e.target.classList.contains('tres_puntos') || e.target.closest('.tres_puntos')){
            console.log('clic en el boton de opciones (tres puntos)');
            e.stopPropagation();//evito que el click se propague al document y cierre el modal si está abierto

            const tresPuntos = e.target.closest('.tres_puntos');

            //elemento clickeado es el 'tres_puntos'
            if (tresPuntos) {
                hideShowTresPuntosMenu(tresPuntos);
                return;
            }

            const menuShown = document.querySelector('.tres_puntos_menu.shown');

            if (menuShown && !menuShown.contains(e.target)) {
                menuShown.classList.remove('shown');
            }
            
        }else {
            console.log('clic fuera de (tres puntos)');

            let mostrar_por_defecto = false;
            let mostrar_ver = false;
            let mostrar_editar = false;
            let mostrar_eliminar = false;

            //clic dentro de d_bono y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_bono y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_bono - MIRAR SI HACE FALTA PARA LUEGO!!!
                // if(e.target.classList.contains('l_id') || e.target.closest('.l_id')){//clic en el id_song
                //     console.log('clic en el id de la cancion'); 
                //     showBlockName('esquema');
                //     showVklad(document.getElementById('btn_select_slide'),'select_slide');
                // }
                
                if(e.target.classList.contains('d_ver') || e.target.closest('.d_ver')){//clic en el boton de ver
                    console.log('clic en el boton de ver');
                    mostrar_ver = true;
                }
                else if(e.target.classList.contains('d_editar') || e.target.closest('.d_editar')){//clic en el boton de editar
                    console.log('clic en el boton de editar');
                    mostrar_editar = true;
                }
                else if(e.target.classList.contains('d_eliminar') || e.target.closest('.d_eliminar')){//clic en el boton de eliminar
                    console.log('clic en el boton de eliminar');
                    mostrar_eliminar = true;
                }

            }

            //acción
            if(mostrar_por_defecto || mostrar_ver){
                openModal('full','Bono actual',null,'buildBono',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Bono actual',null,'buildBono',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Bono actual',null,'buildBono',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_bonos.append(d_bono);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_bonos.prepend(d_bono);
    }
}


async function findWordsBono(){
    console.log('=== async function findWordsBono() ===');
    console.time('time_findWordsBono');

    const eid_inpt_find_bono = document.getElementById('inpt_find_bono');
    const eid_modo_bono = document.getElementById('modo_bono');
    const eid_buscar_en_bono = document.getElementById('buscar_en_bono');
    const eid_regs_finded_bono = document.getElementById('regs_finded_bono');

    let words_input_trimed = eid_inpt_find_bono.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_bono.value;
    let buscar_en = eid_buscar_en_bono.value;
    //console.log('--- words_input: ', words_input);

    if(words_input == ''){
        console.log('1. no has introducido nada....');
        let aviso_text = `<p>No has introducido nada en el campo de búsqueda. Por favor, introduce texto para buscar.</p>`;
            
        showToast('warn', aviso_text, 50, 'center', true, 'Rellena el campo de búsqueda');
        return;
    }
    
    //reasigno arr_words global
    if(words_input.includes(' ')){
        arr_words = words_input.split(' ');
    }else{
        arr_words = [words_input];
    }

    if(arr_words.length === 0){
        console.log('2. no has introducido nada....');
        let aviso_text = `<p>No has introducido nada en el campo de búsqueda. Por favor, introduce texto para buscar.</p>`;
            
        showToast('warn', aviso_text, 50, 'center', true, 'Rellena el campo de búsqueda');
        return;
    }

    objFindParamsBono.words_input = words_input;
    objFindParamsBono.modo = modo;
    objFindParamsBono.buscar_en = buscar_en;
    objFindParamsBono.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataBonosFinded = await getDataBonosFromBdByFind(objFindParamsBono);
    console.log('objDataBonosFinded: ', objDataBonosFinded);   

    
    const hay_coincidencias = (esObjeto(objDataBonosFinded) && objDataBonosFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsBono.findedRows = 0;

        eid_regs_finded_bono.classList.remove('d-none');
        eid_regs_finded_bono.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay bonos...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsBono.findedRows = objDataBonosFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_bono.classList.remove('d-none');
        eid_regs_finded_bono.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataBonosFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_bono" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_bono.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_bono') {
                console.log('clic en btn_mostrar_finded_bono');
                console.log('mostrar clicked -> reasigno objDataBonos desde objDataBonosFinded'); 
                
                //Clono objeto
                objDataBonos = structuredClone(objDataBonosFinded);
                console.log('objDataBonos: ', objDataBonos);



                const modo_val = objModoBusquedaBono[`modo${objFindParamsBono.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaBono[`buscar_en${objFindParamsBono.buscar_en}`].titulo;

                const wr_filtros_aplicados_inner = document.createElement('div');
                wr_filtros_aplicados_inner.className = 'wr_filtros_aplicados_inner';
                wr_filtros_aplicados_inner.innerHTML = `
                    <div class="fa_busqueda">
                        <span>Tu búsqueda:</span>
                    </div>
            
                    <div class="fa_option">
                        <span>${modo_val}</span>
                    </div>   

                    <div class="fa_option">
                        <span>${buscar_en_val}</span>
                    </div>   
                `;

                const objDataPint = {
                    f_frase: objFindParamsBono.words_input,
                    f_num: objFindParamsBono.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_bonos, objDataPint);               
                                
                pintBonosAll();
                closeModal(null,true);
            }
        }
        
        //eid_sp_icon_filtro.classList.remove('d-none');//muestro el boton de filtro ?
        
        /*
        //Parametros para filtrar resultados de buscar
        const contenedor_filtro = eid_d_filter_results;
        const sp_icon_filtro = eid_sp_icon_filtro;
        const el_input = eid_inpt_filter;
        // const selector_items = '.tr_song';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const selector_items = '.p_song';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const arr_spans = [
            '.l_title',    
            '.l_title2',    
            '.l_title_note',    
            '.l_id',    
            '.l_idioma',    
            '.l_tune',    
            '.l_tune_transpose',    
            // '.td_id_song',    
            // '.td_numero',    
            // '.td_titulo',    
            // '.td_esquema',    
            // '.td_category',    
            // '.td_songbook',    
            // '.td_idioma',  
            // '.td_tonalidad'
        ];//se buscará texto en cada elemento de estos span's
        addFilterListener(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans);
        */      

    }

    await update_objFindParamsBono();

    console.timeEnd('time_findWordsBono');
}


async function getBonosAll(){
    console.log('=== async function getBonosAll() ===');
    console.time('time_getBonosAll');

    objDataBonosBd = await getDataBonosAllFromBd();//la funcion que saca todos los bono para pintarlo
    console.log('objDataBonosBd: ', objDataBonosBd);

    console.timeEnd('time_getBonosAll');

    return objDataBonosBd;

}


async function crear_objDataBonos(){
    console.log('=== function crear_objDataBonos() ===');
    console.time('time_crear_objDataBonos');

    objDataBonos = await getDataBonosAllFromBd();
    console.log(`objDataBonos: `, objDataBonos);

    console.timeEnd('time_crear_objDataBonos');
}

async function getDataBonosAllFromBd(){//sacar TODOS los bonos para rellenar contenedor_bonos
    console.log('=== function getDataBonosAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_bonos_all.php';
        
        const response = await fetch(`../app/php/datos/bono/${nombre_fichero}`, {
            method: 'POST' //usare POST. no mando ningun dato. no hay que poner ni headers, ni body
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        console.log('text:', text);

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error ${nombre_fichero}) ${response.status}`);
        }

        try {

            const data = JSON.parse(text);
            console.log('data:', data);   
    
            if (data.success) {
                console.log('success is true');

                let arr_data = data.arr_data;
                console.log(`arr_data: `, arr_data);

                return data;        
                
            } else {

                console.log('success is false');
                return 'no_hay_datos';                         
    
            }

        } catch (error) {
            
            console.error(`❌ JSON inválido en ${nombre_fichero}`);
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                `JSON inválido en ${nombre_fichero}`,
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en getDataBonosAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarBono(){
    console.log('=== function buildBuscarBono() ===');

    console.log('objBono: ', objBono);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_bono"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsBono?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_bono')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsBono()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_bono" class="sel_opt_find">
                <option value="1">1) Palabras PARCIALES, cualquier orden</option>
                <option value="2">2) Palabras EXACTAS, cualquier orden</option>

                <option value="3">3) Coincidir al menos una palabra PARCIAL, cualquier orden</option>
                <option value="4">4) Coincidir al menos una palabra EXACTA, cualquier orden</option>

                <option value="5">5) Palabras PARCIALES, respetando orden</option>
                <option value="6">6) Palabras EXACTAS, respetando orden</option>

                <option value="7">7) Frase EXACTA</option>
            </select>

            <div id="modo_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div class="wr_sel_opt_find">
            <h5>Buscar en:</h5>
            <select id="buscar_en_bono" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de bono</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_bono" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_bono');
    
    //modo
    const eid_modo_bono = wr_args_busqueda.querySelector('#modo_bono');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsBono
    eid_modo_bono.value = objFindParamsBono?.modo || 1 ;

    eid_modo_bono.onchange = async (e) => {
        findWordsBono();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaBono[`modo${objFindParamsBono.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaBono[`modo${objFindParamsBono.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_bono = wr_args_busqueda.querySelector('#buscar_en_bono');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsBono
    eid_buscar_en_bono.value = objFindParamsBono?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaBono[`buscar_en${objFindParamsBono.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaBono[`buscar_en${objFindParamsBono.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_bono.onchange = async (e) => {
        findWordsBono();
    }


    //al teclear texto en la busqueda de bono
    let timeoutFindBono;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindBono);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindBono = setTimeout(async () => {
            await findWordsBono();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataBonosFromBdByFind(objFindParamsBono){
    console.log('=== function getDataBonosFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsBono;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_bonos_by_find.php';
               
        const response = await fetch(`../app/php/datos/bono/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                words_input,
                modo,
                buscar_en
            }), // Convertir los datos a formato JSON
        });

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        console.log('text:', text);

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error ${nombre_fichero}) ${response.status}`);
        }

        try {

            const data = JSON.parse(text);
            console.log('data:', data);   
    
            if (data.success) {
                console.log('success is true');

                let arr_data = data.arr_data;
                console.log(`arr_data: `, arr_data);

                return data;        
                
            } else {

                console.log('success is false');
                return 'no_hay_datos';                         
    
            }

        } catch (error) {
            
            console.error(`❌ JSON inválido en ${nombre_fichero}`);
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                `JSON inválido en ${nombre_fichero}`,
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en getDataBonosFromBdByFind(): error.message: ', error.message);
    }
}


function pintBonoActiveSoloDatos(){
    console.log('=== function pintBonoActiveSoloDatos() === ');

    if(!objBono){
        alert('no hay objBono');
        return;
    }

    const d_bono = eid_contenedor_bonos.querySelector(`.d_bono[data-id_bono="${objBono.id_bono}"]`);
    console.log('d_bono: ', d_bono);
    
    if(!d_bono){
        console.log('no hay d_bono. no actualizo d_bono...');
        return;
    }

    const div_da_nombre = d_bono.querySelector('.da_nombre');
    const div_da_com = d_bono.querySelector('.da_com');
    const div_da_longitud_m = d_bono.querySelector('.da_longitud_m');
    const div_da_precio = d_bono.querySelector('.da_precio');

    const longitud_m_text = (objBono.longitud_m) ? `${objBono.longitud_m} m` : '--' ;
    const precio_text = (objBono.precio) ? `${objBono.precio} €` : '--' ;


    //nombre
    div_da_nombre.textContent = objBono.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //longitud_m
    div_da_longitud_m.textContent = longitud_m_text;
    div_da_longitud_m.classList.remove('d-none');//muestro tenga o no el precio

    //precio
    div_da_precio.textContent = precio_text;
    div_da_precio.classList.remove('d-none');//muestro tenga o no el precio

    //descripcion
    div_da_com.textContent = objBono.descripcion || '(sin descripcion)';
    //si '!objBono.descripcion' es true  (no tiene descripcion) -> pone  'd-none' -> oculta
    //si '!objBono.descripcion' es false (sí tiene descripcion) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objBono.descripcion);

}

async function getDataBonoFromBd(){
    console.log('=== function getDataBonoFromBd() ===');

    try {
        
        if(!hay_id(id_bono, 'id_bono', 'getDataBonoFromBd()')){
            return; // <- se detiene aquí si no hay id_bono
        }

        const nombre_fichero = 'obtener_datos_bono_one.php';
     
        const response = await fetch(`../app/php/datos/bono/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_bono: id_bono
            }), // Convertir los datos a formato JSON
        });

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }
        console.log('text:', text);

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error ${nombre_fichero}) ${response.status}`);
        }

        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {
                console.log('success is true');

                console.log(`id_bono: [${id_bono}] --- nombre: [${data.nombre}]`);

                return data;    
                
            } else {
                console.log('success is false');
                return 'no_hay_datos';              
            }

        } catch (error) {
            
            console.error(`❌ JSON inválido en ${nombre_fichero}`);
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                `JSON inválido en ${nombre_fichero}`,
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en getDataBonoFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsBono(){
    console.log('=== function update_objFindParamsBono() ===');

    obj_ajustes.objFindParamsBono = objFindParamsBono;
    await update_obj_ajustes();
}