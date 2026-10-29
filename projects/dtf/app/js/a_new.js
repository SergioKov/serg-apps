function crearItemsSelector({
    tipo_concepto,          //'producto','bono','servicio'
    datos,                  //objDataProductos.arr_data, objDataBonos.arr_data, objDataServicios.arr_data
    contenedor_lista_items, //eid_contenedor_lista_items donde se colocan todos los items de pedido
    contenedor,             //eid_contenedor_select_producto, eid_contenedor_select_bono, eid_contenedor_select_servicio
    clase,                  //'d_producto','d_bono','d_servicio'
    campoId,                //'id_producto','id_bono','id_servicio'
    campoPrecio,            //'precio_venta','precio','precio',
    mostrarCantidad         //función para mostrar la cantidad y su unidad => '1 m' o '1 ud.'
}) {
    console.log('=== function crearItemsSelector() ===');
    console.log('tipo_concepto:', tipo_concepto );

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
        d_item.dataset.tipo_concepto = tipo_concepto;
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

            // Buscar el artículo existente por tipo_concepto e ID
            const item_existente = pedido.arr_items_pedido.find(
                item =>
                    String(item.id) === String(id_item) &&
                    item.tipo_concepto === tipo_concepto
            );

            if (item_existente) {
                // Actualizar artículo existente
                
                // Incrementar cantidad
                item_existente.cantidad += 1;

                // Buscar su elemento DOM
                const div_item_existente = [...contenedor_lista_items.querySelectorAll('.div_item')].find(
                    div =>
                        String(div.dataset.id_item) === String(id_item) &&
                        div.dataset.tipo_concepto === tipo_concepto
                );

                if (div_item_existente) {
                    
                    //si es producto,saco su precio de tarifas según cantidad de metros                    
                    if(item_existente.tipo_concepto === 'producto'){
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
                    tipo_concepto: tipo_concepto,
                    id: id_item,
                    nombre: nombre_item,
                    cantidad: 1, //por defecto siempre 1
                    precio: precio_item,
                    importe: precio_item //se modifica luego
                };

                pedido.arr_items_pedido.push(item);//añado al array de pedido

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
            
            // Recalcular subtotal del pedido
            calcularSubtotal();
        };

        //añado al DOM
        contenedor.append(d_item);
    });
}


function actualizarPrecioProductoSegunTarifa(item, div_item) {
    if (item.tipo_concepto !== 'producto') return;

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
