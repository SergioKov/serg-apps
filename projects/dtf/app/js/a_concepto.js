//concepto
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function addConcepto(){
    console.log('=== function addConcepto() ===');

    //permito construir modal con el formulario
    openModal('full', 'Crear Concepto', null, 'buildConcepto', true, 'nuevo');
}


async function buildConcepto(concepto_action = null){
    console.log('=== function buildConcepto() ===');

    console.log('concepto_action: ', concepto_action);
    console.log('objConcepto: ', objConcepto);

    eid_bl_modalFullInner.innerHTML = '';//reset

    //campos de input
    let id_concepto_val = '';
    let id_concepto_padre_val = '';
    let tipo_concepto_val = '';
    let tipo_uso_val = '';
    let nombre_val = '';
    let comentario_val = '';

    //elemento de título en el top
    const p_mensaje = document.createElement('p');
    p_mensaje.className = 'mensaje';
        
    //otras vars
    let cl_id_concepto = 'd-none';//oculto
    let cl_solo_ver = '';
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(concepto_action == 'nuevo'){//si es nueva
        
        //mostrarPrim = false;    

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id(id_concepto, 'id_concepto', 'buildConcepto()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún concepto.</p>
                <p class="p_aviso">Crea un concepto pulsando "+".</p>
            `;
            openModal('center','Aviso Concepto',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_concepto
        } 

        id_concepto_val = objConcepto.id_concepto;
        id_concepto_padre_val = objConcepto.id_concepto_padre || '';

        if(id_concepto_padre_val){
            objConceptoPadre = await getDataConceptoFromBd(id_concepto_padre_val);//IMPORTANTE para cojer todos los datos necesarios
        }else{
            objConceptoPadre = {};//reset. IMPORTANTE para no cojer el id_concepto seleccionado antes.
        }

        tipo_concepto_val = (objConcepto.tipo_concepto) ? escaparHTML(objConcepto.tipo_concepto) : '';
        tipo_uso_val = (objConcepto.tipo_uso) ? escaparHTML(objConcepto.tipo_uso) : '';
        nombre_val = escaparHTML(objConcepto.nombre) || '';
        comentario_val = escaparHTML(objConcepto.comentario) || '';
    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(concepto_action)){
        
        p_mensaje.innerHTML = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_concepto}</b></span>
            </span>
        `;
        
        if(concepto_action == 'ver'){
            const wr_img_editar_en_ver = document.createElement('span');
            wr_img_editar_en_ver.className = 'wr_img_editar_en_ver';
            wr_img_editar_en_ver.innerHTML = `
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            `;
            p_mensaje.append(wr_img_editar_en_ver);
        }
    }

    switch (concepto_action) {
        case 'nuevo'://Nueva Concepto
            p_mensaje.innerHTML = `
                <span>Rellena los campos del formulario con los datos de un concepto <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_concepto
            if(id_concepto){
                id_concepto = null;//reset ya que se va a crear un id_concepto nuevo
            }else{
                //id_concepto es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objConcepto = {};//reset
            objConceptoPadre = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            //resetBlockLista();        
            break;
        
        default:
        case 'ver'://Ver Concepto - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_concepto = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            cl_solo_ver = 'solo_ver';//permito solo ver y no manejar el click
            break;

        case 'editar'://Editar Concepto - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Concepto - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_concepto = '';//muestro
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteConcepto(event);">Eliminar Concepto DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_concepto_sm = document.createElement('div'); 
    contenedor_concepto_sm.id = 'contenedor_concepto_sm';
    contenedor_concepto_sm.className = 'contenedor_form_sm';
    contenedor_concepto_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Concepto <span class="f_r ${cl_id_concepto}">id: ${id_concepto_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(comentario_val) ? comentario_detalles.outerHTML : '' }
        
        ${(concepto_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarConcepto(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_concepto = document.createElement('div');
    form_concepto.id = 'form_concepto';
    form_concepto.innerHTML = `
        <div class="form_container">
            <form>
                
                <!-- titulo -->
                ${p_mensaje.outerHTML}


                <!-- tipo_concepto -->
                <div class="form_group wr_input_general">
                    <label class="lab_varios_btns">Tipo de concepto</label>
                    <div id="d_tipo_concepto" class="wr_varios_btns ${cl_solo_ver}">
                        <div class="dbtn" data-value="ingreso">Ingreso</div>
                        <div class="dbtn" data-value="gasto">Gasto</div>
                    </div>
                    <input id="tipo_concepto" type="hidden" name="tipo_concepto" value="${tipo_concepto_val}"> 
                </div>
                <!-- /tipo_concepto -->


                <!-- nombre -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#nombre')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="nombre" type="text" name="nombre" required="" placeholder=" " value="${nombre_val}">
                    <label for="nombre">Nombre del concepto</label>
                </div>
                <!-- /nombre -->


                <!-- tipo_uso -->
                <div class="form_group wr_input_general wr_tipo_uso">
                    <div class="d_info_sm" onclick="showInfo('tipo_uso')">i</div>
                    <select id="tipo_uso" name="tipo_uso" class="sel_productos_select sel_opt" required="">
                        <option value=""></option>>
                        <option value="pago_pedido">Usar este concepto para PAGO de PEDIDO</option>>
                    </select>
                    <label for="tipo_uso">Tipo de uso del concepto</label>
                </div>
                <!-- /tipo_uso -->


                <!-- buscar concepto padre -->
                <div class="wr_buscar_concepto_padre d_buscar_by_id ${cl_solo_ver}">

                    <div class="wr_bl_buscar_head">
                        <h5>Concepto Padre</h5>
                        <div id="lupa_buscar_concepto_padre" class="wr_btn_lupa wr_btn_img">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                        </div>
                    </div>

                    <div id="datos_concepto_padre_finded" class="reg_selected">
                        <!-- aki se pintan los datos del concepto_padre vinculado -->
                    </div>

                    <input id="id_concepto_padre" type="hidden" name="id_concepto_padre" value="${id_concepto_padre_val}">
                </div>
                <!-- /buscar concepto padre -->


                <!-- comentario -->
                <div class="form_group">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#comentario')">
                        <img src="images/x_white.png">
                    </div>
                    <textarea id="comentario" name="comentario" rows="4" required="" placeholder=" ">${comentario_val}</textarea>
                    <label class="lab_textarea" for="comentario">Comentario</label>
                </div>


                ${ (['nuevo','editar'].includes(concepto_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    const eid_d_tipo_concepto = form_concepto.querySelector('#d_tipo_concepto');
    const eid_datos_concepto_padre_finded = form_concepto.querySelector('#datos_concepto_padre_finded');
    const input_tipo_concepto = form_concepto.querySelector('#tipo_concepto');
    
    const select_tipo_uso = form_concepto.querySelector('#tipo_uso');

    //buscar_concepto
    const eid_lupa_buscar_concepto_padre = form_concepto.querySelector('#lupa_buscar_concepto_padre');
    const input_id_concepto_padre = form_concepto.querySelector('#id_concepto_padre');
    

    //=============================================================================//
    //start - funciones de form. 
    //=============================================================================//

    //pinto datos del concepto vinculado si hay
    //si no hay id_concepto, entonces objConcepto es {} lo que es correcto para la función 
    pintDatosConceptoFinded(eid_datos_concepto_padre_finded, objConceptoPadre, input_id_concepto_padre);
    
    eid_lupa_buscar_concepto_padre.onclick = (e) => {
        console.log('eid_lupa_buscar_concepto_padre.onclick');
        buildModalBuscarConcepto(input_id_concepto_padre, input_tipo_concepto);
    }
    

    let tipo_concepto_anterior_val = objConcepto.tipo_concepto;//por defecto

    //tipo_concepto
    eid_d_tipo_concepto.onclick = (e) => {
        console.log('e.currentTarget: ', e.currentTarget);
        console.log('e.target: ', e.target);

        const contenedor_dbtns = e.currentTarget;
        const btn = e.target;

        if(contenedor_dbtns.classList.contains('solo_ver')){
            return;//no dejo cambiar el valor si es form_ver
        }

        const tipo_concepto_val = btn.dataset.value;

        if(tipo_concepto_val == tipo_concepto_anterior_val){
            console.log('es el click sobre el mismo valor. no hago nada');
            return;
        }

        //compruebo si tipo_concepto seleccionado corresponde a tipo_concepto del propio concepto
        if(objConceptoPadre.tipo_concepto && tipo_concepto_val != objConceptoPadre.tipo_concepto){
            const aviso_text = `
                <p>Estás intentando asignar el tipo de concepto <b class="da_tipo_concepto ${tipo_concepto_val}">${tipo_concepto_val}</b> para el concepto con el tipo de concepto de su padre <b class="da_tipo_concepto ${objConceptoPadre.tipo_concepto}">${objConceptoPadre.tipo_concepto}</b> lo que no tiene lógica y es incorrecto.</p> 
                <p>Si quieres elegir este tipo de concepto que es <b class="da_tipo_concepto ${tipo_concepto_val}">${tipo_concepto_val}</b>, quita el concepto padre actual pulsando <span class="close_x_sm">✕</span>, cambia el tipo de concepto y selecciona un concepto padre nuevo.</p>
            `;

            showToast('error', aviso_text, 50, 'center', true, 'Error en los tipos');
            return;
        }

        meterValor('tipo_concepto', eid_d_tipo_concepto, tipo_concepto_val);
        pintDivSelected('d_tipo_concepto', eid_d_tipo_concepto, tipo_concepto_val);

        tipo_concepto_anterior_val = tipo_concepto_val;
    }
    //al cargar el formulario
    pintDivSelected('d_tipo_concepto', eid_d_tipo_concepto, objConcepto.tipo_concepto);  
    
    //tipo_uso al cargar formulario
    select_tipo_uso.value = tipo_uso_val;
    

    //añado action onclick a wr_img_editar_en_ver
    const element_wr_img_editar_en_ver = form_concepto.querySelector('.wr_img_editar_en_ver');
    if(element_wr_img_editar_en_ver){
        element_wr_img_editar_en_ver.onclick = () => {
            openModal('full','Editar Concepto actual',null,'buildConcepto',true,'editar');
        }
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(concepto_action)){ 
        contenedor = contenedor_concepto_sm;        
    }else{
        contenedor = form_concepto;
        if(concepto_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    //=============================================================================//
    //end - funciones de form. 
    //=============================================================================//

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}

async function guardarConcepto(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarConcepto() ===');
    
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

        const form_concepto = document.getElementById('form_concepto');

        const tipo_concepto = form_concepto?.querySelector('#tipo_concepto').value.trim();
        const nombre = form_concepto?.querySelector('#nombre').value.trim();
        const tipo_uso = form_concepto?.querySelector('#tipo_uso').value.trim();
        const id_concepto_padre = form_concepto?.querySelector('#id_concepto_padre').value.trim();
        const comentario = form_concepto?.querySelector('#comentario').value.trim();
    
        let errors = [];

        // if(modo_guardar === 'fast'){
        //     nombre = objConcepto.nombre;
        // }
        
        if(tipo_concepto == ''){
            errors.push('Tipo de concepto');
        }
        if(nombre == ''){
            errors.push('Nombre del concepto');
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


        const objConceptoToSend = {
            id_concepto: id_concepto || null, //ya que se añade un nuevo concepto, entonces no hay id_concepto
            id_concepto_padre: id_concepto_padre || null, //si es null -> no tiene padre
            tipo_concepto,
            nombre,
            tipo_uso,
            comentario,
        }
        console.log('objConceptoToSend: ',objConceptoToSend);
    
        const data = await insertarConceptoDatos(objConceptoToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_concepto':
                    text_show = 'Datos del concepto han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_concepto':
                    text_show = 'Datos del concepto han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_concepto){
                console.log('id_concepto: ', data.id_concepto);
                id_concepto = data.id_concepto;//guardo el id del concepto recién creada

                //Cojo datos del concepto desde BD
                objConcepto = await getDataConceptoFromBd(id_concepto);//IMPORTANTE para cojer todos los datos necesarios
                console.log('objConcepto: ', objConcepto);

                //actualizo concepto anterior que tiene tipo_uso = 'pago_pedido'
                if(objConcepto.tipo_uso === 'pago_pedido'){
                    const itemConceptoConPagoPedidoAnteriorUpdate = objDataConceptos?.arr_data?.find(
                        item => 
                            item.id_concepto != id_concepto && item.tipo_uso === 'pago_pedido'
                    );

                    if(itemConceptoConPagoPedidoAnteriorUpdate){
                        const objConceptoConPagoPedidoAnterior = await getDataConceptoFromBd(itemConceptoConPagoPedidoAnteriorUpdate.id_concepto);

                        if(objConceptoConPagoPedidoAnterior){
                            Object.assign(itemConceptoConPagoPedidoAnteriorUpdate, objConceptoConPagoPedidoAnterior);
                        }
                    }
                }


                const itemConceptoUpdate = objDataConceptos?.arr_data?.find(item => item.id_concepto == id_concepto);
                if (itemConceptoUpdate) {//es update del concepto existente
    
                    Object.assign(itemConceptoUpdate, objConcepto);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintConceptoActiveSoloDatos();//en el contenedor_conceptos

                } else {//es insert del concepto nuevo
    
                    console.log('No encontrado objConcepto.id_concepto en objDataConceptos.arr_data');
                    //entonces es un concepto nuevo que se crea

                    //1.debo añadir objConcepto en objDataConceptos.arr_data al inicio (si existe!)
                    objDataConceptos?.arr_data?.unshift(objConcepto);

                    //2.debo aumentar el numero de total conceptos (si existe!)
                    if (objDataConceptos?.totalRows != null){
                        objDataConceptos.totalRows++;
                    }

                    //3. old -> debo pintar d_concepto en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintConceptoOne(objConcepto, 'arriba');//div de concepto se pinta al inicio (arriba)
                    await loadConceptosAll();
                }

                closeModal(null,true);
            }
           
        }else{

            let text_show = 'Error al guardar el concepto.';
            console.log(text_show);
            console.error('data.error: ', data.error);

            showToast('error', text_show, 5000);

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarConcepto(). error: ',error);
    }

}

async function insertarConceptoDatos(objConcepto) {
    console.log('=== function insertarConceptoDatos(objConcepto) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objConcepto || Object.keys(objConcepto).length == 0){
            alert('No hay todos los parametros necesarios del concepto...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objConcepto: ',objConcepto);

        const objConcepto_str = JSON.stringify(objConcepto);
        console.log('objConcepto_str: ',objConcepto_str);

        const nombre_fichero = 'insertar_datos_concepto_one.php';

        const response = await fetch(`../app/php/datos/concepto/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objConcepto_str
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
        console.error('Error en la función insertarConceptoDatos: ', error);
    }
}

async function deleteConcepto(event){
    console.log('=== function deleteConcepto() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_concepto = objConcepto.id_concepto;
        console.log('id_concepto: ', id_concepto);

        if(!id_concepto){
            alert('id_concepto no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el concepto con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_concepto}</p> 
            <p><span class="cl_campo">Tipo:</span> ${escaparHTML(convertirToTitleCase(objConcepto.tipo_concepto))}</p>
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objConcepto.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo ${objConcepto.comentario ? '' : 'd-none'}">Comentario:</span> ${escaparHTML(objConcepto.comentario) || '(sin comentario)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar concepto',
            pregunta,
            'confirmDelete',
            true,
            id_concepto
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el concepto...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteConceptoFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Concepto eliminado con éxito.';
            console.log(text_show);

            if(data.id_concepto){
                console.log('id_concepto: ', data.id_concepto);

                const totalAntes = objDataConceptos.arr_data.length;

                //elimino el objeto del concepto eliminado desde objeto de todos los conceptos encontrados usando filter
                objDataConceptos.arr_data = objDataConceptos.arr_data.filter(
                    item => item.id_concepto !== id_concepto
                );

                const totalDespues = objDataConceptos.arr_data.length;
                const concepto_is_deleted = totalDespues < totalAntes;

                if(concepto_is_deleted){
                    console.log('concepto eliminado de objDataConceptos');
                }else{
                    console.log('concepto NO eliminado de objDataConceptos');
                }

                //Elimino elemento d_concepto de los conceptos encontrados en 'contenedor_conceptos'
                eid_contenedor_conceptos.querySelector(`.d_concepto[data-id_concepto="${id_concepto}"]`).remove();
                eid_block_conceptos.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_concepto = null;
                objConcepto = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                await loadConceptosAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar el concepto.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteConcepto. error: ',error);        
    }

}

async function deleteConceptoFromBd(){
    console.log('=== function deleteConceptoFromBd() ===');

    try {
        
        if(!hay_id(id_concepto, 'id_concepto', 'deleteConceptoFromBd()')){
            return; // <- se detiene aquí si no hay id_concepto
        }

        const nombre_fichero = 'eliminar_datos_concepto_one.php';
               
        const response = await fetch(`../app/php/datos/concepto/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_concepto: id_concepto
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
                console.log(`[ELIMINADO] id_concepto: [${data.id_concepto}] --- nombre: [${data.nombre}]`);
    
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
        console.error('Error en deleteConceptoFromBd(): error.message: ', error.message);
    }
}


function pintConceptoActive(){//click en div del contenedor de conceptos que ya están en el DOM
    console.log('=== function pintConceptoActive(e) === ');

    console.log('asignado global --- id_concepto: ', id_concepto);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_conceptos, 'd_concepto');
    eid_contenedor_conceptos.querySelector(`.d_concepto[data-id_concepto="${id_concepto}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_concepto viene como string: "925"
    objConcepto = objDataConceptos.arr_data.find(v => v.id_concepto == id_concepto);
    console.log('objConcepto: ', objConcepto);

    pintConceptoActiveSoloDatos();

}

async function loadConceptosAll(){
    console.log('=== function loadConceptosAll() === ');

    objDataConceptos = await getConceptosAll();

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
        f_frase: '(Todos conceptos)',
        f_num: objDataConceptos?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_conceptos, objDataPint);
    
    pintConceptosAll();

}

async function pintConceptosAll(){//pintar todos los div de conceptos, o al load o al find
    console.log('=== function pintConceptosAll() === '); 
    
    console.time('time_pintConceptosAlll');

    // if(!objDataConceptos?.arr_data?.length){//si length === 0, entonces no hay conceptos
    //     console.warn('No hay conceptos en objDataConceptos.arr_data');
    //     return;
    // }

    eid_contenedor_conceptos.innerHTML = '';//reset contenedor de conceptos

    const hay_datos = (esObjeto(objDataConceptos) && objDataConceptos.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_conceptos.innerHTML = `
            <p class="prim">No existe ningún registro de concepto en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataConceptos: ', objDataConceptos);        
        
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
        //Recorrer conceptos encontradas... 
        objDataConceptos.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintConceptoOne(obj, 'abajo');//cada div de concepto se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintConceptosAlll');
   
}


function pintConceptoOne(objConceptoOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un concepto, o al load, o al crear, o al find
    console.log('=== function pintConceptoOne() === ');

    if(!objConceptoOne){
        console.warn('No hay objeto de concepto. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objConceptoOne.comentario) ? '' : 'd-none';//si no hay título, lo oculto
    
    const precio_text = (objConceptoOne.precio) ? `${objConceptoOne.precio} €` : '--' ;

    const d_concepto = document.createElement('div');
    d_concepto.className = 'd_concepto d_art';
    d_concepto.dataset.id_concepto = objConceptoOne.id_concepto;
    d_concepto.dataset.tipo_art = 'concepto';
    d_concepto.innerHTML = `
        <div class="datos_concepto datos_art">
            <div class="wr_id_nombre">
                <div class="da_id">${objConceptoOne.id_concepto}</div>
                <div class="da_nombre">${escaparHTML(objConceptoOne.nombre) || '(nombre no asignado)'}</div>
            </div>
            <div class="da_com ${cl_da_comm}">${escaparHTML(objConceptoOne.comentario) || '(sin comentario)'}</div>
        </div>
        <div class="art_cols art_col4">
            <div class="da_tipo_concepto ${objConceptoOne.tipo_concepto}">${escaparHTML(convertirToTitleCase(objConceptoOne.tipo_concepto))}</div>
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

    d_concepto.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_concepto = e.currentTarget.dataset.id_concepto;
        console.log('asigno global --- id_concepto: ', id_concepto); 

        // siempre al clicar en cualquier parte del d_concepto se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintConceptoActive();
        

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

            //clic dentro de d_concepto y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_concepto y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_concepto - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Concepto actual',null,'buildConcepto',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Concepto actual',null,'buildConcepto',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Concepto actual',null,'buildConcepto',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_conceptos.append(d_concepto);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_conceptos.prepend(d_concepto);
    }
}


async function findWordsConcepto(){
    console.log('=== async function findWordsConcepto() ===');
    console.time('time_findWordsConcepto');

    const eid_inpt_find_concepto = document.getElementById('inpt_find_concepto');
    const eid_modo_concepto = document.getElementById('modo_concepto');
    const eid_buscar_en_concepto = document.getElementById('buscar_en_concepto');
    const eid_regs_finded_concepto = document.getElementById('regs_finded_concepto');

    let words_input_trimed = eid_inpt_find_concepto.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_concepto.value;
    let buscar_en = eid_buscar_en_concepto.value;
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

    objFindParamsConcepto.words_input = words_input;
    objFindParamsConcepto.modo = modo;
    objFindParamsConcepto.buscar_en = buscar_en;
    objFindParamsConcepto.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataConceptosFinded = await getDataConceptosFromBdByFind(objFindParamsConcepto);
    console.log('objDataConceptosFinded: ', objDataConceptosFinded);   

    
    const hay_coincidencias = (esObjeto(objDataConceptosFinded) && objDataConceptosFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsConcepto.findedRows = 0;

        eid_regs_finded_concepto.classList.remove('d-none');
        eid_regs_finded_concepto.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay conceptos...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsConcepto.findedRows = objDataConceptosFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_concepto.classList.remove('d-none');
        eid_regs_finded_concepto.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataConceptosFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_concepto" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_concepto.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_concepto') {
                console.log('clic en btn_mostrar_finded_concepto');
                console.log('mostrar clicked -> reasigno objDataConceptos desde objDataConceptosFinded'); 
                
                //Clono objeto
                objDataConceptos = structuredClone(objDataConceptosFinded);
                console.log('objDataConceptos: ', objDataConceptos);


                const modo_val = objModoBusquedaConcepto[`modo${objFindParamsConcepto.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaConcepto[`buscar_en${objFindParamsConcepto.buscar_en}`].titulo;

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
                    f_frase: objFindParamsConcepto.words_input,
                    f_num: objFindParamsConcepto.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_conceptos, objDataPint);               
                                
                pintConceptosAll();
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

    await update_objFindParamsConcepto();

    console.timeEnd('time_findWordsConcepto');
}


async function getConceptosAll(){
    console.log('=== async function getConceptosAll() ===');
    console.time('time_getConceptosAll');

    objDataConceptosBd = await getDataConceptosAllFromBd();//la funcion que saca todos los concepto para pintarlo
    console.log('objDataConceptosBd: ', objDataConceptosBd);

    console.timeEnd('time_getConceptosAll');

    return objDataConceptosBd;

}


async function crear_objDataConceptos(){
    console.log('=== function crear_objDataConceptos() ===');
    console.time('time_crear_objDataConceptos');

    objDataConceptos = await getDataConceptosAllFromBd();
    console.log(`objDataConceptos: `, objDataConceptos);

    console.timeEnd('time_crear_objDataConceptos');
}

async function getDataConceptosAllFromBd(){//sacar TODOS los conceptos para rellenar contenedor_conceptos
    console.log('=== function getDataConceptosAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_conceptos_all.php';
        
        const response = await fetch(`../app/php/datos/concepto/${nombre_fichero}`, {
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
        console.error('Error en getDataConceptosAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarConcepto(){
    console.log('=== function buildBuscarConcepto() ===');

    console.log('objConcepto: ', objConcepto);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_concepto"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsConcepto?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_concepto')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsConcepto()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda</h5>
            <select id="modo_concepto" class="sel_opt_find">
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
            <h5>Buscar en</h5>
            <select id="buscar_en_concepto" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de concepto</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_concepto" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_concepto');
    
    //modo
    const eid_modo_concepto = wr_args_busqueda.querySelector('#modo_concepto');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsConcepto
    eid_modo_concepto.value = objFindParamsConcepto?.modo || 1 ;

    eid_modo_concepto.onchange = async (e) => {
        findWordsConcepto();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaConcepto[`modo${objFindParamsConcepto.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaConcepto[`modo${objFindParamsConcepto.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_concepto = wr_args_busqueda.querySelector('#buscar_en_concepto');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsConcepto
    eid_buscar_en_concepto.value = objFindParamsConcepto?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaConcepto[`buscar_en${objFindParamsConcepto.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaConcepto[`buscar_en${objFindParamsConcepto.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_concepto.onchange = async (e) => {
        findWordsConcepto();
    }


    //al teclear texto en la busqueda de concepto
    let timeoutFindConcepto;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindConcepto);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindConcepto = setTimeout(async () => {
            await findWordsConcepto();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataConceptosFromBdByFind(objFindParamsConcepto){
    console.log('=== function getDataConceptosFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en, filtro} = objFindParamsConcepto;

    try {
        // si no hay palabras de busqueda y no hay filtro, no dejo hacer
        // debe haber al menos palabras o filtro, si no los hay -> no hay sentido de hacer búsqueda
        // para mostrar todo hay otra funcion 
        if(!words_input && !filtro){
            alert('No hay ni words_input, ni filtro. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_conceptos_by_find.php';
               
        const response = await fetch(`../app/php/datos/concepto/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify(objFindParamsConcepto), // Convertir los datos a formato JSON
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
        console.error('Error en getDataConceptosFromBdByFind(): error.message: ', error.message);
    }
}


function pintConceptoActiveSoloDatos(){
    console.log('=== function pintConceptoActiveSoloDatos() === ');

    if(!objConcepto){
        alert('no hay objConcepto');
        return;
    }

    const d_concepto = eid_contenedor_conceptos.querySelector(`.d_concepto[data-id_concepto="${objConcepto.id_concepto}"]`);
    console.log('d_concepto: ', d_concepto);
    
    if(!d_concepto){
        console.log('no hay d_concepto. no actualizo d_concepto...');
        return;
    }

    const div_da_nombre = d_concepto.querySelector('.da_nombre');
    const div_da_com = d_concepto.querySelector('.da_com');
    const div_da_tipo_concepto = d_concepto.querySelector('.da_tipo_concepto');
    

    //tipo_concepto
    div_da_tipo_concepto.classList.remove('ingreso','gasto');
    div_da_tipo_concepto.classList.add(objConcepto.tipo_concepto);
    div_da_tipo_concepto.textContent = convertirToTitleCase(objConcepto.tipo_concepto);

    //nombre
    div_da_nombre.textContent = objConcepto.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //comentario
    div_da_com.textContent = objConcepto.comentario || '(sin comentario)';
    //si '!objConcepto.comentario' es true  (no tiene comentario) -> pone  'd-none' -> oculta
    //si '!objConcepto.comentario' es false (sí tiene comentario) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objConcepto.comentario);
}

async function getDataConceptoFromBd(id_concepto){
    console.log('=== function getDataConceptoFromBd() ===');

    try {
        
        if(!hay_id(id_concepto, 'id_concepto', 'getDataConceptoFromBd()')){
            return; // <- se detiene aquí si no hay id_concepto
        }

        const nombre_fichero = 'obtener_datos_concepto_one.php';
     
        const response = await fetch(`../app/php/datos/concepto/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_concepto: id_concepto
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

                console.log(`id_concepto: [${id_concepto}] --- nombre: [${data.nombre}]`);

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
        console.error('Error en getDataConceptoFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsConcepto(){
    console.log('=== function update_objFindParamsConcepto() ===');

    obj_ajustes.objFindParamsConcepto = objFindParamsConcepto;
    await update_obj_ajustes();
}

//======================================================================================//
async function pintDatosConceptoFinded(contenedor, obj, input_concepto){
    console.log('=== function pintDatosConceptoFinded() ===');
    console.log('obj (del concepto): ', obj);

    if(!contenedor){
        alert('no hay contenedor. No puedo pintar datos de concepto...');
        return;
    }

    if(obj?.id_concepto){

        //concepto
        const nombre_val = escaparHTML(obj.nombre) || '(no asignado)';

        contenedor.innerHTML = `
            <div class="cl_valor">    
                <div class="cl_valor_inner">
                    <div class="nc_val d_flex_v">
                        <div class="cl_campo_v">id</div>
                        <div>${obj.id_concepto}</div>
                    </div> 
                    <div class="nc_val d_flex_v nc_val_nombre">
                        <div class="cl_campo_v">nombre</div>
                        <div>${nombre_val}</div>    
                    </div> 
                    <div class="nc_val d_flex_v">
                        <div class="cl_campo_v">tipo</div>
                        <div class="da_tipo_concepto ${obj.tipo_concepto}">${convertirToTitleCase(obj.tipo_concepto)}</div>    
                    </div> 
                    <div class="nc_val_x d_flex_v">
                        <div class="close">✕</div>
                    </div> 
                </div>
            </div>
        `;

        contenedor.onclick = (e) => {
            //click cerrar
            if(e.target.closest('.nc_val_x')){
                resetId(input_concepto.id, contenedor, input_concepto);
            }
        }

    }else{
        console.log('no hay concepto seleccionado...');

        contenedor.innerHTML = `
            <div class="cl_valor">    
                <div class="cl_valor_inner w_100">
                    <div class="prim">No hay concepto vinculado</div> 
                </div>
            </div>
        `;            
    }
}

function buildModalBuscarConcepto(input_concepto, input_tipo) {
    console.log('=== function buildModalBuscarConcepto() ===');

    if(!input_concepto || !input_tipo){
        alert('no hay inputs necesarios para guardar el concepto seleccionado. No puedo continuar.');
        return;
    }

    const titulo_head = 'Selecciona concepto';

    const contenido = document.createElement('div');
    contenido.className = 'zzz_new';//luego mirar si lo cambio

    let cl_d_limpiar_input = 'd-flex';

    contenido.innerHTML = `
        <div class="d_title_form">
            <div>&nbsp;</div>
            <div class="btn btn_mostrar_todos">Mostrar todos</div>
        </div>

        <form>

            <div class="wr_input_data_buscar form_group wr_input_general">
                <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#buscar_concepto')">
                    <img src="images/x_white.png">
                </div>
                <input id="buscar_concepto" type="text" name="buscar_concepto" required="" placeholder=" " value="">
                <label for="buscar_concepto">Buscar concepto</label>
            </div>            
        
        </form>

        <div id="regs_finded_concepto_sm" class="wr_block_find d-none">
            <!-- aki divs de conceptos encontrados -->
        </div>
    `;

    const btn_mostrar_todos = contenido.querySelector('.btn_mostrar_todos');
    btn_mostrar_todos.onclick = async () => {
        console.log('muestro todos conceptos');
        await findWordsConceptoSm(find_by = 'all', modal2, input_concepto, input_tipo);
    };

    //al teclear texto en la busqueda de concepto
    let timeoutBuscarConcepto;

    // buscar_concepto
    const input_buscar_concepto = contenido.querySelector('#buscar_concepto');
    input_buscar_concepto.oninput = (e) => {
        console.log('=== listener --- input_buscar_concepto');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutBuscarConcepto);
    
        //no permito buscar al teclear menos de 2 carácteres
        if(input_val.length < 2){
            return;
        }
    
        timeoutBuscarConcepto = setTimeout(async () => {
            await findWordsConceptoSm(find_by = 'words', modal2, input_concepto, input_tipo);
        }, 400);
    };

    // Mostrar el modal (y añadir al DOM) y guardar la referencia en modal2
    const modal2 = showModal2Content({
        titulo: titulo_head,
        overlay_position: 'top',
        contenido: contenido,
        cerrar_exterior: true
    });

    //despues de añadir al DOM uso .focus()
    requestAnimationFrame(() => {
        modal2.modal2_body.querySelector('#buscar_concepto')?.focus();
    });
}

async function findWordsConceptoSm(find_by = 'words', referencia_modal, input_concepto, input_tipo){//buscar por palabras o todos
    console.log('=== async function findWordsConceptoSm() ===');
    console.time('time_findWordsConceptoSm');

    const eid_inpt_find_concepto = referencia_modal.modal2.querySelector('#buscar_concepto');
    const eid_regs_finded_concepto_sm = referencia_modal.modal2.querySelector('#regs_finded_concepto_sm');

    let words_input_trimed = eid_inpt_find_concepto.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = 3;//eid_modo_concepto.value;
    let buscar_en = 1;//eid_buscar_en_concepto.value;
    //console.log('--- words_input: ', words_input);

    let filtro = {};

    //si hay tipo_concepto -> muestro con filtro solo el tipo indicado
    if(['ingreso','gasto'].includes(input_tipo.value)){
        filtro.tipo_concepto = input_tipo.value //ingreso, gasto// en todos conceptos
    }else{//muestro todos
        filtro.tipo_concepto = {
            operador: '!=',
            valor: ''
        }
    }

    //pestaña movimientos
    if(input_concepto.id == 'id_concepto'){
        //...
    }

    //pestaña conceptos
    if (input_concepto.id == 'id_concepto_padre'){//conceptos 
        
        if(objConcepto.id_concepto){
            filtro.id_concepto = {
                operador: '!=',//muestro todos conceptos excepto el actual de concepto que se edita o ve 
                valor: objConcepto.id_concepto
            }    
        }
    }
    
    let objDataConceptosSmFinded;    

    if(find_by == 'words'){//buscar conceptos por palabras introducidas
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
        
        //se buscará palabras y filtro
        objFindParamsConceptoSm.words_input = words_input;
        objFindParamsConceptoSm.modo = modo;
        objFindParamsConceptoSm.buscar_en = buscar_en;
        objFindParamsConceptoSm.filtro = filtro;
        objFindParamsConceptoSm.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias

        objDataConceptosSmFinded = await getDataConceptosFromBdByFind(objFindParamsConceptoSm);
    }

    if(find_by == 'all'){//buscar todos conceptos pero con filtro
        eid_inpt_find_concepto.value = '';//reset
        
        //se buscará sólo por filtro ya que aki asigno words_input = ''
        objFindParamsConceptoSm.words_input = '';
        objFindParamsConceptoSm.modo = modo;
        objFindParamsConceptoSm.buscar_en = buscar_en;
        objFindParamsConceptoSm.filtro = filtro;
        objFindParamsConceptoSm.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias

        objDataConceptosSmFinded = await getDataConceptosFromBdByFind(objFindParamsConceptoSm);               
    }

    console.log('objDataConceptosSmFinded: ', objDataConceptosSmFinded);
    
    const hay_coincidencias = (esObjeto(objDataConceptosSmFinded) && objDataConceptosSmFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsConceptoSm.findedRows = 0;

        eid_regs_finded_concepto_sm.classList.remove('d-none');
        eid_regs_finded_concepto_sm.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados.
            </p>
        `;
    }

    //si hay conceptos...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsConceptoSm.findedRows = objDataConceptosSmFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_concepto_sm.classList.remove('d-none');
        eid_regs_finded_concepto_sm.innerHTML = `
            <div class="wr_block_find_head">
                <div class="wr_num_regs">
                    <div class="title_regs_finded">Registros encontrados: </div>
                    <div class="num_regs_finded">${objDataConceptosSmFinded.arr_data.length}</div>
                    <div class="wr_close_item" onclick="closeDivBySelector('#regs_finded_concepto_sm')">
                        <span class="close">✕</span>
                    </div>
                </div>
            </div>
            <div class="wr_block_find_body">
                <!-- aki los divs de conceptos -->
            </div>
        `;

        //Recorrer el array de conceptos encontrados y crear divs para cada uno
        objDataConceptosSmFinded.arr_data.forEach((el,i,arr) => {
            
            const d_concepto = document.createElement('div');
            d_concepto.className = 'd_concepto d_art';
            d_concepto.dataset.id_concepto = el.id_concepto;
            d_concepto.dataset.tipo_art = 'concepto';
            d_concepto.innerHTML = `
                <div class="datos_concepto datos_art">
                    <div class="wr_id_nombre">
                        <div class="da_id">${el.id_concepto}</div>
                        <div class="da_nombre">${escaparHTML(el.nombre)}</div>
                    </div>
                    <div class="da_com ${(el.comentario) ? '' : 'd-none'}">
                        ${escaparHTML(el.comentario) || '(sin comentario)'}
                    </div>
                </div>
                <div class="art_cols art_col4">
                    <div class="da_tipo_concepto ${el.tipo_concepto}">${escaparHTML(convertirToTitleCase(el.tipo_concepto))}</div>
                </div>               
            `;

            //click en div
            d_concepto.onclick = async (e) => {

                console.log('element clicked: ', e.currentTarget);
                console.log('el:', el);

                const d_concepto_clicked = e.target.closest('.d_art');
                console.log('d_concepto_clicked:', d_concepto_clicked);

                input_concepto.value = el.id_concepto;//es input de id_concepto que se pasa como parametro
                
                let contenedor_datos_concepto_finded;
                
                //pestaña movimientos
                if(input_concepto.id == 'id_concepto'){

                    //actualizo objeto de concepto con los datos del concepto seleccionado
                    id_concepto = el.id_concepto;//importante
                    objConcepto = await getDataConceptoFromBd(id_concepto);//IMPORTANTE para cojer todos los datos necesarios
                    console.log('objConcepto: ', objConcepto);

                    //cambio tipo_movimiento o tipo_concepto cogiendo valor del tipo_concepto ya que deben coincidir
                    input_tipo.value = objConcepto.tipo_concepto;
                    
                    contenedor_datos_concepto_finded = document.getElementById('datos_concepto_finded');
                    
                    //si se crea o edita movimiento 
                    const eid_d_tipo_movimiento = document.querySelector('#form_movimiento #d_tipo_movimiento');
                    if(eid_d_tipo_movimiento){
                        pintDivSelected('d_tipo_movimiento', eid_d_tipo_movimiento, objConcepto.tipo_concepto);
                    }

                    if(contenedor_datos_concepto_finded){
                        pintDatosConceptoFinded(contenedor_datos_concepto_finded, objConcepto, input_concepto);
    
                        eid_regs_finded_concepto_sm.classList.add('d-none');
                        
                        console.log('div clicked. cierro modal2');
                        referencia_modal.cerrarModal2();
                    }
                }

                
                //pestaña conceptos
                if (input_concepto.id == 'id_concepto_padre'){//conceptos

                    //actualizo objeto de concepto_padre con los datos del concepto seleccionado
                    id_concepto_padre = el.id_concepto;//importante
                    objConceptoPadre = await getDataConceptoFromBd(id_concepto_padre);//IMPORTANTE para cojer todos los datos necesarios
                    console.log('objConceptoPadre: ', objConceptoPadre);

                    //cambio tipo_movimiento o tipo_concepto cogiendo valor del tipo_concepto ya que deben coincidir
                    input_tipo.value = objConceptoPadre.tipo_concepto;

                    contenedor_datos_concepto_finded = document.getElementById('datos_concepto_padre_finded');

                    //si se crea o edita concepto 
                    const eid_d_tipo_concepto = document.querySelector('#form_concepto #d_tipo_concepto');
                    if(eid_d_tipo_concepto){
                        pintDivSelected('d_tipo_concepto', eid_d_tipo_concepto, objConceptoPadre.tipo_concepto);
                    }

                    const wr_saldo_concepto = document.getElementById('wr_saldo_concepto');
                    if(wr_saldo_concepto){
                        //muestro el block de saldo concepto ya que el concepto ha sido seleccionado
                        wr_saldo_concepto.classList.remove('d-none')
                    }

                    if(contenedor_datos_concepto_finded){
                        pintDatosConceptoFinded(contenedor_datos_concepto_finded, objConceptoPadre, input_concepto);
    
                        eid_regs_finded_concepto_sm.classList.add('d-none');
                        
                        console.log('div clicked. cierro modal2');
                        referencia_modal.cerrarModal2();
                    }
                }

                //calcularTotal();//?                 
            }

            eid_regs_finded_concepto_sm.querySelector('.wr_block_find_body').append(d_concepto);
        });

        
        
    }

    //await update_objFindParamsConcepto();

    console.timeEnd('time_findWordsConceptoSm');
}