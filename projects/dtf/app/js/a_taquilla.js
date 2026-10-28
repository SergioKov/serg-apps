//taquilla
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildTaquilla(taquilla_action = null){
    console.log('=== function buildTaquilla() ===');

    console.log('taquilla_action: ', taquilla_action);
    console.log('objTaquilla: ', objTaquilla);

    eid_bl_modalFullInner.innerHTML = '';//reset

    //campos de input
    let id_taquilla_val = '';
    let nombre_val = '';
    let comentario_val = '';

    let codigo_taquilla_val = '';
    let codigo_apertura_val = '';

    //elemento de título en el top
    const p_mensaje = document.createElement('p');
    p_mensaje.className = 'mensaje';
        
    //otras vars
    let cl_id_taquilla = 'd-none';//oculto
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(taquilla_action == 'nuevo'){//si es nueva
        
        //mostrarPrim = false;    
        //ocultarElementosPrimEn(lista_option_inner);
        //ocultarElementosEditablesEn(lista_option_inner);
        //mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit 

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id(id_taquilla, 'id_taquilla', 'buildTaquilla()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ninguna taquilla.</p>
                <p class="p_aviso">Crea una taquilla pulsando "+".</p>
            `;
            openModal('center','Aviso Taquilla',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_taquilla
        } 
        id_taquilla_val = objTaquilla.id_taquilla;
        nombre_val = escaparHTML(objTaquilla.nombre) || '';
        comentario_val = escaparHTML(objTaquilla.comentario) || '';
        codigo_taquilla_val = escaparHTML(objTaquilla.codigo_taquilla) || '';
        codigo_apertura_val = escaparHTML(objTaquilla.codigo_apertura) || '';
    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(taquilla_action)){
        p_mensaje.innerHTML = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_taquilla}</b></span>
            </span>
        `;

        const wr_img_editar_en_ver = document.createElement('span');
        wr_img_editar_en_ver.className = 'wr_img_editar_en_ver';
        wr_img_editar_en_ver.dataset.action = taquilla_action;

        if(taquilla_action == 'ver'){
            wr_img_editar_en_ver.innerHTML = `
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            `;
        } else if (taquilla_action == 'editar'){
            wr_img_editar_en_ver.innerHTML = `
            <img class="img_acts img_eliminar" src="./images/img_eliminar_white_24x24.png">
            `;
        }

        p_mensaje.append(wr_img_editar_en_ver);
    }

    switch (taquilla_action) {
        case 'nuevo'://Nueva Taquilla
            p_mensaje.innerHTML = `
                <span>Rellena los campos del formulario con los datos de una taquilla <b class="c_blue">NUEVA</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_taquilla
            if(id_taquilla){
                id_taquilla = null;//reset ya que se va a crear un id_taquilla nuevo
            }else{
                //id_taquilla es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objTaquilla = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            //resetBlockLista();        
            break;
        
        default:
        case 'ver'://Ver Taquilla - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_taquilla = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            break;

        case 'editar'://Editar Taquilla - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Taquilla - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_taquilla = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'eliminar'
            break;
    }
    


    //Comentario si hay
    let comentario_detalles = '';
    if(comentario_val){
        comentario_detalles = document.createElement('div');
        comentario_detalles.className = 's_detalles ';
        comentario_detalles.innerHTML = `
            <p class="p_titulo" onclick="hideShowBlock('l_notes_detalles_sm');">Comentario</p>
            <p id="l_notes_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">            
                    <span class="linea_fx ">
                        <span>${comentario_val}</span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>
        `;
    }

    //Botones ELIMINAR - SM
    const wr_btns_eliminar = document.createElement('div');
    wr_btns_eliminar.className = 'wr_btns_eliminar';
    wr_btns_eliminar.innerHTML = `
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteTaquilla(event);">Eliminar Taquilla DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_taquilla_sm = document.createElement('div'); 
    contenedor_taquilla_sm.id = 'contenedor_taquilla_sm';
    contenedor_taquilla_sm.className = 'contenedor_form_sm';
    contenedor_taquilla_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Taquilla <span class="f_r ${cl_id_taquilla}">id: ${id_taquilla_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx ${!codigo_taquilla_val ? 'd-none' : ''}">
                        <span class="cl_campo">Código taquilla:</span>
                        <span>${codigo_taquilla_val}</span>
                    </span>
                    <span class="linea_fx ${!codigo_apertura_val ? 'd-none' : ''}">
                        <span class="cl_campo">Código apertura:</span>
                        <span>${codigo_apertura_val}</span>
                    </span>

                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(comentario_val) ? comentario_detalles.outerHTML : '' }
        
        ${(taquilla_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarTaquilla(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_taquilla = document.createElement('div');
    form_taquilla.id = 'form_taquilla';
    form_taquilla.innerHTML = `
        <div class="form_container">
            <form>
                
                <!-- titulo -->
                ${p_mensaje.outerHTML}


                <!-- nombre -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#nombre')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="nombre" type="text" name="nombre" required="" placeholder=" " value="${nombre_val}">
                    <label for="nombre">Nombre de la taquilla</label>
                </div>
               

                <!-- codigo_taquilla -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#codigo_taquilla')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="codigo_taquilla" type="text" name="codigo_taquilla" required="" placeholder=" " value="${codigo_taquilla_val}">
                    <label for="codigo_taquilla">Código taquilla (identificación)</label>
                </div>


                <!-- codigo_apertura -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#codigo_apertura')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="codigo_apertura" type="text" name="codigo_apertura" required="" placeholder=" " value="${codigo_apertura_val}">
                    <label for="codigo_apertura">Código apertura</label>
                </div>


                <!-- estado_taquilla -->
                <div id="wr_estado_taquilla" class="wr_sel_opt_estado ${objTaquilla?.estado_taquilla || ''}">
                    <h5>Estado de taquilla:</h5>
                    <select id="estado_taquilla" class="sel_opt_find">
                        <option value="libre">Libre</option>
                        <option value="ocupado">Ocupado</option>
                    </select>
                </div>


                <!-- comentario -->
                <div class="form_group">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#comentario')">
                        <img src="images/x_white.png">
                    </div>
                    <textarea id="comentario" name="comentario" rows="4" required="" placeholder=" ">${comentario_val}</textarea>
                    <label class="lab_textarea" for="comentario">Comentario</label>
                </div>


                ${ (['nuevo','editar'].includes(taquilla_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //añado action onclick a wr_img_editar_en_ver
    const element_wr_img_editar_en_ver = form_taquilla.querySelector('.wr_img_editar_en_ver');
    if(element_wr_img_editar_en_ver){
        element_wr_img_editar_en_ver.onclick = (e) => {
            if(e.currentTarget.dataset.action == 'ver'){
                openModal('full','Editar Taquilla actual',null,'buildTaquilla',true,'editar');//llamo editar
            }
            if(e.currentTarget.dataset.action == 'editar') {
                openModal('full','Eliminar Taquilla actual',null,'buildTaquilla',true,'eliminar');//llamo eliminar
            }
        }
    }

    //estado_taquilla
    const eid_estado_taquilla = form_taquilla.querySelector('#estado_taquilla');
    const eid_wr_estado_taquilla = form_taquilla.querySelector('#wr_estado_taquilla');
    eid_estado_taquilla.value = objTaquilla?.estado_taquilla || '';
    eid_estado_taquilla.onchange = async (e) => {
        pintContenedorEstado(eid_wr_estado_taquilla, eid_estado_taquilla.value);
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(taquilla_action)){ 
        contenedor = contenedor_taquilla_sm;        
    }else{
        contenedor = form_taquilla;
        if(taquilla_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}


async function guardarTaquilla(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarTaquilla() ===');
    
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

        const form_taquilla = document.getElementById('form_taquilla');

        let nombre = form_taquilla?.querySelector('#nombre').value.trim();
        let comentario = form_taquilla?.querySelector('#comentario').value.trim();
        let codigo_taquilla = form_taquilla?.querySelector('#codigo_taquilla').value.trim();
        let codigo_apertura = form_taquilla?.querySelector('#codigo_apertura').value.trim();
        let estado_taquilla = form_taquilla?.querySelector('#estado_taquilla').value.trim();
    
        let errors = [];

        if(modo_guardar === 'fast'){
            nombre = objTaquilla.nombre;
        }

        if(nombre == ''){
            errors.push('Nombre de la taquilla');
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


        const objTaquillaToSend = {
            id_taquilla: id_taquilla || null, //ya que se añade un nuevo taquilla, entonces no hay id_taquilla
            nombre,
            comentario,
            codigo_taquilla,
            codigo_apertura,
            estado_taquilla,
        }
        console.log('objTaquillaToSend: ',objTaquillaToSend);
    
        const data = await insertarTaquillaDatos(objTaquillaToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_taquilla':
                    text_show = 'Datos del taquilla han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_taquilla':
                    text_show = 'Datos del taquilla han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_taquilla){
                console.log('id_taquilla: ', data.id_taquilla);
                id_taquilla = data.id_taquilla;//guardo el id del taquilla recién creada

                //Cojo datos del taquilla desde BD
                objTaquilla = await getDataTaquillaFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objTaquilla: ', objTaquilla);

                const itemTaquillaUpdate = objDataTaquillas?.arr_data?.find(item => item.id_taquilla == id_taquilla);
                if (itemTaquillaUpdate) {//es update del taquilla existente
    
                    Object.assign(itemTaquillaUpdate, objTaquilla);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintTaquillaActiveSoloDatos();//en el contenedor_taquillas

                } else {//es insert del taquilla nuevo
    
                    console.warn('No encontrado objTaquilla.id_taquilla en objDataTaquillas.arr_data');
                    //entonces es un taquilla nuevo que se crea

                    //1.debo añadir objTaquilla en objDataTaquillas.arr_data al inicio (si existe!)
                    objDataTaquillas?.arr_data?.unshift(objTaquilla);

                    //2.debo aumentar el numero de total taquillas (si existe!)
                    if (objDataTaquillas?.totalRows != null){
                        objDataTaquillas.totalRows++;
                    }

                    //3. old -> debo pintar d_taquilla en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintTaquillaOne(objTaquilla, 'arriba');//div de taquilla se pinta al inicio (arriba)
                    loadTaquillasAll();
                }

                closeModal(null,true);
            }
           
        }else{

            let text_show = 'Error al guardar el taquilla.';
            console.log(text_show);
            console.error('data.error: ', data.error);

            showToast('error', text_show, 5000);

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarTaquilla(). error: ',error);
    }

}

async function insertarTaquillaDatos(objTaquilla) {
    console.log('=== function insertarTaquillaDatos(objTaquilla) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objTaquilla || Object.keys(objTaquilla).length == 0){
            alert('No hay todos los parametros necesarios de la taquilla...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objTaquilla: ',objTaquilla);

        const objTaquilla_str = JSON.stringify(objTaquilla);
        console.log('objTaquilla_str: ',objTaquilla_str);

        const nombre_fichero = 'insertar_datos_taquilla_one.php';

        const response = await fetch(`../app/php/datos/taquilla/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objTaquilla_str
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
    
            return data;

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
        console.error('Error en la función insertarTaquillaDatos: ', error);
    }
}

async function deleteTaquilla(event){
    console.log('=== function deleteTaquilla() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_taquilla = objTaquilla.id_taquilla;
        console.log('id_taquilla: ', id_taquilla);

        if(!id_taquilla){
            alert('id_taquilla no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE la taquilla con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_taquilla}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objTaquilla.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Comentario:</span> ${escaparHTML(objTaquilla.comentario) || '(sin comentario)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar taquilla',
            pregunta,
            'confirmDelete',
            true,
            id_taquilla
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar la taquilla...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteTaquillaFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Taquilla eliminada con éxito.';
            console.log(text_show);

            if(data.id_taquilla){
                console.log('id_taquilla: ', data.id_taquilla);

                const totalAntes = objDataTaquillas.arr_data.length;

                //elimino el objeto del taquilla eliminado desde objeto de todos los taquillas encontrados usando filter
                objDataTaquillas.arr_data = objDataTaquillas.arr_data.filter(
                    item => item.id_taquilla !== id_taquilla
                );

                const totalDespues = objDataTaquillas.arr_data.length;
                const taquilla_is_deleted = totalDespues < totalAntes;

                if(taquilla_is_deleted){
                    console.log('taquilla eliminada de objDataTaquillas');
                }else{
                    console.log('taquilla NO eliminada de objDataTaquillas');
                }

                //Elimino elemento d_taquilla de los taquillas encontrados en 'contenedor_taquillas'
                eid_contenedor_taquillas.querySelector(`.d_taquilla[data-id_taquilla="${id_taquilla}"]`).remove();
                eid_block_taquillas.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_taquilla = null;
                objTaquilla = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                loadTaquillasAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar la taquilla.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteTaquilla. error: ',error);        
    }

}

async function deleteTaquillaFromBd(){
    console.log('=== function deleteTaquillaFromBd() ===');

    try {
        
        if(!hay_id(id_taquilla, 'id_taquilla', 'deleteTaquillaFromBd()')){
            return; // <- se detiene aquí si no hay id_taquilla
        }

        const nombre_fichero = 'eliminar_datos_taquilla_one.php';
               
        const response = await fetch(`../app/php/datos/taquilla/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_taquilla: id_taquilla
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
                console.log(`[ELIMINADO] id_taquilla: [${data.id_taquilla}] --- nombre: [${data.nombre}]`);
    
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
        console.error('Error en deleteTaquillaFromBd(): error.message: ', error.message);
    }
}


function pintTaquillaActive(){//click en div del contenedor de taquillas que ya están en el DOM
    console.log('=== function pintTaquillaActive(e) === ');

    console.log('asignado global --- id_taquilla: ', id_taquilla);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_taquillas, 'd_taquilla');
    eid_contenedor_taquillas.querySelector(`.d_taquilla[data-id_taquilla="${id_taquilla}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_taquilla viene como string: "925"
    objTaquilla = objDataTaquillas.arr_data.find(v => v.id_taquilla == id_taquilla);
    console.log('objTaquilla: ', objTaquilla);

    pintTaquillaActiveSoloDatos();

}

async function loadTaquillasAll(){
    console.log('=== function loadTaquillasAll() === ');

    objDataTaquillas = await getTaquillasAll();

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
        f_frase: '(Todos taquillas)',
        f_num: objDataTaquillas?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_taquillas, objDataPint);
    
    pintTaquillasAll();

}

async function pintTaquillasAll(){//pintar todos los div de taquillas, o al load o al find
    console.log('=== function pintTaquillasAll() === '); 
    
    console.time('time_pintTaquillasAlll');

    // if(!objDataTaquillas?.arr_data?.length){//si length === 0, entonces no hay taquillas
    //     console.warn('No hay taquillas en objDataTaquillas.arr_data');
    //     return;
    // }

    eid_contenedor_taquillas.innerHTML = '';//reset contenedor de taquillas

    const hay_datos = (esObjeto(objDataTaquillas) && objDataTaquillas.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_taquillas.innerHTML = `
            <p class="prim">No existe ningún registro de taquilla en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataTaquillas: ', objDataTaquillas);        
        
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
        //Recorrer taquillas encontradas... 
        objDataTaquillas.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintTaquillaOne(obj, 'abajo');//cada div de taquilla se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintTaquillasAlll');
   
}


function pintTaquillaOne(objTaquillaOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un taquilla, o al load, o al crear, o al find
    console.log('=== function pintTaquillaOne() === ');

    if(!objTaquillaOne){
        console.warn('No hay objeto de taquilla. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objTaquillaOne.comentario) ? '' : 'd-none';//si no hay título, lo oculto 

    const d_taquilla = document.createElement('div');
    d_taquilla.className = `d_taquilla d_art ${objTaquillaOne.estado_taquilla || ''}`;
    d_taquilla.dataset.id_taquilla = objTaquillaOne.id_taquilla;
    d_taquilla.dataset.tipo_art = 'taquilla';
    d_taquilla.innerHTML = `
        <div class="datos_taquilla datos_art">
            <div class="da_nombre">${escaparHTML(objTaquillaOne.nombre) || '(nombre no asignado)'}</div>
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

    d_taquilla.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_taquilla = e.currentTarget.dataset.id_taquilla;
        console.log('asigno global --- id_taquilla: ', id_taquilla); 

        // siempre al clicar en cualquier parte del d_taquilla se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintTaquillaActive();
        

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

            //clic dentro de d_taquilla y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_taquilla y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_taquilla - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Taquilla actual',null,'buildTaquilla',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Taquilla actual',null,'buildTaquilla',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Taquilla actual',null,'buildTaquilla',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_taquillas.append(d_taquilla);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_taquillas.prepend(d_taquilla);
    }
}


async function findWordsTaquilla(){
    console.log('=== async function findWordsTaquilla() ===');
    console.time('time_findWordsTaquilla');

    const eid_inpt_find_taquilla = document.getElementById('inpt_find_taquilla');
    const eid_modo_taquilla = document.getElementById('modo_taquilla');
    const eid_buscar_en_taquilla = document.getElementById('buscar_en_taquilla');
    const eid_regs_finded_taquilla = document.getElementById('regs_finded_taquilla');

    let words_input_trimed = eid_inpt_find_taquilla.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_taquilla.value;
    let buscar_en = eid_buscar_en_taquilla.value;
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

    objFindParamsTaquilla.words_input = words_input;
    objFindParamsTaquilla.modo = modo;
    objFindParamsTaquilla.buscar_en = buscar_en;
    objFindParamsTaquilla.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataTaquillasFinded = await getDataTaquillasFromBdByFind(objFindParamsTaquilla);
    console.log('objDataTaquillasFinded: ', objDataTaquillasFinded);   

    
    const hay_coincidencias = (esObjeto(objDataTaquillasFinded) && objDataTaquillasFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsTaquilla.findedRows = 0;

        eid_regs_finded_taquilla.classList.remove('d-none');
        eid_regs_finded_taquilla.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay taquillas...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsTaquilla.findedRows = objDataTaquillasFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_taquilla.classList.remove('d-none');
        eid_regs_finded_taquilla.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataTaquillasFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_taquilla" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_taquilla.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_taquilla') {
                console.log('clic en btn_mostrar_finded_taquilla');
                console.log('mostrar clicked -> reasigno objDataTaquillas desde objDataTaquillasFinded'); 
                
                //Clono objeto
                objDataTaquillas = structuredClone(objDataTaquillasFinded);
                console.log('objDataTaquillas: ', objDataTaquillas);



                const modo_val = objModoBusquedaTaquilla[`modo${objFindParamsTaquilla.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaTaquilla[`buscar_en${objFindParamsTaquilla.buscar_en}`].titulo;

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
                    f_frase: objFindParamsTaquilla.words_input,
                    f_num: objFindParamsTaquilla.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_taquillas, objDataPint);               
                                
                pintTaquillasAll();
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

    await update_objFindParamsTaquilla();

    console.timeEnd('time_findWordsTaquilla');
}


async function getTaquillasAll(){
    console.log('=== async function getTaquillasAll() ===');
    console.time('time_getTaquillasAll');

    objDataTaquillasBd = await getDataTaquillasAllFromBd();//la funcion que saca todos los taquilla para pintarlo
    console.log('objDataTaquillasBd: ', objDataTaquillasBd);

    console.timeEnd('time_getTaquillasAll');

    return objDataTaquillasBd;

}


async function crear_objDataTaquillas(){
    console.log('=== function crear_objDataTaquillas() ===');
    console.time('time_crear_objDataTaquillas');

    objDataTaquillas = await getDataTaquillasAllFromBd();
    console.log(`objDataTaquillas: `, objDataTaquillas);

    console.timeEnd('time_crear_objDataTaquillas');
}

async function getDataTaquillasAllFromBd(){//sacar TODOS los taquillas para rellenar contenedor_taquillas
    console.log('=== function getDataTaquillasAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_taquillas_all.php';
        
        const response = await fetch(`../app/php/datos/taquilla/${nombre_fichero}`, {
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
        console.error('Error en getDataTaquillasAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarTaquilla(){
    console.log('=== function buildBuscarTaquilla() ===');

    console.log('objTaquilla: ', objTaquilla);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_taquilla"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsTaquilla?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_taquilla')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsTaquilla()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_taquilla" class="sel_opt_find">
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
            <select id="buscar_en_taquilla" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de taquilla</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_taquilla" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_taquilla');
    
    //modo
    const eid_modo_taquilla = wr_args_busqueda.querySelector('#modo_taquilla');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsTaquilla
    eid_modo_taquilla.value = objFindParamsTaquilla?.modo || 1 ;

    eid_modo_taquilla.onchange = async (e) => {
        findWordsTaquilla();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaTaquilla[`modo${objFindParamsTaquilla.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaTaquilla[`modo${objFindParamsTaquilla.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_taquilla = wr_args_busqueda.querySelector('#buscar_en_taquilla');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsTaquilla
    eid_buscar_en_taquilla.value = objFindParamsTaquilla?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaTaquilla[`buscar_en${objFindParamsTaquilla.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaTaquilla[`buscar_en${objFindParamsTaquilla.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_taquilla.onchange = async (e) => {
        findWordsTaquilla();
    }


    //al teclear texto en la busqueda de taquilla
    let timeoutFindTaquilla;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindTaquilla);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindTaquilla = setTimeout(async () => {
            await findWordsTaquilla();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataTaquillasFromBdByFind(objFindParamsTaquilla){
    console.log('=== function getDataTaquillasFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsTaquilla;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_taquillas_by_find.php';
               
        const response = await fetch(`../app/php/datos/taquilla/${nombre_fichero}`, {
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
        console.error('Error en getDataTaquillasFromBdByFind(): error.message: ', error.message);
    }
}


function pintTaquillaActiveSoloDatos(){
    console.log('=== function pintTaquillaActiveSoloDatos() === ');

    if(!objTaquilla){
        alert('no hay objTaquilla');
        return;
    }

    const d_taquilla = eid_contenedor_taquillas.querySelector(`.d_taquilla[data-id_taquilla="${objTaquilla.id_taquilla}"]`);
    console.log('d_taquilla: ', d_taquilla);
    
    if(!d_taquilla){
        console.log('no hay d_taquilla. no actualizo d_taquilla...');
        return;
    }

    if(objTaquilla.estado_taquilla != ''){
        if(objTaquilla.estado_taquilla === 'libre'){
            d_taquilla.classList.remove('ocupado');
            d_taquilla.classList.add('libre');
        } 
        else if(objTaquilla.estado_taquilla === 'ocupado'){
            d_taquilla.classList.remove('libre');
            d_taquilla.classList.add('ocupado');
        }
    }


    const div_da_nombre = d_taquilla.querySelector('.da_nombre');
    // const div_da_com = d_taquilla.querySelector('.da_com');
    // const div_da_codigo_taquilla = d_taquilla.querySelector('.da_codigo_taquilla');
    // const div_da_codigo_apertura = d_taquilla.querySelector('.da_codigo_apertura');

    //nombre
    div_da_nombre.textContent = objTaquilla.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre
    
    /*
    //codigo_taquilla
    div_da_codigo_taquilla.textContent = objTaquilla.codigo_taquilla || '(valor no asignado)';
    div_da_codigo_taquilla.classList.remove('d-none');//muestro tenga o no el precio

    //codigo_apertura
    div_da_codigo_apertura.textContent = objTaquilla.codigo_apertura || '(valor no asignado)';
    div_da_codigo_apertura.classList.remove('d-none');//muestro tenga o no el precio

    //comentario
    div_da_com.textContent = objTaquilla.comentario || '(sin comentario)';
    //si '!objTaquilla.comentario' es true  (no tiene comentario) -> pone  'd-none' -> oculta
    //si '!objTaquilla.comentario' es false (sí tiene comentario) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objTaquilla.comentario);
    */

}

async function getDataTaquillaFromBd(){
    console.log('=== function getDataTaquillaFromBd() ===');

    try {
        
        if(!hay_id(id_taquilla, 'id_taquilla', 'getDataTaquillaFromBd()')){
            return; // <- se detiene aquí si no hay id_taquilla
        }

        const nombre_fichero = 'obtener_datos_taquilla_one.php';
     
        const response = await fetch(`../app/php/datos/taquilla/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_taquilla: id_taquilla
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

                console.log(`id_taquilla: [${id_taquilla}] --- nombre: [${data.nombre}]`);

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
        console.error('Error en getDataTaquillaFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsTaquilla(){
    console.log('=== function update_objFindParamsTaquilla() ===');

    obj_ajustes.objFindParamsTaquilla = objFindParamsTaquilla;
    await update_obj_ajustes();
}