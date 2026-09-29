    // Crear un objeto URL basado en la URL actual
    let url_web = new URL(window.location.href);

    let get_trans = url_web.searchParams.get('trans');//valor o null
    let get_ref = url_web.searchParams.get('ref');//valor o null
    let get_lang = url_web.searchParams.get('lang');//valor o null
    let get_cookieConsent = url_web.searchParams.get('cookieConsent');//valor o null

    // Obtener todos los parámetros GET usando searchParams
    // Iterar sobre cada parámetro y mostrar su clave y valor
    //url_web.searchParams.forEach((value, key) => {
    //    console.log(`${key}: ${value}`);
    //});


    if(get_cookieConsent){
        //console.log('get_cookieConsent: ',get_cookieConsent);
    }
    if(get_lang){
        //console.log('get_lang: ',get_lang);
    }
    if(get_trans){
        //console.log('get_trans: ',get_trans);
    }
    if(get_ref){
        //console.log('get_ref: ',get_ref);
    }

    let hay_get_data = false;//por defecto
    if(get_ref != null){
        hay_get_data = true;
    }