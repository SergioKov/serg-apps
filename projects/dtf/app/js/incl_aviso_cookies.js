//alert('incl_aviso_cookies.js cargado');

// Obtener elementos del DOM
const cookieConsent = document.getElementById('cookie-consent');
const acceptButton = document.getElementById('accept-cookies');
const rejectButton = document.getElementById('reject-cookies');

if(['rejected','accepted'].includes(get_cookieConsent)){
    //console.log('[incl_aviso_cookies.js] get_cookieConsent: ',get_cookieConsent);
    //el usuario ha elegido su consentimiento: rechazar o aceptar
    cookieConsent.classList.add('hidden');//no muestro block de cookies
    if(get_cookieConsent === 'rejected'){
        if(typeof eid_m_bl_cookies !== 'undefined'){
            eid_m_bl_cookies.querySelector('.cookie_consent').innerHTML = `
                <span class="color_red" data-dic="d311">${obj_lang.d311 || 'Rechazado'}</span>
            `;
        }
    }
}

let count_look = 0;

lookForClearLocalStorage();

function lookForClearLocalStorage(){
    //console.log('=== function lookForClearLocalStorage() ===');
    if(count_look == 5){
        //console.log('count_look: ',count_look);
        //console.log('finalizo lookForClearLocalStorage()');        
        return;
    }
    setTimeout(()=>{
        if(get_cookieConsent && get_cookieConsent === 'rejected'){
            //console.log('count_look: ',count_look);
            if(localStorage.length > 0){
                //console.log('hay algo en localStorage. lo limpio. localStorage: ', localStorage);
                localStorage.clear();//elimino todo del localStorage()
            }        
            count_look++;
            lookForClearLocalStorage();
        }
    },1000);
}


// Verificar si ya existe consentimiento de cookies
if (localStorage.getItem('cookieConsent') !== null) {
    cookieConsent.classList.add('hidden');
    if(localStorage.getItem('cookieConsent') === 'accepted'){
        if(typeof eid_m_bl_cookies !== 'undefined'){
            eid_m_bl_cookies.querySelector('.cookie_consent').innerHTML = `
                <span class="color_green" data-dic="d310">${obj_lang.d310 || 'Aceptado'}</span>
            `;
        }
    }
}


// Función para ACEPTAR cookies
acceptButton.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    url_web.searchParams.set('cookieConsent', 'accepted');
    get_cookieConsent = 'accepted';
    if(typeof eid_m_bl_cookies !== 'undefined'){
        eid_m_bl_cookies.querySelector('.cookie_consent').innerHTML = `
            <span class="color_green" data-dic="d310">${obj_lang.d310 || 'Aceptado'}</span>
        `;
    }
    let params_new = '?';
    url_web.searchParams.forEach((value,key)=>{
        //console.log(`${key}: ${value}`);
        params_new += `&${key}=${value}`;
    });
    //window.location.origin => 'https://bibleqt.es'
    //window.location.pathname => '/'
    let new_url_ref = window.location.origin + window.location.pathname + params_new;
    //console.log("[incl_aviso_cookies] - URL nueva completa con ref. new_url_ref: ", new_url_ref);

    window.history.pushState(null, "Título de la página", new_url_ref);

    cookieConsent.classList.add('hidden');
    //alert("Has aceptado el uso de cookies.");

        if(['/','/index.php'].includes(window.location.pathname)){
            let aviso_cookies = `${obj_lang.d308 || 'Has aceptado el uso de cookies. <br><br>Para cambiar el consentimiento pulsa tres puntos del menú (arriba a la derecha) y luego opción <b>Mostrar el block de selección de consentimiento de cookies.</b> (abajo del todo).'}`;
            openModal('center','Cookies',aviso_cookies,'showAviso'); 
        }else{
            alert(`${obj_lang.d480 || 'Has aceptado el uso de cookies.'}`);
        }
    });

// Función para RECHAZAR cookies
rejectButton.addEventListener('click', () => {
    if(typeof eid_m_bl_cookies !== 'undefined'){
        eid_m_bl_cookies.querySelector('.cookie_consent').innerHTML = `
            <span class="color_red" data-dic="d311">${obj_lang.d311 || 'Rechazado'}</span>
        `;   
    }
    // localStorage.setItem('cookieConsent', 'rejected');
    localStorage.clear();//elimino todo del localStorage()
    cookieConsent.classList.add('hidden');
    deleteAllCookies();
    cerrarSesionCookies();

    // Obtener la URL actual
    let url_href = new URL(window.location.href);
    url_href.searchParams.set('lang',lang);
    url_href.searchParams.set('cookieConsent','rejected');
    let params_new = '?';
    url_href.searchParams.forEach((value,key)=>{ 
        //console.log(`${key}: ${value}`);
        params_new += `&${key}=${value}`;
    });
    //window.location.origin => 'https://bibleqt.es'
    //window.location.pathname => '/'
    let new_url_ref = window.location.origin + window.location.pathname + params_new;
    //console.log("URL nueva completa con ref. new_url_ref: ", new_url_ref);

    window.history.pushState(null, "Título de la página", new_url_ref);
    //console.log("Has rechazado el uso de cookies.");

    if(['/','/index.php'].includes(window.location.pathname)){//si es index.php
        //de momento nada
    }else{
        alert(`${obj_lang.d429 || 'Has rechazado el uso de cookies.'}`);
    }

});


// Función para eliminar todas las cookies
function deleteAllCookies() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}

async function cerrarSesionCookies(){
    //console.log('=== function cerrarSesionCookies() ===');

    try {
        
        const response = await fetch('./php/cerrar_sesion_cookies.php');
        const data = await response.json();
        //console.log(data);

        if (data.cerrada) {

            if(['/','/index.php'].includes(window.location.pathname)){//si es index.php 
                hay_sesion = false;
                pintLoginImg(hay_sesion);
    
                eid_partDeskTabs.innerHTML = '';
                addTab(null,null,null,'tab_new');    
    
                arrFavTrans = [...arrFavTransDef];
                //console.log('serrarSesion() ---> arrFavTrans: ', arrFavTrans);
    
                let aviso_cookies = `${obj_lang.d307 || 'Has rechazado el uso de cookies. No se guardarán los ajustes personales ni el historial del uso de la web app. <br><br>Para poder disfrutar de la posibilidad de guardarlos tienes que aceptar las cookies y loguearte. <br><br>Para cambiar el consentimiento pulsa tres puntos del menú (arriba a la derecha) y luego opción <b>Mostrar el block de selección de consentimiento de cookies.</b> (abajo del todo).'}`;
                openModal('center','Cookies',aviso_cookies,'showAviso'); 
    
                setTimeout(()=>{
                    // Recargar la página
                    window.location.reload();
                },10000);
    
                mySizeWindow();
    
            }else{
                return;
            }                       

        } else {
            // Mostrar un mensaje de error si hay problemas al cerrar la sesión
            console.error('Error al cerrar sesión');
        }

    } catch (error) {
        // Código a realizar cuando se rechaza la promesa
        console.error('cerrarSesionCookies. error: ',error);
    }    
}
