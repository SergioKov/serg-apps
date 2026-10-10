//cliente
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildCliente(cliente_action = null){
    console.log('=== function buildCliente() ===');

    console.log('cliente_action: ', cliente_action);
    console.log('objCliente: ', objCliente);

    eid_bl_modalFullInner.innerHTML = '';//reset

    // Formato YYYY-MM-DD que necesita <input type="date">
    const fecha_hoy = new Date().toISOString().split("T")[0];
    let diaSemana_val = '';
    let fecha_val = fecha_hoy;

    //campos de input
    let id_cliente_val = '';
    let nombre_val = '';
    let telefono_val = '';
    let codigo_cliente_val = '';
    let comentario_val = '';

    let taquilla_val = '';
    let descuento_val = '';
    let precio_fijo_dtf_val = '';
    let precio_fijo_uv_val = '';
    let saldo_val = '';
        
    //otras vars
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
        
        if(!hay_id(id_cliente, 'id_cliente', 'buildCliente()')){
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
        nombre_val = escaparHTML(objCliente.nombre) || '';
        telefono_val = escaparHTML(objCliente.telefono) || '';
        codigo_cliente_val = escaparHTML(objCliente.codigo_cliente) || '';
        comentario_val = escaparHTML(objCliente.comentario) || '';
        taquilla_val = escaparHTML(objCliente.taquilla) || '';
        descuento_val = escaparHTML(objCliente.descuento) || '';
        precio_fijo_dtf_val = escaparHTML(objCliente.precio_fijo_dtf) || '';
        precio_fijo_uv_val = escaparHTML(objCliente.precio_fijo_uv) || '';
        saldo_val = escaparHTML(objCliente.saldo) || '';
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteCliente(event);">Eliminar Cliente DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_cliente_sm = document.createElement('div'); 
    contenedor_cliente_sm.id = 'contenedor_cliente_sm';
    contenedor_cliente_sm.className = 'contenedor_form_sm';
    contenedor_cliente_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Cliente <span class="f_r ${cl_id_cliente}">id: ${id_cliente_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx">
                        <span class="cl_campo">Teléfono:</span>
                        <span>${telefono_val}</span>
                    </span>
                    <span class="linea_fx ${!codigo_cliente_val ? 'd-none' : ''}">
                        <span class="cl_campo">Código cliente:</span>
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

                <!-- nombre -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#nombre')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="nombre" type="text" name="nombre" required="" placeholder=" " value="${nombre_val}">
                    <label for="nombre">Nombre del cliente</label>
                </div>
               
                <!-- telefono -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#telefono')">
                        <img src="images/x_white.png">
                    </div>
                    <input 
                        id="telefono" 
                        type="tel" 
                        name="telefono"
                        pattern="(?=(?:\D*\d){6})[0-9+() ,]+"
                        inputmode="tel" 
                        required="" placeholder=" " 
                        value="${telefono_val}"
                    >
                    <label for="telefono">Teléfono (obligatorio)</label>
                </div>

                <!-- codigo_cliente -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#codigo_cliente')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="codigo_cliente" type="text" name="codigo_cliente" required="" placeholder=" " value="${codigo_cliente_val}">
                    <label for="codigo_cliente">Código (4 últ. números)</label>
                </div>
               




                <!-- taquilla -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#taquilla')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="taquilla" type="text" name="taquilla" required="" placeholder=" " value="${taquilla_val}">
                    <label for="taquilla">Taquilla</label>
                </div>
               

                
                
                
                <!-- descuento -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#descuento')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="descuento" type="text" name="descuento" required="" placeholder=" " value="${descuento_val}">
                    <label for="descuento">Descuento (Ej.: 10%)</label>
                </div>


                <!-- precio_fijo_dtf -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#precio_fijo_dtf')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="precio_fijo_dtf" type="text" name="precio_fijo_dtf" required="" placeholder=" " value="${precio_fijo_dtf_val}">
                    <label for="precio_fijo_dtf">Precio fijo DTF</label>
                </div>

                <!-- precio_fijo_uv -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#precio_fijo_uv')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="precio_fijo_uv" type="text" name="precio_fijo_uv" required="" placeholder=" " value="${precio_fijo_uv_val}">
                    <label for="precio_fijo_uv">Precio fijo UV</label>
                </div>

                <!-- saldo -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#saldo')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="saldo" type="text" name="saldo" required="" placeholder=" " value="${saldo_val}">
                    <label for="saldo">Saldo</label>
                </div>
               
                
               
                <!-- fecha - aki no muestro! -->
                <div class="form_group wr_fecha d-none">
                    <input type="date" id="fecha" name="fecha" required="" placeholder=" " value="${fecha_val}">
                    <label for="fecha">Fecha</label>
                </div>

                <!-- comentario -->
                <div class="form_group">
                    <textarea id="comentario" name="comentario" rows="4" required="" placeholder=" ">${comentario_val}</textarea>
                    <label class="lab_textarea" for="comentario">Comentario</label>
                </div>

                ${ (['nuevo','editar'].includes(cliente_action)) ? wr_btns_form.outerHTML : '' }

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

async function guardarCliente(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarCliente() ===');
    
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

        const form_cliente = document.getElementById('form_cliente');
        const inputTelefono = document.getElementById('telefono');

        let nombre = form_cliente?.querySelector('#nombre').value.trim();
        let telefono = form_cliente?.querySelector('#telefono').value.trim();
        let codigo_cliente = form_cliente?.querySelector('#codigo_cliente').value.trim();
        let taquilla = form_cliente?.querySelector('#taquilla').value.trim();
        let comentario = form_cliente?.querySelector('#comentario').value.trim();
        let descuento = form_cliente?.querySelector('#descuento').value.trim();
        let precio_fijo_dtf = form_cliente?.querySelector('#precio_fijo_dtf').value.trim();
        let precio_fijo_uv = form_cliente?.querySelector('#precio_fijo_uv').value.trim();
        let saldo = form_cliente?.querySelector('#saldo').value.trim();

    
        let errors = [];

        if(modo_guardar === 'fast'){
            nombre = objLista.nombre;
            // fecha = objLista.fecha;
            // notes = objLista.notes;    
        }

        if(telefono == ''){
            errors.push('Teléfono del cliente');
        }

        const regexTelefono = /^(?=(?:\D*\d){6})[0-9+() ,]+$/;        

        if (telefono && !regexTelefono.test(telefono)) {
            console.warn('campos introducidos mal');
            inputTelefono.setCustomValidity(
                'Introduce un teléfono válido con al menos 6 números.'
            );
            inputTelefono.reportValidity();
            return;
        }

        inputTelefono.setCustomValidity('');

       
        if(errors.length > 0){
            
            let error_text = '';
            errors.forEach(error => {
                error_text += `<p> - ${error}</p>`;
            });
            
            let aviso_text = `<p>Por favor, rellena los siguientes datos: </p> ${error_text}`;
            
            showToast('error', aviso_text, 50, 'center', true, 'Error en los campos introducidos');
            return;
        }


        const objClienteToSend = {
            id_cliente: id_cliente || null, //ya que se añade un nuevo cliente, entonces no hay id_cliente
            nombre,
            telefono,
            codigo_cliente,
            comentario,
            taquilla,
            descuento,
            precio_fijo_dtf,
            precio_fijo_uv,
            saldo,
        }
        console.log('objClienteToSend: ',objClienteToSend);
    
        const data = await insertarClienteDatos(objClienteToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_cliente':
                    text_show = 'Datos del cliente han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_cliente':
                    text_show = 'Datos del cliente han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_cliente){
                console.log('id_cliente: ', data.id_cliente);
                id_cliente = data.id_cliente;//guardo el id del cliente recién creada

                //Cojo datos de la song de la lista desde BD
                objCliente = await getDataClienteFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objCliente: ', objCliente);

                const itemClienteUpdate = objDataClientes.arr_data?.find(item => item.id_cliente == id_cliente);
                if (itemClienteUpdate) {//es update del cliente existente
                    Object.assign(itemClienteUpdate, objCliente);
                    // el objeto dentro de arr_data ya está actualizado
                } else {//es insert del cliente nuevo
                    console.warn('No encontrado objCliente.id_cliente en objDataClientes.arr_data');
                    //entonces es un cliente nuevo que se crea

                    //1.debo añadir objCliente en objDataClientes.arr_data al inicio
                    objDataClientes.arr_data.unshift(objCliente);

                    //2.debo aumentar el numero de total clientes
                    objDataClientes.totalRows++;

                    //3.debo pintar d_cliente en el top del contenedor
                    pintClienteOne(objCliente, 'arriba');//div de cliente se pinta al inicio (arriba)

                }

                //Actualizo d_art 
                pintClienteActiveSoloDatos();//en el contenedor_clientes

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

async function insertarClienteDatos(objCliente) {
    console.log('=== function insertarListaDatos(objCliente) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objCliente || Object.keys(objCliente).length == 0){
            alert('No hay todos los parametros necesarios del cliente...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objCliente: ',objCliente);

        const objCliente_str = JSON.stringify(objCliente);
        console.log('objCliente_str: ',objCliente_str);

        const nombre_fichero = 'insertar_datos_cliente_one.php';

        const response = await fetch(`../app/php/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objCliente_str
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
        console.error('Error en la función insertarClienteDatos: ', error);
    }
}

async function deleteCliente(event){
    console.log('=== function deleteCliente() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_cliente = objCliente.id_cliente;
        console.log('id_cliente: ', id_cliente);

        if(!id_cliente){
            alert('id_cliente no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el cliente con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_cliente}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objCliente.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Teléfono:</span> ${escaparHTML(objCliente.telefono) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Comentario:</span> ${escaparHTML(objCliente.comentario) || '(sin comentario)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar cliente',
            pregunta,
            'confirmDelete',
            true,
            id_cliente
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el cliente...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteClienteFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Cliente eliminado con éxito.';
            console.log(text_show);

            if(data.id_cliente){
                console.log('id_cliente: ', data.id_cliente);

                const totalAntes = objDataClientes.arr_data.length;

                //elimino el objeto del cliente eliminado desde objeto de todos los clientes encontrados usando filter
                objDataClientes.arr_data = objDataClientes.arr_data.filter(
                    item => item.id_cliente !== id_cliente
                );

                const totalDespues = objDataClientes.arr_data.length;
                const cliente_is_deleted = totalDespues < totalAntes;

                if(cliente_is_deleted){
                    console.log('cliente eliminado de objDataClientes');
                }else{
                    console.log('cliente NO eliminado de objDataClientes');
                }

                //Elimino elemento d_cliente de los clientes encontrados en 'contenedor_clientes'
                eid_contenedor_clientes.querySelector(`.d_cliente[data-id_cliente="${id_cliente}"]`).remove();
                eid_block_clientes.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_cliente = null;
                objCliente = {};//reseteo objeto song

                showToast('ok', text_show, 5000);
            }
            
        }else{
            console.log(`Error al eliminar el cliente.`);
            
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteCliente. error: ',error);        
    }

}

async function deleteClienteFromBd(){
    console.log('=== function deleteClienteFromBd() ===');

    try {
        
        if(!hay_id(id_cliente, 'id_cliente', 'deleteClienteFromBd()')){
            return; // <- se detiene aquí si no hay id_cliente
        }

        const nombre_fichero = 'eliminar_datos_cliente_one.php';
               
        const response = await fetch(`../app/php/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_cliente: id_cliente
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
                console.log(`[ELIMINADO] id_cliente: [${data.id_cliente}] --- nombre: [${data.nombre}] --- telefono: [${data.telefono}]`);
    
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
        console.error('Error en deleteClienteFromBd(): error.message: ', error.message);
    }
}


function pintClienteActive(){//click en div del contenedor de clientes que ya están en el DOM
    console.log('=== function pintClienteActive(e) === ');

    console.log('asignado global --- id_cliente: ', id_cliente);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_clientes, 'd_cliente');
    eid_contenedor_clientes.querySelector(`.d_cliente[data-id_cliente="${id_cliente}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_cliente viene como string: "925"
    objCliente = objDataClientes.arr_data.find(v => v.id_cliente == id_cliente);
    console.log('objCliente: ', objCliente);

    pintClienteActiveSoloDatos();

}

async function loadClientesAll(){
    console.log('=== function loadClientesAll() === ');

    objDataClientes = await getClientesAll();

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
        f_frase: '(Todos clientes)',
        f_num: objDataClientes.totalRows,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_clientes, objDataPint);
    
    pintClientesAll();

}

async function pintClientesAll(){//pintar todos los div de clientes, o al load o al find
    console.log('=== function pintClientesAll() === '); 
    
    console.time('time_pintClientesAlll');

    // if(!objDataClientes?.arr_data?.length){//si length === 0, entonces no hay clientes
    //     console.warn('No hay clientes en objDataClientes.arr_data');
    //     return;
    // }

    eid_contenedor_clientes.innerHTML = '';//reset contenedor de clientes

    const hay_datos = (esObjeto(objDataClientes) && objDataClientes.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_clientes.innerHTML = `
            <p class="prim">No existe ningún cliente en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataClientes: ', objDataClientes);        
        
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
        //Recorrer clientes encontradas... 
        objDataClientes.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintClienteOne(obj, 'abajo');//cada div de cliente se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintClientesAlll');
   
}


function pintClienteOne(objClienteOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un cliente, o al load, o al crear, o al find
    console.log('=== function pintClienteOne() === ');

    if(!objClienteOne){
        console.warn('No hay objeto de cliente. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objClienteOne.comentario) ? '' : 'd-none';//si no hay título, lo oculto 

    const d_cliente = document.createElement('div');
    d_cliente.className = 'd_cliente d_art';
    d_cliente.dataset.id_cliente = objClienteOne.id_cliente;
    d_cliente.dataset.tipo_art = 'cliente';
    d_cliente.innerHTML = `
        <div class="datos_cliente datos_art">
            <div class="da_nombre">${escaparHTML(objClienteOne.nombre) || '(nombre no asignado)'}</div>
            <div class="da_tel">${escaparHTML(objClienteOne.telefono)}</div>
            <div class="da_com ${cl_da_comm}">${escaparHTML(objClienteOne.comentario) || '(sin comentario)'}</div>
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

    d_cliente.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_cliente = e.currentTarget.dataset.id_cliente;
        console.log('asigno global --- id_cliente: ', id_cliente); 

        // siempre al clicar en cualquier parte del d_cliente se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintClienteActive();
        

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

            //clic dentro de d_cliente y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_cliente y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_cliente - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Cliente actual',null,'buildCliente',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Cliente actual',null,'buildCliente',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Cliente actual',null,'buildCliente',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_clientes.append(d_cliente);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_clientes.prepend(d_cliente);
    }
}


async function findWordsCliente(){
    console.log('=== async function findWordsCliente() ===');
    console.time('time_findWordsCliente');

    const eid_inpt_find_cliente = document.getElementById('inpt_find_cliente');
    const eid_modo_cliente = document.getElementById('modo_cliente');
    const eid_buscar_en_cliente = document.getElementById('buscar_en_cliente');
    const eid_regs_finded_cliente = document.getElementById('regs_finded_cliente');

    let words_input_trimed = eid_inpt_find_cliente.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_cliente.value;
    let buscar_en = eid_buscar_en_cliente.value;
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

    objFindParamsCliente.words_input = words_input;
    objFindParamsCliente.modo = modo;
    objFindParamsCliente.buscar_en = buscar_en;
    objFindParamsCliente.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataClientesFinded = await getDataClientesFromBdByFind(objFindParamsCliente);
    console.log('objDataClientesFinded: ', objDataClientesFinded);   

    
    const hay_coincidencias = (esObjeto(objDataClientesFinded) && objDataClientesFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsCliente.findedRows = 0;

        eid_regs_finded_cliente.classList.remove('d-none');
        eid_regs_finded_cliente.innerHTML = `
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
        
        objFindParamsCliente.findedRows = objDataClientesFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_cliente.classList.remove('d-none');
        eid_regs_finded_cliente.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataClientesFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_cliente" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_cliente.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_cliente') {
                console.log('clic en btn_mostrar_finded_cliente');
                console.log('mostrar clicked -> reasigno objDataClientes desde objDataClientesFinded'); 
                
                //Clono objeto
                objDataClientes = structuredClone(objDataClientesFinded);
                console.log('objDataClientes: ', objDataClientes);



                const modo_val = objModoBusquedaCliente[`modo${objFindParamsCliente.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaCliente[`buscar_en${objFindParamsCliente.buscar_en}`].titulo;

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
                    f_frase: objFindParamsCliente.words_input,
                    f_num: objFindParamsCliente.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_clientes, objDataPint);               
                                
                pintClientesAll();
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

    await update_objFindParamsCliente();

    console.timeEnd('time_findWordsCliente');
}


async function getClientesAll(){
    console.log('=== async function getClientesAll() ===');
    console.time('time_getClientesAll');

    objDataClientesBd = await getDataClientesAllFromBd();//la funcion que saca todos los cliente para pintarlo
    console.log('objDataClientesBd: ', objDataClientesBd);

    console.timeEnd('time_getClientesAll');

    return objDataClientesBd;

}


async function crear_objDataClientes(){
    console.log('=== function crear_objDataClientes() ===');
    console.time('time_crear_objDataClientes');

    objDataClientes = await getDataClientesAllFromBd();
    console.log(`objDataClientes: `, objDataClientes);

    console.timeEnd('time_crear_objDataClientes');
}

async function getDataClientesAllFromBd(){//sacar TODOS los clientes para rellenar contenedor_clientes
    console.log('=== function getDataClientesAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_clientes_all.php';
        
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
        console.error('Error en getDataClientesAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarCliente(){
    console.log('=== function buildBuscarCliente() ===');

    console.log('objCliente: ', objCliente);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_cliente"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsCliente.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_cliente')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsCliente()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_cliente" class="sel_opt_find">
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
            <select id="buscar_en_cliente" class="sel_opt_find">
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

        <div id="regs_finded_cliente" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_cliente');
    
    //modo
    const eid_modo_cliente = wr_args_busqueda.querySelector('#modo_cliente');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsCliente
    eid_modo_cliente.value = objFindParamsCliente.modo;

    eid_modo_cliente.onchange = async (e) => {
        findWordsCliente();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaCliente[`modo${objFindParamsCliente.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaCliente[`modo${objFindParamsCliente.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_cliente = wr_args_busqueda.querySelector('#buscar_en_cliente');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsCliente
    eid_buscar_en_cliente.value = objFindParamsCliente.buscar_en;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaCliente[`buscar_en${objFindParamsCliente.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaCliente[`buscar_en${objFindParamsCliente.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_cliente.onchange = async (e) => {
        findWordsCliente();
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
            await findWordsCliente();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataClientesFromBdByFind(objFindParamsCliente){
    console.log('=== function getDataClientesFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsCliente;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_clientes_by_find.php';
               
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
        console.error('Error en getDataClientesFromBdByFind(): error.message: ', error.message);
    }
}


function pintClienteActiveSoloDatos(){
    console.log('=== function pintClienteActiveSoloDatos() === ');

    if(!objCliente){
        alert('no hay objCliente');
        return;
    }

    const d_cliente = eid_contenedor_clientes.querySelector(`.d_cliente[data-id_cliente="${objCliente.id_cliente}"]`);
    console.log('d_cliente: ', d_cliente);
    
    if(!d_cliente){
        console.log('no hay d_cliente. no actualizo d_cliente...');
        return;
    }

    const div_da_nombre = d_cliente.querySelector('.da_nombre');
    const div_da_tel = d_cliente.querySelector('.da_tel');
    const div_da_com = d_cliente.querySelector('.da_com');

    //nombre
    div_da_nombre.textContent = objCliente.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //telefono
    div_da_tel.textContent = objCliente.telefono || '(telefono no asignado)';
    div_da_tel.classList.remove('d-none');//muestro tenga o no el telefono

    //comentario
    div_da_com.textContent = objCliente.comentario || '(sin comentario)';
    //si '!objCliente.comentario' es true  (no tiene comentario) -> pone  'd-none' -> oculta
    //si '!objCliente.comentario' es false (sí tiene comentario) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objCliente.comentario);

}

async function getDataClienteFromBd(){
    console.log('=== function getDataClienteFromBd() ===');

    try {
        
        if(!hay_id(id_cliente, 'id_cliente', 'getDataClienteFromBd()')){
            return; // <- se detiene aquí si no hay id_cliente
        }

        const nombre_fichero = 'obtener_datos_cliente_one.php';
     
        const response = await fetch(`../app/php/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_cliente: id_cliente
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

                console.log(`id_cliente: [${id_cliente}] --- nombre: [${data.nombre}] --- telefono: [${data.telefono}] --- comentario: [${data.comentario}]`);

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
        console.error('Error en getDataClienteFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsCliente(){
    console.log('=== function update_objFindParamsCliente() ===');

    obj_ajustes.objFindParamsCliente = objFindParamsCliente;
    await update_obj_ajustes();
}