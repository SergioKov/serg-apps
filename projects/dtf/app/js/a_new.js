
//======================================================================================//
async function pintDatosPedidoFinded(contenedor, obj, input_id_pedido){
    console.log('=== function pintDatosPedidoFinded() ===');
    console.log('obj (del pedido): ', obj);

    if(!contenedor){
        alert('no hay contenedor. No puedo pintar datos de pedido...');
        return;
    }

    if(obj?.id_pedido){

        //pedido
        const diaSemana_val = convertirToTitleCase(getDiaSemana(obj.fecha_pedido));
        const fecha_pedido_val = fechaMySQLLocal('fecha_hora_corta', obj.fecha_pedido);
        
        const fecha_bd = fechaMySQLLocal('solo_fecha', obj.fecha_pedido);
        const fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
        const hora_val = fechaMySQLLocal('solo_hora_corta', obj.fecha_pedido);

        const total_val = (obj.total) ? escaparHTML(obj.total) : '';
        const total_text = (obj.total) ? `${formatoImporte(total_val)} €` : '--';
        
        const importe_pagado_val = (obj.importe_pagado) ? escaparHTML(obj.importe_pagado) : '';
        const importe_pagado_text = (obj.importe_pagado) ? `${formatoImporte(importe_pagado_val)} €` : '--';

        const cl_da_importe_pagado = (importe_pagado_val > 0) ? 'da_importe_pagado' : '';

        contenedor.innerHTML = `
            <div class="cl_valor">    
                <div class="cl_valor_inner">
                    <div class="nc_val d_flex_v">
                        <div class="cl_campo_v">id</div>
                        <div>${obj.id_pedido}</div>
                    </div> 
                    <div class="nc_val d_flex_v">
                        <div class="cl_campo_v">día</div>
                        <div>${diaSemana_val}</div>    
                    </div> 
                    <div class="nc_val d_flex_v">
                        <div class="cl_campo_v">fecha</div>
                        <div>${fecha_val}</div>    
                    </div> 
                    <div class="nc_val d_flex_v">
                        <div class="cl_campo_v">hora</div>
                        <div>${hora_val}</div>    
                    </div> 
                    <div class="nc_val d_flex_v w_100">
                        <div class="cl_campo_v">total</div>
                        <div>${total_text}</div>    
                    </div>
                    <div class="nc_val d_flex_v w_100">
                        <div class="cl_campo_v">pagado</div>
                        <div class="${cl_da_importe_pagado}">${importe_pagado_text}</div>
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
                //alert('click en nc_val_x')
                resetId('id_pedido', contenedor, input_id_pedido);
            }
        }

    }else{
        console.log('no hay pedido seleccionado...');

        contenedor.innerHTML = `
            <div class="cl_valor">    
                <div class="cl_valor_inner w_100">
                    <div class="prim">No hay pedido vinculado</div> 
                </div>
            </div>
        `;            
    }
}

function buildModalBuscarPedido(input_id_pedido) {
    console.log('=== function buildModalBuscarPedido() ===');

    if(!input_id_pedido){
        alert('no hay input oculto para guardar el pedido seleccionado. No puedo continuar.');
        return;
    }

    const titulo_head = 'Selecciona pedido';

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
                <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#buscar_pedido')">
                    <img src="images/x_white.png">
                </div>
                <input id="buscar_pedido" type="text" name="buscar_pedido" required="" placeholder=" " value="">
                <label for="buscar_pedido">Buscar pedido</label>
            </div>            
        
        </form>

        <div id="regs_finded_pedido_sm" class="wr_block_find d-none">
            <!-- aki divs de pedidos encontrados -->
        </div>
    `;

    const btn_mostrar_todos = contenido.querySelector('.btn_mostrar_todos');
    btn_mostrar_todos.onclick = async () => {
        console.log('muestro todos pedidos');
        await findWordsPedidoSm(find_by = 'all', modal2, input_id_pedido);
    };

    //al teclear texto en la busqueda de pedido
    let timeoutBuscarPedido;

    // buscar_pedido
    const input_buscar_pedido = contenido.querySelector('#buscar_pedido');
    input_buscar_pedido.oninput = (e) => {
        console.log('=== listener --- input_buscar_pedido');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutBuscarPedido);
    
        //no permito buscar al teclear menos de 2 carácteres
        if(input_val.length < 2){
            return;
        }
    
        timeoutBuscarPedido = setTimeout(async () => {
            await findWordsPedidoSm(find_by = 'words', modal2, input_id_pedido);
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
        modal2.modal2_body.querySelector('#buscar_pedido')?.focus();
    });
}

async function findWordsPedidoSm(find_by = 'words', referencia_modal, input_id_pedido){//buscar por palabras o todos
    console.log('=== async function findWordsPedidoSm() ===');
    console.time('time_findWordsPedidoSm');

    const eid_inpt_find_pedido = referencia_modal.modal2.querySelector('#buscar_pedido');
    const eid_regs_finded_pedido_sm = referencia_modal.modal2.querySelector('#regs_finded_pedido_sm');

    let words_input_trimed = eid_inpt_find_pedido.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = 3;//eid_modo_pedido.value;
    let buscar_en = 1;//eid_buscar_en_pedido.value;
    //console.log('--- words_input: ', words_input);
    
    let filtro = {};
    objFindParamsPedidoSm.filtro = filtro;//aunque es vacio, lo añado para evitar errores

    let objDataPedidosSmFinded;

    if(find_by == 'words'){//buscar pedidos por palabras introducidas
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
    
        objFindParamsPedidoSm.words_input = words_input;
        objFindParamsPedidoSm.modo = modo;
        objFindParamsPedidoSm.buscar_en = buscar_en;
        objFindParamsPedidoSm.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias

        objDataPedidosSmFinded = await getDataPedidosFromBdByFind(objFindParamsPedidoSm);
    }

    if(find_by == 'all'){//buscar todos pedidos
        eid_inpt_find_pedido.value = '';//reset

        objFindParamsPedidoSm.words_input = '';
        objFindParamsPedidoSm.modo = modo;
        objFindParamsPedidoSm.buscar_en = buscar_en;
        objFindParamsPedidoSm.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias
        
        objDataPedidosSmFinded = await getDataPedidosAllFromBd();
    }

    console.log('objDataPedidosSmFinded: ', objDataPedidosSmFinded);
    
    const hay_coincidencias = (esObjeto(objDataPedidosSmFinded) && objDataPedidosSmFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsPedidoSm.findedRows = 0;

        eid_regs_finded_pedido_sm.classList.remove('d-none');
        eid_regs_finded_pedido_sm.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados.
            </p>
        `;
    }

    //si hay pedidos...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsPedidoSm.findedRows = objDataPedidosSmFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_pedido_sm.classList.remove('d-none');
        eid_regs_finded_pedido_sm.innerHTML = `
            <div class="wr_block_find_head">
                <div class="wr_num_regs">
                    <div class="title_regs_finded">Registros encontrados: </div>
                    <div class="num_regs_finded">${objDataPedidosSmFinded.arr_data.length}</div>
                    <div class="wr_close_item" onclick="closeDivBySelector('#regs_finded_pedido_sm')">
                        <span class="close">✕</span>
                    </div>
                </div>
            </div>
            <div class="wr_block_find_body">
                <!-- aki los divs de pedidos -->
            </div>
        `;

        //Recorrer el array de pedidos encontrados y crear divs para cada uno
        objDataPedidosSmFinded.arr_data.forEach((el,i,arr) => {


            const diaSemana_val = convertirToTitleCase(getDiaSemana(el.fecha_pedido));
            const fecha_pedido_val = fechaMySQLLocal('fecha_hora_corta', el.fecha_pedido);
            
            const fecha_bd = fechaMySQLLocal('solo_fecha', el.fecha_pedido);
            const fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
            const hora_val = fechaMySQLLocal('solo_hora_corta', el.fecha_pedido);
    
            const total_val = (el.total) ? escaparHTML(el.total) : '';
            const total_text = (el.total) ? `${formatoImporte(total_val)} €` : '--';
            
            const importe_pagado_val = (el.importe_pagado) ? escaparHTML(el.importe_pagado) : '';
            const importe_pagado_text = (el.importe_pagado) ? `${formatoImporte(importe_pagado_val)} €` : '--';
    
            const cl_d_importe_pagado = (importe_pagado_val > 0) ? '' : 'd-none';
            const cl_da_importe_pagado = (importe_pagado_val > 0) ? 'da_importe_pagado' : '';

            
            const d_pedido = document.createElement('div');
            d_pedido.className = 'd_pedido d_art';
            d_pedido.dataset.id_pedido = el.id_pedido;
            d_pedido.dataset.tipo_art = 'pedido';
            d_pedido.innerHTML = `
                <div class="datos_pedido datos_art">
                    <div class="wr_id_nombre">
                        <div class="da_nombre">Pedido:</div>
                        <div class="da_id">${el.id_pedido}</div>
                        <div class="da_nombre">${diaSemana_val}</div>
                        <div class="da_nombre">${fecha_val}</div>
                        <div class="da_nombre">${hora_val}</div>
                    </div>
                    <div class="wr_id_nombre">                    
                        <div class="da_nombre">Cliente:</div>
                        <div class="da_id">${el.id_cliente}</div>
                        <div class="da_tel">${el.nombre}</div>
                    </div>
                    <div class="bl_totales">
                        <div class="bl_totales_inner">
                            <div class="row_tot d_total">
                                <span>Total:</span> 
                                <span class="sp_total">${total_text}</span>
                            </div>
                            <div class="row_tot d_importe_pagado ${cl_d_importe_pagado}">
                                <span>Importe pagado:</span> 
                                <span class="${cl_da_importe_pagado}">${importe_pagado_text}</span>
                            </div>
                        </div>
                    </div>
                </div>               
            `;

            //click en div
            d_pedido.onclick = async (e) => {

                console.log('element clicked: ', e.currentTarget);
                console.log('el:', el);

                const d_pedido_clicked = e.target.closest('.d_art');
                console.log('d_pedido_clicked:', d_pedido_clicked);

                input_id_pedido.value = el.id_pedido;//es input_id_pedido que se pasa como parametro

                //actualizo objeto de pedido con los datos del pedido seleccionado
                id_pedido = el.id_pedido;//importante
                objPedido = await getDataPedidoFromBd(id_pedido);//IMPORTANTE para cojer todos los datos necesarios
                console.log('objPedido: ', objPedido);

                const wr_saldo_pedido = document.getElementById('wr_saldo_pedido');
                const eid_datos_pedido_finded = document.getElementById('datos_pedido_finded');

                calcularTotal();

                if(wr_saldo_pedido){
                    //muestro el block de saldo pedido ya que el pedido ha sido seleccionado
                    wr_saldo_pedido.classList.remove('d-none')
                }
                
                if(eid_datos_pedido_finded){
                    pintDatosPedidoFinded(eid_datos_pedido_finded, objPedido, input_id_pedido);

                    eid_regs_finded_pedido_sm.classList.add('d-none');
                    
                    console.log('div clicked. cierro modal2');
                    referencia_modal.cerrarModal2();
                }
            }

            eid_regs_finded_pedido_sm.querySelector('.wr_block_find_body').append(d_pedido);
        });

        
        
    }

    //await update_objFindParamsPedido();

    console.timeEnd('time_findWordsPedidoSm');
}












async function buildModalPago(pedido_action, id_movimiento = null, index_item = null) {
    console.log('=== function buildModalPago() ===');

    // pedido_action es nuevo o edit
    // si hay id_movimiento es edit, si no lo hay es nuevo pago

    // if(!id_pedido){
    //     alert('no hay id_pedido. No puedo continuar.');
    //     return;
    // }
    
    let titulo_head = '';    
    const contenido = document.createElement('div');
    contenido.className = 'zzz_new';//luego mirar si lo cambio

    //variables de formulatio
    let titulo_pago_html = '';
    let titulo_pedido_html = '';
    let fecha_movimiento_val = '';
    let importe_val = '';
    let metodo_pago_val = '';
    let titulo_val = '';
    let comentario_val = '';

    let pago_item = '';


    if(index_item == null){//pago (movimiento) nuevo (no pongo !index_item ya que si es 0 -> funciona incorrectamente)
        
        titulo_head = 'Crear Pago';
        titulo_pago_html = `<span>Pago (movimiento): <b>NUEVO</b></span>`;

        // Formato YYYY-MM-DD que necesita <input type="date">
        //const fechahora_hoy = new Date().toISOString().split("T")[0];
        const fechahora_hoy = fechaMySQLLocal('fecha_hora_corta');
        
        fecha_movimiento_val = fechahora_hoy;//'2026-11-29 11:15'

    }else{// editar pago

        titulo_head = 'Editar Pago';
        //titulo_pago_html = `<span>Pago (movimiento): <b>${id_movimiento}</b></span>`;
        
        //si hay index_item -> cojo datos de pedido.arr_pagos[]
        pago_item = pedido.arr_pagos[index_item];
        
        if(pago_item){ 
            titulo_pago_html = `<span>Pago (movimiento): <b>${pago_item.id_movimiento ? pago_item.id_movimiento : 'nuevo'}</b></span>`;

            fecha_movimiento_val = pago_item.fecha_movimiento;
            importe_val = pago_item.importe;
            titulo_val = pago_item.titulo;
            metodo_pago_val = pago_item.metodo_pago;
            comentario_val = pago_item.comentario;
        }else{
            const aviso_text = `No se encontró el pago en el índice: <b>${index_item}</b>. Revisa los datos de pagos.`;
            showToast('warn', aviso_text, 50, 'center', true, 'Error');
            return;
        }
    }



    //clases css
    let cl_d_limpiar_input = 'd-flex';


    //pedido
    if(pedido_action == 'nuevo'){//se crea un nuevo pedido
        titulo_pedido_html = `<span>Pedido: <b>NUEVO</b></span>`;
    }else{//si es: ver, editar, eliminar
        titulo_pedido_html = `<span>Pedido: <b>${id_pedido}</b></span>`;
    }


    //relleno formulario
    contenido.innerHTML = `
        <form class="form_pago">

                <p class="mensaje">
                    ${titulo_pago_html}
                    ${titulo_pedido_html}
                </p>


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
                    <label for="importe">Importe</label>
                </div>
                <!-- /importe -->


                <!-- metodo_pago -->
                <div id="wr_metodo_pago" class="wr_sel_opt_estado">
                    <h5>Método de pago</h5>
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


                <div class="wr_btns_form">
                    <button id="" class="btn btn_big" type="reset">Limpiar</button>
                    <button id="btn_addPago" class="btn btn_big">Añadir</button>
                </div>
        
        </form>

        <div id="regs_finded_pedido_sm" class="wr_block_find d-none">
            <!-- aki divs de pedidos encontrados -->
        </div>
    `;

    //importe
    const eid_wr_importe = contenido.querySelector('#wr_importe');
    const input_importe = contenido.querySelector('#importe');

    //metodo_pago
    const eid_wr_metodo_pago = contenido.querySelector('#wr_metodo_pago');
    const select_metodo_pago = contenido.querySelector('#metodo_pago');


    //importe
    input_importe.oninput = (e) => {
        const importe_texto = e.target.value;

        input_importe.classList.remove('blink_bg');

        if (importe_texto.length > 10) {
            importe_texto = importe_texto.slice(0, -1);
            e.target.value = importe_texto;
        }
        // Actualizamos el valor numérico del pedido
        //pedido.importe = Math.max(0, Number(importe_texto) || 0);
        //calcularTotal();
    }


    //metodo_pago
    select_metodo_pago.value = pago_item?.metodo_pago || '';//al cargar formulario
    select_metodo_pago.onchange = async (e) => {
        const metodo_pago_val = e.target.value;
        pintContenedorEstado(eid_wr_metodo_pago, metodo_pago_val);
        //hideShowElementos(arr_elementos_importe, metodo_pago_val);
    }

    const btn_addPago = contenido.querySelector('#btn_addPago');
    btn_addPago.onclick = async (e) => {
        console.log('click en btn_addPago');
        addPago(e, contenido, modal2, pedido_action, id_movimiento, index_item);
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
        const input_importe = modal2.modal2_body.querySelector('#importe');
        if(input_importe){
            input_importe.focus();
            const longitud = input_importe.value.length;
            input_importe.setSelectionRange(longitud, longitud);//colocar el cursor al final del valor
        }
    });
}





function addPago(e, contenido, referencia_modal, pedido_action, id_movimiento = null, index_item = null){
    console.log('=== function addPago() ===');

    if(e){
        console.log('hay event. no lo propago...')
        e.preventDefault();
    }

    const form_pago = contenido.querySelector('.form_pago');
    
    const fecha_movimiento = form_pago?.querySelector('#fecha_movimiento').value.trim();
    const importe = form_pago?.querySelector('#importe').value.trim();
    const metodo_pago = form_pago?.querySelector('#metodo_pago').value.trim();
    const titulo = form_pago?.querySelector('#titulo').value.trim();
    const comentario = form_pago?.querySelector('#comentario').value.trim();

    let errors = [];

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

    const objPago = {
        fecha_movimiento,
        importe: Number(importe),
        metodo_pago,
        titulo: escaparHTML(titulo),
        comentario: escaparHTML(comentario),
    }
    console.log('objPago: ',objPago);

    if(id_movimiento){
        // Actualizar pago existente mediante su id_movimiento
        const itemPagoUpdate = pedido.arr_pagos.find(item => item.id_movimiento == id_movimiento);
        
        if (!itemPagoUpdate) {
            const aviso_text = `No se encontró el movimiento: <b>${id_movimiento}</b>. Revisa los datos de pagos.`;
            showToast('warn', aviso_text, 50, 'center', true, 'Error');
            return;
        }
        Object.assign(itemPagoUpdate, objPago);

    }else if(Number.isInteger(index_item) && index_item >= 0){
        // Actualizar pago mediante su índice
        const itemPagoUpdate = pedido.arr_pagos[index_item];
        
        if (!itemPagoUpdate) {
            const aviso_text = `No se encontró el pago en el índice: <b>${index_item}</b>. Revisa los datos de pagos.`;
            showToast('warn', aviso_text, 50, 'center', true, 'Error');
            return;
        }
        Object.assign(itemPagoUpdate, objPago); 

    }else{//nuevo pago
        
        // Añadir nuevo pago
        pedido.arr_pagos.push(objPago);
    }        
    console.log('pedido.arr_pagos: ',pedido.arr_pagos);

    calcularPagosFraccionados();

    const contenedor_pagos = document.querySelector('#form_pedido #contenedor_pagos');

    pintPagosFraccionadosEnContenedor(contenedor_pagos, pedido_action);   

    //cierro modal
    referencia_modal.cerrarModal2();
}


function calcularPagosFraccionados(){
    console.log('=== function calcularPagosFraccionados() ===');

    // Sumar los importes de pagos de pedido
    const total_pagos = pedido.arr_pagos.reduce(
        (total, item) => total + (parseFloat(item.importe) || 0),
        0
    );

    pedido.total_pagos = total_pagos;
    pedido.importe_pagado = total_pagos;

    const input_importe_pagado = document.querySelector('#form_pedido #importe_pagado');
    if(input_importe_pagado){
        input_importe_pagado.value = total_pagos;
    }

    const sp_total_pf = document.querySelector('#form_pedido #sp_total_pf');
    if(sp_total_pf){
        sp_total_pf.textContent = `${formatoImporte(pedido.total_pagos)} €`;
    }

    calcularTotal();

    return pedido;
}


function pintPagosFraccionadosEnContenedor(contenedor, pedido_action){
    console.log('=== function pintPagosFraccionadosEnContenedor() === ');

    if(!contenedor){
        let aviso_text = `<p>No has selecionado contenedor para pagos.`;
        
        showToast('error', aviso_text, 50, 'center', true, 'Error de contenedor');
        return;
    }

    // Ordeno según la fecha: primero los antiguos
    pedido.arr_pagos.sort((a, b) =>
        new Date(a.fecha_movimiento) - new Date(b.fecha_movimiento)
    );

    const contenedor_inner = contenedor.querySelector('.bl_totales_inner');
    contenedor_inner.innerHTML = '';//reset

    pedido.arr_pagos.forEach((obj,i) => {

        const diaSemana_val = convertirToTitleCase(getDiaSemana(obj.fecha_movimiento));
        //const fecha_movimiento_val = fechaMySQLLocal('fecha_hora_corta', obj.fecha_movimiento);

        const fecha_obj = fechaMySQLLocal('solo_fecha', obj.fecha_movimiento);
        const fecha_val = convertirFecha(fecha_obj, 'ver','.');//de '2026-10-18' a '18.10.2026'
        const hora_val = fechaMySQLLocal('solo_hora_corta', obj.fecha_movimiento);

        const div_pago = document.createElement('div');
        div_pago.className = 'div_pago row_tot';
        div_pago.dataset.index_item = i;
        div_pago.dataset.id_movimiento = obj.id_movimiento || '';
        div_pago.innerHTML = `
            <div class="wr_parte_flex">

                <div class="da_num">${i + 1})</div>

                <div class="wr_parte_row">
                    <div class="parte_row">
                        <div class="da_fechahora">
                            <div class="da_diasem">${diaSemana_val}</div>
                            <div class="da_fecha">${fecha_val}</div>
                            <div class="da_hora">${hora_val}</div>
                        </div>
                        <div class="sp_metodo_pago">${convertirToTitleCase(obj.metodo_pago)}</div>
                        <div class="sp_importe">${formatoImporte(obj.importe)} €</div>
                    </div>
                    <div class="parte_row da_nombre ${obj.titulo ? '' : 'd-none'}">${obj.titulo}</div>
                    <div class="parte_row da_nombre ${obj.comentario ? '' : 'd-none'}">${obj.comentario}</div>
                </div>

            </div>
            
            <div class="wr_close_item">
                <span class="close">✕</span>
            </div>
        `;

        div_pago.onclick = async (e) => {
            console.log('div_pago.onclick');

            const pago_clicked = e.currentTarget;
            console.log('pago_clicked: ',pago_clicked);

            //si el contenedor es de solo ver, no permito el click. 
            if(div_pago.closest('#wr_pagos.solo_ver')){
                return;
            }

            // Eliminar div_pago del pedido
            // Click en X para eliminar el div_pago del pedido
            if(e.target.closest('.wr_close_item')){//click sobre 'X' de cerrar div_item
                const index_item = Number(div_pago.dataset.index_item);

                pedido.arr_pagos.splice(index_item, 1);//elimino del array
                div_pago.remove();//elimino delDOM
                
                calcularPagosFraccionados();
                calcularTotal();

                // Mostrar mensaje si la lista queda vacía
                if (pedido.arr_pagos.length === 0) {
                    contenedor_inner.innerHTML = '';//reset

                    const d_prim = document.createElement('div');
                    d_prim.className = 'prim';
                    d_prim.textContent = 'Lista de pagos de pedido vacía.';

                    contenedor_inner.append(d_prim);
                }

                return;

            } else {//editar
                console.log('voy a editar...');

                const id_movimiento = pago_clicked.dataset.id_movimiento || null;//si es vacio => null
                const index_item = Number(pago_clicked.dataset.index_item);//siempre existe

                // if(id_movimiento){//es pago que tiene id_movimiento, es de bd
                //     buildModalPago(pedido_action, id_movimiento, null);//aki editar pago
                // }else{//es pago añadido pero sin guardar. tiene index_item
                // }

                //siempre existe index_item
                buildModalPago(pedido_action, null, index_item);
            }
        }
        
        //añado al DOM
        contenedor_inner.append(div_pago);
    });
    

    const d_total_pf = document.createElement('div');
    d_total_pf.className = 'd_total_pf row_tot';
    d_total_pf.innerHTML = `
        <span>Total pagado:</span> 
        <span id="sp_total_pf" class="sp_importe">${formatoImporte(pedido.total_pagos)} €</span>
    `;

    //añado al DOM
    contenedor_inner.append(d_total_pf);
}

