






































async function crear_objSongbooks(){
    console.log('=== function crear_objSongbooks() ===');

    objSongbooks = await getSongbooksFromBd();
    console.log(`objSongbooks: `, objSongbooks);
}

async function crear_objGrupos(){
    console.log('=== function crear_objGrupos() ===');

    objGrupos = await getGruposFromBd();
    console.log(`objGrupos: `, objGrupos);
}


function pintSongbooksOptionsEnBuscar(selectElement){
    console.log('=== function pintSongbooksOptionsEnBuscar() ===');
    
    selectElement.innerHTML = '';//reset
    //Recorrer objSongbooks
    Object.values(objSongbooks).forEach( (songbook, i) => {
        if(i == 0){
            const option_def = document.createElement('option');
            option_def.value = '';
            option_def.innerHTML = `All songbooks`;
            selectElement.append(option_def);
        }

        const option = document.createElement('option');
        option.value = songbook.id_songbook;
        option.innerHTML = `${songbook.id_songbook}. ${songbook.title}`;
        selectElement.append(option);
    });
}


function pintGruposOptionsEnSelect(selectElement, id_grupo_selected = null){
    console.log('=== function pintGruposOptionsEnSelect() ===');
    
    selectElement.innerHTML = '';//reset

    if(!id_grupo_selected){
        //añado opción por defecto para no seleccionar ningún grupo
        selectElement.innerHTML = `
            <option value="" disabled="" selected="" hidden=""></option>
        `;
    }


    //Recorrer objGrupos
    Object.values(objGrupos).forEach( (grupo, i) => {
        const option = document.createElement('option');
        option.value = grupo.id_grupo;
        if(id_grupo_selected && grupo.id_grupo == id_grupo_selected){
            option.selected = true;
        }
        option.innerHTML = `${grupo.id_grupo}. ${grupo.nombre}`;
        selectElement.append(option);
    });
}


function pintSongbooksCheckboxEnBuscar(divElement){
    console.log('=== function pintSongbooksCheckboxEnBuscar() ===');
    
    divElement.innerHTML = '';//reset
    //Recorrer objSongbooks
    Object.values(objSongbooks).forEach( (songbook, i) => {

        const el_label = document.createElement('label');
        el_label.dataset.id = songbook.id_songbook;
        el_label.innerHTML = `
            <p>
                <input type="checkbox" name="songbooks" value="${songbook.id_songbook}">
                <span class="sp_number">${songbook.id_songbook}. </span>
                <span>${songbook.title}</span>
            </p>
        `;
        el_label.onclick = (e) => {
            const cbox = e.currentTarget.querySelector('input[type="checkbox"]');
            handleCheckbox(cbox);

            // const int_val = Number(e.currentTarget.dataset.id);

            // if(cbox.checked){
            //     if(!arr_songbooks.includes(int_val)){
            //         arr_songbooks.push(int_val);
            //     }
            // }else{
            //     const index = arr_songbooks.indexOf(int_val);
            //     if (index !== -1) {
            //         arr_songbooks.splice(index, 1); // Elimina 1 elemento en esa posición
            //     }
            // }
            // check_arr_songbooks();
        }
        divElement.append(el_label);
    });
}


function check_arr_songbooks(){
    console.log('=== function check_arr_songbooks() ===');
    console.log('arr_songbooks: ', arr_songbooks);

    btn_songbook_search.innerHTML = '';//reset
    
    arr_songbooks = arr_songbooks.sort((a, b) => a - b); // Orden ascendente 1,2,3
    console.log('(sorted) --- arr_songbooks: ', arr_songbooks);
    
    let arr_songbooks_str = arr_songbooks.join(', ');
    console.log('arr_songbooks_str: ', arr_songbooks_str);


    if(arr_songbooks.length > 0){
        btn_songbook_search.innerHTML = `
            Songbooks seleccionados (sólo ids): ${arr_songbooks_str}
        `;
    }else{
        btn_songbook_search.innerHTML = `
            Selecciona songbook:
        `;
    }
}


function scrollToSlide(index) {
    console.log('=== function scrollToSlide() ===');

    if (index < 0 || index >= slides.length) return;
    currentSlide = index;    

    switch (slideModo) {
        case 'smooth':
        case 'instant':
            const offset = index * window.innerWidth;
            carousel.scrollTo({ left: offset, behavior: slideModo });
            break;

        case 'fast':
        default:
            const offset_negativo = -index * window.innerWidth;
            console.log(' me muevo a offset_negativo: ', offset_negativo);

            slideContainer.style.transform = `translateX(${offset_negativo}px)`;//!IMPORTANTE: aki no 'carousel' sino 'slideContainer'
            break;
    }

    localStorage.setItem('currentSlide', index);
    pintSlideActive(index);

}


function scrollToCenter(element, container) {
    console.log('=== function scrollToCenter() ===');

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
  
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
  
    const offsetLeft = elementRect.left - containerRect.left;
    const offsetTop = elementRect.top - containerRect.top;
  
    const centerX = offsetLeft - (container.clientWidth / 2) + (element.clientWidth / 2);
    const centerY = offsetTop - (container.clientHeight / 2) + (element.clientHeight / 2);
  
    container.scrollTo({
      left: scrollLeft + centerX,
      top: scrollTop + centerY,
      behavior: 'smooth'
    });
}


function mostrar_calculando(){
    setTimeout(async ()=>{
        calculando.style.display = 'flex';
    },100);
}

function ocultar_calculando(){
    setTimeout(async ()=>{
        calculando.style.display = 'none';
    },300);
}


function ajustarTexto() {
    console.log('=== function ajustarTexto() ===');
    
    //paso 1
    mostrar_calculando();
    // setTimeout(async ()=>{
    //     calculando.style.display = 'flex';
    // },100);
    
    //paso 2
    setTimeout(async ()=>{
        
        const header = document.querySelector('header');
        const slideAll = document.querySelectorAll('.slide');

        const maxW = window.innerWidth - 32;//32; // padding
        const maxH = (window.innerHeight - 32) - header.offsetHeight;

        const coef_legend = 0.6;// 2/3 del tamaño de la fuente de texto de kuplet
        const legend_fontSize_max = 50;// tamaño maximo de la fuente de legend

        //recorrer...
        slideAll.forEach(slide => {
            //console.log('slide: ', slide);

            const slide_inner = slide.querySelector('.slide_inner');
            //console.log('slide_inner: ', slide_inner);

            const legend = slide.querySelector('legend');
            const legend2 = slide.querySelectorAll('legend')[1];
            //console.log('legend: ', legend);

            let fontSize = 10;
            slide.style.fontSize = fontSize + 'px';

            const clone = slide.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.visibility = 'hidden';
            clone.style.left = '-9999px';
            document.body.appendChild(clone);

            while (fontSize < 500) {//while() es mas rapido que for()
                clone.style.fontSize = fontSize + 'px';
                const { width, height } = clone.getBoundingClientRect();
                if (width > maxW || height > maxH) break;
                fontSize++;
            }

            slide.style.fontSize = (fontSize - 1) + 'px';
            if(legend){
                const legend_fontSize = (fontSize - 1) * coef_legend;
                const legend_fontSize_new = (legend_fontSize > legend_fontSize_max) 
                    ? legend_fontSize_max 
                    : legend_fontSize ;
                legend.style.fontSize = legend_fontSize_new + 'px';

                if(legend2){
                    legend2.style.fontSize = legend_fontSize_new + 'px';
                }
            }
            document.body.removeChild(clone);
        });

    },200);


    //paso 3
    ocultar_calculando();
    // setTimeout(async ()=>{
    //     calculando.style.display = 'none';
    // },300);
}


function pintBarras() {//no se usa...
    console.log('=== function pintBarras() ===');

    document.querySelectorAll('p.c').forEach(linea => {
        console.log('linea: ', linea);

        let linea_str = linea.textContent;
        let linea_new = '';

        if(linea.classList.contains('c')){
            console.log('es linea para acordes', linea);
        }

        // 2. Reemplazar barras "|" por span
        linea_str = linea_str.replace(/([|\/\-\(\)])/g, '<span class="barra">$1</span>');

        linea.innerHTML = linea_new;
    });
}


function pintParrafosAcordes() { 
    console.log('=== function pintParrafosAcordes() ===');

    // Regex para acordes: letra A-H + opcional # o b + opcional sufijo alfanumérico
    const regexAcorde = /([A-H](?:#|b)?\w*)/g;

    document.querySelectorAll('fieldset p.c').forEach(p => {
        let textOriginal = p.textContent;

        const regexTexto = /(\\([^()]*\\))|([|\/\-()])|(\s+)|([^\s|\/\-()]+)/g;//separa símbolos, espacios y texto y todo lo que esté dentro de ( ... ) como una sola pieza
        const partes = textOriginal.match(regexTexto);


        let resultado = partes.map(parte => {
            if ( ['|', '/', '-', '(', ')', ':','1.volta','2.volta','1. volta','2. volta','mod','mod.','||:', ':||'].includes(parte) ) {
                return `<span class="barra">${parte}</span>`;
            } else if (parte.trim() === '') {
                // return `<span class="espacio" data-length="${parte.length}">${parte}</span>`;
                let parte_new = parte.replace(/ /g, '<span>&nbsp;</span>');
                console.log('parte_new: ', parte_new);

                return `<span class="espacio" data-length="${parte.length}">${parte_new}</span>`;
            } else {
                return parte; // acordes u otros caracteres normales
            }
        }).join('');

        console.log('1. resultado: ',resultado);
        
        resultado = resultado.replace(regexAcorde, (match) => {
            return `<span class="acorde" data-original="${match}">${match}</span>`;
        });
        console.log('2. resultado: ',resultado);

        p.innerHTML = resultado;
    });

    //reemplazarEspaciosAcordes();
    console.log('=== end - function pintParrafosAcordes() ===');
}

function reemplazarEspaciosAcordes() {
    document.querySelectorAll('fieldset p.c .espacio').forEach(espacio => {
        espacio.innerHTML = espacio.textContent.replace(/ /g, '&nbsp;');
    });
}

function pintParrafosLlaves() {
    console.log('=== function pintParrafosLlaves() ===');
    const regexLlaves = /[{}]/g;

    document.querySelectorAll('fieldset p.t').forEach(p => {
        p.innerHTML = p.textContent.replace(
            regexLlaves,
            match => `<span class="llave">${match}</span>`
        );
    });
}


function transponerAcorde(acorde, semitonos) {
    const notasConDiez = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'];
    const notasConBemol = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'H'];

    // Regex para extraer nota raíz (letra A-G y opcional # o b)
    const regex = /^([A-H](?:#|b)?)(.*)$/;
    const match = acorde.match(regex);

    if (!match) return acorde; // no es acorde válido, devuelvo igual

    let [_, notaRaiz, sufijo] = match;

    // Determinar índice actual en los arrays, buscando en ambos para hallar nota equivalente
    let idx = notasConDiez.indexOf(notaRaiz);
    let usaBemolEnNotaOriginal = false;

    if (idx === -1) {
        idx = notasConBemol.indexOf(notaRaiz);
        if (idx === -1) {
            // No encontrada, devuelvo acorde original
            return acorde;
        }
        usaBemolEnNotaOriginal = true;
    }

    // Calcula nuevo índice con módulo 12 para la transposición
    let nuevoIdx = (idx + semitonos) % 12;
    if (nuevoIdx < 0) nuevoIdx += 12;

    // Según la preferencia del usuario y la nota original,
    // escoger la notación correcta (bemol o diez)
    let notaTranspuesta;
    
    switch (tipoAcorde) {
        case 'bemol':
            notaTranspuesta = notasConBemol[nuevoIdx];
            break;

        case 'diez':
        default:
            notaTranspuesta = notasConDiez[nuevoIdx];
            break;
    }

    return notaTranspuesta + sufijo;
}


function transponerTodosLosAcordes(semitonos) {
    currentTransposition = semitonos;
    const spans = document.querySelectorAll('span.acorde');
    spans.forEach(span => {
        const acordeOriginal = span.dataset.original;
        const acordeTranspuesto = transponerAcorde(acordeOriginal, semitonos);
        span.textContent = acordeTranspuesto;
    });
    localStorage.setItem('currentTransposition', currentTransposition);
    pintActTranspose(currentTransposition);
    //ajustarTexto();
    ajustarEspacios();
}


function resetTonalidad() {
    currentTransposition = 0;
    const spans = document.querySelectorAll('span.acorde');
    spans.forEach(span => {
        span.textContent = span.dataset.original;
    });
    localStorage.setItem('currentTransposition', currentTransposition);
    pintActTranspose(currentTransposition);
}


function transposeUp(){
    if(currentTransposition == 12) return;
    const value_new = currentTransposition + 1;
    transponerTodosLosAcordes(value_new);
}

function transposeDown(){
    if(currentTransposition == -12) return;
    const value_new = currentTransposition - 1;
    transponerTodosLosAcordes(value_new);
}

function pintActTranspose(valor){
    d_currentTransposition.querySelector('b').textContent = valor;
}


async function slideGo(dir){
    console.log('=== function slideGo() ===');

    //si no es calculado index of arr_lista, lo calculo...
    if(currentIndexOfArrLista === -1){       
        currentIndexOfArrLista = arr_lista.findIndex(item => item.id_song == id_song);
        console.log('currentIndexOfArrLista: ', currentIndexOfArrLista);
    }


    if(dir == 'next'){
        if(currentSlide < (totalSlides - 1) || currentSlide < (arr_esquema_bucle.length - 1) ){
            currentSlide++;
            scrollToSlide(currentSlide);
        }else{//es ultimo slide
            //alert('es ultimo slide');

            if(currentIndexOfArrLista < (arr_lista.length - 1) ){
                nextIndexOfArrLista = currentIndexOfArrLista;
                nextIndexOfArrLista++;

                id_song_next = arr_lista[nextIndexOfArrLista].id_song;
                lista_id_song = id_song_next;
                id_song = id_song_next;

                const p_lista_next = eid_block_lista.querySelector(`.p_lista[data-id_song="${id_song_next}"]`);
                console.log('ir a la canción next de la lista. id_song_next: ', id_song_next);

                if(hayElementosModalesAbiertos()){
                    showEdit('esquema');//para abrir si no se ve
                    showBlockName('esquema');//para abrir si no se ve
                }

                const btnElement = eid_block_esquema.querySelector('#btn_select_slide');
                showVklad(btnElement, param = 'select_slide');//función select_slide() se llama dentro

                await crearSlidesForSongOfLista(p_lista_next, id_song_next, cerrar_modales = false, show_ultimo_slide = false);

                scrollToSlide(currentSlide);
            }
        }        
    }

    if(dir == 'prev'){
        if(currentSlide > 0){
            currentSlide--;
            scrollToSlide(currentSlide);
        }else{//es primer slide

            if(currentIndexOfArrLista != 0 && currentIndexOfArrLista != -1){
                prevIndexOfArrLista = currentIndexOfArrLista;
                prevIndexOfArrLista--;

                id_song_prev = arr_lista[prevIndexOfArrLista].id_song;
                lista_id_song = id_song_prev;
                id_song = id_song_prev;

                const p_lista_prev = eid_block_lista.querySelector(`.p_lista[data-id_song="${id_song_prev}"]`);
                console.log('ir a la canción prev de la lista. id_song_prev: ', id_song_prev);

                if(hayElementosModalesAbiertos()){
                    showEdit('esquema');//para abrir si no se ve
                    showBlockName('esquema');//para abrir si no se ve
                }

                const btnElement = eid_block_esquema.querySelector('#btn_select_slide');
                showVklad(btnElement, param = 'select_slide');//función select_slide() se llama dentro
                
                let show_ultimo_slide;
                if(go_to_last_slide_of_prev_song){
                    show_ultimo_slide = true;//ir al ultimo slide de la cancion previa en modo Musicos
                }else{
                    show_ultimo_slide = false;//ir al primer slide de la cancion previa en modo Musicos
                }

                await crearSlidesForSongOfLista(p_lista_prev, id_song_prev, cerrar_modales = false, show_ultimo_slide);

                scrollToSlide(currentSlide);//ir al seleccionado slide de la cancion previa en modo Musicos
            }
        }
    }

    // const btn_simple = select_slide_wr_vista_btns.querySelector(`.btn[data-idx="${currentSlide}"]`);
    // if(esElementoVisible(btn_simple)){
    //     btn_simple.click();
    // }
    showOneSlideFrom(null, index_esquema = currentSlide);

    if(window.innerWidth < pantallaTabletMinPx){//mobile
        //alert('10. es mobil. hago btn_simple.click()...');
        btn_simple.click();
    }else{//desktop
       // alert('1. es desktop. calculo width...');
    }

}

function showMenu(){
    btn_menu.classList.remove('shown');
    menu_contenido.style.top = -menu_contenido.offsetHeight + 'px';
    menu_contenido.style.top = 0;
}

function hideMenu(){    
    btn_menu.classList.add('shown');    

    if(puntosMenu.classList.contains('shown')){
        closePuntosMenu();
        setTimeout(()=>{
            menu_contenido.style.top = -menu_contenido.offsetHeight + 'px';
        },300);
        setTimeout(()=>{
            menu_contenido.style.top = '-102%';
        },1000);
    }else{
        menu_contenido.style.top = -menu_contenido.offsetHeight + 'px';
        setTimeout(()=>{
            menu_contenido.style.top = '-102%';
        },1000);
    }
}



function closeAll(){
    hideEdit();
    hideMenu();
    closePuntosMenu();
}


function pintSlideActive(index){
    console.log('=== function pintSlideActive() ===');
    
    const slideAll = document.querySelectorAll('.slide');

    const divAll = document.querySelectorAll('.step');
    divAll.forEach((div_step,i) => {
        if(i == index){
            div_step.classList.add('active');
            //div_step.scrollIntoView({behavior: 'smooth'});//funciona ok, pero scrollToCenter() mejor
            
            const element = div_step;
            const container = barra_estado;
            scrollToCenter(element, container);

            slideAll[i].classList.add('active');
        }else{
            div_step.classList.remove('active');
            slideAll[i].classList.remove('active');
        }
    });
}

function pintTipoAcorde(){
    if(tipoAcorde === 'diez'){
        btn_diez.classList.add('btn_active');
        btn_bemol.classList.remove('btn_active');
    }
    else if(tipoAcorde === 'bemol'){
        btn_diez.classList.remove('btn_active');
        btn_bemol.classList.add('btn_active');
    }
}

function changeTipoAcorde(tipo){
    console.log('=== function changeTipoAcorde() ===');    
    if (['diez','bemol'].includes(tipo)) {
        
        tipoAcorde = tipo;
        localStorage.setItem('tipoAcorde', tipoAcorde);
        pintTipoAcorde();

        transponerTodosLosAcordes(currentTransposition);
        console.log(`Clic en .btn de tipo.`);
    }
}

function changeTipoFuente(tipo){
    console.log('=== function changeTipoFuente() ===');    
    if (['a','m'].includes(tipo)) {
        
        tipoFuente = tipo;
        localStorage.setItem('tipoFuente', tipoFuente);

        //tipo_fuente = tipo;//?...
        //localStorage.setItem('tipo_fuente', tipo_fuente);
        // pintTipoFuente();

        if(tipo == 'a'){//Arial
            removeMonospaceFont();//quito Monospace y se aplica 'Arial'
        } else if(tipo == 'm'){//Monospace
            addMonospaceFont();//añado Monospace y se aplica 'Monospace'
        }
        
        console.log(`Clic en .btn de tipo_fuente.`);
    }
}

function changeTranspose(direction){
    console.log('=== function changeTranspose() ==='); 
    
    if (['up','down'].includes(direction)) {        
        if(direction === 'up'){
            transposeUp();
        }
        else if(direction === 'down'){
            transposeDown();
        }
        console.log(`Clic en .btn de transpose.`);
    }    
}



function ajustarEspacios(){
    console.log('=== function ajustarEspacios() ===');    

    const pc_All = document.querySelectorAll('p.c');
    pc_All.forEach(p => {
        //console.log('p: ', p);

        p.childNodes.forEach((el, i, arr) => {
            //console.log('el: ', el);

            if(el.className == 'acorde'){
                //console.log('es acorde');

                //miro si su contenido es distinto que data.original
                if(el.dataset.original.length != el.textContent.length){
                    //console.log('es distinta length');

                    //miro si va espacios en el sig elemento
                    if(arr[i+1] && arr[i+1].className == 'espacio'){
                        //console.log('es distinta length.', arr[i+1].textContent.length);

                        let sig_string_length = parseInt(arr[i+1].dataset.length);
                        //console.log('sig_string_length', sig_string_length);
                        let new_string = '';

                        if(el.dataset.original.length > el.textContent.length){
                            //demo sumar un espacio en el siguiente elemento '.espacio'
                            new_string = generarEspacios(sig_string_length + 1);
                            console.log('[if] --- new_string.length', new_string.length);                            
                        }
                        else if(el.dataset.original.length < el.textContent.length){
                            //demo restar un espacio en el siguiente elemento '.espacio'
                            new_string = generarEspacios(sig_string_length - 1);
                            console.log('[else] --- new_string.length', new_string.length); 
                        }
                        // arr[i+1].textContent = new_string;
                        arr[i+1].innerHTML = new_string;
                    }
                }else{//si length de acorde es la de original, pongo los espacios del original
                    //miro si va espacios en el sig elemento
                    if(arr[i+1] && arr[i+1].className == 'espacio'){
                        const length_original = arr[i+1].dataset.length;
                        const new_string = generarEspacios(length_original);
                        //console.log('recupero la longitud original de los espacios. length_original', length_original); 
                        // arr[i+1].textContent = new_string;
                        arr[i+1].innerHTML = new_string;
                    }
                }

            }else{
                //console.log('--- No es acorde');
            }
        });        
    });
}

function generarEspacios(numero){
    if(numero > 0){
        // return ' '.repeat(numero);
        return '<span>&nbsp;</span>'.repeat(numero);//new
    }else{
        return '';
    }
}

async function isExistingUrl(url){//bool
    try {        
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            //console.log(`El archivo en la ruta "${url}" EXISTE.`);
            return true;
        } else {
            //console.log(`El archivo en la ruta "${url}" NO EXISTE.`);
            return false;
        }
    } catch (error) {
        console.error(`Error al verificar el archivo: ${error}`);
    }
}

async function fetchDataToJson(url) {
    // const response = await fetch(url);
    // const data = await response.json();
    // return data;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Si el servidor responde con 404, 500, etc.
            return '';
        }
        const data = await response.json();
        return data;
    } catch (error) {
        // Si falla la conexión (red, CORS, etc.)
        return '';
    }
}

async function fetchDataToText(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Si el servidor responde con 404, 500, etc.
            return '';
        }
        const data = await response.text();
        return data;
    } catch (error) {
        // Si falla la conexión (red, CORS, etc.)
        return '';
    }
}

async function getSongTextFromFile(){
    console.log('=== function getSongTextFromFile() ===');

    try {

        if(!hay_id_song('getSongTextFromFile()')){
            return; // <- se detiene aquí si no hay id_song
        } 

    
        let song_file = obj_lista[id_song].fileName;
        //console.log('song_file: ', song_file);
    
        if(!song_file){
            alert('no existe esta cancion en objeto obj_lista');
            return;
        }

        let url = `./song_files/${song_file}`;
        //console.log('url: ', url);

        if(!isExistingUrl(url)){
            alert('no existe esta cancion en objeto obj_lista');
            return;
        }

        const data = await fetchDataToText(url);
        //console.log('data:', data);

        return data;

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('getSongText. error: ',error);
    }
}

async function pintLineasAcordes() {
    console.log('=== function buildSong() ===');

    if(!hay_id_song('pintLineasAcordes()')){
        return; // <- se detiene aquí si no hay id_song
    }
}


//no se usa de momento!!!
async function getSongPages(){
    console.log('=== function getSongPages() ===');

    if(!hay_id_song('getSongPages()')){
        return; // <- se detiene aquí si no hay id_song
    }
       
    objSongBd = await getDataSongFromBd();
    arr_esquema_bd = objSongBd.arr_esquema;
    
    let texto = objSongBd['song_text'];
    //console.log('text:', texto);

    let song_titulo = objSongBd['title'];
    console.log('song_titulo: ', song_titulo);

    const ejemplo_step = `
        <div class="step" data-index="0">Інтро:</div>
    `;
    const ejemplo_step_linea = `
        <div class="linea"><span></span></div>
    `;

    const ejemplo_slide = `
        <div class="slide">
            <div class="slide_inner">
                <fieldset class="kuplet">
                    <legend>Кінцівка:</legend>
                    <p class="c">|D   |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· ····  ····                </p>
                    <p class="t">                 Слава Богу в вишніх!</p>
                    <p class="c">|Hm  |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· · ··· ·                   </p>
                </fieldset>
            </div>
        </div>
    `;
    
    const palabrasPages = arr_pages.join('|');//arr_pages en config
    const regexTitulo = make_regex_titulos(palabrasPages);

    obj_pages = {};//reset - elementos html de slides: kuplet, pripev bridge sin repetirse

    // Obtenemos todas las coincidencias de títulos
    const matches = Array.from(texto.matchAll(regexTitulo));
    console.log('matches: ', matches);


    //si hay coincidencia con palabras separadores: pripev, kuplet, etc...
    if(matches.length > 0){//hay separador de texto como: pripev, kuplet, etc..
        
        //Recorrer las coincidencias...
        matches.forEach((match, i, arr) => {
            console.log('match: ', match);

            const start = match.index;
            const end = (i + 1 < matches.length) ? matches[i + 1].index : texto.length;

            // match[1]: si era algo dentro de []
            // match[2]: si era palabra del array sin []
            let titulo = match[1] || match[2];
            titulo = (titulo) ? titulo.trim() : ''; 
            
            // Contenido: desde el final de la línea de título hasta el siguiente título o final
            const contenido = texto.slice(start + match[0].length, end);//sin '.trim()' ya que con trim() elimina el espacio antes del acorde

            console.log(' ');
            console.log('=== BLOQUE ===');
            console.log('titulo:', titulo);
            console.log('contenido:', contenido);

            let arr_lineas = contenido.split(/\r\n|\r|\n/);
            arr_lineas = arr_lineas.filter(el => el !== '');//elimino strings vacias

            const step = document.createElement('div');
            step.className = 'step';
            step.dataset.index = i;
            step.textContent = titulo;

            const slide = document.createElement('div');
            slide.className = 'slide page';
            slide.innerHTML = `
                <div class="slide_inner">
                    <fieldset class="kuplet">
                        <legend>${titulo}</legend>
                        <!-- aki los p -->
                    </fieldset>
                </div>
            `;
            
            let i_acorde = 0;
            const hayTexto = arr_lineas.some(linea =>
                !contieneSoloAcordes(linea) &&
                !contieneSoloPuntos(linea) &&
                !contieneSoloNota(linea)
            );

            if(arr_lineas.length > 0){
                arr_lineas.forEach((linea, i) => {
                    console.log('linea:', linea);
                    const p = document.createElement('p');


                    const palabrasTitulos = arr_titulos.join('|');//arr_titulos en config
                    const regexTitulo = make_regex_titulos(palabrasTitulos);

                    // Obtenemos todas las coincidencias de títulos
                    const matchesTitulos = Array.from(linea.matchAll(regexTitulo));
                    console.log('matchesTitulos: ', matchesTitulos);

                    if(matchesTitulos.length > 0){
                        //hay titulos en la linea
                        console.log('hay titulo en la linea. linea:', linea);

                        let linea_titulo = matchesTitulos[0][1] || matchesTitulos[0][2];
                        linea_titulo = linea_titulo ? linea_titulo.trim() : '';
                        console.log('linea_titulo:', linea_titulo);                        
                        
                    }else{
                        //no hay titulos en la linea
                        console.log('no hay titulo en la linea. linea:', linea);
                    }



                    //con switch es mas limpio...
                    switch (true) {
                        case (matchesTitulos.length > 0):
                            p.className = 'l_titulo';// 'c' => 'legend'
                            break;

                        case contieneSoloAcordes(linea):
                            p.className = 'c';// 'c' => 'chord'
                            // Si hay texto y ya había una línea de acordes anterior
                            if (hayTexto && i_acorde > 0) {
                                p.classList.add(`c_next${i_acorde}`);
                            }
                            i_acorde++;
                            break;

                        case contieneSoloPuntos(linea):
                            p.className = 'b';// 'b' => 'bola' o punto medio '·' o punto normal '.'
                            i_acorde = 0;//reset
                            break;

                        case contieneSoloNota(linea):
                            p.className = 'n';// 'n' => 'nota' ej.: '     (modulación +2)    '
                            i_acorde = 0;//reset
                            break;

                        default:
                            p.className = 't';// 't' => 'text'
                            i_acorde = 0;//reset
                            break;
                    }

                    p.textContent = linea;
                    slide.querySelector('fieldset').append(p);
                });
                
                //añado titulo cancion como primer slide
                if(i == 0){
                    const d_titulo_cancion = document.createElement('div');
                    d_titulo_cancion.className = 'song_titulo';
                    d_titulo_cancion.innerHTML = `<span>${song_titulo}</span>`;

                    const titulo_cancion = '_titulo_cancion_';

                    const step = document.createElement('div');
                    step.className = 'step';
                    step.dataset.index = i;
                    step.textContent = 'titulo cancion';

                    const slide = document.createElement('div');
                    slide.className = 'slide';
                    slide.innerHTML = `
                        <div class="slide_inner">
                            <fieldset class="kuplet fld_song_titulo">
                                <legend>${titulo_cancion}</legend>
                                <!-- aki los p -->
                            </fieldset>
                        </div>
                    `;

                    slide.querySelector('fieldset').append(d_titulo_cancion);

                    obj_pages[titulo_cancion] = {
                        step,
                        slide
                    };
                }

                //relleno objeto con html elementos
                obj_pages[titulo] = {
                    step,
                    slide
                };

                console.log(`obj_pages[${titulo}].step.innerHTML: `, obj_pages[titulo].step.innerHTML);
                console.log(`obj_pages[${titulo}].slide.innerHTML: `, obj_pages[titulo].slide.innerHTML);
                console.log(`obj_pages[${titulo}]: `, obj_pages[titulo]);
            }
        });

    }else{
        
        //no hay ningun separador de texto como: pripev, cuplet, etc..
        //devuelvo el texto tal cual

        const titulo = '---';
        const contenido = objSongBd['song_text'];

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = 0;
        step.textContent = titulo;

        const div_titulo_cancion = `
            <div class="song_titulo">
                <span>${song_titulo}</span>
            </div>
        `;

        const slide = document.createElement('div');
        slide.className = 'slide page';
        slide.innerHTML = `
            <div class="slide_inner">
            ${div_titulo_cancion}
                <fieldset class="kuplet">
                    <legend>${titulo}</legend>
                    <!-- aki los p -->
                </fieldset>
            </div>
        `;

        let arr_lineas = contenido.split(/\r\n|\r|\n/);
        arr_lineas = arr_lineas.filter(el => el !== '');//elimino strings vacias

        let i_acorde = 0;
        const hayTexto = arr_lineas.some(linea =>
            !contieneSoloAcordes(linea) &&
            !contieneSoloPuntos(linea) &&
            !contieneSoloNota(linea)
        );

        if(arr_lineas.length > 0){
            arr_lineas.forEach((linea, i) => {
                console.log('linea:', linea);
                const p = document.createElement('p');

                const palabrasTitulos = arr_titulos.join('|');//arr_titulos en config
                const regexTitulo = make_regex_titulos(palabrasTitulos);

                // Obtenemos todas las coincidencias de títulos
                const matchesTitulos = Array.from(linea.matchAll(regexTitulo));
                console.log('matchesTitulos: ', matchesTitulos);

                if(matchesTitulos.length > 0){
                    //hay titulos en la linea
                    console.log('hay titulo en la linea. linea:', linea);

                    let linea_titulo = matchesTitulos[0][1] || matchesTitulos[0][2];
                    linea_titulo = linea_titulo ? linea_titulo.trim() : '';
                    console.log('linea_titulo:', linea_titulo);                        
                    
                }else{
                    //no hay titulos en la linea
                    console.log('no hay titulo en la linea. linea:', linea);
                }


                //con switch es mas limpio...
                switch (true) {
                    case (matchesTitulos.length > 0):
                        p.className = 'l_titulo';// 'c' => 'legend'
                        break;

                    case contieneSoloAcordes(linea):
                        p.className = 'c';// 'c' => 'chord'
                        // Si hay texto y ya había una línea de acordes anterior
                        if (hayTexto && i_acorde > 0) {
                            p.classList.add(`c_next${i_acorde}`);
                        }
                        i_acorde++;
                        break;

                    case contieneSoloPuntos(linea):
                        p.className = 'b';// 'b' => 'bola' o punto medio '·' o punto normal '.'
                        i_acorde = 0;//reset
                        break;

                    case contieneSoloNota(linea):
                        p.className = 'n';// 'n' => 'nota' ej.: '     (modulación +2)    '
                        i_acorde = 0;//reset
                        break;

                    default:
                        p.className = 't';// 't' => 'text'
                        i_acorde = 0;//reset
                        break;
                }

                p.textContent = linea;
                slide.querySelector('fieldset').append(p);
            });

            if(true){
                const d_titulo_cancion = document.createElement('div');
                d_titulo_cancion.className = 'song_titulo';
                d_titulo_cancion.innerHTML = `<span>${song_titulo}</span>`;

                const titulo_cancion = '_titulo_cancion_';

                const step = document.createElement('div');
                step.className = 'step';
                step.dataset.index = i;
                step.textContent = 'titulo cancion';

                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.innerHTML = `
                    <div class="slide_inner">
                        <fieldset class="kuplet fld_song_titulo">
                            <legend>${titulo_cancion}</legend>
                            <!-- aki los p -->
                        </fieldset>
                    </div>
                `;

                slide.querySelector('fieldset').append(d_titulo_cancion);

                obj_pages[titulo_cancion] = {
                    step,
                    slide
                };
            }

            //relleno objeto con html elementos
            obj_pages[titulo] = {
                step,
                slide
            };

            console.log(`obj_pages[${titulo}].step.innerHTML: `, obj_pages[titulo].step.innerHTML);
            console.log(`obj_pages[${titulo}].slide.innerHTML: `, obj_pages[titulo].slide.innerHTML);
            console.log(`obj_pages[${titulo}]: `, obj_pages[titulo]);
        }

    }

    console.log('al final. obj_pages: ', obj_pages);

    return obj_pages;    
}


async function getSongBlocks(){
    console.log('=== function getSongBlocks() ===');

    if(!hay_id_song('getSongBlocks()')){
        return; // <- se detiene aquí si no hay id_song
    }
       
    objSongBd = await getDataSongFromBd();
    arr_esquema_bd = objSongBd.arr_esquema;
    
    let texto = objSongBd['song_text'];
    //console.log('text:', texto);

    let song_titulo = objSongBd['title'];
    console.log('song_titulo: ', song_titulo);

    const ejemplo_step = `
        <div class="step" data-index="0">Інтро:</div>
    `;
    const ejemplo_step_linea = `
        <div class="linea"><span></span></div>
    `;

    const ejemplo_slide = `
        <div class="slide">
            <div class="slide_inner">
                <fieldset class="kuplet">
                    <legend>Кінцівка:</legend>
                    <p class="c">|D   |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· ····  ····                </p>
                    <p class="t">                 Слава Богу в вишніх!</p>
                    <p class="c">|Hm  |F#m |G    |G                  |</p>
                    <p class="b"> ···· ···· · ··· ·                   </p>
                </fieldset>
            </div>
        </div>
    `;
    
    const palabrasTitulos = arr_titulos.join('|');//arr_titulos en config
    const regexTitulo = make_regex_titulos(palabrasTitulos);

    obj_bloques = {};//reset - elementos html de slides: kuplet, pripev bridge sin repetirse

    // Obtenemos todas las coincidencias de títulos
    const matches = Array.from(texto.matchAll(regexTitulo));
    console.log('matches: ', matches);


    //si hay coincidencia con palabras separadores: pripev, kuplet, etc...
    if(matches.length > 0){//hay separador de texto como: pripev, kuplet, etc..
        
        //Recorrer las coincidencias...
        matches.forEach((match, i, arr) => {
            console.log('match: ', match);

            const start = match.index;
            const end = (i + 1 < matches.length) ? matches[i + 1].index : texto.length;

            // match[1]: si era algo dentro de []
            // match[2]: si era palabra del array sin []
            let titulo = match[1] || match[2];
            titulo = (titulo) ? titulo.trim() : ''; 
            
            // Contenido: desde el final de la línea de título hasta el siguiente título o final
            const contenido = texto.slice(start + match[0].length, end);//sin '.trim()' ya que con trim() elimina el espacio antes del acorde

            let tituloOriginal = titulo;
            let contador = 2;// para añadir (2), (3), etc. si hay títulos repetidos

            while (obj_bloques.hasOwnProperty(titulo)) {
                titulo = `${tituloOriginal} (${contador})`;
                contador++;
            }

            console.log(' ');
            console.log('=== BLOQUE ===');
            console.log('titulo:', titulo);
            console.log('contenido:', contenido);

            let arr_lineas = contenido.split(/\r\n|\r|\n/);
            arr_lineas = arr_lineas.filter(el => el !== '');//elimino strings vacias

            const step = document.createElement('div');
            step.className = 'step';
            step.dataset.index = i;
            step.textContent = titulo;

            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
                <div class="slide_inner">
                    <fieldset class="kuplet">
                        <legend>${titulo}</legend>
                        <!-- aki los p -->
                    </fieldset>
                </div>
            `;
            
            let i_acorde = 0;
            const hayTexto = arr_lineas.some(linea =>
                !contieneSoloAcordes(linea) &&
                !contieneSoloPuntos(linea) &&
                !contieneSoloNota(linea)
            );

            if(arr_lineas.length > 0){
                arr_lineas.forEach((linea, i) => {
                    console.log('linea:', linea);
                    const p = document.createElement('p');

                    //con switch es mas limpio...
                    switch (true) {
                        case contieneSoloAcordes(linea):
                            p.className = 'c';// 'c' => 'chord'
                            // Si hay texto y ya había una línea de acordes anterior
                            if (hayTexto && i_acorde > 0) {
                                p.classList.add(`c_next${i_acorde}`);
                            }
                            i_acorde++;
                            break;

                        case contieneSoloPuntos(linea):
                            p.className = 'b';// 'b' => 'bola' o punto medio '·' o punto normal '.'
                            i_acorde = 0;//reset
                            break;

                        case contieneSoloNota(linea):
                            p.className = 'n';// 'n' => 'nota' ej.: '     (modulación +2)    '
                            i_acorde = 0;//reset
                            break;

                        default:
                            p.className = 't';// 't' => 'text'
                            i_acorde = 0;//reset
                            break;
                    }

                    p.textContent = linea;
                    slide.querySelector('fieldset').append(p);
                });
                
                //añado titulo cancion como primer slide
                if(i == 0){
                    const d_titulo_cancion = document.createElement('div');
                    d_titulo_cancion.className = 'song_titulo';
                    d_titulo_cancion.innerHTML = `<span>${song_titulo}</span>`;

                    const titulo_cancion = '_titulo_cancion_';

                    const step = document.createElement('div');
                    step.className = 'step';
                    step.dataset.index = i;
                    step.textContent = 'titulo cancion';

                    const slide = document.createElement('div');
                    slide.className = 'slide';
                    slide.innerHTML = `
                        <div class="slide_inner">
                            <fieldset class="kuplet fld_song_titulo">
                                <legend>${titulo_cancion}</legend>
                                <!-- aki los p -->
                            </fieldset>
                        </div>
                    `;

                    slide.querySelector('fieldset').append(d_titulo_cancion);

                    obj_bloques[titulo_cancion] = {
                        step,
                        slide
                    };
                }

                //relleno objeto con html elementos
                obj_bloques[titulo] = {
                    step,
                    slide
                };

                console.log(`obj_bloques[${titulo}].step.innerHTML: `, obj_bloques[titulo].step.innerHTML);
                console.log(`obj_bloques[${titulo}].slide.innerHTML: `, obj_bloques[titulo].slide.innerHTML);
                console.log(`obj_bloques[${titulo}]: `, obj_bloques[titulo]);
            }
        });

    }else{
        
        //no hay ningun separador de texto como: pripev, cuplet, etc..
        //devuelvo el texto tal cual

        const titulo = '---';
        const contenido = objSongBd['song_text'];

        let tituloOriginal = titulo;
        let contador = 2;// para añadir (2), (3), etc. si hay títulos repetidos

        while (obj_bloques.hasOwnProperty(titulo)) {
            titulo = `${tituloOriginal} (${contador})`;
            contador++;
        }

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = 0;
        step.textContent = titulo;

        const div_titulo_cancion = `
            <div class="song_titulo">
                <span>${song_titulo}</span>
            </div>
        `;

        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
            <div class="slide_inner">
            ${div_titulo_cancion}
                <fieldset class="kuplet">
                    <legend>${titulo}</legend>
                    <!-- aki los p -->
                </fieldset>
            </div>
        `;

        let arr_lineas = contenido.split(/\r\n|\r|\n/);
        arr_lineas = arr_lineas.filter(el => el !== '');//elimino strings vacias

        let i_acorde = 0;
        const hayTexto = arr_lineas.some(linea =>
            !contieneSoloAcordes(linea) &&
            !contieneSoloPuntos(linea) &&
            !contieneSoloNota(linea)
        );

        if(arr_lineas.length > 0){
            arr_lineas.forEach((linea, i) => {
                console.log('linea:', linea);
                const p = document.createElement('p');

                //con switch es mas limpio...
                switch (true) {
                    case contieneSoloAcordes(linea):
                        p.className = 'c';// 'c' => 'chord'
                        // Si hay texto y ya había una línea de acordes anterior
                        if (hayTexto && i_acorde > 0) {
                            p.classList.add(`c_next${i_acorde}`);
                        }
                        i_acorde++;
                        break;

                    case contieneSoloPuntos(linea):
                        p.className = 'b';// 'b' => 'bola' o punto medio '·' o punto normal '.'
                        i_acorde = 0;//reset
                        break;

                    case contieneSoloNota(linea):
                        p.className = 'n';// 'n' => 'nota' ej.: '     (modulación +2)    '
                        i_acorde = 0;//reset
                        break;

                    default:
                        p.className = 't';// 't' => 'text'
                        i_acorde = 0;//reset
                        break;
                }

                p.textContent = linea;
                slide.querySelector('fieldset').append(p);
            });

            //relleno objeto con html elementos
            obj_bloques[titulo] = {
                step,
                slide
            };

            console.log(`obj_bloques[${titulo}].step.innerHTML: `, obj_bloques[titulo].step.innerHTML);
            console.log(`obj_bloques[${titulo}].slide.innerHTML: `, obj_bloques[titulo].slide.innerHTML);
            console.log(`obj_bloques[${titulo}]: `, obj_bloques[titulo]);
        }

    }

    console.log('al final. obj_bloques: ', obj_bloques);

    return obj_bloques;    
}


function crear_arr_esquema_bucle(obj_bloques){
    console.log('=== function crear_arr_esquema_bucle() ===');    
    console.log('obj_bloques: ', obj_bloques);

    let arr_esquema = Object.keys(obj_bloques);
    console.log('arr_esquema: ', arr_esquema);
    
    //let arr_esquema_bd;
    //let arr_esquema_titlulos;//es global

    if(objSongBd.arr_esquema && objSongBd.arr_esquema?.length > 0){
        // arr_esquema_bd = objSongBd.arr_esquema.map(el => el.nombre);//desde BD
        arr_esquema_titlulos = objSongBd.arr_esquema.map(el => el.nombre);//desde BD
    }else{
        arr_esquema_titlulos = Object.keys(obj_bloques).map(el => el);
        //DE MOMENTO QUITO EL AÑADIDO DE PRIPEV DESPUÉS DE CADA KUPLET
        //arr_esquema_titlulos = addCoroAfterVerse();//solo añado pripev despues de kuplet si no hay esquema en bd.
    }
    console.log('arr_esquema_bd: ', arr_esquema_bd);
    console.log('arr_esquema_titlulos: ', arr_esquema_titlulos);


    if(arr_esquema_titlulos.length > 0){
        arr_esquema_bucle = arr_esquema_titlulos;
    }else{
        const arr_obj = arr_esquema.map(el => el = {'nombre': el, veces: 1});//arr_esquema convierto en array de objetos
        arr_esquema_bucle = arr_obj;//lo reasigno
    }
    console.log('return --- arr_esquema_bucle: ', arr_esquema_bucle);

    //si hay. quito el primer elemento que es titulo de la cancion para no mostrarlo en ver_esquema() y crear_esquema()
    if(arr_esquema_bucle[0] == '_titulo_cancion_'){
        //arr_esquema_bucle.splice(0,1);
        console.log('(quitado titulo) --- arr_esquema_bucle (sin titulo cancion): ', arr_esquema_bucle);
    }

    return arr_esquema_bucle;
}

function make_regex_titulos(palabras){
    // regex que captura en grupo (1) palabra entre [] (cualquier palabra)
    // o en grupo (2) palabra del arr_titulos al inicio de línea
    const regexTitulo_old = new RegExp(
        '^\\s*' +                                                   // ^ → inicio de línea, seguido de posibles espacios en blanco
        '(?:' +                                                     // (?: ...) → grupo sin captura (elegir una de las dos opciones)
            '\\[\\s*(.*?)\\s*\\]' +                                 // opción 1: texto entre corchetes. ej.: [Verso 1]
            '|' +                                                   // o bien
            '((?:\\d+\\s*)?(?:' + palabras + ')[^\\n]*)' +          // opción 2: opcional número + palabra del array hasta el fin de la línea
        ')',                                                        // fin de grupo sin captura. luego va coma ','
        'gim'                                                       // g -> global (se usa con matchAll), i → case-insensitive, m → multiline
    );

    const regexTitulo = new RegExp(
        '^\\s*' +                                                               // ^ → inicio de línea, seguido de posibles espacios en blanco
        '(?:' +                                                                 // (?: ...) → grupo sin captura (elegir una de las dos opciones)
            '\\[\\s*(.*?)\\s*\\]' +                                             // opción 1: texto entre corchetes. ej.: [Verso 1]
            '|' +                                                               // o bien
            '((?:\\d+\\s*)?(?:' + palabras + ')(?!\\p{L})[^\\n]*)' +            // opción 2: opcional número + palabra del array hasta el fin de la línea
        ')',                                                                    // fin de grupo sin captura. luego va coma ','
        'gimu'                                                                  // g -> global (se usa con matchAll), i → case-insensitive, m → multiline
    );
    console.log('regexTitulo: ', regexTitulo);

    return regexTitulo;
}

function addCoroAfterVerse(){
    console.log('=== function addCoroAfterVerse() ===');    

    const palabrasTitulosCoro = arr_titulos_coro.join('|');//arr_titulos en config
    const regexTituloCoro = make_regex_titulos(palabrasTitulosCoro);    
    
    const palabrasTitulosCoda = arr_titulos_coda.join('|');//arr_titulos en config
    const regexTituloCoda = make_regex_titulos(palabrasTitulosCoda);

    let arr_titulos_tmp = [];
    let arr_coro = [];
    let coro_i = 0;

    arr_esquema_titlulos.forEach( (item, i, arr ) => {
        console.log('item: ', item);
        console.log('i: ', i);           

        // Obtenemos todas las coincidencias de títulos
        const matchesCoro = Array.from(item.matchAll(regexTituloCoro));
        console.log('matchesCoro: ', matchesCoro);

        if(matchesCoro.length > 0){//es titulo de pripev o coro
            console.log(`item: ${item} coontiene coincidencia con coro. item: `, item);

            arr_coro.push(item);
            coro_i++;

            arr_titulos_tmp.push(item);
            console.log('añado al --- arr_titulos_tmp: ', arr_titulos_tmp);
            
        }else{//no es titulo de pripev o coro
            console.log('--- no contiene coro. item: ', item);
            
            arr_titulos_tmp.push(item);
            console.log('añado al --- arr_titulos_tmp: ', arr_titulos_tmp);

            let item_next = arr[i + 1];
            let item_next_es_kuplet = true;//o es kuplet o es final de cancion...

            if(item_next){
                const matchesCoro_next = Array.from(item_next.matchAll(regexTituloCoro));
                //const matchesCoda_next = Array.from(item_next.matchAll(regexTituloCoda));
                
                if(matchesCoro_next.length > 0 /*|| matchesCoda_next.length > 0*/){
                    item_next_es_kuplet = false;
                    console.log(' ahora item_next_es_kuplet es FALSE. no añado coro. ');
                }else{
                    console.log('item_next_es_kuplet es TRUE. no hago nada. ');
                }
            }else{
                console.log('no hay item_next. reviso si item current es CODA.');

                const matchesCoda_ultimo = Array.from(item.matchAll(regexTituloCoda));
                if(matchesCoda_ultimo.length > 0){
                    item_next_es_kuplet = false;
                    console.log(' ahora item_next_es_kuplet es FALSE. no añado coro ya que es CODA. ');
                }
            }

            if(arr_coro.length > 0 && item_next_es_kuplet){
                arr_titulos_tmp.push(arr_coro[arr_coro.length-1]);
                console.log('2. añado al --- arr_titulos_tmp: ', arr_titulos_tmp);
            }
        }
    });

    console.log('arr_titulos_tmp: ', arr_titulos_tmp);

    return arr_titulos_tmp;
}



async function crearSlides(goToSlide = null){
    console.log('=== function crearSlides() ===');

    if(!hay_id_song('crearSlides()')){
        return; // <- se detiene aquí si no hay id_song
    }

    if(goToSlide){
        currentSlide = goToSlide;//mostrar desde slide seleccionado
    }else{
        currentSlide = 0;//reset al cargar nueva cancion, mostrar desde inicio
    }


    obj_bloques = await getSongBlocks();
    console.log('obj_bloques: ', obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);

    await buildSong();
}

async function crearPages(goToSlide = null){
    console.log('=== function crearSlides() ===');

    if(!hay_id_song('crearPages()')){
        return; // <- se detiene aquí si no hay id_song
    }

    if(goToSlide){
        currentSlide = goToSlide;//mostrar desde slide seleccionado
    }else{
        currentSlide = 0;//reset al cargar nueva cancion, mostrar desde inicio
    }


    // obj_pages = await getSongBlocks();
    obj_pages = await getSongPages();
    console.log('obj_pages: ', obj_pages);

    arr_esquema_bucle = Object.keys(obj_pages);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);

    buildPage();
}


function buildPage(){
    console.log('=== function buildPage() ===');

    console.log('obj_pages: ', obj_pages);
    console.log('arr_esquema_bucle: ', arr_esquema_bucle);

    stepsContainer.innerHTML = '';//reset
    slideContainer.innerHTML = '';//reset
    slideContainer.dataset.id_song = objSongBd.id_song;

    arr_fieldsets = [];//reset    
    totalSlides = arr_esquema_bucle.length;//total de slides a pintar

    if(Object.keys(obj_pages).length > 0){
        console.log('obj_pages es correcto y no vacio');
        
    }else{//DORABOTAT!!!
        console.log('obj_pages es vacio: ');
        let aviso_text = `No sa ha podido dividir el texto de la canción en bloques para mostrarla. Edita el texto de la cancion para poder separarlo en bloques. Mira en la pestaña 'Ejemplo' como hacerlo.`;

        if(hayElementosModalesAbiertos()){
            showToast('error', aviso_text);
        }
        
        showEdit('cancion');
        editar_song();
        document.querySelector('#song_text').focus();
        return;
    }

    //recorrer el bucle...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_pages[titulo]?.slide;//bd
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original?.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);        

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = i;

        let titulo_text;
        titulo_text = titulo;
        step.innerHTML = titulo_text;
        slide_clone.querySelector('legend').innerHTML = titulo_text;
        
        stepsContainer.append(step);

        if(i < (arr.length - 1)){
            const step_linea = document.createElement('div');
            step_linea.className = 'step_linea';
            step_linea.innerHTML = `<span></span>`;
            stepsContainer.append(step_linea);
        }
        
        arr_fieldsets.push(slide_clone.querySelector('fieldset'));
        console.log('crearSlides() --- arr_fieldsets: ', arr_fieldsets);

        slideContainer.append(slide_clone);
    });


    //init();
    ajustarTexto();
    pintParrafosAcordes();
    pintParrafosLlaves();
    pintTipoAcorde();
    scrollToSlide(currentSlide);
}


async function buildSong(){
    console.log('=== function buildSong() ===');

    console.log('obj_bloques: ', obj_bloques);
    console.log('arr_esquema_bucle: ', arr_esquema_bucle);

    stepsContainer.innerHTML = '';//reset
    slideContainer.innerHTML = '';//reset
    slideContainer.dataset.id_song = objSongBd.id_song;

    //cojo valor de tipo_fuente de bd 
    tipoFuente = objSongBd.tipo_fuente;
    tipo_fuente = objSongBd.tipo_fuente;//para local pantalla
    currentTransposition = Number(objSongBd.tune_transpose);//para que coja el transpose de bd

    arr_fieldsets = [];//reset    
    totalSlides = arr_esquema_bucle.length;//total de slides a pintar

    if(Object.keys(obj_bloques).length > 0){
        console.log('obj_bloques es correcto y no vacio');
        
    }else{//DORABOTAT!!!
        console.log('obj_bloques es vacio: ');
        let aviso_text = `No sa ha podido dividir el texto de la canción en bloques para mostrarla. Edita el texto de la cancion para poder separarlo en bloques. Mira en la pestaña 'Ejemplo' como hacerlo.`;

        if(hayElementosModalesAbiertos()){
            showToast('error', aviso_text);
        }
        
        showEdit('cancion');
        editar_song();
        document.querySelector('#song_text').focus();
        return;
    }

    //recorrer el bucle...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo]?.slide;//bd
        console.log('slide_original: ', slide_original);

        const slide_original_next = (arr[i+1]) ? obj_bloques[arr[i+1]]?.slide : null ;//bd
        console.log('slide_original_next: ', slide_original_next);
        
        const slide_clone = slide_original?.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);        

        const slide_clone_next = (arr[i+1]) ? slide_original_next?.cloneNode(true) : null ; // true para clonar también hijos 
        console.log('slide_clone_next: ', slide_clone_next);

        const step = document.createElement('div');
        step.className = 'step';
        step.dataset.index = i;

        let titulo_text;
        if(esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0 && objSongBd.arr_esquema[i]?.veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo} <span>x${objSongBd.arr_esquema[i].veces}</span>`;
        }else{
            titulo_text = titulo;
        }
        step.innerHTML = titulo_text;
        slide_clone.querySelector('legend').innerHTML = titulo_text;


        if(slide_clone_next){
            let next_legend = slide_clone_next.querySelector('legend').textContent;
            console.log('next_legend: ', next_legend);

            let next_fieldset = slide_clone_next.querySelector('fieldset');
            console.log('next_fieldset: ', next_fieldset);

            next_fieldset.classList.add('preview_next');

            //1. elimino los p's dejando solo los 2 primeros
            next_fieldset.querySelectorAll('p').forEach((el,i) => { 
                if(i >= 2){
                    el.remove();
                }
            });

            //2. si hay 2 filas de solo texto, elimino la 2 fila
            let los_p_t = next_fieldset.querySelectorAll('p.t');
            if(los_p_t.length == 2){
                los_p_t[1].remove();
            }

            slide_clone.querySelector('.slide_inner').append(next_fieldset);
        }

        
        stepsContainer.append(step);

        if(i < (arr.length - 1)){
            const step_linea = document.createElement('div');
            step_linea.className = 'step_linea';
            step_linea.innerHTML = `<span></span>`;
            stepsContainer.append(step_linea);
        }
        
        arr_fieldsets.push(slide_clone.querySelector('fieldset'));
        console.log('crearSlides() --- arr_fieldsets: ', arr_fieldsets);

        slideContainer.append(slide_clone);
    });

    //init();
    changeTipoFuente(tipoFuente);//debe ser antes de ajustarTexto() para medir bien el width!
    await sleep(100);

    ajustarTexto();
    pintParrafosAcordes();
    pintParrafosLlaves();
    changeTipoAcorde(tipoAcorde);

    if(currentTransposition != 0){
        console.log('currentTransposition: ', currentTransposition);
        transponerTodosLosAcordes(currentTransposition);
    }
    
    pintTipoAcorde();
    scrollToSlide(currentSlide);
}

function hay_id_song(func_name = ''){
    console.log('=== function hay_id_song() ===');
    
    if(!id_song){
        console.warn(func_name + ' --- No hay id_song. hago return...');
        alert(func_name + ' --- No hay id_song. hago return...');
        return false;
    }
    console.log(func_name + ' --- id_song: ', id_song);

    return true;  
}

function hay_id_lista(func_name = ''){
    console.log('=== function hay_id_lista() ===');
    
    if(!id_lista){
        console.warn(func_name + ' --- No hay id_lista. hago return...');
        //alert(func_name + ' --- No hay id_lista. hago return...');
        showToast('info', 'No has seleccionado ninguna lista. Ve a la pestaña "Listas" para seleccionar o crear una lista nueva.', 1000, 'center');
        return false;
    }
    console.log(func_name + ' --- id_lista: ', id_lista);

    return true;  
}


async function crear_esquema_btns_actual(){//para 'bloques wr_vista_btns_actual'
    console.log('=== function crear_esquema_btns_actual() ===');
    
    if(!hay_id_song('ver_esquema()')){
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();

    console.log('obj_bloques: ', obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);

    crear_esquema_wr_esquema_actual.style.display = 'block';//muestro el contenedor de esquema actual
    crear_esquema_wr_vista_btns_actual.innerHTML = '';//reset

    // Recorrer el bucle - btns y vista...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        // const slide_original = obj_bloques[titulo.nombre].slide;//as json
        const slide_original = obj_bloques[titulo]?.slide;//bd
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone); 

        const el_fieldset_cloned = slide_clone.querySelector('fieldset').cloneNode(true); // true para clonar también hijos
        console.log('el_fieldset_cloned: ', el_fieldset_cloned);
        

        let titulo_orig = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.veces : 1 ;
        console.log('before --- titulo_count_veces: ', titulo_count_veces); 
        
        if(titulo_count_veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo_text} <span>x${titulo_count_veces}</span>`;
        }
        console.log('after --- titulo_text: ', titulo_text); 

        el_fieldset_cloned.dataset.idx_esquema = i;
        el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;//pongo el titulo en el bloque


        //Creo boton del bloque sin poder cerrarlo con 'X'
        const btn_simple = document.createElement('button');
        btn_simple.className = 'btn btn_simple';
        btn_simple.dataset.titulo = titulo_orig;
        btn_simple.dataset.idx = i;
        btn_simple.innerHTML = `
            <span class="sp_titulo">${titulo_text}</span>
        `;
        
        crear_esquema_wr_vista_btns_actual.append(btn_simple);
    });
}


async function ver_esquema(){
    console.log('=== function ver_esquema() ===');

    if(!hay_id_song('ver_esquema()')){
        mySizeEsquema();
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();

    console.log('obj_bloques: ', obj_bloques);

    let arr_esquema = Object.keys(obj_bloques);

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);
    
    ver_esquema_song_bloques.innerHTML = '';//reset
    ver_esquema_wr_vista_btns.innerHTML = '';//reset
    ver_esquema_wr_vista_blocks.innerHTML = '';//reset
    ver_esquema_ul_action.innerHTML = '';//reset

    ver_esquema_ul_action.innerHTML = '<span class="sp_prim">Para ver la esquema hay que seleccionar antes la canción...</span>';
       
    makeBtnActive(eid_block_esquema_head, eid_btn_ver_esquema);
    pageActiveEsquema = 'ver_esquema';

    //Recorrer el bucle - partes de song (SIN REPETIRSE)...
    arr_esquema.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo]?.slide;
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);  
                
        ver_esquema_song_bloques.append(slide_clone.querySelector('fieldset'));
    });


    // Recorrer el bucle - btns y vista... (CON REPETIRSE)
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo]?.slide;//bd
        if(!slide_original){
            console.error('error --- no se encuentra slide_original para titulo: ', titulo);
            alert('hay error');
            return;
        }

        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone); 

        const el_fieldset_cloned = slide_clone.querySelector('fieldset').cloneNode(true); // true para clonar también hijos
        console.log('el_fieldset_cloned: ', el_fieldset_cloned);
        

        let titulo_orig = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.veces : 1 ;
        console.log('before --- titulo_count_veces: ', titulo_count_veces); 
        
        if(titulo_count_veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo_text} <span>x${titulo_count_veces}</span>`;
        }
        console.log('after --- titulo_text: ', titulo_text); 

        el_fieldset_cloned.dataset.idx_esquema = i;
        el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;//pongo el titulo en el bloque


        //Creo boton del bloque sin poder cerrarlo con 'X'
        const btn_simple = document.createElement('button');
        btn_simple.className = 'btn btn_simple';
        btn_simple.dataset.titulo = titulo_orig;
        btn_simple.dataset.idx = i;
        btn_simple.innerHTML = `
            <span class="sp_titulo">${titulo_text}</span>
        `;
        btn_simple.onclick = (e) => {
            console.log('e.currentTarget: ', e.currentTarget);
            console.log('e.target: ', e.target);

            const btn_clicked = e.currentTarget;
            makeBtnActive(ver_esquema_wr_vista_btns, btn_clicked);


            const song_element_legend = [...ver_esquema_song_bloques.querySelectorAll('legend')].find(el => el.textContent.trim() === e.currentTarget.dataset.titulo);
            const song_element_fieldset = song_element_legend.closest('fieldset');
            resetFldActive(ver_esquema_song_bloques);            
            song_element_fieldset.classList.add('fld_active');
            song_element_fieldset.scrollIntoView({behavior: 'smooth'});
            //scrollToElement(document.querySelector('.bl_parte_l .vklad_ver_esquema .bloques_outer'), song_element_fieldset);            
            //scrollIntoViewInContainer(document.querySelector('.bl_parte_l .vklad_ver_esquema .bloques_outer'), song_element_fieldset, true, 'top');            
            
            const element_legend = ver_esquema_wr_vista_blocks.querySelectorAll('legend')[e.currentTarget.dataset.idx];
            const element_fieldset = element_legend.closest('fieldset');
            resetFldActive(ver_esquema_wr_vista_blocks);            
            element_fieldset.classList.add('fld_active');
            element_fieldset.scrollIntoView({behavior: 'smooth'});
            //scrollToElement(document.querySelector('.bl_parte_r .vklad_ver_esquema .bloques_outer'), element_fieldset);
            //scrollIntoViewInContainer(document.querySelector('.bl_parte_r .vklad_ver_esquema .bloques_outer'), element_fieldset, true, 'top');
        }
        
        ver_esquema_wr_vista_btns.append(btn_simple);
        ver_esquema_wr_vista_blocks.append(el_fieldset_cloned);
    });

    ver_esquema_ul_action.innerHTML = `
        <li class="li_action" onclick="crearSlides();">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll();">Crear slides + Ver</li>
    `;
    ver_esquema_ul_action.onclick = e => close_ul_action(e);

    pintParrafosAcordes();//para pintar barras de acordes como mas finas
    pintParrafosLlaves();//para pintar llaves '{}' si hay con opacity
    mySizeEsquema();
}


async function crear_esquema(){
    console.log('=== function crear_esquema() ===');

    if(!hay_id_song('crear_esquema()')){
        mySizeEsquema();
        return; // <- se detiene aquí si no hay id_song
    }

    window.arr_temp = [];
    window.titulo_count = 0;
    arr_esquema_obj = [];

    obj_bloques = await getSongBlocks();
    let arr_esquema = Object.keys(obj_bloques);

    console.log('obj_bloques: ', obj_bloques);
    console.log('arr_esquema: ', arr_esquema);

    crear_esquema_song_bloques.innerHTML = '';//reset
    crear_esquema_wr_vista_btns.innerHTML = '';//reset
    crear_esquema_wr_vista_blocks.innerHTML = '';//reset
    crear_esquema_ul_action.innerHTML = '';//reset

    crear_esquema_ul_action.innerHTML = `
        <span class="sp_prim">Las opciones de acción se verán al añadir al menos un bloque de la canción al esquema nuevo...</span>    
        <li id="li_resetEsquema___" class="li_action" onclick="resetEsquema()">Reset</li>
        <li class="li_action" onclick="guardarEsquema()">Guardar</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Ver slides</li>
        <li class="li_action" onclick="guardarEsquema(); crearSlides(); closeAll()">Guardar + Ver slides</li>
    `;
    crear_esquema_ul_action.onclick = e => close_ul_action(e);

    makeBtnActive(eid_block_esquema_head, eid_btn_crear_esquema);
    pageActiveEsquema = 'crear_esquema';

    const sp_prim = document.createElement('span');
    sp_prim.className = 'sp_prim';
    sp_prim.innerHTML = `
        Haz clic en un bloque de la primera columna para añadirlo al esquema de la canción...
    `;

    crear_esquema_wr_vista_btns.append(sp_prim);
    crear_esquema_wr_vista_blocks.append(sp_prim.cloneNode(true));

    //Creo esquema de botones cortos actual
    crear_esquema_btns_actual();

    //Recorrer el bucle...
    arr_esquema.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo]?.slide;
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);

        const el_fieldset = slide_clone.querySelector('fieldset');

        
        el_fieldset.onclick = (e) => {
            console.log('(text) legend: ', e.currentTarget.querySelector('legend').innerText);
            
            if(titulo !== '_titulo_cancion_'){//no pinto el titulo de la cancion
                crear_esquema_wr_vista_btns.querySelector('.sp_prim')?.remove();
                crear_esquema_wr_vista_blocks.querySelector('.sp_prim')?.remove();
    
                const el_fieldset_cloned = e.currentTarget.cloneNode(true); // true para clonar también hijos 
                el_fieldset_cloned.classList.remove('fld_active');
                
                let titulo = el_fieldset_cloned.querySelector('legend').textContent;
                window.arr_temp.push(titulo);
    
                let titulo_orig = titulo;
                let titulo_text;
                let titulo_count_veces;
    
                //si el titulo que se añade es el mismo que el último añadido...
                if(titulo === window.arr_temp[window.arr_temp.length - 2]) {
                    //es titulo que se repite. calculo cuantas veces...
                    //alert('se repite');
                    window.titulo_count++;
                    
                    //no dejo repetir el bloque mas de 5 veces...
                    if(window.titulo_count >= 4){
                        return;
                    }
    
                    titulo_count_veces = titulo_count + 1;
                    console.log('titulo_count_veces: ', titulo_count_veces);
    
                    titulo_text = `${titulo} <span>x${titulo_count_veces}</span>`;
                    el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;
    
                    console.log('titulo_count: ', window.titulo_count);
    
                    crear_esquema_wr_vista_btns.lastElementChild?.remove();//elimino el anterior btn
                    crear_esquema_wr_vista_blocks.lastElementChild?.remove();//elimino el anterior bloque
                    arr_esquema_obj.pop();//elimino el último elemento del array
    
                }else{
                    //es nuevo titlulo
                    window.titulo_count = 0;
                    titulo_text = titulo;
                    titulo_count_veces = 1;
                }
    
                let idx_vista_prev = arr_esquema_obj.length;
    
                //creo boton del bloque
                const btn_close = document.createElement('button');
                btn_close.className = 'btn btn_close';
                btn_close.dataset.idx = i;
                btn_close.dataset.idx_esquema = idx_vista_prev;
                btn_close.dataset.titulo = titulo_orig;
                btn_close.innerHTML = `
                    <span class="sp_titulo">${titulo_text}</span>
                    <span class="sp_close">✕</span>
                `;
                btn_close.onclick = (e) => {
                    console.log('e.currentTarget: ', e.currentTarget);
                    console.log('e.target: ', e.target);
    
                    const element_legend = [...crear_esquema_song_bloques.querySelectorAll('legend')].find(el => el.textContent.trim() === e.currentTarget.dataset.titulo);
                    
                    const element_fieldset = element_legend.closest('fieldset');
                    resetFldActive(crear_esquema_song_bloques);
                    
                    element_fieldset.classList.add('fld_active');
                    element_fieldset.scrollIntoView({behavior: 'smooth'});
    
                    if(e.target.className === 'sp_close'){
                        //alert('voy a eliminar este boton...');
                        arr_esquema_obj.splice(e.currentTarget.dataset.idx_esquema, 1);
                        const vista_block_to_remove = [...crear_esquema_wr_vista_blocks.querySelectorAll('fieldset')].find(el => el.dataset.idx_esquema === e.currentTarget.dataset.idx_esquema);
                        vista_block_to_remove?.remove();
                        e.currentTarget.remove();
    
                        if(arr_esquema_obj.length === 0){
                            //si no hay bloques, oculto los botones de acción
                            crear_esquema_ul_action.innerHTML = '...';
                        }
                    }
                }

                //si es vacio, añado _titulo_cancion_ al principio
                if(arr_esquema_obj.length == 0){
                    const obj_titulo = {
                        nombre: '_titulo_cancion_',
                        veces: 1
                    }
                    
                    arr_esquema_obj.push(obj_titulo); 
                    console.log('(con _titulo_cancion_) --- arr_esquema_obj: ', arr_esquema_obj);
                }

    
                const obj_titulo = {
                    nombre: titulo,
                    veces: titulo_count_veces
                }
                
                arr_esquema_obj.push(obj_titulo); 
                console.log('arr_esquema_obj: ', arr_esquema_obj);
    
                el_fieldset_cloned.dataset.idx_esquema = idx_vista_prev;
    
                crear_esquema_wr_vista_blocks.append(el_fieldset_cloned);
                el_fieldset_cloned.scrollIntoView({behavior: 'smooth'});
    
                crear_esquema_ul_action.innerHTML = `
                    <li id="li_resetEsquema" class="li_action" onclick="resetEsquema()">Reset</li>
                    <li class="li_action" onclick="guardarEsquema()">Guardar</li>
                    <li class="li_action" onclick="crearSlides(); closeAll()">Ver slides</li>
                    <li class="li_action" onclick="guardarEsquema(); crearSlides(); closeAll()">Guardar + Ver slides</li>
                `;
                crear_esquema_ul_action.onclick = e => close_ul_action(e);
    
                crear_esquema_wr_vista_btns.append(btn_close);
            }
    
        }// end onclick
        
        crear_esquema_song_bloques.append(slide_clone.querySelector('fieldset'));
        
    });

    pintParrafosAcordes();//para pintar barras de acordes como mas finas
    pintParrafosLlaves();//para pintar llaves '{}' si hay con opacity
    mySizeEsquema();
}



async function select_slide(){
    console.log('=== function select_slide() ===');

    if(!hay_id_song('select_slide()')){
        mySizeEsquema();
        return; // <- se detiene aquí si no hay id_song
    }

    console.log('obj_bloques esta vacio, lo creo...');
    obj_bloques = await getSongBlocks();
    console.log('obj_bloques: ', obj_bloques);


    //lo haré luego
    // obj_bloques_maxlineas = crearBloquesMostrar(
    //     obj_bloques,
    //     MAX_LINEAS_POR_SLIDE //máximo líneas por slide que son 4
    // );
    // console.log('obj_bloques_maxlineas: ', obj_bloques_maxlineas);
    // arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques_maxlineas);//creo el array de esquema para bucle

    arr_esquema_bucle = crear_arr_esquema_bucle(obj_bloques);//creo el array de esquema para bucle
    console.log('crearSlides() --- arr_esquema_bucle: ', arr_esquema_bucle);
    
    select_slide_song_bloques.innerHTML = '';//reset
    select_slide_wr_vista_btns.innerHTML = '';//reset
    eid_contenedor_prev_inner.innerHTML = '';//reset
    select_slide_ul_action.innerHTML = '';//reset
    
    arr_fieldsets = [];//reset
    currentSlide = 0;//aki siempre para con click dcho empezar desde inicio de canción
    
    makeBtnActive(eid_block_esquema_head, eid_btn_select_slide);
    pageActiveEsquema = 'select_slide';


    // Recorrer el bucle - btns y vista...
    arr_esquema_bucle.forEach( (titulo, i, arr) => {
        console.log('titulo: ', titulo);

        const slide_original = obj_bloques[titulo]?.slide;//bd
            //const slide_original = obj_bloques_maxlineas[titulo]?.slide;// new
        console.log('slide_original: ', slide_original);
        
        const slide_clone = slide_original.cloneNode(true); // true para clonar también hijos 
        console.log('slide_clone: ', slide_clone);

        
        //Clono fieldset del bloque para añadirlo en la parte izda
        const el_fieldset_cloned = slide_clone.querySelector('fieldset').cloneNode(true); // true para clonar también hijos
        console.log('el_fieldset_cloned: ', el_fieldset_cloned);        

        let titulo_orig = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.nombre : titulo ;
        let titulo_text = titulo_orig;
        console.log('titulo_text: ', titulo_text); 
        
        let titulo_count_veces = (esArray(objSongBd.arr_esquema) && objSongBd.arr_esquema.length > 0) ? objSongBd.arr_esquema[i]?.veces : 1 ;
        console.log('before --- titulo_count_veces: ', titulo_count_veces); 
        
        if(titulo_count_veces > 1){//si hay repeticion del titulo
            titulo_text = `${titulo_text} <span>x${titulo_count_veces}</span>`;
        }
        console.log('after --- titulo_text: ', titulo_text); 

        el_fieldset_cloned.dataset.titulo = titulo_orig;
        el_fieldset_cloned.dataset.idx = i;
        el_fieldset_cloned.querySelector('legend').innerHTML = titulo_text;//pongo el titulo en el bloque
        el_fieldset_cloned.onclick = (e) => {
            console.log('e.currentTarget: ', e.currentTarget);
            console.log('e.target: ', e.target);

            const index_esquema = e.currentTarget.dataset.idx;
            console.log('index_esquema: ', index_esquema);
            
            showOneSlideFrom(e.currentTarget, index_esquema);
        }

        //Creo boton del bloque sin poder cerrarlo con 'X'
        const btn_simple = document.createElement('button');
        btn_simple.className = 'btn btn_simple';
        btn_simple.dataset.titulo = titulo_orig;
        btn_simple.dataset.idx = i;
        btn_simple.innerHTML = `
            <span class="sp_titulo">${titulo_text}</span>
        `;
        btn_simple.onclick = (e) => {
            console.log('e.currentTarget: ', e.currentTarget);
            console.log('e.target: ', e.target);

            const index_esquema = e.currentTarget.dataset.idx;
            console.log('index_esquema: ', index_esquema);
            
            showOneSlideFrom(e.currentTarget, index_esquema);
        }

        arr_fieldsets.push(el_fieldset_cloned);
        console.log('crearSlides() --- arr_fieldsets: ', arr_fieldsets);
        
        //añado al DOM
        select_slide_song_bloques.append(el_fieldset_cloned);
        select_slide_wr_vista_btns.append(btn_simple);
    });

    const eid_link_pantalla_bd = document.getElementById('link_pantalla_bd');
    const eid_inpt_pantalla_bd = document.getElementById('inpt_pantalla_bd');
    const link_fichero = web_show_screen_host;//screen_pantalla.php en 'show-screen.com' o 'show-screen.local'
    
    //meto el valor en link y input 
    eid_link_pantalla_bd.href = link_fichero;
    eid_link_pantalla_bd.textContent = link_fichero;
    eid_inpt_pantalla_bd.value = link_fichero;

    select_slide_ul_action.innerHTML = `
        <li class="li_action" onclick="crearSlides();">Crear slides (Inicio)</li>
        <li class="li_action" onclick="crearSlides(); closeAll();">Crear + Ver slides (inicio)</li>
    `;
    select_slide_ul_action.onclick = e => close_ul_action(e);

    //pinto botones en rojo si están marcados antes desde localStorage
    await check_PantallaParams();
    
    pintParrafosAcordes();//para pintar barras de acordes como mas finas
    pintParrafosLlaves();//para pintar llaves '{}' si hay con opacity
    mySizeEsquema();
}





async function check_PantallaParams(){//pinto botones en rojo si están marcados antes desde localStorage
    console.log('=== function check_PantallaParams() ===');
    
    //marco/desmarco los botones de fondo y demás segun las variables desde localStorage
    check_pantalla_show();//reviso si marco en rojo o no
    check_tiempo_restante_show();//reviso si marco en rojo o no
    check_hora_actual_show();//reviso si marco en rojo o no
    check_fondo_body();//new
    check_show_logo_en_fondo();
    await check_show_imagen_en_fondo();
    check_brillo_pantalla();
    check_show_bible_en_fondo();
    check_show_black_en_fondo();
    check_user_view_control();
    check_show_legend();
    check_show_acordes();
    check_show_next_slide();
    check_show_en_top();
    check_show_en_parte_top();
    check_show_en_center();
}


function ajustarTextoContenedor(contenedor) {
    if (!contenedor) return;

    console.log('=== ajustarTextoContenedor ===');
    console.log('contenedor:', contenedor);

    const maxW = contenedor.clientWidth;
    const maxH = contenedor.clientHeight;
    if (maxW <= 0 || maxH <= 0) return;

    const coef_legend = 0.6;
    const legend_fontSize_max = 25;
    const legend = contenedor.querySelector('legend');

    let fontSizeMin = 16;//para legend
    let fontSize = 16; // Iniciar desde 1 para evitar error inicial

    // Caja oculta para medir
    const box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.left = '-10000px';
    box.style.top = '0';
    box.style.visibility = 'hidden';
    box.style.width = maxW + 'px';
    box.style.boxSizing = 'border-box';
    document.body.appendChild(box);

    // Clon a medir dentro de la caja
    // const clone = contenedor.querySelector('.wr_full_block_inner').cloneNode(true);
    const clone = contenedor.querySelector('#contenedor_prev_inner').cloneNode(true);
    clone.style.margin = '0';
    clone.style.position = 'static';
    box.appendChild(clone);

    // Bucle para ajustar fontSize
    while (fontSize <= 100) {
        clone.style.fontSize = fontSize + 'px';
        //console.log('pongo fontSize: ', fontSize);

        const { width, height } = clone.getBoundingClientRect();
        //console.log('clone width: ', width);
        //console.log('clone height: ', height);

        if (width > maxW || height > maxH) {
            //console.log('break fontSize: ', fontSize);
            break;
        }

        // Comprobamos overflow
        if (clone.scrollWidth > maxW || clone.scrollHeight > maxH) {
            //console.log('overflow break. fontSize: ', fontSize);           
            
            //fontSize -= 3;
            break;
        }

        fontSize++;
        //console.log('aumento. fontSize: ', fontSize);//debuguear  
        //contenedor.style.fontSize = fontSize + 'px';//debuguear
    }

    fontSize -= 3;//reduzco un poco para que no llegue al borde

            // Aplicar al contenedor real
            //contenedor.querySelector('fieldset').style.fontSize = fontSize + 'px';
            //console.log('contenedor fieldset. fontSize: ', fontSize);
            
            //por ahora dejo siempre igual legend
            //legend.style.fontSize = fontSizeMin + 'px';//16px minimo para legend

    contenedor.querySelectorAll('fieldset').forEach(fld => {
        // el propio fieldset
        fld.style.fontSize = fontSize + 'px';
        
        //por ahora dejo siempre igual legend
        fld.querySelector('legend').style.fontSize = fontSizeMin + 'px';//16px minimo para legend
    });
    


    // Eliminar clon de prueba
    document.body.removeChild(box);
}


async function guardarEsquema(){
    console.log('=== function guardarEsquema() ===');

    id_song = objSong.id_song;
    console.log('id_song: ', id_song);

    if(!id_song){
        alert('id_song no está indicado... hago return.');
    }

    objSong.arr_esquema = arr_esquema_obj;

    const data = await insertarSongDatos(objSong);
    console.log('data: ', data);

    if(data.success){
        
        let text_show;

        switch (data.action_tipo) {
            case 'is_update_arr_esquema_ok':
                text_show = 'El esquema ha sido actualizado con éxito.';
                break;
        
            case 'is_update_arr_esquema_vacio':
                text_show = 'El esquema VACÍO ha sido actualizado con éxito.';
                break;
        
            case 'is_insert_arr_esquema_ok':
                text_show = 'El esquema ha sido añadido con éxito.';
                break;
        
            case 'is_insert_arr_esquema_vacio':
                text_show = 'El esquema VACÍO ha sido añadido con éxito.';
                break;
                
            default:
                text_show = '1. Aquí texto de resultado de guardar...';
                break;
        }
        console.log(text_show);

        if(hayElementosModalesAbiertos()){
            showToast('ok', text_show, 5000);
        }


        if(data.id_song){
            console.log('id_song: ', data.id_song);
            id_song = data.id_song;//guardo el id de la canción recién creada

            //Cojo datos de la song de la lista desde BD
            objSong = await getDataSongFromBd();//IMPORTANTE para cojer todos los datos necesarios
            console.log('objSong: ', objSong);

            const itemSongUpdate = objDataSongs.arr_data?.find(item => item.id_song == id_song);
            if (itemSongUpdate) {
                Object.assign(itemSongUpdate, objSong);
                // el objeto dentro de arr_data ya está actualizado
            } else {
                console.warn('No encontrado objSong.id_song en objDataSongs.arr_data');
            }

            //editar_song();

            //Actualizo tr_song 
            pintSongActiveSoloDatos();//en la ventana a la derecha de la tabla de lista
        }
        
    }else{
        console.log(`Error al guardar canción.`);            
        console.error('data.error: ',data.error);

        let text_show = 'Error al guardar la esquema.';
        
        if(hayElementosModalesAbiertos()){
            showToast('error', text_show, 5000);
        }
    }

    crearSlides();
    crear_esquema_btns_actual();//actualizo los botones de esquema actual
}

function resetEsquema(){
    crear_esquema_wr_vista_btns.innerHTML = '';//reset
    crear_esquema_wr_vista_blocks.innerHTML = '';//reset
    // crear_esquema_ul_action.innerHTML = 'Esquema reseteada.';//reset
    crear_esquema_ul_action.innerHTML = '';//reset
    
    arr_esquema_obj = [];
    if(objSong.arr_esquema.length > 0){
        objSong.arr_esquema = [];
    }
    
    // crear_esquema_ul_action.innerHTML = `
    //     <span class="sp_prim">Esquema reseteada.</span>
    //     <span class="sp_prim">Haz clic en un bloque de la primera columna para añadirlo al esquema de la canción...</span>
    // `;


    crear_esquema_ul_action.onclick = e => close_ul_action(e);

    const aviso_outer = document.createElement('div');
    aviso_outer.className = 'aviso_outer';
    aviso_outer.innerHTML = `
        <p class="p_aviso">Esquema reseteada.</p>
        <p class="p_aviso">Haz clic en un bloque de la primera columna para añadirlo al esquema de la canción...</p>
    `;
    openModal('center','Aviso Reset Esquema',aviso_outer,'showAviso2');
}


function resetBlockBuscar(){
    console.log('=== function resetBlockBuscar() ===');

    eid_block_buscar.querySelector('.vista_song_content').innerHTML = '(Aquí se mostrará el texto de la canción...)';//reset

    id_song = null;
    resetTrSelected(tbody);//reseteo tr_selected de tbody
}

function resetBlockEsquema(){
    console.log('=== function resetBlockEsquema() ===');

    resetBlockEsquemaSoloHTML();

    arr_esquema_obj = [];
    id_song = null;
}

function resetBlockEsquemaSoloHTML(){
    console.log('=== function resetBlockEsquema() ===');

    resetBtnActive(eid_block_esquema_head);//reseteo btn_active de botones en el contenedor

    //eid_block_esquema.querySelector('.song_bloques').innerHTML = '...';//reset
    ver_esquema_song_bloques.innerHTML = '...';//reset
    crear_esquema_song_bloques.innerHTML = '...';//reset
    select_slide_song_bloques.innerHTML = '...';//reset

    //eid_block_esquema.querySelector('.wr_vista_btns').innerHTML = '...';//reset
    ver_esquema_wr_vista_btns.innerHTML = '...';//reset
    crear_esquema_wr_vista_btns.innerHTML = '...';//reset
    select_slide_wr_vista_btns.innerHTML = '...';//reset

    //eid_block_esquema.querySelector('.wr_vista_blocks').innerHTML = '...';//reset
    ver_esquema_wr_vista_blocks.innerHTML = '...';//reset
    crear_esquema_wr_vista_blocks.innerHTML = '...';//reset
    eid_contenedor_prev_inner.innerHTML = '...';//reset

    ver_esquema_ul_action.innerHTML = '...';//reset
    crear_esquema_ul_action.innerHTML = '...';//reset
    select_slide_ul_action.innerHTML = '...';//reset
    
    crear_esquema_wr_vista_btns_actual.innerHTML = '...';//reset
}

function resetBlockCancion(){
    console.log('=== function resetBlockCancion() ===');

    resetBtnActive(eid_block_cancion_head);//reseteo btn_active de botones en el contenedor

    eid_block_cancion_head.querySelector('#btn_cancion_refresh')?.remove();
    eid_block_cancion_head.querySelector('.separador.for_btn_cancion_refresh')?.remove();

    cancion_song_bloques.innerHTML = '...';//muestro '...'
    // cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_vista_blocks.querySelector('.contenedor').innerHTML = '...';//reset
    cancion_ul_action.innerHTML = '...';//reset  
}

function resetBlockEjemplo(){
    console.log('=== function resetBlockEjemplo() ===');

    resetBtnActive(eid_block_ejemplo_head);//reseteo btn_active de botones en el contenedor

    ejemplo_song_bloques.innerHTML = '...';//muestro '...'
    ejemplo_wr_vista_blocks.innerHTML = '...';//reset
    ejemplo_ul_action.innerHTML = '...';//reset  
}

function resetBlockLista(){
    console.log('=== function resetBlockLista() ===');

    resetBtnActive(eid_block_lista_head);//reseteo btn_active de botones en el contenedor

    eid_block_lista_head.querySelector('#btn_lista_refresh')?.remove();
    eid_block_lista_head.querySelector('.separador.for_btn_lista_refresh')?.remove();

    lista_ul_action.innerHTML = '...';//reset  
    lista_vista_lista_content.innerHTML = '...';//reset  
    
    //se resetean en deleteLista()
    //id_lista = null;
    //arr_lista = [];//reset

    resetTrSelected(tbody_lista);//reseteo tr_selected de tbody_lista
    resetPListaActive(eid_bl_listas_finded);//reseteo listas finded

    console.log('end func');
}




//------------------------------------------------------------------------
function obtenerLineasSeleccionadas() {
    const checkboxes = document.querySelectorAll('.chk_normalizar_linea:checked');
    const lineas = [];

    checkboxes.forEach(chk => {
        lineas.push(parseInt(chk.dataset.linea));
    });

    return lineas;
}


function normalizarTextoLineasSeleccionadas(texto) {

    const idiomaNormalizacion = document.getElementById('lang').value;
    const lineasSeleccionadas = obtenerLineasSeleccionadas();
    const lineas = texto.split(/\r?\n/);
    let textoFinal = '';

    lineas.forEach((linea, indice) => {
        const numeroLinea = indice + 1;

        // línea no seleccionada
        if (!lineasSeleccionadas.includes(numeroLinea)) {
            textoFinal += linea;
        } else {
            // normalizar TODA la línea
            let lineaCorregida = '';

            for (let i = 0; i < linea.length; i++) {
                const caracter = linea[i];

                lineaCorregida += normalizarPalabra(
                    caracter,
                    idiomaNormalizacion
                );
            }

            textoFinal += lineaCorregida;
        }

        if (indice < lineas.length - 1) {
            textoFinal += '\n';
        }
    });

    return textoFinal;
}


function normalizarPalabra(palabra, idiomaNormalizacion = 'ucraniano') {

    const mapaNormalizacion = mapasDeLetras[idiomaNormalizacion] || {};

    let resultado = '';

    for (let i = 0; i < palabra.length; i++) {
        const char = palabra[i];

        resultado += mapaNormalizacion[char] || char;
    }

    return resultado;
}


function normalizarTexto(texto) {

    const idiomaNormalizacion = document.getElementById('lang').value;
    const esCirilico = /[\u0400-\u04FF]/;
    const esLatino = /[a-zA-Z]/;

    // separa texto manteniendo espacios y saltos de línea
    const componentes = texto.split(/(\s+)/);
    let textoFinal = '';

    componentes.forEach(componente => {

        // espacios
        if (/^\s+$/.test(componente)) {
            textoFinal += componente;
            return;
        }

        let tieneCirilico = false;
        let tieneLatino = false;

        // detectar mezcla
        for (let i = 0; i < componente.length; i++) {
            const caracter = componente[i];

            if (esCirilico.test(caracter)) {
                tieneCirilico = true;
            } else if (esLatino.test(caracter)) {
                tieneLatino = true;
            }
        }

        // normalizar solo palabras mezcladas
        if (tieneCirilico && tieneLatino) {
            textoFinal += normalizarPalabra(componente, idiomaNormalizacion);
        } else {
            textoFinal += componente;
        }
    });

    return textoFinal;
}


function resaltarAlfabetosHTML(texto) {
    console.log('=== function resaltarAlfabetosHTML() ===');

    const lineas = texto.split(/\r?\n/);
    let htmlLineas = ''; // Acumulador exclusivo para los divs de las líneas
    let contadorLineasMezcladas = 0; // Contador de líneas con mezcla
    let contadorPalabrasMezcladas = 0; // Contador global de palabras con mezcla
    
    // RegEx para clasificar cada carácter
    const esCirilico = /[\u0400-\u04FF]/;
    const esLatino = /[a-zA-Z]/;

    lineas.forEach((contenidoLinea, indice) => {
        const numeroLinea = indice + 1;
        
        // Si la línea está vacía, la procesamos rápido y pasamos a la siguiente
        if (contenidoLinea.trim() === '') {
            htmlLineas += `  <div class="linea_texto linea-${numeroLinea}"><br></div>\n`;
            return;
        }

        // 1. ANÁLISIS GLOBAL DE LA LÍNEA: Comprobamos si conviven ambos alfabetos en toda la línea
        const lineaTieneCirilicoGlobal = esCirilico.test(contenidoLinea);
        const lineaTieneLatinoGlobal = esLatino.test(contenidoLinea);
        const lineaTieneMezclaGlobal = lineaTieneCirilicoGlobal && lineaTieneLatinoGlobal;

        // Dividimos la línea en palabras (manteniendo los espacios intactos)
        const componentesLinea = contenidoLinea.split(/(\s+)/);
        let lineaProcesadaHTML = '';

        componentesLinea.forEach(componente => {
            // Si el componente actual es solo espacios en blanco, pasa de largo sin tocarlo
            if (/^\s+$/.test(componente)) {
                lineaProcesadaHTML += componente;
                return;
            }

            // Analizamos la palabra carácter por carácter
            let palabraHTML = '';
            let palabraTieneCirilico = false;
            let palabraTieneLatino = false;
            
            // Analizar caracteres
            for (let i = 0; i < componente.length; i++) {
                const caracter = componente[i];

                if (esCirilico.test(caracter)) {
                    palabraTieneCirilico = true;
                    palabraHTML += `<span class="letra_cirilico">${caracter}</span>`;
                } else if (esLatino.test(caracter)) {
                    palabraTieneLatino = true;
                    palabraHTML += `<span class="letra_latino">${caracter}</span>`;
                } else {
                    // ESCAPE DE CARACTERES ESPECIALES Y ESPACIOS INTERNOS:
                    if (caracter === '<') {
                        palabraHTML += '&lt;';
                    } else if (caracter === '>') {
                        palabraHTML += '&gt;';
                    } else {
                        palabraHTML += caracter;
                    }
                }
            }

            // 2. ANÁLISIS INDIVIDUAL DE LA PALABBRA: // es PALABRA MEZCLADA
            if (palabraTieneCirilico && palabraTieneLatino) {
                contadorPalabrasMezcladas++;
                // Envolvemos toda la palabra afectada en su span
                lineaProcesadaHTML += `<span class="palabra_mezclada">${palabraHTML}</span>`;
            } else {
                // Si la palabra está limpia internamente, se añade de forma normal
                lineaProcesadaHTML += palabraHTML;
            }
        });


        // CONTROL DE CLASES DINÁMICAS Y CONTEO DE LÍNEAS:
        let clasesDiv = `linea_texto linea-${numeroLinea}`;
        let indicadorNumeroLinea = ''; 
        let labelConCheckbox = ''; 

        // Ahora la condición evalúa la mezcla GLOBAL de la línea
        if (lineaTieneMezclaGlobal) {
            clasesDiv += ' linea_resaltada';
            contadorLineasMezcladas++; 
            
            // Creamos el número visible para las líneas que contienen mezcla de alfabetos
            // Checkbox para decidir si normalizar esta línea
            indicadorNumeroLinea = `<span class="num_linea_alerta">Línea ${numeroLinea}:</span>`;

            // Checkbox para decidir si normalizar esta línea
            labelConCheckbox = `<input type="checkbox" class="chk_normalizar_linea" data-linea="${numeroLinea}" checked>`;

            lineaProcesadaHTML = `<label>${labelConCheckbox}${lineaProcesadaHTML}</label>`;
            
            console.warn(`⚠️ Mezcla de alfabetos detectada en la Línea ${numeroLinea}: "${contenidoLinea.trim()}"`);
        }

        // Añadimos la línea estructurada con su indicador correspondiente
        htmlLineas += `<div class="${clasesDiv}">${indicadorNumeroLinea}${lineaProcesadaHTML}</div>`;
    });

    // CONSTRUCCIÓN DEL BLOQUE ENVOLTORIO FINAL:
    let htmlResultado = `<div class="wr_letras">\n`;    

    // Si el cálculo dio más de 0 líneas mezcladas, inyectamos tus avisos arriba
    if (contadorLineasMezcladas > 0) {
        textoCancion_is_ok = false;
        htmlResultado += `  
            <div class="aviso_mezcla_info">
                Revisa las letras <span class="letra_cirilico">cirílico</span> / <span class="letra_latino">latino</span>:
            </div>    
            <div class="aviso_mezcla">
                ⚠️ Hay ${contadorLineasMezcladas} línea${contadorLineasMezcladas > 1 ? 's' : ''} con mezcla de alfabetos y ${contadorPalabrasMezcladas} palabra${contadorPalabrasMezcladas > 1 ? 's' : ''} con mezcla interna.
            </div>
            <div class="aviso_mezcla_info">
                Si hay mezcla de letras en las palabras sería imposible encontrar la canción ya que para la búsqueda una <span class="letra_cirilico">a</span> cirílica no es lo mismo que una <span class="letra_latino">a</span> latina, aunque visualmente parezcan iguales. Corrige esto antes de guardar.
            </div>
        `;
    } else {
        // ¡Todo perfecto!
        textoCancion_is_ok = true;
        htmlResultado += `  
            <div class="aviso_ok">
                ¡Todo perfecto! No se han detectado mezclas de alfabetos en el texto.
            </div>
        `;
    }

    let htmlAvisoBottom = '';//por defecto -nada
    //si hay alguna mezcla, añado un aviso más detallado abajo
    if(!textoCancion_is_ok){
        htmlAvisoBottom = `
            <div class="aviso_mezcla_info aviso_bottom">
                <label>
                    <p class="font_bold">
                        <input id="corregir_lineas" type="checkbox"> Quiero corregir las lineas marcadas automáticamente (recomendado)
                    </p>
                </label>
                <p>
                    Al corregir el texto, también se pueden corregir palabras que no contienen mezcla interna de alfabetos, pero que están escritas completamente con letras del alfabeto incorrecto dentro de un contexto de otro idioma. Por ejemplo, una palabra formada únicamente por letras latinas dentro de una línea escrita en ucraniano o ruso no se detecta como palabra mezclada, aunque igualmente puede causar problemas en las búsquedas.
                </p>
                <p>
                    Para evitar que estas palabras pasen desapercibidas, las líneas marcadas se normalizarán según el idioma seleccionado en el menú (ucraniano, ruso, bielorruso, etc.). Durante este proceso se corregirán tanto las palabras con mezcla de alfabetos como aquellas que estén escritas íntegramente con letras del alfabeto equivocado.
                </p>
                
                <p>
                    Si no deseas corregir una línea determinada, desmarca su casilla antes de hacer clic en «Corregir». Si deseas corregir todo el texto, deja todas las líneas marcadas.
                </p>
                
                <p>
                    Una vez revisadas las opciones, haz clic en «Corregir» para aplicar los cambios al texto de la canción.
                </p>
                
                <p>
                    Al corregir, solo se modificarán las letras homógrafas, es decir, aquellas que tienen una apariencia idéntica o muy similar, pero que en realidad pertenecen a alfabetos diferentes. Por ejemplo: una <span class="letra_cirilico">a</span> cirílica no es lo mismo que una <span class="letra_latino">a</span> latina, aunque visualmente parezcan iguales.
                </p>
            </div>
        `;
    }

    // Unimos los avisos con los renglones procesados de la canción
    htmlResultado += `
        <fieldset>
            <legend>Texto de la canción:</legend>
            ${htmlLineas}
        </fieldset>
        ${htmlAvisoBottom}
    `;
    htmlResultado += '</div>';
    
    return htmlResultado;
}

// --- EJEMPLO DE USO ---
// const textoEjemplo = `
// Церква Господа - Наречена для Христа (ok)
// Цepквa Гocпoдa - Нapeчeнa для Xpиcтa  (mezclado)
// `;

// const htmlGenerado = resaltarAlfabetosHTML(textoEjemplo);
// console.log("CÓDIGO HTML GENERADO:\n", htmlGenerado);


function esperarConfirmacionUsuario(textoCancion) {
    openModal('full', 'Antes de guardar...', '', 'showAviso2');

    return new Promise((resolve) => {
        // Generamos el HTML con tus letras marcadas
        const htmlMarcado = resaltarAlfabetosHTML(textoCancion);
        const htmlBtnCorregir = (textoCancion_is_ok) ? '' : `<button id="btn_corregir" class="btn btn_big">Corregir</button>`;

        const block_revisar_texto = document.createElement('div'); 
        block_revisar_texto.className = 'block_revisar_texto'; 
        block_revisar_texto.innerHTML = `
            <div class="wr_texto">
                ${htmlMarcado}
            </div>

            <div class="wr_2_botones">
                <button id="btn_cancelar" class="btn btn_big">Cancelar</button>
                ${htmlBtnCorregir}
                <button id="btn_seguir" class="btn btn_big">Guardar</button>
            </div>
        `;
        block_revisar_texto.onclick = (e) => {
            
            // Si pincha Cancelar, resolvemos la promesa devolviendo 'false'
            if(e.target.closest('#btn_cancelar')){
                resolve(false);
                closeModal(null, true); // Cierro el modal al cancelar 
            }
            
            // Si pincha Corregir, resolvemos la promesa devolviendo 'false'
            if(e.target.closest('#btn_corregir')){
                const textarea_song_text = document.querySelector('textarea[name="song_text"]');
                const corregir_lineas_is_checked = document.querySelector('#corregir_lineas').checked;
    
                let textoCancionCorregido = normalizarTexto(textoCancion);
                console.log('textoCancionCorregido: ', textoCancionCorregido);            
    
                if(corregir_lineas_is_checked){
                    textoCancionCorregido = normalizarTextoLineasSeleccionadas(textoCancionCorregido);
                    console.log('textoCancionCorregido con líneas corregidas: ', textoCancionCorregido);
                }
    
                textarea_song_text.value = textoCancionCorregido; 
                closeModal(null, true); // Cierro el modal al cancelar
    
                setTimeout(()=>{
                    guardarSong(document.getElementById('btn_GuardarFormRevisar'), 'cancion_song_bloques','editar', true);
                },1000);
    
                resolve(false);
     
            }
            
            // Si pincha Seguir, resolvemos la promesa devolviendo 'true'
            if(e.target.closest('#btn_seguir')){
                resolve(true); 
                closeModal(null, true); // Cierro el modal al seguir 
            }
        };

        //añado al DOM
        eid_bl_modalFullInner.append(block_revisar_texto);        
    });
}


async function guardarSong(event, id_contenedor, cancion_action, revisar = false){
    console.log('=== function guardarSong() ===');

    if(event instanceof Event) {
        console.log("Recibí un evento:", event.type);
        console.log('guardarSong() se ha llamado desde un evento de formulario.');
        event.preventDefault();
    }else if(event instanceof HTMLElement) {
        console.log("Recibí un elemento HTML:", event.tagName);
        //no hago nada
    } else{
        console.log("Parámetro desconocido. event: ", event);
    }

    const contenedor = document.getElementById(id_contenedor);

    if(!contenedor){
        alert('no hay contenedor de form. hago return...');
        return;
    }

    try {
        
        // if(get_cookieConsent && get_cookieConsent === 'rejected'){
        //     let aviso_text = `<span>${obj_lang.d315}</span>`;//Si no aceptas cookies no puedes crear una cuenta.
        //     aviso_text += ` <a onclick="showBlockCookies(); closeModal(null,true);">${obj_lang.d316}</a>.`;//Seleccionar Coockies
        //     openModal('center','Cookies',aviso_text,'showAviso');
        //     return;
        // }

        const form = contenedor.querySelector("form");

        let title = form.elements["title"].value.trim();
        let title2 = form.elements["title2"].value.trim();

        //si title o title2 o title_note están vacíos, saco textos de los versos o coro introducidos
        const fieldsetsAll = eid_block_cancion.querySelectorAll('.d_contenedor fieldset');
        let title_def = '';
        let title2_def = '';

        const palabrasTitulosCoro = arr_titulos_coro.join('|');//arr_titulos en config
        const regexTituloCoro = make_regex_titulos(palabrasTitulosCoro);

        for (const [i, fld] of fieldsetsAll.entries()) {           
            console.log('fld: ', fld);
            
            const legend_text = fld.querySelector('legend').textContent.trim();
            const esCoro = regexTituloCoro.test(legend_text);
            const first_p_text = fld.querySelector('.t')?.textContent.trim();//encuentra la primera coincidencia, en lugar de recorrer todo el árbol con fld.querySelectorAll('.t')

            //si es verso
            if(!esCoro && first_p_text && !title_def && !title){
                title_def = first_p_text;
            }

            //si es coro
            if(esCoro && first_p_text && !title2_def && !title2){
                title2_def = first_p_text;
            }
            
            // Aquí SÍ se detiene completamente el bucle
            if (title_def && title2_def) {
                break;
            }            
        }

        console.log('title_def: ', title_def);
        console.log('title2_def: ', title2_def);

        title = title || title_def;
        title2 = title2 || title2_def;

        let title_note = form.elements["title_note"].value.trim();
        let category = form.elements["category"].value.trim();
        let songbook = form.elements["songbook"].value.trim();
        let song_number = form.elements["song_number"].value.trim() || 0;
        let tune = form.elements["tune"].value.trim();
        let tune_transpose = form.elements["tune_transpose"].value.trim();
        
        let tipo_acorde = form.elements["tipo_acorde"].value.trim();
        if (!tipo_acorde || tipo_acorde === 'undefined') {
            tipo_acorde = '#';
        }

        let tipo_fuente = form.elements["tipo_fuente"].value.trim();
        let url_youtube = form.elements["url_youtube"].value.trim();
        let url_recurso = form.elements["url_recurso"].value.trim();
        let tempo_bpm = form.elements["tempo_bpm"].value.trim() || 0;
        let lang = form.elements["lang"].value.trim();
        let song_text = form.elements["song_text"].value.trim();
        let notes = form.elements["notes"].value.trim();
        
        //AJUSTES PERSONALIZADOS
        let tune_transpose_pers = form.elements["tune_transpose_pers"].value.trim() || 0;
        let capo_pers = form.elements["capo_pers"].value.trim() || 0;
        let tempo_bpm_pers = form.elements["tempo_bpm_pers"].value.trim() || 0;
        let notes_pers = form.elements["notes_pers"].value.trim() || '';

        let tipo_acorde_pers = form.elements["tipo_acorde_pers"].value.trim();
        if (!tipo_acorde_pers || tipo_acorde_pers === 'undefined') {
            tipo_acorde_pers = '#';
        }


    
        let errors = [];

        if(title == ''){
            errors.push('Título');
        }
        if(song_text == ''){
            errors.push('Texto de la canción');
        }
        if(lang == ''){
            errors.push('Idioma de la canción');
        }
        // if(!validarEmail(email)){
        //     errors.push(obj_lang.d278);//El email no es válido.
        // }
        // if(!validarPassword(password)){
        //     errors.push(obj_lang.d279);//La contraseña no es válida. Debe tener al menos 6 carácteres.
        // }        
        if(errors.length > 0){
            let error_text = '';
            errors.forEach(error => {
                error_text += ' - ' + error + '<br>';
            });            
            
            let aviso_text = `<p>Por favor, rellena los siguientes datos: </p> <br> ${error_text}`;
            showToast('error', aviso_text, 50, 'center', true, 'Error en los campos introducidos');
            return;
        }

        //compruebo si hay que revisar antes el texto, o guardar rápido sin revisar cirilico/latino mezclados
        if(revisar){
            
            //reviso el texto si tiene letras mezcladas 
            const htmlGenerado = resaltarAlfabetosHTML(song_text);
            console.log("CÓDIGO HTML GENERADO:\n", htmlGenerado);

            // 1. Aquí capturas el texto como ya lo hagas habitualmente
            const textoCancion = song_text;

            console.log("Iniciando proceso... ejecutando comprobaciones.");

            // 2. CONGELAMOS AQUÍ EL CÓDIGO: Esperamos la decisión en los botones
            const usuarioQuiereSeguir = await esperarConfirmacionUsuario(textoCancion);

            // 3. Evaluamos la respuesta del botón
            if (!usuarioQuiereSeguir) {
                console.log("La ejecución se detuvo: El usuario canceló.");
                return; // Rompe la función aquí. Tu código NO sigue ejecutándose.
            }
        }

        
        let arr_esquema_guardar = '';

        if(arr_esquema_obj.length > 0){
            console.log('cojo arr_esquema creado nuevo');
            arr_esquema_guardar = arr_esquema_obj;//neuvo arr
        }else{
            //si hay id_song y cancion se edita
            if(id_song && objSong.arr_esquema){
                console.log(' cojo arr_esquema de cancion bd');
                arr_esquema_guardar = objSong.arr_esquema;//de bd
            }else{//se crea nueva cancion con arr_esquema vacio
                console.log(' meto arr_esquema vacio ya que se crea una nueva canción');
                arr_esquema_guardar = [];//vacio
            }
        }
        console.log('arr_esquema_guardar: ', arr_esquema_guardar);

        
        const {
            deviceResolution,
            orientation
        } = getDeviceData();      

        const objSongToSend = {
            id_song: id_song || null, //ya que se añade una nueva canción, no hay id_song
            song_number,
            title,
            title2,
            title_note,
            arr_esquema: arr_esquema_guardar, //o '' o arr //new
            category,
            songbook,
            tune,
            tune_transpose,
            tipo_acorde,
            tipo_fuente,
            url_youtube,
            url_recurso,
            tempo_bpm,
            lang,
            song_text,
            notes,

            //ajustes de resolusión
            device_resolution: deviceResolution,            
            orientation: orientation,            
            font_size: currentFontSize,
            num_columns: currentNumColumns,
            acordes_visible: (acordesVisible) ? 1 : 0,
            texto_visible: (textoVisible) ? 1 : 0,
            contenido_width: (contenidoWidth) ? 1: 0,

            //ajustes personalizados
            ajustes_pers,
            tune_transpose_pers,
            capo_pers,
            tipo_acorde_pers,
            tempo_bpm_pers,
            notes_pers,
        }
        console.log('objSongToSend: ',objSongToSend);
    
        const data = await insertarSongDatos(objSongToSend);
        console.log('data: ',data);
    
        if(data.success){
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_arr_esquema_ok':
                    text_show = 'Datos de la Canción y su Esquema han sido actualizados con éxito.';
                    break;
            
                case 'is_update_arr_esquema_vacio':
                    text_show = 'Datos de la Canción (SIN SU ESQUEMA) han sido actualizados con éxito.';
                    break;
            
                case 'is_insert_arr_esquema_ok':
                    text_show = 'Datos de la Canción y su Esquema han sido añadidos con éxito.';
                    break;
            
                case 'is_insert_arr_esquema_vacio':
                    text_show = 'Datos de la Canción (SIN SU ESQUEMA) han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '1. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:',text_show);
    
            if(hayElementosModalesAbiertos()){
                showToast('ok', text_show, 5000);
            }

            if(data.id_song){
                console.log('id_song: ', data.id_song);
                id_song = data.id_song;//guardo el id de la canción recién creada

                //Cojo datos de la song de la lista desde BD
                objSong = await getDataSongFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objSong: ', objSong);

                const itemSongUpdate = objDataSongs.arr_data?.find(item => item.id_song == id_song);
                if (itemSongUpdate) {
                    Object.assign(itemSongUpdate, objSong);
                    // el objeto dentro de arr_data ya está actualizado
                } else {
                    console.warn('No encontrado objSong.id_song en objDataSongs.arr_data');
                }

                const itemListaUpdate = objDataListas.arr_data?.find(item => item.id_lista == id_lista);
                if (itemListaUpdate) {
                    //si hay lista con el id_song guardado, actualizo los datos de la song para mostrar en la lista 
                    const itemSongOfLista = itemListaUpdate.arr_lista?.find(item => item.id_song == id_song);
                    if(itemSongOfLista){
                        //actualizo solo los campos necesarios
                        let songDataOfLista_new = {
                            song_number: objSong.song_number,
                            title: objSong.title,
                            title2: objSong.title2,
                            title_note: objSong.title_note,
                            tune: objSong.tune,
                            tune_transpose: objSong.tune_transpose,
                            ajustes_pers: objSong.ajustes_pers,
                            tune_transpose_pers: objSong.tune_transpose_pers,
                            capo_pers: objSong.capo_pers,
                        }
                        console.warn('songDataOfLista_new: ', songDataOfLista_new);

                        Object.assign(itemSongOfLista, songDataOfLista_new);
                        console.warn('(actualizado) --- objLista.arr_lista: ', objLista.arr_lista);
                        
                        pintListaActive();//actualizo vista lista activa
                    }else{
                        console.warn('No encontrado itemSongOfLista. no hago nada...');
                    }
                    // el objeto dentro de arr_data ya está actualizado
                } else {
                    console.warn('No encontrado objSong.id_song en objDataSongs.arr_data');
                } 
                
                let hay_id_song_en_arr_pantalla = arr_pantalla.find(v => v.id_song == id_song);

                if(hay_id_song_en_arr_pantalla){
                    //si la canción está en pantalla, actualizo datos en pantalla
                    objPantalla.tipo_fuente = objSong.tipo_fuente;
                    update_objPantalla();//actualizo en el localStorage    
                    
                    objPantallaParams.tipo_fuente = objSong.tipo_fuente;
                    update_objPantallaParams();//actualizo en el localStorage
                }

                form.elements['id_song'].disabled = true;//deshabilito input id_song   
                form.elements['id_song'].value = id_song;

                //si guardo desde el modal, recargo datos de song en el block activo
                // if(contenedor.id == 'bl_modalFullInner' && cancion_song_bloques.querySelector('form')){
                //     alert('voy a actualizar con buildFormCancion()...');
                //     buildFormCancion(cancion_song_bloques, 'editar');//siempre 'editar'!!!
                // }
                editar_song();

                //Actualizo tr_song 
                pintSongActiveSoloDatos();//en la ventana a la derecha de la tabla de lista
            }
           
        }else{
            console.log(`Error al guardar canción.`);            
            console.error('data.error: ',data.error);

            let text_show = 'Error al guardar la canción.';
            let text_error = data.error;

            let aviso_html = `
                <p>${text_error}</p>
                <p>Puedes iniciar sesión.</p>
                <div class="wr_btns_vertical">
                    <button class="btn" onclick="window.open('/login', '_blank');">Login</button>            
                </div>
            `;
    
            if(hayElementosModalesAbiertos()){
                showToast('error', aviso_html, 500, 'center');
            }
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarSong. error: ',error);
    }

}



async function deleteSong(event, id_contenedor){
    console.log('=== function deleteSong() ===');
    event.preventDefault();

    const contenedor = document.getElementById(id_contenedor);

    if(!contenedor){
        alert('no hay contenedor de form. hago return...');
        return;
    }

    try {
    
        id_song = objSong.id_song;
        console.log('id_song: ', id_song);

        if(!id_song){
            alert('id_song no está indicado... hago return.');
        }

        const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE la canción con los siguientes datos? \nID: ${id_song} \ntítulo: '${objSong.title}' \n\nEsta acción no se podrá deshacer.`);
        if(respuesta){
            console.log('sigo adelante para eliminar la canción...'); //clic en "Aceptar"
            if(promtConClaveSecreta()){
                console.log('Clave secreta correcta. Procedo a eliminar la canción.');
            }else{
                return;
            }
        } else {
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        const data = await deleteSongFromBd();
        console.log('data: ',data);

        const form = contenedor.querySelector("form");

        if(data.success){
            
            let text_show;
            text_show = 'Canción eliminada con éxito.';
            console.log(text_show);

            form.querySelector('.mensaje').innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            contenedor.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            if(hayElementosModalesAbiertos()){
                showToast('ok', text_show, 5000);
            }

            if(data.id_song){
                console.log('id_song: ', data.id_song);

                const totalAntes = objDataSongs.arr_data.length;

                //elimino el objeto de la cancion eliminada desde objeto de todas las canciones encontradas usando filter
                objDataSongs.arr_data = objDataSongs.arr_data.filter(
                    item => item.id_song !== id_song
                );

                const totalDespues = objDataSongs.arr_data.length;
                const song_is_deleted = totalDespues < totalAntes;

                if(song_is_deleted){
                    console.log('cancion eliminada de objDataSongs');
                }else{
                    console.log('cancion NO eliminada de objDataSongs');
                }



                //busco la lista de la cual eliminar la cancion eliminada, 
                //y si la encuentro, elimino la canción de esa lista
                const itemListaUpdate = objDataListas.arr_data?.find(
                    item => item.id_lista == id_lista
                );

                if (itemListaUpdate) {
                    const totalAntesEnLista = itemListaUpdate.arr_lista.length;
                
                    itemListaUpdate.arr_lista = itemListaUpdate.arr_lista.filter(
                        item => item.id_song != id_song
                    );

                    const totalDespuesEnLista = itemListaUpdate.arr_lista.length;
                    const song_is_deleted_from_lista = totalDespuesEnLista < totalAntesEnLista;
                
                    if (song_is_deleted_from_lista) {                
                        console.log(`Canción ${id_song} eliminada de la lista ${id_lista}`);
                        pintListaActive();
                    } else {
                        console.warn('No encontrado id_song en la lista');
                    }                
                }


                //Elimino elemento p_song de las canciones encontradas en 'buscar'
                eid_bl_songs_finded.querySelector(`.p_song[data-id="${id_song}"]`).remove();

                form.elements['id_song'].disabled = true;//deshabilito input id_song   
                form.elements['id_song'].value = id_song;

                resetBlockBuscar();
                resetBlockEsquema();

                pintLineasXinBlock(eid_block_cancion);
                form.querySelector('.wr_btns_eliminar').remove();//elimino botones de 'eliminar'

                cancion_ul_action.innerHTML = `
                    <p class="prim bg_red">Canción eliminada</p>
                    <li class="li_action" onclick="showBlockName('buscar');">Buscar</li>
                `;
                cancion_ul_action.onclick = e => close_ul_action(e);

                id_song = null;
                objSong = {};//reseteo objeto song



                setTimeout(()=>{
                    const aviso_outer = document.createElement('div');
                    aviso_outer.className = 'aviso_outer';
                    aviso_outer.innerHTML = `
                        <p class="p_aviso">${text_show}</p>
                        <p class="p_aviso">Busca una canción según tus criterios en la pestaña <b>Buscar</b>.</p>
                        <button id="btn_lista" class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('buscar');">Buscar</button>
                    `;
                    openModal('center','Aviso Eliminar Canción',aviso_outer,'showAviso2');
                }, 1000);
            }
            
        }else{
            console.log(`Error al eliminar la canción.`);
            
            console.error('data.error: ', data.error);
            console.error('data.dic_code: ',data.dic_code);

            let text_show = 'Error al eliminar la canción.';
            let text_error = data.error;

            form.querySelector('.mensaje').innerHTML = `<span class="add_result add_error">${text_show}</span>`;
            contenedor.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            
            if(hayElementosModalesAbiertos()){
                showToast('error', text_error, 500,'center');
            }
        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteSong. error: ',error);        
    }

}



async function guardarLista(event, modo_guardar = 'normal'){//modo_guardar: 'normal' o 'fast' (para guardar rápido sin pasar por el formulario, solo con los datos actuales de objLista y arr_lista)
    console.log('=== function guardarLista() ===');
    
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

        const form_lista = document.getElementById('form_lista');
        const form_mensaje_lista = form_lista?.querySelector('form .mensaje');

        let title = form_lista?.querySelector('#title').value.trim();
        let id_grupo = form_lista?.querySelector('#id_grupo').value.trim();
        let fecha = form_lista?.querySelector('#fecha').value;
        let notes = form_lista?.querySelector('#notes').value.trim();
    
        let errors = [];

        if(modo_guardar === 'fast'){
            title = objLista.title;
            id_grupo = objLista.id_grupo;
            fecha = objLista.fecha;
            notes = objLista.notes;    
        }

        if(title == ''){
            errors.push('Título de la lista');
        }
        if(id_grupo == ''){
            errors.push('Nombre de grupo o cantante que realiza el evento');
        }
        if(fecha == ''){
            errors.push('Fecha del evento');
        }
       
        if(errors.length > 0){
            
            let error_text = '';
            errors.forEach(error => {
                error_text += `<p> - ${error}</p>`;
            });
            
            let aviso_text = `<p>Por favor, rellena los siguientes datos: </p> <br> ${error_text}`;
            
            showToast('error', aviso_text, 50, 'center', true, 'Error en los campos introducidos');
            return;
        }

        //Creo array de solo ids de canciones. si arr_lista es vacío, retorna arr_lista_ids vacío
        arr_lista_ids = arr_lista.map(item => parseInt(item.id_song));
        console.log('arr_lista_ids: ', arr_lista_ids);


        let arr_lista_ids_str;//debe ser string ya se mete en la bd como string

        if(id_lista == null){
            console.log('es lista NUEVA');
            arr_lista_ids_str = JSON.stringify(arr_lista_ids);

            if(arr_lista.length == 0){
                console.log('es lista NUEVA y el array está vacío');
            }else{
                console.log('es lista NUEVA y el array está lleno');
            }

        }else{
            console.log('es lista EDITADA');
            if(esString(objLista.arr_lista)){
                arr_lista_ids_str = JSON.stringify(JSON.parse(objLista.arr_lista).map(item => parseInt(item.id_song)));
            }else{
                arr_lista_ids_str = JSON.stringify(objLista.arr_lista.map(item => parseInt(item.id_song)));
            }

            if(objLista.arr_lista.length == 0){
                console.log('es lista EDITADA y el array está vacío');
            }else{
                console.log('es lista EDITADA y el array está lleno');
            }
        }

        console.log('arr_lista_ids_str: ', arr_lista_ids_str);

        const objListaToSend = {
            id_lista: id_lista || null, //ya que se añade una nueva lista, no hay id_lista
            title,
            id_grupo,
            arr_lista_ids: arr_lista_ids_str, //como STRING siempre aki
            fecha,
            fecha_ver: convertirFecha(fecha, 'ver','/'),
            notes,
        }
        console.log('objListaToSend: ',objListaToSend);
    
        const data = await insertarListaDatos(objListaToSend);
        console.log('data: ',data);
    
        if(data.success){                
            
            let text_show;

            switch (data.action_tipo) {
                case 'is_update_arr_lista_ok':
                    text_show = 'Datos de la Lista y sus canciones han sido actualizados con éxito.';
                    break;
            
                case 'is_update_arr_lista_vacio':
                    text_show = 'Datos de la Lista (SIN CANCIONES) han sido actualizados con éxito.';
                    break;
            
                case 'is_insert_arr_lista_ok':
                    text_show = 'Datos de la Lista y sus canciones han sido añadidos con éxito.';
                    break;
            
                case 'is_insert_arr_lista_vacio':
                    text_show = 'Datos de la Lista (SIN CANCIONES) han sido añadidos con éxito.';
                    break;
                    
                default:
                    text_show = '2. Aquí texto de resultado de guardar...';
                    break;
            }
            console.log('text_show:', text_show);

            if(form_mensaje_lista) {
                //form_mensaje_lista.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
                //form_lista.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            }
    

            
            if(hayElementosModalesAbiertos()){
                showToast('ok', text_show, 5000);
            }

            if(form_mensaje_lista){
                setTimeout(()=>{
                    form_mensaje_lista.innerHTML = `
                        <span class="sp _id">
                            <span>Id: <b class="c_green">${data.id_lista}</b></span>
                            <span><b class="guardado">GUARDADO</b></span>
                        </span>
                    `;
                }, 2000);
                setTimeout(()=>{
                    form_mensaje_lista.querySelector('.guardado')?.remove();
                }, 4000);
            }



            if(data.id_lista){
                console.log('id_lista: ', data.id_lista);
                id_lista = data.id_lista;//guardo el id de la canción recién creada

                //Cojo datos de la lista desde BD
                objLista = await getDataListaFromBd();//IMPORTANTE para cojer todos los datos necesarios
                console.log('objLista: ', objLista);

                const itemListaUpdate = objDataListas.arr_data?.find(item => item.id_lista == id_lista);
                if (itemListaUpdate) {
                    Object.assign(itemListaUpdate, objLista);
                    // el objeto dentro de arr_data ya está actualizado
                } else {
                    console.warn('No encontrado objlista.id_lista en objDatalistas.arr_data');
                }

                //Actualizo tr_lista 
                pintListaActiveSoloDatos();

                if(form_lista){
                    form_lista.querySelector('#btn_ResetForm').removeAttribute('type');
                    form_lista.querySelector('#btn_ResetForm').onclick = (e) => {
                        e.preventDefault();
                        
                        //pinto datos de bd
                        form_lista.querySelector('#title').value = objLista.title;
                        form_lista.querySelector('#id_grupo').value = objLista.id_grupo;
                        form_lista.querySelector('#fecha').value = objLista.fecha;
                        form_lista.querySelector('#notes').value = objLista.notes;
                    }
                }

                if(modo_guardar === 'fast'){
                    closeModal(null,true);
                    closeDiv(document.querySelector(`#bl_actions_buscar`));
                }
            }
           
        }else{
            console.log(`Error al añadir la lista.`);
            
            //"Error al añadir la lista.";
            console.error('data.error: ', data.error);

            let text_show = 'Error al añadir la lista.';
            
            if(form_mensaje_lista){
                form_mensaje_lista.innerHTML = `<span class="add_result add_error">${text_show}</span>`;
                //form_lista.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje
            }    

            if(hayElementosModalesAbiertos()){
                showToast('error', text_show, 5000);
            }
        }
    
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('guardarLista. error: ',error);
    }

}

async function deleteLista(){
    console.log('=== function deleteLista() ===');

    try {

        id_lista = objLista.id_lista;
        console.log('id_lista: ', id_lista);

        if(!hay_id_lista('deleteLista()')){
            return; // <- se detiene aquí si no hay id_song
        } 


        if(!id_lista){
            alert('id_lista no está indicado... hago return.');
            return;
        }

        const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE la lista con los siguientes datos? \nID: ${id_lista} \ntítulo: '${objLista.title}' \n\nEsta acción no se podrá deshacer.`);
        if(respuesta){
            console.log('sigo adelante para eliminar la lista...'); //clic en "Aceptar"
            if(promtConClaveSecreta()){
                console.log('Clave secreta correcta. Procedo a eliminar la lista.');
            }else{
                return;
            }
        } else {
            //console.log("7755. Cancelar..."); //clic en "Cancelar"
            return;
        }

        const data = await deleteListaFromBd();
        console.log('data: ',data);

        const contenedor_lista_sm = document.getElementById('contenedor_lista_sm');
        const p_mensaje = document.createElement('p');
        p_mensaje.className = 'mensaje';

        if(data.success){
            
            let text_show;
            text_show = 'Lista eliminada con éxito.';
            console.log(text_show);

            p_mensaje.innerHTML = `<span class="add_result add_ok">${text_show}</span>`;
            contenedor_lista_sm.prepend(p_mensaje);
            contenedor_lista_sm.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje


            if(data.id_lista){
                console.log('id_lista: ', data.id_lista);

                //Elimino elemento tr de la tabla tbody con la cancion eliminada
                // tbody_lista.querySelector(`.tr_lista[data-id="${id_lista}"]`).remove();
                eid_bl_listas_finded.querySelector(`.p_lista[data-id="${id_lista}"]`).remove();

                resetBlockLista();
                contenedor_lista_sm.querySelector('.wr_btns_eliminar').remove();
                contenedor_lista_sm.querySelector('.d_canciones_lista').remove();

                id_lista = null;
                objLista = {};//reseteo objeto lista
                arr_lista = [];//reseteo array lista

                setTimeout(()=>{
                    const aviso_outer = document.createElement('div');
                    aviso_outer.className = 'aviso_outer';
                    aviso_outer.innerHTML = `
                    <p class="p_aviso">${text_show}</p>
                    <p class="p_aviso">Busca una lista según tus criterios en la pestaña <b>Lista</b>.</p>
                    <button id="btn_lista" class="btn btn_big w_100" onclick="closeModal(null,true); showEdit('lista');">Buscar Lista</button>
                    `;
                    openModal('center','Aviso Eliminar Lista',aviso_outer,'showAviso2');
                }, 1000);
            }
            
        }else{
            console.log(`Error al eliminar la lista.`);
            
            //"Error al eliminar la lista";
            console.error('data.error: ', data.error);

            let text_show = 'Error al eliminar la lista.';

            p_mensaje.innerHTML = `<span class="add_result add_error">${text_show}</span>`;
            contenedor_lista_sm.scrollIntoView({behavior: 'smooth'});//hago scroll al top del formulario donde hay mensaje

            if(hayElementosModalesAbiertos()){
                showToast('ok', text_show, 5000);
            }
        }
    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('deleteSong. error: ',error);        
    }

}




function pintLineasXinBlock(contenedor){
    console.log('=== function pintLineasXinBlock() ===');
    
    const bloques_outerAll = contenedor.querySelectorAll('.bloques_outer');
    bloques_outerAll.forEach(el => {
        el.classList.add('datos_eliminados');//añado lineas rojas en forma de 'X'
    });
}

function resetLineasXinBlock(contenedor){
    console.log('=== function pintLineasXinBlock() ===');
    
    const bloques_outerAll = contenedor.querySelectorAll('.bloques_outer');
    bloques_outerAll.forEach(el => {
        el.classList.remove('datos_eliminados');//quito lineas rojas en forma de 'X'
    });
}



function resetFldActive(contenedor){
    contenedor.querySelectorAll('fieldset').forEach(el => {
        el.classList.remove('fld_active');
    });
}

function resetBtnActive(contenedor){
    contenedor.querySelectorAll('.btn').forEach(el => {
        el.classList.remove('btn_active');
    });
}

function resetTrSelected(contenedor){
    contenedor.querySelectorAll('tr').forEach(el => {
        el.classList.remove('selected');
    });
}

function resetPSongActive(contenedor) {
    contenedor.querySelectorAll('.p_song').forEach(p => {
        p.classList.remove('active');
    });
}

// function resetPListaFindedActive(contenedor) {
//     contenedor.querySelectorAll('.p_lista').forEach(p => {
//         p.classList.remove('active');
//     });
// }

function resetPListaActive(contenedor) {
    contenedor.querySelectorAll('.p_lista').forEach(p => {
        p.classList.remove('active');
    });
}

function contieneSoloAcordes(str) {// busca ÚNICAMENTE: acordes, barras
    //const regexAcorde = /^(?:\s*\|?\s*[A-H](#|b)?(m|maj7|m7|7|sus|sus2|sus4|dim|aug|add9|2|4|6|9|11|13)?(\/[A-H](#|b)?)?\s*\|?)*$/;
    //const regexAcorde = /^(?:\s*[|()\-\s]*[A-H](#|b)?(m|maj7|m7|m7-5|sus|sus2|sus4|dim|dim7|aug|add9|2|4|6|9|11|13)?(\/[A-H](#|b)?)?[|()\-\s]*)*$/;
    //const regexAcorde = /^(?:\s*(?:\|\|:|:\|\||[|()\-\s]*[A-H](#|b)?(?:m|maj7|m7|m7-5|m9|sus|sus2|sus4|dim|dim7|aug|add9|2|4|5|6|7|9|11|13)?(?:\/[A-H](#|b)?)?)[|()\-\s]*)*$/;//ok funciona

    const regexAcorde = /^(?:\s*(?:\|\|:|:\|\||\([^()]*\)|[|()\-\s]*[A-H](#|b)?(?:m|maj7|m7|m7-5|m9|m6|sus|sus2|sus4|dim|dim7|aug|add9|2|4|5|6|7|9|11|13)?(?:\/[A-H](#|b)?)?)[|()\-\s]*)*$/;//test new

    //'|D      |F#m |G  |G - (Cm7) |' => true;
    //'| Вступ |Dm  |G  |C         |' =>  false (palabra 'Вступ' no es acorde) 
    return regexAcorde.test(str.trim());
}

function contieneAcordes(str) {// busca CUALQUIER acorde , barra y texto
    const regexAcorde = /\b[ABCDEFGH](#|b)?(m|maj7|m7|m7-5|m9|m6|sus|sus2|sus4|dim|dim7|aug|add9|2|4|5|6|7|9|11|13)?(\/[ABCDEFGH](#|b)?)?\b/g;
    //'|D      |F#m |G  |G  |'  => true;
    //'| Вступ |Dm  |G  |C  |' =>  true (aunque hay palabra 'Вступ' que no es acorde en el texto hay al menos un acorde) 
    return regexAcorde.test(str);
}

function contieneSoloPuntos(str) {
    const regexPuntos = /^[\s|·.]*$/;// busca ÚNICAMENTE: 'espacios', '|', '·' o '.' repetidos las veces que sean, incluso ninguna (cadena vacía).
    return regexPuntos.test(str.trim());
}

function contienePuntos(str) {
    const regexPuntos = /[·|.]/;// busca CUALQUIER punto medio '·', punto normal '.', '|' barra
    return regexPuntos.test(str.trim());
}

function contieneSoloNota(str) {// antes del '(' pueden haber espacios ' ' y guiones '-'. ej.: '--- (texto nota) ---'
  const regex = /^\s*[-\s]*\(\s*.*\s*\)[-\s]*\s*$/;// busca ÚNICAMENTE cualquier palabra dentro de '()';// '     (modulación +2)     '
  return regex.test(str);
}


function showEdit(blockName = null){
    console.log('=== function showEdit() ===');

    eid_edit_contenido.classList.add('shown');

    if(!blockName){
        console.log('no hay blockName, por defecto pongo editar');
        blockName = 'buscar'; //por defecto
    }
    console.log('blockName: ', blockName);

    showBlockName(blockName);

    mySizeEdit();
}

function showOnlyBlock(blockName){
    ecl_edit_body.querySelectorAll('.bl_body .edit_blocks').forEach(bl =>{
        if(bl.id == `block_${blockName}`){//'block_buscar', 'block_cancion', etc...
            bl.classList.remove('d-none');
            bl.classList.add('d-block');
        }else{
            bl.classList.remove('d-block');
            bl.classList.add('d-none');
        }
    });
}



function hideEdit(){
    console.log('=== function hideEdit() ===');

    eid_edit_contenido.classList.remove('shown');
    mySizeEdit();
}

function mySizeEdit(){
    console.log('=== function mySizeEdit() ===');    
    
    let edit_body_h = 
      window.innerHeight 
    - ecl_edit_head.offsetHeight 
    ;

    console.log('edit_body_h: ', edit_body_h);    
    ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicat

    mySizeBuscar();
    mySizeEsquema();
    mySizeCancion();
    mySizeEjemplo();
    mySizeLista();
}




async function findWordsSong(){
    //console.log('=== async function findWordsSong() ===');
    console.time('time_findWordsNew');

    let words_input_trimed = eid_inpt_find.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo.value;
    let buscar_en = eid_buscar_en.value;
    //console.log('--- words_input: ', words_input);

    if(words_input == ''){
        console.log('1. no has introducido nada....');
        return;
    }

    // 1) Coger todos los checkbox marcados
    const checkboxes = eid_wr_sb_checkboxes.querySelectorAll('input[name="songbooks"]:checked');
    console.log('--- checkboxes: ', checkboxes);

    // 2) Meter los valores en un array
    let arr_songbooks_search = Array.from(checkboxes).map(cb => cb.value);
    console.log('Valores seleccionados. arr_songbooks_search:', arr_songbooks_search);
    
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

    objFindParams.words_input = words_input;
    objFindParams.modo = modo;
    objFindParams.buscar_en = buscar_en;
    objFindParams.arr_songbooks_search = arr_songbooks_search;

    objDataSongsBd = await getDataSongsFromBdByFind(objFindParams);
    console.log('objDataSongsBd: ', objDataSongsBd);

    if(esObjeto(objDataSongsBd) && objDataSongsBd.arr_data.length > 0){
        console.log('hay coincidencias...');
        
        //Clono objeto
        objDataSongs = structuredClone(objDataSongsBd);
        console.log('objDataSongs: ', objDataSongs);

        //tbody.innerHTML = '';//reset
        eid_bl_songs_finded.innerHTML = '';//reset
        
        eid_titulo_tabla_song.querySelector('b').style.display = 'inline';
        eid_titulo_tabla_song.querySelector('b').textContent = objDataSongs.arr_data.length;        
        
        eid_sp_icon_filtro.classList.remove('d-none');//muestro el boton de filtro

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

        //CREAR DIV'S Y P'S
        //Recorrer canciones encontradas... 
        objDataSongs.arr_data.forEach((el, i, arr) => {
            //console.log('el: ', el);

            const p_song = document.createElement('p');
            p_song.className = 'p_song';
            p_song.dataset.id = el.id_song;

            let hay_esquema_texto;

            //convierto arr_esquema (string) en array correcto
            if(esString(el.arr_esquema) && el.arr_esquema != ''){
                el.arr_esquema = JSON.parse(el.arr_esquema);
                hay_esquema_texto = `Sí (${el.arr_esquema.length})`;
            }else{
                el.arr_esquema = [];
                hay_esquema_texto = '';
            }
            console.log('(parseado) --- el.arr_esquema: ', el.arr_esquema);

            let category_name_text = '';
            if(el.category != 0 && el.category_name != null){
                //inportante en una linea
                category_name_text = `<span class="sp_number">${el.category}.</span> <span class="sp_name">${el.category_name}</span>`;
            }

            let songbook_title_text = '';
            if(el.songbook != 0 && el.songbook_title != null){
                //inportante en una linea
                songbook_title_text = `<span class="sp_number">${el.songbook}.</span> <span class="sp_name">${el.songbook_title}</span>`;
            }

            let lang_name_text = '';
            if(el.lang){
                lang_name_text = obj_lang_names[el.lang];
            }

            let cl_title = (el.title) ? '' : 'd-none';//si no hay título, lo oculto 
            let cl_title2 = (el.title2) ? '' : 'd-none';//si no hay título, lo oculto 
            let cl_title_note = (el.title_note) ? '' : 'd-none';//si no hay título, lo oculto 
            let cl_tune_transpose = (el.tune_transpose != 0) ? '' : 'd-none';//si no hay título, lo oculto 

            p_song.innerHTML = `
                <span class="wn_2_flex">
                
                    <span class="sp_flex_btns">
                        <span class="solo_en_mobile">
                            <span class="l_id">${el.id_song}</span>
                        </span>            
                        <span class="wr_parte_noid">  
                            <span class="l_idioma">${lang_name_text}</span>
                            <span class="l_tune">${el.tune}</span>
                            <span class="l_tune_transpose ${cl_tune_transpose}">${el.tune_transpose || ''}</span>
                            <span class="l_edit"><img src="images/icon_edit_white.svg"></span> 
                            <span class="l_puntos d-none"><img class="btn_img" src="./images/tres_puntos_vertical_white.svg"></span> 
                        </span>
                    </span>            
            
                    <span class="sp_flex_n_title"> 
                        <span class="solo_en_desktop">
                            <span class="l_id">${el.id_song}</span>
                        </span>            
                        <span class="l_title">
                            <span class="cl_title ${cl_title}">${el.title || ''}</span>
                            <span class="cl_title2 ${cl_title2}">${el.title2 || ''}</span>
                            <span class="cl_title_note ${cl_title_note}">${el.title_note || ''}</span>
                        </span>
                    </span>
            
                </span>
            `;

            p_song.onclick = async (e) => {
                // showToast('info', '3. p_song clicked en 3755', 1500);//test

                console.log('e.currentTarget: ', e.currentTarget);

                id_song = e.currentTarget.dataset.id;
                console.log('asigno global --- id_song: ', id_song); 

                // siempre al clicar en cualquier parte del p_song se pinta como activo
                // y se muestran datos a la derecha, pero dependiendo de donde se haga clic se muestra una cosa u otra:
                pintSongActive();

                //id_song
                if(e.target.classList.contains('l_id') || e.target.closest('.l_id')){//clic en el id_song
                    console.log('clic en el id de la cancion'); 
                    showBlockName('esquema');
                    showVklad(document.getElementById('btn_select_slide'),'select_slide');
                }
                
                //edit
                if(e.target.classList.contains('l_edit') || e.target.closest('.l_edit')){//clic en el boton de editar
                    console.log('clic en el boton de editar');
                    showBlockName('cancion'); 
                    editar_song();
                }
                
                //puntos - REVISAR LUEGO...
                // if(e.target.classList.contains('l_puntos') || e.target.closest('.l_puntos')){
                //     console.log('clic en el boton de opciones (tres puntos)');
                //     btn_actions_buscar.click();//simulo click en tres puntos en head... 
                // }               

            }

            eid_bl_songs_finded.append(p_song);
        });

    }else{
        console.log('no hay coincidencias...');
        
        eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        //tabla. antes
        // tbody.innerHTML = `
        //     <tr>
        //         <td colspan="10" class="td_no_data">
        //             <p class="prim">No se encontraron canciones con la frase: "<b>${words_input_trimed}</b>"</p>
        //         </td>
        //     </tr>
        // `;

        //new

        let link_google = `https://www.google.com/search?q=${words_input_trimed}`;
        let link_holychords = `https://holychords.pro/search?_token=1&name=${words_input_trimed}&is_page=1`;

        eid_bl_songs_finded.innerHTML = `
            <p class="prim">No se encontraron canciones con la frase: "<b>${words_input_trimed}</b>"</p>
            <p class="disp_flex">
                <button class="btn" onclick="window.open('${link_google}', '_blank')">Buscar en Google</button>
                <button class="btn" onclick="window.open('${link_holychords}', '_blank')">Buscar en HolyChords</button>
            </p>
        `;
    }

    console.timeEnd('time_findWordsNew');
}


async function findWordsLista(){
    console.log('=== async function findWordsLista() ===');
    console.time('time_findWordsLista');
    
    let words_input_trimed = eid_inpt_find_lista.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = eid_modo_lista.value;
    let buscar_en = eid_buscar_en_lista.value;
    console.log('--- words_input: ', words_input);

    if(words_input == ''){
        console.log('21. no has introducido nada....');
        return;
    }
        
    //reasigno arr_words_lista global
    if(words_input.includes(' ')){
        arr_words_lista = words_input.split(' ');
    }else{
        arr_words_lista = [words_input];
    }

    if(arr_words_lista.length === 0){
        console.log('2. no has introducido nada....');
        return;
    }

    objFindListaParams.words_input = words_input;
    objFindListaParams.modo = modo;
    objFindListaParams.buscar_en = buscar_en;

    objDataListasBd = await getDataListasFromBdByFind(objFindListaParams);
    console.log('objDataListasBd: ', objDataListasBd);

    if(esObjeto(objDataListasBd) && objDataListasBd.arr_data.length > 0){
        console.log('hay coincidencias...');

        //Clono objeto
        objDataListas = structuredClone(objDataListasBd);
        console.log('objDataListas: ', objDataListas);

        //tbody_lista.innerHTML = '';//reset
        eid_bl_listas_finded.innerHTML = '';//reset

        eid_titulo_tabla_lista.querySelector('b').style.display = 'inline';
        eid_titulo_tabla_lista.querySelector('b').textContent = objDataListas.arr_data.length;


        eid_sp_icon_filtro_lista.classList.remove('d-none');//muestro el boton de filtro

        //Parametros para filtrar resultados de buscar
        const contenedor_filtro = eid_d_filter_results_lista;
        const sp_icon_filtro = eid_sp_icon_filtro_lista;
        const el_input = eid_inpt_filter_lista;
        // const selector_items = '.tr_lista';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const selector_items = '.p_lista';//CLASES JUNTOS!. los elementos que se ocultarán, si no cumplen con el filtro
        const arr_spans = [
            '.solo_en_mobile .l_id_lista',//para que busque solo en 1 y no 2 que son iguales
            '.cl_dia_semana',    
            '.cl_fecha',    
            '.cl_title',    
            '.cl_grupo_nombre',
            '.cl_notes'
            // '.td_id_lista',    
            // '.td_titulo',    
            // '.td_dia_semana',    
            // '.td_fecha',    
            // '.td_lista'
        ];//se buscará texto en cada elemento de estos span's
        addFilterListener(contenedor_filtro, sp_icon_filtro, el_input, selector_items, arr_spans);



        //CREAR DIV'S Y P'S
        //Recorrer listas encontradas...
        objDataListas.arr_data.forEach((el, i, arr) => {
            console.log('el: ', el);

            const p_lista = document.createElement('p');
            p_lista.className = 'p_lista lista_finded';
            
            // if(el.id_lista == id_lista){
            //     p_lista.className = 'p_lista lista_finded active';
            // }else{
            //     p_lista.className = 'p_lista lista_finded';
            // }

            p_lista.dataset.id = el.id_lista;

            let hay_lista_texto;
            let cl_num_canciones;

            //convierto arr_esquema (string) en array correcto
            if(esString(el.arr_lista) && el.arr_lista != ''){
                el.arr_lista = JSON.parse(el.arr_lista);
                hay_lista_texto = `${el.arr_lista.length}`;//antes: canciones: 12
                cl_num_canciones = '';
            }
            else if(esArray(el.arr_lista) && el.arr_lista.length > 0){
                hay_lista_texto = `${el.arr_lista.length}`;//antes: canciones: 12
                cl_num_canciones = '';
            }
            else{
                el.arr_lista = [];
                hay_lista_texto = '';
                cl_num_canciones = 'd-none';
            }
            console.log('(parseado) --- el.arr_lista: ', el.arr_lista);            

            let fecha_str = (el.fecha && el.fecha !== '0000-00-00') ? el.fecha : '' ;
            let diaSemana_val = '';
            let fecha_val = '';

            if(fecha_str){
                diaSemana_val = diaSemana(fecha_str);
                fecha_val = convertirFecha(fecha_str, 'ver', '/');
            }


            let cl_title = (el.title) ? '' : 'd-none';//si no hay título, lo oculto 
            let cl_grupo_nombre = (el.id_grupo > 0 && el.grupo_nombre != '') ? '' : 'd-none';//si no hay grupo, lo oculto 
            let cl_notes = (el.notes) ? '' : 'd-none';//si no hay título, lo oculto


            p_lista.innerHTML = `
                <span class="solo_en_desktop">
                    <img class="btn_img" src="./images/checklist2_24x24.png">
                </span>
                
                <span class="wn_2_flex">
                    
                    <span class="sp_flex_btns">
                        <span class="solo_en_mobile">
                            <img class="btn_img" src="./images/checklist2_24x24.png">
                        </span>
                        <span class="solo_en_mobile">
                            <span class="l_id_lista">${el.id_lista}</span>
                        </span>
                        <span class="wr_parte_noid">  
                            <span class="l_num_canciones ${cl_num_canciones}">${hay_lista_texto}</span>
                        </span>
                    </span>            
            
                    <span class="sp_flex_n_title">
                        <span class="solo_en_desktop"> 
                            <span class="l_id_lista">${el.id_lista}</span>
                        </span>            
                        <span class="l_title">

                            <span class="wr_dia_y_fecha">
                                <span class="cl_dia_semana cl_title_note">${diaSemana_val}</span>
                                <span class="cl_fecha cl_title_note">${fecha_val || ''}</span>
                            </span>

                            <span class="cl_title ${cl_title}">${el.title || ''}</span>
                            <span class="cl_grupo_nombre ${cl_grupo_nombre}">${el.grupo_nombre}</span>
                            <span class="cl_notes cl_title_note ${cl_notes}">${el.notes || ''}</span>
                        </span>
                    </span>
            
                </span>
            `;

            p_lista.onclick = (e) => {                
                // showToast('info', '1. p_lista clicked en 4039', 1500);//test
                
                console.log('e.currentTarget: ', e.currentTarget);
    
                id_lista = e.currentTarget.dataset.id;
                console.log('asigno global --- id_lista: ', id_lista);                
                
                pintListaActive();//en la ventana a la derecha de la tabla de lista
            }

            // tbody_lista.append(tr_lista);
            eid_bl_listas_finded.append(p_lista);
        });

    }else{
        console.log('no hay coincidencias...');

        eid_sp_icon_filtro_lista.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar

        // tbody_lista.innerHTML = `
        //     <tr>
        //         <td colspan="6" class="td_no_data">
        //             <p class="prim">No se encontraron listas con la frase: "<b>${words_input}</b>"</p>
        //         </td>
        //     </tr>
        // `;

        //new
        eid_bl_listas_finded.innerHTML = `
            <p class="prim">No se encontraron listas con la frase: "<b>${words_input_trimed}</b>"</p>
        `;
    }

    console.timeEnd('time_findWordsLista');
}




function convertirFechaAntes(fechaStr) {// de '01:31:2021' que es 31 de enero de 2021 => '2021-01-31'
    // Separar por ':'
    if(!fechaStr) return;
    const partes = fechaStr.split(':');
    if (partes.length !== 3) return null; // formato no válido

    const dia = partes[1].padStart(2, '0');
    const mes = partes[0].padStart(2, '0');
    const anio = partes[2];

    return `'${anio}-${mes}-${dia}'`;
}

function pintSongbooksOptions(selectElement){
    selectElement.innerHTML = '';//reset
    //Recorrer objSongbooks
    Object.values(objSongbooks).forEach(songbook => {
        const option = document.createElement('option');
        option.value = songbook.id_songbook;
        option.innerHTML = `${songbook.id_songbook}. ${songbook.title}`;
        selectElement.append(option);
    });
}





async function nueva_song(){
    console.log('=== function nueva_song() ===');

    id_song = null;//reset id_song -> ya que es nueva canción

    //reseteo datos de la song anterior para evitar confusión
    resetBlockBuscar();
    resetBlockEsquema();
    resetLineasXinBlock(eid_block_cancion);

    eid_block_cancion_head.querySelector('#btn_cancion_refresh')?.remove();
    eid_block_cancion_head.querySelector('.separador.for_btn_cancion_refresh')?.remove();

    const id_song_num = document.querySelector('.vista_fixed_head #id_song_num');//reset new
    if(id_song_num){
        id_song_num.textContent = '...'
    }
    const id_song_pos = document.querySelector('.vista_fixed_head #id_song_pos');//reset new
    if(id_song_pos){
        id_song_pos.textContent = '.. / ..'
    }    

    mostrarPrim = false;    
    ocultarElementosPrimEn(cancion_option_inner);
    ocultarElementosEditablesEn(cancion_option_inner);


    // cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_vista_blocks.querySelector('.contenedor').innerHTML = '...';//reset
    document.querySelector('.vista_fixed .d_contenedor .contenedor').innerHTML = '';//reset new
    cancion_ul_action.innerHTML = '...';//reset 
    cancion_song_bloques.classList.add('solo_ver'); 
    

    buildFormCancion(cancion_song_bloques, cancion_action = 'nueva');

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Nueva Canción:';

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l .h4_vista_previa').innerHTML = `
        <span>Nueva Canción:</span>

        <button class="btn btn_vista btn_v_lista ${!id_lista ? 'd-none' : ''}" onclick="openModal('full','Lista actual',null,'buildLista',true, 'ver_sm');">
            <img src="./images/checklist2_24x24.png">
            <span>Lista</span>
        </button>
        
        <button class="btn btn_vista btn_v_revisar" onclick="guardarSong(this,'cancion_song_bloques','editar', true);">
            <img src="./images/atencion.png">
            <span>Revisar</span>
        </button>
        
        <button class="btn btn_vista btn_v_guardar" onclick="guardarSong(this,'cancion_song_bloques','editar');">
            <img src="./images/guardar.png">
            <span>Guardar</span>
        </button>

        <button class="btn btn_vista btn_v_vista" onclick="mostrarVistaFixed();">
            <img src="./images/ojo24x24_2.png">
            <span>Vista</span>
        </button>
    `;

    makeBtnActive(eid_block_cancion_head, eid_btn_song_nueva);

    cancion_ul_action.innerHTML = `
        <li class="li_action" onclick="showBlockName('buscar');">Buscar</li>

        <div class="razdel">Aspecto:</div>
        <li class="li_action" onclick="cambiarTema('#tema_block');">Cambiar Tema</li>
        <li class="li_action" onclick="ajustarAnchoMaximo('#tema_block fieldset');">Ajustar Ancho Máximo</li>
        <li class="li_action" onclick="resetAnchoMaximo('#tema_block fieldset');">Reset Ancho Máximo</li>

        <div class="razdel">Acordes y Texto:</div>
        <li class="li_action" onclick="ocultarAcordes('#tema_block');">Ocultar Acordes</li>
        <li class="li_action" onclick="mostrarAcordes('#tema_block');">Mostrar Acordes</li>
        <li class="li_action" onclick="ocultarTexto('#tema_block');">Ocultar Texto</li>
        <li class="li_action" onclick="mostrarTexto('#tema_block');">Mostrar Texto</li>
        
        <div class="razdel">Copiar:</div>
        <li class="li_action" onclick="copyTextFromVista('#tema_block fieldset');">Copiar texto en consola</li>        
        <li class="li_action" onclick="copiarConFormato('#tema_block');">Copiar texto con formato</li>
        <li class="li_action" onclick="copiarSinAcordesConFormato('#tema_block');">Copiar texto SIN ACORDES</li>
        
        <div class="razdel">Fuente:</div>
        <li class="li_action" onclick="addMonospaceFont();">Add Monospace font</li>
        <li class="li_action" onclick="removeMonospaceFont();">Remove Monospace font</li>

    `;
    cancion_ul_action.onclick = e => close_ul_action(e);

    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit    
    console.log('fin');
}




function ver_song(){
    console.log('=== function ver_song() ===');
    console.log('redirect a editar_song() tmp');

    editar_song();
    return;

    if(!hay_id_song('ver_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);
    
    mostrarPrim = false;
    mostrarElementosEditablesEn(cancion_option_inner);
    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Ver canción:';

    makeBtnActive(eid_block_cancion_head, eid_btn_song_ver);  


    //cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_vista_blocks.querySelector('.contenedor').innerHTML = '...';//reset
    cancion_ul_action.innerHTML = '...';//reset 
    cancion_song_bloques.classList.add('solo_ver');

    buildFormCancion(cancion_song_bloques, cancion_action = 'ver');//'ver', 'editar'

    cancion_ul_action.innerHTML = `
        <div class="razdel">Lista:</div>
        <li class="li_action btn_add_lista" onclick="addToLista();">    
            <!--Añadir a una Lista nueva o a la lista actual-->
        </li>

        <div class="razdel">Esquema:</div>
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); select_slide();">Select slide</li>
        
        <div class="razdel">Diapositivas:</div>
        <li class="li_action" onclick="crearSlides();">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Crear slides + Ver</li>

        <div class="razdel">Aspecto:</div>
        <li class="li_action" onclick="cambiarTema('#tema_block');">Cambiar Tema</li>
        <li class="li_action" onclick="ajustarAnchoMaximo('#tema_block fieldset');">Ajustar Ancho Máximo</li>
        <li class="li_action" onclick="resetAnchoMaximo('#tema_block fieldset');">Reset Ancho Máximo</li>

        <div class="razdel">Acordes y Texto:</div>
        <li class="li_action" onclick="ocultarAcordes('#tema_block');">Ocultar Acordes</li>
        <li class="li_action" onclick="mostrarAcordes('#tema_block');">Mostrar Acordes</li>
        <li class="li_action" onclick="ocultarTexto('#tema_block');">Ocultar Texto</li>
        <li class="li_action" onclick="mostrarTexto('#tema_block');">Mostrar Texto</li>
        
        <div class="razdel">Copiar:</div>
        <li class="li_action" onclick="copyTextFromVista('#tema_block fieldset');">Copiar texto en consola</li>        
        <li class="li_action" onclick="copiarConFormato('#tema_block');">Copiar texto con formato</li>
        <li class="li_action" onclick="copiarSinAcordesConFormato('#tema_block');">Copiar texto SIN ACORDES</li>
        
        <div class="razdel">Fuente:</div>
        <li class="li_action" onclick="addMonospaceFont();">Add Monospace font</li>
        <li class="li_action" onclick="removeMonospaceFont();">Remove Monospace font</li>

    `;
    cancion_ul_action.onclick = e => close_ul_action(e);

    console.log('fin');    
}


function editar_song(){
    console.log('=== function editar_song() ===');

    if(!hay_id_song('editar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    mostrarPrim = false;
    mostrarElementosEditablesEn(cancion_option_inner);


    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l .h4_vista_previa').innerHTML = `
        <span>Canción:</span>

        <button class="btn btn_vista btn_v_lista ${!id_lista ? 'd-none' : ''}" onclick="openModal('full','Lista actual',null,'buildLista',true, 'ver_sm');">
            <img src="./images/checklist2_24x24.png">
            <span>Lista</span>
        </button>
        
        <button class="btn btn_vista btn_v_revisar" onclick="guardarSong(this,'cancion_song_bloques','editar', true);">
            <img src="./images/atencion.png">
            <span>Revisar</span>
        </button>
        
        <button class="btn btn_vista btn_v_guardar" onclick="guardarSong(this,'cancion_song_bloques','editar');">
            <img src="./images/guardar.png">
            <span>Guardar</span>
        </button>

        <button class="btn btn_vista btn_v_vista" onclick="mostrarVistaFixed();">
            <img src="./images/ojo24x24_2.png">
            <span>Vista</span>
        </button>
    `;

    makeBtnActive(eid_block_cancion_head, eid_btn_song_editar);

    //creo btn actualizar song
    const element_btn_cancion_refresh = eid_block_cancion.querySelector('#btn_cancion_refresh');
    if(!element_btn_cancion_refresh){
        const ejemplo_btn_cancion_refresh = `
            <button id="btn_cancion_refresh" class="btn btn_refresh" onclick="refreshSong()">
                <img src="images/refresh.png" class="">
                <span>Actualizar</span>
            </button>        
        `;
        const btn_cancion_refresh = document.createElement('button');
        btn_cancion_refresh.id = 'btn_cancion_refresh';
        btn_cancion_refresh.className = 'btn btn_refresh';
        btn_cancion_refresh.innerHTML = `
            <img src="images/refresh.png" class="">
            <span>Actualizar</span>
        `;
        btn_cancion_refresh.onclick = () => refreshSong();

        const separador = document.createElement('div');
        separador.className = 'separador for_btn_cancion_refresh';

        //añado al DOM
        eid_block_cancion_head.querySelector('.wr_block_option_inner').prepend(separador);
        eid_block_cancion_head.querySelector('.wr_block_option_inner').prepend(btn_cancion_refresh);
    }
    
    

    // cancion_wr_vista_blocks.innerHTML = '...';//reset
    cancion_wr_vista_blocks.querySelector('.contenedor').innerHTML = '';//reset
    document.querySelector('.vista_fixed .d_contenedor .contenedor').innerHTML = '';//reset new
    cancion_ul_action.innerHTML = '...';//reset 
    cancion_song_bloques.classList.add('solo_ver');
   

    buildFormCancion(cancion_song_bloques, cancion_action = 'editar');//'ver', 'editar'

    let currentIndexOfSong = -1;//por defecto (significa no hay)
    if(Object.keys(objLista).length > 0){
        currentIndexOfSong = objLista.arr_lista.findIndex(item => item.id_song == id_song);
    }

    if(currentIndexOfSong != -1){//si hay cancion en la lista. muestro id_song CON posición
        let song_pos = `${currentIndexOfSong + 1} / ${objLista.arr_lista.length}`; 
        document.querySelector('.vista_fixed .vista_fixed_head .vp_titulo').innerHTML = `
            <div id="id_song_num">${objSong.id_song}</div>
            <div id="id_song_pos">${song_pos}</div>
        `;
        //muestro botones de sig/prev song ya que hay cancion en la lista
        document.querySelector('.vista_fixed .d_menu_over .wr_btns_next_prev').classList.remove('d-none');

    }else{//no hay cancion en la lista. solo muestro id_song sin posición
        document.querySelector('.vista_fixed .vista_fixed_head .vp_titulo').innerHTML = `
            <div id="id_song_num">${objSong.id_song}</div>
        `;
        //oculto botones de sig/prev song ya que no hay cancion en la lista
        document.querySelector('.vista_fixed .d_menu_over .wr_btns_next_prev').classList.add('d-none');//oculto botones next-prev porque no hay lista o la canción no está en la lista
    }


    cancion_ul_action.innerHTML = `
        <div class="razdel">Lista:</div>
        <li class="li_action btn_add_lista" onclick="addToLista();">    
            <!--Añadir a una Lista nueva o a la lista actual-->
        </li>

        <div class="razdel">Esquema:</div>
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); crear_esquema();">Crear esquema</li>
        <li class="li_action" onclick="showBlockName('esquema'); select_slide();">Select slide</li>
        
        <div class="razdel">Diapositivas:</div>
        <li class="li_action" onclick="crearSlides();">Crear slides</li>
        <li class="li_action" onclick="crearSlides(); closeAll()">Crear slides + Ver</li>  
        
        <div class="razdel">Aspecto:</div>
        <li class="li_action" onclick="cambiarTema('#tema_block');">Cambiar Tema</li>
        <li class="li_action" onclick="ajustarAnchoMaximo('#tema_block fieldset');">Ajustar Ancho Máximo</li>
        <li class="li_action" onclick="resetAnchoMaximo('#tema_block fieldset');">Reset Ancho Máximo</li>

        <div class="razdel">Acordes y Texto:</div>
        <li class="li_action" onclick="ocultarAcordes('#tema_block');">Ocultar Acordes</li>
        <li class="li_action" onclick="mostrarAcordes('#tema_block');">Mostrar Acordes</li>
        <li class="li_action" onclick="ocultarTexto('#tema_block');">Ocultar Texto</li>
        <li class="li_action" onclick="mostrarTexto('#tema_block');">Mostrar Texto</li>
        
        <div class="razdel">Copiar:</div>
        <li class="li_action" onclick="copyTextFromVista('#tema_block fieldset');">Copiar texto en consola</li>        
        <li class="li_action" onclick="copiarConFormato('#tema_block');">Copiar texto con formato</li>
        <li class="li_action" onclick="copiarSinAcordesConFormato('#tema_block');">Copiar texto SIN ACORDES</li>
        
        <div class="razdel">Fuente:</div>
        <li class="li_action" onclick="addMonospaceFont();">Add Monospace font</li>
        <li class="li_action" onclick="removeMonospaceFont();">Remove Monospace font</li>
    `;
    cancion_ul_action.onclick = e => close_ul_action(e);

    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit
    console.log('fin');    
}



async function listaSongGo(dirrection){
    console.log(' === function listaSongGo() ===');
    console.log('ir a la siguiente o previa canción de la lista');

    let currentIndexOfSong = objLista.arr_lista.findIndex(item => item.id_song == id_song);
    let prevIndexOfSong = currentIndexOfSong - 1;
    let nextIndexOfSong = currentIndexOfSong + 1;
    let aviso_text = '';      
   

    if(dirrection === 'prev'){
        console.log('ir a la canción anterior');
        let prev_id_song = objLista.arr_lista[prevIndexOfSong]?.id_song;

        if(prev_id_song === undefined){
            aviso_text = 'Has llegado a la primera canción.';

            showToast('info', aviso_text, 1500, 'bottom', false,'', document.querySelector('.vista_fixed_body'));
            return;
        }
        
        const element_clicked = eid_block_lista.querySelector(`.vista_lista_content .p_lista[data-id_song="${prev_id_song}"]`);

        await editSongOfLista(element_clicked, prev_id_song);
    }

    if(dirrection === 'next'){
        console.log('ir a la canción siguiente');

        let next_id_song = objLista.arr_lista[nextIndexOfSong]?.id_song;
        if(next_id_song === undefined){
            aviso_text = 'Has llegado a la última canción.';

            showToast('info', aviso_text, 1500, 'bottom', false,'', document.querySelector('.vista_fixed_body'));
            return;
        }
        
        const element_clicked = eid_block_lista.querySelector(`.vista_lista_content .p_lista[data-id_song="${next_id_song}"]`);

        await editSongOfLista(element_clicked, next_id_song);
    }
}


function parteSongGo(dirrection){
    console.log(' === function parteSongGo() ===');
    console.log('ir a la siguiente o previa parte de la canción. como swipe abajo o arriba');

    if(dirrection === 'next'){
        console.log('ir a la parte siguiente');

        const fieldsets = [
            ...d_contenedor.querySelectorAll('fieldset.kuplet')
        ];
    
        const containerTop = d_contenedor.scrollTop;
        const containerBottom = containerTop + d_contenedor.clientHeight;

        console.log('=== avanzar ===');
        let moved = false;
        
        // ====================================
        // 1. parcialmente visible abajo
        // ====================================
        for (const fs of fieldsets) {

            const fsTop = fs.offsetTop;
            const fsBottom = fsTop + fs.offsetHeight;

            // parcialmente visible abajo
            if (
                fsTop < containerBottom &&
                fsBottom > containerBottom
            ) {

                // guardar posición REAL actual
                swipeHistory.push(d_contenedor.scrollTop);
                console.log('swipeHistory: ', swipeHistory);

                // mover al siguiente bloque
                d_contenedor.scrollTop = fsTop - 10;//'-10' para que quede un poco visible 

                updatePartialFieldsets(); 
                moved = true;
                break;
            }
        }


        // ====================================
        // 2. siguiente bloque completo
        // ====================================
        if (!moved) {

            for (const fs of fieldsets) {

                const fsTop = fs.offsetTop;

                // completamente debajo
                if (fsTop > containerBottom) {

                    swipeHistory.push(
                        d_contenedor.scrollTop
                    );

                    console.log(
                        'swipeHistory:',
                        swipeHistory
                    );

                    d_contenedor.scrollTop = fsTop;

                    updatePartialFieldsets();

                    break;
                }
            }
        }

    }//end - next

    
    if(dirrection === 'prev'){
        console.log('ir a la parte anterior');

        if(swipeHistory.length === 0){
            return;
        }

        const prevScrollTop = swipeHistory.pop();
        console.log('prevScrollTop:', prevScrollTop);

        d_contenedor.scrollTop = prevScrollTop;

        updatePartialFieldsets();        
    }//end - prev
}


function hideShowFontMenu(){
    const menu_font_size = cancion_wr_vista_blocks.querySelector('#btn_menu_font_size');
    //const wr_btns_f_inner = cancion_wr_vista_blocks.querySelector('.wr_btns_f_inner');
    const outer_wr = cancion_wr_vista_blocks.querySelector('.outer_wr');
    const hamburger2 = document.getElementById('hamburger2');
    
    let head_h = cancion_wr_vista_blocks.querySelector('.wr_dbtn_fullscreen').offsetHeight;
    let block_h = cancion_tema_block.offsetHeight;
    //outer_wr.style.height = block_h - head_h + 'px';

    // if(wr_btns_f_inner.classList.contains('shown')){
    //     wr_btns_f_inner.classList.remove('shown');
    // }else{
    //     wr_btns_f_inner.classList.add('shown');
    // }

    if(outer_wr.classList.contains('shown')){
        outer_wr.classList.remove('shown');//oculto
        hamburger2.classList.remove('active'); // Cambiar flecha a hamburguesa
    }else{
        outer_wr.classList.add('shown');//muestro
        hamburger2.classList.add('active'); // Cambiar hamburguesa a flecha
    }
}


function toggleAcordes() {
    // const btn_state_acordes = cancion_wr_vista_blocks.querySelector('#btn_state_acordes');
    const btn_state_acordes = eid_block_cancion.querySelector('.d_menu_over #btn_state_acordes');
    let text_estado = '';

    if (acordesVisible) {
        ocultarAcordes('#tema_block');
        btn_state_acordes.querySelector('img').src = "/song/images/music_note_off32x32.png";
        text_estado = 'Acordes ocultados (si hay)';
    } else {
        mostrarAcordes('#tema_block');
        btn_state_acordes.querySelector('img').src = "/song/images/music_note_on32x32.png";
        text_estado = 'Acordes mostrados (si hay)';
    }

    acordesVisible = !acordesVisible;

    showToast('info', text_estado, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}

function toggleTexto() {
    // const btn_state_text = cancion_wr_vista_blocks.querySelector('#btn_state_texto');
    const btn_state_text = eid_block_cancion.querySelector('.d_menu_over #btn_state_texto');
    let text_estado = '';

    if (textoVisible) {
        ocultarTexto('#tema_block');
        btn_state_text.querySelector('img').src = "/song/images/text_off32x32.png";
        text_estado = 'Texto ocultado';
    } else {
        mostrarTexto('#tema_block');
        btn_state_text.querySelector('img').src = "/song/images/text_on32x32.png";
        text_estado = 'Texto mostrado';
    }

    textoVisible = !textoVisible;

    showToast('info', text_estado, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}

function toggleContenidoWidth() {
    // const btn_state_contenido_width = cancion_wr_vista_blocks.querySelector('#btn_state_contenido_width');
    const btn_state_contenido_width = eid_block_cancion.querySelector('.d_menu_over #btn_state_contenido_width');
    let text_estado = '';

    if (contenidoWidth) {
        quitarContenidoWidth('#tema_block');
        btn_state_contenido_width.querySelector('img').src = "/song/images/auto_width_off.png";
        
        if(acordesVisible){
            text_estado = 'Contenido no ajustado a lo ancho y puede sobresalir de la vista. Los acordes se ven según el tipo de fuente guardado. Ajusta la fuente para que quepa bien.';
        }else{
            text_estado = 'Contenido no ajustado a lo ancho disponible. Ajusta la fuente para que quepa bien.';
        }

    } else {
        aplicarContenidoWidth('#tema_block');
        btn_state_contenido_width.querySelector('img').src = "/song/images/auto_width_on.png";
        if(acordesVisible){
            text_estado = 'Contenido ajustado a lo ancho disponible. Los acordes se ven desplazados de sus posiciones originales.';
        }else{
            text_estado = 'Contenido ajustado a lo ancho disponible.';
        }
    }

    contenidoWidth = !contenidoWidth;

    showToast('info', text_estado, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}






function eliminar_song(){
    console.log('=== function eliminar_song() ===');

    if(!hay_id_song('eliminar_song()')){
        return; // <- se detiene aquí si no hay id_song
    }

    resetLineasXinBlock(eid_block_cancion);

    mostrarPrim = false;
    mostrarElementosEditablesEn(cancion_option_inner);
    mySizeCancion();//importante después de quitar opt_prim y mostrar opt_edit

    //Partes left-right
    eid_block_cancion.querySelector('.bl_parte_l h4').textContent = 'Eliminar canción:';

    makeBtnActive(eid_block_cancion_head, eid_btn_song_eliminar);

    //cancion_wr_vista_blocks.innerHTML = '...';//reset
    //cancion_ul_action.innerHTML = '...';//reset    
    cancion_song_bloques.classList.add('solo_ver');

    buildFormCancion(cancion_song_bloques, cancion_action = 'eliminar');

    cancion_ul_action.innerHTML = `
        <li class="li_action" onclick="showBlockName('esquema'); ver_esquema();">Ver esquema</li>                
        <li class="li_action btn_eliminar" onclick="deleteSong(event);">Eliminar Canción DEFINITIVAMENTE</li>                
    `;
    cancion_ul_action.onclick = e => close_ul_action(e);

    console.log('fin');    
}





function showEjemplo(lang){
    console.log('=== function showEjemplo() ===');

    if(Object.keys(obj_lang_names).includes(lang)){
        console.log('lang: ', lang);
    
        ejemplo_wr_vista_blocks.innerHTML = '...';//reset    
        ejemplo_song_bloques.classList.add('solo_ver'); 
        
        const btn_to_active = eid_block_ejemplo_head.querySelector(`#btn_ejemplo_${lang}`)
        makeBtnActive(eid_block_ejemplo_head, btn_to_active);

        pageActiveEjemplo = lang;

        ejemplo_ul_action.innerHTML = `
            <li class="li_action" onclick="openModal('full','Ejemplo',null,'buildFormEjemplo',true, '${lang}')">Ejemplo (${obj_lang_names[lang]})</li>
        `;
        ejemplo_ul_action.onclick = e => close_ul_action(e);
        
        const contenedor = ejemplo_song_bloques; 

        buildFormEjemplo(contenedor, lang);
    }
}


function addToLista(new_lista = null){
    console.log('=== function addToLista() ===');

    if(!hay_id_song('addToLista()')){
        return; // <- se detiene aquí si no hay id_song
    }

    if(new_lista == 'new'){
        id_lista = null;//reset id_lista para crear una nueva lista desde cero
        arr_lista = [];//reset arr_lista para crear una nueva lista desde cero
    }

    //compruebo si ya está id_song enla lista
    let hay_en_la_lista = arr_lista.some(s => s.id_song == objSong.id_song);

    

    let datos_lista_html;
    if(id_lista){
        datos_lista_html = `
            <div class="wr_datos_lista">
                <span class="sp_add_a_lista">
                    <span>Lista: <b class="n_lista">${objLista.id_lista}</b></span>
                    <span class="sp_guardar_sm" onclick="guardarLista(null, 'fast');">
                        <img src="./images/guardar.png">
                    </span>
                </span>
                <span class="fecha_lista">${diaSemana(objLista.fecha)} &nbsp; ${objLista.fecha_ver}</span>
                <span class="title_lista">${objLista.title}</span>
                <span class="grupo_lista">${objLista.grupo_nombre}</span>
            </div>
        `;
    }else{
        datos_lista_html = '';
    }


    let aviso_text;
    let text_song_datos = `
        <br>
        <br>id: <b>${objSong.id_song}</b> 
        <br>número: <b>${objSong.song_number}</b> 
        <br>título: <b>${objSong.title}</b>
    `;

    if(hay_en_la_lista){
        aviso_text = `La canción ya está añadida anteriormente. `;
        //alert('ya está añadida anteriormente');
        //return;
    }else{
        const objSongSmall = {
            id_song: objSong.id_song,
            song_number: objSong.song_number,
            title: objSong.title,
            title2: objSong.title2,
            title_note: objSong.title_note,
            tune: objSong.tune,
            tune_transpose: objSong.tune_transpose,
        };

        arr_lista.push(objSongSmall);

        aviso_text = `La canción se ha añadido con éxito a la lista ${ (id_lista) ? '<b>ACTUAL (temporal)</b>' : '<b>NUEVA (temporal)</b>' } de canciones.`;
    }

    //si no está guardada la lista, muestro el mensaje
    if(Object.keys(objLista).length === 0){
        aviso_text += `<span class="blink_text">Guarda la lista</span>`;
    }

    //para VER - SM
    const contenedor_lista_sm = document.createElement('div');
    contenedor_lista_sm.id = 'contenedor_lista_sm';
    contenedor_lista_sm.innerHTML = `
        ${datos_lista_html}
        <div class="parte_lista">
            <p class="p_aviso">${aviso_text}</p>
            <p class="p_aviso d-none">${text_song_datos}</p>
        </div>
        
        <!-- Canciones -->
        <div class="d_canciones_lista parte_lista"></div>

        <!-- botón Guardar nueva lista / Editar lista -->
    `;

    const btn_guardar = document.createElement('button');
    btn_guardar.id = 'btn_guardar';
    btn_guardar.className = 'btn btn_big';

    if(id_lista && new_lista == null){//se guarda en la lista ACTUAL
        btn_guardar.textContent = 'Guardar lista actual';
        btn_guardar.onclick = () => {
            //openModal('full','Guardar lista editada',null,'buildLista',true, 'editar');
            guardarLista(null, 'fast');
        }
    }else{//se guarda en una lista NUEVA
        btn_guardar.textContent = 'Guardar Nueva lista';
        btn_guardar.onclick = () => {
            openModal('full','Guardar Nueva Lista',null,'buildLista',true, 'nueva');
            closeDiv(document.querySelector(`#bl_actions_buscar`));
        }
    }

    //Añado el botón
    contenedor_lista_sm.append(btn_guardar);

    console.log('arr_lista: ', arr_lista);
    buildListaSoloSongs(contenedor_lista_sm.querySelector('.d_canciones_lista'), arr_lista);

    // openModal('center','Estado de la Lista',aviso_text,'showAviso');//antes    
    openModal('center', 'Estado de la Lista', contenedor_lista_sm, 'showAviso2');
}


function update_arr_lista(){
    console.log('=== function update_arr_lista() ===');
    localStorage.setItem('arr_lista', JSON.stringify(arr_lista));    
    // if(hay_sesion){
    //     guardarEnBd('fav_trans', 'arrFavTrans', arrFavTrans);
    // }
}








async function crearSlidesForSongOfLista(e, lista_id_song, cerrar_modales = true, show_ultimo_slide = false) {
    console.log('=== function crearSlidesForSongOfLista() ===');

    resetBlockBuscar();//quito song anterior si hay
    resetBlockEsquema();
    resetBlockCancion();

    resetPListaActive(lista_vista_lista_content);

    if(e instanceof Event) {
        console.log("Recibí un evento. e.type: ", e.type);
        e.currentTarget.classList.add('active');
    }
    else if(e instanceof HTMLElement) {
        console.log("Recibí un elemento HTML. e.tagName: ", e.tagName);
        const p_lista_element = e;
        p_lista_element.classList.add('active');
    }
    else{
        console.log("Parámetro desconocido. e: ", e);
        alert('Parámetro desconocido de e. Return...');
        return;
    }

    id_song = lista_id_song;
    console.log('lista_id_song: ', lista_id_song);

    currentIndexOfArrLista = arr_lista.findIndex(item => item.id_song == id_song);
    console.log('currentIndexOfArrLista: ', currentIndexOfArrLista);

    //cojo datos de la song de la lista desde BD
    objSong = await getDataSongFromBd();

    await crearSlides();//no pongo await para no esperar el resultado de ejecusion de crearSlide()

    if(show_ultimo_slide){
        const index_ultimo_item = arr_esquema_bucle.length - 1;
        showOneSlideFrom(null, index_ultimo_item);//marco ultimo slide por defecto...
    }else{//mostrar primer slide
        showOneSlideFrom(null, 0);//marco primer slide por defecto...
    }

    if(cerrar_modales){
        closeAll();
        closeModal(null,true);
    }
}


async function editSongOfLista(e, lista_id_song) {
    console.log('=== function editSongOfLista() ===');

    resetBlockBuscar();//quito song anterior si hay
    resetBlockEsquema();
    resetBlockCancion();

    if(e instanceof Event) {
        console.log("Recibí un evento. e.type: ", e.type);
        resetPListaActive(lista_vista_lista_content);
        e.target.closest('.p_lista').classList.add('active');
    }

    if(e instanceof HTMLElement) {
        console.log("Recibí un element. e.type: ", e.type);
        resetPListaActive(lista_vista_lista_content);
        e.classList.add('active');
    }

    id_song = lista_id_song;
    console.log('lista_id_song: ', lista_id_song);

    //cojo datos de la song de la lista desde BD
    objSong = await getDataSongFromBd();

    showEdit('cancion');
    editar_song();

    closeModal(null,true);
}





function eliminarSongDeLista(id_song){
    console.log('=== function eliminarSongDeLista() ===');
    console.log('id_song: ', id_song);

    if(!id_song){
        alert('No hay id_song. No se puede eliminar canción de la lista.');
        return;
    }

    //hay 2 modos
    //1. cuando se crea nueva lista y arr_lista tiene datos
    //2. cuando se ve/edita/elimina la lista existente y se modifica arr_lista y objLista.arr_lista
    
    if(id_lista == null){//se crea nueva lista
        console.log('se crea nueva lista');
        
        //Eliminar del arr_lista
        arr_lista = arr_lista.filter(item => item.id_song != id_song);
        console.log('arr_lista actualizado: ', arr_lista);

        let d_canciones_listaAll = document.querySelectorAll(`.d_canciones_lista`);
        console.log('d_canciones_listaAll: ', d_canciones_listaAll);

        //Actualizar el DOM
        d_canciones_listaAll.forEach(contenedor => {
            console.log('contenedor: ', contenedor);
            buildListaSoloSongs(contenedor, arr_lista);//arr_lista global
        });
        
    }else{//se edita lista existente
        console.log('se edita lista existente');

        //Eliminar del arr_lista
        arr_lista = arr_lista.filter(item => item.id_song != id_song);
        console.log('arr_lista actualizado: ', arr_lista);

        //Eliminar del objLista.arr_lista
        objLista.arr_lista = objLista.arr_lista.filter(item => item.id_song != id_song);
        console.log('objLista.arr_lista actualizado: ', objLista.arr_lista);

        let d_canciones_listaAll = document.querySelectorAll(`.d_canciones_lista`);
        console.log('d_canciones_listaAll: ', d_canciones_listaAll);

        //Actualizar el DOM
        d_canciones_listaAll.forEach(contenedor => {
            console.log('contenedor: ', contenedor);
            buildListaSoloSongs(contenedor, objLista.arr_lista);//objLista.arr_lista de BD
        });
    }

    //Actualizar en BD
    //guardarLista(null, true);//true -> solo actualizar lista en bd

    // wr_p_lista = document.querySelector('.d_canciones_lista .wr_p_lista');
    // console.log('wr_p_lista: ', wr_p_lista);

    // //Si la lista queda vacía
    // if(objLista.arr_lista.length == 0){
    //     const p_empty = document.createElement('p');
    //     p_empty.className = 'prim';
    //     p_empty.innerHTML = `
    //         2.No hay canciones 
    //     `;
    //     //wr_p_lista.append(p_empty);
    // }
}


function makeItemsDraggable(id_contenedor, class_element){
    console.log('=== function makeItemsDraggable() ===');

    if(made_draggable_once){
        console.log('made_draggable_once is true. no dejo continuar.');
        return;
    }else{
        console.log('made_draggable_once is false. sigo...');
    }

    const container = document.getElementById(id_contenedor);
    if (!container) {
        console.error(`No se encontró el contenedor con ID: ${id_contenedor}`);
        return;
    }

    let draggedElement = null;
    let placeholder = null;

    let startY = 0;          // posición inicial del puntero
    let initialTop = 0;      // posición inicial del elemento arrastrado
    let startX = 0;          // posición inicial del puntero
    let initialLeft = 0;     // posición inicial del elemento arrastrado

    // Create a placeholder element
    function createPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        return placeholder;
    }

    // Handle drag start
    function startDrag(e) {
        e.preventDefault();

        draggedElement = e.target.closest('.draggable');
        if (!draggedElement) return;

                    const rect_dragged = draggedElement.getBoundingClientRect();

                    // Guardar posición inicial del puntero y del elemento
                    startY = (e.type === 'mousedown') ? e.clientY : e.touches[0].clientY;
                    initialTop = rect_dragged.top - container.getBoundingClientRect().top;        
                    startX = (e.type === 'mousedown') ? e.clientX : e.touches[0].clientX;
                    initialLeft = rect_dragged.left - container.getBoundingClientRect().left;        

        placeholder = createPlaceholder();
        container.insertBefore(placeholder, draggedElement.nextSibling);
        draggedElement.classList.add('dragging');

        // console.log('container: ', container);
        // console.log('draggedElement: ', draggedElement);

        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchmove', moveDrag);
        document.addEventListener('touchend', endDrag);
    }

    // Handle drag move
    function moveDrag(e) {
        //console.log('=== function moveDrag(e) ===');
        
        let y;
        let x;
        let currentY;//test
        let currentX;//test

        // Determinar las coordenadas iniciales
        if (e.type === 'mousemove') {
            //startX = e.clientX;
            y = e.clientY;
            x = e.clientX;
        } else if (e.type === 'touchmove') {
            //startX = e.touches[0].clientX;
            y = e.touches[0].clientY;
            x = e.touches[0].clientX;
        }
        
                currentY = y;//test
                currentX = x;//test
                // Calcular cuánto se ha movido el puntero
                let deltaY = currentY - startY;
                let deltaX = currentX - startX;

                // Aplicar movimiento relativo al elemento
                //draggedElement.style.position = "absolute";
                //draggedElement.style.width = placeholder.offsetWidth + "px"; // para que no se colapse
                draggedElement.style.top = (initialTop + deltaY) + "px";
                draggedElement.style.left = (initialLeft + deltaX) + "px";

        const elements = [...container.children].filter(el => el !== draggedElement && el !== placeholder);
        //console.log('elements: ', elements);

        const currentElement = elements.find(el => {
            const rect = el.getBoundingClientRect();
            return y > rect.top && y < rect.bottom;
        });


        if (currentElement) {
            const rect = currentElement.getBoundingClientRect();
            console.log('currentElement: ', currentElement);
            console.log('rect: ', rect);

            const mitad = rect.top + rect.height / 2;

            if (y < rect.top + rect.height / 2) {
                console.log('if --- y es menor la MITAD de rect.height. mitad: ', mitad);
                container.insertBefore(placeholder, currentElement);
            } else {
                console.log('else --- y es MAYOR de la mitad de rect.height. mitad: ', mitad);
                container.insertBefore(placeholder, currentElement.nextSibling);
            }
        }
    }

    // Handle drag end
    function endDrag() {
        if (!draggedElement) return;

        container.insertBefore(draggedElement, placeholder);
        draggedElement.classList.remove('dragging');
        draggedElement.removeAttribute('style');//test
        placeholder.remove();

        placeholder = null;
        draggedElement = null;

        //al terminar de mover el elemento, actualizo arr_lista y repinto wr_p_lista
        if(class_element == 'p_drag'){//translations
            make_arrListaFromItems(`.${class_element}`);
            console.log('arr_lista actualizado: ', arr_lista);

            buildListaSoloSongs(eid_block_lista.querySelector('.vista_lista_content .d_canciones_lista'), arr_lista);           

            const contenedor_pintar_numeros = document.querySelector('.d_canciones_lista #d_canciones_body_drag');
            pintSoloNumerosDeOrden(contenedor_pintar_numeros);
        }

        document.removeEventListener('mousemove', moveDrag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchmove', moveDrag);
        document.removeEventListener('touchend', endDrag);

        // if(hay_sesion){
        //     guardarEnBd('fav_trans','arrFavTrans',arrFavTrans);
        // }
    }

    // Attach event listeners for drag and drop
    container.addEventListener('mousedown', startDrag); 
    container.addEventListener('touchstart', startDrag); 
    
    //aki pongo que se ha ejecutado ya 1 vez esta función, para que con click sobre sortModule2() no se ejecute 2 vez
    made_draggable_once = true;
}


function make_arrListaFromItems(cl_item){
    //console.log('=== function make_arrFavTransFromItems(e) ===');
    
    const los_items = document.querySelectorAll(cl_item);
    let arr_new = Array.from(los_items).map(item =>{
        const itemSong = arr_lista.find(s => s.id_song == item.dataset.id_song);
        console.log('itemSong: ', itemSong);
        return itemSong;
    });
    console.log('arr_new: ', arr_new);
    
    arr_lista = quitarObjetosDuplicadosDeArray(arr_new);
    if(objLista.arr_lista){
        objLista.arr_lista = arr_new;        
    }
    //update_arr_lista();     

    return arr_new;
}


function quitarObjetosDuplicadosDeArray(arr) {
    const mapa = new Map(
        arr.map(obj => [JSON.stringify(obj), obj])
    );
    return Array.from(mapa.values());
}


function pintSoloNumerosDeOrden(contenedor){
    console.log('=== function pintSoloNumerosDeOrden() ===');
    contenedor.querySelectorAll('.l_n').forEach((item,i) => {
        //console.log('item: ', item);
        //console.log('i: ', i);
        item.textContent = `${i + 1}.`;
    });

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function nextFrame() {
    return new Promise(requestAnimationFrame);
}






//============================================================//
//aki nuevas funciones
//============================================================//




function pintSongActiveSoloDatos(){
    console.log('=== function pintSongActiveSoloDatos() === ');

    if(!objSong){
        alert('no hay objSong');
        return;
    }

    const p_song = eid_bl_songs_finded.querySelector(`.p_song[data-id="${objSong.id_song}"]`);
    console.log('p_song: ', p_song);
    
    if(!p_song){
        //alert('no hay tr_song');
        console.log('no hay p_song. no actualizo p_song...');
        return;
    }

    let hay_esquema_texto;

    //convierto arr_esquema (string) en array correcto
    if(esArray(objSong.arr_esquema) && objSong.arr_esquema.length > 0){
        hay_esquema_texto = `Sí (${objSong.arr_esquema.length})`;
    }else{
        hay_esquema_texto = '';
    }
    console.log('(bd) --- objSong.arr_esquema: ', objSong.arr_esquema);

    let category_name_text = '';
    if(objSong.category != 0 && objSong.category_name != null){
        //inportante en una linea
        category_name_text = `<span class="sp_number">${objSong.category}.</span> <span class="sp_name">${objSong.category_name}</span>`;
    }

    let songbook_title_text = '';
    if(objSong.songbook != 0 && objSong.songbook_title != null){
        //inportante en una linea
        songbook_title_text = `<span class="sp_number">${objSong.songbook}.</span> <span class="sp_name">${objSong.songbook_title}</span>`;
    }

    let lang_name_text = '';
    if(objSong.lang){
        lang_name_text = obj_lang_names[objSong.lang];
    }

    const el_cl_title = p_song.querySelector('.cl_title');
    const el_cl_title2 = p_song.querySelector('.cl_title2');
    const el_cl_title_note = p_song.querySelector('.cl_title_note');

    //new - actualizo datos de p_song
    el_cl_title.textContent = objSong.title || '';//siempre debe estar

    el_cl_title2.textContent = objSong.title2 || '';
    el_cl_title2.classList.toggle('d-none', !objSong.title2);;//si title2 es true -> quito 'd-none', si es false ->  lo elimino
    
    el_cl_title_note.textContent = objSong.title_note || '';
    el_cl_title_note.classList.toggle('d-none', !objSong.title_note);;//si title_note es true -> quito 'd-none', si es false ->  lo elimino

    //p_song.querySelector('.td_idioma').textContent = lang_name_text;
    p_song.querySelector('.l_tune').textContent = objSong.tune || '';
    p_song.querySelector('.l_tune_transpose').textContent = objSong.tune_transpose || '';
   

   // Normalizamos palabras de 'arr_words' (global)
    //const arr_normalized = arr_words.map(normalize);//modo corto de escribir la func abajo
    const arr_normalized = arr_words.map( palabra => {
        return normalize(palabra);
    });
    console.log('arr_normalized: ', arr_normalized);
        
    const regex = new RegExp(`(${arr_normalized.join('|')})`, 'gi');//busco las palabras del input
    console.log('regex: ', regex);

    let cl_campo_title = 'd-none';
    let cl_campo_title2 = 'd-none';
    let cl_campo_title_note = 'd-none';
    
    let content_id_song = '';
    let content_title = '';
    let content_title2 = '';
    let content_title_note = '';
    
    if(objSong.id_song){
        //Marco en rojo las palabras encontradas en title 
        let id_song_text_red = objSong.id_song.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_id_song = id_song_text_red;
    }

    if(objSong.title){
        cl_campo_title = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo_text_red = objSong.title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_title = titulo_text_red;
    }

    if(objSong.title2){
        cl_campo_title2 = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo2_text_red = objSong.title2.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_title2 = titulo2_text_red;
    }

    if(objSong.title_note){
        cl_campo_title_note = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo_note_text_red = objSong.title_note.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_title_note = titulo_note_text_red;
    }

    const titulo_detalles = document.createElement('div');
    titulo_detalles.className = 's_detalles';
    titulo_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_titulo_detalles');">
            Canción <span class="f_r">${content_id_song}</span>
        </p>    
        <p id="s_titulo_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">
                <span class="linea_fx ${cl_campo_title}">
                    <span class="cl_campo">Título:</span>
                    <span>${content_title}</span>
                </span>
                <span class="linea_fx ${cl_campo_title2}">
                    <span class="cl_campo">Título2:</span>
                    <span>${content_title2}</span>
                </span>
                <span class="linea_fx ${cl_campo_title_note}">
                    <span class="cl_campo">T. nota:</span>
                    <span>${content_title_note}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    let cl_campo_song_number = 'd-none';
    let cl_campo_category_name = 'd-none';
    let cl_campo_songbook_title = 'd-none';
    
    let content_song_number = '';
    let content_category_name = '';
    let content_songbook_title = '';

    if(objSong.song_number){
        cl_campo_song_number = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let song_number_text_red = objSong.song_number.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_song_number = song_number_text_red;
    }

    if(objSong.category_name){
        cl_campo_category_name = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let category_name_text_red = objSong.category_name.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_category_name = objSong.category + '. ' + category_name_text_red;
    }

    if(objSong.songbook_title){
        cl_campo_songbook_title = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let songbook_title_text_red = objSong.songbook_title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_songbook_title = objSong.songbook + '. ' + songbook_title_text_red;
    }

    const otros_detalles = document.createElement('div');
    otros_detalles.className = 's_detalles';
    otros_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_otros_detalles');">Detalles</p>
        <p id="s_otros_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">            
                <!-- aki van los otros datos -->
                <span class="linea_fx ${cl_campo_song_number}">
                    <span class="cl_campo">Número:</span>
                    <span>${content_song_number}</span>
                </span>
                <span class="linea_fx ${cl_campo_category_name}">
                <span class="cl_campo">Categoría:</span>
                    <span>${content_category_name}</span>
                </span>
                <span class="linea_fx ${cl_campo_songbook_title}">
                    <span class="cl_campo">Songbook:</span>
                    <span>${content_songbook_title}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    let cl_campo_song_text = 'd-none';    
    let content_song_text = '';

    if(objSong.song_text){
        cl_campo_song_text = '';//muestro
        //Marco en rojo las palabras encontradas en song_text 
        let song_text_red = objSong.song_text.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_song_text = song_text_red;
    }

    const texto_detalles = document.createElement('div');
    texto_detalles.className = 's_detalles';
    texto_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_texto_detalles');">Texto</p>
        <div id="s_texto_detalles" style="display: block;">
            <div class="texto_pre">${content_song_text}</div>
        </div>
    `;


    const d_esquema_titulos = document.createElement('div');
    d_esquema_titulos.className = 'd_esquema_titulos';

    let cl_campo_url_recurso = 'd-none';
    let cl_campo_notes = 'd-none';
    
    let content_url_recurso = '';
    let content_notes = '';

    if(objSong.url_recurso){
        cl_campo_url_recurso = '';//muestro
        //Marco en rojo las palabras encontradas en notes 
        let url_recurso_text_red = objSong.url_recurso.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_url_recurso = url_recurso_text_red;
    }

    if(objSong.notes){
        cl_campo_notes = '';//muestro
        //Marco en rojo las palabras encontradas en notes 
        let notas_text_red = objSong.notes.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        content_notes = notas_text_red;
    }



    const notes_detalles = document.createElement('div');
    notes_detalles.className = 's_detalles';
    notes_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('s_notes_detalles');">Notas</p>
        <p id="s_notes_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">            
                <!-- aki van los notes datos -->
                <span class="linea_fx ${cl_campo_url_recurso}">
                    <span class="cl_campo">Recurso:</span>
                    <span>${content_url_recurso}</span>
                </span>                
                <span class="linea_fx ${cl_campo_notes}">
                    <span class="cl_campo">Apuntes:</span>
                    <span>${content_notes}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;


    //añado al DOM
    buscar_vista_song_content.append(titulo_detalles);
    buscar_vista_song_content.append(otros_detalles);
    buscar_vista_song_content.append(texto_detalles);
    buscar_vista_song_content.append(d_esquema_titulos);
    buscar_vista_song_content.append(notes_detalles);

    //Construyo titulos de esquema después de añadir d_esquema_titulos al DOM
    buildEsquemaSoloTitulos(buscar_vista_song_content.querySelector('.d_esquema_titulos'), objSong.arr_esquema);
}

function ocultarTodasVistas(){
    console.log('=== function resetShowVista() === ');

    document.querySelectorAll('.vista_r.shown').forEach( vista_r => {
        vista_r.classList.remove('shown');
        vista_r.querySelector('.vista_head')?.classList.remove('shown');
    });//reseteo parte derecha de vista
}

function mostrarVista(contenedor){
    console.log('=== function mostrarVista(contenedor) === ');

    if(!contenedor) return;

    if(window.innerWidth > pantallaTabletMaxPx){// pantallaTabletMaxPx = 1023px es portatil small
        //no muestro vista en desktop porque ya se muestra al lado derecho.
        return;
    }

    ocultarTodasVistas();

    //setTimeout(()=>{
        contenedor.querySelector('.vista_r')?.classList.add('shown');//muestro parte derecha de vista
    //},5);


    setTimeout(()=>{
        contenedor.querySelector('.vista_head')?.classList.add('shown');
    },10);//transition 0.5s = 500mc.
}


function mostrarVistaFixed(){
    console.log('=== function mostrarVistaFixed === ');

    //if(!contenedor) return;

    // if(window.innerWidth > pantallaTabletMaxPx){// pantallaTabletMaxPx = 1023px es portatil small
    //     //no muestro vista en desktop porque ya se muestra al lado derecho.
    //     return;
    // }

    //ocultarTodasVistas();
    //contenedor.querySelector('.vista_r')?.classList.add('shown');//muestro parte derecha de vista
    document.querySelector('.vista_fixed')?.classList.add('shown');//muestro parte derecha de vista

    // setTimeout(()=>{
    //     contenedor.querySelector('.vista_head')?.classList.add('shown');
    // },10);//transition 0.5s = 500mc.
}

function ocultarVistaFixed(){
    console.log('=== function ocultarVistaFixed() === ');
    document.querySelector('.vista_fixed')?.classList.remove('shown');

    const d_state_fullscreen = document.querySelector('#d_state_fullscreen');

    if(is_fullscreen && d_state_fullscreen){
        toggleFullscreen('.vista_fixed', d_state_fullscreen);
    }
}

function toggleVistaFixed() {
    const vista_fixed = document.querySelector('.vista_fixed');

    if (vista_fixed.classList.contains('shown')) {//es mostrado
        ocultarVistaFixed();//oculto
    } else {
        mostrarVistaFixed();//muestro
    }
}







function mostrarMenuOver(){
    console.log('=== function mostrarMenuOver === ');
    const d_menu_over = document.querySelector('.d_menu_over');
    const hamburger3 = document.getElementById('hamburger3');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    d_menu_over?.classList.add('shown');//muestro menu que cubre todo el body de vista_fixed
    hamburger3.classList.add('active'); // Cambiar hamburguesa a flecha o 'x'
    d_contenedor.classList.add('scrollbar_menu_over');//activo vista de scrollbar en contenedor para poder ver donde estoy

    //ocultarDragOver();
}

function ocultarMenuOver(){
    console.log('=== function ocultarMenuOver() === ');
    const d_menu_over = document.querySelector('.d_menu_over');
    const hamburger3 = document.getElementById('hamburger3');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    d_menu_over?.classList.remove('shown');
    hamburger3.classList.remove('active'); // Cambiar flecha o 'x' a hamburguesa
    d_contenedor.classList.remove('scrollbar_menu_over');//desactivo vista de scrollbar en contenedor. que sea por defecto
}

function toggleMenuOver() {
    const d_menu_over = document.querySelector('.d_menu_over');

    if (d_menu_over.classList.contains('shown')) {//es mostrado
        ocultarMenuOver();//oculto
    } else {
        mostrarMenuOver();//muestro
    }
}




function mostrarDragOver(){
    console.log('=== function mostrarDragOver === ');
    const d_drag_over = document.querySelector('.d_drag_over');
    const d_state_drag_song = document.querySelector('#d_state_drag_song');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    dragSong = true;
    d_drag_over?.classList.add('shown');//muestro div drag_overu que cubre todo el body de vista_fixed
    d_state_drag_song.classList.add('active');
    d_contenedor.classList.add('scrollbar_drag_over');//activo vista de scrollbar en contenedor para poder ver donde estoy
    
    showToast('info', `Deslizamiento activado`, 2000, 'center', false,'', document.querySelector('.vista_fixed_body'));

    //ocultarMenuOver();//revisar ! hace falta?..
    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}

function ocultarDragOver(){
    console.log('=== function ocultarDragOver() === ');
    const d_drag_over = document.querySelector('.d_drag_over');
    const d_state_drag_song = document.querySelector('#d_state_drag_song');
    const d_contenedor = document.querySelector('.vista_fixed .d_contenedor');

    dragSong = false;
    d_drag_over?.classList.remove('shown');
    d_state_drag_song.classList.remove('active');
    d_contenedor.classList.remove('scrollbar_drag_over');//desactivo vista de scrollbar en contenedor. que sea por defecto
    
    showToast('info', `Deslizamiento desactivado`, 2000, 'center', false,'', document.querySelector('.vista_fixed_body'));

    resetPartialFieldsets();
    resetBottomPadding();
}

function toggleDragSong() {
    console.log('=== function toggleDragSong() ===');    

    if (dragSong) {
        ocultarDragOver();//sig action
    } else {
        mostrarDragOver();//sig action
    }
}







function mostrarTapSlide(){
    console.log('=== function mostrarTapSlide === ');
    const d_tap_over = document.querySelector('.d_tap_over');
    const d_state_tap_slide = document.querySelector('#d_esq_state_tap_slide');

    tapSlide = true;
    d_tap_over?.classList.add('shown');//muestro div d_tap_over que cubre todo el body de contenedor_prev
    d_state_tap_slide.classList.add('active');
}

function ocultarTapSlide(){
    console.log('=== function ocultarTapOver() === ');
    const d_tap_over = document.querySelector('.d_tap_over');
    const d_state_tap_slide = document.querySelector('#d_esq_state_tap_slide');

    tapSlide = false;
    d_tap_over?.classList.remove('shown');
    d_state_tap_slide.classList.remove('active');
}

function toggleTapSlide() {
    console.log('=== function toggleTapSlide() ===');    

    if (tapSlide) {
        ocultarTapSlide();//sig action
    } else {
        mostrarTapSlide();//sig action
    }
}




async function refreshSong(){
    console.log('=== function refreshSong() === ');

    //actualizo objSong desde bd por si se han hecho cambios
    objSong = await getDataSongFromBd();
    console.log('despues --- objSong: ', objSong);

    editar_song();

    pintSongActiveSoloDatos();

    eid_block_cancion.querySelector('.btn_song_refresh img').classList.toggle('rotate');//animación refresh
}

async function refreshLista(){
    console.log('=== function refreshLista() === ');

    if(!id_lista){
        return;
    }

    //actualizo objLista desde bd por si se han hecho cambios
    objLista = await getDataListaFromBd();
    console.log('despues --- objLista: ', objLista);

    const itemListaUpdate = objDataListas.arr_data?.find(item => item.id_lista == id_lista);
    if (itemListaUpdate) {
        Object.assign(itemListaUpdate, objLista);
        // el objeto dentro de arr_data ya está actualizado
    } else {
        console.warn('No encontrado objlista.id_lista en objDatalistas.arr_data');
    }

    //Actualizo p_lista 
    pintListaActiveSoloDatos();

    eid_block_lista.querySelector('.btn_refresh img').classList.toggle('rotate');//animación refresh
}

function pintListaActive(){
    console.log('=== function pintListaActive(e) === ');
        
    console.log('asignado global --- id_lista: ', id_lista);

    //resetTrSelected(tbody_lista);
    //tbody_lista.querySelector(`.tr_lista[data-id="${id_lista}"]`).classList.add('selected');

    resetPListaActive(eid_bl_listas_finded);//new
    eid_bl_listas_finded.querySelector(`.p_lista[data-id="${id_lista}"]`)?.classList.add('active');//new

    //creo btn actualizar lista
    const element_btn_lista_refresh = eid_block_lista.querySelector('#btn_lista_refresh');
    if(!element_btn_lista_refresh){
        const ejemplo_btn_lista_refresh = `
            <button id="btn_lista_refresh" class="btn btn_refresh" onclick="refreshLista()">
                <img src="images/refresh.png" class="">
                <span>Actualizar</span>
            </button>        
        `;
        const btn_lista_refresh = document.createElement('button');
        btn_lista_refresh.id = 'btn_lista_refresh';
        btn_lista_refresh.className = 'btn btn_refresh';
        btn_lista_refresh.innerHTML = `
            <img src="images/refresh.png" class="">
            <span>Actualizar</span>
        `;
        btn_lista_refresh.onclick = () => refreshLista();

        const separador = document.createElement('div');
        separador.className = 'separador for_btn_lista_refresh';

        //añado al DOM
        eid_block_lista_head.querySelector('.wr_block_option_inner').prepend(separador);
        eid_block_lista_head.querySelector('.wr_block_option_inner').prepend(btn_lista_refresh);

    }     

    mostrarVista(eid_block_lista_body);

    mostrarPrim = false;
    ocultarElementosPrimEn(lista_option_inner);
    mostrarElementosEditablesEn(lista_option_inner);
    mySizeLista();//importante después de quitar opt_prim y mostrar opt_edit 


    //Dejo '==' en vez de '===' porque id_lista viene como string: "925"
    objLista = objDataListas.arr_data.find(s => s.id_lista == id_lista);
    console.log('objLista: ', objLista);  
    
    pintListaActiveSoloDatos();//new
}

function pintListaActiveSoloDatos(){
    console.log('=== function pintListaActiveSoloDatos() === ');
    
    if(!objLista){
        alert('no hay objLista');
        return;
    }

    //comprobar si existe tr_lista de la lista activa
    // const tr_lista = tbody_lista.querySelector(`.tr_lista[data-id="${objLista.id_lista}"]`);
    const p_lista = eid_bl_listas_finded.querySelector(`.p_lista[data-id="${objLista.id_lista}"]`);
    console.log('p_lista: ', p_lista);

    const btn_add_lista = document.querySelector(`.li_action.btn_add_lista`);
    console.log('btn_add_lista: ', btn_add_lista);
    
    // if(tr_lista){
    //     //alert('no hay tr_lista');
    //     //return;
        
    //     //Actualizo datos de tr_lista
    //     tr_lista.querySelector('.td_titulo').textContent = objLista.title || '';
    //     tr_lista.querySelector('.td_dia_semana').textContent = diaSemana(objLista.fecha) || '';
    //     tr_lista.querySelector('.td_fecha').textContent = objLista.fecha_ver || '';
    //     tr_lista.querySelector('.td_lista').textContent = (objLista.arr_lista.length > 0) ? `Sí (${objLista.arr_lista.length})` :  '';
    // }

    if(p_lista){
        //Actualizo datos de p_lista
        p_lista.querySelector('.cl_title').textContent = objLista.title || '';
        p_lista.querySelector('.cl_grupo_nombre ').textContent = `${objLista.grupo_nombre}` || '';
        p_lista.querySelector('.cl_dia_semana').textContent = diaSemana(objLista.fecha) || '';
        p_lista.querySelector('.cl_fecha').textContent = objLista.fecha_ver || '';
        p_lista.querySelector('.cl_notes').textContent = objLista.notes || '';

        //si hay canciones, muestro el numero quitando d_none
        if(objLista.arr_lista.length > 0){
            p_lista.querySelector('.l_num_canciones').textContent = objLista.arr_lista.length;
            p_lista.querySelector('.l_num_canciones').classList.remove('d-none');
        }else{
            p_lista.querySelector('.l_num_canciones').textContent = '';
            p_lista.querySelector('.l_num_canciones').classList.add('d-none');//oculto el numero de canciones
        }

        if(objLista.notes != ''){//muestro
            p_lista.querySelector('.cl_notes').classList.remove('d-none');//quito clase para mostrar nota si la hay
        }else{//oculto
            p_lista.querySelector('.cl_notes').classList.add('d-none');//añado clase para ocultar nota
        }
    }
    
    if(btn_add_lista){        
        //Actualizo datos de tr_lista
        const fecha_lista = btn_add_lista.querySelector('.fecha_lista');
        const title_lista = btn_add_lista.querySelector('.title_lista');
        const grupo_lista = btn_add_lista.querySelector('.grupo_lista');

        if(fecha_lista && title_lista && grupo_lista){
            fecha_lista.innerHTML = `${diaSemana(objLista.fecha)} &nbsp; ${objLista.fecha_ver}`;
            title_lista.textContent = objLista.title || '';
            grupo_lista.textContent = `${objLista.grupo_nombre}` || '';
        }
    }

    // //Actualizo parte derecha
    lista_vista_lista_content.innerHTML = '';//reset

    lista_ul_action.innerHTML = `
        <li class="li_action" onclick="refreshLista();">Actualizar Lista actual</li>
        <li class="li_action" onclick="openModal('full','Lista actual',null,'buildLista',true, 'ver_sm');">Lista actual</li>
        <li class="li_action" onclick="openModal('full','Ver lista',null,'buildLista',true, 'ver');">Ver</li>
        <li class="li_action" onclick="openModal('full','Editar lista',null,'buildLista',true, 'editar');">Editar</li>
        <li class="li_action" onclick="openModal('full','Eliminar lista',null,'buildLista',true, 'eliminar');">Eliminar</li>
    `;
    lista_ul_action.onclick = e => close_ul_action(e);


    // Normalizamos palabras
    //const arr_normalized = arr_words_lista.map(normalize);//modo corto de escribir la func abajo
    const arr_normalized = arr_words_lista.map( palabra => {
        return normalize(palabra);
    });
    console.log('arr_normalized: ', arr_normalized);

    // Creamos regex sin acentos
    const regex = new RegExp(`(${arr_normalized.join('|')})`, 'gi');
    console.log('regex: ', regex);


    let cl_campo_title = 'd-none';
    
    let content_id_lista = '';
    let content_title = '';
    let content_fecha = '';
    let content_grupo = '';

    //id lista
    if(objLista.id_lista){
        //Marco en rojo las palabras encontradas en id 
        let id_lista_text_red = objLista.id_lista.toString().replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_id_lista = document.createElement('div');
        d_id_lista.className = 'parte_lista';
        d_id_lista.innerHTML = `
            <p class="p_titulo">Id:</p>
            <p class="texto_norm t_big">${id_lista_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_id_lista);
        content_id_lista = id_lista_text_red;
    }

    //Titulo lista
    if(objLista.title){
        cl_campo_title = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let titulo_text_red = objLista.title.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_titulo = document.createElement('div');
        d_titulo.className = 'parte_lista';
        d_titulo.innerHTML = `
            <p class="p_titulo">Título Lista:</p>
            <p class="texto_norm t_big">${titulo_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_titulo);
        content_title = titulo_text_red;
    }    

    //Fecha
    if(objLista.fecha && objLista.fecha != '0000-00-00'){
        cl_campo_fecha = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        //En BD busco '2025-08-03' 
        //pero como el formato para mostrar es '03/08/2025'
        //convierto '2025-08-03' a '03/08/2025' para luego pintar en rojo la coincidencia
        let validar_partes_fecha = false;//para pintar permito no validar la fecha. puede ser '2025-08', '2025-' 
        const regex_fecha = new RegExp(`(${convertirFecha(arr_normalized.join('|'), 'ver', '/', validar_partes_fecha)})`, 'gi');
        console.log('regex_fecha: ', regex_fecha);

        // let fecha_text_red = convertirFecha(objLista.fecha_ver, 'ver','/');// de '2025-08-03' => '03/08/2025'
        let fecha_text_red = objLista.fecha_ver;// en bd es '2025-08-03'
        fecha_text_red = fecha_text_red.replace(regex_fecha, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        console.log('fecha_text_red: ', fecha_text_red);

        const d_fecha = document.createElement('div');
        d_fecha.className = 'parte_lista';
        d_fecha.innerHTML = `
            <p class="p_titulo">Fecha:</p>
            <p class="texto_norm t_big">${fecha_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_fecha);
        const fecha_html = `
            <span class="wr_dia_y_fecha">
                <span class="cl_dia_semana cl_title_note">${diaSemana(objLista.fecha)}</span>
                <span class="cl_fecha cl_title_note">${fecha_text_red}</span>
            </span>`;
        // content_fecha = diaSemana(objLista.fecha) + ' ' + fecha_text_red;
        content_fecha = fecha_html;
    }

    //Grupo lista
    if(objLista.id_grupo){
        cl_campo_grupo = '';//muestro
        //Marco en rojo las palabras encontradas en title 
        let grupo_nombre_text_red = objLista.grupo_nombre.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_titulo = document.createElement('div');
        d_titulo.className = 'parte_lista';
        d_titulo.innerHTML = `
            <p class="p_titulo">Grupo que realiza el evento:</p>
            <p class="texto_norm t_big">${grupo_nombre_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_titulo);
        content_grupo = grupo_nombre_text_red;
    }
    
    //head de lista (titulo y detalles)
    const titulo_detalles = document.createElement('div');
    titulo_detalles.className = 's_detalles';
    titulo_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('l_titulo_detalles');">
            Lista <span class="f_r">${content_id_lista}</span>
        </p>    
        <p id="l_titulo_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">
                <span class="linea_fx ${cl_campo_title}">
                    <span class="cl_campo">Título:</span>
                    <span>${content_title}</span>
                </span>
                <span class="linea_fx ${cl_campo_fecha}">
                    <span class="cl_campo">Fecha:</span>
                    <span>${content_fecha}</span>
                </span>
                <span class="linea_fx ${cl_campo_grupo}">
                    <span class="cl_campo">Grupo:</span>
                    <span>${content_grupo}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    //Canciones
    const d_canciones_lista = document.createElement('div');
    d_canciones_lista.className = 'd_canciones_lista parte_lista';
    //lista_vista_lista_content.append(d_canciones_lista);    
    
    arr_lista = objLista.arr_lista;//importante. reasigno desde bd
    console.log('arr_lista: ', arr_lista);

    let arr_lista_bd = objLista.arr_lista;
    console.log('despues --- objLista.arr_lista === arr_lista_bd: ', arr_lista_bd);

    buildListaSoloSongs(d_canciones_lista, arr_lista_bd);




    let cl_campo_notes = 'd-none';
    let content_notes = '';

    if(objLista.notes){
        cl_campo_notes = '';//muestro
        //Marco en rojo las palabras encontradas en notes 
        let notas_text_red = objLista.notes.replace(regex, (x) => {
            return `<b class="c_red">${x}</b>`;
        });
        const d_notas = document.createElement('div');
        d_notas.className = 'parte_lista';
        d_notas.innerHTML = `
            <p class="p_titulo">Notas:</p>
            <p class="texto_norm">${notas_text_red}</p>
        `;
        //lista_vista_lista_content.append(d_notas);
        content_notes = notas_text_red;
    }

    const notes_detalles = document.createElement('div');
    notes_detalles.className = `s_detalles ${cl_campo_notes}`;
    notes_detalles.innerHTML = `
        <p class="p_titulo" onclick="hideShowBlock('l_notes_detalles');">Notas</p>
        <p id="l_notes_detalles" class="texto_norm t_big" style="display: block;">
            <span class="detalles_inner">            
                <span class="linea_fx ${cl_campo_notes}">
                    <span class="cl_campo">Apuntes:</span>
                    <span>${content_notes}</span>
                </span>
            </span><!--/.detalles_inner-->
        </p>
    `;

    //añado al DOM
    lista_vista_lista_content.append(titulo_detalles);
    lista_vista_lista_content.append(d_canciones_lista);
    lista_vista_lista_content.append(notes_detalles);
}



function showOneSlideFrom(elementClicked = null, index_esquema){
    console.log('=== function showOneSlideFrom() ===');
    console.log('elementClicked: ', elementClicked);

    e = elementClicked;
    currentSlide = Number(index_esquema);
    let add_next_slide = false;//por defecto no, si hay se pone a true

    if(e instanceof Event) {
        console.log("Recibí un evento. e.type: ", e.type);
    }
    else if(e instanceof HTMLElement) {
        console.log("Recibí un elemento HTML. e.tagName: ", e.tagName);
    }
    else{
        console.log("Parámetro desconocido. e: ", e);
        //alert('Parámetro desconocido de e. Return...');
        //return;
    }    

    // if(elementClicked.dataset.titulo === '_titulo_cancion_'){
    //     //return;
    // }

    //const index_esquema = elementClicked.dataset.idx;
    console.log('index_esquema: ', index_esquema);

    const elementBtnSimple = select_slide_wr_vista_btns.querySelector(`.btn_simple[data-idx="${index_esquema}"]`);
    console.log('elementBtnSimple: ', elementBtnSimple);

    const elementFieldset = select_slide_song_bloques.querySelector(`fieldset[data-idx="${index_esquema}"]`);
    console.log('elementFieldset: ', elementFieldset);

    eid_contenedor_prev_inner.innerHTML = '';//reset

    // resetBtnActive(select_slide_wr_vista_btns);//reseteo btn_active de botones en el contenedor
    // elementBtnSimple?.classList.add('btn_active');
    makeBtnActive(select_slide_wr_vista_btns, elementBtnSimple);

    // resetFldActive(select_slide_song_bloques);//reseteo fieldset active de kuplet's a la izda
    // elementFieldset?.classList.add('fld_active');
    makeFldActive(select_slide_song_bloques, elementFieldset);

    if(elementClicked){
        if(elementClicked === elementBtnSimple){
            console.log('es button -> btn_clicked ');
            elementFieldset.scrollIntoView({behavior: 'smooth', block: "center"});//btn clicked -> muevo fildset
            
            if(window.innerWidth < pantallaTabletMinPx){//mobile
                //alert('102. es mobil. muevo btn_simple...');
                elementBtnSimple.scrollIntoView({behavior: 'smooth', block: "center"});//fieldset clicked -> muevo btn
            }
        }else{
            console.log('es fieldset clicked');
            elementBtnSimple.scrollIntoView({behavior: 'smooth', block: "center"});//fieldset clicked -> muevo btn
        }
    }else{//no fue clikeado elementClicked. me muevo a los 2
        elementFieldset?.scrollIntoView({behavior: 'smooth', block: "center"});
        elementBtnSimple?.scrollIntoView({behavior: 'smooth', block: "center"});
    }



    //clono fieldset nuevo para vista en contenedor_prev ya que le cambiaré font-size
    const current_fieldset_cloned = arr_fieldsets[currentSlide].cloneNode(true); // true para clonar hijos
    console.log('current_fieldset_cloned: ', current_fieldset_cloned);

    const next_fieldset_cloned = arr_fieldsets[currentSlide + 1]?.cloneNode(true) || null ;
    console.log('next_fieldset_cloned: ', next_fieldset_cloned);



    eid_titulo_shown.textContent = current_fieldset_cloned.querySelector('legend').textContent;

    //Primer slide
    if( (elementClicked && elementClicked.dataset.titulo === '_titulo_cancion_') || index_esquema == 0){
        current_fieldset_cloned.querySelector('.song_titulo').textContent = '...';//muestro ... en vez del título del slide 1
        eid_titulo_shown.textContent = 'Título canción';
    }

    //Ultimo slide
    if(index_esquema == arr_esquema_bucle.length - 1){
        const p = document.createElement('p');
        p.className = 'tres_estrellas';
        p.textContent = '* * *';
        current_fieldset_cloned.append(p);//muestro ... en vez del título del slide 1
    }



    //Si hay sig kuplet, saco 2 primeras lineas...
    if(next_fieldset_cloned){

        //Todos los hijos directos 'legend' y 'p' de acordes y de texto
        let next_hijos_All = next_fieldset_cloned.querySelectorAll(':scope > *');
        console.log('next_hijos_All: ', next_hijos_All);

        next_fieldset_cloned.classList.add('preview_next');

        //1. elimino los p's dejando solo los 2 primeros
        next_fieldset_cloned.querySelectorAll('p').forEach((el,i) => { 
            if(i >= 2){
                el.remove();
            }
        });

        //2. si hay 2 filas de solo texto, elimino la 2 fila
        let los_p_t = next_fieldset_cloned.querySelectorAll('p.t');
        if(los_p_t.length == 2){
            los_p_t[1].remove();
        }

        add_next_slide = true;
    }




                // eid_contenedor_prev_inner.append(current_fieldset_cloned);
                
                // //Añado next slide si existe 
                // if(add_next_slide){
                //     //2. Añado next Slide (solo 2 lineas) al div si hay... 
                //     eid_contenedor_prev_inner.append(next_fieldset_cloned);
                // }



                // const contenedorSlideView = eid_pantalla_body;

                // ajustarTextoContenedor(contenedorSlideView);

    

    let li_actual;

    //si ya existe el li_actual...
    if(select_slide_ul_action.querySelector('#li_crearSlidesActual') ){
        li_actual = select_slide_ul_action.querySelector('#li_crearSlidesActual');
    }else{
        // creo boton actual
        li_actual = document.createElement('li');
        li_actual.id = 'li_crearSlidesActual';
        li_actual.className = 'li_action';
    }

    if(slideContainer.dataset.id_song == id_song){
        // ya están creados los slides en el contenedor. me muevo al slide actual
        li_actual.textContent = 'Ir al slide (Actual)';
        li_actual.onclick = () => {
            closeAll();//cierro todas las ventanas modales
            scrollToSlide(currentSlide);
        }
    }else{
        // no están creados los slides en el contenedor. los creo
        li_actual.textContent = 'Crear slides (Ver Actual)';
        li_actual.onclick = () => {
            crearSlides(currentSlide);
            closeAll();//cierro todas las ventanas modales
        }
    } 

    select_slide_ul_action.prepend(li_actual);
    make_arr_pantalla(currentSlide);
}






async function make_arr_pantalla(currentSlide){
    console.log('=== function make_arr_pantalla() ===');
    console.log('currentSlide: ',currentSlide);
    console.log('arr_fieldsets: ', arr_fieldsets);
    console.log('arr_esquema_bucle: ',arr_esquema_bucle);
    
    slide_actual = currentSlide;
    console.log('slide_actual: ',slide_actual);

    if(arr_fieldsets.length == 0 || arr_esquema_bucle.length == 0){
        return;
    }
    
    const current_fieldset = arr_fieldsets[currentSlide];
    console.log('current_fieldset: ',current_fieldset);

    const next_fieldset = arr_fieldsets[currentSlide + 1] || null ;
    console.log('next_fieldset: ',next_fieldset);

    //Current
    const current_fieldset_cloned = current_fieldset.cloneNode(true);
    console.log('current_fieldset_cloned: ',current_fieldset_cloned);
    
    //Next
    const next_fieldset_cloned = (next_fieldset) ? next_fieldset.cloneNode(true) : null ;
    console.log('next_fieldset_cloned: ',next_fieldset_cloned);


    objPantalla = {};//reset 
    arr_pantalla = [];//reset   

    let slide_divs = '';

    let count_p_t = 0;//contador de los 'p' de texto
    let count_p_c = 0;//contador de los 'p' de acordes
    let add_next_slide = false;//por defecto no, si hay se pone a true


    //Todos los hijos directos 'legend' y 'p' de acordes y de texto
    let hijos_All = current_fieldset_cloned.querySelectorAll(':scope > *');
    console.log('hijos_All: ', hijos_All);

    //Current element para slide
    const wr_d_line = document.createElement('div');
    wr_d_line.className = 'wr_d_line';
    
    //Next element para slide
    const next_wr_d_line = document.createElement('div');
    next_wr_d_line.className = 'next_wr_d_line';


    hijos_All.forEach((hijo, i, arr) => {
        console.log('hijo: ', hijo); 
        
        const d_line = document.createElement('div');

        if(hijo.tagName === 'LEGEND'){
            if(currentSlide == 0 && hijo.innerHTML == '_titulo_cancion_'){
                d_line.className = `d_line d_legend d-none`;
            }else{
                d_line.className = `d_line d_legend`;
            }
            d_line.innerHTML = `<div>${hijo.innerHTML}</div>`;
        }else{//es 'p'

            if(hijo.className == 'c'){
                count_p_c++;//acorde
            }
            if(hijo.className == 't'){
                count_p_t++;//texto

                //NO HACE FALTA AKI! PERO DEJO COMO EJEMPLO COMO SUSTITUIR
                // hijo.innerHTML = hijo.innerHTML.replace(
                //     /[{}]/g,  //los '{' y los '}'
                //     match => `<span class="llave" en_mmm>${match}</span>` 
                // );
            }
            d_line.className = `d_line ${hijo.className}`;
            d_line.innerHTML = hijo.innerHTML;
        }
        
        wr_d_line.append(d_line);
    });



    //Si hay sig kuplet, saco 2 primeras lineas...
    if(next_fieldset_cloned){

        //Todos los hijos directos 'legend' y 'p' de acordes y de texto
        let next_hijos_All = next_fieldset_cloned.querySelectorAll(':scope > *');
        console.log('next_hijos_All: ', next_hijos_All);

        next_fieldset_cloned.classList.add('preview_next');

        //1. elimino los p's dejando solo los 2 primeros
        next_fieldset_cloned.querySelectorAll('p').forEach((el,i) => { 
            if(i >= 2){
                el.remove();
            }
        });

        //2. si hay 2 filas de solo texto, elimino la 2 fila
        let los_p_t = next_fieldset_cloned.querySelectorAll('p.t');
        if(los_p_t.length == 2){
            los_p_t[1].remove();
        }

        const next_hijos_All_solo2 = next_fieldset_cloned.querySelectorAll(':scope > *');

        next_hijos_All_solo2.forEach((hijo, i, arr) => {
            console.log('hijo: ', hijo); 
            
            const d_line = document.createElement('div');

            if(hijo.tagName === 'LEGEND'){
                d_line.className = `d_line d_legend`;            
                d_line.innerHTML = `<div>${hijo.innerHTML}</div>`;
            }else{
                d_line.className = `d_line ${hijo.className}`;
                d_line.innerHTML = hijo.innerHTML;
            }
            
            next_wr_d_line.append(d_line);
        });

        add_next_slide = true;
    }


    //let p_textAll = current_fieldset_cloned.querySelectorAll('p.t');//solo texto
    //console.log('p_textAll: ', p_textAll);
   
    
    //si es ultimo slide
    if(currentSlide == arr_esquema_bucle.length - 1){
        //slide_html += `<span class="tres_estrellas">* * *</span>`;
        const span_tres_estrellas = document.createElement('span');
        span_tres_estrellas.className = 'tres_estrellas';
        span_tres_estrellas.innerHTML = '* * *';        
        wr_d_line.append(span_tres_estrellas);
    }


    if(count_p_t == 0){//si no se encuentran los 'p', no hago nada
        //alert('no hay texto en la diapositiva seleccionada. pero sigo...');
        let hay_song_titulo = current_fieldset_cloned.querySelector('.song_titulo');
        if(hay_song_titulo){
            const ejemplo = `
                <div class="wr_d_puntos">
                    <p>...</p>
                </div>
            `;
            const div_wr_d_puntos = document.createElement('div');
            div_wr_d_puntos.className = 'wr_d_puntos';
            div_wr_d_puntos.innerHTML = '<p>...</p>';
            wr_d_line.append(div_wr_d_puntos);
        }

        if(count_p_c > 0){
            const ejemplo = `
                <div class="wr_d_music">
                    <img src="images/notas_de_musica_grey.svg">
                </div>
            `;
            const div_wr_d_music = document.createElement('div');
            div_wr_d_music.className = 'wr_d_music';
            div_wr_d_music.innerHTML = '<img src="images/notas_de_musica_grey.svg">';
            wr_d_line.append(div_wr_d_music);
        }
    }

    //1. Añado current Slide al div 
    slide_divs = wr_d_line.outerHTML;

    //Añado next slide si existe 
    if(add_next_slide){
        //2. Añado next Slide (solo 2 lineas) al div si hay... 
        slide_divs += next_wr_d_line.outerHTML;
    }

    let slide_num_text = currentIndexOfArrLista + 1;
    let slide_pos_text = `${currentSlide + 1} / ${arr_fieldsets.length}`;

    const ejemplo_contenedor_prev_head = `
        <div class="contenedor_prev_head">

            <div id="d_esq_state_tap_slide" class="btn_actions" onclick="toggleTapSlide()">
                <img src="images/tap_up_24.png">
            </div>

            <div class="vp_titulo">
                <div id="id_slide_num">8050</div>
                <div id="id_slide_pos">6 / 6</div>
            </div>

            <div id="d_esq_state_fullscreen" class="btn_actions" onclick="toggleFullscreen('#contenedor_prev_inner', this)">
                <img src="images/icon_size_max.svg">
            </div>

        </div>
    `;    
    
    const element_contenedor_prev_head = document.querySelector('.contenedor_prev_head');
    if(!element_contenedor_prev_head){
        const contenedor_prev_head = document.createElement('div');
        contenedor_prev_head.className = 'contenedor_prev_head';
        contenedor_prev_head.innerHTML = `
            <div id="d_esq_state_tap_slide" class="btn_actions">
                <img src="images/tap_up_24.png">
            </div>
            <div id="d_esq_state_fullscreen" class="btn_actions">
                <img src="images/icon_size_max.svg">
            </div>
        `;
        contenedor_prev_head.onclick = (e) => {
            console.log('contenedor_prev_head clicked');

            if(e.target.closest('#d_esq_state_tap_slide')){
                toggleTapSlide();
            }
            else if(e.target.closest('#d_esq_state_fullscreen')){
                toggleFullscreen('#contenedor_prev', e.target);
            }else{
                console.log('clicked ninguno de los botones');
            }
        }

        //añado al DOM 
        eid_contenedor_prev.append(contenedor_prev_head);
    }

    const ejemplo_contenedor_prev_foot = `
        <div class="contenedor_prev_foot">
            <div id="id_slide_num">8050</div>
            <div id="id_slide_pos">6 / 6</div>
        </div>
    `;

    const element_contenedor_prev_foot = document.querySelector('.contenedor_prev_foot');
    if(!element_contenedor_prev_foot){
        const contenedor_prev_foot = document.createElement('div');
        contenedor_prev_foot.className = 'contenedor_prev_foot';
        contenedor_prev_foot.innerHTML = `
            <div id="id_slide_num">${slide_num_text}</div>
            <div id="id_slide_pos">${slide_pos_text}</div>
        `;
        //añado al DOM 
        eid_contenedor_prev.append(contenedor_prev_foot);
    }else{//ya existe, solo actualizo datos de slide        
        element_contenedor_prev_foot.querySelector('#id_slide_num').textContent = slide_num_text;
        element_contenedor_prev_foot.querySelector('#id_slide_pos').textContent = slide_pos_text;
    }


    //debe estar aparte
    const ejemplo_d_tap_over = `
        <div class="d_tap_over"></div>
    `;
    const element_d_tap_over = document.querySelector('.d_tap_over');
    
    if(!element_d_tap_over){
        const d_tap_over = document.createElement('div');
        d_tap_over.className = 'd_tap_over';
        d_tap_over.onclick = () => {
            console.log('d_tap_over clicked');
        }
        //añado al DOM 
        eid_contenedor_prev.append(d_tap_over);
        
        //añado escuchador de click
        listenClickLeftRight(d_tap_over, slideGo);
    }
    



    //===================================================//
    //start - experiment
    //===================================================//
    const miIframeDOM = document.getElementById('miIframe');
    if(miIframeDOM){
        miIframeDOM.remove();
    }

    // 1. Crear el elemento
    miIframe = document.createElement('iframe');
    miIframe.id = "miIframe";

    // 2. Configurar atributos básicos
    miIframe.src = "pantalla.php";
    miIframe.title = "Contenido externo";

    // 3. Aplicar estilos para que ocupe todo el div padre
    //miIframe.style.width = eid_contenedor_prev.offsetWidth + 'px';
    //miIframe.style.height = eid_contenedor_prev.offsetHeight + 'px';
    
    miIframe.style.border = "none";
    miIframe.style.display = "block";

    // 4. Añadir seguridad (opcional pero recomendado)
    miIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    // 5. Insertarlo en un div existente (suponiendo que su id es 'contenedor')
    eid_contenedor_prev_inner.append(miIframe);
    mySizeIframe(eid_contenedor_prev);

    //para el video pelicula
    eid_videoPeliculaHoly = miIframe.contentWindow.document.getElementById('videoPelicula');
    miIframe.onload = () => {
        const videoHoly = miIframe.contentWindow.document.getElementById('videoPelicula');
        if(videoHoly){
            console.log('hago videoHoly muted');
            //alert('videoHoly muted');
            videoHoly.muted = true;
        }
    };

    //===================================================//
    //start - experiment
    //===================================================//


    //creo datos solo para una pantalla...
    una_pantalla_datos = {
        tipo_content: 'es_song_slide',//por ahora solo texto...
        id_song: id_song,
        slide_actual: currentSlide,
        slide_html: slide_divs,
    };
    console.log('una_pantalla_datos: ', una_pantalla_datos);

    arr_pantalla.push(una_pantalla_datos);
    //arr_pantalla.push(una_pantalla_datos);//test
    //arr_pantalla.push(una_pantalla_datos);//test
    console.log('arr_pantalla: ', arr_pantalla);

    arr_pantalla_string = JSON.stringify(arr_pantalla);//es global
    console.log('arr_pantalla_string: ', arr_pantalla_string);

    localStorage.setItem('arr_pantalla',arr_pantalla_string);// para mostrar LOCALMENTE

    let tiempo_ms = Date.now();//tiempo en milisegundos


    //1.1 Objeto para LOCAL
    objPantalla = {
        id_song,
        slide_actual,
        arr_pantalla,
        pantalla_show,
        tiempo_restante_show,
        hora_actual_show,
        show_logo_en_fondo,
        show_imagen_en_fondo,
        tipo_content,
        bg_ruta,
        bg_media_type,
        video_ruta,
        brillo_pantalla,
        show_bible_en_fondo,
        show_black_en_fondo,
        user_view_control,
        show_legend,
        show_acordes,
        show_next_slide,
        show_en_top,
        show_en_parte_top,
        show_en_center,
        tipo_fuente,
        tiempo_ms: 0, //si meto para local, no se ajusta font-size bien
    };
    console.log('(local) --- objPantalla: ', objPantalla);
    
    //1.2 Objeto Params para LOCAL
    objPantallaParams = {
        pantalla_show,
        tiempo_restante_show,
        hora_actual_show,
        show_logo_en_fondo,
        show_imagen_en_fondo,
        tipo_content,
        bg_ruta,
        bg_media_type,
        video_ruta,
        brillo_pantalla,
        show_bible_en_fondo,
        show_black_en_fondo,
        user_view_control,
        show_legend,
        show_acordes,
        show_next_slide,
        show_en_top,
        show_en_parte_top,
        show_en_center,
        tipo_fuente,
        tiempo_ms: 0, //si meto para local, no se ajusta font-size bien
    };
    console.log('(local) --- objPantallaParams: ', objPantallaParams);


    let objPantalla_local = (localStorage.getItem('objPantalla')) ? JSON.parse(localStorage.getItem('objPantalla')) : null ;

    //Si se hace click en el mismo slide porque no se ve bien el texto...
    if( objPantalla_local && 
        id_song == objPantalla_local.id_song &&
        currentSlide == objPantalla_local.slide_actual 
    ){
        //meto el parametro y lo guardo en localStorage para que se ajuste de nuevo el tamaño de fuente         
        //objPantalla.tiempo_ms = tiempo_ms;
        //objPantallaParams.tiempo_ms = tiempo_ms;

        console.log('(meto tiempo_ms en local) --- objPantalla: ', objPantalla);
        console.log('(meto tiempo_ms en local) --- objPantallaParams: ', objPantallaParams);
    }
    
    update_objPantalla();//guardo en localStorage
    update_objPantallaParams();//guardo en localStorage


    //2. Preparo para enviar a BD
    let arr_pantalla_safe = structuredClone(arr_pantalla);
    console.log('antes. clonado --- arr_pantalla_safe: ', arr_pantalla_safe);

    //sanitizo cada item de array metiendo '__||__' en slide_html
    arr_pantalla_safe.forEach((item, i) => {
        console.log('item: ', item);
        item.slide_html = sanitizeHtmlForJson(compactHtml(item.slide_html));
    });        
    console.log('despues. con __||__ --- arr_pantalla_safe: ', arr_pantalla_safe);

    //Objeto para BD. asigno la variable global para enviar al BD
    objPantallaToSendToBd = {
        id_song,
        slide_actual,
        arr_pantalla: arr_pantalla_safe,
        pantalla_show,
        tiempo_restante_show,
        hora_actual_show,
        show_logo_en_fondo,
        show_imagen_en_fondo,
        tipo_content,
        bg_ruta,
        bg_media_type,
        video_ruta,
        brillo_pantalla,
        show_bible_en_fondo,
        show_black_en_fondo,
        user_view_control,
        show_legend,
        show_acordes,
        show_next_slide,
        show_en_top,
        show_en_parte_top,
        show_en_center,
        tiempo_ms,//solo meter en la bd, no en local!
    };
    console.log('objPantallaToSendToBd: ',objPantallaToSendToBd);

    //solo grabo en bd si estan abiertas las pestaña o ventana remotas
    if(miPantallaRemota){
        console.log('grabo en BD...');

        //guardo en la BD
        const result = await guardarArrPantallaEnBd();//se envia objPantallaToSendToBd
        console.log('arr_pantalla: ', arr_pantalla);
        console.log('result: ', result);
    }
    
    actualizarPantallas();

    //buildArrPantallaDesktop(arr_pantalla);//aki no uso esto. muestro el iframe
    
    console.log('fin make_arr_pantalla...');
}


function actualizarPantallas({
    actualizarSlide = true,
    actualizarVista = true
} = {}){
    console.log('=== function actualizarPantallas() ===');

    // Actualizar datos de la hora antes de enviarlos
    objHora.horaInicio = parseInt(eid_horaInicio.value, 10);
    objHora.minutosInicio = parseInt(eid_minutosInicio.value, 10);

    const payload = {
        tipo: 'pantalla_update',

        actualizarSlide,//por defecto es true
        actualizarVista,//por defecto es true

        arr_pantalla,
        objPantallaParams: crearObjPantallaParamsParaPantalla(),

        objTimer, //para temporizador
        objHora,  //para hora actual
        objVideo   //para video
    };
    
    // iframe local
    if(miIframe && miIframe.contentWindow){
        console.log('hay miIframe abierto. envio mensaje...');

        miIframe.contentWindow.postMessage(
            payload,
            window.location.origin
        );
    }
    
    // Elimino referencias cerradas
    limpiarReferenciasCerradas();

    // Todas las pantallas abiertas
    arr_misPantallas.forEach(referencia => {

        try {

            if(!referencia || referencia.closed){
                return;
            }

            const origin = (referencia.location.origin === window.location.origin)
                ? window.location.origin
                : '*';

            referencia.postMessage(
                payload,
                origin
            );

        } catch(error){

            // Si no puedo acceder a location.origin (cross-origin)
            referencia.postMessage(
                payload,
                '*'
            );

        }

    });

    //REVISAR LUEGO!!!
    // pantalla remota
    if (miPantallaRemota && !miPantallaRemota.closed) {
        console.log('hay miPantallaRemota abierta. envio mensaje...');

        pantallaRemota.postMessage(
            payload,
            '*'
        );
    }
}

function enviarMensajeReferencia(referencia, data){
    console.log('=== function enviarMensajeReferencia() ===');

    if(referencia && !referencia.closed){

        referencia.postMessage(
            data,
            window.location.origin
        );
        referencia.focus();

    }else{
        console.log('La referencia está cerrada o no existe');
    }
}
//no se usa todavia
// function enviarAccionPantalla(tipo){

//     enviarMensajeReferencia(
//         miPantallaLocal,
//         { tipo }
//     );

// }


async function showTipoContent(btn, param){
    console.log('=== function showTipoContent() ===');
    
    
    if(!param || !btn) return;

    if(btn.classList.contains('opt_fondo')){
        const contenedor = eid_block_esquema.querySelector('.wr_opt_fondo');
        if(contenedor){
            resetBtnActive(contenedor);
            show_logo_en_fondo = 0;//reset
            show_imagen_en_fondo = 0;//reset
            tipo_content = '';//reset
            bg_ruta = '';//reset
            bg_media_type = '';//reset
            video_ruta = '';//reset
            brillo_pantalla = 100;//reset
            show_bible_en_fondo = 0;//reset
            show_black_en_fondo = 0;//reset
            tiempo_restante_show = 0;//reset
            hora_actual_show = 0;//reset

            eid_fondo_body.className = '';//reset
            eid_fondo_body.style = '';//reset
            eid_imagenPersonalizada.classList.remove('d-block');
            eid_imagenPersonalizada.classList.add('d-none');//oculto
            
            //guardo en local
            localStorage.setItem('show_logo_en_fondo', show_logo_en_fondo);
            localStorage.setItem('show_imagen_en_fondo', show_imagen_en_fondo);
            localStorage.setItem('tipo_content', tipo_content);
            localStorage.setItem('bg_ruta', bg_ruta);
            localStorage.setItem('bg_media_type', bg_media_type);
            localStorage.setItem('video_ruta', video_ruta);
            localStorage.setItem('brillo_pantalla', brillo_pantalla);
            localStorage.setItem('show_bible_en_fondo', show_bible_en_fondo);
            localStorage.setItem('show_black_en_fondo', show_black_en_fondo);
            localStorage.setItem('tiempo_restante_show', tiempo_restante_show);
            localStorage.setItem('hora_actual_show', hora_actual_show);
        }
    }

    //todos los parametros de ajuste de pantalla como letras
    switch (param) {
        case 'i'://iglesia => mostrar logotipo de la iglesia en el fondo (cuando no se ve el slide)
            if(show_logo_en_fondo == 1){
                show_logo_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_logo_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('logo_en_fondo');
            localStorage.setItem('show_logo_en_fondo', show_logo_en_fondo);
            break;

        case 'g'://imagen de letra 'g' => mostrar imagen personalizada en el fondo (cuando no se ve el slide)
            if(show_imagen_en_fondo == 1){
                show_imagen_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_imagen_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('imagen_en_fondo');
            localStorage.setItem('show_imagen_en_fondo', show_imagen_en_fondo);

            eid_imagenPersonalizada.classList.remove('d-none');//muestro
            eid_imagenPersonalizada.classList.add('d-block');//muestro
            await pintMediaActiveEnFondo();//tiene guardado de bg_ruta en localStorage

            //pinto las imagenes personalizadas disponibles para elegir
            await pintMediaSubidos();
            break;

        case 'r'://brillo de letra 'r' => brillo de la pantalla (opacity) en fondo y texto
            console.log('aki aplicar brillo...');
            break;

        case 'b'://bible => mostrar imagen de la biblia abierta en el fondo (cuando no se ve el slide)
            if(show_bible_en_fondo == 1){
                show_bible_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_bible_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('bible_en_fondo');
            localStorage.setItem('show_bible_en_fondo', show_bible_en_fondo);
            break;

        case 'f'://fondo => mostrar fondo black en el fondo (cuando no se ve el slide)
            if(show_black_en_fondo == 1){
                show_black_en_fondo = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_black_en_fondo = 1;//next action
                btn.classList.add('btn_active');
            }
            eid_fondo_body.className = '';//reset
            eid_fondo_body.classList.add('black_en_fondo');
            localStorage.setItem('show_black_en_fondo', show_black_en_fondo);
            break;

        case 'u'://user => usuario puede controlar que mostrar en la vista de slide: legend, acordes, next_slide 
            if(user_view_control == 1){
                user_view_control = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                user_view_control = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('user_view_control', user_view_control);
            break;            


        //Control por usuario    
        case 'l'://legend => mostrar títulos de bloques, legend de fieldset
            if(show_legend == 1){
                show_legend = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_legend = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('show_legend', show_legend);
            break;

        case 'c'://chords => acordes
            if(show_acordes == 1){
                show_acordes = 0;//next action
                btn.classList.remove('btn_active');
                ocultarAcordes('#block_esquema_body');
            }else{
                show_acordes = 1;//next action
                btn.classList.add('btn_active');
                mostrarAcordes('#block_esquema_body');
            }
            localStorage.setItem('show_acordes', show_acordes);
            break;

        case 'n'://next slide => mostrar 2 lineas de sig slide
            if(show_next_slide == 1){
                show_next_slide = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_next_slide = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('show_next_slide', show_next_slide);
            break;


        //mostrar el slide en el top con: justify-content: flex-start   
        case 't'://top => mostrar en el top
            if(show_en_top == 1){
                show_en_top = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_en_top = 1;//next action
                btn.classList.add('btn_active');

                show_en_center = 0;//deshabilito
                eid_btn_show_en_center.classList.remove('btn_active');
                localStorage.setItem('show_en_center', show_en_center);
            }
            localStorage.setItem('show_en_top', show_en_top);
            break;

        case 'z'://center la 'c' está ocupada para acordes 'chords' por eso => 'z'
            if(show_en_center == 1){
                show_en_center = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_en_center = 1;//next action
                btn.classList.add('btn_active');

                show_en_top = 0;//deshabilito
                eid_btn_show_en_top.classList.remove('btn_active');
                localStorage.setItem('show_en_top', show_en_top);
            }
            localStorage.setItem('show_en_center', show_en_center);
            break; 
            
        //new    
        case 'x'://top => mostrar en la parte top (50% de arriba de la pantalla)
            if(show_en_parte_top == 1){
                show_en_parte_top = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                show_en_parte_top = 1;//next action
                btn.classList.add('btn_active');
            }
            localStorage.setItem('show_en_parte_top', show_en_parte_top);
            break;
            
        //new    
        case 'w'://w => mostrar el tiempo restante hasta el inicio del culto en la hora actual
            if(tiempo_restante_show == 1){
                tiempo_restante_show = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                tiempo_restante_show = 1;//next action
                btn.classList.add('btn_active');
            }
            check_tiempo_restante_show();
            localStorage.setItem('tiempo_restante_show', tiempo_restante_show);
            break;
            
        //new    
        case 'h'://h => mostrar la hora actual del culto
            if(hora_actual_show == 1){
                hora_actual_show = 0;//next action
                btn.classList.remove('btn_active');
            }else{
                hora_actual_show = 1;//next action
                btn.classList.add('btn_active');
            }
            check_hora_actual_show();
            localStorage.setItem('hora_actual_show', hora_actual_show);
            break;
            
    
        default:
            break;
    }

    await guardarEnLocalAndBd(param);
}


async function guardarEnLocalAndBd(param){
    console.log('=== function guardarEnLocalAndBd() ===');
    console.log('param:', param);

    //Admin control
    //p -> (pantalla) -> pantalla_show
    //w -> (w una letra disponible) -> tiempo_restante_show
    //h -> (hora)     -> hora_actual_show
    //i -> (iglesia)  -> show_logo_en_fondo
    //g -> (imagen)  -> show_imagen_en_fondo
    //b -> (bible)    -> show_bible_en_fondo
    //f -> (fondo)    -> show_black_en_fondo
    //u -> (user)     -> user_viev_control
    
    //User control si (user_viev_control == true)
    //l -> (legend)   -> user_viev_control
    //c -> (chords)   -> show_acordes
    //n -> (next)     -> show_next_slide
    //t -> (top)      -> show_en_top
    //z -> (center)   -> show_en_center
    //r -> (brillo)   -> brillo_pantalla
    //x -> (parte top) -> show_en_parte_top

    if(['p','w','h',  'i','g','b','f','u',   'l','c','n',  't','z',   'r', 'x'].includes(param)){
        
        //1. asigno la variable global para localStorage
        objPantallaParams = {
            pantalla_show,
            tiempo_restante_show,
            hora_actual_show,
            show_logo_en_fondo,
            show_imagen_en_fondo,
            tipo_content,
            bg_ruta,
            bg_media_type,
            video_ruta,
            brillo_pantalla,
            show_bible_en_fondo,
            show_black_en_fondo,
            user_view_control,
            show_legend,
            show_acordes,
            show_next_slide,
            show_en_top,
            show_en_parte_top,
            show_en_center,
            tipo_fuente
        };
        console.log('objPantallaParams: ',objPantallaParams);
        
        //guardo en localStorage
        objPantallaParams_str = JSON.stringify(objPantallaParams);
        localStorage.setItem('objPantallaParams', objPantallaParams_str);


        //2. asigno la variable global para enviar al BD
        objPantallaParamsToSendToBd = {
            id_song,
            pantalla_show,
            tiempo_restante_show,
            hora_actual_show,
            show_logo_en_fondo,
            show_imagen_en_fondo,
            tipo_content,
            bg_ruta,
            bg_media_type,
            video_ruta,
            brillo_pantalla,
            show_bible_en_fondo,
            show_black_en_fondo,
            user_view_control,
            show_legend,
            show_acordes,
            show_next_slide,
            show_en_top,
            show_en_parte_top,
            show_en_center,
            tipo_fuente
        };
        console.log('objPantallaParamsToSendToBd: ',objPantallaParamsToSendToBd);        
        
        //actualizo en BD SOLO los parametros de vista. No datos del arr_pantalla
        const resultParams = await guardarPantallaParamsEnBd();//objPantallaParamsToSendToBd es global
        console.log('resultParams: ', resultParams);

        //guardo en localStorage
        objPantallaParamsToSendToBd_str = JSON.stringify(objPantallaParamsToSendToBd);
        localStorage.setItem('objPantallaParamsToSendToBd', objPantallaParamsToSendToBd_str);

        //actualizo solo vista, no arr_pantalla
        actualizarPantallas({
            actualizarSlide: false,
            actualizarVista: true
        });
    }
}


/*
//no se usan en hs.
function enableDisablePantallaShow(){//muestra o oculta
    if(pantallaShow){
        pantallaShow = 0;//siguiente accion
    }else{        
        pantallaShow = 1;//siguiente accion
    }
    check_pantallaShow();
}
function check_pantallaShow(){
    console.log('=== function check_pantallaShow() ===');
    console.log('pantallaShow: ', pantallaShow);

    if(pantallaShow){
        mostrar_pantallaShow();
    }else{
        ocultar_pantallaShow();
    }
}
function mostrar_pantallaShow(){   
    // eid_btn_pantallaShow.classList.add('btn_active');
    eid_vklad_btn_pantallaShow.classList.add('btn_active');
    eid_contenedor_prev.classList.add('shown');
    //eid_fondo_body.classList.add('fondo_black');

    localStorage.setItem('pantallaShow','1');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow
}

function ocultar_pantallaShow(){
    // eid_btn_pantallaShow.classList.remove('btn_active');
    eid_vklad_btn_pantallaShow.classList.remove('btn_active');
    eid_contenedor_prev.classList.remove('shown');
    //eid_fondo_body.classList.remove('fondo_black');
    
    localStorage.setItem('pantallaShow','0');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow
}
*/


function toggle_ajustes_pers(){//muestra o oculta
    if(ajustes_pers){
        ajustes_pers = 0;//siguiente accion
    }else{        
        ajustes_pers = 1;//siguiente accion
    }
    check_ajustes_pers();
}
function check_ajustes_pers(){
    console.log('=== function check_ajustes_pers() ===');
    console.log('ajustes_pers: ', ajustes_pers);

    if(ajustes_pers){
        mostrar_ajustes_pers();
    }else{
        ocultar_ajustes_pers();
    }
}
function mostrar_ajustes_pers(){//es lo mismo que deshabilitar
    const d_ajustes_pers = eid_block_cancion.querySelector('#d_ajustes_pers');
    d_ajustes_pers.classList.add('active');
    d_ajustes_pers.querySelector('span').textContent = 'Deshabilitar ajustes personalizados';//next action
    eid_block_cancion.querySelector('#head_pers_shapka').innerHTML = 'Ajustes personalizados <b>HABILITADOS</b>';
    eid_block_cancion.querySelector('#wr_form_detalles_pers').style.display = 'block';

    //deshabilito inputs de ajustes generales
    document.querySelectorAll('.aj_general').forEach(el => {
        el.classList.add('desactivado');
        if(el.type == 'input'){
            el.disabled = true;
        }
    });

    const tipo_acorde_pers_input = eid_block_cancion.querySelector('#tipo_acorde_pers_hidden');
    const eid_tune_transpose_pers = eid_block_cancion.querySelector('#tune_transpose_pers');
    const eid_capo_pers = eid_block_cancion.querySelector('#capo_pers');

    const transpose_pers_val = Number(eid_tune_transpose_pers.value);
    const capo_pers_val = Number(eid_capo_pers.value);

    const transpose_val_new = getTransposeFromCapo(transpose_pers_val, capo_pers_val);        
    handleFormTranspose(transpose_val_new);
    handleFormTipoAcorde(tipo_acorde_pers_input.value);//para cambiar tipo acorde    
}
function ocultar_ajustes_pers(){//es lo mismo que deshabilitar
    const d_ajustes_pers = eid_block_cancion.querySelector('#d_ajustes_pers');
    d_ajustes_pers.classList.remove('active');
    d_ajustes_pers.querySelector('span').textContent = 'Habilitar ajustes personalizados';//next action
    eid_block_cancion.querySelector('#head_pers_shapka').innerHTML = 'Ajustes personalizados <b>DESHABILITADOS</b>';
    eid_block_cancion.querySelector('#wr_form_detalles_pers').style.display = 'none';

    //habilito inputs de ajustes generales
    document.querySelectorAll('.aj_general').forEach(el => {
        el.classList.remove('desactivado');
        if(el.type == 'input'){
            el.disabled = false;
        }
    });

    const tipo_acorde_input = eid_block_cancion.querySelector('#tipo_acorde_hidden');
    const eid_tune_transpose = eid_block_cancion.querySelector('#tune_transpose');

    handleFormTipoAcorde(tipo_acorde_input.value);//para cambiar tipo acorde
    handleFormTranspose(Number(eid_tune_transpose.value));//para transponer al cargar 
}





function toggle_pantalla_show(){//muestra o oculta
    if(pantalla_show){
        pantalla_show = 0;//siguiente accion
    }else{        
        pantalla_show = 1;//siguiente accion
    }
    check_pantalla_show();
}
function check_pantalla_show(){
    console.log('=== function check_pantalla_show() ===');
    console.log('pantalla_show: ', pantalla_show);

    if(pantalla_show){
        mostrar_pantalla_show();
    }else{
        ocultar_pantalla_show();
    }
}
function mostrar_pantalla_show(){   
    // eid_btn_pantallaShow.classList.add('btn_active');
    eid_vklad_btn_pantallaShow.classList.add('btn_active');
    eid_contenedor_prev.classList.add('shown');
    eid_pantalla_body.classList.add('shown');

    localStorage.setItem('pantalla_show','1');
    make_arr_pantalla(currentSlide);//dentro hay pantallaShow

    aplicarBrillo(brillo_pantalla);
}
async function ocultar_pantalla_show(){
    // eid_btn_pantallaShow.classList.remove('btn_active');
    eid_vklad_btn_pantallaShow.classList.remove('btn_active');
    eid_contenedor_prev.classList.remove('shown');
    eid_pantalla_body.classList.remove('shown');
    
    localStorage.setItem('pantalla_show','0');
    await pintMediaActiveEnFondo();
    
    aplicarBrillo(brillo_pantalla);
    await guardarEnLocalAndBd('p');//solo actualizo params de vista
}



function toggle_tiempo_restante_show(){
    if(tiempo_restante_show){
        tiempo_restante_show = 0;//siguiente accion
    }else{        
        tiempo_restante_show = 1;//siguiente accion
    }
    check_tiempo_restante_show();
}
function check_tiempo_restante_show(){
    console.log('=== function check_tiempo_restante_show() ===');
    console.log('tiempo_restante_show: ', tiempo_restante_show);

    if(tiempo_restante_show){
        mostrar_tiempo_restante_show();
    }else{
        ocultar_tiempo_restante_show();
    }
}
async function mostrar_tiempo_restante_show(){   
    eid_btn_tiempo_restante_show.classList.add('btn_active');
    eid_horaRestanteHoly.classList.add('shown');
    mostrarHoraRestante();    
    
    localStorage.setItem('tiempo_restante_show','1');
    await guardarEnLocalAndBd('w');//solo actualizo params de vista
}
async function ocultar_tiempo_restante_show(){
    eid_btn_tiempo_restante_show.classList.remove('btn_active');
    eid_horaRestanteHoly.classList.remove('shown');
    ocultarHoraRestante();
    
    localStorage.setItem('tiempo_restante_show','0');
    await guardarEnLocalAndBd('w');//solo actualizo params de vista
}


//hora_actual_show
function toggle_hora_actual_show(){
    if(hora_actual_show){
        hora_actual_show = 0;//siguiente accion
    }else{        
        hora_actual_show = 1;//siguiente accion
    }
    check_hora_actual_show();
}
function check_hora_actual_show(){
    console.log('=== function check_hora_actual_show() ===');
    console.log('hora_actual_show: ', hora_actual_show);

    if(hora_actual_show){
        mostrar_hora_actual_show();
    }else{
        ocultar_hora_actual_show();
    }
}
async function mostrar_hora_actual_show(){   
    console.log('=== function mostrar_hora_actual_show() ===');

    eid_horaHoly.classList.remove('grey');
    eid_horaHoly.classList.add('azul');

    makeBtnActive(eid_horaControlVista, eid_btn_mostrarHora);
    
    hora_actual_show = 1;
    localStorage.setItem('hora_actual_show','1');
    await guardarEnLocalAndBd('h');//solo actualizo params de vista
            //make_arr_pantalla(currentSlide);//dentro hay pantallaShow REVISAR SI HACE FALTA!!!
}
async function ocultar_hora_actual_show(){
    console.log('=== function ocultar_hora_actual_show() ===');

    eid_horaHoly.classList.remove('azul');
    eid_horaHoly.classList.add('grey');

    if(horaHolyInterval){
        // Sigue calculando la hora y el tiempo restante.
        // Sólo cambia el aspecto.
    } else {
        // No hay render: mostrar placeholders.
        eid_horaActualHoly.textContent = '--:--:--';
        eid_horaRestanteHoly_text.textContent = 'Годинник не увімкнено...';
        eid_horaRestanteHoly_time.textContent = '--:--';
    }

    makeBtnActive(eid_horaControlVista, eid_btn_ocultarHora);
    
    hora_actual_show = 0;
    localStorage.setItem('hora_actual_show','0');
    await guardarEnLocalAndBd('h');//solo actualizo params de vista
}



function check_fondo_body(){
    console.log('=== function check_fondo_body() ===');

    eid_fondo_body.className = '';//reset

    if(show_logo_en_fondo == 1){
        eid_fondo_body.classList.add('logo_en_fondo');
    }else if(show_imagen_en_fondo == 1){
        eid_fondo_body.classList.add('imagen_en_fondo');
    } else if(show_bible_en_fondo == 1){
        eid_fondo_body.classList.add('bible_en_fondo');
    } else if(show_black_en_fondo == 1){
        eid_fondo_body.classList.add('black_en_fondo');
    } else{
        eid_fondo_body.classList.add('bible_en_fondo');//bible
    }
}

function check_show_logo_en_fondo(){
    console.log('=== function check_show_logo_en_fondo() ===');
    console.log('show_logo_en_fondo: ', show_logo_en_fondo);
    
    if(show_logo_en_fondo){
        eid_btn_show_logo_en_fondo.classList.add('btn_active');
    }else{
        eid_btn_show_logo_en_fondo.classList.remove('btn_active');
    }
}


async function check_show_imagen_en_fondo(){
    console.log('=== function check_show_imagen_en_fondo() ===');
    console.log('show_imagen_en_fondo: ', show_imagen_en_fondo);
    
    if(show_imagen_en_fondo){
        eid_btn_show_imagen_en_fondo.classList.add('btn_active');
        await pintMediaActiveEnFondo();//tiene guardado de bg_ruta en localStorage
    }else{
        eid_btn_show_imagen_en_fondo.classList.remove('btn_active');
    }
}


async function check_brillo_pantalla(){
    console.log('=== function check_brillo_pantalla() ===');
    console.log('brillo_pantalla: ', brillo_pantalla);
    
    if(brillo_pantalla >= 10 && brillo_pantalla <= 100 ){
        pintBrillo(brillo_pantalla);
        aplicarBrillo(brillo_pantalla);
    }
}

function check_show_bible_en_fondo(){
    console.log('=== function check_show_bible_en_fondo() ===');
    console.log('show_bible_en_fondo: ', show_bible_en_fondo);
    
    if(show_bible_en_fondo){
        eid_btn_show_bible_en_fondo.classList.add('btn_active');
    }else{
        eid_btn_show_bible_en_fondo.classList.remove('btn_active');
    }
}

function check_show_black_en_fondo(){
    console.log('=== function check_show_black_en_fondo() ===');
    console.log('show_black_en_fondo: ', show_black_en_fondo);
    
    if(show_black_en_fondo){
        eid_btn_show_black_en_fondo.classList.add('btn_active');
    }else{
        eid_btn_show_black_en_fondo.classList.remove('btn_active');
    }
}


function check_user_view_control(){
    console.log('=== function check_user_view_control() ===');
    console.log('user_view_control: ', user_view_control);
    
    if(user_view_control){
        eid_btn_user_view_control.classList.add('btn_active');
    }else{
        eid_btn_user_view_control.classList.remove('btn_active');
    }
}


function check_show_legend(){
    console.log('=== function check_show_legend() ===');
    console.log('show_legend: ', show_legend);
    
    if(show_legend){
        eid_btn_show_legend.classList.add('btn_active');
    }else{
        eid_btn_show_legend.classList.remove('btn_active');
    }
}
function check_show_acordes(){
    console.log('=== function check_show_acordes() ===');
    console.log('show_acordes: ', show_acordes);
    
    if(show_acordes){
        eid_btn_show_acordes.classList.add('btn_active');
        mostrarAcordes('#block_esquema_body');
    }else{
        eid_btn_show_acordes.classList.remove('btn_active');
        ocultarAcordes('#block_esquema_body');
    }
}
function check_show_next_slide(){
    console.log('=== function check_show_next_slide() ===');
    console.log('show_next_slide: ', show_next_slide);
    
    if(show_next_slide){
        eid_btn_show_next_slide.classList.add('btn_active');
    }else{
        eid_btn_show_next_slide.classList.remove('btn_active');
    }
}

function check_show_en_top(){
    console.log('=== function check_show_en_top() ===');
    console.log('show_en_top: ', show_en_top);
    
    if(show_en_top){
        eid_btn_show_en_top.classList.add('btn_active');
    }else{
        eid_btn_show_en_top.classList.remove('btn_active');
    }
}

function check_show_en_parte_top(){
    console.log('=== function check_show_en_parte_top() ===');
    console.log('show_en_parte_top: ', show_en_parte_top);
    
    if(show_en_parte_top){
        eid_btn_show_en_parte_top.classList.add('btn_active');
    }else{
        eid_btn_show_en_parte_top.classList.remove('btn_active');
    }
}

function check_show_en_center(){
    console.log('=== function check_show_en_center() ===');
    console.log('show_en_center: ', show_en_center);
    
    if(show_en_center){
        eid_btn_show_en_center.classList.add('btn_active');
    }else{
        eid_btn_show_en_center.classList.remove('btn_active');
    }
}



function check_vkladActive(){//antes check_sidebarTabActive
    console.log('=== function check_vkladActive() ===');
    if(eid_block_esquema_head.querySelector(`#btn_${vkladActive}`)){
        showVklad(eid_block_esquema_head.querySelector(`#btn_${vkladActive}`), vkladActive);
    }
}


function showVklad(btnElement, param){//antes showSidebarTab()
    console.log('=== function showVklad() ===');

    vkladActive = param;
    update_vkladActive();

    eid_block_esquema_head.querySelectorAll('button').forEach(btn =>{
        //si el boton 'btnElement' no es el boton del bucle
        if(btn == btnElement){
            btn.classList.add('btn_active');            
        }else{
            btn.classList.remove('btn_active');
        }
    });

    eid_block_esquema.querySelectorAll('.vklads').forEach(vklad =>{
        let vklad_act = `vklad_${param}`;
        if(vklad.classList.contains(vklad_act)){
            vklad.style.display = 'block';
        }else{
            vklad.style.display = 'none';
        }
    });

    switch (param) {
        default:
        case 'ver_esquema':
            ver_esquema();
            break;

        case 'crear_esquema':
            crear_esquema();
            break;

        case 'select_slide':
            select_slide();
            //make_arr_pantalla(currentSlide);    
            break;
    }           
}

function update_vkladActive(){
    //console.log('=== function update_vkladActive() ===');    
    localStorage.setItem('vkladActive', vkladActive);

    // obj_ajustes.vkladActive = vkladActive;
    // update_obj_ajustes();
}

function update_objPantalla(){
    //actualizo variable global objPantalla en localStorage
    objPantalla_str = JSON.stringify(objPantalla);
    localStorage.setItem('objPantalla', objPantalla_str);
}

function update_objPantallaParams(){
    //actualizo variable global objPantallaParams en localStorage
    objPantallaParams_str = JSON.stringify(objPantallaParams);
    localStorage.setItem('objPantallaParams', objPantallaParams_str);
}




function hayElementosModalesAbiertos(opciones = { parcial: true }) {
    const modales = document.querySelectorAll('.elementos_modales');

    return [...modales].some(modal => {
        console.log('elemento modal --- modal: ', modal);
        
        // Si tiene la clase 'shown', se considera visible sin más comprobaciones
        if (modal.classList.contains('shown')) {
            console.log('el modal se considera visible ya que tiene class shown. return true.');
            return true;
        }else{
            console.log('el modal NO se considera visible ya que NO tiene class shown: sigo...');
        }

        // Comprobar si está oculto en el DOM
        if (!modal.offsetParent){
            console.log('el modal se considera oculto en el DOM. return false.');
            return false;
        }else{
            console.log('el modal se considera mostrado en el DOM. sigo...');
        }

        // Obtener posición y dimensiones relativas a la ventana
        const rect = modal.getBoundingClientRect();
        console.log('elemento modal rect: ', rect);


        // Comprobar tamaño
        if (rect.width === 0 || rect.height === 0) {
            console.log('el modal tiene ancho y alto = 0. return false.');            
            return false;
        }

        // Verificar visibilidad según la opción parcial o total
        if (opciones.parcial) {
            const condicion_parcial = (
                rect.bottom > 0 &&
                rect.right > 0 &&
                rect.top < window.innerHeight &&
                rect.left < window.innerWidth
            );
            console.log('condicion_parcial: ', condicion_parcial);
            return condicion_parcial;
        } else {
            const condicion_total = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= window.innerHeight &&
                rect.right <= window.innerWidth
            );
            console.log('condicion_total: ', condicion_total);
            return condicion_total;
        }
    });
}
//ejemplos de uso:
//hayElementosModalesAbiertos({ parcial: false });// Exigir que estén totalmente dentro de la ventana
//hayElementosModalesAbiertos();// Permitir modales parcialmente visibles



function esElementoVisible(elemento) {
    if (!elemento) return false; // No existe en el DOM

    // 1. Comprobar si está oculto con display:none o visibility:hidden
    if (!elemento.offsetParent) return false;

    // 2. Comprobar si está dentro del viewport
    const rect = elemento.getBoundingClientRect();
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < window.innerHeight &&
        rect.left < window.innerWidth
    );
}








// hideShowSettings('nav');

async function hideShowDiv(id_div){
    console.log('=== function hideShowDiv() ===');
    console.log('id_div: ',id_div);

    const divElement = document.getElementById(id_div);
    const block_css = window.getComputedStyle(divElement);
    const block_display = block_css.display;
   
    if(block_display == 'block'){//si es visible
        closeDiv(divElement);//oculto
    }else{//muestro
        openDiv(divElement);//muestro
    }

    //creo tambien el li para añadir a la lista nueva
    const li_action_btn_add_lista_new = document.createElement('li');
    li_action_btn_add_lista_new.className = 'li_action btn_add_lista_new';
    li_action_btn_add_lista_new.innerHTML = `
        <span>Añadir a una Lista nueva</span>
    `;
    li_action_btn_add_lista_new.onclick = () =>{ 
        addToLista('new')
    };



    let btn_add_lista_inner_html;

    if(Object.keys(objLista).length === 0){//no hay lista activa
        btn_add_lista_inner_html = `
                Añadir a una Lista nueva
        `;
    }else{//hay lista activa
        btn_add_lista_inner_html = `
            <span class="sp_add_a_lista">
                <span>Añadir a la Lista ACTUAL: </span>
                <b class="n_lista">${objLista.id_lista}</b>
            </span>
            <span class="fecha_lista">${diaSemana(objLista.fecha)} &nbsp; ${objLista.fecha_ver}</span>
            <span class="title_lista">${objLista.title}</span>
            <span class="grupo_lista">${objLista.grupo_nombre}</span>
            <span class="wr_canciones">
                <span>Canciones: </span>
                <b class="n_canciones">${objLista.arr_lista.length}</b>
            </span>
        `;        
    }
    
    switch (id_div) {
        case 'bl_actions_buscar':
            if(buscar_ul_action.querySelector('.btn_add_lista')){
                buscar_ul_action.querySelector('.btn_add_lista').innerHTML = btn_add_lista_inner_html;

                const elemento_btn_add_lista_new = buscar_ul_action.querySelector('.btn_add_lista_new');
                if(id_lista){//si hay lista activa 
                    if(!elemento_btn_add_lista_new){//y si no existe el btn para crear lista nueva, lo añado
                        buscar_ul_action.querySelector('.btn_add_lista').after(li_action_btn_add_lista_new);//añado nuevo btn para crear lista nueva
                    }
                }else{
                    if(elemento_btn_add_lista_new){
                        elemento_btn_add_lista_new.remove();//si no hay lista activa y existe el btn para crear lista nueva, lo quito
                    }
                }
            }
            
        case 'bl_actions_cancion':
            if(cancion_ul_action.querySelector('.btn_add_lista')){
                cancion_ul_action.querySelector('.btn_add_lista').innerHTML = btn_add_lista_inner_html;

                const elemento_btn_add_lista_new = cancion_ul_action.querySelector('.btn_add_lista_new');
                if(id_lista){//si hay lista activa 
                    if(!elemento_btn_add_lista_new){//y si no existe el btn para crear lista nueva, lo añado
                        cancion_ul_action.querySelector('.btn_add_lista').after(li_action_btn_add_lista_new);//añado nuevo btn para crear lista nueva
                    }
                }else{
                    if(elemento_btn_add_lista_new){
                        elemento_btn_add_lista_new.remove();//si no hay lista activa y existe el btn para crear lista nueva, lo quito
                    }
                }
            }
            break;
            
        case 'bl_select_slide_settings':
            //imagen/media
            if(show_imagen_en_fondo == 1){
                eid_imagenPersonalizada.classList.remove('d-none');//muestro
                eid_imagenPersonalizada.classList.add('d-block');//muestro
                await pintMediaSubidos();
            }
            check_brillo_pantalla();

            //video/pelicula
            arr_lista_videos = await make_arr_lista_videos();
            await pintVideoSubidos();
            pintVideoActiveEnPlayer();

            break;
    
        default:
            break;
    }
}

function closeDiv(divElement){
    console.log('=== function closeDiv() ===');
    if(!divElement) return;
    
    const bl_set_inner = divElement.querySelector('.bl_set_inner');    
    
    bl_set_inner.classList.remove('bl_opened');
    bl_set_inner.classList.add('bl_closed');
    setTimeout(()=>{
        divElement.style.display = 'none';
    },300);
}

function openDiv(divElement){
    console.log('=== function openDiv() ===');

    const bl_set_inner = divElement.querySelector('.bl_set_inner');
    const inner_content_head = divElement.querySelector('.inner_content_head');
    const inner_content_body = divElement.querySelector('.inner_content_body');

    bl_set_inner.onclick = (e)=>{
        console.log('e.target: ', e.target);
        e.stopPropagation();

        // click fuera de 'inner_content_head_body' pero dentro de 'bl_set_inner' y 'inner_content'
        // si no es cliqueado 'inner_content_head_body' entonces fue clickeado fuera de 'inner_content_head_body'
        // es decir, 'bl_set_inner' o 'inner_content' => hacer closeDiv()
        if(!e.target.closest('.inner_content_head_body') || e.target.className == 'sp_close'){//click en 'X' cerrar
            closeDiv(e.target.closest('.bl_set'));
        }
    }

    divElement.style.display = 'block';
    setTimeout(()=>{//importante para que se ejecute la animación
        bl_set_inner.classList.remove('bl_closed');
        bl_set_inner.classList.add('bl_opened');        
    },3);

    //Para que se abra mas bonito , pongo el sig. código. 
    //No pongo en css 'overflow:auto;' ya que al desplegar el block muestra scroll y luego lo quita, lo que no es bonito
    //con js lo soluciono
    setTimeout(()=>{
        
        let body_max_h = 
          bl_set_inner.offsetHeight 
        - inner_content_head.offsetHeight
        ;
        console.log('body_max_h: ', body_max_h);        
        inner_content_body.style.maxHeight = body_max_h + 'px';

    },4);//300 es 0.3s de transition css
}


function parteCentral(param){
    const parteCentralAll = eid_block_esquema.querySelectorAll('.bl_parte_c');
    parteCentralAll.forEach(parteCentral => {       
        switch (param) {
            default:
            case 'show':
                console.log('lo hago visible...');
                parteCentral.classList.remove('oculto');
                break;
                    
            case 'hide':
                console.log('lo hago oculto...');
                parteCentral.classList.add('oculto');
                break;
        }
    });
}






//ejemplo de uso
//showToast('info', 'Ajustes personalizados aplicados correctamente.', 2000, 'bottom', false, document.querySelector('.vista_fixed_body'));



function scrollToElement(contenedor, elemento) {
    //const contenedor = document.getElementById("contenedor");
    //const elemento = document.getElementById(id);

    // Calcular posición relativa del elemento dentro del contenedor
    const offsetTop = elemento.offsetTop - contenedor.offsetTop;

    // Ajustar scrollTop del contenedor
    contenedor.scrollTo({
        top: offsetTop,
        behavior: "smooth"
    });
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





function hideShowDesktopFilter(contenedor_filtro, sp_icon_filtro){
    if(contenedor_filtro.classList.contains('shown')){//si es mostrado
        hideDesktopFilter(contenedor_filtro, sp_icon_filtro);
    }else{
        showDesktopFilter(contenedor_filtro, sp_icon_filtro);
    }
    mySizeBuscar();   
}

function hideDesktopFilter(contenedor_filtro, sp_icon_filtro){
    contenedor_filtro.classList.remove('shown');//lo oculto
    const sp_filtro_img = sp_icon_filtro.querySelector('img');
    if(sp_filtro_img){
        sp_filtro_img.classList.remove('razv');
    }
    //const el_div = contenedor_filtro.parentElement;
    //getMySizeByDiv(el_div);
}

function showDesktopFilter(contenedor_filtro, sp_icon_filtro){
    contenedor_filtro.classList.add('shown');//lo muestro
    const sp_filtro_img = sp_icon_filtro.querySelector('img');
    if(sp_filtro_img){
        sp_filtro_img.classList.add('razv');
    }
    contenedor_filtro.querySelector('.inpt_vvod').focus();
    //const el_div = contenedor_filtro.parentElement;
    //getMySizeByDiv(el_div);
}






function mySizeBuscar(){
    console.log('=== function mySizeBuscar() ===');

    // Get the height of the element, including margins
    // const sidebarInner_margins_h = 
    // parseInt(sidebarInner_computedStyle.marginTop) + 
    // parseInt(sidebarInner_computedStyle.marginBottom);

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_buscar_head_h = eid_block_buscar.querySelector('#block_buscar_head').offsetHeight;
    console.log('block_buscar_head_h: ', block_buscar_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_buscar.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_buscar_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;

    // if(window.innerWidth < pantallaTabletMinPx){//mobile
    //     alert('1. es mobil. calculo height...');
    //     parte_variable_l_h = parte_variable_l_h / 2;
    // }else{//desktop
    //     alert('1. es desktop. calculo width...');
    // }

    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_buscar.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat


    let titulo_tabla_song_h = eid_block_buscar.querySelector('#titulo_tabla_song').offsetHeight;
    let d_filter_results_h = eid_block_buscar.querySelector('#d_filter_results').offsetHeight;
    let wr_tabla_paddings = parseInt(wr_tabla_computedStyle.paddingTop) + parseInt(wr_tabla_computedStyle.paddingBottom);//10 * 2;

    let wr_tabla_inner_h = 
      parte_variable_l_h //645
    - titulo_tabla_song_h //38
    - d_filter_results_h //0
    - wr_tabla_paddings //20
    ;
    console.log('wr_tabla_inner_h: ', wr_tabla_inner_h); 
    
    
    // if(window.innerWidth < pantallaTabletMinPx){//mobile
    //     alert('2. es mobil. calculo height...');
    //     wr_tabla_inner_h = wr_tabla_inner_h / 2;
    // }else{//desktop
    //     alert('2. es desktop. calculo width...');
    // }

    //pongo max-height para que scroll esté arriba si hay pocos registros 
    eid_block_buscar.querySelector('.bl_parte_l .wr_tabla_inner').style.maxHeight = wr_tabla_inner_h + 'px';//'max-height', no 'height'

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_buscar.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_buscar_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;

    // if(window.innerWidth < pantallaTabletMinPx){//mobile
    //     alert('3. es mobil. calculo height...');
    //     parte_variable_r_h = parte_variable_r_h / 2;
    // }else{//desktop
    //     alert('3. es desktop. calculo width...');
    // }

    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_buscar.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}


function mySizeEsquema(){
    console.log('=== function mySizeEsquema() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_esquema_head_h = eid_block_esquema.querySelector('#block_esquema_head').offsetHeight;
    console.log('block_esquema_head_h: ', block_esquema_head_h);
    
    //recorrer todas las 'vklads'
    eid_block_esquema.querySelectorAll('.vklads').forEach((vklad, i)=>{
        if(esElementoVisible(vklad)){
            console.log('vklad es visible. vklad: ', vklad);
            
            const cl_vklad = vklad.classList[0];
            mySizeEsquemaByClassVklad(cl_vklad, bl_body_h, block_esquema_head_h, inner_margins);
        }
    });

    console.log('=== end func ===');
}


function mySizeEsquemaByClassVklad(cl_vklad, bl_body_h, block_esquema_head_h, inner_margins){
    console.log('=== function mySizeEsquemaByClassVklad() ===');

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_l .parte_fija`).offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_esquema_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_l .parte_variable`).style.height = parte_variable_l_h + 'px';

    //si hay parte CENTRAL
    if( eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_c`) ){
        //=========================================================================================//
        //bl_parte_c
        //=========================================================================================//    
        let parte_fija_c_h = eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_c .parte_fija`).offsetHeight;
        console.log('parte_fija_c_h: ', parte_fija_c_h);
    
        let parte_variable_c_h = 
          bl_body_h //858
        - block_esquema_head_h //43
        - parte_fija_c_h //150
        - inner_margins //margin-top y margin-bottom de '.inner' contenedor
        ;
        console.log('parte_variable_c_h: ', parte_variable_c_h);    
        eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_c .parte_variable`).style.height = parte_variable_c_h + 'px';
    }

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_r .parte_fija`).offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_esquema_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_esquema.querySelector(`.${cl_vklad} .bl_parte_r .parte_variable`).style.height = parte_variable_r_h + 'px';

}


function mySizeCancion(){
    console.log('=== function mySizeCancion() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_cancion_head_h = eid_block_cancion.querySelector('#block_cancion_head').offsetHeight;
    console.log('block_cancion_head_h: ', block_cancion_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_cancion.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_cancion_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_cancion.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat


    // let titulo_tabla_song_h = eid_block_cancion.querySelector('#titulo_tabla_song').offsetHeight;
    // let d_filter_results_h = eid_block_cancion.querySelector('#d_filter_results').offsetHeight;
    // let wr_tabla_paddings = parseInt(wr_tabla_computedStyle.paddingTop) + parseInt(wr_tabla_computedStyle.paddingBottom);//10 * 2;

    // let wr_tabla_inner_h = 
    //   parte_variable_l_h //645
    // - titulo_tabla_song_h //38
    // - d_filter_results_h //0
    // - wr_tabla_paddings //20
    // ;
    // console.log('wr_tabla_inner_h: ', wr_tabla_inner_h); 

    // //pongo max-height para que scroll esté arriba si hay pocos registros 
    // eid_block_cancion.querySelector('.bl_parte_l .wr_tabla_inner').style.maxHeight = wr_tabla_inner_h + 'px';//'max-height', no 'height'

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_cancion.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_cancion_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_cancion.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}


function mySizeEjemplo(){
    console.log('=== function mySizeEjemplo() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_ejemplo_head_h = eid_block_ejemplo.querySelector('#block_ejemplo_head').offsetHeight;
    console.log('block_ejemplo_head_h: ', block_ejemplo_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_ejemplo.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_ejemplo_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_ejemplo.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_ejemplo.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_ejemplo_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_ejemplo.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}



function mySizeLista(){
    console.log('=== function mySizeLista() ===');

    let window_w = window.innerWidth;
    let window_h = window.innerHeight;
    console.log('window_w: ', window_w);    
    console.log('window_h: ', window_h);
    
    let inner_margins = parseInt(inner_computedStyle.marginTop) + parseInt(inner_computedStyle.marginBottom);//10 * 2;    
    
    let edit_head_h = ecl_edit_head.offsetHeight;
    console.log('edit_head_h: ', edit_head_h);    
    //console.log('ecl_edit_body.offsetHeight: ', ecl_edit_body.offsetHeight);
    
    let bl_head_h = ecl_bl_head.offsetHeight;
    console.log('bl_head_h: ', bl_head_h);    

    let edit_body_h = 
      window_h 
    - ecl_edit_head.offsetHeight 
    ;
    // console.log('edit_body_h: ', edit_body_h);    
    // ecl_edit_body.style.height = edit_body_h + 'px';//comento para no duplicar

    let bl_body_h = 
      edit_body_h 
    - ecl_bl_head.offsetHeight
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor 
    ;
    console.log('bl_body_h: ', bl_body_h);    
    ecl_bl_body.style.height = bl_body_h + 'px';//comento para no duplicat

    let block_lista_head_h = eid_block_lista.querySelector('#block_lista_head').offsetHeight;
    console.log('block_lista_head_h: ', block_lista_head_h);  
    

    //=========================================================================================//
    //bl_parte_l
    //=========================================================================================//    
    let parte_fija_l_h = eid_block_lista.querySelector('.bl_parte_l .parte_fija').offsetHeight;
    console.log('parte_fija_l_h: ', parte_fija_l_h);

    let parte_variable_l_h = 
      bl_body_h //858
    - block_lista_head_h //43
    - parte_fija_l_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_l_h: ', parte_variable_l_h);    
    eid_block_lista.querySelector('.bl_parte_l .parte_variable').style.height = parte_variable_l_h + 'px';//comento para no duplicat


    let titulo_tabla_lista_h = eid_block_lista.querySelector('#titulo_tabla_lista').offsetHeight;
    let d_filter_results_h = eid_block_lista.querySelector('#d_filter_results_lista').offsetHeight;
    let wr_tabla_paddings = parseInt(wr_tabla_computedStyle.paddingTop) + parseInt(wr_tabla_computedStyle.paddingBottom);//10 * 2;

    let wr_tabla_inner_h = 
      parte_variable_l_h //645
    - titulo_tabla_lista_h //38
    - d_filter_results_h //0
    - wr_tabla_paddings //20
    ;
    console.log('wr_tabla_inner_h: ', wr_tabla_inner_h); 

    //pongo max-height para que scroll esté arriba si hay pocos registros 
    eid_block_lista.querySelector('.bl_parte_l .wr_tabla_inner').style.maxHeight = wr_tabla_inner_h + 'px';//'max-height', no 'height'

    
    //=========================================================================================//
    //bl_parte_r
    //=========================================================================================//
    let parte_fija_r_h = eid_block_lista.querySelector('.bl_parte_r .parte_fija').offsetHeight;
    console.log('parte_fija_r_h: ', parte_fija_r_h);

    let parte_variable_r_h = 
      bl_body_h //858
    - block_lista_head_h //43
    - parte_fija_r_h //150
    - inner_margins //margin-top y margin-bottom de '.inner' contenedor
    ;
    console.log('parte_variable_r_h: ', parte_variable_r_h);    
    eid_block_lista.querySelector('.bl_parte_r .parte_variable').style.height = parte_variable_r_h + 'px';//comento para no duplicat

    console.log('=== end func ===');
}


function mySizeIframe(contenedorDimenciones){
    console.log('=== function mySizeIframe() ===');

    const miIframe = document.getElementById('miIframe');
    if(!miIframe){
        console.log('no hay miIframe. return...');
        return;
    }

    //ajusto tamaño del iframe al contenedor
    miIframe.style.width = contenedorDimenciones.offsetWidth + 'px';
    miIframe.style.height = contenedorDimenciones.offsetHeight + 'px';
}



function checkAllCboxes(id_contenedor){
    console.log('=== function checkAllCboxes() ===');
    const contenedor = document.getElementById(id_contenedor);
    if(!contenedor) return;

    cboxesAll = contenedor.querySelectorAll('input[type="checkbox"]');
    cboxesAll.forEach(cbox => {
        cbox.checked = true;
        handleCheckbox(cbox);
    });
}

function uncheckAllCboxes(id_contenedor){
    console.log('=== function uncheckAllCboxes() ===');
    const contenedor = document.getElementById(id_contenedor);
    if(!contenedor) return;

    cboxesAll = contenedor.querySelectorAll('input[type="checkbox"]');
    cboxesAll.forEach(cbox => {
        cbox.checked = false;
        handleCheckbox(cbox);
    });
}

function handleCheckbox(cbox){//cbox es element
    if(!cbox) return;

    //const cbox = e.currentTarget.querySelector('input[type="checkbox"]');
    const int_val = Number(cbox.value);

    if(cbox.checked){
        if(!arr_songbooks.includes(int_val)){
            arr_songbooks.push(int_val);
        }
    }else{
        const index = arr_songbooks.indexOf(int_val);
        if (index !== -1) {
            arr_songbooks.splice(index, 1); // Elimina 1 elemento en esa posición
        }
    }
    check_arr_songbooks();
}
















// function check_sidebarShow(){//solo pinto el botón
//     //console.log('=== function check_sidebarShow() ===');
//     //console.log('sidebarShow: ', sidebarShow);

//     if(sidebarShow){
//         //console.log('sidebarShow == true. marco como activo');
//         mostrar_sidebar();
//     }else{
//         //console.log('sidebarShow == false. marco como INactivo');        
//         ocultar_sidebar();
//     }
// }



function hideShowPanel(id_contenedor, panelSideParam, esquema_vklad = null){ 
    console.log('=== function hideShowPanel()===');

    const contenedor = document.getElementById(id_contenedor);//'block_buscar', 'block_esquema'
    if(!contenedor) return;

    let btnSideElement;//'.dbtn_panel_l' o '.dbtn_panel_r'
    let panelSideElement;//'.bl_parte_l' o '.bl_parte_r'
    
    if(id_contenedor == 'block_esquema' && esquema_vklad){
        switch (esquema_vklad) {
            default:
            case 'ver_esquema':
                btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .vklad_ver_esquema .dbtn_panel_${panelSideParam}`);
                panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .vklad_ver_esquema .bl_parte_${panelSideParam}`);
                break;
                
            case 'crear_esquema':
                btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .vklad_crear_esquema .dbtn_panel_${panelSideParam}`);
                panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .vklad_crear_esquema .bl_parte_${panelSideParam}`);
                break;
                
            case 'select_slide':
                btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .vklad_select_slide .dbtn_panel_${panelSideParam}`);
                panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .vklad_select_slide .bl_parte_${panelSideParam}`);
                break;        
        }
    }else{
        btnSideElement = contenedor.querySelector(`#${id_contenedor}_head .dbtn_panel_${panelSideParam}`);//'#block_buscar_head .dbtn_panel_l'
        panelSideElement = contenedor.querySelector(`#${id_contenedor}_body .bl_parte_${panelSideParam}`);//'#block_buscar_body .bl_parte_l'
    }
    
    if(!btnSideElement || !panelSideElement){
        alert('no existe btnSideElement o panelSideElement');
        return;
    } 

    let partesAll = contenedor.querySelectorAll('.partes');
    let count_partes_visibles = 0;
    partesAll.forEach(parte => {
        if(esElementoVisible(parte)){
            count_partes_visibles++;
        }
    });


    let disp = panelSideElement.style.display;
    if(disp != 'none' || panelSideElement.offsetWidth > 0 ){//si se ve y hay mas de 1 parte visible
        if(count_partes_visibles > 1){
            //alert('se ve y hay mas de 1 parte visible. lo oculto');
            ocultar_panel(btnSideElement, panelSideElement);
        }else{
            //alert('se ve PERO hay SOLO 1 parte visible. no hago nada...');

            const aviso_outer = document.createElement('div');
            aviso_outer.className = 'aviso_outer';
            aviso_outer.innerHTML = `
                <p class="p_aviso">No se puede ocultar la uníca parte visible. Debe ser vista al menos una.</p>
            `;
            openModal('center','Aviso Ocultar Partes',aviso_outer,'showAviso2');
            return; // <- se detiene aquí si no hay id_lista
        }
    }else{// si no se ve
        mostrar_panel(btnSideElement, panelSideElement);
    }
}

function mostrar_panel(btnSideElement, panelSideElement){
    console.log('=== function mostrar_panel() ===');

    //estado -> ocultado
    panelSideElement.style.display = 'block';
    btnSideElement.classList.remove('inactive');
    btnSideElement.classList.add('active');

    //sidebarShow = true;
    //mySizeWindow();

    // localStorage.setItem('sidebarShow', sidebarShow);
    // obj_ajustes.sidebarShow = sidebarShow;
    // update_obj_ajustes();
}

function ocultar_panel(btnSideElement, panelSideElement){
    console.log('=== function ocultar_panel() ===');
    
    //estado -> ocultado
    panelSideElement.style.display = 'none';
    btnSideElement.classList.remove('active');
    btnSideElement.classList.add('inactive');

    //sidebarShow = false;
    //mySizeWindow();

    //localStorage.setItem('sidebarShow', sidebarShow);
    //obj_ajustes.sidebarShow = sidebarShow;
    //update_obj_ajustes();
}











function ajustarAnchoMaximo(selectorElemento) {
    const bloques = document.querySelectorAll(selectorElemento);//'.tema_black fieldset'
    let maxWidth = 0;

    // resetear antes de medir
    bloques.forEach(b => b.style.width = "auto");

    bloques.forEach(b => {
        if (b.offsetWidth > maxWidth) maxWidth = b.offsetWidth;
    });

    bloques.forEach(b => b.style.width = maxWidth + "px");
}
//ejemplos de uso:
// ajustarAnchoMaximo('.tema_black fieldset');
// ajustarAnchoMaximo('.tema_white fieldset');


function resetAnchoMaximo(selectorElemento) {
    const bloques = document.querySelectorAll(selectorElemento);//'.tema_black fieldset'

    // resetear antes de medir
    bloques.forEach(b => b.removeAttribute('style'));
}


function copyTextFromVista(selectorFieldset){
    console.log('=== function copyTextFromVista() ==='); 

    let text = ''; 

    const fieldsetAll = document.querySelectorAll(selectorFieldset);//'.tema_white fieldset', '.tema_black fieldset'

    fieldsetAll.forEach(f => { 
        Array.from(f.children).forEach(line => { 
            //console.log('line: ', line);

            if(line.tagName === 'LEGEND'){
                if(text == ''){//si es la primera vez
                    text += line.innerText;
                }else{
                    text += '\n\n\n\n' + line.innerText; 
                }                
            }else if(line.tagName === 'P'){
                text += '\n' + line.innerText; 
            }else{
                return;//continue
            }
        });
        //console.log('text: ', text); 
    });

    console.log('abajo --- todo text: '); 
    console.log(text);

    copyTextToClibboard(text);
}
//ejemplo de uso:
//copyTextFromVista('.tema_black fieldset');


async function copyTextToClibboard(text = null) {  
    if(text != null){
        
        // Verifica si la API de portapapeles está disponible
        if(navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    //console.log('[copyTextToClibboard()] --- [navigator.clipboard] --- Texto copiado al portapapeles con éxito');
                    //console.log('El texto copiado: \n', text);
                    showToast('ok', 'Texto copiado al portapapeles', 2000);
                })
                .catch(error => {
                    console.error('[copyTextToClibboard()] --- Error al copiar el texto al portapapeles:', error);
                    showToast('error', 'Error al copiar el texto', 3000);
                });
        } else {
            //console.log('[copyTextToClibboard()] --- La API de portapapeles no está disponible en este navegador. Intento copiar con document.execCommand(copy)');

            const areaTexto = document.createElement('textarea');
            areaTexto.style.position = 'fixed';
            areaTexto.style.top = '-9999px';
            areaTexto.style.left = '-9999px';
            document.body.appendChild(areaTexto);
            areaTexto.value = text;
            areaTexto.select();
            document.execCommand('copy');
            document.body.removeChild(areaTexto);
            //console.log('[copyTextToClibboard] --- El texto copiado: \n', text);
            showToast('ok', '(areaTexto.) Texto copiado al portapapeles', 2000);
        }

    }else{
        console.error('[copyTextToClibboard()] --- El texto no se ha copiado porque no está seleccionado.');
        showToast('error', 'El texto no se ha copiado porque no está seleccionado.', 3000);
    }    
}


function copiarConFormato(selectorContenedor) {
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'

    const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.querySelectorAll('fieldset').forEach( (f,i) => {
        if(i > 0){
            f.outerHTML = '<br><br>' + f.outerHTML;
        }
    });

    contenedor.querySelectorAll('p').forEach(p => {
        p.innerHTML = reemplazarEspacios(p.innerText);
    });

    // Crear un rango que abarque el contenido
    const rango = document.createRange();
    rango.selectNode(contenedor);

    // Limpiar selección previa
    const seleccion = window.getSelection();
    seleccion.removeAllRanges();
    seleccion.addRange(rango);

    // Ejecutar el comando copiar (copia con formato)
    document.execCommand("copy");

    // Limpiar selección
    seleccion.removeAllRanges();

    alert("Contenido copiado con formato ✅");

    contenedor.replaceWith(clone);//reemplazo con el contenido original
}

function copiarSinAcordesConFormato(selectorContenedor) {
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'

    const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.querySelectorAll('fieldset').forEach( (f,i) => {
        if(i > 0){
            f.outerHTML = '<br><br>' + f.outerHTML;
        }
    });

    contenedor.querySelectorAll('p').forEach(p => {
        if(!p.classList.contains('t')){//si no es texto, lo elimino
            p.remove();//elimino las líneas de acordes
            return;
        }
        //p.innerHTML = reemplazarEspacios(p.innerText);
    });

    let resultado = Array.from(contenedor.querySelectorAll('p')).filter(p => {
        if(p.classList.contains('t')){
            return true;
        }
    });
    
    console.log('resultado: ', resultado);

    // Crear un rango que abarque el contenido
    const rango = document.createRange();
    rango.selectNode(contenedor);

    // Limpiar selección previa
    const seleccion = window.getSelection();
    seleccion.removeAllRanges();
    seleccion.addRange(rango);

    // Ejecutar el comando copiar (copia con formato)
    document.execCommand("copy");

    // Limpiar selección
    seleccion.removeAllRanges();

    alert("Contenido copiado con formato ✅");

    contenedor.replaceWith(clone);//reemplazo con el contenido original
}

function ocultarAcordes(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('mostrar_acordes');
    contenedor.classList.add('ocultar_acordes');
}

function mostrarAcordes(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('ocultar_acordes');
    contenedor.classList.add('mostrar_acordes');
}



function ocultarTexto(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('mostrar_texto');
    contenedor.classList.add('ocultar_texto');
}

function mostrarTexto(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('ocultar_texto');
    contenedor.classList.add('mostrar_texto');
}



function aplicarContenidoWidth(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('contenido_width_off');
    contenedor.classList.add('contenido_width_on');
}

function quitarContenidoWidth(selectorContenedor){//'#tema_block'
    const contenedor = document.querySelector(selectorContenedor);//'.tema_white', '.tema_black'
    //const clone = contenedor.cloneNode(true);//clono para luego insertar el contenido original

    contenedor.classList.remove('contenido_width_on');
    contenedor.classList.add('contenido_width_off');
}




function reemplazarEspacios(texto) {
    return texto.replace(/ /g, '&nbsp;');
}

function pantallaCompleta(selectorElement) {
    const element = document.querySelector(selectorElement);

    // const dbtn_fullscreen = document.createElement('div');
    // dbtn_fullscreen.className = 'dbtn_fullscreen';
    // dbtn_fullscreen.innerHTML = `
    //     <img src="/song/images/fullscreen_adentro.png">
    // `;
    // dbtn_fullscreen.onclick = (e)=> {
    //     e.stopPropagation();
    //     salirPantallaCompleta();
    // }

    element.prepend(dbtn_fullscreen);

    if (element.requestFullscreen) {
        element.requestFullscreen();
    } 
    else if (element.webkitRequestFullscreen) { // Safari
        element.webkitRequestFullscreen();
    } 
    else if (element.msRequestFullscreen) { // IE/Edge antiguo
        element.msRequestFullscreen();
    }
}

function salirPantallaCompleta() {
    document.querySelector('.dbtn_fullscreen')?.remove();
    
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

let btnFullscreenActive = null;

function toggleFullscreen(selectorElementContenedor, btnElement) {
    //const element = document.body;
    const contenedor = document.querySelector(selectorElementContenedor);
    //const btn_fullscreen = document.querySelector(selectorElementBtn);

    btnFullscreenActive = btnElement;
    console.log('ttt. btnFullscreenActive: ', btnFullscreenActive);

    if (!document.fullscreenElement) {//si no hay ningún elemento en pantalla completa, entro en pantalla completa
        
        // Entrar en pantalla completa
        if (contenedor.requestFullscreen) {
            contenedor.requestFullscreen();
        } 
        else if (contenedor.webkitRequestFullscreen) { // Safari
            contenedor.webkitRequestFullscreen();
        } 
        else if (contenedor.msRequestFullscreen) { // IE/Edge
            contenedor.msRequestFullscreen();
        }
        is_fullscreen = true;
        //btnElement.querySelector('img').src = './images/fullscreen_adentro.png';//sig. action es minimizar

    } else {//algun elemento está en pantalla completa, salgo de pantalla completa
        
        // Salir del modo pantalla completa
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } 
        else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } 
        else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        is_fullscreen = false;
        //btnElement.querySelector('img').src = './images/fullscreen.png';//sig. action es agrandar

    }

    refreshSwipeLayout();

    // NO HACE FALTA: pintBtnFullscreen();    
    console.log('toggle(Fullscreen) --- is_fullscreen: ', is_fullscreen);
}

function pintBtnFullscreen(btnElement) {
    console.log('=== function pintBtnFullscreen() ===');
    console.log('pintBtnFullscreen --- is_fullscreen: ', is_fullscreen);

    //si existe boton de fullscreen en wr_vista_blocks
    if(btnElement){
        if(is_fullscreen){
            btnElement.querySelector('img').src = 'images/fullscreen_adentro.png';
            //sig. action -> minimizar
        }else{
            btnElement.querySelector('img').src = 'images/fullscreen.png';
            //sig. action -> agrandar
        }
    }
}

function pintFlechasFullscreen(divElement) {
    console.log('=== function pintFlechasFullscreen() ===');
    console.log('pintFlechasFullscreen --- is_fullscreen: ', is_fullscreen);

    //si existe div element de fullscreen en vista_fixed
    if(divElement){
        if(is_fullscreen){
            divElement.querySelector('img').src = 'images/icon_size_min.svg';
            //sig. action -> minimizar
        }else{
            divElement.querySelector('img').src = 'images/icon_size_max.svg';
            //sig. action -> agrandar
        }
    }
}


function cambiarTema(selectorElement) {// '.block_cancion .bloques_outer'
    const elem = document.querySelector(selectorElement);

    if (elem.classList.contains("tema_black")) {
        elem.classList.replace("tema_black", "tema_white");
    } else if (elem.classList.contains("tema_white")) {
        elem.classList.replace("tema_white", "tema_black");
    } else {
        // Si no tiene ninguna de las dos, asignamos un valor por defecto
        elem.classList.add("tema_black");
    }
}
//cambiarTema('#tema_block');





   

function addMonospaceFont() {
    ecl_bl_body.classList.add('monospace_font');
    slideContainer.classList.add('monospace_font'); 
}

function removeMonospaceFont() {
    ecl_bl_body.classList.remove('monospace_font');
    slideContainer.classList.remove('monospace_font');   
}


/*
    funciones para manejar una pestaña LOCAL con pantalla
    referencia es:
    - pestaña o ventana  'miPantallaLocal' con nombre_referencia 'miPantallaLocal'
*/
function old_abrirReferencia(referencia) {
    console.log('=== function abrirReferencia() ===');
    
    let nombre_referencia = '';
    
    // Verificar si ya está abierta
    if (referencia && !referencia.closed) {
        console.log(`La ${referencia} ya está abierta`);
        referencia.focus(); // Llevar al frente
        return referencia;
    }

    // Abrir y guardar la referencia en la variable
    switch (referencia) {
        //LOCAL
        case miPantallaLocal:
            nombre_referencia = 'miPantallaLocal';
            referencia = window.open('pantalla.php', nombre_referencia);
            miPantallaLocal = referencia;// Actualizar la variable global
            break;

        //LOCAL 2
        case miPantallaLocal2:
            nombre_referencia = 'miPantallaLocal2';
            referencia = window.open('pantalla.php', nombre_referencia);
            miPantallaLocal2 = referencia;// Actualizar la variable global
            break;

        //REMOTO
        //ruta_screen_pantalla: 'http://show-screen.local/' en localhost
        //ruta_screen_pantalla: 'https://show-screen.com/' en prod 
        case miPantallaRemota:
            nombre_referencia = 'miPantallaRemota';
            referencia = window.open(ruta_screen_pantalla, nombre_referencia);
            miPantallaRemota = referencia;// Actualizar la variable global
            break;
    
        default:
            break;
    }
    
    console.log(`${nombre_referencia} abierta. referencia: `, referencia);

    eid_videoFondo_body.load();
    return referencia;
}
function old_recargarReferencia(referencia) {
    // Usar la variable que contiene la referencia
    if (referencia && !referencia.closed) {
        referencia.location.reload();
        referencia.focus();
    } else {
        console.log('La referencia está cerrada o no existe');
    }
}
function old_enfocarReferencia(referencia) {
    // Usar la variable que contiene la referencia
    if (referencia && !referencia.closed) {
        referencia.focus();
    } else {
        console.log('La referencia está cerrada o no existe');
    }
}
function old_cerrarReferencia(referencia) {
    if (referencia && !referencia.closed) {
        referencia.close();
    }
    referencia = null; // Limpiar la referencia
}
function old_enfocarReferenciaOCrear(referencia){  
    console.log('=== function enfocarReferenciaOCrear() ===');

    if (referencia && !referencia.closed) {
        referencia.focus();
    } else {
        abrirReferencia(referencia);
    }
}
function old_recargarReferenciaOCrear(referencia){
    console.log('=== function recargarReferenciaOCrear() ===');

    if (referencia && !referencia.closed) {
        recargarReferencia(referencia);
        eid_videoFondo_body.load();
    } else {
        abrirReferencia(referencia);
    }
}


//=============================================//
// start - Nuevas funciones de pantalla
//=============================================//
function abrirReferencia(url, nombre_referencia){
    console.log('=== function abrirReferencia() ===');

    const referencia = window.open(url, nombre_referencia);
    
    if(!referencia){
        console.warn('No se pudo abrir la ventana.');
        return null;
    }

    if(referencia){
        eid_videoFondo_body.load();
        referencia.focus();
        console.log(`${nombre_referencia} abierta.`, referencia);
    }

    return referencia;
}


function abrirPantalla(numero){
    console.log('=== function abrirPantalla() ===');
    
    let indice;

    switch(numero){
        case 1:
            indice = INDICE_PANTALLA_1;
            break;

        case 2:
            indice = INDICE_PANTALLA_2;
            break;

        case 3:
            indice = INDICE_PANTALLA_3;
            break;

        default:
            console.warn('Número de pantalla no válido:', numero);
            return;
    }

    // Limpio referencias cerradas
    limpiarReferenciasCerradas();

    // Si esa pantalla ya existe, la enfoco
    const referenciaExistente = arr_misPantallas[indice];

    if(referenciaExistente && !referenciaExistente.closed){
        referenciaExistente.focus();
        return;
    }

    let str_get_param = '';
    if(numero == 1){//pantalla escena
        //t = parametro get, 
        //'z' - //mostrar el slide en el center con: justify-content: center 
        //'y' - //mostrar el timer 
        //'w' - //mostrar el tiempo restante 
        //'h' - //mostrar la hora actiual 
        str_get_param = '?t=zwh';
    }
    if(numero == 2){
        //t = parametro get, 
        //'z' - //mostrar el slide en el center con: justify-content: center 
        //'y' - //mostrar el timer 
        //'w' - //mostrar el tiempo restante 
        //'h' - //mostrar la hora actiual 
        str_get_param = '?t=zywh';
    }

    const referencia = abrirReferencia(
        `pantalla.php${str_get_param}`,
        `PantallaLocal${numero}`
    );

    if(referencia){
        arr_misPantallas[indice] = referencia;

        // Solo ahora empieza a actualizar el display de Holy Songs
        iniciarRenderTimerHoly();
    }
}

function abrirVentanaBiblia(){
    console.log('=== function abrirVentanaBiblia() ===');

    // Si Bible Text ya está abierto, enfocarlo
    if(miVentanaBiblia && !miVentanaBiblia.closed){
        miVentanaBiblia.focus();
        return;
    }

    let url_bible_text = (esProduccion) 
        ? 'https://bible-text.com/bible' //prod
        : 'http://bible-text.local/bible' ;//local

    miVentanaBiblia = window.open(
        url_bible_text,
        'BibleTextControl'
    );

    if(!miVentanaBiblia){
        console.warn('El navegador bloqueó la apertura de Bible Text.');
    }
}

function enfocarReferencia(numero){

    const indice = numero - 1;

    if(indice < 0){
        return;
    }

    limpiarReferenciasCerradas();

    let referencia = arr_misPantallas[indice];

    // Si no existe o está cerrada, la creo
    if(!referencia || referencia.closed){

        referencia = abrirReferencia(
            'pantalla.php',
            `PantallaLocal${numero}`
        );

        if(referencia){
            arr_misPantallas[indice] = referencia;
        }

        return;
    }

    referencia.focus();
}


function recargarReferencia(numero){

    const indice = numero - 1;
    if(indice < 0){
        return;
    }

    limpiarReferenciasCerradas();

    let referencia = arr_misPantallas[indice];

    //si no existe o está cerrada, la creo
    if(!referencia || referencia.closed){
        console.log('La referencia está cerrada o no existe. la creo...');

        referencia = abrirReferencia(
            'pantalla.php',
            `PantallaLocal${numero}`
        );

        if(referencia){
            arr_misPantallas[indice] = referencia;
        }

        return;
    }

    //si ya existe, la recargo y enfoco
    referencia.location.reload();
    referencia.focus();
}


function cerrarReferencia(numero){

    const indice = numero - 1;
    if(indice < 0){
        return;
    }

    const referencia = arr_misPantallas[indice];

    if(referencia && !referencia.closed){
        referencia.close();
    }

    arr_misPantallas[indice] = null;

    limpiarReferenciasCerradas();
}


function enfocarMisReferenciasOCrear(){
    console.log('=== function enfocarMisReferenciasOCrear() ===');

    // Elimino referencias cerradas
    limpiarReferenciasCerradas();

    const hayPantallasAbiertas = arr_misPantallas.some(
        referencia => referencia && !referencia.closed
    );

    if(!hayPantallasAbiertas){// Si no hay ninguna abierta, creo una
        abrirPantalla(1);
    }else{//si ya hay. // Enfoco todas las abiertas
        arr_misPantallas.forEach(referencia => {
            if(referencia && !referencia.closed){
                referencia.focus();
            }
        });
    }

}


function recargarMisReferenciasOCrear(){
    console.log('=== function recargarMisReferenciasOCrear() ===');

    // Elimino referencias cerradas
    limpiarReferenciasCerradas();

    const hayPantallasAbiertas = arr_misPantallas.some(
        referencia => referencia && !referencia.closed
    );

    if(!hayPantallasAbiertas){// Si no hay ninguna abierta, creo una
        abrirPantalla(1);
    }else{//si ya hay. // Enfoco todas las abiertas
        arr_misPantallas.forEach(referencia => {
            if(referencia && !referencia.closed){
                referencia.location.reload();
                referencia.focus();
                eid_videoFondo_body.load();
            }
        });
    }

}

function recargarPantallasAbiertas(){
    console.log('=== function recargarPantallasAbiertas() ===');

    limpiarReferenciasCerradas();

    arr_misPantallas.forEach(referencia => {

        if(!referencia || referencia.closed){
            return;
        }

        referencia.location.reload();
        referencia.focus();
        eid_videoFondo_body.load();
    });

}


function limpiarReferenciasCerradas(){

    arr_misPantallas = arr_misPantallas.map(ref => {
        return (ref && !ref.closed)
            ? ref
            : null;
    });

    const hayPantallasAbiertas = arr_misPantallas.some(
        ref => ref && !ref.closed
    );

    if(!hayPantallasAbiertas){
        pararRenderTimerHoly();
    }
}

//=============================================//
// end - Nuevas funciones de pantalla
//=============================================//


/*
// no se usa. dejo como ejemplo...
function fullscreenReferenciaOCrear(referencia){
    console.log('=== function fullscreenReferenciaOCrear() ===');

    if (referencia && !referencia.closed) {
        enviarAccionPantalla('fullscreen');
        referencia.focus();
    } else {
        referencia = abrirReferencia(referencia);
        // Esperar a que cargue la nueva ventana
        referencia.addEventListener('load', () => {
            enviarAccionPantalla('fullscreen');
        }, { once: true });
    }
}
*/




function makeColumns(num){
    if(num > 4 || num < 1) return;
    
    currentNumColumns = num;//actualizo variable global para luego mostrar en el toast
    eid_block_cancion.querySelector('.contenedor').style.columnCount = currentNumColumns;
    
    showToast('info', `Columnas: ${currentNumColumns}`, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}

function aplicarFontSize(val){
    if(!val) return;

    currentFontSize = Number(val);//actualizo variable global para luego mostrar en el toast

    eid_block_cancion.querySelector('.vista_fixed .contenedor').style.fontSize = currentFontSize + 'px';
    
    showToast('info', `Fuente aplicado: ${currentFontSize}px`, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    //setTimeout(()=>{
        refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
    //},10);
}

function aplicarNumColumns(val){
    if(!val) return;

    makeColumns(val);
    
    showToast('info', `Numero columnas aplicado: ${val}`, 2000, 'bottom', false,'', document.querySelector('.vista_fixed_body'));

    //setTimeout(()=>{
        refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
    //},10);
}

function aplicarAcordesVisible(val){
    
    acordesVisible = !val;//hago esto para luego aplicar toggleAcordes
    toggleAcordes();//hace siguiente accion -> ocultar o mostrar acordes
}

function aplicarTextoVisible(val){
    
    textoVisible = !val;//hago esto para luego aplicar toggleAcordes
    toggleTexto();//hace siguiente accion -> ocultar o mostrar acordes
}

function aplicarContenidoWidthBd(val){
    
    contenidoWidth = !val;//hago esto para luego aplicar toggleAcordes
    toggleContenidoWidth();//hace siguiente accion -> ocultar o mostrar acordes
}


function changeFontSize(step) {
    step = parseInt(step, 10);

    const elementSelectors = `
        /*#cancion_song_bloques, #block_cancion, .wr_vista_blocks .contenedor,*/ .vista_fixed .contenedor
    `;

    let curFont_show = '';

    const elementsAll = document.querySelectorAll(elementSelectors);
    elementsAll.forEach(el => {
        console.log('el: ', el);
        if(step == 0){
            currentFontSize = fontSizeDef;
            curFont_show = currentFontSize + 'px';
            el.style.fontSize = curFont_show;//vuelvo al tamaño original quitando el style
        }else{
            currentFontSize = (currentFontSize + step);
            curFont_show = currentFontSize + 'px';
            el.style.fontSize = curFont_show;
        }
        //console.log('fin el: ', el);
    });

    showToast('info', `Fuente: ${curFont_show}`, 2000, 'bottom', false, '', document.querySelector('.vista_fixed_body'));

    refreshSwipeLayout();//refresco los bloques si de opacidad con gragSong => true
}


function contarLineasVisuales(elemento) {
    const estilos = window.getComputedStyle(elemento);

    let lineHeight = estilos.lineHeight;

    // Si line-height es "normal", lo estimamos
    if (lineHeight === "normal") {
        lineHeight = parseFloat(estilos.fontSize) * 1.2;
    } else {
        lineHeight = parseFloat(lineHeight);
    }

    const altura = elemento.getBoundingClientRect().height;

    return Math.round(altura / lineHeight);
}

function contarLineasReales(elemento) {
    const range = document.createRange();
    range.selectNodeContents(elemento);

    const rects = Array.from(range.getClientRects())
        .filter(r => r.height > 0); // ignorar rects raros

    const tops = rects
        .map(r => r.top)
        .sort((a, b) => a - b);

    const tolerancia = 2; // píxeles (clave)
    const lineas = [];

    tops.forEach(top => {
        const existe = lineas.some(t => Math.abs(t - top) < tolerancia);
        if (!existe) {
            lineas.push(top);
        }
    });

    return lineas.length;
}


function getDeviceData(){

    const min = Math.min(screen.width, screen.height);
    const max = Math.max(screen.width, screen.height);

    const deviceResolution = `${min}x${max}`;//425x900

    const orientation =
        window.innerWidth > window.innerHeight
        ? 'landscape'
        : 'portrait';

    return {
        deviceResolution,
        orientation
    };
}


function manejarLogin(){
    console.log('=== function manejarLogin() ===');

    if(hay_usuario_logueado){
        let aviso_html = `
            <h3>Bienvenido de nuevo, ${username}!</h3>
            <p>${email}</p>
            <p>Puedes crear canciones, listas y  guardar tus ajustes personales.</p>
            <div class="wr_btns_vertical">
                <button class="btn" onclick="window.location.href = '/home';">Inicio</button>            
                <button class="btn" onclick="window.location.href = '/login';">Login</button>            
                <button class="btn" onclick="window.location.href = '/logout';">Cerrar sesión</button>            
            </div>
        `;

        showToast('ok', aviso_html, 1000, 'center', true, 'Sesión iniciada correctamente.');
        return;
    }else{
        //alert('no hay_usuario_logueado');
        window.location.href = '/login';//redirecciono a login para que se loguee y luego vuelva a la pantalla
    }
}



function aplicarSongAjustes(){
    console.log('=== function aplicarSongAjustes() ===');

    const {
        deviceResolution,
        orientation
    } = getDeviceData();

    if(esObjeto(objSong) && Object.keys(objSong).length === 0){
        console.log('objSong es vacio, hago return...');
        return;
    }

    const song_ajustes = objSong.ajustes[orientation];
    console.log('song_ajustes: ', song_ajustes);

    if(!objSong.ajustes){
        console.log('no hay objSong.ajustes, hago return...');
        return;
    }
    
    if(song_ajustes){//portrait o landscape

        //permitirShowToast = false;//para no mostrar toast al aplicar cada ajuste

        //font_size
        if(song_ajustes.font_size){
            console.log('hay font_size en song_ajustes, la aplico al cargar el form...');
            aplicarFontSize(song_ajustes.font_size);
        }else{
            console.log('no hay font_size en song_ajustes, aplico valor por defecto...');
            aplicarFontSize(fontSizeDef);
        }

        //num_columns
        if(song_ajustes.num_columns){
            console.log('hay num_columns en song_ajustes, la aplico al cargar el form...');
            aplicarNumColumns(song_ajustes.num_columns);
        }else{
            console.log('no hay num_columns en song_ajustes, aplico valor por defecto...');
            aplicarNumColumns(numColumnsDef);//1
        }

        //acordes_visible
        if(song_ajustes.acordes_visible != null){//1 //true
            if(Number(song_ajustes.acordes_visible)){
                console.log('hay acordes_visible en song_ajustes y es 1, la aplico al cargar el form...');
                aplicarAcordesVisible(true);
            }else{
                console.log('hay acordes_visible en song_ajustes y es 0, la aplico al cargar el form...');
                aplicarAcordesVisible(false);
            }
        }else{
            console.log('no hay acordes_visible en song_ajustes, aplico valor por defecto...');
            aplicarAcordesVisible(acordesVisibleDef);//true
        }

        //texto_visible
        if(song_ajustes.texto_visible != null){
            if(Number(song_ajustes.texto_visible)){
                console.log('hay texto_visible en song_ajustes y es 1, la aplico al cargar el form...');
                aplicarTextoVisible(true);
            }else{
                console.log('hay texto_visible en song_ajustes y es 0, la aplico al cargar el form...');
                aplicarTextoVisible(false);
            }
        }else{
            console.log('no hay texto_visible en song_ajustes, aplico valor por defecto...');
            aplicarTextoVisible(textoVisibleDef);//true
        }

        //contenido_width
        if(song_ajustes.contenido_width != null){
            if(Number(song_ajustes.contenido_width)){
                console.log('hay texto_visible en song_ajustes y es 1, la aplico al cargar el form...');
                aplicarContenidoWidthBd(true);
            }else{
                console.log('hay texto_visible en song_ajustes y es 0, la aplico al cargar el form...');
                aplicarContenidoWidthBd(false);
            }
        }else{
            console.log('no hay texto_visible en song_ajustes, aplico valor por defecto...');
            aplicarContenidoWidthBd(contenidoWidthDef);//false
        }

        setTimeout(()=>{
            permitirShowToast = true;//para mostrar toast 
            //para que no se muestre el ultimo mensaje por showToast(), muestro algo generico
            showToast('info', 'Ajustes personalizados aplicados correctamente.', 2000, 'bottom', false, '', document.querySelector('.vista_fixed_body'));
        },10);

    }

}



function aplicarUsersAjustes(){
    console.log('=== function aplicarUsersAjustes() ===');

    if(esObjeto(objSong) && Object.keys(objSong).length === 0){
        console.log('objSong es vacio, hago return...');
        return;
    }

    const ajustes_pers = Number(objSong.ajustes_pers);
    console.log('ajustes_pers: ', ajustes_pers);

    if(!ajustes_pers){
        console.log('no hay objSong.ajustes_pers, hago return...');
        return;
    }
    
    if(ajustes_pers){//hay datos de ajustes personalizados

        //transponer o capo - capodastr
        if(objSong.tune_transpose_pers || objSong.capo_pers){
            console.log('hay tune_transpose_pers o capo_pers en users_ajustes, la aplico al cargar el form...');

            const tune_transpose_pers_val = Number(objSong.tune_transpose_pers);
            const capo_pers_val = Number(objSong.capo_pers);

            const transpose_val_new = getTransposeFromCapo(tune_transpose_pers_val, capo_pers_val);        
            console.log('transpose_val: ', transpose_val_new);

            handleFormTranspose(transpose_val_new);

        }else{
            console.log('no hay tune_transpose_pers o capo_pers en users_ajustes, aplico valor por defecto...');
        }


        setTimeout(()=>{
            permitirShowToast = true;//para mostrar toast 
            //para que no se muestre el ultimo mensaje por showToast(), muestro algo generico
            showToast('info', 'Ajustes personalizados de Usuario aplicados correctamente.', 2000, 'bottom', false, '', document.querySelector('.vista_fixed_body'));
        },10);

    }

}

function getTransposeFromCapo(transpose_val, capo_val){
    console.log('=== function getTransposeFromCapo() ===');

    transpose_val = Number(transpose_val);
    capo_val = Number(capo_val);

    //si no es un numero
    if(isNaN(transpose_val) || isNaN(capo_val) ){
        transpose_val = 0;
        return transpose_val;
    }
    
    const transpose_val_new = transpose_val - capo_val;
    console.log('transpose_val_new: ', transpose_val_new);

    return Number(transpose_val_new);    
}







// Subir MUCHAS imagenes/videos MEDIA
async function subirMedia(){
    console.log(' === function subirMedia() === ');    
    
    if (!selectedFiles.length === 0) {
        alert('Seleccione una o varias imágenes o vídeos.');
        return;
    }

    for(const file of selectedFiles){

        if(file.type.startsWith('image/')){
            if(file.size > MAX_IMAGE_SIZE){
                alert(
                    `"${file.name}" supera los 200 MB permitidos para imágenes. El tamaño total de las imágenes seleccionadas supera el límite permitido de 200 MB. Esto puede deberse a que has seleccionado demasiadas imágenes o a que alguna de ellas tiene un tamaño muy grande. Por favor, reduce la cantidad de imágenes, selecciona imágenes más ligeras o realiza la subida en varias operaciones.`
                );    
                return;
            }
        }
        else if(file.type.startsWith('video/')){
            if(file.size > MAX_VIDEO_SIZE){
                alert(
                    `"${file.name}" supera los 200 MB permitidos para vídeos. El tamaño total de los vídeos seleccionados supera el límite permitido de 200 MB. Esto puede deberse a que has seleccionado demasiados vídeoss o a que alguno de ellos tiene un tamaño muy grande. Por favor, reduce la cantidad de vídeos, selecciona vídeos más ligeros o realiza la subida en varias operaciones.`
                );    
                return;
            }
        }    
    }


    const formData = new FormData();

    selectedFiles.forEach(file => {
        formData.append('media[]', file);
    });


    try {

        const response = await fetch('../song/php/upload_media.php',
            {
                method: 'POST',
                body: formData
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error upload_imagenes.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //desactivo boton y preview
                eid_btnUploadMedia.classList.add('d-none');
                eid_previewContainer.innerHTML = '';//reset
                eid_mediaFileInput.value = '';//reset
                

                await pintMediaSubidos();//pinto todas las imagenes disponibles
                await pintMediaActiveEnFondo();//aplico la imagen de fondo seleccionada

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );   
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en upload_imagen.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en upload_imagen.php',
                { cause: error }
            );
        }       

    }
    catch (error) {
        console.error('subirMedia. error: ',error);
    }

}


// Subir MUCHOS videos Película
async function subirVideo(){
    console.log(' === function subirVideo() === ');    
    
    const file = eid_videoFileInput.files[0];
    const title = eid_videoTitle.value.trim();
    const note = eid_videoNote.value.trim();

    if(!file){
        alert('Seleccione un vídeo.');
        return;
    }

    if(!file.type.startsWith('video/')){
        alert(
            `"${file.name}" no es un vídeo válido.`
        );    
        return;
    }

    if(file.size > MAX_VIDEO_SIZE){
        alert(
            `"${file.name}" con el tamaño ${file.size} supera los 200 MB permitidos. Por favor, reduce el tamaño del fichero.`
        );    
        return;
    }

    if(title === ''){
        alert('Introduzca un título.');
        eid_videoTitle.focus();
        return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('note', note);

    try {

        const response = await fetch('../song/php/upload_video.php',
            {
                method: 'POST',
                body: formData
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error upload_video.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //desactivo boton y preview
                eid_btnUploadVideo.classList.add('d-none');
                eid_previewContainerVideo.innerHTML = '';//reset
                eid_videoFileInput.value = '';//reset
                eid_videoTitle.value = '';//reset
                eid_videoNote.value = '';//reset

                if(data.video.duplicado){
                    showToast(
                        'info',
                        data.video.mensaje,
                        null,
                        'center',
                        true,
                        'Info'
                    );
                    return; 
                }
                
                arr_lista_videos = await make_arr_lista_videos();
                await pintVideoSubidos();//pinto todos los videos disponibles
                pintVideoActiveEnPlayer();
                await pintVideoActiveEnFondo();//aplico el vídeo seleccionado

                showToast(
                    'ok',
                    data.video.mensaje,
                    2000
                );   
                
            } else {

                showToast(
                    'error',
                    data.video.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en upload_video.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en upload_video.php',
                { cause: error }
            );
        }       

    }
    catch (error) {
        console.error('subirVideo. error: ',error);
    }

}

async function pintMediaActiveEnFondo(){
    console.log('=== function pintMediaActiveEnFondo() ===');

    try {
        
        const data = await getMediaActive();
        console.log('2. data:', data);

        if (data.success) {
            
            bg_media_type = data.media.media_type;// o 'image' o 'video'
            console.log('bg_media_type: ', bg_media_type);
            localStorage.setItem('bg_media_type', bg_media_type);

            if(data.media.media_type === 'image'){
                //saco la ruta del fondo
                video_ruta = '';//reset
                bg_ruta = data.media.filepath;
                console.log('bg_ruta: ', bg_ruta);
                localStorage.setItem('bg_ruta', bg_ruta);

                //quitar video
                eid_videoFondo_body.classList.remove('shown');//oculto
                eid_videoFondo_body.src = '';//reset
                
                // Aplicar inmediatamente el fondo
                eid_fondo_body.style.backgroundImage = `url(.${bg_ruta})`;//aki obligatorio
                await guardarEnLocalAndBd('g');//g = guardar fondo
    
                showToast(
                    'ok',
                    'imagen personalizada cargada correctamente',
                    2000
                );

            }
            
            if(data.media.media_type === 'video'){
                //saco la ruta del video
                bg_ruta = '';//reset
                video_ruta = `.${data.media.filepath}`;
                console.log('video_ruta: ', video_ruta);
                localStorage.setItem('video_ruta', video_ruta);

                // Aplicar inmediatamente el video en el fondo
                eid_videoFondo_body.classList.add('shown');//muestro
                eid_videoFondo_body.src = video_ruta;//aki obligatorio

                await guardarEnLocalAndBd('g');//g = guardar fondo

                showToast(
                    'ok',
                    'Fichero media personalizado cargado correctamente',
                    2000
                );
            }
            
            return true;  
            
        } else {

            showToast(
                'error',
                data.error,
                null,
                'center',
                true,
                'Error'
            );
            return false;             

        }

    } catch (error) {
        
        console.error('Error al cargar el fichero de fondo:',error);

        showToast(
            'error',
            `1. Error al cargar el fichero de fondo: ${error}`,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 

}


async function pintVideoActiveEnFondo(){
    console.log('=== function pintVideoActiveEnFondo() ===');

    try {
        
        const data = await getVideoActive();
        console.log('52. data:', data);

        if (data.success) {
            
            //saco la ruta del video
            // bg_ruta = '';//reset
            // video_ruta = `.${data.media.filepath}`;
            // console.log('video_ruta: ', video_ruta);
            // localStorage.setItem('video_ruta', video_ruta);

            // Aplicar inmediatamente el video en el fondo
            // eid_videoFondo_body.classList.add('shown');//muestro
            // eid_videoFondo_body.src = video_ruta;//aki obligatorio

            //await guardarEnLocalAndBd('g');//g = guardar fondo

            showToast(
                'ok',
                'Fichero de vídeo cargado correctamente',
                2000
            );
            return true;  
            
        } else {

            showToast(
                'error',
                data.error,
                null,
                'center',
                true,
                'Error'
            );
            return false;             

        }

    } catch (error) {
        
        console.error('Error al cargar el fichero de vídeo:',error);

        showToast(
            'error',
            `1. Error al cargar el fichero de vídeo: ${error}`,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 

}


async function pintMediaSubidos(){
    console.log('=== function pintMediaSubidos() ===');

    try {

        const data = await getMediaAll();
        console.log('3. data:', data);

        eid_imagenesContainer.innerHTML = '';//reset

        if (data.success) {

            if(data.media.length > 0){

                data.media.forEach(item => {
                    
                    const media_item = document.createElement('div');
                    media_item.className = (item.is_active == 1) ? 'media_item active' : 'media_item' ;
                    media_item.dataset.id_media = item.id_media;
                    media_item.dataset.media_type = item.media_type;

                    if(item.media_type == 'image'){
                        media_item.innerHTML = `
                            <div class="d_delete">
                                <img class="d_delete_img" src="images/delete.png">
                            </div>
                            <img class="media_item_img" src=".${item.filepath}" alt="Imagen de fondo">
                        `;
                    }else if(item.media_type == 'video'){
                        media_item.innerHTML = `
                            <div class="d_delete">
                                <img class="d_delete_img" src="images/delete.png">
                            </div>
                            <video class="media_item_video" src=".${item.filepath}" autoplay muted loop playsinline>
                        `;
                    }
                    media_item.onclick = async (e) => {
                        
                        if(e.target.closest('.d_delete')){
                            await deleteMedia(item.id_media);
                        }else{
                            eid_fondo_body.style.backgroundImage = `url(.${item.filepath})`;//aki obligatorio
                            console.log('item.id_media: ', item.id_media);
    
                            await updateMediaActive(item.id_media);
                        }
                        
                    }
                    //añado al DOM
                    eid_imagenesContainer.append(media_item);
                });

            }else{
                const div = document.createElement('div');
                div.className = 'no_imagen';
                div.innerHTML = `
                    <p>No hay imágenes o vídeos subidos.</p>
                `;
                eid_imagenesContainer.append(div);
            }                  
            
        } else {

            const div = document.createElement('div');
            div.className = 'no_imagen';
            div.innerHTML = `
                <p class="prim">No hay imágenes o vídeos subidos.</p>
            `;
            eid_imagenesContainer.append(div);

            return;             

        }

    } catch (error) {
        
        console.error('Error al cargar media de fondo:',error);

        showToast(
            'error',
            data.error,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 
}


async function pintVideoSubidos(){
    console.log('=== function pintVideoSubidos() ===');

    try {

        const data = await getVideoAll();
        console.log('3. data:', data);

        eid_videosContainer.innerHTML = '';//reset

        if (data.success) {

            if(data.video.length > 0){

                data.video.forEach(item => {
                    
                    const video_item = document.createElement('div');
                    video_item.className = (item.is_active == 1) ? 'video_item active' : 'video_item' ;
                    video_item.dataset.id_video = item.id_video;
                    video_item.dataset.id_media = item.id_media;
                    video_item.dataset.media_type = item.media_type;                    
                    video_item.innerHTML = `
                        <div class="d_delete">
                            <img class="d_delete_img" src="images/delete.png">
                        </div>

                        <video class="video_item_video" src=".${item.filepath}" autoplay muted loop playsinline></video>
                        
                        <div class="video_item_info">
                            <div>${item.id_video}</div>
                            <div>${item.title}</div>
                            <div>${item.note}</div>
                        </div>
                    `;
                    video_item.onclick = async (e) => {
                        
                        if(e.target.closest('.d_delete')){
                            await deleteVideo(item.id_video);
                        }else{
                            //eid_fondo_body.style.backgroundImage = `url(.${item.filepath})`;//aki obligatorio
                            console.log('item.id_video: ', item.id_video);
    
                            await updateVideoActive(item.id_video);
                        }
                        
                    }
                    //añado al DOM
                    eid_videosContainer.append(video_item);
                });

            }else{
                const div = document.createElement('div');
                div.className = 'no_video';
                div.innerHTML = `
                    <p>1. No hay vídeos subidos.</p>
                `;
                eid_videosContainer.append(div);
            }                  
            
        } else {

            const div = document.createElement('div');
            div.className = 'no_video';
            div.innerHTML = `
                <p class="prim">2. No hay vídeos subidos.</p>
            `;
            eid_videosContainer.append(div);

            return;             

        }

    } catch (error) {
        
        console.error('Error al cargar vídeo como película:',error);

        showToast(
            'error',
            data.error,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 
}


async function make_arr_lista_videos(){
    console.log('=== function make_arr_lista_videos() ===');

    try {

        const data = await getVideoAll();
        console.log('3. data:', data);

        eid_videosContainer.innerHTML = '';//reset
        
        if (data.success) {
            
            if(data.video.length > 0){
                
                arr_lista_videos = [];//reset
                
                data.video.forEach((item,i) => {
                    
                    if(item.is_active){
                        index_video_actual = i;
                        console.log('hago index_video_actual el vídeo que en la bd is_active == 1. index_video_actual: ', index_video_actual);
                        
                        id_video = item.id_video;
                        console.log('id_video: ', id_video);
                    }

                    //reasigno valores de bd
                    arr_lista_videos[i] = {
                        id_video: item.id_video,
                        id_media: item.id_media,
                        title: item.title,
                        note: item.note,
                        ruta: '.' + item.filepath,
                        is_active: item.is_active
                    }
                    console.log('arr_lista_videos: ', arr_lista_videos);

                });
                
                //reasigno
                src_video_actual = arr_lista_videos[index_video_actual].ruta;
                console.warn('src_video_actual: ', src_video_actual);

                return arr_lista_videos;

            }else{
                
                showToast(
                    'info',
                    'no hay vídeos subidos para poder crear una lista de reproducción.',
                    null,
                    'center',
                    true,
                    'Info'
                );
            }                  
            
        } else {

            const div = document.createElement('div');
            div.className = 'no_video';
            div.innerHTML = `
                <p class="prim">No hay vídeos subidos.</p>
            `;
            eid_videosContainer.append(div);

            return;             

        }

    } catch (error) {
        
        console.error('Error al cargar vídeo como película:',error);

        showToast(
            'error',
            data.error,
            null,
            'center',
            true,
            'Error'
        );
        return false;
    } 
}


async function updateMediaActive(id_media){
    console.log('=== function updateMediaActive() ===');

    if(!id_media){
        console.error('id_media no válido:', id_media);
        return;
    }

    try {

        const response = await fetch('../song/php/update_media_active.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_media: id_media
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error update_imagen_active.php) ${response.status}`);
        }



        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //actualizo HTML DOM
                marcarMediaActiveEnDOM(data.id_media);//marcar en rojo la imagen en el modal
                await pintMediaActiveEnFondo();//aplico la imagen de fondo seleccionada

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en update_imagen_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en update_imagen_active.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar la imagen de fondo:',
            error
        );

    }
}


async function updateVideoActive(id_video_val){
    console.log('=== function updateVideoActive() ===');

    if(!id_video_val){
        console.error('id_video_val no válido:', id_video_val);
        return;
    }

    try {

        const response = await fetch('../song/php/update_video_active.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_video: id_video_val
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error update_video_active.php) ${response.status}`);
        }



        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                id_video = data.id_video;//reasigno id_video global para luego usarlo en el player
                update_objVideoActual();

                //actualizo HTML DOM
                pintVideoActiveEnPlayer();//poner datos del video en el player
                marcarVideoActiveEnDOM(id_video);//marcar en rojo el vídeo en el modal
                await pintVideoActiveEnFondo();//aplico el vídeo seleccionado

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en update_video_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en update_video_active.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar el vídeo:',
            error
        );

    }
}


async function deleteMedia(id_media){
    console.log('=== function deleteMedia() ===');

    if(!id_media){
        console.error('id_media no válido:', id_media);
        return;
    }

    //averiguo si es imagen o vídeo
    //let palabra_tipo = () ? : ;


    const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE esta imagen? \n\nEsta acción no se podrá deshacer.`);
    if(respuesta){
        console.log('sigo adelante para eliminar la imagen...'); //clic en "Aceptar"
        if(promtConClaveSecreta()){
            console.log('Clave secreta correcta. Procedo a eliminar la imagen.');
        }else{
            return;
        }
    } else {
        //console.log("7755. Cancelar..."); //clic en "Cancelar"
        return;
    }

    try {

        const response = await fetch('../song/php/delete_media.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_media: id_media
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error delete_imagen.php) ${response.status}`);
        }



        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //elimino del DOM la imagen eliminada
                eid_imagenesContainer.querySelector(`.media_item[data-id_media="${id_media}"]`).remove();
                eid_fondo_body.style = '';//quito el fondo para evitar que quede la imagen rota 
                bg_ruta = '';//quito la ruta del fondo 
                bg_media_type = '';//quito tipo de media. luego lo reasigno 
                video_ruta = '';//quito la ruta del video 

                localStorage.setItem('bg_ruta', '');//quito la ruta del fondo del localStorage
                localStorage.setItem('bg_media_type', '');//quito tipo de media del fondo del localStorage
                localStorage.setItem('video_ruta', '');//quito la ruta del video del localStorage
                await guardarEnLocalAndBd('g');//g = guardar fondo

                //si hay nueva imagen activa la aplico en el fondo
                if(data.new_id_media_active){
                    //actualizo HTML DOM
                    marcarMediaActiveEnDOM(data.new_id_media_active);//marcar en rojo la imagen en el modal
                    await pintMediaActiveEnFondo();//aplico la imagen de fondo seleccionada
                }

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en delete_media.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en delete_media.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar el fichero de fondo:',
            error
        );

    }
}


async function deleteVideo(id_video_val){
    console.log('=== function deleteVideo() ===');

    if(!id_video_val){
        console.error('id_video_val no válido:', id_video_val);
        return;
    }

    //averiguo si es imagen o vídeo
    //let palabra_tipo = () ? : ;


    const respuesta = confirm(`¿Estás seguro de que quieres ELIMINAR IRREVERSIBLEMENTE este vídeo? \n\nEsta acción no se podrá deshacer.`);
    if(respuesta){
        console.log('sigo adelante para eliminar el vídeo...'); //clic en "Aceptar"
        if(promtConClaveSecreta()){
            console.log('Clave secreta correcta. Procedo a eliminar el vídeo.');
        }else{
            return;
        }
    } else {
        //console.log("7755. Cancelar..."); //clic en "Cancelar"
        return;
    }

    try {

        const response = await fetch('../song/php/delete_video.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_video: id_video_val
                })
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error delete_imagen.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {

                //elimino del DOM la imagen eliminada
                eid_videosContainer.querySelector(`.video_item[data-id_video="${id_video}"]`).remove();

                //si hay un nuevo vídeo activo lo aplico en el DOM
                if(data.new_id_media_active){
                    id_video = data.new_id_video_active;
                    
                    //actualizo HTML DOM
                    pintVideoActiveEnPlayer();//poner datos del video en el player
                    marcarVideoActiveEnDOM(data.new_id_media_active);//marcar en rojo el video en el modal
                    await pintVideoActiveEnFondo();//aplico el vídeo seleccionado
                }

                showToast(
                    'ok',
                    data.mensaje,
                    2000
                );                  
                
            } else {

                showToast(
                    'error',
                    data.error,
                    null,
                    'center',
                    true,
                    'Error'
                );
                return;             
    
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en delete_video.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en delete_video.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al actualizar el vídeo:',
            error
        );

    }
}


function marcarMediaActiveEnDOM(id_media){
    if(!id_media){
        return;
    }

    Array.from(eid_imagenesContainer.querySelectorAll('.media_item')).forEach(item => {
        if(item.dataset.id_media == id_media){
            item.classList.add('active');
        }else{
            item.classList.remove('active');
        }
    });
}

function marcarVideoActiveEnDOM(id_video){
    if(!id_video){
        return;
    }

    Array.from(eid_videosContainer.querySelectorAll('.video_item')).forEach(item => {
        if(item.dataset.id_video == id_video){
            item.classList.add('active');
        }else{
            item.classList.remove('active');
        }
    });
}

function getIndexVideoActual(id_video){
    console.log('=== function getIndexVideoActual() ===');

    //busco datos del video seleccionado en el arr_lista_videos
    const indexVideo = arr_lista_videos.findIndex(
        v => v.id_video == id_video
    );
    
    if(indexVideo === -1){
        return false;
    }
    
    return indexVideo;
}

function pintVideoActiveEnPlayer(){
    console.log('=== function pintVideoActiveEnPlayer() ===');  
    
    if(!id_video){
        //alert('no hay id_video');
        console.warn('no hay id_video');
        return;
    }    
    
    index_video_actual = getIndexVideoActual(id_video);
    
    objVideoActual = arr_lista_videos[index_video_actual];

    if(objVideoActual){
        eid_d_id_video.textContent = objVideoActual.id_video;
        eid_d_title_video.textContent = objVideoActual.title;
        eid_d_note_video.textContent = objVideoActual.note;
    }

    update_objVideoActual();
}

function update_objVideoActual(){
    console.log('=== function update_objVideoActual() ===');

    if(!id_video){
        // alert('no hay id_video');
        console.warn('no hay id_video');
        return;
    } 

    index_video_actual = getIndexVideoActual(id_video);
    
    objVideoActual = arr_lista_videos[index_video_actual];

    src_video_actual = objVideoActual.ruta;
}


async function getMediaActive(){
    console.log('=== function getMediaActive() ===');

    try {

        const response = await fetch('../song/php/get_media_active.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_imagen_active.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_media_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_media_active.php',
                { cause: error }
            );
        } 

    } catch (error) {
        console.error('Error al cargar el fichero media de fondo:', error);
    }
}


async function getVideoActive(){
    console.log('=== function getVideoActive() ===');

    try {

        const response = await fetch('../song/php/get_video_active.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_video_active.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_video_active.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_video_active.php',
                { cause: error }
            );
        } 

    } catch (error) {
        console.error('Error al cargar el fichero de vídeo:', error);
    }
}


async function getMediaAll(){
    console.log('=== function getMediaAll() ===');

    try {

        const response = await fetch('../song/php/get_media_all.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_media_all.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
            
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_media_all.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_media_all.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al cargar las imágenes o vídeos de fondo:',
            error
        );

    }
}


async function getVideoAll(){
    console.log('=== function getVideoAll() ===');

    try {

        const response = await fetch('../song/php/get_video_all.php',
            {
                method: 'POST'
            }
        );

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }

        if(debug){
            console.log('text:', text);
        }

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error get_video_all.php) ${response.status}`);
        }


        try {
            const data = JSON.parse(text);
            console.log('data:', data);
            
            return data;

        } catch (error) {
            
            console.error('❌ JSON inválido en get_video_all.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en get_videoall.php',
                { cause: error }
            );
        } 

    } catch (error) {

        console.error(
            'Error al cargar el vídeo:',
            error
        );

    }
}



function pintarTimerHoly(){
    console.log('=== function pintarTimerHoly() ===');
    console.log('Holy:', Date.now());

    console.log(Date.now());
    console.log(objTimer.endTime); 
    
    const tiempoPausadoActualMs = obtenerTiempoPausadoActualMs();

    const timerState = calcularEstadoTimer();
    eid_timerTextHoly.innerHTML = timerState.texto;

    let textoEstado = timerState.status;

    if(objTimer.status === 'SUMADO'){
        const minutosSumados = Math.floor(objTimer.tiempoSumadoMs / 60000);    
        textoEstado = `SUMADO TOTAL: +${minutosSumados} min.`;
    }
    else if(objTimer.status === 'RESTADO'){
        const minutosRestados = Math.floor(objTimer.tiempoRestadoMs / 60000);    
        textoEstado = `RESTADO TOTAL: -${minutosRestados} min.`;
    }

    eid_estadoTimerHoly.textContent = textoEstado;

    eid_timerPausadoHoly.textContent = `Tiempo en pausa: ${formatearTiempoTimer(tiempoPausadoActualMs)}`;
    eid_timerRestadoHoly.textContent = `Total restado: ${formatearTiempoTimer(objTimer.tiempoRestadoMs)}`;
    eid_timerSumadoHoly.textContent  = `Total sumado: ${formatearTiempoTimer(objTimer.tiempoSumadoMs)}`;

    eid_timerDisplay.classList.remove(
        'verde',
        'amarillo',
        'rojo',
        'rojo_blink',
        'grey'
    );

    if(!objTimer.visible){
        eid_timerDisplay.classList.add('grey');
    }else{
        eid_timerDisplay.classList.add(timerState.clase);
    }
}


function identificarPantallas(){
    console.log('=== function identificarPantallas() ===');

    limpiarReferenciasCerradas();

    arr_misPantallas.forEach((pantalla, i) => {

        if(pantalla && !pantalla.closed){

            pantalla.postMessage({
                tipo: 'identificar_pantalla',
                numero: i + 1
            }, window.location.origin);

        }

    });
}



function actualizarIframePantalla(){
    console.log('=== function actualizarIframePantalla() ===');

    if(!miIframe || !miIframe.contentWindow){
        return;
    }

    const payload = {
        tipo: 'pantalla_update',
        actualizarSlide: true,
        actualizarVista: true,
        arr_pantalla,
        objPantallaParams,
        objTimer,
        objHora
    };

    miIframe.contentWindow.postMessage(
        payload,
        window.location.origin
    );
}

function crearPayloadPantalla({
    actualizarSlide = true,
    actualizarVista = true
} = {}){
    return {
        tipo: 'pantalla_update',
        actualizarSlide,
        actualizarVista,
        arr_pantalla,
        objPantallaParams,
        objTimer,
        objHora
    };
}

function actualizarIframePantalla(){
    if(!miIframe || !miIframe.contentWindow){
        return;
    }

    miIframe.contentWindow.postMessage(
        crearPayloadPantalla(),
        window.location.origin
    );
}

function actualizarReferenciaPantalla(referencia){
    if(!referencia || referencia.closed){
        return;
    }

    referencia.postMessage(
        crearPayloadPantalla(),
        window.location.origin
    );
}


function makeBtnActive(contenedor, btn){
    console.log('=== function makeBtnActive() ===');

    if(!contenedor || !btn){
        return;
    }

    resetBtnActive(contenedor);//reseteo btn_active de botones en el contenedor
    btn.classList.add('btn_active');
}


function makeFldActive(contenedor, fld){
    console.log('=== function makeFldActive() ===');

    if(!contenedor || !fld){
        return;
    }

    resetFldActive(contenedor);//reseteo fld_active de fieldset's en el contenedor
    fld.classList.add('fld_active');
}


function goToLinkById(idElement){
    console.log('=== function goToLinkById() ===');

    if(!idElement){
        return;
    }

    const element = document.getElementById(idElement);
    const url = element ? element.value.trim() : null;
    if(element && url){
        window.open(url, '_blank');
    }
}

