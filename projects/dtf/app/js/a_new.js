function buildCliente(cliente_action = null){
    console.log('=== function buildCliente() ===');

    console.log('cliente_action: ', cliente_action);
    console.log('objCliente: ', objCliente);

    eid_bl_modalFullInner.innerHTML = '';//reset

    // Formato YYYY-MM-DD que necesita <input type="date">
    const fecha_hoy = new Date().toISOString().split("T")[0];

    let id_cliente_val = '';
    let nombre_val = '';
    let telefono_val = '';
    let codigo_cliente_val = '';
    let diaSemana_val = '';
    let fecha_val = fecha_hoy;
    let comentario_val = '';
    let mensaje_html = '';
    let cl_id_cliente = 'd-none';//oculto
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(cliente_action == 'nuevo'){//si es nueva
        
        //mostrarPrim = false;    
        //ocultarElementosPrimEn(lista_option_inner);
        //ocultarElementosEditablesEn(lista_option_inner);
        //mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit 

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id_cliente('buildCliente()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado a ningún cliente.</p>
                <p class="p_aviso">Crea un cliente pulsando "+".</p>
                <button id="btn_lista" class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('lista');">Buscar Lista</button>
            `;
            openModal('center','Aviso Lista',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_cliente
        } 
        id_cliente_val = objCliente.id_cliente;
        nombre_val = objCliente.nombre;
        telefono_val = objCliente.telefono;
        codigo_cliente_val = objCliente.codigo_cliente;
        comentario_val = objCliente.comentario;
        diaSemana_val = diaSemana(objCliente.fecha);
        fecha_val = convertirFecha(objCliente.fecha, 'ver', '/');
        //fecha_val = objCliente.fecha_ver;//formato ya desde bd '03/08/2025'
    }

    switch (cliente_action) {
        case 'nuevo'://Nueva Cliente
            mensaje_html = `
                <span>Rellena los campos del formulario con los datos del cliente <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_cliente
            if(id_cliente){
                id_cliente = null;//reset ya que se va a crear un id_cliente nuevo
            }else{
                //id_cliente es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objCliente = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            //resetBlockLista();        
            break;
        
        default:
        case 'ver'://Ver Cliente - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_cliente = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            break;

        case 'editar'://Editar Cliente - FORMULARIO
            fecha_val = objCliente.fecha;//formato correcto para el input '2025-08-03'
            mensaje_html = `
                <span class="sp_id">
                    <span>Id: <b class="c_green">${id_cliente}</b></span>
                    <span><b class="actual">(ACTUAL)</b></span>
                </span>
            `;
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Cliente - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_cliente = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'eliminar'
            break;
    }
    


    //Notas (apuntes) si hay - SM
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
        <button class="btn btn_big btn_eliminar" onclick="deleteCliente();">Eliminar Cliente DEFINITIVAMENTE</button>
    `;

    

    //para VER - SM
    const contenedor_cliente_sm = document.createElement('div'); 
    contenedor_cliente_sm.id = 'contenedor_cliente_sm';
    contenedor_cliente_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Cliente <span class="f_r ${cl_id_cliente}">id: ${id_cliente_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx">
                        <span class="cl_campo">Teléfono:</span>
                        <span>${telefono_val}</span>
                    </span>
                    <span class="linea_fx">
                        <span class="cl_campo">Código_cliente:</span>
                        <span>${codigo_cliente_val}</span>
                    </span>

                </span><!--/.detalles_inner-->
            </p>
        </div>

        <div class="parte_lista d-none">
            <p class="p_sm ${cl_id_cliente}">Id: <b>${id_cliente_val}</b></p>
            <p class="p_sm">Fecha: <b>${diaSemana_val} ${fecha_val}</b></p>
        </div>
        

        ${(comentario_val) ? comentario_detalles.outerHTML : '' }
        
        ${(cliente_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarCliente(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_cliente = document.createElement('div');
    form_cliente.id = 'form_cliente';
    form_cliente.innerHTML = `
        <div class="form_container">
            <form>
                
                <p class="mensaje" data-dic="">
                    ${mensaje_html}
                </p>

                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#nombre')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="nombre" type="text" name="nombre" required="" placeholder=" " value="${nombre_val}">
                    <label for="nombre">Nombre del cliente</label>
                </div>
               
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#telefono')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="telefono" type="text" name="telefono" required="" placeholder=" " value="${telefono_val}">
                    <label for="telefono">Teléfono</label>
                </div>

                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#codigo_cliente')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="codigo_cliente" type="text" name="codigo_cliente" required="" placeholder=" " value="${codigo_cliente_val}">
                    <label for="codigo_cliente">Código (4 últ. números)</label>
                </div>
               
                
               

                <div class="form_group wr_fecha d-none">
                    <input type="date" id="fecha" name="fecha" required="" placeholder=" " value="${fecha_val}">
                    <label for="title">Fecha del evento</label>
                </div>


                <div class="form_group">
                    <textarea id="comentario" name="comentario" rows="7" required="" placeholder=" ">${comentario_val}</textarea>
                    <label class="lab_textarea" for="comentario">Comentario</label>
                </div>

                ${ (['nueva','editar'].includes(cliente_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(cliente_action)){ 
        contenedor = contenedor_cliente_sm;        
    }else{
        contenedor = form_cliente;
        if(cliente_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
        //pintGruposOptionsEnSelect(contenedor.querySelector('.d_grupos_select'), id_grupo_val);//relleno select de grupos
    }

    /*
    if(cliente_action == 'sort'){
        buildListaSort(contenedor.querySelector('.d_canciones_lista'), arr_lista_bucle); 
        setTimeout(() => {
            contenedor.querySelector('.d_aviso_sort').classList.remove('shown');
        }, 4000);
    }else{
        buildListaSoloSongs(contenedor.querySelector('.d_canciones_lista'), arr_lista_bucle);        
    }
    */

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}