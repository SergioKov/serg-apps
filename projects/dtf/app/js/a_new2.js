function escaparHTML(texto) {
    if (texto == null) return texto;

    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

async function update_objFindParamsCliente(){
    console.log('=== function update_objFindParamsCliente() ===');

    obj_ajustes.objFindParamsCliente = objFindParamsCliente;
    await update_obj_ajustes();
}

async function update_obj_ajustes(){
    //console.log('=== function update_obj_ajustes() ===');
    localStorage.setItem('obj_ajustes', JSON.stringify(obj_ajustes));

    // if(hay_sesion){
    //     await guardarEnBd('ajustes', 'obj_ajustes', obj_ajustes);
    // }
}