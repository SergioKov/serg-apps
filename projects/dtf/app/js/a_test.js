function generarSQLInsertMultiple(datos, id_songbook, lang_val) {
    let values = [];

    datos.forEach(item => {
        
        const song_number = item.number ?? 'NULL';
        const title = item.title ? `'${item.title.replace(/'/g, "''")}'` : "''";
        const category = item.category ?? 0;
        const songbook = item.songbook ?? id_songbook;//mirar en bd
        const song_text = item.song_text ? `'${item.song_text.replace(/'/g, "''")}'` : "''";
        const tune = item.tune ? `'${item.tune.replace(/'/g, "''")}'` : "''";
        const tune_transpose = item.tune_transpose ? `'${item.tune_transpose.replace(/'/g, "''")}'` : "''";
        const tipo_acorde = item.tipo_acorde ? `'${item.tipo_acorde.replace(/'/g, "''")}'` : "''";
        const tipo_fuente = item.tipo_fuente ? `'${item.tipo_fuente.replace(/'/g, "''")}'` : "''";
        const url_youtube = item.url_youtube ? `'${item.url_youtube.replace(/'/g, "''")}'` : "''";
        const url_recurso = item.url_recurso ? `'${item.url_recurso.replace(/'/g, "''")}'` : "''";
        const tempo_bpm = item.tempo_bpm ? `'${item.tempo_bpm.replace(/'/g, "''")}'` : "''";
        const words = item.words ? `'${item.words.replace(/'/g, "''")}'` : "''";
        const music = item.music ? `'${item.music.replace(/'/g, "''")}'` : "''";
        const notes = item.notes ? `'${item.notes.replace(/'/g, "''")}'` : "''";
        const lang = `'${lang_val}'` ?? "''";//fijate en el nombre de songbook
        const count = item.count ?? 0;
        const created_at = convertirFecha(item.date) ?? 'NULL';

        values.push(`(${song_number}, ${title}, ${category}, ${songbook}, ${song_text}, ${tune}, ${tune_transpose}, ${tipo_acorde}, ${tipo_fuente}, ${url_youtube}, ${url_recurso}, ${tempo_bpm}, ${words}, ${music}, ${notes}, ${lang}, ${count}, ${created_at})`);
    });

    const sql = `INSERT INTO songs (song_number, title, category, songbook, song_text, tune, tune_transpose, tipo_acorde, tipo_fuente, url_youtube, url_recurso, tempo_bpm, words, music, notes, lang, count, created_at) VALUES ${values.join(',\r\n')};`;

    return sql;
}




async function getSong(id_song){
    const obj = await getDataSongFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('(getSong) --- obj: ', obj);
}


async function getLista(id_lista_pram){
    id_lista = id_lista_pram;
    const obj = await getDataListaFromBd();//IMPORTANTE para cojer todos los datos necesarios
    console.log('(getLista) --- obj: ', obj);
}























//click sobre Book, Chapter, Verse en vklad_nav de sidebar
function clickLCR(e, param, id_contenedor, cols_number = 2, esquema_vklad = null){
    console.log('=== function clickLCR() ===');

    const contenedor = document.getElementById(id_contenedor);//'block_buscar', 'block_esquema'
    let contenedorBtns ;//'#block_buscar_head .wr_lcr'
    let contenedorBlocks;
    
    if(!contenedor) return;
    
    if(id_contenedor == 'block_esquema' && esquema_vklad){
        switch (esquema_vklad) {
            default:
            case 'ver_esquema':
                contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head .vklad_ver_esquema .wr_lcr`);
                contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body .vklad_ver_esquema`);
                break;
                
            case 'crear_esquema':
                contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head .vklad_crear_esquema .wr_lcr`);
                contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body .vklad_crear_esquema`);
                break;
                
            case 'select_slide':
                contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head .vklad_select_slide .wr_lcr`);
                contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body .vklad_select_slide`);
                break;        
        }
    }else{
        contenedorBtns = contenedor.querySelector(`#${id_contenedor}_head  .wr_lcr`);//'#block_buscar_head .wr_lcr'
        contenedorBlocks = contenedor.querySelector(`#${id_contenedor}_body`);//'#block_buscar_body'
    }
    
    resetLcrActiveEn(contenedorBtns);
    e.classList.add('lcr_active');

    resetLineActiveEn(contenedorBtns);
    resetBlActiveEn(contenedorBlocks);
        
    const ecl_lcr_line = contenedorBtns.querySelector('.lcr_line');

    switch (param) {
        default:
        case 'l': //Select Block Left
            ecl_lcr_line.classList.add( (cols_number == 2) ? 'line_2l' : 'line_3l');
            contenedorBlocks.querySelector('.bl_parte_l').classList.add('bl_active');
            break;
    
        case 'c': //Select Block Central
            ecl_lcr_line.classList.add( (cols_number == 2) ? 'line_2c' : 'line_3c');
            contenedorBlocks.querySelector('.bl_parte_c').classList.add('bl_active');
            break;
    
        case 'r': //Select Block Right
            ecl_lcr_line.classList.add( (cols_number == 2) ? 'line_2r' : 'line_3r');
            contenedorBlocks.querySelector('.bl_parte_r').classList.add('bl_active');
            break;
    }

    switch (id_contenedor) {
        default:
        case 'block_buscar':
            mySizeBuscar();
            break;

        case 'block_esquema':
            mySizeEsquema();
            break;

        case 'block_cancion':
            mySizeCancion();
            break;

        case 'block_ejemplo':
            mySizeEjemplo();
            break;

        case 'block_lista':
            mySizeLista();
            break;
    }

}


