//servicio
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildServicio(servicio_action = null){
    console.log('=== function buildServicio() ===');

    console.log('servicio_action: ', servicio_action);
    console.log('objServicio: ', objServicio);

    eid_bl_modalFullInner.innerHTML = '';//reset

    //campos de input
    let id_servicio_val = '';
    let nombre_val = '';
    let descripcion_val = '';

    let precio_val = '';
    let precio_text = '';

    //elemento de título en el top
    const p_mensaje = document.createElement('p');
    p_mensaje.className = 'mensaje';
        
    //otras vars
    let cl_id_servicio = 'd-none';//oculto
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(servicio_action == 'nuevo'){//si es nueva
        
        //mostrarPrim = false;    
        //ocultarElementosPrimEn(lista_option_inner);
        //ocultarElementosEditablesEn(lista_option_inner);
        //mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit 

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id(id_servicio, 'id_servicio', 'buildServicio()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún servicio.</p>
                <p class="p_aviso">Crea un servicio pulsando "+".</p>
            `;
            openModal('center','Aviso Servicio',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_servicio
        } 
        id_servicio_val = objServicio.id_servicio;
        nombre_val = escaparHTML(objServicio.nombre) || '';
        descripcion_val = escaparHTML(objServicio.descripcion) || '';
                
        precio_val = (objServicio.precio) ? escaparHTML(objServicio.precio) : '';
        precio_text = (objServicio.precio) ? `${precio_val} €` : '--';
    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(servicio_action)){
        
        p_mensaje.innerHTML = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_servicio}</b></span>
            </span>
        `;
        
        if(servicio_action == 'ver'){
            const wr_img_editar_en_ver = document.createElement('span');
            wr_img_editar_en_ver.className = 'wr_img_editar_en_ver';
            wr_img_editar_en_ver.innerHTML = `
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            `;
            p_mensaje.append(wr_img_editar_en_ver);
        }
    }

    switch (servicio_action) {
        case 'nuevo'://Nueva Servicio
            p_mensaje.innerHTML = `
                <span>Rellena los campos del formulario con los datos de un servicio <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_servicio
            if(id_servicio){
                id_servicio = null;//reset ya que se va a crear un id_servicio nuevo
            }else{
                //id_servicio es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objServicio = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            //resetBlockLista();        
            break;
        
        default:
        case 'ver'://Ver Servicio - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_servicio = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            break;

        case 'editar'://Editar Servicio - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Servicio - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_servicio = '';//muestro
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteServicio(event);">Eliminar Servicio DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_servicio_sm = document.createElement('div'); 
    contenedor_servicio_sm.id = 'contenedor_servicio_sm';
    contenedor_servicio_sm.className = 'contenedor_form_sm';
    contenedor_servicio_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Servicio <span class="f_r ${cl_id_servicio}">id: ${id_servicio_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx ${!precio_val ? 'd-none' : ''}">
                        <span class="cl_campo">Precio:</span>
                        <span>${precio_text}</span>
                    </span>

                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(descripcion_val) ? descripcion_detalles.outerHTML : '' }
        
        ${(servicio_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarServicio(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_servicio = document.createElement('div');
    form_servicio.id = 'form_servicio';
    form_servicio.innerHTML = `
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
                    <label for="nombre">Nombre del servicio</label>
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
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#descripcion')">
                        <img src="images/x_white.png">
                    </div>
                    <textarea id="descripcion" name="descripcion" rows="4" required="" placeholder=" ">${descripcion_val}</textarea>
                    <label class="lab_textarea" for="descripcion">Descripción</label>
                </div>


                ${ (['nuevo','editar'].includes(servicio_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //añado action onclick a wr_img_editar_en_ver
    const element_wr_img_editar_en_ver = form_servicio.querySelector('.wr_img_editar_en_ver');
    if(element_wr_img_editar_en_ver){
        element_wr_img_editar_en_ver.onclick = () => {
            openModal('full','Editar Servicio actual',null,'buildServicio',true,'editar');
        }
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(servicio_action)){ 
        contenedor = contenedor_servicio_sm;        
    }else{
        contenedor = form_servicio;
        if(servicio_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}

async function guardarServicio(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarServicio() ===');
    
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

        const form_servicio = document.getElementById('form_servicio');

        let nombre = form_servicio?.querySelector('#nombre').value.trim();
        let descripcion = form_servicio?.querySelector('#descripcion').value.trim();
        let precio = form_servicio?.querySelector('#precio').value.trim();
    
        let errors = [];

        if(modo_guardar === 'fast'){
            nombre = objServicio.nombre;
        }

        if(nombre == ''){
            errors.push('Nombre del servicio');
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


        const objServicioToSend = {
            id_servicio: id_servicio || null, //ya que se añade un nuevo servicio, entonces no hay id_servicio
            nombre,
            descripcion,
            precio,
        }
        console.log('objServicioToSend: ',objServicioToSend);
    
        const data = await insertarServicioDatos(objServicioToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_servicio':
                    text_show = 'Datos del servicio han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_servicio':
                    text_show = 'Datos del servicio han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_servicio){
                console.log('id_servicio: ', data.id_servicio);
                id_servicio = data.id_servicio;//guardo el id del servicio recién creada

                //Cojo datos del servicio desde BD
                objServicio = await getDataServicioFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objServicio: ', objServicio);

                const itemServicioUpdate = objDataServicios?.arr_data?.find(item => item.id_servicio == id_servicio);
                if (itemServicioUpdate) {//es update del servicio existente
    
                    Object.assign(itemServicioUpdate, objServicio);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintServicioActiveSoloDatos();//en el contenedor_servicios

                } else {//es insert del servicio nuevo
    
                    console.warn('No encontrado objServicio.id_servicio en objDataServicios.arr_data');
                    //entonces es un servicio nuevo que se crea

                    //1.debo añadir objServicio en objDataServicios.arr_data al inicio (si existe!)
                    objDataServicios?.arr_data?.unshift(objServicio);

                    //2.debo aumentar el numero de total servicios (si existe!)
                    if (objDataServicios?.totalRows != null){
                        objDataServicios.totalRows++;
                    }

                    //3. old -> debo pintar d_servicio en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintServicioOne(objServicio, 'arriba');//div de servicio se pinta al inicio (arriba)
                    loadServiciosAll();
                }

                closeModal(null,true);
            }
           
        }else{

            let text_show = 'Error al guardar el servicio.';
            console.log(text_show);
            console.error('data.error: ', data.error);

            showToast('error', text_show, 5000);

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarServicio(). error: ',error);
    }

}

async function insertarServicioDatos(objServicio) {
    console.log('=== function insertarServicioDatos(objServicio) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objServicio || Object.keys(objServicio).length == 0){
            alert('No hay todos los parametros necesarios del servicio...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objServicio: ',objServicio);

        const objServicio_str = JSON.stringify(objServicio);
        console.log('objServicio_str: ',objServicio_str);

        const nombre_fichero = 'insertar_datos_servicio_one.php';

        const response = await fetch(`../app/php/datos/servicio/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objServicio_str
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
        console.error('Error en la función insertarServicioDatos: ', error);
    }
}

async function deleteServicio(event){
    console.log('=== function deleteServicio() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_servicio = objServicio.id_servicio;
        console.log('id_servicio: ', id_servicio);

        if(!id_servicio){
            alert('id_servicio no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el servicio con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_servicio}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objServicio.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Descripción:</span> ${escaparHTML(objServicio.descripcion) || '(sin descripcion)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar servicio',
            pregunta,
            'confirmDelete',
            true,
            id_servicio
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el servicio...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteServicioFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Servicio eliminado con éxito.';
            console.log(text_show);

            if(data.id_servicio){
                console.log('id_servicio: ', data.id_servicio);

                const totalAntes = objDataServicios.arr_data.length;

                //elimino el objeto del servicio eliminado desde objeto de todos los servicios encontrados usando filter
                objDataServicios.arr_data = objDataServicios.arr_data.filter(
                    item => item.id_servicio !== id_servicio
                );

                const totalDespues = objDataServicios.arr_data.length;
                const servicio_is_deleted = totalDespues < totalAntes;

                if(servicio_is_deleted){
                    console.log('servicio eliminado de objDataServicios');
                }else{
                    console.log('servicio NO eliminado de objDataServicios');
                }

                //Elimino elemento d_servicio de los servicios encontrados en 'contenedor_servicios'
                eid_contenedor_servicios.querySelector(`.d_servicio[data-id_servicio="${id_servicio}"]`).remove();
                eid_block_servicios.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_servicio = null;
                objServicio = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                loadServiciosAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar el servicio.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteServicio. error: ',error);        
    }

}

async function deleteServicioFromBd(){
    console.log('=== function deleteServicioFromBd() ===');

    try {
        
        if(!hay_id(id_servicio, 'id_servicio', 'deleteServicioFromBd()')){
            return; // <- se detiene aquí si no hay id_servicio
        }

        const nombre_fichero = 'eliminar_datos_servicio_one.php';
               
        const response = await fetch(`../app/php/datos/servicio/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_servicio: id_servicio
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
                console.log(`[ELIMINADO] id_servicio: [${data.id_servicio}] --- nombre: [${data.nombre}]`);
    
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
        console.error('Error en deleteServicioFromBd(): error.message: ', error.message);
    }
}


function pintServicioActive(){//click en div del contenedor de servicios que ya están en el DOM
    console.log('=== function pintServicioActive(e) === ');

    console.log('asignado global --- id_servicio: ', id_servicio);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_servicios, 'd_servicio');
    eid_contenedor_servicios.querySelector(`.d_servicio[data-id_servicio="${id_servicio}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_servicio viene como string: "925"
    objServicio = objDataServicios.arr_data.find(v => v.id_servicio == id_servicio);
    console.log('objServicio: ', objServicio);

    pintServicioActiveSoloDatos();

}

async function loadServiciosAll(){
    console.log('=== function loadServiciosAll() === ');

    objDataServicios = await getServiciosAll();

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
        f_frase: '(Todos servicios)',
        f_num: objDataServicios?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_servicios, objDataPint);
    
    pintServiciosAll();

}

async function pintServiciosAll(){//pintar todos los div de servicios, o al load o al find
    console.log('=== function pintServiciosAll() === '); 
    
    console.time('time_pintServiciosAlll');

    // if(!objDataServicios?.arr_data?.length){//si length === 0, entonces no hay servicios
    //     console.warn('No hay servicios en objDataServicios.arr_data');
    //     return;
    // }

    eid_contenedor_servicios.innerHTML = '';//reset contenedor de servicios

    const hay_datos = (esObjeto(objDataServicios) && objDataServicios.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_servicios.innerHTML = `
            <p class="prim">No existe ningún registro de servicio en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataServicios: ', objDataServicios);        
        
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
        //Recorrer servicios encontradas... 
        objDataServicios.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintServicioOne(obj, 'abajo');//cada div de servicio se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintServiciosAlll');
   
}


function pintServicioOne(objServicioOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un servicio, o al load, o al crear, o al find
    console.log('=== function pintServicioOne() === ');

    if(!objServicioOne){
        console.warn('No hay objeto de servicio. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objServicioOne.descripcion) ? '' : 'd-none';//si no hay título, lo oculto
    
    const precio_text = (objServicioOne.precio) ? `${objServicioOne.precio} €` : '--' ;

    const d_servicio = document.createElement('div');
    d_servicio.className = 'd_servicio d_art';
    d_servicio.dataset.id_servicio = objServicioOne.id_servicio;
    d_servicio.dataset.tipo_art = 'servicio';
    d_servicio.innerHTML = `
        <div class="datos_servicio datos_art">
            <div class="da_nombre">${escaparHTML(objServicioOne.nombre) || '(nombre no asignado)'}</div>
            <div class="da_com ${cl_da_comm}">${escaparHTML(objServicioOne.descripcion) || '(sin descripcion)'}</div>
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

    d_servicio.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_servicio = e.currentTarget.dataset.id_servicio;
        console.log('asigno global --- id_servicio: ', id_servicio); 

        // siempre al clicar en cualquier parte del d_servicio se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintServicioActive();
        

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

            //clic dentro de d_servicio y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_servicio y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_servicio - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Servicio actual',null,'buildServicio',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Servicio actual',null,'buildServicio',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Servicio actual',null,'buildServicio',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_servicios.append(d_servicio);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_servicios.prepend(d_servicio);
    }
}


async function findWordsServicio(){
    console.log('=== async function findWordsServicio() ===');
    console.time('time_findWordsServicio');

    const eid_inpt_find_servicio = document.getElementById('inpt_find_servicio');
    const eid_modo_servicio = document.getElementById('modo_servicio');
    const eid_buscar_en_servicio = document.getElementById('buscar_en_servicio');
    const eid_regs_finded_servicio = document.getElementById('regs_finded_servicio');

    let words_input_trimed = eid_inpt_find_servicio.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_servicio.value;
    let buscar_en = eid_buscar_en_servicio.value;
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

    objFindParamsServicio.words_input = words_input;
    objFindParamsServicio.modo = modo;
    objFindParamsServicio.buscar_en = buscar_en;
    objFindParamsServicio.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataServiciosFinded = await getDataServiciosFromBdByFind(objFindParamsServicio);
    console.log('objDataServiciosFinded: ', objDataServiciosFinded);   

    
    const hay_coincidencias = (esObjeto(objDataServiciosFinded) && objDataServiciosFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsServicio.findedRows = 0;

        eid_regs_finded_servicio.classList.remove('d-none');
        eid_regs_finded_servicio.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay servicios...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsServicio.findedRows = objDataServiciosFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_servicio.classList.remove('d-none');
        eid_regs_finded_servicio.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataServiciosFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_servicio" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_servicio.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_servicio') {
                console.log('clic en btn_mostrar_finded_servicio');
                console.log('mostrar clicked -> reasigno objDataServicios desde objDataServiciosFinded'); 
                
                //Clono objeto
                objDataServicios = structuredClone(objDataServiciosFinded);
                console.log('objDataServicios: ', objDataServicios);



                const modo_val = objModoBusquedaServicio[`modo${objFindParamsServicio.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaServicio[`buscar_en${objFindParamsServicio.buscar_en}`].titulo;

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
                    f_frase: objFindParamsServicio.words_input,
                    f_num: objFindParamsServicio.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_servicios, objDataPint);               
                                
                pintServiciosAll();
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

    await update_objFindParamsServicio();

    console.timeEnd('time_findWordsServicio');
}


async function getServiciosAll(){
    console.log('=== async function getServiciosAll() ===');
    console.time('time_getServiciosAll');

    objDataServiciosBd = await getDataServiciosAllFromBd();//la funcion que saca todos los servicio para pintarlo
    console.log('objDataServiciosBd: ', objDataServiciosBd);

    console.timeEnd('time_getServiciosAll');

    return objDataServiciosBd;

}


async function crear_objDataServicios(){
    console.log('=== function crear_objDataServicios() ===');
    console.time('time_crear_objDataServicios');

    objDataServicios = await getDataServiciosAllFromBd();
    console.log(`objDataServicios: `, objDataServicios);

    console.timeEnd('time_crear_objDataServicios');
}

async function getDataServiciosAllFromBd(){//sacar TODOS los servicios para rellenar contenedor_servicios
    console.log('=== function getDataServiciosAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_servicios_all.php';
        
        const response = await fetch(`../app/php/datos/servicio/${nombre_fichero}`, {
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
        console.error('Error en getDataServiciosAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarServicio(){
    console.log('=== function buildBuscarServicio() ===');

    console.log('objServicio: ', objServicio);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_servicio"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsServicio?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_servicio')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsServicio()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_servicio" class="sel_opt_find">
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
            <select id="buscar_en_servicio" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de servicio</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_servicio" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_servicio');
    
    //modo
    const eid_modo_servicio = wr_args_busqueda.querySelector('#modo_servicio');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsServicio
    eid_modo_servicio.value = objFindParamsServicio?.modo || 1 ;

    eid_modo_servicio.onchange = async (e) => {
        findWordsServicio();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaServicio[`modo${objFindParamsServicio.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaServicio[`modo${objFindParamsServicio.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_servicio = wr_args_busqueda.querySelector('#buscar_en_servicio');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsServicio
    eid_buscar_en_servicio.value = objFindParamsServicio?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaServicio[`buscar_en${objFindParamsServicio.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaServicio[`buscar_en${objFindParamsServicio.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_servicio.onchange = async (e) => {
        findWordsServicio();
    }


    //al teclear texto en la busqueda de servicio
    let timeoutFindServicio;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindServicio);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindServicio = setTimeout(async () => {
            await findWordsServicio();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataServiciosFromBdByFind(objFindParamsServicio){
    console.log('=== function getDataServiciosFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsServicio;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_servicios_by_find.php';
               
        const response = await fetch(`../app/php/datos/servicio/${nombre_fichero}`, {
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
        console.error('Error en getDataServiciosFromBdByFind(): error.message: ', error.message);
    }
}


function pintServicioActiveSoloDatos(){
    console.log('=== function pintServicioActiveSoloDatos() === ');

    if(!objServicio){
        alert('no hay objServicio');
        return;
    }

    const d_servicio = eid_contenedor_servicios.querySelector(`.d_servicio[data-id_servicio="${objServicio.id_servicio}"]`);
    console.log('d_servicio: ', d_servicio);
    
    if(!d_servicio){
        console.log('no hay d_servicio. no actualizo d_servicio...');
        return;
    }

    const div_da_nombre = d_servicio.querySelector('.da_nombre');
    const div_da_com = d_servicio.querySelector('.da_com');
    const div_da_precio = d_servicio.querySelector('.da_precio');

    const precio_text = (objServicio.precio) ? `${objServicio.precio} €` : '--' ;


    //nombre
    div_da_nombre.textContent = objServicio.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //precio
    div_da_precio.textContent = precio_text;
    div_da_precio.classList.remove('d-none');//muestro tenga o no el precio

    //descripcion
    div_da_com.textContent = objServicio.descripcion || '(sin descripcion)';
    //si '!objServicio.descripcion' es true  (no tiene descripcion) -> pone  'd-none' -> oculta
    //si '!objServicio.descripcion' es false (sí tiene descripcion) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objServicio.descripcion);

}

async function getDataServicioFromBd(){
    console.log('=== function getDataServicioFromBd() ===');

    try {
        
        if(!hay_id(id_servicio, 'id_servicio', 'getDataServicioFromBd()')){
            return; // <- se detiene aquí si no hay id_servicio
        }

        const nombre_fichero = 'obtener_datos_servicio_one.php';
     
        const response = await fetch(`../app/php/datos/servicio/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_servicio: id_servicio
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

                console.log(`id_servicio: [${id_servicio}] --- nombre: [${data.nombre}]`);

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
        console.error('Error en getDataServicioFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsServicio(){
    console.log('=== function update_objFindParamsServicio() ===');

    obj_ajustes.objFindParamsServicio = objFindParamsServicio;
    await update_obj_ajustes();
}