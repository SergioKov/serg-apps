//pedido
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildPedido(pedido_action = null){
    console.log('=== function buildPedido() ===');

    console.log('pedido_action: ', pedido_action);
    console.log('objPedido: ', objPedido);

    eid_bl_modalFullInner.innerHTML = '';//reset

    // Formato YYYY-MM-DD que necesita <input type="date">
    //const fechahora_hoy = new Date().toISOString().split("T")[0];
    const fechahora_hoy = fechaMySQLLocal('fecha_hora_corta');

    //campos de input
    let id_pedido_val = '';
    let id_cliente_val = '';
    let id_taquilla_val = '';

    //cliente
    let nombre_val = '';
    let telefono_val = '';
    let codigo_cliente_val = '';

    //taquilla
    let t_nombre_val = '';
    let estado_taquilla_val = '';
    
    let comentario_val = '';

    let diaSemana_val = '';
    let fecha_pedido_val = fechahora_hoy;

    let fecha_bd = '';
    let fecha_val = '';//de '2026-10-18' a '18.10.2026'
    let hora_val = '';

    let canal_venta_val = '';
    let canal_aviso_val = '';

    let subtotal_val = '';
    let subtotal_text = '';

    let iva_incluido_val = 1;//por defecto 'Con IVA'
    let iva_total_val = '';
    let iva_total_text = '';

    let total_val = '';
    let total_text = '';

    let cantidad_pedido_items = 0;//por defecto. si los hay, se modifica

    //elemento de título en el top
    const p_mensaje = document.createElement('p');
    p_mensaje.className = 'mensaje';
        
    //otras vars
    let cl_id_pedido = 'd-none';//oculto
    let cl_d_subtotal = '';//muestro ya que por defecto iva_incluido = 1
    let cl_d_iva_total = '';//muestro ya que por defecto iva_incluido = 1
    let cl_solo_ver = '';
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'

    let contenedor;//general. se asigna luego  
    
    if(pedido_action == 'nuevo'){//si es nueva
        console.log('es pedido nuevo');

        //reseteo pedido
        pedido = {
            arr_items_pedido: [],
            subtotal: 0,
            iva_incluido: 1,
            iva_total: 0,
            total: 0
        }

    }else{//si es: ver, editar, eliminar
        console.log('es pedido que se edita');
        
        if(!hay_id(id_pedido, 'id_pedido', 'buildPedido()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún pedido.</p>
                <p class="p_aviso">Crea un pedido pulsando "+".</p>
            `;
            openModal('center','Aviso Pedido',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_pedido
        }

        

        id_pedido_val = objPedido.id_pedido;
        id_cliente_val = objPedido.id_cliente;
        id_taquilla_val = objPedido.id_taquilla || '';

        //cliente
        nombre_val = escaparHTML(objPedido.nombre) || '(no asignado)';
        telefono_val = escaparHTML(objPedido.telefono) || '---';
        codigo_cliente_val = escaparHTML(objPedido.codigo_cliente) || '(no asignado)';
        
        //taquilla
        t_nombre_val = escaparHTML(objPedido.t_nombre);// 't_nombre' = 't.nombre' //el numero de taquilla
        estado_taquilla_val = escaparHTML(objPedido.estado_taquilla);
    
        comentario_val = escaparHTML(objPedido.comentario) || '';

        diaSemana_val = convertirToTitleCase(getDiaSemana(objPedido.fecha_pedido));
        fecha_pedido_val = fechaMySQLLocal('fecha_hora_corta', objPedido.fecha_pedido);

        fecha_bd = fechaMySQLLocal('solo_fecha', objPedido.fecha_pedido);
        fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
        hora_val = fechaMySQLLocal('solo_hora_corta', objPedido.fecha_pedido);

        // fecha_val = convertirFecha(objPedido.fecha_pedido, 'ver', '/');
                
        canal_venta_val = (objPedido.canal_venta) ? escaparHTML(objPedido.canal_venta) : '';
        canal_aviso_val = (objPedido.canal_aviso) ? escaparHTML(objPedido.canal_aviso) : '';

        subtotal_val = (objPedido.subtotal) ? escaparHTML(objPedido.subtotal) : '';
        subtotal_text = (objPedido.subtotal) ? `${subtotal_val} €` : '--';
                
        iva_incluido_val = objPedido.iva_incluido;
        iva_total_val = (objPedido.iva_total) ? escaparHTML(objPedido.iva_total) : '';
        iva_total_text = (objPedido.iva_total) ? `${iva_total_val} €` : '--';

        cl_d_subtotal = (iva_incluido_val) ? '' : 'd-none';
        cl_d_iva_total = (iva_incluido_val) ? '' : 'd-none';
                
        total_val = (objPedido.total) ? escaparHTML(objPedido.total) : '';
        total_text = (objPedido.total) ? `${total_val} €` : '--';

        if(objPedido.arr_items){
            pedido.arr_items_pedido = structuredClone(objPedido.arr_items);//aki imprescindible structuredClone() y no [...array_new]
            console.log('pedido.arr_items_pedido:', pedido.arr_items_pedido);
        }

        cantidad_pedido_items = pedido.arr_items_pedido.length;
    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(pedido_action)){
        
        p_mensaje.innerHTML = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_pedido}</b></span>
            </span>
        `;
        
        if(pedido_action == 'ver'){
            const wr_img_editar_en_ver = document.createElement('span');
            wr_img_editar_en_ver.className = 'wr_img_editar_en_ver';
            wr_img_editar_en_ver.innerHTML = `
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            `;
            p_mensaje.append(wr_img_editar_en_ver);
        }
    }

    switch (pedido_action) {
        case 'nuevo'://Nueva Pedido
            p_mensaje.innerHTML = `
                <span>Rellena los campos del formulario con los datos de un pedido <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_pedido
            if(id_pedido){
                id_pedido = null;//reset ya que se va a crear un id_pedido nuevo
            }else{
                //id_pedido es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objPedido = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            break;
        
        default:
        case 'ver'://Ver Pedido - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_pedido = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            cl_solo_ver = 'solo_ver';//permito solo ver y no manejar el click
            break;

        case 'editar'://Editar Pedido - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Pedido - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_pedido = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'eliminar'
            break;
    }
    


    //Descripción si hay
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deletePedido(event);">Eliminar Pedido DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_pedido_sm = document.createElement('div'); 
    contenedor_pedido_sm.id = 'contenedor_pedido_sm';
    contenedor_pedido_sm.className = 'contenedor_form_sm';
    contenedor_pedido_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Pedido <span class="f_r ${cl_id_pedido}">id: ${id_pedido_val}</span>
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
                </span><!--/.detalles_inner-->
            </p>


            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm2');">
                Cliente <span class="f_r">id: ${id_cliente_val}</span>
            </p>
            <p id="l_titulo_detalles_sm2" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}. </span>
                    </span>
                    <span class="linea_fx ${!telefono_val ? 'd-none' : ''}">
                        <span class="cl_campo">Teléfono:</span>
                        <span>${telefono_val}. </span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>

            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm3');">
                Totales 
            </p>
            <p id="l_titulo_detalles_sm3" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!subtotal_val ? 'd-none' : ''}">
                        <span class="cl_campo">Subtotal:</span>
                        <span>${subtotal_text}</span>
                    </span>
                    <span class="linea_fx ${!iva_total_val ? 'd-none' : ''}">
                        <span class="cl_campo">IVA total:</span>
                        <span>${iva_total_text}</span>
                    </span>
                    <span class="linea_fx ${!total_val ? 'd-none' : ''}">
                        <span class="cl_campo">Total:</span>
                        <span>${total_text}</span>
                    </span>
                </span><!--/.detalles_inner-->
            </p>            
        </div>        

        ${(comentario_val) ? comentario_detalles.outerHTML : '' }
        
        ${(pedido_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarPedido(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_pedido = document.createElement('div');
    form_pedido.id = 'form_pedido';
    form_pedido.innerHTML = `
        <div class="form_container">
            <form>
                
                <!-- titulo -->
                ${p_mensaje.outerHTML}


                <!-- buscar cliente -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#buscar_cliente')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="buscar_cliente" type="text" name="buscar_cliente" required="" placeholder=" " value="">
                    <label for="buscar_cliente">Buscar cliente</label>
                    
                    <input id="id_cliente" type="hidden" name="id_cliente" value="${id_cliente_val}">
                </div>

                <div class="wr_results_buscar_sm">

                    <div id="datos_cliente_finded" class="reg_selected">
                        <div class="cl_campo">Cliente: </div>
                        <div class="cl_valor">
                            <div class="cl_valor_inner">
                                <div class="nc_val d_flex_v">
                                    <div class="cl_campo_v">id</div>
                                    <div>${id_cliente_val}</div>
                                </div> 
                                <div class="nc_val d_flex_v">
                                    <div class="cl_campo_v">nombre</div>
                                    <div>${nombre_val}</div>    
                                </div> 
                                <div class="nc_val d_flex_v">
                                    <div class="cl_campo_v">tel</div>
                                    <div>${telefono_val}</div>    
                                </div> 
                                <div class="nc_val d_flex_v">
                                    <div class="cl_campo_v">cod</div>
                                    <div>${codigo_cliente_val}</div>    
                                </div> 
                            </div>
                        </div>
                    </div>

                    <div id="regs_finded_cliente_sm" class="wr_cliente_find d-none">
                        <!-- aki divs de clientes encontrados -->                  
                    </div>
                </div>


                <!-- fecha_pedido -->
                <div class="form_group wr_input_general">
                    <input type="datetime-local" id="fecha_pedido" name="fecha_pedido" required="" placeholder=" " value="${fecha_pedido_val}">
                    <label for="fecha_pedido">Fecha de pedido</label>
                </div>


                <!-- canal_venta -->
                <div class="form_group wr_input_general">
                    <label class="lab_varios_btns">Canal de venta:</label>
                    <div id="d_canal_venta" class="wr_varios_btns ${cl_solo_ver}">
                        <div class="dbtn" data-value="whatsapp">WhatsApp</div>
                        <div class="dbtn" data-value="mail">Mail</div>
                        <div class="dbtn" data-value="web">Web</div>
                    </div>
                    <input id="canal_venta" type="hidden" name="canal_venta" value="${canal_venta_val}"> 
                </div>







                



                <!-- Tipo de concepto -->
                <div id="wr_tipo_conceptos" class="wr_sel_opt_estado ${cl_solo_ver}">

                    <h5>Tipo de concepto:</h5>
                    <div id="d_tipo_concepto" class="wr_varios_btns ${cl_solo_ver}">
                        <div class="dbtn active" data-value="producto">Producto</div>
                        <div class="dbtn" data-value="bono">Bono</div>
                        <div class="dbtn" data-value="servicio">Servicio</div>
                    </div>

                    <div id="contenedor_tipos">
                    
                        <div id="contenedor_select_producto" class="todos_items active ${cl_solo_ver}" data-value="producto">
                            <!-- aki se meten los productos de bd -->
                        </div>

                        <div id="contenedor_select_bono" class="todos_items ${cl_solo_ver}" data-value="bono">
                            <!-- aki se meten los bonos de bd -->
                        </div>

                        <div id="contenedor_select_servicio" class="todos_items ${cl_solo_ver}" data-value="servicio">
                            <!-- aki se meten los servicios de bd -->
                        </div>

                    </div> 

                </div>




                <!-- items_pedido -->
                <div id="wr_items_pedido" class="wr_sel_opt_estado ${cl_solo_ver}">
                    <h5>Lista de elementos de pedido:</h5>

                    <div id="contenedor_lista_items" class="">
                        <!-- aki divs de items de pedido seleccionados -->
                        <div class="prim ${cantidad_pedido_items ? 'd-none' : 'd-block'}">
                            Lista de elementos de pedido vacia.
                        </div>
                    </div>

                   
                    <div id="contenedor_totales" class="">                        
                        <div class="row_tot d_subtotal ${cl_d_subtotal}">
                            <span>Subtotal:</span> 
                            <span class="sp_subtotal">${subtotal_val || '0.00'} €</span>
                        </div>
                        <div class="row_tot d_iva_total ${cl_d_iva_total}">
                            <span>IVA Total:</span> 
                            <span class="sp_iva_total">${iva_total_val || '0.00'} €</span>
                        </div>
                        <div class="row_tot d_total">
                            <span>Total:</span> 
                            <span class="sp_total">${total_val || '0.00'} €</span>
                        </div>
                    </div>

                    <input id="subtotal" type="hidden" name="subtotal" value="${subtotal_val}">
                    <input id="iva_total" type="hidden" name="iva_total" value="${iva_total_val}">
                    <input id="total" type="hidden" name="total" value="${total_val}">
                    
                </div>




                <!-- iva_incluido -->
                <div class="form_group wr_input_general">
                    <label class="lab_varios_btns">Iva incluido:</label>
                    <div id="d_iva_incluido" class="wr_varios_btns ${cl_solo_ver}">
                        <div class="dbtn dbtn_no" data-value="0">Sin IVA</div>
                        <div class="dbtn dbtn_si" data-value="1">Con IVA</div>
                    </div>
                    <input id="iva_incluido" type="hidden" name="iva_incluido" value="${iva_incluido_val}"> 
                </div>


                <!-- estado_pedido -->
                <div id="wr_estado_pedido" class="wr_sel_opt_estado ${objPedido?.estado_pedido || ''}">
                    <h5>Estado de pedido:</h5>
                    <select id="estado_pedido" class="sel_opt_find">
                        <option value="">(no asignado)</option>
                        <option value="en_preparacion">En preparación</option>
                        <option value="impreso">impreso</option>
                        <option value="en_oficina">En oficina</option>
                        <option value="entregado">Entregado</option>
                    </select>
                </div>


                <!-- taquilla asignada -->
                <div id="wr_taquilla_asignada" class="wr_sel_opt_estado ${cl_solo_ver}">
                    <h5>Taquilla:</h5>

                    <input id="id_taquilla" type="hidden" name="id_taquilla" value="${id_taquilla_val}">

                    <div id="contenedor_una_taquilla_asignada">
                        <!-- aki se mete la taquilla asignada si hay -->
                    </div>

                    <div id="outer_asignar_taquilla" class="${cl_solo_ver}">
                                        
                        <div id="dbtn_asignar_taquilla" class="btn btn_big" onclick="toggleContenedor('contenedor_taquillas_asignar', 'dbtn_asignar_taquilla', 'grid')">Mostrar taquillas</div>
                    
                        <div id="contenedor_taquillas_asignar" class="todos_taq grid_container d-none">
                            <!-- aki divs taquillas para asignar -->
                        </div>

                    </div>
                </div>


                <!-- estado_pago -->
                <div id="wr_estado_pago" class="wr_sel_opt_estado ${objPedido?.estado_pago || ''}">
                    <h5>Estado de pago:</h5>
                    <select id="estado_pago" class="sel_opt_find">
                        <option value="">(no asignado)</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="parcial">Parcial</option>
                        <option value="pagado">Pagado</option>
                        <option value="recurrente">Recurrente (mensual)</option>
                    </select>
                </div>


                <!-- metodo_pago -->
                <div id="wr_metodo_pago" class="wr_sel_opt_estado ${objPedido?.metodo_pago || ''}">
                    <h5>Método de pago:</h5>
                    <select id="metodo_pago" class="sel_opt_find">
                        <option value="">(no asignado)</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="bizum">Bizum</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>


                <!-- canal_aviso-->
                <div class="form_group wr_input_general">
                    <label class="lab_varios_btns">Canal de aviso:</label>
                    <div id="d_canal_aviso" class="wr_varios_btns ${cl_solo_ver}">
                        <div class="dbtn" data-value="whatsapp">WhatsApp</div>
                        <div class="dbtn" data-value="mail">Mail</div>
                        <div class="dbtn" data-value="sms">SMS</div>
                    </div>
                    <input id="canal_aviso" type="hidden" name="canal_aviso" value="${canal_aviso_val}"> 
                </div>               


                <!-- comentario -->
                <div class="form_group">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#comentario')">
                        <img src="images/x_white.png">
                    </div>
                    <textarea id="comentario" name="comentario" rows="4" required="" placeholder=" ">${comentario_val}</textarea>
                    <label class="lab_textarea" for="comentario">Comentario</label>
                </div>


                ${ (['nuevo','editar'].includes(pedido_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    const input_buscar_cliente = form_pedido.querySelector('#buscar_cliente');
    const input_id_taquilla = form_pedido.querySelector('#id_taquilla');
    const eid_dbtn_asignar_taquilla = form_pedido.querySelector('#dbtn_asignar_taquilla');

    //taquilla
    const eid_d_taq_asignada = form_pedido.querySelector('#d_taq_asignada');
    const eid_contenedor_una_taquilla_asignada = form_pedido.querySelector('#contenedor_una_taquilla_asignada');
    const eid_contenedor_taquillas_asignar = form_pedido.querySelector('#contenedor_taquillas_asignar');
    





    const eid_contenedor_tipos = form_pedido.querySelector('#contenedor_tipos');
    const eid_contenedor_select_producto = form_pedido.querySelector('#contenedor_select_producto');
    const eid_contenedor_select_bono = form_pedido.querySelector('#contenedor_select_bono');
    const eid_contenedor_select_servicio = form_pedido.querySelector('#contenedor_select_servicio');
    const eid_contenedor_lista_items = form_pedido.querySelector('#contenedor_lista_items');

    

    //tipo_concepto // no se guarda en bd. solo para seleccionar concepto_venta para items_pedido
    const eid_d_tipo_concepto = form_pedido.querySelector('#d_tipo_concepto');
    let tipo_concepto_anterior_val = 'producto';//por defecto

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

        pintDivSelected('d_tipo_concepto', eid_d_tipo_concepto, tipo_concepto_val);
        pintDivSelected('contenedor_tipos', eid_contenedor_tipos, tipo_concepto_val, 'todos_items');

        tipo_concepto_anterior_val = tipo_concepto_val;
    }
    
    
    //=============================================================================//
    //start - creo y pinto elementos:  productos, bonos, servicios. 
    //les asigno eventos click para añadir items al pedido
    //=============================================================================//

    // PRODUCTOS
    crearItemsSelector({
        tipo_concepto: 'producto',
        datos: objDataProductos?.arr_data,
        contenedor: eid_contenedor_select_producto,
        contenedor_lista_items: eid_contenedor_lista_items,
        clase: 'd_producto',
        campoId: 'id_producto',
        campoPrecio: 'precio_venta',
        mostrarCantidad: () => '1 m'
    });


    // BONOS
    crearItemsSelector({
        tipo_concepto: 'bono',
        datos: objDataBonos?.arr_data,
        contenedor: eid_contenedor_select_bono,
        contenedor_lista_items: eid_contenedor_lista_items,
        clase: 'd_bono',
        campoId: 'id_bono',
        campoPrecio: 'precio',
        mostrarCantidad: obj => `${obj.cantidad} m`,
    });


    // SERVICIOS
    crearItemsSelector({
        tipo_concepto: 'servicio',
        datos: objDataServicios?.arr_data,
        contenedor: eid_contenedor_select_servicio,
        contenedor_lista_items: eid_contenedor_lista_items,
        clase: 'd_servicio',
        campoId: 'id_servicio',
        campoPrecio: 'precio',
        mostrarCantidad: () => '1 ud.'
    });

    //=============================================================================//
    //start - creo y pinto elementos:  productos, bonos, servicios. 
    //les asigno eventos click para añadir items al pedido
    //=============================================================================//





    if(cantidad_pedido_items){
        
        //ordenar por tipo_concepto
        const orden = {
            producto: 1,
            bono: 2,
            servicio: 3
        };
        
        pedido.arr_items_pedido.sort((a, b) =>
            orden[a.tipo_concepto] - orden[b.tipo_concepto]
        );

        //Recorrer los artículos de pedido
        pedido.arr_items_pedido.forEach(item => {

            console.log('item:', item);
        
            // Crear el artículo del pedido
            const item_pedido = {
                tipo_concepto: item.tipo_concepto,
                id: item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: Number(item.precio),
                importe: Number(item.importe)
            };
        
            // Crear elemento DOM
            const div_item = crearDivItem(item_pedido);
        
            // Eliminar mensaje de lista vacía, si existe
            eid_contenedor_lista_items.querySelector('.prim')?.remove();
        
            // Añadir artículo a la lista
            eid_contenedor_lista_items.append(div_item);
        
        });        
        
    }








    //al teclear texto en la busqueda de cliente
    let timeoutBuscarCliente;

    input_buscar_cliente.oninput = (e) => {
        console.log('=== listener --- input_buscar_cliente');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutBuscarCliente);
    
        //no permito buscar al teclear menos de 2 carácteres
        if(input_val.length < 2){
            return;
        }
    
        timeoutBuscarCliente = setTimeout(async () => {
            await findWordsClienteSm();
        }, 400);
    };


    if(id_taquilla_val){
        
        //creo kvadrat de taquilla asignada
        const eid_d_taq_asignada = crearTaquillaAsignada(id_taquilla_val, t_nombre_val, estado_taquilla_val);
        eid_contenedor_una_taquilla_asignada.append(eid_d_taq_asignada);

    }else{

        const d_prim = document.createElement('div');
        d_prim.className = 'prim';
        d_prim.textContent = '(no asignada)';
        eid_contenedor_una_taquilla_asignada.append(d_prim);

    }

    if(eid_contenedor_taquillas_asignar && objDataTaquillas?.arr_data.length > 0){
        
        eid_contenedor_taquillas_asignar.innerHTML = '';//reset
        
        objDataTaquillas.arr_data.forEach(objTaquilla => {

            //div de cada taquilla de los 20 para seleccionar
            const d_taq = document.createElement('div');
            d_taq.className = `d_taq ${objTaquilla.estado_taquilla ? objTaquilla.estado_taquilla : ''}`; 
            d_taq.dataset.id_taquilla = objTaquilla.id_taquilla; 
            d_taq.dataset.t_nombre = objTaquilla.nombre;//es el numero de taquilla
            d_taq.dataset.estado_taquilla = objTaquilla.estado_taquilla;
            d_taq.textContent = objTaquilla.nombre;//es el numero de taquilla
            d_taq.onclick = () => {
                //alert(objTaquilla.nombre);
                //si no es ocupado, lo permito seleccionar
                if(!d_taq.classList.contains('ocupado')){
                    eid_contenedor_una_taquilla_asignada.innerHTML = '';//reset

                    const taq_asignada_new = crearTaquillaAsignada(d_taq.dataset.id_taquilla, d_taq.dataset.t_nombre, d_taq.dataset.estado_taquilla);
                    eid_contenedor_una_taquilla_asignada.append(taq_asignada_new);
                    
                    input_id_taquilla.value = objTaquilla.id_taquilla;
                    //scrollIntoViewInContainer(eid_modcont_body, taq_asignada_new, true, 'top');

                }else{
                    showToast('info', 'Taquilla ocupada', 2050, 'center');
                }
            } 

            eid_contenedor_taquillas_asignar.append(d_taq);
        });
    }

   


    let iva_incluido_anterior_val = objPedido.iva_incluido;//por defecto

    //iva_incluido
    const eid_d_iva_incluido = form_pedido.querySelector('#d_iva_incluido');
    eid_d_iva_incluido.onclick = (e) => {
        console.log('e.currentTarget: ', e.currentTarget);
        console.log('e.target: ', e.target);

        const contenedor_dbtns = e.currentTarget;
        const btn = e.target;

        if(contenedor_dbtns.classList.contains('solo_ver')){
            return;//no dejo cambiar el valor si es form_ver
        }

        const iva_incluido_val = btn.dataset.value;

        if(iva_incluido_val == iva_incluido_anterior_val){
            console.log('es el click sobre el mismo valor. no hago nada');
            return;
        }
        meterValor('iva_incluido', eid_d_iva_incluido, iva_incluido_val);
        pintDivSelected('d_iva_incluido', eid_d_iva_incluido, iva_incluido_val);

        iva_incluido_anterior_val = iva_incluido_val;
    }

    //al cargar el formulario
    meterValor('iva_incluido', eid_d_iva_incluido, iva_incluido_val);
    pintDivSelected('d_iva_incluido', eid_d_iva_incluido, objPedido.iva_incluido);

   


    let canal_venta_anterior_val = objPedido.canal_venta;//por defecto

    //canal_venta
    const eid_d_canal_venta = form_pedido.querySelector('#d_canal_venta');
    eid_d_canal_venta.onclick = (e) => {
        console.log('e.currentTarget: ', e.currentTarget);
        console.log('e.target: ', e.target);

        const contenedor_dbtns = e.currentTarget;
        const btn = e.target;

        if(contenedor_dbtns.classList.contains('solo_ver')){
            return;//no dejo cambiar el valor si es form_ver
        }

        const canal_venta_val = btn.dataset.value;

        if(canal_venta_val == canal_venta_anterior_val){
            console.log('es el click sobre el mismo valor. no hago nada');
            return;
        }
        meterValor('canal_venta', eid_d_canal_venta, canal_venta_val);
        pintDivSelected('d_canal_venta', eid_d_canal_venta, canal_venta_val);

        canal_venta_anterior_val = canal_venta_val;
    }

    //al cargar el formulario
    pintDivSelected('d_canal_venta', eid_d_canal_venta, objPedido.canal_venta);


    let canal_aviso_anterior_val = objPedido.canal_aviso;//por defecto

    //canal_aviso
    const eid_d_canal_aviso = form_pedido.querySelector('#d_canal_aviso');
    eid_d_canal_aviso.onclick = (e) => {
        console.log('e.currentTarget: ', e.currentTarget);
        console.log('e.target: ', e.target);

        const contenedor_dbtns = e.currentTarget;
        const btn = e.target;

        if(contenedor_dbtns.classList.contains('solo_ver')){
            return;//no dejo cambiar el valor si es form_ver
        }

        const canal_aviso_val = btn.dataset.value;

        if(canal_aviso_val == canal_aviso_anterior_val){
            console.log('es el click sobre el mismo valor. no hago nada');
            return;
        }

        meterValor('canal_aviso', eid_d_canal_aviso, canal_aviso_val);
        pintDivSelected('d_canal_aviso', eid_d_canal_aviso, canal_aviso_val);

        canal_aviso_anterior_val = canal_aviso_val;
    }

    //al cargar el formulario
    pintDivSelected('d_canal_aviso', eid_d_canal_aviso, objPedido.canal_aviso);



    //estado_pedido
    const eid_estado_pedido = form_pedido.querySelector('#estado_pedido');
    const eid_wr_estado_pedido = form_pedido.querySelector('#wr_estado_pedido');
    eid_estado_pedido.value = objPedido?.estado_pedido || '';
    eid_estado_pedido.onchange = async (e) => {
        pintContenedorEstado(eid_wr_estado_pedido, eid_estado_pedido.value);

        if(e.currentTarget.value === 'entregado'){
            //pongo que la taquilla está libre. los cambios se hacen al guardar
            input_id_taquilla.value = '';//reset
            eid_contenedor_taquillas_asignar.classList.add('d-none');
            
            eid_contenedor_una_taquilla_asignada.innerHTML = '';//reset

            const d_prim = document.createElement('div');
            d_prim.className = 'prim';
            d_prim.textContent = '(no asignada)';
            eid_contenedor_una_taquilla_asignada.append(d_prim);
        }
    }

    //estado_pago
    const eid_estado_pago = form_pedido.querySelector('#estado_pago');
    const eid_wr_estado_pago = form_pedido.querySelector('#wr_estado_pago');
    eid_estado_pago.value = objPedido?.estado_pago || '';
    eid_estado_pago.onchange = async (e) => {
        pintContenedorEstado(eid_wr_estado_pago, eid_estado_pago.value);
    }

    //metodo_pago
    const eid_metodo_pago = form_pedido.querySelector('#metodo_pago');
    const eid_wr_metodo_pago = form_pedido.querySelector('#wr_metodo_pago');
    eid_metodo_pago.value = objPedido?.metodo_pago || '';
    eid_metodo_pago.onchange = async (e) => {
        pintContenedorEstado(eid_wr_metodo_pago, eid_metodo_pago.value);
    }



    //añado action onclick a wr_img_editar_en_ver
    const element_wr_img_editar_en_ver = form_pedido.querySelector('.wr_img_editar_en_ver');
    if(element_wr_img_editar_en_ver){
        element_wr_img_editar_en_ver.onclick = () => {
            openModal('full','Editar Pedido actual',null,'buildPedido',true,'editar');
        }
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(pedido_action)){ 
        contenedor = contenedor_pedido_sm;        
    }else{
        contenedor = form_pedido;
        if(pedido_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}


function crearTaquillaAsignada(id_taquilla, t_nombre, estado_taquilla){
    console.log('=== function crearTaquillaAsignada() ===');
    

    const taq = document.createElement('div');
    taq.className = `kvadrat ${estado_taquilla}`;
    taq.dataset.id_taquilla = id_taquilla;
    taq.innerHTML = `
        <div class="wr_close_taq">
            <span class="close">✕</span>
        </div>
        <div class="n_taq">${t_nombre}</div>
    `;
    taq.onclick= (e) => {
        console.log('taq.onclick');

        if(e.target.closest('.wr_close_taq')){//click sobre 'X' de cerrar taquilla
            
            const input_id_taquilla = document.querySelector('#form_pedido #id_taquilla');
            const eid_contenedor_una_taquilla_asignada = document.querySelector('#form_pedido #contenedor_una_taquilla_asignada');
            const eid_dbtn_asignar_taquilla = document.querySelector('#form_pedido #dbtn_asignar_taquilla');
            const eid_contenedor_taquillas_asignar = document.querySelector('#form_pedido #contenedor_taquillas_asignar');       

            if(input_id_taquilla) {
                input_id_taquilla.value = '';
            }

            taq.remove();

            if(eid_contenedor_una_taquilla_asignada){
                const d_prim = document.createElement('div');
                d_prim.className = 'prim';
                d_prim.textContent = '(no asignada)';
    
                eid_contenedor_una_taquilla_asignada.append(d_prim);
            }
            
            if(eid_contenedor_taquillas_asignar && eid_dbtn_asignar_taquilla){
                ocultarContenedor(eid_contenedor_taquillas_asignar.id, eid_dbtn_asignar_taquilla.id, tipo_display = 'flex');
            }
            
        }
    }

    return taq;
}






function crearDivItem(obj){
    console.log('=== function crearDivItem() ===');
    
    let cantidad_text = '';
    
    if(obj.tipo_concepto == 'producto'){
        cantidad_text = 'm';
    }else{//bono, servicio
        cantidad_text = (Number(obj.cantidad) == 1) ? 'ud.' : 'uds.' ;
    }

    const div_item = document.createElement('div');
    div_item.className = `div_item`;
    div_item.dataset.tipo_concepto = obj.tipo_concepto;
    div_item.dataset.id_item = obj.id;
    div_item.dataset.nombre = obj.nombre;
    div_item.dataset.precio = obj.precio;
    div_item.dataset.cantidad = obj.cantidad;
    div_item.innerHTML = `
        <div class="d_art_row">
            <div class="datos_item datos_art">
                <div class="wr_id_nombre">
                    <div class="da_nombre">${obj.nombre}</div>
                </div>
            </div>

            <div class="wr_datos">
                <div class="art_cols art_col2 wr_cantidad_item">
                    <div class="cantidad_valor">${obj.cantidad} ${cantidad_text}</div>
                </div>

                <div class="art_cols art_col3 wr_precio_item">
                    <div class="precio_valor">${obj.precio.toFixed(2)} €</div>
                </div>

                <div class="art_cols art_col4 wr_importe_item">
                    <div class="importe_valor">${obj.importe.toFixed(2)} €</div>
                </div>
            </div>
        
            <div class="wr_close_item">
                <span class="close">✕</span>
            </div>
        </div>
    `;

    div_item.onclick= (e) => {
        console.log('div_item.onclick');

        //si el contenedor es de solo ver, no permito el click. 
        if(div_item.closest('#wr_items_pedido.solo_ver')){
            return;
        }
        
        // Eliminar artículo del pedido
        // Click en X para eliminar el div_item del pedido
        if(e.target.closest('.wr_close_item')){//click sobre 'X' de cerrar div_item
            const id_item = div_item.dataset.id_item;
            const tipo_concepto = div_item.dataset.tipo_concepto;

            pedido.arr_items_pedido = pedido.arr_items_pedido.filter(
                item =>
                    String(item.id) !== String(id_item) ||
                    item.tipo_concepto !== tipo_concepto
            );

            div_item.remove();
            calcularSubtotal();

            // Mostrar mensaje si la lista queda vacía
            if (pedido.arr_items_pedido.length === 0) {
                const d_prim = document.createElement('div');
                d_prim.className = 'prim';
                d_prim.textContent = 'Lista de elementos de pedido vacía.';

                contenedor_lista_items.append(d_prim);
            }

            return;
        }

        // Abrir o cerrar el menú para modificar cantidad
        // Click en la cantidad de metros SOLO en producto
        if (e.target.closest('.wr_cantidad_item')) {

            // Menú que ya está abierto en este artículo
            const menu_actual = div_item.querySelector('.wr_btns_menos_mas');

            // Si ya existe, lo cierro
            if (menu_actual) {
                menu_actual.remove();
                return;
            }

            // Cerrar otros menús abiertos
            removeElementosAll('.wr_btns_menos_mas');

            let cl_row_sm = (div_item.dataset.tipo_concepto === 'producto') ? 'd-flex' : 'd-none';

            // Creo el menú de manejar cantidad
            const wr_btns_menos_mas = document.createElement('div');
            wr_btns_menos_mas.className = 'wr_btns_menos_mas';
            wr_btns_menos_mas.innerHTML = `
                <div class="row row_big">
                    <div class="dbtn" data-action="valor_menos">-</div>
                    <div class="dbtn" data-action="valor_mas">+</div>
                </div>

                <div class="row row_sm ${cl_row_sm}">
                    <div class="dbtn" data-action="decivalor_menos">0.1 -</div>
                    <div class="dbtn" data-action="decivalor_mas">0.1 +</div>
                </div>
            `;

            // 2. El menú gestiona sus propios botones
            // Click en un botón del menú de cantidad -/+
            wr_btns_menos_mas.onclick = (e) => {

                const btn = e.target.closest('[data-action]');

                if (!btn) return;

                switch (btn.dataset.action) {

                    case 'valor_menos':
                        cambiarValor(div_item, -1);
                        break;

                    case 'valor_mas':
                        cambiarValor(div_item, 1);
                        break;

                    case 'decivalor_menos':
                        cambiarValor(div_item, -0.1);
                        break;

                    case 'decivalor_mas':
                        cambiarValor(div_item, 0.1);
                        break;
                }

            };

            div_item.append(wr_btns_menos_mas);

        }
        
    }

    return div_item;
}

function removeElementosAll(selectorElement) {//quita/elimina todos los elementos del DOM con selectorElement
    document.querySelectorAll(`${selectorElement}`).forEach(element => {
        element?.remove();
    });
}


function cambiarValor(contenedor, incremento) {
    console.log('=== function cambiarValor() ===');

    const tipo_concepto = contenedor.dataset.tipo_concepto;
    const id_item = contenedor.dataset.id_item;

    // Buscar el artículo en el array único
    const item = pedido.arr_items_pedido.find(
        item =>
            String(item.id) === String(id_item) &&
            item.tipo_concepto === tipo_concepto
    );

    if (!item) return;

    // Obtener cantidad actual (metros o unidades)
    let cantidad_item = parseFloat(item.cantidad) || 1;

    cantidad_item = Math.round((cantidad_item + incremento) * 10) / 10;

    // No permitir valores inferiores a 1
    cantidad_item = Math.max(1, cantidad_item);

    const precio_item = Number(item.precio);

    // Actualizar artículo, importe y subtotal
    calcularImporteItem(contenedor, cantidad_item, precio_item);
    calcularSubtotal();
}


function calcularImporteItem(contenedor, cantidad, precio) {
    console.log('=== function calcularImporteItem() ===');

    const cantidad_val = parseFloat(cantidad) || 1;
    const precio_val = parseFloat(precio);
    const importe_val = cantidad_val * precio_val;

    let cantidad_text = '';
    
    if (contenedor.dataset.tipo_concepto === 'producto') {
        cantidad_text = 'm';
    } else {
        cantidad_text = (Number(cantidad_val) === 1) ? 'ud.' : 'uds.';
    }
    
    // Actualizar DOM
    const elemento_cantidad = contenedor.querySelector('.cantidad_valor');
    if (elemento_cantidad) {
        elemento_cantidad.textContent = `${cantidad_val} ${cantidad_text}`;
    }

    const elemento_precio = contenedor.querySelector('.precio_valor');
    if (elemento_precio) {
        elemento_precio.textContent = `${precio_val.toFixed(2)} €`;
    }

    const elemento_importe = contenedor.querySelector('.importe_valor');
    if (elemento_importe) {
        elemento_importe.textContent = `${importe_val.toFixed(2)} €`;
    }

    // Actualizar objeto pedido
    const id_item = contenedor.dataset.id_item;
    const tipo_concepto_item = contenedor.dataset.tipo_concepto;

    const item_pedido = pedido.arr_items_pedido.find(
        item =>
            String(item.id) === String(id_item) &&
            item.tipo_concepto === tipo_concepto_item
    );

    if (item_pedido) {
        item_pedido.cantidad = cantidad_val;
        item_pedido.precio = precio_val;
        item_pedido.importe = importe_val;
    }  

    return importe_val;
}




function calcularSubtotal() {
    console.log('=== function calcularSubtotal() ===');

    // Sumar los subtotales de productos y servicios
    const subtotal_items = pedido.arr_items_pedido.reduce(
        (total, item) => total + (parseFloat(item.importe) || 0),
        0
    );

    // const subtotal_productos = pedido.productos.reduce(
    //     (total, item) => total + (parseFloat(item.importe) || 0),
    //     0
    // );

    // const subtotal_bonos = pedido.bonos.reduce(
    //     (total, item) => total + (parseFloat(item.importe) || 0),
    //     0
    // );

    // const subtotal_servicios = pedido.servicios.reduce(
    //     (total, item) => total + (parseFloat(item.importe) || 0),
    //     0
    // );

    // Subtotal general
    pedido.subtotal = Math.round(
        // (subtotal_productos + subtotal_bonos + subtotal_servicios) * 100
        subtotal_items * 100
    ) / 100;

    //si hay que contar con iva
    if(pedido.iva_incluido){
        
        // Calcular IVA (21 %)
        pedido.iva_total = Math.round(
            pedido.subtotal * 0.21 * 100
        ) / 100;

        // Total con IVA
        pedido.total = Math.round(
            (pedido.subtotal + pedido.iva_total) * 100
        ) / 100;
    
    }else{
        pedido.iva_total = 0;
        pedido.total = pedido.subtotal;
    }



    // Actualizar DOM
    const sp_subtotal = document.querySelector('#contenedor_totales .sp_subtotal');
    const sp_iva_total = document.querySelector('#contenedor_totales .sp_iva_total');
    const sp_total = document.querySelector('#contenedor_totales .sp_total');

    const input_subtotal = document.querySelector('#subtotal');
    const input_iva_total = document.querySelector('#iva_total');
    const input_total = document.querySelector('#total');


    
    //subtotal
    if (sp_subtotal) {
        sp_subtotal.textContent = `${pedido.subtotal.toFixed(2)} €`;
    }
    if (input_subtotal) {
        input_subtotal.value = pedido.subtotal.toFixed(2);
    }

    //iva_total
    if (sp_iva_total) {
        sp_iva_total.textContent = `${pedido.iva_total.toFixed(2)} €`;
    }
    if (input_iva_total) {
        input_iva_total.value = pedido.iva_total.toFixed(2);
    }

    //total
    if (sp_total) {
        sp_total.textContent = `${pedido.total.toFixed(2)} €`;
    }
    if (input_total) {
        input_total.value = pedido.total.toFixed(2);
    }

    return pedido;
}





function pintDivSelected(id_div, contenedor, valor, class_element = 'dbtn'){
    console.log('=== function pintDivSelected() ===');

    if(!arr_divs_permitidos.includes(id_div) || !contenedor || [null, undefined, ''].includes(valor)){
        return;
    }

    const elementosAll = contenedor.querySelectorAll(`.${class_element}`);

    elementosAll.forEach(elemento => {
        if(elemento.dataset.value == valor){
            elemento.classList.add('active');
        } else {
            elemento.classList.remove('active');
        }
    });

}


function meterValor(nombre_valor, contenedor, valor){//nombre_valor: 'canal_venta','canal_aviso',
    console.log('=== function meterValor() ===');

    console.log('nombre_valor: ', nombre_valor);
    console.log('contenedor: ', contenedor);
    console.log('valor: ', valor);    

    if(!arr_valores_permitidos.includes(nombre_valor) || !contenedor || [null, undefined, ''].includes(valor)){
        return;
    }

    const dbtnAll = contenedor.querySelectorAll('.dbtn');
    dbtnAll.forEach(dbtn => {
        if(dbtn.dataset.value == valor){
            dbtn.classList.add('active');
        } else {
            dbtn.classList.remove('active');
        }
    });

    if(contenedor.id === `d_${nombre_valor}`){//'d_canal_venta','d_canal_aviso'
        const input_canal = document.querySelector(`#${nombre_valor}`);
        if(input_canal){
            input_canal.value = valor;
        }
    }    
    
    //iva_incluido
    if(contenedor.id === `d_iva_incluido`){
        const d_subtotal = document.querySelector(`#contenedor_totales .d_subtotal`);
        const d_iva_total = document.querySelector(`#contenedor_totales .d_iva_total`);

        if(d_subtotal && d_iva_total){
            if(valor == 1){
                pedido.iva_incluido = 1;
                d_subtotal.classList.toggle('d-none',false);
                d_iva_total.classList.toggle('d-none',false);
            }else{
                pedido.iva_incluido = 0;
                d_subtotal.classList.toggle('d-none',true);
                d_iva_total.classList.toggle('d-none',true);    
            }
        }
        calcularSubtotal();
    }    
}




async function guardarPedido(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarPedido() ===');
    
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

        const form_pedido = document.getElementById('form_pedido');

        const id_cliente = form_pedido?.querySelector('#id_cliente').value.trim();
        const id_taquilla = form_pedido?.querySelector('#id_taquilla').value.trim();
        const canal_venta = form_pedido?.querySelector('#canal_venta').value.trim();
        const canal_aviso = form_pedido?.querySelector('#canal_aviso').value.trim();
        const fecha_pedido = form_pedido?.querySelector('#fecha_pedido').value.trim();
        const comentario = form_pedido?.querySelector('#comentario').value.trim();
        const estado_pedido = form_pedido?.querySelector('#estado_pedido').value.trim();
        const estado_pago = form_pedido?.querySelector('#estado_pago').value.trim();
        const metodo_pago = form_pedido?.querySelector('#metodo_pago').value.trim();

        // const subtotal = form_pedido?.querySelector('#subtotal').value.trim();
        // const iva_incluido = form_pedido?.querySelector('#iva_incluido').value.trim();
        // const iva_total = form_pedido?.querySelector('#iva_total').value.trim();
        // const total = form_pedido?.querySelector('#total').value.trim();
    
        let errors = [];

        // if(modo_guardar === 'fast'){
        //     nombre = objPedido.nombre;
        // }

        if(id_cliente == ''){
            errors.push('Cliente');
        }
        if(fecha_pedido == ''){
            errors.push('Fecha');
        }
        if(canal_venta == ''){
            errors.push('Canal de venta');
        }
        if(estado_pedido == ''){
            errors.push('Estado de pedido');
        }
        if(estado_pago == ''){
            errors.push('Estado de pago');
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


        const objPedidoToSend = {
            id_pedido: id_pedido || null, //ya que se añade un nuevo pedido, entonces no hay id_pedido
            id_cliente,
            id_taquilla,
            fecha_pedido,
            canal_venta,
            canal_aviso,
            comentario,
            estado_pedido,
            estado_pago,
            metodo_pago,

            // Datos económicos del pedido
            subtotal: pedido.subtotal,
            iva_incluido: pedido.iva_incluido,
            iva_total: pedido.iva_total,
            total: pedido.total,

            // Líneas del pedido
            arr_items: pedido.arr_items_pedido
        }
        console.log('objPedidoToSend: ',objPedidoToSend);
    
        const data = await insertarPedidoDatos(objPedidoToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_pedido':
                    text_show = 'Datos del pedido han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_pedido':
                    text_show = 'Datos del pedido han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_pedido){
                console.log('id_pedido: ', data.id_pedido);
                id_pedido = data.id_pedido;//guardo el id del pedido recién creada

                //Cojo datos del pedido desde BD
                objPedido = await getDataPedidoFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objPedido: ', objPedido);

                const itemPedidoUpdate = objDataPedidos?.arr_data?.find(item => item.id_pedido == id_pedido);
                if (itemPedidoUpdate) {//es update del pedido existente
    
                    Object.assign(itemPedidoUpdate, objPedido);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintPedidoActiveSoloDatos();//en el contenedor_pedidos

                } else {//es insert del pedido nuevo
    
                    console.warn('No encontrado objPedido.id_pedido en objDataPedidos.arr_data');
                    //entonces es un pedido nuevo que se crea

                    //1.debo añadir objPedido en objDataPedidos.arr_data al inicio (si existe!)
                    objDataPedidos?.arr_data?.unshift(objPedido);

                    //2.debo aumentar el numero de total pedidos (si existe!)
                    if (objDataPedidos?.totalRows != null){
                        objDataPedidos.totalRows++;
                    }

                    //3. old -> debo pintar d_pedido en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintPedidoOne(objPedido, 'arriba');//div de pedido se pinta al inicio (arriba)
                    await loadPedidosAll();
                }

                //actualizo Taquillas y obj y DOM
                await loadTaquillasAll();

                closeModal(null,true);
            }
           
        }else{

            let text_show = `Error al guardar el pedido: ${data.error}`;
            console.log(text_show);

            showToast('error', text_show, 1000, 'center', true, 'Error');

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarPedido(). error: ',error);
    }

}

async function insertarPedidoDatos(objPedido) {
    console.log('=== function insertarPedidoDatos(objPedido) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objPedido || Object.keys(objPedido).length == 0){
            alert('No hay todos los parametros necesarios del pedido...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objPedido: ',objPedido);

        const objPedido_str = JSON.stringify(objPedido);
        console.log('objPedido_str: ',objPedido_str);

        const nombre_fichero = 'insertar_datos_pedido_one.php';

        const response = await fetch(`../app/php/datos/pedido/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objPedido_str
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
        console.error('Error en la función insertarPedidoDatos: ', error);
    }
}

async function deletePedido(event){
    console.log('=== function deletePedido() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_pedido = objPedido.id_pedido;
        console.log('id_pedido: ', id_pedido);

        if(!id_pedido){
            alert('id_pedido no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el pedido con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_pedido}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objPedido.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Teléfono:</span> ${escaparHTML(objPedido.telefono) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Comentario:</span> ${escaparHTML(objPedido.comentario) || '(sin comentario)'}</p> 
            <p><span class="cl_campo">Total:</span> ${escaparHTML(objPedido.total) || '--'} €</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar pedido',
            pregunta,
            'confirmDelete',
            true,
            id_pedido
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el pedido...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deletePedidoFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Pedido eliminado con éxito.';
            console.log(text_show);

            if(data.id_pedido){
                console.log('id_pedido: ', data.id_pedido);

                const totalAntes = objDataPedidos.arr_data.length;

                //elimino el objeto del pedido eliminado desde objeto de todos los pedidos encontrados usando filter
                objDataPedidos.arr_data = objDataPedidos.arr_data.filter(
                    item => item.id_pedido !== id_pedido
                );

                const totalDespues = objDataPedidos.arr_data.length;
                const pedido_is_deleted = totalDespues < totalAntes;

                if(pedido_is_deleted){
                    console.log('pedido eliminado de objDataPedidos');
                }else{
                    console.log('pedido NO eliminado de objDataPedidos');
                }

                //Elimino elemento d_pedido de los pedidos encontrados en 'contenedor_pedidos'
                eid_contenedor_pedidos.querySelector(`.d_pedido[data-id_pedido="${id_pedido}"]`).remove();
                eid_block_pedidos.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_pedido = null;
                objPedido = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                loadPedidosAll();

                //actualizo taquillas
                loadTaquillasAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar el pedido.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deletePedido. error: ',error);        
    }

}

async function deletePedidoFromBd(){
    console.log('=== function deletePedidoFromBd() ===');

    try {
        
        if(!hay_id(id_pedido, 'id_pedido', 'deletePedidoFromBd()')){
            return; // <- se detiene aquí si no hay id_pedido
        }

        const nombre_fichero = 'eliminar_datos_pedido_one.php';
               
        const response = await fetch(`../app/php/datos/pedido/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_pedido: id_pedido
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
                console.log(`[ELIMINADO] id_pedido: [${data.id_pedido}] --- nombre: [${data.nombre}]`);
    
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
        console.error('Error en deletePedidoFromBd(): error.message: ', error.message);
    }
}


function pintPedidoActive(){//click en div del contenedor de pedidos que ya están en el DOM
    console.log('=== function pintPedidoActive(e) === ');

    console.log('asignado global --- id_pedido: ', id_pedido);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_pedidos, 'd_pedido');
    eid_contenedor_pedidos.querySelector(`.d_pedido[data-id_pedido="${id_pedido}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_pedido viene como string: "925"
    objPedido = objDataPedidos.arr_data.find(v => v.id_pedido == id_pedido);
    console.log('objPedido: ', objPedido);

    pintPedidoActiveSoloDatos();

}

async function loadPedidosAll(){
    console.log('=== function loadPedidosAll() === ');

    objDataPedidos = await getPedidosAll();

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
        f_frase: '(Todos pedidos)',
        f_num: objDataPedidos?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_pedidos, objDataPint);
    
    pintPedidosAll();

}

async function pintPedidosAll(){//pintar todos los div de pedidos, o al load o al find
    console.log('=== function pintPedidosAll() === '); 
    
    console.time('time_pintPedidosAlll');

    // if(!objDataPedidos?.arr_data?.length){//si length === 0, entonces no hay pedidos
    //     console.warn('No hay pedidos en objDataPedidos.arr_data');
    //     return;
    // }

    eid_contenedor_pedidos.innerHTML = '';//reset contenedor de pedidos

    const hay_datos = (esObjeto(objDataPedidos) && objDataPedidos.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_pedidos.innerHTML = `
            <p class="prim">No existe ningún registro de pedido en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataPedidos: ', objDataPedidos);        
        
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
        //Recorrer pedidos encontradas... 
        objDataPedidos.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintPedidoOne(obj, 'abajo');//cada div de pedido se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintPedidosAlll');
   
}


function pintPedidoOne(objPedidoOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un pedido, o al load, o al crear, o al find
    console.log('=== function pintPedidoOne() === ');

    if(!objPedidoOne){
        console.warn('No hay objeto de pedido. no lo puedo pintar');
        return;
    }
    
    const diaSemana_val = convertirToTitleCase(getDiaSemana(objPedidoOne.fecha_pedido));
    const fecha_bd = fechaMySQLLocal('solo_fecha', objPedidoOne.fecha_pedido);
    const fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
    const hora_val = fechaMySQLLocal('solo_hora_corta', objPedidoOne.fecha_pedido);
    
    const subtotal_text = (objPedidoOne.subtotal) ? `${objPedidoOne.subtotal} €` : '--' ;
    const iva_total_text = (objPedidoOne.iva_total) ? `${objPedidoOne.iva_total} €` : '--' ;
    const total_text = (objPedidoOne.total) ? `${objPedidoOne.total} €` : '--' ;

    let cl_iva_incluido = (objPedidoOne.iva_incluido) ? '' : 'd-none';
    let cl_wr_kvadrat = '';
    let cl_da_kvadrat = '';
    let da_kvadrat_html = '';

    const condicion_tiene_taquilla_ocupada = (objPedidoOne.id_taquilla && objPedidoOne.estado_taquilla == 'ocupado');
    const condicion_esta_entregado = (objPedidoOne.estado_pedido == 'entregado');

    if(condicion_tiene_taquilla_ocupada || condicion_esta_entregado ){
        cl_wr_kvadrat = '';
        if(condicion_tiene_taquilla_ocupada){
            cl_da_kvadrat = 'ocupado';
            da_kvadrat_html = objPedidoOne.t_nombre;
        }        
        if(condicion_esta_entregado){
            da_kvadrat_html = `<img class="btn_img" src="./images/icon_ok_green.svg">`;
        }
    }else{
        cl_wr_kvadrat = 'd-none';
    }


    const d_pedido = document.createElement('div');
    d_pedido.className = 'd_pedido d_art';
    d_pedido.dataset.id_pedido = objPedidoOne.id_pedido;
    d_pedido.dataset.id_cliente = objPedidoOne.id_cliente;
    d_pedido.dataset.tipo_art = 'pedido';
    d_pedido.innerHTML = `
        <div class="datos_pedido datos_art">
            <div class="da_diasem">${diaSemana_val}</div>
            <div class="da_fechahora">
                <div class="da_fecha">${fecha_val}</div>
                <div class="da_hora">${hora_val}</div>
            </div>
            <div class="da_nombre">${escaparHTML(objPedidoOne.nombre) || '(nombre no asignado)'} </div>
            <div class="da_tel">${escaparHTML(objPedidoOne.telefono)}</div>
        </div>

        <div class="wr_datos">
            <div class="art_cols art_col2 wr_kvadrat ${cl_wr_kvadrat}">
                <div class="da_kvadrat ${cl_da_kvadrat}">${da_kvadrat_html}</div>
            </div>
            <div class="art_cols art_col3 wr_bola">
                <div class="da_bola ${objPedidoOne.estado_pago}">€</div>
            </div>
        </div>

        <div class="art_cols art_col4">
            <div class="da_subtotal ${cl_iva_incluido}">${subtotal_text}</div>
            <div class="da_iva_total ${cl_iva_incluido}">${iva_total_text}</div>
            <div class="da_total">${total_text}</div>
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

    d_pedido.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_pedido = e.currentTarget.dataset.id_pedido;
        console.log('asigno global --- id_pedido: ', id_pedido); 

        // siempre al clicar en cualquier parte del d_pedido se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintPedidoActive();
        

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

            //clic dentro de d_pedido y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_pedido y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_pedido - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Pedido actual',null,'buildPedido',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Pedido actual',null,'buildPedido',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Pedido actual',null,'buildPedido',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_pedidos.append(d_pedido);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_pedidos.prepend(d_pedido);
    }
}


async function findWordsPedido(){
    console.log('=== async function findWordsPedido() ===');
    console.time('time_findWordsPedido');

    const eid_inpt_find_pedido = document.getElementById('inpt_find_pedido');
    const eid_modo_pedido = document.getElementById('modo_pedido');
    const eid_buscar_en_pedido = document.getElementById('buscar_en_pedido');
    const eid_regs_finded_pedido = document.getElementById('regs_finded_pedido');

    let words_input_trimed = eid_inpt_find_pedido.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_pedido.value;
    let buscar_en = eid_buscar_en_pedido.value;
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

    objFindParamsPedido.words_input = words_input;
    objFindParamsPedido.modo = modo;
    objFindParamsPedido.buscar_en = buscar_en;
    objFindParamsPedido.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataPedidosFinded = await getDataPedidosFromBdByFind(objFindParamsPedido);
    console.log('objDataPedidosFinded: ', objDataPedidosFinded);   

    
    const hay_coincidencias = (esObjeto(objDataPedidosFinded) && objDataPedidosFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsPedido.findedRows = 0;

        eid_regs_finded_pedido.classList.remove('d-none');
        eid_regs_finded_pedido.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay pedidos...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsPedido.findedRows = objDataPedidosFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_pedido.classList.remove('d-none');
        eid_regs_finded_pedido.innerHTML = `
            <div class="wr_num_regs">
                <div class="title_regs_finded">Registros encontrados: </div>
                <div class="num_regs_finded">${objDataPedidosFinded.arr_data.length}</div>
            </div>
            <button id="btn_mostrar_finded_pedido" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_pedido.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_pedido') {
                console.log('clic en btn_mostrar_finded_pedido');
                console.log('mostrar clicked -> reasigno objDataPedidos desde objDataPedidosFinded'); 
                
                //Clono objeto
                objDataPedidos = structuredClone(objDataPedidosFinded);
                console.log('objDataPedidos: ', objDataPedidos);



                const modo_val = objModoBusquedaPedido[`modo${objFindParamsPedido.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaPedido[`buscar_en${objFindParamsPedido.buscar_en}`].titulo;

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
                    f_frase: objFindParamsPedido.words_input,
                    f_num: objFindParamsPedido.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_pedidos, objDataPint);               
                                
                pintPedidosAll();
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

    await update_objFindParamsPedido();

    console.timeEnd('time_findWordsPedido');
}


async function getPedidosAll(){
    console.log('=== async function getPedidosAll() ===');
    console.time('time_getPedidosAll');

    objDataPedidosBd = await getDataPedidosAllFromBd();//la funcion que saca todos los pedido para pintarlo
    console.log('objDataPedidosBd: ', objDataPedidosBd);

    console.timeEnd('time_getPedidosAll');

    return objDataPedidosBd;

}


async function crear_objDataPedidos(){
    console.log('=== function crear_objDataPedidos() ===');
    console.time('time_crear_objDataPedidos');

    objDataPedidos = await getDataPedidosAllFromBd();
    console.log(`objDataPedidos: `, objDataPedidos);

    console.timeEnd('time_crear_objDataPedidos');
}

async function getDataPedidosAllFromBd(){//sacar TODOS los pedidos para rellenar contenedor_pedidos
    console.log('=== function getDataPedidosAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_pedidos_all.php';
        
        const response = await fetch(`../app/php/datos/pedido/${nombre_fichero}`, {
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
        console.error('Error en getDataPedidosAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarPedido(){
    console.log('=== function buildBuscarPedido() ===');

    console.log('objPedido: ', objPedido);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_pedido"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsPedido?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_pedido')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsPedido()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_pedido" class="sel_opt_find">
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
            <select id="buscar_en_pedido" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de pedido</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_pedido" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_pedido');
    
    //modo
    const eid_modo_pedido = wr_args_busqueda.querySelector('#modo_pedido');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsPedido
    eid_modo_pedido.value = objFindParamsPedido?.modo || 1 ;

    eid_modo_pedido.onchange = async (e) => {
        findWordsPedido();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaPedido[`modo${objFindParamsPedido.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaPedido[`modo${objFindParamsPedido.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_pedido = wr_args_busqueda.querySelector('#buscar_en_pedido');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsPedido
    eid_buscar_en_pedido.value = objFindParamsPedido?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaPedido[`buscar_en${objFindParamsPedido.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaPedido[`buscar_en${objFindParamsPedido.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_pedido.onchange = async (e) => {
        findWordsPedido();
    }


    //al teclear texto en la busqueda de pedido
    let timeoutFindPedido;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindPedido);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindPedido = setTimeout(async () => {
            await findWordsPedido();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataPedidosFromBdByFind(objFindParamsPedido){
    console.log('=== function getDataPedidosFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsPedido;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_pedidos_by_find.php';
               
        const response = await fetch(`../app/php/datos/pedido/${nombre_fichero}`, {
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
        console.error('Error en getDataPedidosFromBdByFind(): error.message: ', error.message);
    }
}


function pintPedidoActiveSoloDatos(){
    console.log('=== function pintPedidoActiveSoloDatos() === ');

    if(!objPedido){
        alert('no hay objPedido');
        return;
    }

    const d_pedido = eid_contenedor_pedidos.querySelector(`.d_pedido[data-id_pedido="${objPedido.id_pedido}"]`);
    console.log('d_pedido: ', d_pedido);
    
    if(!d_pedido){
        console.log('no hay d_pedido. no actualizo d_pedido...');
        return;
    }

    //elementos
    const div_da_diasem = d_pedido.querySelector('.da_diasem');
    const div_da_fecha = d_pedido.querySelector('.da_fecha');
    const div_da_hora = d_pedido.querySelector('.da_hora');

    const div_da_nombre = d_pedido.querySelector('.da_nombre');
    const div_da_tel = d_pedido.querySelector('.da_tel');
    
    const div_wr_kvadrat = d_pedido.querySelector('.wr_kvadrat');
    const div_da_kvadrat = d_pedido.querySelector('.da_kvadrat');

    const div_da_bola = d_pedido.querySelector('.da_bola');

    const div_da_subtotal = d_pedido.querySelector('.da_subtotal');
    const div_da_iva_total = d_pedido.querySelector('.da_iva_total');
    const div_da_total = d_pedido.querySelector('.da_total');

    //datos
    const diaSemana_val = convertirToTitleCase(getDiaSemana(objPedido.fecha_pedido));
    const fecha_bd = fechaMySQLLocal('solo_fecha', objPedido.fecha_pedido);
    const fecha_val = convertirFecha(fecha_bd, 'ver','.');//de '2026-10-18' a '18.10.2026'
    const hora_val = fechaMySQLLocal('solo_hora_corta', objPedido.fecha_pedido);

    const subtotal_text = (objPedido.subtotal) ? `${objPedido.subtotal} €` : '--' ;
    const iva_total_text = (objPedido.iva_total) ? `${objPedido.iva_total} €` : '--' ;
    const total_text = (objPedido.total) ? `${objPedido.total} €` : '--' ;

    let cl_iva_incluido = (objPedido.iva_incluido) ? '' : 'd-none';
    let cl_wr_kvadrat = '';
    let cl_da_kvadrat = '';
    let da_kvadrat_html = '';

    const condicion_tiene_taquilla_ocupada = (objPedido.id_taquilla && objPedido.estado_taquilla == 'ocupado');
    const condicion_esta_entregado = (objPedido.estado_pedido == 'entregado');

    if(condicion_tiene_taquilla_ocupada || condicion_esta_entregado ){
        cl_wr_kvadrat = '';
        if(condicion_tiene_taquilla_ocupada){
            cl_da_kvadrat = 'ocupado';
            da_kvadrat_html = objPedido.t_nombre;
        }        
        if(condicion_esta_entregado){
            da_kvadrat_html = `<img class="btn_img" src="./images/icon_ok_green.svg">`;
        }
    }else{
        cl_wr_kvadrat = 'd-none';
    }


    //diasemana
    div_da_diasem.textContent = diaSemana_val;
    div_da_diasem.classList.remove('d-none');//muestro tenga o no diasemana

    //nombre
    div_da_nombre.textContent = objPedido.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //telefono
    div_da_tel.textContent = objPedido.telefono || '(nombre no asignado)';
    div_da_tel.classList.toggle('d-none', !objPedido.telefono);//si tiene -> lo muestra, si no tiene -> oculta

    //taquilla
    div_wr_kvadrat.className = `art_cols art_col2 wr_kvadrat ${cl_wr_kvadrat}`;
    div_da_kvadrat.className = `da_kvadrat ${cl_da_kvadrat}`;//muestro bg rojo solo con ocupado
    div_da_kvadrat.innerHTML = `
        ${da_kvadrat_html}
    `;

    //estado_pago
    div_da_bola.className = `da_bola ${objPedido.estado_pago}`;//muestro bola con bg color

    //subtotal
    div_da_subtotal.textContent = subtotal_text;
    //div_da_subtotal.classList.remove('d-none');//muestro tenga o no el subtotal
    div_da_subtotal.classList.toggle('d-none', !objPedido.iva_incluido);

    //iva_total
    div_da_iva_total.textContent = iva_total_text;
    //div_da_iva_total.classList.remove('d-none');//muestro tenga o no el subtotal
    div_da_iva_total.classList.toggle('d-none', !objPedido.iva_incluido);

    //total
    div_da_total.textContent = total_text;
    div_da_total.classList.remove('d-none');//muestro tenga o no el subtotal

    //comentario
    //div_da_com.textContent = objPedido.comentario || '(sin comentario)';
    //si '!objPedido.comentario' es true  (no tiene comentario) -> pone  'd-none' -> oculta
    //si '!objPedido.comentario' es false (sí tiene comentario) -> quita 'd-none' -> muestra
    //div_da_com.classList.toggle('d-none', !objPedido.comentario);

}

async function getDataPedidoFromBd(){
    console.log('=== function getDataPedidoFromBd() ===');

    try {
        
        if(!hay_id(id_pedido, 'id_pedido', 'getDataPedidoFromBd()')){
            return; // <- se detiene aquí si no hay id_pedido
        }

        const nombre_fichero = 'obtener_datos_pedido_one.php';
     
        const response = await fetch(`../app/php/datos/pedido/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_pedido: id_pedido
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

                console.log(`id_pedido: [${id_pedido}] --- nombre: [${data.nombre}]`);

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
        console.error('Error en getDataPedidoFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsPedido(){
    console.log('=== function update_objFindParamsPedido() ===');

    obj_ajustes.objFindParamsPedido = objFindParamsPedido;
    await update_obj_ajustes();
}