function resetBlActiveEn(contenedor){
    console.log('contenedor:' , contenedor);
    contenedor.querySelectorAll('.partes').forEach(bl => {
        console.log('bl:' , bl);
        
        bl.classList.remove('bl_active');
    })
}

function resetLcrActiveEn(contenedor){
    console.log('contenedor:' , contenedor);

    if(!contenedor) return;
    
    //Botones grandes arriba de seleccionar: 'bl_parte_l', 'bl_parte_c', 'bl_parte_r'
    contenedor.querySelectorAll('.v_lcr').forEach(v_lcr => {
        console.log('v_lcr:' , v_lcr);
        v_lcr.classList?.remove('lcr_active');
    });
}

function resetLineActiveEn(contenedor){
    const lcr_line = contenedor.querySelector('.lcr_line');
    console.log('contenedor:' , contenedor);
    console.log('lcr_line:' , lcr_line);

    const arr_line_clases = ['line_2l','line_2r', 'line_3l','line_3c','line_3r'];
    arr_line_clases.forEach(cl => {
        console.log('cl:' , cl);
        if(lcr_line.classList.contains(cl)){
            lcr_line.classList.remove(cl);
        }                
    })
}


function mostrarElemento(elemento){
    if(!elemento) return;
    elemento.classList.remove('d-none');
    elemento.classList.add('d-block');
}
function ocultarElemento(elemento){
    if(!elemento) return;
    elemento.classList.remove('d-block');
    elemento.classList.add('d-none');
}


function mostrarElementosPrimEn(elemento){
    if(!elemento) return;
    elemento.querySelector('.opt_prim')?.classList.remove('d-none');
    elemento.querySelector('.opt_prim')?.classList.add('d-block');
}
function ocultarElementosPrimEn(elemento){
    if(!elemento) return;
    elemento.querySelector('.opt_prim')?.classList.remove('d-block');
    elemento.querySelector('.opt_prim')?.classList.add('d-none');
}


function mostrarElementosEditablesEn(elemento){
    if(!elemento) return;
    elemento.classList.remove('prim_shown');
    elemento.classList.add('edit_shown');
}
function ocultarElementosEditablesEn(elemento){
    if(!elemento) return;
    elemento.classList.remove('edit_shown');
}
















async function guardarArrPantallaEnBd(){
    console.log('=== function guardarArrPantallaEnBd() ===');

    try {

        if(arr_pantalla.length == 0){
            // alert('en guardarArrPantallaEnBd() --- arr_pantalla es vacio... hago return.');
            console.warn('en guardarArrPantallaEnBd() --- arr_pantalla es vacio... hago return.');
            return;
        }

        const data = await insertarArrPantalla();
        console.log('data: ',data);

        let text_show;

        if(data.success){
            // '1. insertado/actualizado con éxito.
            text_show = `${data.mensaje}`;
            text_show += (debug) ? `\n(${data.action_tipo})` : '' ;
            console.log(text_show);

            if(hayElementosModalesAbiertos()){
                showToast('ok', text_show, 5000);
            }

            if(data.id_song){
                console.log('id_song: ', data.id_song);
            }
            
        }else{
            
            //2. Error al insertar/actualizar datos
            text_show = `${data.error}`;
            console.error('(ERROR) --- text_show: ', text_show);
            console.error('(ERROR) --- data: ', data);

            if(hayElementosModalesAbiertos()){
                showToast('error', text_show, 5000);
            }
        }
        return data;

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarArrPantallaEnBd(). error: ',error);        
    }

}


async function insertarArrPantalla() {
    console.log('=== function insertarArrPantalla() ===');

    const {id_song, slide_actual} = objPantallaToSendToBd;//

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(!id_song || isNaN(slide_actual) ){
            // alert('222. No hay todos los parametros necesarios (id_song, slide_actual) de la cancion...');//'No hay todos los parametros necesarios.'
            console.warn('222a. No hay todos los parametros necesarios (id_song, slide_actual) de la cancion...');//'No hay todos los parametros necesarios.'
            return;
        }


        objPantallaToSendToBd_str = JSON.stringify(objPantallaToSendToBd);//variable global
        console.log('objPantallaToSendToBd_str: ', objPantallaToSendToBd_str);

        const response = await fetch('../song/php/insertar_arr_pantalla.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objPantallaToSendToBd_str
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }
        
        let data;
        if(debug){
            data = await response.text();//test
        }else{
            data = await response.json();
        }
        console.log('data: ',data); 
        
        return data;

    } catch (error) {
        console.error('Error en la función insertarSongPantalla: ', error);
    }
}








