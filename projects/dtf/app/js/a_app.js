//=================================================================//
// start - F U N C T I O N S  
//=================================================================//

async function init() {
    //await crear_objSongbooks();

    //await crear_objGrupos();   
    await getClientesAll();   
}

function hideShowPuntosMenu(){
    if(puntosMenu.classList.contains('shown')){//si es mostrado, lo oculto
        closePuntosMenu();
    }else{//si es oculto, lo muestro
        openPuntosMenu();
    }
}

function openPuntosMenu(){
    puntosMenu.classList.add('shown');//muestro
    puntosMenu.style.top = menu_contenido.offsetHeight + 'px';
    puntosMenu.style.height = (window.innerHeight - menu_contenido.offsetHeight) + 'px';
    hamburger.classList.add('active'); // Cambiar hamburguesa a flecha
}

function closePuntosMenu(){
    puntosMenu.classList.remove('shown');//oculto
    setTimeout(()=>{
        puntosMenu.style.top = -puntosMenu.offsetHeight + 'px';
    },20);
    hamburger.classList.remove('active'); // Cambiar flecha a hamburguesa
}






function hideShowTresPuntosMenu(tresPuntos){
    console.log(' === function hideShowTresPuntosMenu() === ');

    const d_art = tresPuntos.closest('.d_art');//div articulo
    const menu = d_art.querySelector('.tres_puntos_menu');//es menu actual
    const estaAbierto = menu?.classList.contains('shown');

    if(d_art && d_art.dataset.tipo_art){
        //saco id_cliente del div clicked
        switch (d_art.dataset.tipo_art) {
            case 'cliente':
                id_cliente = Number(d_art.dataset.id_cliente);
                break;
        
            case 'producto':
                id_producto = Number(d_art.dataset.id_producto);
                break;
        
            case 'pedido':
                id_pedido = Number(d_art.dataset.id_pedido);
                break;
        
            default:
                break;
        }
    }

    cerrarTresPuntosMenuAll();

    if(estaAbierto){//si es mostrado, lo oculto
        menu?.classList.remove('shown');//oculto
    }else{//si es oculto, lo muestro
        menu?.classList.add('shown');//muestro
    }
}

function cerrarTresPuntosMenuAll() {//cierra todos los 'tres_puntos_menu'
    document.querySelectorAll('.tres_puntos_menu.shown').forEach(menu => {
        menu?.classList.remove('shown');
    });
}




