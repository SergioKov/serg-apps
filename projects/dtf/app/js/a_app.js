//=================================================================//
// start - F U N C T I O N S  
//=================================================================//

async function init() {
    //await crear_objSongbooks();

    //await crear_objGrupos();   
    await loadAlmacenesAll();   
    await loadClientesAll();   
    await loadProductosAll();   
    await loadServiciosAll();   
    await loadBonosAll();   
    await loadTarifasAll();   
    await loadTaquillasAll(); 
    await loadPedidosAll(); 
    await loadMovimientosAll(); 
    await loadConceptosAll(); 
    
    showBlockName(BlockNameActive);
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
            case 'almacen':
                id_almacen = Number(d_art.dataset.id_almacen);
                break;
        
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

    localStorage.setItem('BlockNameActive', blockName);

    if(blockName == 'taquillas'&& id_almacen_uso){
        pintDivSelected('d_almacenes', eid_d_almacenes, id_almacen_uso);
    }
}



function hay_id(id, id_name, func_name = ''){
    console.log('=== function hay_id() ===');
    
    if(!id){
        console.warn(func_name + ` --- No hay ${id_name}. id: [${id}]. hago return...`);
        //alert(func_name + ' --- No hay id_lista. hago return...');

        let text_aviso = '';

        switch (id_name) {
            case 'id_almacen':
                text_aviso = 'No has seleccionado ningún almacen. Ve a la pestaña "almacenes" para seleccionar o crear un almacen nuevo.';
                break;
        
            case 'id_cliente':
                text_aviso = 'No has seleccionado a ningún cliente. Ve a la pestaña "clientes" para seleccionar o crear un cliente nuevo.';
                break;
        
            default:
                break;
        }

        showToast('info', text_aviso, 1000, 'center');
        return false;
    }
    console.log(func_name, ' --- id_name: ', id_name, ' --- id:', id);

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
        //const ejemplo_btn = '<button class="toast_close" onclick="this.parentElement.remove()">×</button>';

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


function getDiaSemana(fechaStr) {
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

//de momento no se usa!
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

function pintFiltrosAplicados(contenedor, objDataPint){
    console.log('=== function pintFiltrosAplicados() ===');

    //pinto Filtros aplicados
    contenedor.querySelector('.f_frase').textContent = objDataPint.f_frase;
    contenedor.querySelector('.f_num').textContent = objDataPint.f_num;

    contenedor.querySelector('.wr_filtros_aplicados').innerHTML = '';//reset
    contenedor.querySelector('.wr_filtros_aplicados').append(objDataPint.element_inner);
    
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




function manejarAlgo(){
    console.log('=== function manejarAlgo() ===');

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
    
}





function resetDivActive(contenedor, element_class) {//Ej.: contenedor = eid_contenedor_clientes, element_class = 'd_cliente'//sin punto
    contenedor.querySelectorAll(`.${element_class}`).forEach(d => {
        d.classList.remove('active');
    });
}

function escaparHTML(texto) {
    if (texto == null) return texto;

    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}



async function update_obj_ajustes(){
    //console.log('=== function update_obj_ajustes() ===');
    localStorage.setItem('obj_ajustes', JSON.stringify(obj_ajustes));

    // if(hay_sesion){
    //     await guardarEnBd('ajustes', 'obj_ajustes', obj_ajustes);
    // }
}



/**
 * Hace que un elemento se muestre dentro de su contenedor sin mover el resto de la página
 * @param {HTMLElement} container - Contenedor con overflow scroll/auto
 * @param {HTMLElement} element - Elemento a mostrar
 * @param {boolean} smooth - Si true hace scroll suave
 * @param {string} block - 'top', 'center' hace scroll al top de contenedor o el centro verticalmente
 */
function scrollIntoViewInContainer(container, element, smooth = true, block = 'top') {
    if (!element || !container) return;

    // Posición del elemento relativa al contenedor
    const elementTop = element.offsetTop - container.offsetTop;
    const elementHeight = element.offsetHeight;
    const containerHeight = container.clientHeight;

    let targetScroll;
    let margin_top = 0;

    if (block === 'top') {
        // Scroll para alinear el elemento con la parte superior del contenedor
        targetScroll = elementTop + margin_top;
    } else if (block === 'center') {
        // Scroll para centrar el elemento en el contenedor
        targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2) + margin_top;
    } else {
        // Por defecto usamos 'top'
        targetScroll = elementTop + margin_top;
    }

    // Evitar scroll negativo
    if (targetScroll < 0) targetScroll = 0 + margin_top;

    // Evitar pasar del máximo scroll
    const maxScroll = container.scrollHeight - containerHeight;
    if (targetScroll > maxScroll) targetScroll = maxScroll;

    // Aplicar scroll
    if (smooth && 'scrollTo' in container) {
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
        container.scrollTop = targetScroll;
    }
}

function displayElementos(arr, show = true){
    arr.forEach(el => {
        if(show){
            el.classList.remove('d-none');
        }else{
            el.classList.add('d-none');
        }
    });
}

function crearItemsSelector({
    tipo_item,          //'producto','bono','servicio'
    datos,                  //objDataProductos.arr_data, objDataBonos.arr_data, objDataServicios.arr_data
    contenedor_lista_items, //eid_contenedor_lista_items donde se colocan todos los items de pedido
    contenedor,             //eid_contenedor_select_producto, eid_contenedor_select_bono, eid_contenedor_select_servicio
    clase,                  //'d_producto','d_bono','d_servicio'
    campoId,                //'id_producto','id_bono','id_servicio'
    campoPrecio,            //'precio_venta','precio','precio',
    mostrarCantidad         //función para mostrar la cantidad y su unidad => '1 m' o '1 ud.'
}) {
    console.log('=== function crearItemsSelector() ===');
    console.log('tipo_item:', tipo_item );

    if (!contenedor_lista_items || !contenedor || !datos?.length) {
        return;
    }

    contenedor.innerHTML = '';//reset del contenedor

    datos.forEach(obj => {

        const id = obj[campoId];//[campoId] porque campoId no es nombre de la propiedad. son diferentes.
        const nombre = obj.nombre;
        const precio = Number(obj[campoPrecio]);//[campoPrecio] porque son diferentes en cada elemento 

        // Crear elemento seleccionable
        const d_item = document.createElement('div');
        d_item.className = `d_item ${clase} d_art`;
        d_item.dataset.tipo_item = tipo_item;
        d_item.dataset.id_item = id;
        d_item.dataset.nombre = nombre;
        d_item.dataset.precio = precio;
        d_item.innerHTML = `
            <div class="datos_art">
                <div class="wr_id_nombre">
                    <div class="da_id">${id}</div>
                    <div class="da_nombre">${nombre}</div>
                </div>
            </div>

            <div class="wr_datos">
                ${mostrarCantidad ? `
                    <div class="art_cols art_col3">
                        <div>${mostrarCantidad(obj)}</div>
                    </div>
                ` : ''}

                <div class="art_cols art_col4">
                    <div>${precio} €</div>
                </div>
            </div>
        `;

        // Gestionar selección y click
        d_item.onclick = (e) => {
            console.log('d_item clicked:', d_item );


            if (contenedor.classList.contains('solo_ver')) {
                return;//no dejo cambiar el valor si es form_ver
            }

            const element = e.currentTarget;
            console.log('element:', element );

            const id_item = element.dataset.id_item;
            const nombre_item = element.dataset.nombre;
            const precio_item = Number(element.dataset.precio);

            if (!id_item) return;

            // Buscar el artículo existente por tipo_item e ID
            const item_existente = pedido.arr_items.find(
                item =>
                    String(item.id) === String(id_item) &&
                    item.tipo_item === tipo_item
            );

            if (item_existente) {
                // Actualizar artículo existente
                
                // Incrementar cantidad
                item_existente.cantidad += 1;

                // Buscar su elemento DOM
                const div_item_existente = [...contenedor_lista_items.querySelectorAll('.div_item')].find(
                    div =>
                        String(div.dataset.id_item) === String(id_item) &&
                        div.dataset.tipo_item === tipo_item
                );

                if (div_item_existente) {
                    
                    //si es producto,saco su precio de tarifas según cantidad de metros                    
                    if(item_existente.tipo_item === 'producto'){
                        actualizarPrecioProductoSegunTarifa(item_existente, div_item_existente);
                    }                    
                    
                    // Actualizar cantidad y precio
                    calcularImporteItem(
                        div_item_existente,
                        item_existente.cantidad,
                        item_existente.precio
                    );
                }

            } else {

                // Crear artículo nuevo
                const item = {
                    tipo_item: tipo_item,
                    id: id_item,
                    nombre: nombre_item,
                    cantidad: 1, //por defecto siempre 1
                    precio: precio_item,
                    importe: precio_item //se modifica luego
                };

                pedido.arr_items.push(item);//añado al array de pedido

                const div_item = crearDivItem(item);

                contenedor_lista_items.querySelector('.prim')?.remove();
                contenedor_lista_items.append(div_item);
                
                // Calcular cantidad y precio nuevos
                calcularImporteItem(
                    div_item,
                    item.cantidad,
                    item.precio
                );
            }
            
            // Recalcular total del pedido
            calcularTotal();
        };

        //añado al DOM
        contenedor.append(d_item);
    });
}


function actualizarPrecioProductoSegunTarifa(item, div_item) {
    if (item.tipo_item !== 'producto') return;

    const tarifa_producto = objDataTarifas.arr_data.find(
        tarifa =>
            String(tarifa.id_producto) === String(item.id) &&
            item.cantidad >= Number(tarifa.cantidad_desde) &&
            (
                !tarifa.cantidad_hasta ||
                item.cantidad <= Number(tarifa.cantidad_hasta)
            )
    );

    if(tarifa_producto){
        item.precio = Number(tarifa_producto.precio);
        div_item.dataset.precio = item.precio;
        console.log('new item.precio: ', item.precio);
    }
}


function cleanContenedor(contenedor){
    console.log('=== function cleanContenedor() ===');
    if(!contenedor) return;

    contenedor.innerHTML = '';//reset
}

function closeDivBySelector(selectorElemento){//=> 'd-none'
    console.log('=== function closeDivBySelector() ===');

    const divElement = document.querySelector(selectorElemento);    
    if(!divElement) return;

    divElement.classList.add('d-none');
}


function formatoImporte(valor) {
    return (Number(valor) || 0).toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).replace(/\./g, ' ').replace(',', '.');
}

function numeroPositivo(numero) {
    return Math.abs(Number(numero) || 0);
}

function resetId(id_name, contenedor, input_id){
    console.log('=== function resetId() ===');

    if(!id_name || !contenedor || !input_id){
        alert('no hay parametros necesarios pàra resetera el identificador.');
        return;
    }

    switch (id_name) {
        case 'id_cliente':
            id_cliente = null;//reset
            input_id.value = '';//reset
            objCliente = {};//reset
            pintDatosClienteFinded(contenedor, objCliente, input_id);
            break;

        case 'id_concepto':
            id_concepto = null;//reset
            input_id.value = '';//reset
            objConcepto = {};//reset
            pintDatosConceptoFinded(contenedor, objConcepto, input_id);
            break;

        case 'id_concepto_padre':
            id_concepto_padre = null;//reset
            input_id.value = '';//reset
            objConceptoPadre = {};//reset
            pintDatosConceptoFinded(contenedor, objConceptoPadre, input_id);
            break;

        case 'id_pedido':
            id_pedido = null;//reset
            input_id.value = '';//reset
            objPedido = {};//reset
            pintDatosPedidoFinded(contenedor, objPedido, input_id);
            break;
    }
}


function pintContenedorEstado(contenedor, estado_val){
    
    if(!contenedor){
        return;
    }

    switch (contenedor.id) {
        //Taquilla
        case 'wr_estado_taquilla'://estado_taquilla
            if(['libre','ocupado'].includes(estado_val)){
                contenedor.className = `wr_sel_opt_estado ${estado_val}`; 
            }else{
                contenedor.className = `wr_sel_opt_estado`;
            }    
            break;

        //Pedido
        case 'wr_estado_pedido'://estado_pedido
            if(['en_preparacion', 'impreso', 'en_oficina', 'entregado'].includes(estado_val)){
                contenedor.className = `wr_sel_opt_estado ${estado_val}`;
            }else{
                contenedor.className = `wr_sel_opt_estado`;
            }    
            break;

        case 'wr_tipo_pago'://tipo_pago
            if(['normal', 'recurrente'].includes(estado_val)){
                contenedor.className = `wr_sel_opt_estado ${estado_val}`;
            }else{
                contenedor.className = `wr_sel_opt_estado`;
            }    
            break;  

        case 'wr_metodo_pago'://metodo_pago
            if(['efectivo', 'bizum', 'tarjeta', 'transferencia'].includes(estado_val)){
                contenedor.className = `wr_sel_opt_estado ${estado_val}`;
            }else{
                contenedor.className = `wr_sel_opt_estado`;
            }    
            break;  

        case 'wr_estado_pago'://estado_pago
            if(['pendiente', 'parcial', 'pagado'].includes(estado_val)){
                contenedor.className = `wr_sel_opt_estado ${estado_val}`;
            }else{
                contenedor.className = `wr_sel_opt_estado`;
            }    
            break;

    
        default:
            break;
    }

}


function fechaMySQLLocal(tipo_data = 'fecha_hora_larga', fecha = new Date()) {//tipo_data 'hora_corta' o 'hora_larga'
    
    if (typeof fecha === 'string') {
        fecha = new Date(fecha.replace(' ', 'T'));//convierto fecha MySQL '2026-10-22 07:42:59' a fecha JS
    }

    const pad = n => String(n).padStart(2, '0');//pad => funcion equivalente a function pad(n){...}

    const fechaStr = `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
    const horaCorta = `${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
    const horaLarga = `${horaCorta}:${pad(fecha.getSeconds())}`;

    switch (tipo_data) {
        case 'fecha_hora_larga':
        default:
            return `${fechaStr} ${horaLarga}`;//'2026-10-22 07:42:59'
    
        case 'fecha_hora_corta':
            return `${fechaStr} ${horaCorta}`;//'2026-10-22 07:42'

        case 'solo_fecha':
            return fechaStr;//'2026-10-22'
                        
        case 'solo_hora_corta':
            return horaCorta;//'07:42'
    
        case 'solo_hora_larga':
            return horaLarga;//'07:42:59'
    }

}


function convertirToTitleCase(text) {//'aaa' => 'Aaa'
    console.log('=== function convertirToTitleCase() ===');
    
    if(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }else{
        return text;
    }
}


function toggleContenedor(id_contenedor, id_btn, tipo_display = 'block') {//tipo_display: 'flex', 'grid', 'block'
    const contenedor = document.getElementById(id_contenedor);
    const btn = document.getElementById(id_btn);
    const eid_estado_pedido = document.querySelector('#form_pedido #estado_pedido');

    if(eid_estado_pedido?.value == 'entregado'){
        const text_show = 'El pedido con estado <b>ENTREGADO</b> no puede tener una taquilla asignada ya que su contenido ha sido recogido.';
        showToast('warn', text_show, 1000, 'center', true);
        return;
    }

    if (contenedor) {
        const display_actual = contenedor.style.display;
        const is_hidden = contenedor.classList.contains('d-none');

        if(display_actual === 'none' || is_hidden){
            // contenedor.style.display = tipo_display;
            contenedor.classList.remove('d-none');
            contenedor.classList.add(`d-${tipo_display}`);
            btn.textContent = 'Ocultar taquillas';
        }else{
            // contenedor.style.display = 'none';
            contenedor.classList.remove(`d-${tipo_display}`);
            contenedor.classList.add('d-none');
            btn.textContent = 'Mostrar taquillas';
        }
    }
}


function ocultarContenedor(id_contenedor, id_btn, tipo_display = 'block') {//tipo_display: 'flex', 'grid', 'block'
    const contenedor = document.getElementById(id_contenedor);
    const btn = document.getElementById(id_btn);

    if (contenedor) {
        contenedor.classList.remove(`d-${tipo_display}`);
        contenedor.classList.add('d-none');
        btn.textContent = 'Mostrar taquillas';
    }
}


function mostrarContenedor(id_contenedor, id_btn, tipo_display) {//tipo_display: 'flex', 'grid', 'block'
    const contenedor = document.getElementById(id_contenedor);
    const btn = document.getElementById(id_btn);

    if (contenedor) {
        contenedor.classList.remove('d-none');
        contenedor.classList.add(`d-${tipo_display}`);
        btn.textContent = 'Ocultar taquillas';
    }
}