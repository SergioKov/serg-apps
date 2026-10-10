//almacen
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildAlmacen(almacen_action = null){
    console.log('=== function buildAlmacen() ===');

    console.log('almacen_action: ', almacen_action);
    console.log('objAlmacen: ', objAlmacen);

    eid_bl_modalFullInner.innerHTML = '';//reset

    // Formato YYYY-MM-DD que necesita <input type="date">
    const fecha_hoy = new Date().toISOString().split("T")[0];
    let diaSemana_val = '';
    let fecha_val = fecha_hoy;

    //campos de input
    let id_almacen_val = '';
    let nombre_val = '';
    let direccion_val = '';
    let comentario_val = '';
        
    //otras vars
    let mensaje_html = '';
    let cl_id_almacen = 'd-none';//oculto
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(almacen_action == 'nuevo'){//si es nueva
        
        //? algun codigo?..

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id(id_almacen, 'id_almacen', 'buildAlmacen()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún almacen.</p>
                <p class="p_aviso">Crea un almacen pulsando "+".</p>
            `;
            openModal('center','Aviso Lista',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_almacen
        } 
        id_almacen_val = objAlmacen.id_almacen;
        nombre_val = escaparHTML(objAlmacen.nombre) || '';
        direccion_val = escaparHTML(objAlmacen.direccion) || '';
        comentario_val = escaparHTML(objAlmacen.comentario) || '';
    }

    switch (almacen_action) {
        case 'nuevo'://Nuevo Almacen
            mensaje_html = `
                <span>Rellena los campos del formulario con los datos del almacen <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_almacen
            if(id_almacen){
                id_almacen = null;//reset ya que se va a crear un id_almacen nuevo
            }else{
                //id_almacen es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objAlmacen = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            break;
        
        default:
        case 'ver'://Ver Almacen - FORMULARIO
            cl_id_almacen = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            break;

        case 'editar'://Editar Almacen - FORMULARIO
            mensaje_html = `
                <span class="sp_id">
                    <span>Id: <b class="c_green">${id_almacen}</b></span>
                    <span><b class="actual">(ACTUAL)</b></span>
                </span>
            `;
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Almacen - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_almacen = '';//muestro
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteAlmacen(event);">Eliminar Almacen DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_almacen_sm = document.createElement('div'); 
    contenedor_almacen_sm.id = 'contenedor_almacen_sm';
    contenedor_almacen_sm.className = 'contenedor_form_sm';
    contenedor_almacen_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Almacen <span class="f_r ${cl_id_almacen}">id: ${id_almacen_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx ${!direccion_val ? 'd-none' : ''}">
                        <span class="cl_campo">dirección:</span>
                        <span>${direccion_val}</span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(comentario_val) ? comentario_detalles.outerHTML : '' }
        
        ${(almacen_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarAlmacen(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_almacen = document.createElement('div');
    form_almacen.id = 'form_almacen';
    form_almacen.innerHTML = `
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
                    <label for="nombre">Nombre del almacén</label>
                </div>
               
                <!-- direccion -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#direccion')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="direccion" type="text" name="direccion" required="" placeholder=" " value="${direccion_val}">
                    <label for="direccion">Dirección</label>
                </div>


                <!-- comentario -->
                <div class="form_group">
                    <textarea id="comentario" name="comentario" rows="4" required="" placeholder=" ">${comentario_val}</textarea>
                    <label class="lab_textarea" for="comentario">Comentario</label>
                </div>

                ${ (['nuevo','editar'].includes(almacen_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(almacen_action)){ 
        contenedor = contenedor_almacen_sm;        
    }else{
        contenedor = form_almacen;
        if(almacen_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}

async function guardarAlmacen(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objAlmacen)
    console.log('=== function guardarAlmacen() ===');
    
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

        const form_almacen = document.getElementById('form_almacen');

        let nombre = form_almacen?.querySelector('#nombre').value.trim();
        let direccion = form_almacen?.querySelector('#direccion').value.trim();
        let comentario = form_almacen?.querySelector('#comentario').value.trim();

    
        let errors = [];

        if(modo_guardar === 'fast'){
            nombre = objAlmacen.nombre;
        }

        if(nombre == ''){
            errors.push('Nombre del almacén');
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


        const objAlmacenToSend = {
            id_almacen: id_almacen || null, //ya que se añade un nuevo cliente, entonces no hay id_almacen
            nombre,
            direccion,
            comentario,
        }
        console.log('objAlmacenToSend: ',objAlmacenToSend);
    
        const data = await insertarAlmacenDatos(objAlmacenToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_almacen':
                    text_show = 'Datos del almacén han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_almacen':
                    text_show = 'Datos del almacén han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_almacen){
                console.log('id_almacen: ', data.id_almacen);
                id_almacen = data.id_almacen;//guardo el id del cliente recién creada

                //Cojo datos de la song de la lista desde BD
                objAlmacen = await getDataAlmacenFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objAlmacen: ', objAlmacen);

                const itemAlmacenUpdate = objDataAlmacenes.arr_data?.find(item => item.id_almacen == id_almacen);
                if (itemAlmacenUpdate) {//es update del cliente existente
                    Object.assign(itemAlmacenUpdate, objAlmacen);
                    // el objeto dentro de arr_data ya está actualizado
                } else {//es insert del cliente nuevo
                    console.warn('No encontrado objAlmacen.id_almacen en objDataAlmacenes.arr_data');
                    //entonces es un cliente nuevo que se crea

                    if(objDataAlmacenes.arr_data){                    
                        //1.debo añadir objAlmacen en objDataAlmacenes.arr_data al inicio
                        objDataAlmacenes.arr_data.unshift(objAlmacen);
                    }

                    //2.debo aumentar el numero de total clientes
                    objDataAlmacenes.totalRows++;

                    //3.debo pintar d_almacen en el top del contenedor
                    pintAlmacenOne(objAlmacen, 'arriba');//div de cliente se pinta al inicio (arriba)
                }

                //Actualizo d_art 
                pintAlmacenActiveSoloDatos();//en el contenedor_almacens

                closeModal(null,true);
            }
           
        }else{
            console.log(`Error al guardar el cliente.`);
            
            //"Error al añadir la lista.";
            console.error('data.error: ', data.error);

            let text_show = 'Error al añadir la lista.';  

            showToast('error', text_show, 5000);
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarLista. error: ',error);
    }

}

async function insertarAlmacenDatos(objAlmacen) {
    console.log('=== function insertarAlmacenDatos(objAlmacen) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objAlmacen || Object.keys(objAlmacen).length == 0){
            alert('No hay todos los parametros necesarios del almacén...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objAlmacen: ',objAlmacen);

        const objAlmacen_str = JSON.stringify(objAlmacen);
        console.log('objAlmacen_str: ',objAlmacen_str);

        const nombre_fichero = 'insertar_datos_almacen_one.php';

        const response = await fetch(`../app/php/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objAlmacen_str
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
        console.error('Error en la función insertarAlmacenDatos(): ', error);
    }
}

async function deleteAlmacen(event){
    console.log('=== function deleteAlmacen() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_almacen = objAlmacen.id_almacen;
        console.log('id_almacen: ', id_almacen);

        if(!id_almacen){
            alert('id_almacen no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el almacén con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_almacen}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objAlmacen.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Dirección:</span> ${escaparHTML(objAlmacen.direccion) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Comentario:</span> ${escaparHTML(objAlmacen.comentario) || '(sin comentario)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar almacén',
            pregunta,
            'confirmDelete',
            true,
            id_almacen
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el almacen...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteAlmacenFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Almacen eliminado con éxito.';
            console.log(text_show);

            if(data.id_almacen){
                console.log('id_almacen: ', data.id_almacen);

                const totalAntes = objDataAlmacenes.arr_data.length;

                //elimino el objeto del almacen eliminado desde objeto de todos los almacenes encontrados usando filter
                objDataAlmacenes.arr_data = objDataAlmacenes.arr_data.filter(
                    item => item.id_almacen !== id_almacen
                );

                const totalDespues = objDataAlmacenes.arr_data.length;
                const item_is_deleted = totalDespues < totalAntes;

                if(item_is_deleted){
                    console.log('item eliminado de objDataAlmacenes');
                }else{
                    console.log('item NO eliminado de objDataAlmacenes');
                }

                //Elimino elemento d_almacen de los clientes encontrados en 'contenedor_almacens'
                eid_contenedor_almacenes.querySelector(`.d_almacen[data-id_almacen="${id_almacen}"]`).remove();
                eid_block_almacenes.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_almacen = null;
                objAlmacen = {};//reseteo objeto song

                showToast('ok', text_show, 5000);
            }
            
        }else{
            console.log(`Error al eliminar el almacen.`);
            
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteAlmacen. error: ',error);        
    }

}

async function deleteAlmacenFromBd(){
    console.log('=== function deleteAlmacenFromBd() ===');

    try {
        
        if(!hay_id(id_almacen, 'id_almacen', 'deleteAlmacenFromBd()')){
            return; // <- se detiene aquí si no hay id_almacen
        }

        const nombre_fichero = 'eliminar_datos_almacen_one.php';
               
        const response = await fetch(`../app/php/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_almacen: id_almacen
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
                console.log(`[ELIMINADO] id_almacen: [${data.id_almacen}] --- nombre: [${data.nombre}] --- direccion: [${data.direccion}]`);
    
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
        console.error('Error en deleteAlmacenFromBd(): error.message: ', error.message);
    }
}


function pintAlmacenActive(){//click en div del contenedor de almacen que ya están en el DOM
    console.log('=== function pintAlmacenActive(e) === ');

    console.log('asignado global --- id_almacen: ', id_almacen);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_almacenes, 'd_almacen');
    eid_contenedor_almacenes.querySelector(`.d_almacen[data-id_almacen="${id_almacen}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_almacen viene como string: "925"
    objAlmacen = objDataAlmacenes.arr_data.find(v => v.id_almacen == id_almacen);
    console.log('objAlmacen: ', objAlmacen);

    pintAlmacenActiveSoloDatos();

}

async function loadAlmacenesAll(){
    console.log('=== function loadAlmacenesAll() === ');

    objDataAlmacenes = await getAlmacenesAll();

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
        f_frase: '(Todos almacenes)',
        f_num: objDataAlmacenes.totalRows,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_almacenes, objDataPint);
    
    pintAlmacenesAll();

}

async function pintAlmacenesAll(){//pintar todos los div de almacenes, o al load o al find
    console.log('=== function pintAlmacenesAll() === '); 
    
    console.time('time_pintAlmacenesAlll');

    // if(!objDataAlmacenes?.arr_data?.length){//si length === 0, entonces no hay clientes
    //     console.warn('No hay clientes en objDataAlmacenes.arr_data');
    //     return;
    // }

    eid_contenedor_almacenes.innerHTML = '';//reset contenedor de clientes

    const hay_datos = (esObjeto(objDataAlmacenes) && objDataAlmacenes.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_almacenes.innerHTML = `
            <p class="prim">No existe ningún almacén en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataAlmacenes: ', objDataAlmacenes);        
                
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
        //Recorrer items del array... 
        objDataAlmacenes.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintAlmacenOne(obj, 'abajo');//cada div de almacen se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintAlmacenesAlll');
   
}


function pintAlmacenOne(objAlmacenOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un almacen, o al load, o al crear, o al find
    console.log('=== function pintAlmacenOne() === ');

    if(!objAlmacenOne){
        console.warn('No hay objeto de cliente. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objAlmacenOne.comentario) ? '' : 'd-none';//si no hay título, lo oculto 

    const d_almacen = document.createElement('div');
    d_almacen.className = 'd_almacen d_art';
    d_almacen.dataset.id_almacen = objAlmacenOne.id_almacen;
    d_almacen.dataset.tipo_art = 'cliente';
    d_almacen.innerHTML = `
        <div class="datos_almacen datos_art">
            <div class="da_nombre">${escaparHTML(objAlmacenOne.nombre) || '(nombre no asignado)'}</div>
            <div class="da_dir">${escaparHTML(objAlmacenOne.direccion) || '(dirección no asignada)'}</div>
            <div class="da_com ${cl_da_comm}">${escaparHTML(objAlmacenOne.comentario) || '(sin comentario)'}</div>
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

    d_almacen.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_almacen = e.currentTarget.dataset.id_almacen;
        console.log('asigno global --- id_almacen: ', id_almacen); 

        // siempre al clicar en cualquier parte del d_almacen se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintAlmacenActive();
        

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

            //clic dentro de d_almacen y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_almacen y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_almacen - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Almacen actual',null,'buildAlmacen',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Almacen actual',null,'buildAlmacen',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Almacen actual',null,'buildAlmacen',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_almacenes.append(d_almacen);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_almacenes.prepend(d_almacen);
    }
}


async function findWordsAlmacen(){
    console.log('=== async function findWordsAlmacen() ===');
    console.time('time_findWordsAlmacen');

    const eid_inpt_find_almacen = document.getElementById('inpt_find_almacen');
    const eid_modo_almacen = document.getElementById('modo_almacen');
    const eid_buscar_en_almacen = document.getElementById('buscar_en_almacen');
    const eid_regs_finded_almacen = document.getElementById('regs_finded_almacen');

    let words_input_trimed = eid_inpt_find_almacen.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_almacen.value;
    let buscar_en = eid_buscar_en_almacen.value;
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

    objFindParamsAlmacen.words_input = words_input;
    objFindParamsAlmacen.modo = modo;
    objFindParamsAlmacen.buscar_en = buscar_en;
    objFindParamsAlmacen.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataAlmacenesFinded = await getDataAlmacenesFromBdByFind(objFindParamsAlmacen);
    console.log('objDataAlmacenesFinded: ', objDataAlmacenesFinded);   

    
    const hay_coincidencias = (esObjeto(objDataAlmacenesFinded) && objDataAlmacenesFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsAlmacen.findedRows = 0;

        eid_regs_finded_almacen.classList.remove('d-none');
        eid_regs_finded_almacen.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay clientes...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsAlmacen.findedRows = objDataAlmacenesFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_almacen.classList.remove('d-none');
        eid_regs_finded_almacen.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataAlmacenesFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_almacen" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_almacen.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_almacen') {
                console.log('clic en btn_mostrar_finded_almacen');
                console.log('mostrar clicked -> reasigno objDataAlmacenes desde objDataAlmacenesFinded'); 
                
                //Clono objeto
                objDataAlmacenes = structuredClone(objDataAlmacenesFinded);
                console.log('objDataAlmacenes: ', objDataAlmacenes);



                const modo_val = objModoBusquedaCliente[`modo${objFindParamsAlmacen.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaCliente[`buscar_en${objFindParamsAlmacen.buscar_en}`].titulo;

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
                    f_frase: objFindParamsAlmacen.words_input,
                    f_num: objFindParamsAlmacen.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_almacenes, objDataPint);               
                                
                pintAlmacenesAll();
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

    await update_objFindParamsAlmacen();

    console.timeEnd('time_findWordsAlmacen');
}


async function getAlmacenesAll(){
    console.log('=== async function getAlmacenesAll() ===');
    console.time('time_getAlmacenesAll');

    objDataAlmacenesBd = await getDataAlmacenesAllFromBd();//la funcion que saca todos los cliente para pintarlo
    console.log('objDataAlmacenesBd: ', objDataAlmacenesBd);

    console.timeEnd('time_getAlmacenesAll');

    return objDataAlmacenesBd;

}


async function crear_objDataAlmacenes(){
    console.log('=== function crear_objDataAlmacenes() ===');
    console.time('time_crear_objDataAlmacenes');

    objDataAlmacenes = await getDataAlmacenesAllFromBd();
    console.log(`objDataAlmacenes: `, objDataAlmacenes);

    console.timeEnd('time_crear_objDataAlmacenes');
}

async function getDataAlmacenesAllFromBd(){//sacar TODOS los clientes para rellenar contenedor_almacens
    console.log('=== function getDataAlmacenesAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_almacenes_all.php';
               
        const response = await fetch(`../app/php/${nombre_fichero}`, {
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
        console.error('Error en getDataAlmacenesAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarAlmacen(){
    console.log('=== function buildBuscarAlmacen() ===');

    console.log('objAlmacen: ', objAlmacen);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_almacen"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsAlmacen.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_almacen')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsAlmacen()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_almacen" class="sel_opt_find">
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
            <select id="buscar_en_almacen" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de cliente</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_almacen" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_almacen');
    
    //modo
    const eid_modo_almacen = wr_args_busqueda.querySelector('#modo_almacen');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsAlmacen
    eid_modo_almacen.value = objFindParamsAlmacen.modo;

    eid_modo_almacen.onchange = async (e) => {
        findWordsAlmacen();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaCliente[`modo${objFindParamsAlmacen.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaCliente[`modo${objFindParamsAlmacen.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_almacen = wr_args_busqueda.querySelector('#buscar_en_almacen');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsAlmacen
    eid_buscar_en_almacen.value = objFindParamsAlmacen.buscar_en;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaCliente[`buscar_en${objFindParamsAlmacen.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaCliente[`buscar_en${objFindParamsAlmacen.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_almacen.onchange = async (e) => {
        findWordsAlmacen();
    }


    //al teclear texto en la busqueda de cliente
    let timeoutFindCliente;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindCliente);
    
        if(input_val.length < 3){
            return;
        }
    
        timeoutFindCliente = setTimeout(async () => {
            await findWordsAlmacen();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataAlmacenesFromBdByFind(objFindParamsAlmacen){
    console.log('=== function getDataAlmacenesFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsAlmacen;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_almacenes_by_find.php';
               
        const response = await fetch(`../app/php/${nombre_fichero}`, {
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
        console.error('Error en getDataAlmacenesFromBdByFind(): error.message: ', error.message);
    }
}


function pintAlmacenActiveSoloDatos(){
    console.log('=== function pintAlmacenActiveSoloDatos() === ');

    if(!objAlmacen){
        alert('no hay objAlmacen');
        return;
    }

    const d_almacen = eid_contenedor_almacenes.querySelector(`.d_almacen[data-id_almacen="${objAlmacen.id_almacen}"]`);
    console.log('d_almacen: ', d_almacen);
    
    if(!d_almacen){
        console.log('no hay d_almacen. no actualizo d_almacen...');
        return;
    }

    const div_da_nombre = d_almacen.querySelector('.da_nombre');
    const div_da_dir = d_almacen.querySelector('.da_dir');
    const div_da_com = d_almacen.querySelector('.da_com');

    //nombre
    div_da_nombre.textContent = objAlmacen.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //direccion
    div_da_dir.textContent = objAlmacen.direccion || '(direccion no asignada)';
    div_da_dir.classList.remove('d-none');//muestro tenga o no la dirección

    //comentario
    div_da_com.textContent = objAlmacen.comentario || '(sin comentario)';
    //si '!objAlmacen.comentario' es true  (no tiene comentario) -> pone  'd-none' -> oculta
    //si '!objAlmacen.comentario' es false (sí tiene comentario) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objAlmacen.comentario);

}

async function getDataAlmacenFromBd(){
    console.log('=== function getDataAlmacenFromBd() ===');

    try {
        
        if(!hay_id(id_almacen, 'id_almacen', 'getDataAlmacenFromBd()')){
            return; // <- se detiene aquí si no hay id_almacen
        }

        const nombre_fichero = 'obtener_datos_almacen_one.php';
     
        const response = await fetch(`../app/php/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_almacen: id_almacen
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

                console.log(`id_almacen: [${id_almacen}] --- nombre: [${data.nombre}] --- direccion: [${data.direccion}] --- comentario: [${data.comentario}]`);

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
        console.error('Error en getDataAlmacenFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsAlmacen(){
    console.log('=== function update_objFindParamsAlmacen() ===');

    obj_ajustes.objFindParamsAlmacen = objFindParamsAlmacen;
    await update_obj_ajustes();
}