function showBlockName(blockName){
    console.log('=== function showBlockName() ===');

    const main_block_active = eid_main.querySelector('.main_block.active');
    const id_block = `block_${blockName}`;

    if(main_block_active && id_block == main_block_active.id){
        //alert('ya estás aki');
        closePuntosMenu();
        return;
    }

    //puntos menu
    los_puntosMenu_ul.querySelectorAll('li').forEach(li => {
        if(li.dataset.block_name == blockName){
            li.classList.add('active');            
        }else{
            li.classList.remove('active');
        }
    });

    //blocks
    eid_main.querySelectorAll('.main_block').forEach(main_block => {
        if(main_block.id == id_block){
            main_block.classList.add('active');            
        }else{
            main_block.classList.remove('active');
        }
    });

    closePuntosMenu();

    return;

    switch (blockName) {
        case 'biblia':
            bl_titulo.textContent = 'Biblia';
            showOnlyBlock(blockName);
            mySizeBible();
            break;
        
        default:
        case 'buscar':
            bl_titulo.textContent = 'Buscar canción';
            showOnlyBlock(blockName);
            if(!id_song){//nueva o no hay selecionada id_song
                if(mostrarPrim){
                    mostrarElementosPrimEn(buscar_option_inner);
                }else{
                    ocultarElementosPrimEn(buscar_option_inner);
                }
                ocultarElementosEditablesEn(buscar_option_inner);
            }else{
                ocultarElementosPrimEn(buscar_option_inner);
                mostrarElementosEditablesEn(buscar_option_inner);
            }
            mySizeBuscar();
            break;
        
        case 'esquema':
            bl_titulo.textContent = 'Esquema de la canción';
            showOnlyBlock(blockName);
            if(!id_song){//nueva o no hay selecionada id_song
                mostrarElementosPrimEn(esquema_option_inner);
                ocultarElementosEditablesEn(esquema_option_inner);
            }else{
                ocultarElementosPrimEn(esquema_option_inner);
                mostrarElementosEditablesEn(esquema_option_inner);
            }
            if(id_song && !pageActiveEsquema){
                ver_esquema();
            }
            mySizeEsquema();
            break;
    
        case 'cancion':
            bl_titulo.textContent = 'Crear / Editar canción';
            showOnlyBlock(blockName);
            if(!id_song){//nueva o no hay selecionada id_song
                if(mostrarPrim){
                    mostrarElementosPrimEn(cancion_option_inner);
                }else{
                    ocultarElementosPrimEn(cancion_option_inner);
                }
                ocultarElementosEditablesEn(cancion_option_inner);
            }else{
                ocultarElementosPrimEn(cancion_option_inner);
                mostrarElementosEditablesEn(cancion_option_inner);
            }
            if(id_song && !pageActiveCancion){
                // ver_song();//antes
                editar_song();
            }
            mySizeCancion();
            break;

        case 'ejemplo':
            bl_titulo.textContent = 'Ejemplo de canción';
            showOnlyBlock(blockName);
            //por defecto todo visible
            if(!pageActiveEjemplo){
                showEjemplo('ua');//por defecto -> ucraniano
            }
            mySizeEjemplo();
            break;

        case 'lista':
            bl_titulo.textContent = 'Buscar lista';
            showOnlyBlock(blockName);
            if(!id_lista){//nueva o no hay selecionada id_song
                if(mostrarPrim){
                    mostrarElementosPrimEn(lista_option_inner);
                }else{
                    ocultarElementosPrimEn(lista_option_inner);
                }
                ocultarElementosEditablesEn(lista_option_inner);
            }else{
                ocultarElementosPrimEn(lista_option_inner);
                mostrarElementosEditablesEn(lista_option_inner);
            }
            //por defecto todo visible
            mySizeLista();
            break;
    }
}



function hay_id_cliente(func_name = ''){
    console.log('=== function hay_id_cliente() ===');
    
    if(!id_cliente){
        console.warn(func_name + ' --- No hay id_cliente. hago return...');
        //alert(func_name + ' --- No hay id_lista. hago return...');
        showToast('info', 'No has seleccionado a ningún cliente. Ve a la pestaña "clientes" para seleccionar o crear un cliente nuevo.', 1000, 'center');
        return false;
    }
    console.log(func_name + ' --- id_cliente: ', id_cliente);

    return true;  
}

function convertirFecha(fechaStr, formato, separador = '/', validar_partes_fecha = true) {
    // de 'aaaa-mm-dd' a 'dd/mm/aaaa'
    //formato 'sql': '2025-12-03'
    //formato 'ver': '03/12/2025' '03.12.2025' '03-12-2025'

    const separadores = ['-', '/', '.'];

    if (!fechaStr) return fechaStr;

    // Filtrar los separadores que aparecen en la cadena
    const encontrados = separadores.filter(sep => fechaStr.includes(sep));

    // Si no hay exactamente un separador o hay varios tipos, devolver la fechaStr
    if (encontrados.length !== 1) {
        return fechaStr;
    }

    const separador_encontrado = encontrados[0];
    const partes = fechaStr.split(separador_encontrado);

    if (validar_partes_fecha && partes.length !== 3) {
        alert('no hay tres partes válidas. hago return...');
        return fechaStr; // Si no hay tres partes válidas
    }

    let [p1, p2, p3] = partes;
    if(!p3) p3 = '';//para mostrar en rojo encontrado '/08/2025' en la lista
    if(!p2) p2 = '';

    if(formato == 'sql'){
        if (p1.length === 4) {// p1 = primera_parte = '2025'
            return `${p3}-${p2}-${p1}`;//formato '2025-12-03' SIEMPRE
        }else{
            return `${p1}-${p2}-${p3}`;//formato '2025-12-03' SIEMPRE
        }        
    }
    
    if(formato == 'ver'){
        if (p1.length === 4) {// p1 = primera_parte = '2025'
            return `${p3}${separador}${p2}${separador}${p1}`;//formato '2025/12/03' o '2025-12-03' o '2025.12.03'
        }else{
            return `${p1}${separador}${p2}${separador}${p3}`;//formato '03/12/2025' o '03.12.2025' o '03-12-2025'
        }
    } 
}

