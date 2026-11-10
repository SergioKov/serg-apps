//movimiento
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function addMovimiento(){
    console.log('=== function addMovimiento() ===');

    //permito construir modal con el formulario
    openModal('full', 'Crear Movimiento', null, 'buildMovimiento', true, 'nuevo');
}

async function buildMovimiento(movimiento_action = null){
    console.log('=== function buildMovimiento() ===');

    console.log('movimiento_action: ', movimiento_action);
    console.log('objMovimiento: ', objMovimiento);

    eid_bl_modalFullInner.innerHTML = '';//reset

    // Formato YYYY-MM-DD que necesita <input type="date">
    //const fechahora_hoy = new Date().toISOString().split("T")[0];
    const fechahora_hoy = fechaMySQLLocal('fecha_hora_corta');

    //campos de input
    let id_movimiento_val = '';
    let id_cliente_val = '';

    let tipo_movimiento_val = '';
    
    //objAlmacenUso = objDataAlmacenes?.arr_data?.find(almacen => almacen.id_almacen == id_almacen_uso) || {};

    //cliente
    let nombre_val = '';
    let telefono_val = '';
    let codigo_cliente_val = '';
    
    let saldo_val = '';
    let saldo_text = '';
    
    let titulo_val = '';
    let comentario_val = '';

    let diaSemana_val = '';
    let fecha_movimiento_val = fechahora_hoy;
    let fecha_bd = '';
    let fecha_val = '';//de '2026-10-18' a '18.10.2026'
    let hora_val = '';

    let confirmado_val = 1;//or defecto es confirmado
    let metodo_pago_val = '';//por defecto '' que es no asignado'
    
    let importe_val = '';
    let importe_text = '';

    //elemento de título en el top
    const p_mensaje = document.createElement('p');
    p_mensaje.className = 'mensaje';
        
    //otras vars
    let cl_id_movimiento = 'd-none';//oculto
    let cl_solo_ver = '';
    //let cl_wr_saldo_cliente = 'd-none';//oculto por defecto. si es 'nuevo' se muestra
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'

    let contenedor;//general. se asigna luego  
    
    if(movimiento_action == 'nuevo'){//si es nueva
        console.log('es movimiento nuevo');

        //reseteo movimiento

    }else{//si es: ver, editar, eliminar
        console.log('es movimiento que se edita');
        
        if(!hay_id(id_movimiento, 'id_movimiento', 'buildMovimiento()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún movimiento.</p>
                <p class="p_aviso">Crea un movimiento pulsando "+".</p>
            `;
            openModal('center','Aviso Movimiento',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_movimiento
        }        

        id_movimiento_val = objMovimiento.id_movimiento;
        id_cliente_val = objMovimiento.id_cliente;

        if(id_cliente_val){
            // en vez de cojer datos del objCliente de objDataClientes, 
            //cojo los datos del pedido directamente de la bd
            id_cliente = objMovimiento.id_cliente;
            objCliente = await getDataClienteFromBd();//IMPORTANTE para cojer todos los datos necesarios
            console.log('objCliente: ', objCliente);
        }else{
            objCliente = {};//reset. IMPORTANTE para no cojer el id_cliente seleccionado antes.
        }
          
        comentario_val = escaparHTML(objMovimiento.comentario) || '';

        diaSemana_val = convertirToTitleCase(getDiaSemana(objMovimiento.fecha_movimiento));
        fecha_movimiento_val = fechaMySQLLocal('fecha_hora_corta', objMovimiento.fecha_movimiento);

        fecha_bd = fechaMySQLLocal('solo_fecha', objMovimiento.fecha_movimiento);
        fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
        hora_val = fechaMySQLLocal('solo_hora_corta', objMovimiento.fecha_movimiento);
                
        tipo_movimiento_val = (objMovimiento.tipo_movimiento) ? escaparHTML(objMovimiento.tipo_movimiento) : '';
        confirmado_val = (objMovimiento.confirmado) ? escaparHTML(objMovimiento.confirmado) : '';

        metodo_pago_val = (objMovimiento.metodo_pago) ? escaparHTML(objMovimiento.metodo_pago) : '';

        importe_val = (objMovimiento.importe) ? escaparHTML(objMovimiento.importe) : '';
        importe_text = (objMovimiento.importe) ? `${importe_val} €` : '--';

    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(movimiento_action)){
        
        p_mensaje.innerHTML = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_movimiento}</b></span>
            </span>
        `;
        
        if(movimiento_action == 'ver'){
            const wr_img_editar_en_ver = document.createElement('span');
            wr_img_editar_en_ver.className = 'wr_img_editar_en_ver';
            wr_img_editar_en_ver.innerHTML = `
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            `;
            p_mensaje.append(wr_img_editar_en_ver);
        }
    }

    switch (movimiento_action) {
        case 'nuevo'://Nueva Movimiento
            p_mensaje.innerHTML = `
                <span>Rellena los campos del formulario con los datos de un movimiento <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_movimiento
            if(id_movimiento){
                id_movimiento = null;//reset ya que se va a crear un id_movimiento nuevo
            }else{
                //id_movimiento es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objMovimiento = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            if(id_cliente_val){
                cl_wr_saldo_cliente = 'd-flex';//muestro porque es 'nuevo' y hay cliente seleccionado
            }
            break;
        
        default:
        case 'ver'://Ver Movimiento - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_movimiento = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            cl_solo_ver = 'solo_ver';//permito solo ver y no manejar el click
            break;

        case 'editar'://Editar Movimiento - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Movimiento - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_movimiento = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'eliminar'
            break;
    }
    


    //Título si hay
    let titulo_detalles = '';
    if(titulo_val){
        titulo_detalles = document.createElement('div');
        titulo_detalles.className = 's_detalles ';
        titulo_detalles.innerHTML = `
            <p class="p_titulo" onclick="hideShowBlock('l_notes_detalles_sm');">Título</p>
            <p id="l_notes_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">            
                    <span class="linea_fx ">
                        <span>${titulo_val}</span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>
        `;
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteMovimiento(event);">Eliminar Movimiento DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_movimiento_sm = document.createElement('div'); 
    contenedor_movimiento_sm.id = 'contenedor_movimiento_sm';
    contenedor_movimiento_sm.className = 'contenedor_form_sm';
    contenedor_movimiento_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Movimiento <span class="f_r ${cl_id_movimiento}">id: ${id_movimiento_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx">
                        <span class="cl_campo">Fecha:</span>
                        <span>${diaSemana_val} ${fecha_val}</span>
                    </span>
                    <span class="linea_fx">
                        <span class="cl_campo">Hora:</span>
                        <span>${hora_val}</span>
                    </span>
                    <span class="linea_fx">
                        <span class="cl_campo">Importe:</span>
                        <span>${importe_val} €</span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(titulo_val) ? titulo_detalles.outerHTML : '' }
        ${(comentario_val) ? comentario_detalles.outerHTML : '' }
        
        ${(movimiento_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarMovimiento(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_movimiento = document.createElement('div');
    form_movimiento.id = 'form_movimiento';
    form_movimiento.innerHTML = `
        <div class="form_container">
            <form>
                
                <!-- titulo -->
                ${p_mensaje.outerHTML}

                
                <!-- tipo_movimiento -->
                <div class="form_group wr_input_general">
                    <label class="lab_varios_btns">Tipo de movimiento:</label>
                    <div id="d_tipo_movimiento" class="wr_varios_btns ${cl_solo_ver}">
                        <div class="dbtn" data-value="ingreso">Ingreso</div>
                        <div class="dbtn" data-value="gasto">Gasto</div>
                    </div>
                    <input id="tipo_movimiento" type="hidden" name="tipo_movimiento" value="${tipo_movimiento_val}"> 
                </div>
                <!-- /tipo_movimiento -->

                                
                <!-- buscar cliente -->
                <div class="wr_buscar_cliente ${cl_solo_ver}">

                    <div class="wr_bl_buscar_head">
                        <h5>Cliente:</h5>
                        <div id="lupa_buscar_cliente" class="wr_btn_lupa wr_btn_img">
                            <img class="btn_img" src="./images/search_zoom_icon_white.svg">
                        </div>
                    </div>

                    <div id="datos_cliente_finded" class="reg_selected">
                        <!-- aki se pintan los datos del cliente vinculado -->
                    </div>

                    <input id="id_cliente" type="hidden" name="id_cliente" value="${id_cliente_val}">
                </div>
                <!-- /buscar cliente -->


                <!-- fecha_movimiento -->
                <div class="form_group wr_input_general">
                    <input type="datetime-local" id="fecha_movimiento" name="fecha_movimiento" required="" placeholder=" " value="${fecha_movimiento_val}">
                    <label for="fecha_movimiento">Fecha de movimiento</label>
                </div>
                <!-- /fecha_movimiento -->                  


                <!-- importe -->
                <div id="wr_importe" class="wr_importe form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#importe');">
                        <img src="images/x_white.png">
                    </div>
                    <input 
                        id="importe" 
                        type="text"
                        inputmode="decimal"
                        maxlength="10"
                        name="importe" 
                        required="" 
                        placeholder=" " 
                        value="${importe_val}"
                    >
                    <label for="importe">Importe:</label>
                </div>
                <!-- /importe -->


                <!-- metodo_pago -->
                <div id="wr_metodo_pago" class="wr_sel_opt_estado ${objMovimiento?.metodo_pago || ''}">
                    <h5>Método de pago:</h5>
                    <select id="metodo_pago" class="sel_opt_find">
                        <option value="">(no asignado)</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="bizum">Bizum</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>
                <!-- /metodo_pago -->                              


                <!-- titulo -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#titulo')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="titulo" type="text" name="titulo" required="" placeholder=" " value="${titulo_val}">
                    <label for="titulo">Título</label>
                </div>
                <!-- /titulo -->


                <!-- comentario -->
                <div class="form_group">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#comentario')">
                        <img src="images/x_white.png">
                    </div>
                    <textarea id="comentario" name="comentario" rows="4" required="" placeholder=" ">${comentario_val}</textarea>
                    <label class="lab_textarea" for="comentario">Comentario</label>
                </div>
                <!-- /comentario -->


                <!-- confirmado -->
                <div class="form_group wr_input_general">
                    <label class="lab_varios_btns">Registro confirmado:</label>
                    <div id="d_confirmado" class="wr_varios_btns ${cl_solo_ver}">
                        <div class="dbtn dbtn_no" data-value="0">No</div>
                        <div class="dbtn dbtn_si" data-value="1">Sí</div>
                    </div>
                    <input id="confirmado" type="hidden" name="confirmado" value="${confirmado_val}"> 
                </div>
                <!-- /confirmado -->


                ${ (['nuevo','editar'].includes(movimiento_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;
    
    const eid_datos_cliente_finded = form_movimiento.querySelector('#datos_cliente_finded');

    const eid_d_tipo_movimiento = form_movimiento.querySelector('#d_tipo_movimiento');
    const eid_d_confirmado = form_movimiento.querySelector('#d_confirmado');

    //buscar_cliente
    const eid_lupa_buscar_cliente = form_movimiento.querySelector('#lupa_buscar_cliente');
    const input_id_cliente = form_movimiento.querySelector('#id_cliente');
    
    //importe
    const eid_wr_importe = form_movimiento.querySelector('#wr_importe');
    const input_importe = form_movimiento.querySelector('#importe');

    //metodo_pago
    const eid_wr_metodo_pago = form_movimiento.querySelector('#wr_metodo_pago');
    const select_metodo_pago = form_movimiento.querySelector('#metodo_pago');

    //=============================================================================//
    //start - funciones de form. 
    //=============================================================================//

    //pinto datos del cliente vinculado si hay
    pintDatosClienteFinded(eid_datos_cliente_finded, objCliente, input_id_cliente);//si no hay id_cliente, entonces objCliente es {} lo que es correcto para la función 
    
    eid_lupa_buscar_cliente.onclick = (e) => {
        console.log('eid_lupa_buscar_cliente.onclick');
        buildModalBuscarCliente(input_id_cliente);
    }


    let tipo_movimiento_anterior_val = objMovimiento.tipo_movimiento;//por defecto

    //tipo_movimiento
    eid_d_tipo_movimiento.onclick = (e) => {
        console.log('e.currentTarget: ', e.currentTarget);
        console.log('e.target: ', e.target);

        const contenedor_dbtns = e.currentTarget;
        const btn = e.target;

        if(contenedor_dbtns.classList.contains('solo_ver')){
            return;//no dejo cambiar el valor si es form_ver
        }

        const tipo_movimiento_val = btn.dataset.value;

        if(tipo_movimiento_val == tipo_movimiento_anterior_val){
            console.log('es el click sobre el mismo valor. no hago nada');
            return;
        }
        meterValor('tipo_movimiento', eid_d_tipo_movimiento, tipo_movimiento_val);
        pintDivSelected('d_tipo_movimiento', eid_d_tipo_movimiento, tipo_movimiento_val);

        tipo_movimiento_anterior_val = tipo_movimiento_val;
    }
    //al cargar el formulario
    pintDivSelected('d_tipo_movimiento', eid_d_tipo_movimiento, objMovimiento.tipo_movimiento);


    let confirmado_anterior_val = objMovimiento.confirmado;//por defecto

    //confirmado
    eid_d_confirmado.onclick = (e) => {
        console.log('e.currentTarget: ', e.currentTarget);
        console.log('e.target: ', e.target);

        const contenedor_dbtns = e.currentTarget;
        const btn = e.target;

        if(contenedor_dbtns.classList.contains('solo_ver')){
            return;//no dejo cambiar el valor si es form_ver
        }

        const confirmado_val = btn.dataset.value;

        if(confirmado_val == confirmado_anterior_val){
            console.log('es el click sobre el mismo valor. no hago nada');
            return;
        }

        meterValor('confirmado', eid_d_confirmado, confirmado_val);
        pintDivSelected('d_confirmado', eid_d_confirmado, confirmado_val);

        confirmado_anterior_val = confirmado_val;
    }
    //al cargar el formulario
    pintDivSelected('d_confirmado', eid_d_confirmado, confirmado_val);


    //metodo_pago
    select_metodo_pago.value = objMovimiento?.metodo_pago || '';
    select_metodo_pago.onchange = async (e) => {
        const metodo_pago_val = e.target.value;
        pintContenedorEstado(eid_wr_metodo_pago, metodo_pago_val);
        //hideShowElementos(arr_elementos_importe, metodo_pago_val);
    }
    //al cargar el formulario
    //hideShowElementos(arr_elementos_importe, metodo_pago_val);


    //importe
    input_importe.oninput = (e) => {
        const importe_texto = e.target.value;

        input_importe.classList.remove('blink_bg');

        if (importe_texto.length > 10) {
            importe_texto = importe_texto.slice(0, -1);
            e.target.value = importe_texto;
        }
    }


    //añado action onclick a wr_img_editar_en_ver
    const element_wr_img_editar_en_ver = form_movimiento.querySelector('.wr_img_editar_en_ver');
    if(element_wr_img_editar_en_ver){
        element_wr_img_editar_en_ver.onclick = () => {
            openModal('full','Editar Movimiento actual',null,'buildMovimiento',true,'editar');
        }
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(movimiento_action)){ 
        contenedor = contenedor_movimiento_sm;        
    }else{
        contenedor = form_movimiento;
        if(movimiento_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}

async function guardarMovimiento(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarMovimiento() ===');
    
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

        const form_movimiento = document.getElementById('form_movimiento');

        const tipo_movimiento = form_movimiento?.querySelector('#tipo_movimiento').value.trim();
        //const id_almacen = form_movimiento?.querySelector('#id_almacen').value.trim();
        const id_cliente = form_movimiento?.querySelector('#id_cliente').value.trim();
        const fecha_movimiento = form_movimiento?.querySelector('#fecha_movimiento').value.trim();
        const importe = form_movimiento?.querySelector('#importe').value.trim();
        const metodo_pago = form_movimiento?.querySelector('#metodo_pago').value.trim();
        const titulo = form_movimiento?.querySelector('#titulo').value.trim();
        const comentario = form_movimiento?.querySelector('#comentario').value.trim();
        const confirmado = form_movimiento?.querySelector('#confirmado').value.trim();
    
        let errors = [];

        if(tipo_movimiento == ''){
            errors.push('Tipo de movimiento');
        }
        if(id_cliente == ''){
            //errors.push('Cliente');
        }
        if(fecha_movimiento == ''){
            errors.push('Fecha');
        }
        if(importe == '' || importe == 0){
            errors.push('Importe');
        }
        if(metodo_pago == ''){
            errors.push('Método de pago');
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

        const objMovimientoToSend = {
            id_movimiento: id_movimiento || null, //ya que se añade un nuevo movimiento, entonces no hay id_movimiento
            //id_almacen,
            tipo_movimiento,
            id_cliente,
            fecha_movimiento,
            importe,
            metodo_pago,
            titulo,
            comentario,
            confirmado
        }
        console.log('objMovimientoToSend: ',objMovimientoToSend);
    
        const data = await insertarMovimientoDatos(objMovimientoToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_movimiento':
                    text_show = 'Datos del movimiento han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_movimiento':
                    text_show = 'Datos del movimiento han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_movimiento){
                console.log('id_movimiento: ', data.id_movimiento);
                id_movimiento = data.id_movimiento;//guardo el id del movimiento recién creada

                //Cojo datos del movimiento desde BD
                objMovimiento = await getDataMovimientoFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objMovimiento: ', objMovimiento);

                const itemMovimientoUpdate = objDataMovimientos?.arr_data?.find(item => item.id_movimiento == id_movimiento);
                if (itemMovimientoUpdate) {//es update del movimiento existente
    
                    Object.assign(itemMovimientoUpdate, objMovimiento);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintMovimientoActiveSoloDatos();//en el contenedor_movimientos

                } else {//es insert del movimiento nuevo
    
                    console.warn('No encontrado objMovimiento.id_movimiento en objDataMovimientos.arr_data');
                    //entonces es un movimiento nuevo que se crea

                    //1.debo añadir objMovimiento en objDataMovimientos.arr_data al inicio (si existe!)
                    objDataMovimientos?.arr_data?.push(objMovimiento);//añado al final del array

                    //2.debo aumentar el numero de total movimientos (si existe!)
                    if (objDataMovimientos?.totalRows != null){
                        objDataMovimientos.totalRows++;
                    }

                    //3. old -> debo pintar d_movimiento en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintMovimientoOne(objMovimiento, 'arriba');//div de movimiento se pinta al inicio (arriba)
                    await loadMovimientosAll();
                }

                //actualizo Taquillas y obj y DOM
                await loadTaquillasAll();

                closeModal(null,true);
            }
           
        }else{

            let text_show = `Error al guardar el movimiento: ${data.error}`;
            console.log(text_show);

            showToast('error', text_show, 1000, 'center', true, 'Error');

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarMovimiento(). error: ',error);
    }

}

async function insertarMovimientoDatos(objMovimiento) {
    console.log('=== function insertarMovimientoDatos(objMovimiento) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objMovimiento || Object.keys(objMovimiento).length == 0){
            alert('No hay todos los parametros necesarios del movimiento...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objMovimiento: ',objMovimiento);

        const objMovimiento_str = JSON.stringify(objMovimiento);
        console.log('objMovimiento_str: ',objMovimiento_str);

        const nombre_fichero = 'insertar_datos_movimiento_one.php';

        const response = await fetch(`../app/php/datos/movimiento/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objMovimiento_str
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
        console.error('Error en la función insertarMovimientoDatos: ', error);
    }
}

async function deleteMovimiento(event){
    console.log('=== function deleteMovimiento() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_movimiento = objMovimiento.id_movimiento;
        console.log('id_movimiento: ', id_movimiento);

        if(!id_movimiento){
            alert('id_movimiento no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el movimiento con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_movimiento}</p> 
            <p><span class="cl_campo">Tipo:</span> ${escaparHTML(convertirToTitleCase(objMovimiento.tipo_movimiento))}</p> 
            <p${objMovimiento.titulo ? '' : 'd-none'}><span class="cl_campo">Título:</span> ${escaparHTML(objMovimiento.titulo)}</p$> 
            <p${objMovimiento.comentario ? '' : 'd-none'}><span class="cl_campo">Comentario:</span> ${escaparHTML(objMovimiento.comentario)}</p$> 
            <p><span class="cl_campo">Importe:</span> ${escaparHTML(objMovimiento.importe) || '--'} €</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar movimiento',
            pregunta,
            'confirmDelete',
            true,
            id_movimiento
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el movimiento...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteMovimientoFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Movimiento eliminado con éxito.';
            console.log(text_show);

            if(data.id_movimiento){
                console.log('id_movimiento: ', data.id_movimiento);

                const totalAntes = objDataMovimientos.arr_data.length;

                //elimino el objeto del movimiento eliminado desde objeto de todos los movimientos encontrados usando filter
                objDataMovimientos.arr_data = objDataMovimientos.arr_data.filter(
                    item => item.id_movimiento !== id_movimiento
                );

                const totalDespues = objDataMovimientos.arr_data.length;
                const movimiento_is_deleted = totalDespues < totalAntes;

                if(movimiento_is_deleted){
                    console.log('movimiento eliminado de objDataMovimientos');
                }else{
                    console.log('movimiento NO eliminado de objDataMovimientos');
                }

                //Elimino elemento d_movimiento de los movimientos encontrados en 'contenedor_movimientos'
                eid_contenedor_movimientos.querySelector(`.d_movimiento[data-id_movimiento="${id_movimiento}"]`).remove();
                eid_block_movimientos.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_movimiento = null;
                objMovimiento = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                await loadMovimientosAll();

                //actualizo clientes
                loadClientesAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar el movimiento.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteMovimiento. error: ',error);        
    }

}

async function deleteMovimientoFromBd(){
    console.log('=== function deleteMovimientoFromBd() ===');

    try {
        
        if(!hay_id(id_movimiento, 'id_movimiento', 'deleteMovimientoFromBd()')){
            return; // <- se detiene aquí si no hay id_movimiento
        }

        const nombre_fichero = 'eliminar_datos_movimiento_one.php';
               
        const response = await fetch(`../app/php/datos/movimiento/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_movimiento: id_movimiento
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
                console.log(`[ELIMINADO] id_movimiento: [${data.id_movimiento}] --- nombre: [${data.nombre}]`);
    
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
        console.error('Error en deleteMovimientoFromBd(): error.message: ', error.message);
    }
}

function pintMovimientoActive(){//click en div del contenedor de movimientos que ya están en el DOM
    console.log('=== function pintMovimientoActive(e) === ');

    console.log('asignado global --- id_movimiento: ', id_movimiento);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_movimientos, 'd_movimiento');
    eid_contenedor_movimientos.querySelector(`.d_movimiento[data-id_movimiento="${id_movimiento}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_movimiento viene como string: "925"
    objMovimiento = objDataMovimientos.arr_data.find(v => v.id_movimiento == id_movimiento);
    console.log('objMovimiento: ', objMovimiento);

    pintMovimientoActiveSoloDatos();

}

async function loadMovimientosAll(){
    console.log('=== function loadMovimientosAll() === ');

    objDataMovimientos = await getMovimientosAll();

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
        f_frase: '(Todos movimientos)',
        f_num: objDataMovimientos?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_movimientos, objDataPint);
    
    pintMovimientosAll();

}

async function pintMovimientosAll(){//pintar todos los div de movimientos, o al load o al find
    console.log('=== function pintMovimientosAll() === '); 
    
    console.time('time_pintMovimientosAlll');

    // if(!objDataMovimientos?.arr_data?.length){//si length === 0, entonces no hay movimientos
    //     console.warn('No hay movimientos en objDataMovimientos.arr_data');
    //     return;
    // }

    eid_contenedor_movimientos.innerHTML = '';//reset contenedor de movimientos

    const hay_datos = (esObjeto(objDataMovimientos) && objDataMovimientos.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_movimientos.innerHTML = `
            <p class="prim">No existe ningún registro de movimiento en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataMovimientos: ', objDataMovimientos);        
        
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
        //Recorrer movimientos encontradas... 
        objDataMovimientos.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintMovimientoOne(obj, 'abajo');//cada div de movimiento se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintMovimientosAlll');
   
}

function pintMovimientoOne(objMovimientoOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un movimiento, o al load, o al crear, o al find
    console.log('=== function pintMovimientoOne() === ');

    if(!objMovimientoOne){
        console.warn('No hay objeto de movimiento. no lo puedo pintar');
        return;
    }
    
    const diaSemana_val = convertirToTitleCase(getDiaSemana(objMovimientoOne.fecha_movimiento));
    const fecha_bd = fechaMySQLLocal('solo_fecha', objMovimientoOne.fecha_movimiento);
    const fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
    const hora_val = fechaMySQLLocal('solo_hora_corta', objMovimientoOne.fecha_movimiento);
    
    const importe_text = (objMovimientoOne.importe) ? `${formatoImporte(objMovimientoOne.importe)} €` : '--' ;

    let cl_wr_kvadrat = '';
    let cl_da_kvadrat = 'd-none';
    let cl_da_nombre = 'd-none';
    let cl_da_tel = 'd-none';
    let cl_da_bola = 'no_confirmado';
    let da_kvadrat_html = '';
    let da_bola_html = '?';

    if(objMovimientoOne.confirmado){
        da_bola_html = `<img class="btn_img" src="./images/icon_ok_green.svg"></img>`;
        cl_da_bola = 'confirmado';
    }

    if(objMovimientoOne.id_cliente){
        if(objMovimientoOne.nombre != ''){
            cl_da_nombre = '';
        }
        cl_da_tel = '';//telefono siempre hay por ende lo muestro siempre
    }


    const d_movimiento = document.createElement('div');
    d_movimiento.className = 'd_movimiento d_art';
    d_movimiento.dataset.id_movimiento = objMovimientoOne.id_movimiento;
    d_movimiento.dataset.id_cliente = objMovimientoOne.id_cliente;
    d_movimiento.dataset.tipo_art = 'movimiento';
    d_movimiento.innerHTML = `
        <div class="datos_movimiento datos_art">
            <div class="da_diasem">${diaSemana_val}</div>
            <div class="da_fechahora">
                <div class="da_fecha">${fecha_val}</div>
                <div class="da_hora">${hora_val}</div>
            </div>
            <div class="da_tipo_movimiento ${objMovimientoOne.tipo_movimiento}">${escaparHTML(convertirToTitleCase(objMovimientoOne.tipo_movimiento))} </div>            
            <div class="da_nombre ${cl_da_nombre}">${objMovimientoOne.nombre}</div>
            <div class="da_tel ${cl_da_tel}">${objMovimientoOne.telefono}</div>
        </div>

        <div class="wr_datos">
            <div class="art_cols art_col2 wr_kvadrat ${cl_wr_kvadrat}">
                <div class="da_metodo_pago">${escaparHTML(convertirToTitleCase(objMovimientoOne.metodo_pago))}</div>
            </div>
            <div class="art_cols art_col3 wr_bola">
                <div class="da_bola ${cl_da_bola}">${da_bola_html}</div>
            </div>
        </div>

        <div class="art_cols art_col4">
            <div class="da_importe ${objMovimientoOne.tipo_movimiento}">${importe_text}</div>
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

    d_movimiento.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_movimiento = e.currentTarget.dataset.id_movimiento;
        console.log('asigno global --- id_movimiento: ', id_movimiento); 

        // siempre al clicar en cualquier parte del d_movimiento se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintMovimientoActive();
        

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

            //clic dentro de d_movimiento y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_movimiento y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_movimiento - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Movimiento actual',null,'buildMovimiento',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Movimiento actual',null,'buildMovimiento',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Movimiento actual',null,'buildMovimiento',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_movimientos.append(d_movimiento);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_movimientos.prepend(d_movimiento);
    }
}

async function findWordsMovimiento(){
    console.log('=== async function findWordsMovimiento() ===');
    console.time('time_findWordsMovimiento');

    const eid_inpt_find_movimiento = document.getElementById('inpt_find_movimiento');
    const eid_modo_movimiento = document.getElementById('modo_movimiento');
    const eid_buscar_en_movimiento = document.getElementById('buscar_en_movimiento');
    const eid_regs_finded_movimiento = document.getElementById('regs_finded_movimiento');

    let words_input_trimed = eid_inpt_find_movimiento.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_movimiento.value;
    let buscar_en = eid_buscar_en_movimiento.value;
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

    objFindParamsMovimiento.words_input = words_input;
    objFindParamsMovimiento.modo = modo;
    objFindParamsMovimiento.buscar_en = buscar_en;
    objFindParamsMovimiento.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataMovimientosFinded = await getDataMovimientosFromBdByFind(objFindParamsMovimiento);
    console.log('objDataMovimientosFinded: ', objDataMovimientosFinded);   

    
    const hay_coincidencias = (esObjeto(objDataMovimientosFinded) && objDataMovimientosFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsMovimiento.findedRows = 0;

        eid_regs_finded_movimiento.classList.remove('d-none');
        eid_regs_finded_movimiento.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay movimientos...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsMovimiento.findedRows = objDataMovimientosFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_movimiento.classList.remove('d-none');
        eid_regs_finded_movimiento.innerHTML = `
            <div class="wr_num_regs">
                <div class="title_regs_finded">Registros encontrados: </div>
                <div class="num_regs_finded">${objDataMovimientosFinded.arr_data.length}</div>
            </div>
            <button id="btn_mostrar_finded_movimiento" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_movimiento.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_movimiento') {
                console.log('clic en btn_mostrar_finded_movimiento');
                console.log('mostrar clicked -> reasigno objDataMovimientos desde objDataMovimientosFinded'); 
                
                //Clono objeto
                objDataMovimientos = structuredClone(objDataMovimientosFinded);
                console.log('objDataMovimientos: ', objDataMovimientos);



                const modo_val = objModoBusquedaMovimiento[`modo${objFindParamsMovimiento.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaMovimiento[`buscar_en${objFindParamsMovimiento.buscar_en}`].titulo;

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
                    f_frase: objFindParamsMovimiento.words_input,
                    f_num: objFindParamsMovimiento.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_movimientos, objDataPint);               
                                
                pintMovimientosAll();
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

    await update_objFindParamsMovimiento();

    console.timeEnd('time_findWordsMovimiento');
}

async function getMovimientosAll(){
    console.log('=== async function getMovimientosAll() ===');
    console.time('time_getMovimientosAll');

    objDataMovimientosBd = await getDataMovimientosAllFromBd();//la funcion que saca todos los movimiento para pintarlo
    console.log('objDataMovimientosBd: ', objDataMovimientosBd);

    console.timeEnd('time_getMovimientosAll');

    return objDataMovimientosBd;

}

async function crear_objDataMovimientos(){
    console.log('=== function crear_objDataMovimientos() ===');
    console.time('time_crear_objDataMovimientos');

    objDataMovimientos = await getDataMovimientosAllFromBd();
    console.log(`objDataMovimientos: `, objDataMovimientos);

    console.timeEnd('time_crear_objDataMovimientos');
}

async function getDataMovimientosAllFromBd(){//sacar TODOS los movimientos para rellenar contenedor_movimientos
    console.log('=== function getDataMovimientosAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_movimientos_all.php';
        
        const response = await fetch(`../app/php/datos/movimiento/${nombre_fichero}`, {
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
        console.error('Error en getDataMovimientosAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarMovimiento(){
    console.log('=== function buildBuscarMovimiento() ===');

    console.log('objMovimiento: ', objMovimiento);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_movimiento"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsMovimiento?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_movimiento')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsMovimiento()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_movimiento" class="sel_opt_find">
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
            <select id="buscar_en_movimiento" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de movimiento</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_movimiento" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_movimiento');
    
    //modo
    const eid_modo_movimiento = wr_args_busqueda.querySelector('#modo_movimiento');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsMovimiento
    eid_modo_movimiento.value = objFindParamsMovimiento?.modo || 1 ;

    eid_modo_movimiento.onchange = async (e) => {
        findWordsMovimiento();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaMovimiento[`modo${objFindParamsMovimiento.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaMovimiento[`modo${objFindParamsMovimiento.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_movimiento = wr_args_busqueda.querySelector('#buscar_en_movimiento');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsMovimiento
    eid_buscar_en_movimiento.value = objFindParamsMovimiento?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaMovimiento[`buscar_en${objFindParamsMovimiento.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaMovimiento[`buscar_en${objFindParamsMovimiento.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_movimiento.onchange = async (e) => {
        findWordsMovimiento();
    }


    //al teclear texto en la busqueda de movimiento
    let timeoutFindMovimiento;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindMovimiento);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindMovimiento = setTimeout(async () => {
            await findWordsMovimiento();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataMovimientosFromBdByFind(objFindParamsMovimiento){
    console.log('=== function getDataMovimientosFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsMovimiento;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_movimientos_by_find.php';
               
        const response = await fetch(`../app/php/datos/movimiento/${nombre_fichero}`, {
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
        console.error('Error en getDataMovimientosFromBdByFind(): error.message: ', error.message);
    }
}

function pintMovimientoActiveSoloDatos(){
    console.log('=== function pintMovimientoActiveSoloDatos() === ');

    if(!objMovimiento){
        alert('no hay objMovimiento');
        return;
    }

    const d_movimiento = eid_contenedor_movimientos.querySelector(`.d_movimiento[data-id_movimiento="${objMovimiento.id_movimiento}"]`);
    console.log('d_movimiento: ', d_movimiento);
    
    if(!d_movimiento){
        console.log('no hay d_movimiento. no actualizo d_movimiento...');
        return;
    }

    //elementos
    const div_da_diasem = d_movimiento.querySelector('.da_diasem');
    const div_da_fecha = d_movimiento.querySelector('.da_fecha');
    const div_da_hora = d_movimiento.querySelector('.da_hora');

    const div_da_tipo_movimiento = d_movimiento.querySelector('.da_tipo_movimiento');
    const div_da_nombre = d_movimiento.querySelector('.da_nombre');
    const div_da_tel = d_movimiento.querySelector('.da_tel');
    
    const div_wr_kvadrat = d_movimiento.querySelector('.wr_kvadrat');
    const div_da_kvadrat = d_movimiento.querySelector('.da_kvadrat');
    const div_da_metodo_pago = d_movimiento.querySelector('.da_metodo_pago');

    const div_da_bola = d_movimiento.querySelector('.da_bola');

    const div_da_importe = d_movimiento.querySelector('.da_importe');

    //datos
    const diaSemana_val = convertirToTitleCase(getDiaSemana(objMovimiento.fecha_movimiento));
    const fecha_bd = fechaMySQLLocal('solo_fecha', objMovimiento.fecha_movimiento);
    const fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
    const hora_val = fechaMySQLLocal('solo_hora_corta', objMovimiento.fecha_movimiento);

    const importe_text = `${formatoImporte(objMovimiento.importe)} €`;

    let cl_wr_kvadrat = '';
    let cl_da_kvadrat = 'd-none';
    let cl_da_nombre = 'd-none';
    let cl_da_tel = 'd-none';    
    let da_kvadrat_html = '';
    let da_bola_html = '?';

    if(objMovimiento.confirmado){
        da_bola_html = `<img class="btn_img" src="./images/icon_ok_green.svg"></img>`;
        cl_da_bola = 'confirmado';
    }

    if(objMovimiento.id_cliente){
        if(objMovimiento.nombre != ''){
            cl_da_nombre = '';
        }
        cl_da_tel = '';//telefono siempre hay por ende lo muestro siempre
    }    

    //diasemana
    div_da_diasem.textContent = diaSemana_val;
    div_da_diasem.classList.remove('d-none');//muestro tenga o no diasemana

    //tipo_movimiento
    div_da_tipo_movimiento.classList.remove('ingreso','gasto');
    div_da_tipo_movimiento.classList.add(objMovimiento.tipo_movimiento);
    div_da_tipo_movimiento.textContent = convertirToTitleCase(objMovimiento.tipo_movimiento);

    //telefono
    div_da_tel.textContent = objMovimiento.telefono || '(teléfono no asignado)';
    div_da_tel.classList.toggle('d-none', !objMovimiento.telefono);//si tiene -> lo muestra, si no tiene -> oculta

    //nombre cliente
    div_da_nombre.textContent = objMovimiento.nombre || '(nombre no asignado)';
    div_da_nombre.classList.toggle('d-none', !objMovimiento.nombre);//si tiene -> lo muestra, si no tiene -> oculta

    //taquilla
    // div_wr_kvadrat.className = `art_cols art_col2 wr_kvadrat ${cl_wr_kvadrat}`;
    // div_da_kvadrat.className = `da_kvadrat ${cl_da_kvadrat}`;//muestro bg rojo solo con ocupado
    // div_da_kvadrat.innerHTML = `
    //     ${da_kvadrat_html}
    // `;

    //estado_pago
    div_da_metodo_pago.textContent = escaparHTML(convertirToTitleCase(objMovimiento.metodo_pago));


    //importe
    div_da_importe.classList.remove('ingreso', 'gasto');
    div_da_importe.classList.add(objMovimiento.tipo_movimiento);
    div_da_importe.textContent = importe_text;

    //comentario
    //div_da_com.textContent = objMovimiento.comentario || '(sin comentario)';
    //si '!objMovimiento.comentario' es true  (no tiene comentario) -> pone  'd-none' -> oculta
    //si '!objMovimiento.comentario' es false (sí tiene comentario) -> quita 'd-none' -> muestra
    //div_da_com.classList.toggle('d-none', !objMovimiento.comentario);

}

async function getDataMovimientoFromBd(){
    console.log('=== function getDataMovimientoFromBd() ===');

    try {
        
        if(!hay_id(id_movimiento, 'id_movimiento', 'getDataMovimientoFromBd()')){
            return; // <- se detiene aquí si no hay id_movimiento
        }

        const nombre_fichero = 'obtener_datos_movimiento_one.php';
     
        const response = await fetch(`../app/php/datos/movimiento/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_movimiento: id_movimiento
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

                console.log(`id_movimiento: [${id_movimiento}] --- nombre: [${data.nombre}]`);

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
        console.error('Error en getDataMovimientoFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsMovimiento(){
    console.log('=== function update_objFindParamsMovimiento() ===');

    obj_ajustes.objFindParamsMovimiento = objFindParamsMovimiento;
    await update_obj_ajustes();
}
