//=================================================================//
// start - F U N C T I O N S  
//=================================================================//

async function init() {
    //await crear_objSongbooks();

    //await crear_objGrupos();   
    await loadAlmacenesAll();   
    await loadClientesAll();   
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
