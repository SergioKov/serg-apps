//producto
//=================================================================//
// start - F U N C T I O N S  
//=================================================================//
function buildProducto(producto_action = null){
    console.log('=== function buildProducto() ===');

    console.log('producto_action: ', producto_action);
    console.log('objProducto: ', objProducto);

    eid_bl_modalFullInner.innerHTML = '';//reset

    //campos de input
    let id_producto_val = '';
    let nombre_val = '';
    let descripcion_val = '';

    let precio_compra_val = '';
    let precio_compra_text = '';
    let precio_venta_val = '';
    let precio_venta_text = '';

    //elemento de título en el top
    const p_mensaje = document.createElement('p');
    p_mensaje.className = 'mensaje';
    
    //otras vars
    let cl_id_producto = 'd-none';//oculto
    let cl_d_limpiar_input = 'd-none';//oculto en 'ver' y 'eliminar' y muestro en 'editar'
    let contenedor;//general. se asigna luego  
    
    if(producto_action == 'nuevo'){//si es nueva
        
        //mostrarPrim = false;    
        //ocultarElementosPrimEn(lista_option_inner);
        //ocultarElementosEditablesEn(lista_option_inner);
        //mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit 

    }else{//si es: ver, editar, eliminar
        
        if(!hay_id(id_producto, 'id_producto', 'buildProducto()')){
            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No has seleccionado ningún producto.</p>
                <p class="p_aviso">Crea un producto pulsando "+".</p>
            `;
            openModal('center','Aviso Producto',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_producto
        } 
        id_producto_val = objProducto.id_producto;
        nombre_val = escaparHTML(objProducto.nombre) || '';
        descripcion_val = escaparHTML(objProducto.descripcion) || '';
        
        precio_compra_val = (objProducto.precio_compra) ? escaparHTML(objProducto.precio_compra) : '';
        precio_compra_text = (objProducto.precio_compra) ? `${precio_compra_val} €` : '--';
        
        precio_venta_val = (objProducto.precio_venta) ? escaparHTML(objProducto.precio_venta) : '';
        precio_venta_text = (objProducto.precio_venta) ? `${precio_venta_val} €` : '--';
    }

    //si es ver o editar, muestro id
    if(['ver','editar'].includes(producto_action)){
        
        p_mensaje.innerHTML = `
            <span class="sp_id">
                <span>Id: <b class="c_green">${id_producto}</b></span>
            </span>
        `;

        if(producto_action == 'ver'){
            const wr_img_editar_en_ver = document.createElement('span');
            wr_img_editar_en_ver.className = 'wr_img_editar_en_ver';
            wr_img_editar_en_ver.innerHTML = `
                <img class="img_acts img_editar" src="./images/img_editar_white_24x24.png">
            `;
            p_mensaje.append(wr_img_editar_en_ver);
        }
    }

    switch (producto_action) {
        case 'nuevo'://Nueva Producto
            p_mensaje.innerHTML = `
                <span>Rellena los campos del formulario con los datos de un producto <b class="c_blue">NUEVO</b>.</span>
            `;
            // si antes fue seleccionada una lista, entonces reseteo id_producto
            if(id_producto){
                id_producto = null;//reset ya que se va a crear un id_producto nuevo
            }else{
                //id_producto es null, no hago nada.
                // no reseteo arr_lista ya que hace falta crear una lista nueva con las canciones ya seleccionadas (añadidas a arr_lista) y no quiero perderlas.
            }
            objProducto = {};//reset
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'nuevo'
            //resetBlockLista();        
            break;
        
        default:
        case 'ver'://Ver Producto - FORMULARIO
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_producto = '';//muestro
            cl_d_limpiar_input = 'd-none';//oculto porque es 'ver'
            break;

        case 'editar'://Editar Producto - FORMULARIO
            cl_d_limpiar_input = 'd-flex';//muestro porque es 'editar'
            break;

        case 'eliminar'://Eliminar Producto - SM => SMALL - vista
            //console.log('(editar) --- arr_lista_bucle: ', arr_lista_bucle);
            cl_id_producto = '';//muestro
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
        <button class="btn btn_big btn_eliminar" type="button" onclick="deleteProducto(event);">Eliminar Producto DEFINITIVAMENTE</button>
    `;

    

    //para ELIMINAR
    const contenedor_producto_sm = document.createElement('div'); 
    contenedor_producto_sm.id = 'contenedor_producto_sm';
    contenedor_producto_sm.className = 'contenedor_form_sm';
    contenedor_producto_sm.innerHTML = `                    
        <div class="s_detalles">
            <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles_sm');">
                Producto <span class="f_r ${cl_id_producto}">id: ${id_producto_val}</span>
            </p>    
            <p id="l_titulo_detalles_sm" class="texto_norm t_big" style="display: block;">
                <span class="detalles_inner">
                    <span class="linea_fx ${!nombre_val ? 'd-none' : ''}">
                        <span class="cl_campo">Nombre:</span>
                        <span>${nombre_val}</span>
                    </span>
                    <span class="linea_fx ${!precio_compra_val ? 'd-none' : ''}">
                        <span class="cl_campo">Precio compra:</span>
                        <span>${precio_compra_text}</span>
                    </span>
                    <span class="linea_fx ${!precio_venta_val ? 'd-none' : ''}">
                        <span class="cl_campo">Precio venta:</span>
                        <span>${precio_venta_text}</span>
                    </span>

                </span><!--/.detalles_inner-->
            </p>
        </div>        

        ${(descripcion_val) ? descripcion_detalles.outerHTML : '' }
        
        ${(producto_action == 'eliminar') ? wr_btns_eliminar.outerHTML : '' }
    `;
    
    //Botones de FORMULARIO
    const wr_btns_form = document.createElement('div');
    wr_btns_form.className = 'wr_btns_form';
    wr_btns_form.innerHTML = `
        <button id="btn_ResetForm" class="btn btn_big" type="reset">Limpiar</button>
        <button id="btn_GuardarForm" class="btn btn_big" onclick="guardarProducto(event)">Guardar</button>
    `;

    //FORMULARIO
    const form_producto = document.createElement('div');
    form_producto.id = 'form_producto';
    form_producto.innerHTML = `
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
                    <label for="nombre">Nombre del producto</label>
                </div>
               

                <!-- precio_compra -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#precio_compra')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="precio_compra" type="text" name="precio_compra" required="" placeholder=" " value="${precio_compra_val}">
                    <label for="precio_compra">Precio compra</label>
                </div>


                <!-- precio_venta -->
                <div class="form_group wr_input_general">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#precio_venta')">
                        <img src="images/x_white.png">
                    </div>
                    <input id="precio_venta" type="text" name="precio_venta" required="" placeholder=" " value="${precio_venta_val}">
                    <label for="precio_venta">Precio venta</label>
                </div>


                <!-- descripcion -->
                <div class="form_group">
                    <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#descripcion')">
                        <img src="images/x_white.png">
                    </div>
                    <textarea id="descripcion" name="descripcion" rows="4" required="" placeholder=" ">${descripcion_val}</textarea>
                    <label class="lab_textarea" for="descripcion">Descripción</label>
                </div>


                ${ (['nuevo','editar'].includes(producto_action)) ? wr_btns_form.outerHTML : '' }

            </form>
        </div>     
    `;

    //añado action onclick a wr_img_editar_en_ver
    const element_wr_img_editar_en_ver = form_producto.querySelector('.wr_img_editar_en_ver');
    if(element_wr_img_editar_en_ver){
        element_wr_img_editar_en_ver.onclick = () => {
            openModal('full','Editar Producto actual',null,'buildProducto',true,'editar');
        }
    }

    //Reasigno el contenedor
    if(['ver_sm','eliminar'].includes(producto_action)){ 
        contenedor = contenedor_producto_sm;        
    }else{
        contenedor = form_producto;
        if(producto_action == 'ver'){
            makeInputsDisabled(contenedor, true);//deshabilito los inputs
        }
    }

    eid_bl_modalFullInner.append(contenedor);

    console.log('fin func');
}

async function guardarProducto(event, modo_guardar = 'normal'){
    //modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, 
    //solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarProducto() ===');
    
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

        const form_producto = document.getElementById('form_producto');

        let nombre = form_producto?.querySelector('#nombre').value.trim();
        let descripcion = form_producto?.querySelector('#descripcion').value.trim();
        let precio_compra = form_producto?.querySelector('#precio_compra').value.trim();
        let precio_venta = form_producto?.querySelector('#precio_venta').value.trim();
    
        let errors = [];

        if(modo_guardar === 'fast'){
            nombre = objProducto.nombre;
        }

        if(nombre == ''){
            errors.push('Nombre del producto');
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


        const objProductoToSend = {
            id_producto: id_producto || null, //ya que se añade un nuevo producto, entonces no hay id_producto
            nombre,
            descripcion,
            precio_compra,
            precio_venta,
        }
        console.log('objProductoToSend: ',objProductoToSend);
    
        const data = await insertarProductoDatos(objProductoToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_producto':
                    text_show = 'Datos del producto han sido actualizados con éxito.';
                    break;
                        
                case 'is_insert_producto':
                    text_show = 'Datos del producto han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            showToast('ok', text_show, 5000);

            if(data.id_producto){
                console.log('id_producto: ', data.id_producto);
                id_producto = data.id_producto;//guardo el id del producto recién creada

                //Cojo datos del producto desde BD
                objProducto = await getDataProductoFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objProducto: ', objProducto);

                const itemProductoUpdate = objDataProductos.arr_data?.find(item => item.id_producto == id_producto);
                if (itemProductoUpdate) {//es update del producto existente
    
                    Object.assign(itemProductoUpdate, objProducto);
                    // el objeto dentro de arr_data ya está actualizado

                    //Actualizo d_art 
                    pintProductoActiveSoloDatos();//en el contenedor_productos

                } else {//es insert del producto nuevo
    
                    console.warn('No encontrado objProducto.id_producto en objDataProductos.arr_data');
                    //entonces es un producto nuevo que se crea

                    //1.debo añadir objProducto en objDataProductos.arr_data al inicio (si existe!)
                    objDataProductos?.arr_data?.unshift(objProducto);

                    //2.debo aumentar el numero de total productos (si existe!)
                    if (objDataProductos?.totalRows != null){
                        objDataProductos.totalRows++;
                    }

                    //3. old -> debo pintar d_producto en el top del contenedor
                    //3. new -> pero en vez de uno pinto todos para actualizar div filtros aplicados
                    //pintProductoOne(objProducto, 'arriba');//div de producto se pinta al inicio (arriba)
                    loadProductosAll();
                }

                closeModal(null,true);
            }
           
        }else{

            let text_show = 'Error al guardar el producto.';
            console.log(text_show);
            console.error('data.error: ', data.error);

            showToast('error', text_show, 5000);

        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarProducto(). error: ',error);
    }

}

async function insertarProductoDatos(objProducto) {
    console.log('=== function insertarProductoDatos(objProducto) ===');

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!objProducto || Object.keys(objProducto).length == 0){
            alert('No hay todos los parametros necesarios del producto...');//'No hay todos los parametros necesarios.'
            return;
        }

        console.log('objProducto: ',objProducto);

        const objProducto_str = JSON.stringify(objProducto);
        console.log('objProducto_str: ',objProducto_str);

        const nombre_fichero = 'insertar_datos_producto_one.php';

        const response = await fetch(`../app/php/datos/producto/${nombre_fichero}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objProducto_str
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
        console.error('Error en la función insertarProductoDatos: ', error);
    }
}

async function deleteProducto(event){
    console.log('=== function deleteProducto() ===');
    event.preventDefault();
    event.stopPropagation();

    try {
    
        id_producto = objProducto.id_producto;
        console.log('id_producto: ', id_producto);

        if(!id_producto){
            alert('id_producto no está indicado... hago return.');
        }

        const pregunta = `
            <h3>¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE el producto con los siguientes datos?</h3> 
            <p><span class="cl_campo">id:</span> ${id_producto}</p> 
            <p><span class="cl_campo">Nombre:</span> ${escaparHTML(objProducto.nombre) || '(no asignado)'}</p> 
            <p><span class="cl_campo">Descripción:</span> ${escaparHTML(objProducto.descripcion) || '(sin descripcion)'}</p> 
            <h3>¡Esta acción no se podrá deshacer!</h3>
        `;

        const respuesta = await openModal( //aqui await es importante!
            'center',
            'Eliminar producto',
            pregunta,
            'confirmDelete',
            true,
            id_producto
        );

        if(!respuesta){
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        let text1 = 'sigo adelante para eliminar el producto...'; //clic en "Aceptar"
        console.log(text1);
        //alert(text1);


        const data = await deleteProductoFromBd();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = 'Producto eliminado con éxito.';
            console.log(text_show);

            if(data.id_producto){
                console.log('id_producto: ', data.id_producto);

                const totalAntes = objDataProductos.arr_data.length;

                //elimino el objeto del producto eliminado desde objeto de todos los productos encontrados usando filter
                objDataProductos.arr_data = objDataProductos.arr_data.filter(
                    item => item.id_producto !== id_producto
                );

                const totalDespues = objDataProductos.arr_data.length;
                const producto_is_deleted = totalDespues < totalAntes;

                if(producto_is_deleted){
                    console.log('producto eliminado de objDataProductos');
                }else{
                    console.log('producto NO eliminado de objDataProductos');
                }

                //Elimino elemento d_producto de los productos encontrados en 'contenedor_productos'
                eid_contenedor_productos.querySelector(`.d_producto[data-id_producto="${id_producto}"]`).remove();
                eid_block_productos.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

                id_producto = null;
                objProducto = {};//reseteo objeto song

                //al eliminar uno pinto todos los registros para actualizar div filtros aplicados
                loadProductosAll();

                showToast('ok', text_show, 5000);
            }
            
        }else{
            
            console.log(`Error al eliminar el producto.`);
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_error = data.error;
            showToast('error', text_error, 500,'center');

        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteProducto. error: ',error);        
    }

}

async function deleteProductoFromBd(){
    console.log('=== function deleteProductoFromBd() ===');

    try {
        
        if(!hay_id(id_producto, 'id_producto', 'deleteProductoFromBd()')){
            return; // <- se detiene aquí si no hay id_producto
        }

        const nombre_fichero = 'eliminar_datos_producto_one.php';
               
        const response = await fetch(`../app/php/datos/producto/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_producto: id_producto
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
                console.log(`[ELIMINADO] id_producto: [${data.id_producto}] --- nombre: [${data.nombre}]`);
    
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
        console.error('Error en deleteProductoFromBd(): error.message: ', error.message);
    }
}


function pintProductoActive(){//click en div del contenedor de productos que ya están en el DOM
    console.log('=== function pintProductoActive(e) === ');

    console.log('asignado global --- id_producto: ', id_producto);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_productos, 'd_producto');
    eid_contenedor_productos.querySelector(`.d_producto[data-id_producto="${id_producto}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_producto viene como string: "925"
    objProducto = objDataProductos.arr_data.find(v => v.id_producto == id_producto);
    console.log('objProducto: ', objProducto);

    pintProductoActiveSoloDatos();

}

async function loadProductosAll(){
    console.log('=== function loadProductosAll() === ');

    objDataProductos = await getProductosAll();

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
        f_frase: '(Todos productos)',
        f_num: objDataProductos?.totalRows || 0,
        element_inner: wr_filtros_aplicados_inner,
    }

    pintFiltrosAplicados(eid_bl_buscar_productos, objDataPint);
    
    pintProductosAll();

}

async function pintProductosAll(){//pintar todos los div de productos, o al load o al find
    console.log('=== function pintProductosAll() === '); 
    
    console.time('time_pintProductosAlll');

    // if(!objDataProductos?.arr_data?.length){//si length === 0, entonces no hay productos
    //     console.warn('No hay productos en objDataProductos.arr_data');
    //     return;
    // }

    eid_contenedor_productos.innerHTML = '';//reset contenedor de productos

    const hay_datos = (esObjeto(objDataProductos) && objDataProductos.arr_data?.length > 0);//true o false

    if(!hay_datos){
        console.log('no hay datos...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_productos.innerHTML = `
            <p class="prim">No existe ningún registro de producto en la base de datos.</p>
        `;
    }

    if(hay_datos){
        console.log('hay datos...');
        
        console.log('objDataProductos: ', objDataProductos);        
        
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
        //Recorrer productos encontradas... 
        objDataProductos.arr_data.forEach( obj => {
            console.log('obj: ', obj);

            pintProductoOne(obj, 'abajo');//cada div de producto se pinta al final (abajo)
        });

    }

    console.timeEnd('time_pintProductosAlll');
   
}


function pintProductoOne(objProductoOne, lugar_de_pintar = 'abajo'){//pintar solo un div de un producto, o al load, o al crear, o al find
    console.log('=== function pintProductoOne() === ');

    if(!objProductoOne){
        console.warn('No hay objeto de producto. no lo puedo pintar');
        return;
    }
    
    let cl_da_comm = (objProductoOne.descripcion) ? '' : 'd-none';//si no hay título, lo oculto
    
    const precio_compra_text = (objProductoOne.precio_compra) ? `${objProductoOne.precio_compra} €` : '--' ;
    const precio_venta_text = (objProductoOne.precio_venta) ? `${objProductoOne.precio_venta} €` : '--' ;

    const d_producto = document.createElement('div');
    d_producto.className = 'd_producto d_art';
    d_producto.dataset.id_producto = objProductoOne.id_producto;
    d_producto.dataset.tipo_art = 'producto';
    d_producto.innerHTML = `
        <div class="datos_producto datos_art">
            <div class="da_nombre">${escaparHTML(objProductoOne.nombre) || '(nombre no asignado)'}</div>
            <div class="da_com ${cl_da_comm}">${escaparHTML(objProductoOne.descripcion) || '(sin descripcion)'}</div>
        </div>
        <div class="art_cols art_col3">
            <div class="da_precio_compra">${precio_compra_text}</div>
        </div>
        <div class="art_cols art_col4">
            <div class="da_precio_venta">${precio_venta_text}</div>
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

    d_producto.onclick = async (e) => {
        // showToast('info', '3. p_song clicked en 3755', 1500);//test

        console.log('e.currentTarget: ', e.currentTarget);

        id_producto = e.currentTarget.dataset.id_producto;
        console.log('asigno global --- id_producto: ', id_producto); 

        // siempre al clicar en cualquier parte del d_producto se pinta como activo - revisar si hace falta?...
        // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
        pintProductoActive();
        

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

            //clic dentro de d_producto y click fuera de tres_puntos_menu -> ver
            if(!e.target.classList.contains('tres_puntos_menu') && !e.target.closest('.tres_puntos_menu')){

                console.log('clic dentro de d_producto y click fuera de tres_puntos_menu -> ver');
                mostrar_por_defecto = true;
            
            }else{//click dentro de tres_puntos_menu 
                
                //id_producto - MIRAR SI HACE FALTA PARA LUEGO!!!
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
                openModal('full','Producto actual',null,'buildProducto',true,'ver');
            }
            else if(mostrar_editar){
                openModal('full','Editar Producto actual',null,'buildProducto',true,'editar');
            }
            else if(mostrar_eliminar){
                openModal('full','Eliminar Producto actual',null,'buildProducto',true,'eliminar');
            }
        }                
        
    }

    if(lugar_de_pintar == 'abajo'){
        eid_contenedor_productos.append(d_producto);
    }else if(lugar_de_pintar == 'arriba'){
        eid_contenedor_productos.prepend(d_producto);
    }
}


async function findWordsProducto(){
    console.log('=== async function findWordsProducto() ===');
    console.time('time_findWordsProducto');

    const eid_inpt_find_producto = document.getElementById('inpt_find_producto');
    const eid_modo_producto = document.getElementById('modo_producto');
    const eid_buscar_en_producto = document.getElementById('buscar_en_producto');
    const eid_regs_finded_producto = document.getElementById('regs_finded_producto');

    let words_input_trimed = eid_inpt_find_producto.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_producto.value;
    let buscar_en = eid_buscar_en_producto.value;
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

    objFindParamsProducto.words_input = words_input;
    objFindParamsProducto.modo = modo;
    objFindParamsProducto.buscar_en = buscar_en;
    objFindParamsProducto.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    objDataProductosFinded = await getDataProductosFromBdByFind(objFindParamsProducto);
    console.log('objDataProductosFinded: ', objDataProductosFinded);   

    
    const hay_coincidencias = (esObjeto(objDataProductosFinded) && objDataProductosFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsProducto.findedRows = 0;

        eid_regs_finded_producto.classList.remove('d-none');
        eid_regs_finded_producto.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados. 
                <br><br> 
                Prueba a modificarlos o a utilizar otros términos de búsqueda.
            </p>
        `;
    }

    //si hay productos...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsProducto.findedRows = objDataProductosFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_producto.classList.remove('d-none');
        eid_regs_finded_producto.innerHTML = `
            <div class="wr_num_regs">
                <span>Registros encontrados: </span>
                <span class="num_regs_finded">${objDataProductosFinded.arr_data.length}</span>
            </div>
            <button id="btn_mostrar_finded_producto" class="btn btn_big mostrar_finded">Mostrar</button>
        `;

        //click en div
        eid_regs_finded_producto.onclick = (e) => {
            
            if(e.target.id === 'btn_mostrar_finded_producto') {
                console.log('clic en btn_mostrar_finded_producto');
                console.log('mostrar clicked -> reasigno objDataProductos desde objDataProductosFinded'); 
                
                //Clono objeto
                objDataProductos = structuredClone(objDataProductosFinded);
                console.log('objDataProductos: ', objDataProductos);



                const modo_val = objModoBusquedaProducto[`modo${objFindParamsProducto.modo}`].titulo;
                const buscar_en_val = objBuscarEnBusquedaProducto[`buscar_en${objFindParamsProducto.buscar_en}`].titulo;

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
                    f_frase: objFindParamsProducto.words_input,
                    f_num: objFindParamsProducto.findedRows,
                    element_inner: wr_filtros_aplicados_inner,
                }

                pintFiltrosAplicados(eid_bl_buscar_productos, objDataPint);               
                                
                pintProductosAll();
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

    await update_objFindParamsProducto();

    console.timeEnd('time_findWordsProducto');
}


async function getProductosAll(){
    console.log('=== async function getProductosAll() ===');
    console.time('time_getProductosAll');

    objDataProductosBd = await getDataProductosAllFromBd();//la funcion que saca todos los producto para pintarlo
    console.log('objDataProductosBd: ', objDataProductosBd);

    console.timeEnd('time_getProductosAll');

    return objDataProductosBd;

}


async function crear_objDataProductos(){
    console.log('=== function crear_objDataProductos() ===');
    console.time('time_crear_objDataProductos');

    objDataProductos = await getDataProductosAllFromBd();
    console.log(`objDataProductos: `, objDataProductos);

    console.timeEnd('time_crear_objDataProductos');
}

async function getDataProductosAllFromBd(){//sacar TODOS los productos para rellenar contenedor_productos
    console.log('=== function getDataProductosAllFromBd() ===');

    try {

        const nombre_fichero = 'obtener_datos_productos_all.php';
        
        const response = await fetch(`../app/php/datos/producto/${nombre_fichero}`, {
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
        console.error('Error en getDataProductosAllFromBd(): error.message: ', error.message);
    }
}

function buildBuscarProducto(){
    console.log('=== function buildBuscarProducto() ===');

    console.log('objProducto: ', objProducto);

    eid_bl_modalFullInner.innerHTML = '';//reset


    const wr_args_busqueda = document.createElement('div');
    wr_args_busqueda.className = 'wr_args_busqueda d_flex_col';
    wr_args_busqueda.innerHTML = `
        <div class="wr_nav">
            <div class="wr_inpt_x">
                <input
                    id="inpt_find_producto"
                    class="inpt_vvod"
                    type="text"
                    placeholder="Introduce una palabra o frase para buscar..."
                    data-dic=""
                    value="${objFindParamsProducto?.words_input || ''}">
                <div class="clear_inpt" onclick="clear_inpt('find_producto')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsProducto()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_producto" class="sel_opt_find">
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
            <select id="buscar_en_producto" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de producto</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>
            </select>

            <div id="buscar_en_exp_ej" class="wr_btns_exp_ej">
                <botton class="btn btn_exp_ej" data-tipo_btn="exp">Explicación</botton>
                <botton class="btn btn_exp_ej" data-tipo_btn="ej">Ejemplo</botton>
            </div>

        </div>

        <div id="regs_finded_producto" class="regs_finded">
            <!-- aki Registros encontrados: -->    
        </div>

    `;

    //input
    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_producto');
    
    //modo
    const eid_modo_producto = wr_args_busqueda.querySelector('#modo_producto');
    const eid_modo_exp_ej = wr_args_busqueda.querySelector('#modo_exp_ej');

    //hago seleccionado opcion segun el parametros guardados en objFindParamsProducto
    eid_modo_producto.value = objFindParamsProducto?.modo || 1 ;

    eid_modo_producto.onchange = async (e) => {
        findWordsProducto();
    }

    eid_modo_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);
        
        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objModoBusquedaProducto[`modo${objFindParamsProducto.modo}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objModoBusquedaProducto[`modo${objFindParamsProducto.modo}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    //buscar_en
    const eid_buscar_en_producto = wr_args_busqueda.querySelector('#buscar_en_producto');
    const eid_buscar_en_exp_ej = wr_args_busqueda.querySelector('#buscar_en_exp_ej');
    
    //hago seleccionado opcion segun el parametros guardados en objFindParamsProducto
    eid_buscar_en_producto.value = objFindParamsProducto?.buscar_en || 1 ;
    
    eid_buscar_en_exp_ej.onclick = (e) => {
        const tipo_btn = e.target.dataset.tipo_btn;
        console.log('tipo_btn: ', tipo_btn);

        let aviso_text = '';

        if(tipo_btn === 'exp'){//Explicación
            aviso_text = objBuscarEnBusquedaProducto[`buscar_en${objFindParamsProducto.buscar_en}`].desc_full;
            showToast('info', aviso_text, 50, 'center', true, 'Explicación');
        }

        if(tipo_btn === 'ej'){//Ejemplo
            aviso_text = objBuscarEnBusquedaProducto[`buscar_en${objFindParamsProducto.buscar_en}`].ejemplo;
            showToast('info', aviso_text, 50, 'center', true, 'Ejemplo');
        }
    }

    eid_buscar_en_producto.onchange = async (e) => {
        findWordsProducto();
    }


    //al teclear texto en la busqueda de producto
    let timeoutFindProducto;

    eid_inpt_find.oninput = (e) => {
        console.log('=== listener --- eid_inpt_find input');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutFindProducto);
    
        //permito buscar incluso al teclear 1 carácter
        // if(input_val.length < 3){
        //     return;
        // }
    
        timeoutFindProducto = setTimeout(async () => {
            await findWordsProducto();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataProductosFromBdByFind(objFindParamsProducto){
    console.log('=== function getDataProductosFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindParamsProducto;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }

        const nombre_fichero = 'obtener_datos_productos_by_find.php';
               
        const response = await fetch(`../app/php/datos/producto/${nombre_fichero}`, {
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
        console.error('Error en getDataProductosFromBdByFind(): error.message: ', error.message);
    }
}


function pintProductoActiveSoloDatos(){
    console.log('=== function pintProductoActiveSoloDatos() === ');

    if(!objProducto){
        alert('no hay objProducto');
        return;
    }

    const d_producto = eid_contenedor_productos.querySelector(`.d_producto[data-id_producto="${objProducto.id_producto}"]`);
    console.log('d_producto: ', d_producto);
    
    if(!d_producto){
        console.log('no hay d_producto. no actualizo d_producto...');
        return;
    }

    const div_da_nombre = d_producto.querySelector('.da_nombre');
    const div_da_com = d_producto.querySelector('.da_com');
    const div_da_precio_compra = d_producto.querySelector('.da_precio_compra');
    const div_da_precio_venta = d_producto.querySelector('.da_precio_venta');

    const precio_compra_text = (objProducto.precio_compra) ? `${objProducto.precio_compra} €` : '--' ;
    const precio_venta_text = (objProducto.precio_venta) ? `${objProducto.precio_venta} €` : '--' ;


    //nombre
    div_da_nombre.textContent = objProducto.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //precio_compra
    div_da_precio_compra.textContent = precio_compra_text;
    div_da_precio_compra.classList.remove('d-none');//muestro tenga o no el precio

    //precio_venta
    div_da_precio_venta.textContent = precio_venta_text;
    div_da_precio_venta.classList.remove('d-none');//muestro tenga o no el precio

    //descripcion
    div_da_com.textContent = objProducto.descripcion || '(sin descripcion)';
    //si '!objProducto.descripcion' es true  (no tiene descripcion) -> pone  'd-none' -> oculta
    //si '!objProducto.descripcion' es false (sí tiene descripcion) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objProducto.descripcion);

}

async function getDataProductoFromBd(){
    console.log('=== function getDataProductoFromBd() ===');

    try {
        
        if(!hay_id(id_producto, 'id_producto', 'getDataProductoFromBd()')){
            return; // <- se detiene aquí si no hay id_producto
        }

        const nombre_fichero = 'obtener_datos_producto_one.php';
     
        const response = await fetch(`../app/php/datos/producto/${nombre_fichero}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_producto: id_producto
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

                console.log(`id_producto: [${id_producto}] --- nombre: [${data.nombre}]`);

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
        console.error('Error en getDataProductoFromBd(): error.message: ', error.message);
    }
}

async function update_objFindParamsProducto(){
    console.log('=== function update_objFindParamsProducto() ===');

    obj_ajustes.objFindParamsProducto = objFindParamsProducto;
    await update_obj_ajustes();
}