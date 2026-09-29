crear_obj_lang(); // Llamamos a la función para que crea obj_lang

async function crear_obj_lang() {
    obj_lang = await make_obj_lang();
    //console.log(obj_lang);

    //llamo funcion de pintar el aviso
    pintMensaje();
}

async function make_obj_lang(){
    //console.log('=== function make_obj_lang() ===');
    
    try {

        if(!arr_langs.includes(lang)){
            console.error(`No existe este idioma '${lang}' para las traducciones. Creo objeto con lang '${arr_langs[0]}' por defecto`);
            lang = arr_langs[0];
        }            
        
        let obj_lang_f = await fetchDataToJson(`../app/json/idiomas/${lang}.json`);
        //console.log('obj_lang_f:');
        //console.log(obj_lang_f);
        //localStorage.setItem('lang',lang);

        return obj_lang_f;

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('make_obj_lang. error: ',error);
    }    
}

async function fetchDataToJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function pintMensaje(){
    const aviso = document.getElementById('aviso');
    if(typeof dic_code !== "undefined" && dic_code && typeof obj_lang[dic_code] !== 'undefined'){
        aviso.innerHTML = obj_lang[dic_code];
    }else{
        aviso.innerHTML = obj_lang.d259;//'Código de mensaje no indicado.';
    }
    document.head.querySelector('title').textContent = obj_lang.d261;//Aviso
    document.querySelector('.aviso-form h1').textContent = obj_lang.d261;//Aviso
    document.querySelector('#a_inicio').textContent = obj_lang.d262;//Ir al inicio

    setTimeout(()=>{
        window.location.href = "/login?from_aviso";
    },5000);
}