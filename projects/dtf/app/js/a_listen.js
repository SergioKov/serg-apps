window.addEventListener('load', (e) => {
    console.log('load - window.innerWidth: ', window.innerWidth);

    init();
});


window.addEventListener('resize',(e) => {
    console.log('resize - window.innerWidth: ', window.innerWidth);

});


//Click fuera de los divs abajo
document.addEventListener('click', (e) => {
    console.log('document click');
    console.log('e.target: ', e.target);

    // Cerrar modal al hacer clic fuera del contenido de modal
    // el elemento clickeado es eid_myModal o eid_myModalContent y no el contenido -> cerrar modal
    if (e.target === eid_myModal || e.target === eid_myModalContent) {
        closeModal(null, true);
    }

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

    //click fuera del contenido del modal
    if(e.target == eid_myModal || e.target == eid_myModalContent){
        closeModal(null,true);//click_fuera_o_x
    }

});



/*
//al teclear texto en la busqueda de cancion
let timeoutFindSong;

eid_inpt_find.addEventListener('input', (e) => {
    console.log('=== listener --- eid_inpt_find input');

    const input_val = e.currentTarget.value.trim();
    console.log('input_val: ', input_val);

    clearTimeout(timeoutFindSong);

    if(input_val.length < 3){
        return;
    }

    timeoutFindSong = setTimeout(async () => {
        await findWordsSong();
    }, 400);
});
*/


/*
//al teclear texto en la busqueda de lista
let timeoutFindLista;

eid_inpt_find_lista.addEventListener('input', (e) => {
    console.log('=== listener --- eid_inpt_find_lista input');

    const input_val = e.currentTarget.value.trim();
    console.log('input_val: ', input_val);

    clearTimeout(timeoutFindLista);

    if(input_val.length < 3){
        return;
    }

    timeoutFindLista = setTimeout(async () => {
        await findWordsLista();
    }, 400);
});
*/



document.addEventListener('keydown', checkKey);

async function checkKey(e) {//funciona .codigo mas limpio aunque .keyCode is deprecated
    console.log('=== function checkKey(e) ===');
    e = e || window.event;
    
    console.log('checkKey() --- e.key: ', e.key);
    console.log('checkKey() --- e.keyCode: ', e.keyCode);
    //console.log('e.code: ', e.code);
    //console.log('e.shiftKey: ', e.shiftKey);
    //console.log('e.ctrlKey: ', e.ctrlKey);

    if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        //slideGo('prev');

    }

    if(e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        //slideGo('next');
        
    }

    if (e.key === 'Escape' || e.key === 'Esc') {
        console.log('keydown --- presionado escape');

    }

}



//puntos (opciones) de menú
eid_puntosMenu.addEventListener('click', (e) => {
    console.log('=== eid_puntosMenu click ===');
    console.log('e.currentTarget: ', e.currentTarget);
    console.log('e.target: ', e.target);

    if (!los_puntosMenu_ul.contains(e.target)) {
        // Click fue dentro de puntosMenu_ul pero fuera de eid_edit_contenido_inner
        console.log('click fuera de puntosMenu_ul');
        closePuntosMenu();
    } else {
        // Click dentro de eid_edit_contenido_inner: no hacer nada
        console.log('click dentro de puntosMenu_ul');
    }
});




