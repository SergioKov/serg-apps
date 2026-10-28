async function findWordsClienteSm(){
    console.log('=== async function findWordsClienteSm() ===');
    console.time('time_findWordsClienteSm');

    const eid_inpt_find_cliente = document.getElementById('buscar_cliente');
    // const eid_modo_cliente = document.getElementById('modo_cliente');
    // const eid_buscar_en_cliente = document.getElementById('buscar_en_cliente');
    const eid_regs_finded_cliente_sm = document.getElementById('regs_finded_cliente_sm');

    let words_input_trimed = eid_inpt_find_cliente.value.trim();
    let words_input = normalizeSearchText(words_input_trimed);//quito espacios duplicados, puntuacion, tildes etc...
    let modo = 3;//eid_modo_cliente.value;
    let buscar_en = 1;//eid_buscar_en_cliente.value;
    //console.log('--- words_input: ', words_input);

    if(words_input == ''){
        console.log('1. no has introducido nada....');
        let aviso_text = `<p>No has introducido nada en el campo de búsqueda. Por favor, introduce texto para buscar.</p>`;
            
        showToast('warn', aviso_text, 50, 'center', true, 'Rellena el campo de búsqueda');
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
        let aviso_text = `<p>No has introducido nada en el campo de búsqueda. Por favor, introduce texto para buscar.</p>`;
            
        showToast('warn', aviso_text, 50, 'center', true, 'Rellena el campo de búsqueda');
        return;
    }

    objFindParamsClienteSm.words_input = words_input;
    objFindParamsClienteSm.modo = modo;
    objFindParamsClienteSm.buscar_en = buscar_en;
    objFindParamsClienteSm.findedRows = 0;//por defecto '0' luego lo actualizo si hay coincidencias


    const objDataClientesSmFinded = await getDataClientesFromBdByFind(objFindParamsClienteSm);
    console.log('objDataClientesSmFinded: ', objDataClientesSmFinded);   

    
    const hay_coincidencias = (esObjeto(objDataClientesSmFinded) && objDataClientesSmFinded.arr_data?.length > 0);//true o false
    
    //si no hay nada...
    if(!hay_coincidencias){
        console.log('no hay coincidencias...');
        //eid_sp_icon_filtro.classList.remove('d-none');//oculto el boton de filtro ya que no hay nada para filtrar
        
        objFindParamsClienteSm.findedRows = 0;

        eid_regs_finded_cliente_sm.classList.remove('d-none');
        eid_regs_finded_cliente_sm.innerHTML = `
            <p class="prim">
                No se han encontrado resultados para "<b>${words_input_trimed}</b>" con los criterios de búsqueda seleccionados.
            </p>
        `;
    }

    //si hay clientes...
    if(hay_coincidencias){
        console.log('hay coincidencias...'); 
        
        objFindParamsClienteSm.findedRows = objDataClientesSmFinded.arr_data.length;
                
        //Resultado de búsqueda
        eid_regs_finded_cliente_sm.classList.remove('d-none');
        eid_regs_finded_cliente_sm.innerHTML = `
            <div class="wr_num_regs">
                <div class="title_regs_finded">Registros encontrados: </div>
                <div class="num_regs_finded">${objDataClientesSmFinded.arr_data.length}</div>
                <div class="wr_close_item" onclick="closeDivBySelector('#regs_finded_cliente_sm')">
                    <span class="close">✕</span>
                </div>
            </div>
        `;


        objDataClientesSmFinded.arr_data.forEach((el,i,arr) => {
            
            const d_cliente = document.createElement('div');
            d_cliente.className = 'd_cliente d_art';
            d_cliente.dataset.id_cliente = el.id_cliente;
            d_cliente.dataset.tipo_art = 'cliente';
            d_cliente.innerHTML = `
                <div class="datos_cliente datos_art">
                    <div class="wr_id_nombre">
                        <div class="da_id">${(el.id_cliente)}</div>
                        <div class="da_nombre ${(el.nombre) ? '' : 'd-none'}">
                            ${escaparHTML(el.nombre) || '(nombre no asignado)'}
                        </div>
                    </div>                    
                    <div class="da_tel ${(el.telefono) ? '' : 'd-none'}">
                        ${escaparHTML(el.telefono)}
                    </div>
                    <div class="da_com ${(el.comentario) ? '' : 'd-none'}">
                        ${escaparHTML(el.comentario) || '(sin comentario)'}
                    </div>
                </div>               
            `;

            //click en div
            d_cliente.onclick = (e) => {

                console.log('element clicked: ', e.currentTarget);

                console.log('el:', el);

                const d_cliente_clicked = e.target.closest('.d_art');
                console.log('d_cliente_clicked:', d_cliente_clicked);

                const input_id_cliente = document.getElementById('id_cliente');
                input_id_cliente.value = el.id_cliente;
                
                const eid_datos_cliente_finded = document.getElementById('datos_cliente_finded');
                if(eid_datos_cliente_finded){

                    eid_datos_cliente_finded.querySelector('.cl_valor').innerHTML = `
                        <div class="cl_valor_inner">
                            <div class="nc_val d_flex_v">
                                <div class="cl_campo_v">id</div>
                                <div>${el.id_cliente}</div>
                            </div> 
                            <div class="nc_val d_flex_v">
                                <div class="cl_campo_v">nombre</div>
                                <div>${el.nombre || '(no asignado)'}</div>
                            </div> 
                            <div class="nc_val d_flex_v">
                                <div class="cl_campo_v">tel</div>
                                <div>${el.telefono}</div>
                            </div> 
                            <div class="nc_val d_flex_v">
                                <div class="cl_campo_v">cod</div>
                                <div>${el.codigo_cliente}</div>
                            </div>                        
                        </div>                        
                    `;

                    eid_regs_finded_cliente_sm.classList.add('d-none');
                }
            }

            eid_regs_finded_cliente_sm.append(d_cliente);
        });

        
        
    }

    //await update_objFindParamsCliente();

    console.timeEnd('time_findWordsClienteSm');
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

    
        case 'wr_estado_pago'://estado_pago
            if(['pendiente', 'parcial', 'pagado', 'recurrente'].includes(estado_val)){
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
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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