function limpiarInput(selectorInput){
    const input = document.querySelector(selectorInput);
    if(input){
        input.value = '';
        input.focus();
    }
}


function makeInputsDisabled(container, param){
    console.log('=== function makeInputsDisabled() ===');
    
    if(param === true){
        container.querySelector('form').querySelectorAll('input, select, textarea').forEach(input => {
            input.disabled = true;
        });
        container.querySelector('.wr_btns_form')?.classList.add('no_visto');//oculto botones de acción del formulario
    }else{
        container.querySelector('form').querySelectorAll('input, select, textarea').forEach(input => {
            input.disabled = false;
        });
        container.querySelector('.wr_btns_form')?.classList.remove('no_visto');//muestro botones de acción del formulario
    }
}

function showToast(tipo = 'info', mensaje, duration = null, position = 'default', with_head = false, text_head = 'Info', contenedor = null) {//default -> abajo derecha
    //position = 'default'// => abajo derecha
    //position = 'center'// => center y center

    if(!permitirShowToast){
        return;
    }

    let toast_container;
    let inner_position;

    if(!contenedor){//si no se indica el contenedor, cojo el por defecto
        toast_container = eid_toast_container;
        toast_container.innerHTML = '';//reset
        inner_position = 'inner_fixed';
    }else{
        toast_container = contenedor;
        contenedor.querySelector('.toast_container_inner')?.remove();
        inner_position = 'inner_absolute';
    }
   

    // eid_toast_container.innerHTML = '';//reset

    // Crear div outer para cubrir toda la pantalla
    const ecl_toast_container_inner = document.createElement('div');
    ecl_toast_container_inner.className = `toast_container_inner ${position} ${inner_position}`;
    ecl_toast_container_inner.onclick = (e) => {
        console.log('toast_close ecl_toast_container_inner. e.currentTarget: ', e.currentTarget);
        console.log('toast_close ecl_toast_container_inner. e.target: ', e.target);
        e.stopPropagation();

        //click en ecl_toast_container_inner pero fuera del toast, para cerrar el toast
        if(!e.target.closest('.toast')){//si el click es fuera del toast
            closeToastWithFade();
        }
    };


    function closeToastWithFade(duration = 10){//por defecto cerrar inmediatamente (10ms)
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => ecl_toast_container_inner.remove(), 1000);
        }, duration);
    }


    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast`;

    if(with_head){
        
        toast.innerHTML = `
            <div class="toast_inner">
                <div class="toast_head">
                    <div>${text_head}</div>
                    <!-- aki btn de cerrar toast -->
                </div>
                <div class="toast_body ${tipo}">
                    <div class="toast_mensaje">${mensaje}</div>
                </div>
            </div>
        `;
    
    }else{//default simple

        toast.innerHTML = `
            <div class="toast_body simple ${tipo}">
                <div class="toast_mensaje">${mensaje}</div>
                <!-- aki btn de cerrar toast -->
            </div>
        `;
    }


    //si no hay duration, muestro btn de cerrar
    if(!duration || duration  <= 1000){
        const ejemplo_btn = '<button class="toast_close" onclick="this.parentElement.remove()">×</button>';

        const toast_close = document.createElement('button');
        toast_close.className = 'toast_close';
        toast_close.textContent = '×';
        toast_close.onclick = (e) => {
            console.log('toast_close clicked. e.currentTarget: ', e.currentTarget);
            closeToastWithFade();
        }

        //añado al toast
        if(with_head){
            toast.querySelector('.toast_head').append(toast_close);
        }else{
            toast.querySelector('.toast_body').append(toast_close);
        }
    }

    //Añado al DOM
    // eid_toast_container.appendChild(toast);
    toast_container.appendChild(ecl_toast_container_inner);
    ecl_toast_container_inner.appendChild(toast);
    

    ecl_toast_container_inner.classList.add('show');

    // Forzar reflow para activar transición
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    if(duration > 1000){
       console.log('hay duration: ', duration);
        // Auto eliminar
        closeToastWithFade(duration);
    }
}


function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


function diaSemana(fechaStr) {
    // fechaStr viene en formato "aaaa-mm-dd"
    const fecha = new Date(fechaStr);

    // Días de la semana en castellano
    const dias = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado"
    ];

    return dias[fecha.getDay()];
}

function hideShowBlock(id_div, action = 'toggle'){//action: toggle, show, hide
    console.log('=== function hideShowBlock() ===');
    console.log('id_div: ',id_div);

    let divElement;

    if (typeof id_div === "string") {
        console.log("Es un string");
        divElement = document.getElementById(id_div);
    } else if (id_div instanceof HTMLElement) {
        console.log("Es un elemento HTML");
        divElement = id_div;
    } else {
        console.log("Otro tipo");
        alert('Error: el parámetro debe ser un string o un elemento HTML');
        return;
    }

    const block_css = window.getComputedStyle(divElement);
    const block_display = block_css.display;

    let next_display = '';//para guardar en localStorage

    if(action == 'toggle'){
        if(block_display == 'block'){//si es visible
            next_display = 'none';//oculto
        }else{//muestro
            next_display = 'block';//muestro
        } 
    }else{
        if(action == 'show'){
            next_display = 'block';//muestro
        }
        if(action == 'hide'){
            next_display = 'none';//muestro
        }
    }
 
    //aplico el cambio
    divElement.style.display = next_display;

    //guardo variable en localStorage
    //titulos
    if(id_div == 'title_detalles'){
        display_title_detalles = next_display;
        localStorage.setItem('display_title_detalles',display_title_detalles);
    }

    //detalles de la canción
    if(id_div == 'form_detalles'){
        display_form_detalles = next_display;
        localStorage.setItem('display_form_detalles',display_form_detalles);
    }

    //Ajustes personalizados
    if(id_div == 'form_detalles_pers'){
        display_form_detalles_pers = next_display;
        localStorage.setItem('display_form_detalles_pers',display_form_detalles_pers);
    }  
}


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

        const response = await fetch('../app/php/insertar_cliente_datos.php', {
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
            throw new Error(`HTTP (error insertar_cliente_datos.php) ${response.status}`);
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
            
            console.error('❌ JSON inválido en insertar_cliente_datos.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en insertar_cliente_datos.php',
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
                eid_contenedor_clientes.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

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
        
        if(!hay_id_cliente('deleteClienteFromBd()')){
            return; // <- se detiene aquí si no hay id_cliente
        } 
               
        const response = await fetch('../app/php/eliminar_cliente_datos.php', {
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
            throw new Error(`HTTP (error eliminar_cliente_datos.php) ${response.status}`);
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
            
            console.error('❌ JSON inválido en eliminar_cliente_datos.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en eliminar_cliente_datos.php',
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en deleteClienteFromBd(): error.message: ', error.message);
    }
}


function esString(valor) {
    return typeof valor === "string";
}

function esObjeto(valor) {
    return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function esArray(valor) {
    return Array.isArray(valor);
}


function clear_inpt(param){
    let thisInpt = document.getElementById(`inpt_${param}`);
    thisInpt.value = '';
    thisInpt.focus();
}

function normalizeSearchText(text) {
    return text
        // 1) minúsculas
        .toLowerCase()

        // 2) normalizar Unicode
        .normalize('NFD')

        // 3) eliminar diacríticos SOLO de letras latinas
        .replace(/(?<=\p{Script=Latin})\p{Mn}+/gu, '')

        // 4) recomponer Unicode
        .normalize('NFC')

        // 5) proteger apóstrofe entre letras
        .replace(/(\p{L})'(\p{L})/gu, '$1§§§$2')

        // 6) eliminar puntuación y símbolos
        .replace(/[^\p{L}\p{N}§ ]+/gu, ' ')

        // 7) restaurar apóstrofe
        .replace(/§§§/g, "'")

        // 8) normalizar espacios
        .replace(/\s+/g, ' ')
        .trim();
}


function pintClienteActive(){//click en div del contenedor de clientes que ya están en el DOM
    console.log('=== function pintClienteActive(e) === ');

    console.log('asignado global --- id_cliente: ', id_cliente);
    
    //resetPSongActive(eid_bl_songs_finded);//new
    resetDivActive(eid_contenedor_clientes, 'd_cliente');
    eid_contenedor_clientes.querySelector(`.d_cliente[data-id_cliente="${id_cliente}"]`).classList.add('active');

    //dejo '==' en vez de '===' porque id_cliente viene como string: "925"
    objCliente = objDataClientes.arr_data.find(c => c.id_cliente == id_cliente);
    console.log('objCliente: ', objCliente);

    pintClienteActiveSoloDatos();

}

function pintClientesAll(){//pintar todos los div de clientes, o al load o al find
    console.log('=== function pintClientesAll() === ');

    if(!objDataClientes || !objDataClientes.arr_data || objDataClientes.arr_data.length === 0){
        console.warn('No hay clientes en objDataClientes.arr_data');
        return;
    }    
   
    //CREAR DIV'S Y P'S
    //Recorrer clientes encontradas... 
    objDataClientes.arr_data.forEach( obj => {
        console.log('obj: ', obj);

        pintClienteOne(obj, 'abajo');//cada div de cliente se pinta al final (abajo)
    });
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






function promtConClaveSecreta() {//temporal
    const CLAVE_SECRETA = "eliminar"; // Tu clave definida
    
    // Lanzamos el cuadro de entrada
    let passwordInput = prompt("⚠️ Acción crítica: Introduce la clave secreta para eliminar:");

    // 1. Si el usuario cancela, passwordInput será null
    if (passwordInput === null) {
        alert("❌ Eliminación cancelada por el usuario.");
        return; 
    }

    // 2. Validamos la clave
    if (passwordInput === CLAVE_SECRETA) {
        // Aquí ejecutas la lógica de eliminación real
        alert("✅ Clave correcta. Procedo a eliminar.");
        return true;
        // ejecutarEliminacion(); 
    } else {
        // Si falla, avisamos
        alert("❌ Clave incorrecta. Acceso denegado.");
        return false;
    }
}


async function findWordsCliente(){
    console.log('=== async function findWordsCliente() ===');
    console.time('time_findWordsNew');

    const eid_inpt_find_cliente = document.getElementById('inpt_find_cliente');
    const eid_modo_cliente = document.getElementById('modo_cliente');
    const eid_buscar_en_cliente = document.getElementById('buscar_en_cliente');

    let words_input_trimed = eid_inpt_find_cliente.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_cliente.value;
    let buscar_en = eid_buscar_en_cliente.value;
    //console.log('--- words_input: ', words_input);

    if(words_input == ''){
        console.log('1. no has introducido nada....');
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
        return;
    }

    objFindClienteParams.words_input = words_input;
    objFindClienteParams.modo = modo;
    objFindClienteParams.buscar_en = buscar_en;

    objDataClientesBd = await getDataClientesFromBdByFind(objFindClienteParams);
    console.log('objDataClientesBd: ', objDataClientesBd);
    
    eid_contenedor_clientes.innerHTML = '';//reset contenedor de clientes

    //si no hay nada...
    let hay_coincidencias = (esObjeto(objDataClientesBd) && objDataClientesBd.arr_data.length > 0);//true o false

    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_clientes.innerHTML = `
            <p class="prim">No se encontraron clientes con la frase: "<b>${words_input_trimed}</b>"</p>
        `;
    }

    if(hay_coincidencias){
        console.log('hay coincidencias...');
        
        //Clono objeto
        objDataClientes = structuredClone(objDataClientesBd);
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

        pintClientesAll();

    }

    console.timeEnd('time_findWordsNew');
}



async function getClientesAll(){
    console.log('=== async function getClientesAll() ===');
    console.time('time_getClientesAll');

    objDataClientesBd = await getDataClientesAllFromBd();//la funcion que saca todos los cliente para pintarlo
    console.log('objDataClientesBd: ', objDataClientesBd);
    
    eid_contenedor_clientes.innerHTML = '';//reset contenedor de clientes

    const hay_coincidencias = (esObjeto(objDataClientesBd) && objDataClientesBd.arr_data.length > 0);//true o false

    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        eid_contenedor_clientes.innerHTML = `
            <p class="prim">No existe ningún cliente en la base de datos.</p>
        `;
    }

    if(hay_coincidencias){
        console.log('hay coincidencias...');
        
        //Clono objeto
        objDataClientes = structuredClone(objDataClientesBd);
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

        pintClientesAll();

    }

    console.timeEnd('time_getClientesAll');
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
               
        const response = await fetch('../app/php/obtener_clientes_datos_all.php', {
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
            throw new Error(`HTTP (error obtener_clientes_datos_all.php) ${response.status}`);
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
            
            console.error('❌ JSON inválido en obtener_clientes_datos_all.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en obtener_clientes_datos_all.php',
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
                    value="Demko">
                <div class="clear_inpt" onclick="clear_inpt('find_cliente')">&times;</div>
            </div>

            <button id="btn_ok_find" class="btn_search" title="Buscar" onclick="findWordsCliente()">
                <img class="btn_img" src="./images/search_zoom_icon_white.svg"><!--Find-->
            </button>

        </div><!--/.wr_nav-->  
    
    
        <div class="wr_sel_opt_find m_0">
            <h5>Modo de búsqueda:</h5>
            <select id="modo_cliente" class="sel_opt_find">
                <option value="1">1) Todas las palabras (pueden ser parte de otras palabras, sin importar orden)</option>
                <option value="2">2) Todas las palabras (no pueden ser parte de otras palabras, sin importar orden)</option>
                <option value="3">3) Coincidir al menos una palabra</option>
                <option value="4">4) Palabras en el orden establecido</option>
                <option value="5" selected>5) Frase exacta</option>
                <option value="6">6) Palabras exactas (no pueden ser parte de otras palabras, sin importar orden)</option>
            </select>
        </div>

        <div class="wr_sel_opt_find">
            <h5>Campos de búsqueda:</h5>
            <select id="buscar_en_cliente" class="sel_opt_find">
                <option value="1">1) Todos los campos por defecto disponibles (rápido)</option>
                <option value="2">2) Todos los campos disponibles (lento)</option>
                <option value="3">3) Todos los campos de texto disponibles</option>
                <option value="4">4) Todos los campos de números disponibles</option>
                <option value="5">5) Sólo el identificador de cliente</option>
                <option value="6">6) Sólo el nombre</option>
                <option value="7">7) Sólo el teléfono</option>

            </select>
        </div>
    `;

    const eid_inpt_find = wr_args_busqueda.querySelector('#inpt_find_cliente');

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
            //await findWordsCliente();
        }, 400);
    };

    eid_bl_modalFullInner.append(wr_args_busqueda);

    console.log('fin func');
}

