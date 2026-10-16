//tarifa
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildTarifa(tarifa_action = null){
    console.log('=== function buildTarifa() ===');

    console.log('tarifa_action: ', tarifa_action);
    console.log('objTarifa: ', objTarifa);

    eid_bl_modalFullInner.innerHTML = '';//reset

    //campos de input
    let id_tarifa_val = '';
    let nombre_val = '';
    let descripcion_val = '';
    let id_producto_val = '';

    let cantidad_desde_val = '';
    let cantidad_desde_text = '';

    let cantidad_hasta_val = '';
    let cantidad_hasta_text = '';

    let cantidad_desde_hasta_text = '';

    let precio_val = '';
    let precio_text = '';

    //elemento de título en el top
    const p_mensaje = document.createElement('p');
    p_mensaje.className = 'mensaje';
        
    //otras vars
    let cl_id_tarifa = 'd-none';//oculto
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(tarifa_action == 'nuevo'){//si es nueva
        
        //mostrarPrim = false;    
        //ocultarElementosPrimEn(lista_option_inner);
        //ocultarElementosEditablesEn(lista_option_inner);
        //mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit 

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id(id_tarifa, 'id_tarifa', 'buildTarifa()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún tarifa.</p>
                <p class="p_aviso">Crea un tarifa pulsando "+".</p>
            `;
            openModal('center','Aviso Tarifa',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_tarifa
        } 
        id_tarifa_val = objTarifa.id_tarifa;
        nombre_val = escaparHTML(objTarifa.nombre) || '';
        descripcion_val = escaparHTML(objTarifa.descripcion) || '';
        id_producto_val = escaparHTML(objTarifa.id_producto) || '';
        
        cantidad_desde_val = (objTarifa.cantidad_desde) ? escaparHTML(objTarifa.cantidad_desde) : '';
        cantidad_desde_text = (objTarifa.cantidad_desde) ? `${cantidad_desde_val} m` : '--';
        
        cantidad_hasta_val = (objTarifa.cantidad_hasta) ? escaparHTML(objTarifa.cantidad_hasta) : '';
        cantidad_hasta_text = (objTarifa.cantidad_hasta) ? `${cantidad_hasta_val} m` : '--';

        cantidad_desde_hasta_text = getCantidadDesdeHastaText(objTarifa);
                
        precio_val = (objTarifa.precio) ? escaparHTML(objTarifa.precio) : '';
        precio_text = (objTarifa.precio) ? `${precio_val} €` : '--';
    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(tarifa_action)){
        
        p_mensaje.innerHTML = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_tarifa}</b></span>
            </span>
        `;
        
        if(tarifa_action == 'ver'){
            const wr_img_editar_en_ver = document.createElement('span');
            wr_img_editar_en_ver.className = 'wr_img_editar_en_ver';
            wr_img_editar_en_ver.innerHTML = `
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            `;
            p_mensaje.append(wr_img_editar_en_ver);
        }
    }

    switch (tarifa_action) {
        case 'nuevo'://Nueva Tarifa
            p_mensaje.innerHTML = `
                <span>Rellena los campos del formulario con los datos de un tarifa <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_tarifa
            if(id_tarifa){
                id_tarifa = null;//reset ya que se va a crear un id_tarifa nuevo
            }else{
                //id_tarifa es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objTarifa = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            //resetBlockLista();        
            break;
        
        default:
        case 'ver'://Ver Tarifa - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_tarifa = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            break;

        case 'editar'://Editar Tarifa - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Tarifa - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_tarifa = '';//muestro
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteTarifa(event);">Eliminar Tarifa DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_tarifa_sm = document.createElement('div'); 
    contenedor_tarifa_sm.id = 'contenedor_tarifa_sm';
    contenedor_tarifa_sm.className = 'contenedor_form_sm';
    contenedor_tarifa_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Tarifa <span class="f_r ${cl_id_tarifa}">id: ${id_tarifa_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx">
                        <span class="cl_campo">Cantidad:</span>
                        <span>${cantidad_desde_hasta_text}</span>
                    </span>
                    <span class="linea_fx ${!precio_val ? 'd-none' : ''}">
                        <span class="cl_campo">Precio:</span>
                        <span>${precio_text}</span>
                    </span>

                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(descripcion_val) ? descripcion_detalles.outerHTML : '' }
        
        ${(tarifa_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarTarifa(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_tarifa = document.createElement('div');
    form_tarifa.id = 'form_tarifa';
    form_tarifa.innerHTML = `
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
                    <label for="nombre">Nombre de la tarifa</label>
                </div>


                <!-- Producto relacionado -->
                <div class="form_group wr_input_general">
                    <select id="id_producto" name="id_producto" class="d_productos_select sel_opt" required="">
                        <!-- aki productos -->
                    </select>
                    <label for="id_producto">Producto relacionado</label>
                </div> 
               

                <!-- cantidad_desde -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#cantidad_desde')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="cantidad_desde" type="text" name="cantidad_desde" required="" placeholder=" " value="${cantidad_desde_val}">
                    <label for="cantidad_desde">Cantidad DESDE (metros)</label>
                </div>
               

                <!-- cantidad_hasta -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#cantidad_hasta')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="cantidad_hasta" type="text" name="cantidad_hasta" required="" placeholder=" " value="${cantidad_hasta_val}">
                    <label for="cantidad_hasta">Cantidad HASTA (metros)</label>
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


                ${ (['nuevo','editar'].includes(tarifa_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //añado action onclick a wr_img_editar_en_ver
    const element_wr_img_editar_en_ver = form_tarifa.querySelector('.wr_img_editar_en_ver');
    if(element_wr_img_editar_en_ver){
        element_wr_img_editar_en_ver.onclick = () => {
            openModal('full','Editar Tarifa actual',null,'buildTarifa',true,'editar');
        }
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(tarifa_action)){ 
        contenedor = contenedor_tarifa_sm;        
    }else{
        contenedor = form_tarifa;
        if(tarifa_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    pintProductosOptionsEnSelect(contenedor.querySelector('.d_productos_select'), id_producto_val);//relleno select de productos

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}


function pintProductosOptionsEnSelect(selectElement, id_producto_selected = null){
    console.log('=== function pintGruposOptionsEnSelect() ===');
    
    selectElement.innerHTML = '';//reset

    if(!id_producto_selected){
        //añado opción por defecto para no seleccionar ningún producto
        selectElement.innerHTML = `
            <option value="" disabled="" selected="" hidden=""></option>
        `;
    }


    //Recorrer objDataProductos
    Object.values(objDataProductos.arr_data).forEach( (producto, i) => {
        const option = document.createElement('option');
        option.value = producto.id_producto;
        if(id_producto_selected && producto.id_producto == id_producto_selected){
            option.selected = true;
        }
        option.innerHTML = `${producto.id_producto}. ${producto.nombre}`;
        selectElement.append(option);
    });
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


async function guardarTarifa(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarTarifa() ===');
    
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

        const form_tarifa = document.getElementById('form_tarifa');

        let nombre = form_tarifa?.querySelector('#nombre').value.trim();
        let descripcion = form_tarifa?.querySelector('#descripcion').value.trim();
        let id_producto = form_tarifa?.querySelector('#id_producto').value.trim();
        let cantidad_desde = form_tarifa?.querySelector('#cantidad_desde').value.trim();
        let cantidad_hasta = form_tarifa?.querySelector('#cantidad_hasta').value.trim();
        let precio = form_tarifa?.querySelector('#precio').value.trim();
    
        let errors = [];

        if(modo_guardar === 'fast'){
            nombre = objTarifa.nombre;
        }

        if(nombre == ''){
            errors.push('Nombre del tarifa');
        }
        if(cantidad_desde == ''){
            errors.push('Cantidad del tarifa en metros');
        }
        if(precio == ''){
            errors.push('Precio del tarifa');
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


        const objTarifaToSend = {
            id_tarifa: id_tarifa || null, //ya que se añade un nuevo tarifa, entonces no hay id_tarifa
            nombre,
            descripcion,
            id_producto,
            cantidad_desde,
            cantidad_hasta,
            precio,
        }
        console.log('objTarifaToSend: ',objTarifaToSend);
    
        const data = await insertarTarifaDatos(objTarifaToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_tarifa':
                    text_show = 'Datos del tarifa han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_tarifa':
                    text_show = 'Datos del tarifa han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_tarifa){
                console.log('id_tarifa: ', data.id_tarifa);
                id_tarifa = data.id_tarifa;//guardo el id del tarifa recién creada

                //Cojo datos del tarifa desde BD
                objTarifa = await getDataTarifaFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objTarifa: ', objTarifa);

                const itemTarifaUpdate = objDataTarifas.arr_data?.find(item => item.id_tarifa == id_tarifa);
                if (itemTarifaUpdate) {//es update del tarifa existente
    
                    Object.assign(itemTarifaUpdate, objTarifa);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintTarifaActiveSoloDatos();//en el contenedor_tarifas

                } else {//es insert del tarifa nuevo
    
                    console.warn('No encontrado objTarifa.id_tarifa en objDataTarifas.arr_data');
                    //entonces es un tarifa nuevo que se crea

                    //1.debo añadir objTarifa en objDataTarifas.arr_data al inicio (si existe!)
                    objDataTarifas?.arr_data?.unshift(objTarifa);

                    //2.debo aumentar el numero de total tarifas (si existe!)
                    if (objDataTarifas?.totalRows != null){
                        objDataTarifas.totalRows++;
                    }

                    //3. old -> debo pintar d_tarifa en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintTarifaOne(objTarifa, 'arriba');//div de tarifa se pinta al inicio (arriba)
                    loadTarifasAll();
                }

                closeModal(null,true);
            }
           
        }else{

            let text_show = 'Error al guardar el tarifa.';
            console.log(text_show);
            console.error('data.error: ', data.error);

            showToast('error', text_show, 5000);

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarTarifa(). error: ',error);
    }

}

async function insertarTarifaDatos(objTarifa) {
    console.log('=== function insertarTarifaDatos(objTarifa) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objTarifa || Object.keys(objTarifa).length == 0){
            alert('No hay todos los parametros necesarios del tarifa...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objTarifa: ',objTarifa);

        const objTarifa_str = JSON.stringify(objTarifa);
        console.log('objTarifa_str: ',objTarifa_str);

        const nombre_fichero = 'insertar_datos_tarifa_one.php';

        const response = await fetch(`../app/php/datos/tarifa/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objTarifa_str
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
        console.error('Error en la función insertarTarifaDatos: ', error);
    }
}

async function deleteTarifa(event){
    console.log('=== function deleteTarifa() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_tarifa = objTarifa.id_tarifa;
        console.log('id_tarifa: ', id_tarifa);

        if(!id_tarifa){
            alert('id_tarifa no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el tarifa con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_tarifa}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objTarifa.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Descripción:</span> ${escaparHTML(objTarifa.descripcion) || '(sin descripcion)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar tarifa',
            pregunta,
            'confirmDelete',
            true,
            id_tarifa
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el tarifa...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteTarifaFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Tarifa eliminado con éxito.';
            console.log(text_show);

            if(data.id_tarifa){
                console.log('id_tarifa: ', data.id_tarifa);

                const totalAntes = objDataTarifas.arr_data.length;

                //elimino el objeto del tarifa eliminado desde objeto de todos los tarifas encontrados usando filter
                objDataTarifas.arr_data = objDataTarifas.arr_data.filter(
                    item => item.id_tarifa !== id_tarifa
                );

                const totalDespues = objDataTarifas.arr_data.length;
                const tarifa_is_deleted = totalDespues < totalAntes;

                if(tarifa_is_deleted){
                    console.log('tarifa eliminado de objDataTarifas');
                }else{
                    console.log('tarifa NO eliminado de objDataTarifas');
                }

                //Elimino elemento d_tarifa de los tarifas encontrados en 'contenedor_tarifas'
                eid_contenedor_tarifas.querySelector(`.d_tarifa[data-id_tarifa="${id_tarifa}"]`).remove();
                eid_block_tarifas.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_tarifa = null;
                objTarifa = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                loadTarifasAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar el tarifa.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteTarifa. error: ',error);        
    }

}

async function deleteTarifaFromBd(){
    console.log('=== function deleteTarifaFromBd() ===');

    try {
        
        if(!hay_id(id_tarifa, 'id_tarifa', 'deleteTarifaFromBd()')){
            return; // <- se detiene aquí si no hay id_tarifa
        }

        const nombre_fichero = 'eliminar_datos_tarifa_one.php';
               
        const response = await fetch(`../app/php/datos/tarifa/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_tarifa: id_tarifa
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
                console.log(`[ELIMINADO] id_tarifa: [${data.id_tarifa}] --- nombre: [${data.nombre}]`);
    
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
        console.error('Error en deleteTarifaFromBd(): error.message: ', error.message);
    }
}


function pintTarifaActive(){//click en div del contenedor de tarifas que ya están en el DOM
    console.log('=== function pintTarifaActive(e) === ');

    console.log('asignado global --- id_tarifa: ', id_tarifa);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_tarifas, 'd_tarifa');
    eid_contenedor_tarifas.querySelector(`.d_tarifa[data-id_tarifa="${id_tarifa}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_tarifa viene como string: "925"
    objTarifa = objDataTarifas.arr_data.find(v => v.id_tarifa == id_tarifa);
    console.log('objTarifa: ', objTarifa);

    pintTarifaActiveSoloDatos();

}

async function loadTarifasAll(){
    console.log('=== function loadTarifasAll() === ');

    objDataTarifas = await getTarifasAll();

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
        f_frase: '(Todos tarifas)',
        f_num: objDataTarifas?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_tarifas, objDataPint);
    
    pintTarifasAll();

}

async function pintTarifasAll(){//pintar todos los div de tarifas, o al load o al find
    console.log('=== function pintTarifasAll() === '); 
    
    console.time('time_pintTarifasAlll');

    // if(!objDataTarifas?.arr_data?.length){//si length === 0, entonces no hay tarifas
    //     console.warn('No hay tarifas en objDataTarifas.arr_data');
    //     return;
    // }

    eid_contenedor_tarifas.innerHTML = '';//reset contenedor de tarifas

    const hay_datos = (esObjeto(objDataTarifas) && objDataTarifas.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_tarifas.innerHTML = `
            <p class="prim">No existe ningún registro de tarifa en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataTarifas: ', objDataTarifas);        
        
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
        //Recorrer tarifas encontradas... 
        objDataTarifas.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintTarifaOne(obj, 'abajo');//cada div de tarifa se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintTarifasAlll');
   
}

function getCantidadDesdeHastaText(obj){
        
    if(!obj){
        return '';
    }

    let cantidad_desde_hasta_text;


    if(obj.cantidad_desde > 0 && obj.cantidad_hasta > 0){
        cantidad_desde_hasta_text = `${obj.cantidad_desde}-${obj.cantidad_hasta} m`;//desde-hasta //'2-5m'
    }else{
        if(obj.cantidad_desde > 0 && !obj.cantidad_hasta){
            //de 0 a 100
            if(obj.cantidad_desde == 1){
                cantidad_desde_hasta_text = `${obj.cantidad_desde} m`;//solo desde //1m
            }else{//mas de 1 -> 100+
                cantidad_desde_hasta_text = `${obj.cantidad_desde}+ m`;//solo desde //1m
            }
        }
    }

    return cantidad_desde_hasta_text;
}


function pintTarifaOne(objTarifaOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un tarifa, o al load, o al crear, o al find
    console.log('=== function pintTarifaOne() === ');

    if(!objTarifaOne){
        console.warn('No hay objeto de tarifa. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objTarifaOne.descripcion) ? '' : 'd-none';//si no hay título, lo oculto    
    let cantidad_desde_hasta_text = getCantidadDesdeHastaText(objTarifaOne);
    const precio_text = (objTarifaOne.precio) ? `${objTarifaOne.precio} €` : '--' ;

    const d_tarifa = document.createElement('div');
    d_tarifa.className = 'd_tarifa d_art';
    d_tarifa.dataset.id_tarifa = objTarifaOne.id_tarifa;
    d_tarifa.dataset.tipo_art = 'tarifa';
    d_tarifa.innerHTML = `
        <div class="datos_tarifa datos_art">
            <div class="da_nombre">${escaparHTML(objTarifaOne.nombre) || '(nombre no asignado)'}</div>
            <div class="da_com ${cl_da_comm}">${escaparHTML(objTarifaOne.descripcion) || '(sin descripcion)'}</div>
        </div>
        <div class="art_cols art_col3">
            <div class="da_cantidad_desde_hasta">${cantidad_desde_hasta_text}</div>
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

    d_tarifa.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_tarifa = e.currentTarget.dataset.id_tarifa;
        console.log('asigno global --- id_tarifa: ', id_tarifa); 

        // siempre al clicar en cualquier parte del d_tarifa se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintTarifaActive();
        

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

            //clic dentro de d_tarifa y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_tarifa y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_tarifa - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Tarifa actual',null,'buildTarifa',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Tarifa actual',null,'buildTarifa',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Tarifa actual',null,'buildTarifa',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_tarifas.append(d_tarifa);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_tarifas.prepend(d_tarifa);
    }
}


async function findWordsTarifa(){
    console.log('=== async function findWordsTarifa() ===');
    console.time('time_findWordsTarifa');

    const eid_inpt_find_tarifa = document.getElementById('inpt_find_tarifa');
    const eid_modo_tarifa = document.getElementById('modo_tarifa');
    const eid_buscar_en_tarifa = document.getElementById('buscar_en_tarifa');
    const eid_regs_finded_tarifa = document.getElementById('regs_finded_tarifa');

    let words_input_trimed = eid_inpt_find_tarifa.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_tarifa.value;
    let buscar_en = eid_buscar_en_tarifa.value;
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

    objFindParamsTarifa.words_input = words_input;
    objFindParamsTarifa.modo = modo;
    objFindParamsTarifa.buscar_en = buscar_en;
    objFindParamsTarifa.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataTarifasFinded = await getDataTarifasFromBdByFind(objFindParamsTarifa);
    console.log('objDataTarifasFinded: ', objDataTarifasFinded);   

    
    const hay_coincidencias = (esObjeto(objDataTarifasFinded) && objDataTarifasFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsTarifa.findedRows = 0;

        eid_regs_finded_tarifa.classList.remove('d-none');
        eid_regs_finded_tarifa.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay tarifas...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsTarifa.findedRows = objDataTarifasFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_tarifa.classList.remove('d-none');
        eid_regs_finded_tarifa.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataTarifasFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_tarifa" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_tarifa.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_tarifa') {
                console.log('clic en btn_mostrar_finded_tarifa');
                console.log('mostrar clicked -> reasigno objDataTarifas desde objDataTarifasFinded'); 
                
                //Clono objeto
                objDataTarifas = structuredClone(objDataTarifasFinded);
                console.log('objDataTarifas: ', objDataTarifas);



                const modo_val = objModoBusquedaTarifa[`modo${objFindParamsTarifa.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaTarifa[`buscar_en${objFindParamsTarifa.buscar_en}`].titulo;

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
                    f_frase: objFindParamsTarifa.words_input,
                    f_num: objFindParamsTarifa.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_tarifas, objDataPint);               
                                
                pintTarifasAll();
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

    await update_objFindParamsTarifa();

    console.timeEnd('time_findWordsTarifa');
}


async function getTarifasAll(){
    console.log('=== async function getTarifasAll() ===');
    console.time('time_getTarifasAll');

    objDataTarifasBd = await getDataTarifasAllFromBd();//la funcion que saca todos los tarifa para pintarlo
    console.log('objDataTarifasBd: ', objDataTarifasBd);

    console.timeEnd('time_getTarifasAll');

    return objDataTarifasBd;

}


async function crear_objDataTarifas(){
    console.log('=== function crear_objDataTarifas() ===');
    console.time('time_crear_objDataTarifas');

    objDataTarifas = await getDataTarifasAllFromBd();
    console.log(`objDataTarifas: `, objDataTarifas);

    console.timeEnd('time_crear_objDataTarifas');
}

async function getDataTarifasAllFromBd(){//sacar TODOS los tarifas para rellenar contenedor_tarifas
    console.log('=== function getDataTarifasAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_tarifas_all.php';
        
        const response = await fetch(`../app/php/datos/tarifa/${nombre_fichero}`, {
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
        console.error('Error en getDataTarifasAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarTarifa(){
    console.log('=== function buildBuscarTarifa() ===');

    console.log('objTarifa: ', objTarifa);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_tarifa"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsTarifa?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_tarifa')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsTarifa()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_tarifa" class="sel_opt_find">
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
            <select id="buscar_en_tarifa" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de tarifa</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_tarifa" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_tarifa');
    
    //modo
    const eid_modo_tarifa = wr_args_busqueda.querySelector('#modo_tarifa');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsTarifa
    eid_modo_tarifa.value = objFindParamsTarifa?.modo || 1 ;

    eid_modo_tarifa.onchange = async (e) => {
        findWordsTarifa();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaTarifa[`modo${objFindParamsTarifa.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaTarifa[`modo${objFindParamsTarifa.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_tarifa = wr_args_busqueda.querySelector('#buscar_en_tarifa');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsTarifa
    eid_buscar_en_tarifa.value = objFindParamsTarifa?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaTarifa[`buscar_en${objFindParamsTarifa.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaTarifa[`buscar_en${objFindParamsTarifa.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_tarifa.onchange = async (e) => {
        findWordsTarifa();
    }


    //al teclear texto en la busqueda de tarifa
    let timeoutFindTarifa;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindTarifa);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindTarifa = setTimeout(async () => {
            await findWordsTarifa();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataTarifasFromBdByFind(objFindParamsTarifa){
    console.log('=== function getDataTarifasFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsTarifa;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_tarifas_by_find.php';
               
        const response = await fetch(`../app/php/datos/tarifa/${nombre_fichero}`, {
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
        console.error('Error en getDataTarifasFromBdByFind(): error.message: ', error.message);
    }
}


function pintTarifaActiveSoloDatos(){
    console.log('=== function pintTarifaActiveSoloDatos() === ');

    if(!objTarifa){
        alert('no hay objTarifa');
        return;
    }

    const d_tarifa = eid_contenedor_tarifas.querySelector(`.d_tarifa[data-id_tarifa="${objTarifa.id_tarifa}"]`);
    console.log('d_tarifa: ', d_tarifa);
    
    if(!d_tarifa){
        console.log('no hay d_tarifa. no actualizo d_tarifa...');
        return;
    }

    const div_da_nombre = d_tarifa.querySelector('.da_nombre');
    const div_da_com = d_tarifa.querySelector('.da_com');
    const div_da_cantidad_desde_hasta = d_tarifa.querySelector('.da_cantidad_desde_hasta');
    const div_da_precio = d_tarifa.querySelector('.da_precio');

    const cantidad_desde_hasta_text = getCantidadDesdeHastaText(objTarifa);
    const precio_text = (objTarifa.precio) ? `${objTarifa.precio} €` : '--' ;

    //nombre
    div_da_nombre.textContent = objTarifa.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //cantidad_desde_hasta
    div_da_cantidad_desde_hasta.textContent = cantidad_desde_hasta_text;
    div_da_cantidad_desde_hasta.classList.remove('d-none');//muestro tenga o no el precio

    //precio
    div_da_precio.textContent = precio_text;
    div_da_precio.classList.remove('d-none');//muestro tenga o no el precio

    //descripcion
    div_da_com.textContent = objTarifa.descripcion || '(sin descripcion)';
    //si '!objTarifa.descripcion' es true  (no tiene descripcion) -> pone  'd-none' -> oculta
    //si '!objTarifa.descripcion' es false (sí tiene descripcion) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objTarifa.descripcion);

}

async function getDataTarifaFromBd(){
    console.log('=== function getDataTarifaFromBd() ===');

    try {
        
        if(!hay_id(id_tarifa, 'id_tarifa', 'getDataTarifaFromBd()')){
            return; // <- se detiene aquí si no hay id_tarifa
        }

        const nombre_fichero = 'obtener_datos_tarifa_one.php';
     
        const response = await fetch(`../app/php/datos/tarifa/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_tarifa: id_tarifa
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

                console.log(`id_tarifa: [${id_tarifa}] --- nombre: [${data.nombre}]`);

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
        console.error('Error en getDataTarifaFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsTarifa(){
    console.log('=== function update_objFindParamsTarifa() ===');

    obj_ajustes.objFindParamsTarifa = objFindParamsTarifa;
    await update_obj_ajustes();
}