async function guardarPantallaParamsEnBd(){
    console.log('=== function guardarPantallaParamsEnBd() ===');

    try {

        if(arr_pantalla.length == 0){
            //alert('en guardarArrPantallaEnBd() --- arr_pantalla es vacio... hago return.');
            console.warn('en guardarPantallaParamsEnBd() --- arr_pantalla es vacio... hago return.');
            return;
        }

        const data = await insertarPantallaParams();
        console.log('data: ',data);

        if(data.success){
            
            let text_show;
            text_show = '3. pantalla params insertado con éxito.';
            console.log(text_show);

            if(hayElementosModalesAbiertos()){
                showToast('ok', text_show, 5000);
            }

            if(data.id_song){
                console.log('id_song: ', data.id_song);
            }
            
        }else{
            
            let text_show = '3. Error al insertar pantalla params.';
            console.error('text_show: ', text_show);

            if(hayElementosModalesAbiertos()){
                showToast('error', text_show, 5000);
            }
        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarPantallaParamsEnBd(). error: ',error);        
    }

}


async function insertarPantallaParams() {
    console.log('=== function insertarPantallaParams() ===');

    const {id_song} = objPantallaToSendToBd;//

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `Si no aceptas cookies no puedes insertar datos. <a onclick="showBlockCookies(); closeModal(null,true);">Seleccionar Coockies</a>.`;
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        if(
            !id_song || 
            isNaN(pantalla_show) || 
            isNaN(tiempo_restante_show) || 
            isNaN(hora_actual_show) || 
            isNaN(show_logo_en_fondo) || 
            isNaN(show_imagen_en_fondo) || 
            isNaN(user_view_control) || 
            isNaN(show_legend) || 
            isNaN(show_acordes) || 
            isNaN(show_next_slide) || 
            isNaN(show_en_top) || 
            isNaN(show_en_parte_top) || 
            isNaN(show_en_center)
        
        ){
            // alert('222params. No hay todos los parametros necesarios (id_song, slide_actual) de la cancion...');//'No hay todos los parametros necesarios.'
            console.warn('222params. No hay todos los parametros necesarios (id_song, slide_actual) de la cancion...');//'No hay todos los parametros necesarios.'
            return;
        }

        objPantallaParamsToSendToBd_str = JSON.stringify(objPantallaParamsToSendToBd);//variable global
        console.log('objPantallaParamsToSendToBd_str: ', objPantallaParamsToSendToBd_str);

        const response = await fetch('../song/php/insertar_pantalla_params.php', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: objPantallaParamsToSendToBd_str
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos');
        }
        
        let data;
        if(debug){
            data = await response.text();//test
        }else{
            data = await response.json();
        }
        console.log('data: ',data); 
        
        return data;

    } catch (error) {
        console.error('Error en la función insertarPantallaParams. error: ', error);
    }
}








// no funciona correctamente...
// async function getPublicIP() {
//   const res = await fetch('https://api.ipify.org?format=json');
//   const data = await res.json();
//   return data.ip; // e.g. "203.0.113.45"
// }




/**
 * Limpia un HTML reemplazando comillas dobles (") en todo html por '__||__'
 * Limpia un HTML reemplazando comillas simples (') en todo html por '__|__'
 * para que sea seguro guardar en JSON en BD.
 * @param {string} html - El HTML completo.
 * @returns {string} HTML seguro para JSON/BD.
 */
function sanitizeHtmlForJson(html) {
    return html
        .replace(/"/g, '__||__')   // reemplaza todas las comillas dobles " por '__||__'
        .replace(/'/g, '__|__');   // reemplaza todas las comillas simples ' por '__|__'
}



/**
 * Revertir HTML sanitizado reemplazando '__||__' y '__|__' por comillas dobles y simples.
 * @param {string} sanitizedHtml - HTML con '__||__' y ''__|__' en todo.
 * @returns {string} HTML original con comillas dobles y simples.
 */
function restoreHtmlFromSanitized(sanitizedHtml) {
    return sanitizedHtml
        .replace(/__\|\|__/g, '"')  // reemplaza __||__ por "
        .replace(/__\|__/g, "'");   // reemplaza __|__ por '
}





/**
 * Quita saltos de línea y espacios **solo entre etiquetas**,
 * manteniendo el contenido interno intacto.
 * @param {string} html - HTML completo
 * @returns {string} HTML compacto
 */
function compactHtml(html) {
    return html
        // 1. Quitar saltos de línea y tabulaciones
        .replace(/[\n\r\t]/g, '')
        // 2. Quitar espacios **solo entre cierre y apertura de tags**
        //.replace(/>\s+(?=<)/g, '>') //dejo los espacios ya que en acordes son necesarios
        // 3. Quitar espacios al inicio y final del HTML completo
        .trim();
}