async function getDataClientesFromBdByFind(objFindClientesParams){
    console.log('=== function getDataClientesFromBdByFind(words_input) ===');

    let {words_input, modo, buscar_en} = objFindClientesParams;

    try {
        
        if(!words_input && modo != 'all'){
            alert('No hay words_input. hago return...');//'No hay todos los parametros necesarios.'
            return;
        }
               
        const response = await fetch('../app/php/obtener_clientes_by_find.php', {
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
            throw new Error(`HTTP (error obtener_clientes_by_find.php) ${response.status}`);
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
            
            console.error('❌ JSON inválido en obtener_clientes_by_find.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en obtener_clientes_by_find.php',
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en getDataClientesFromBdByFind(): error.message: ', error.message);
    }
}

async function getDataClientesFromBdAll(){
    console.log('=== function getDataClientesFromBdAll() ===');

    try {
               
        const response = await fetch('../app/php/obtener_clientes_all.php', {
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
            throw new Error(`HTTP (error obtener_clientes_by_find.php) ${response.status}`);
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
            
            console.error('❌ JSON inválido en obtener_clientes_by_find.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en obtener_clientes_by_find.php',
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en getDataClientesFromBdByFind(): error.message: ', error.message);
    }
}


function manejarLogin(){
    console.log('=== function manejarLogin() ===');

    if(hay_usuario_logueado){
        let aviso_html = `
            <h3>Bienvenido de nuevo, ${username}!</h3>
            <p>${email}</p>
            <p>Puedes añadir clientes, crear productos, pedidos y guardar tus ajustes personales.</p>
            <div class="wr_btns_vertical">
                <button class="btn" onclick="window.location.href = '../home';">Inicio</button>            
                <button class="btn" onclick="window.location.href = '../login';">Login</button>            
                <button class="btn" onclick="window.location.href = '../logout';">Cerrar sesión</button>            
            </div>
        `;

        showToast('ok', aviso_html, 1000, 'center', true, 'Sesión iniciada correctamente.');
        return;
    }else{
        //alert('no hay_usuario_logueado');
        window.location.href = '../login';//redirecciono a login para que se loguee y luego vuelva a la pantalla
    }
}


