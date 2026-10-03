function pintClienteActiveSoloDatos(){
    console.log('=== function pintClienteActiveSoloDatos() === ');

    if(!objCliente){
        alert('no hay objCliente');
        return;
    }

    const d_cliente = eid_contenedor_clientes.querySelector(`.d_cliente[data-id_cliente="${objCliente.id_cliente}"]`);
    console.log('d_cliente: ', d_cliente);
    
    if(!d_cliente){
        console.log('no hay d_cliente. no actualizo d_cliente...');
        return;
    }

    const div_da_nombre = d_cliente.querySelector('.da_nombre');
    const div_da_tel = d_cliente.querySelector('.da_tel');
    const div_da_com = d_cliente.querySelector('.da_com');

    //nombre
    div_da_nombre.textContent = objCliente.nombre || '(nombre no asignado)';
    div_da_nombre.classList.remove('d-none');//muestro tenga o no el nombre

    //telefono
    div_da_tel.textContent = objCliente.telefono || '(telefono no asignado)';
    div_da_tel.classList.remove('d-none');//muestro tenga o no el telefono

    //comentario
    div_da_com.textContent = objCliente.comentario || '(sin comentario)';
    //si '!objCliente.comentario' es true  (no tiene comentario) -> pone  'd-none' -> oculta
    //si '!objCliente.comentario' es false (sí tiene comentario) -> quita 'd-none' -> muestra
    div_da_com.classList.toggle('d-none', !objCliente.comentario);

}

function resetDivActive(contenedor, element_class) {//Ej.: contenedor = eid_contenedor_clientes, element_class = 'd_cliente'//sin punto
    contenedor.querySelectorAll(`.${element_class}`).forEach(d => {
        d.classList.remove('active');
    });
}

async function getDataClienteFromBd(){
    console.log('=== function getDataClienteFromBd() ===');

    try {
        
        if(!hay_id_cliente('getDataClienteFromBd()')){
            return; // <- se detiene aquí si no hay id_cliente
        }
     
        const response = await fetch('../app/php/obtener_cliente_datos.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificar el tipo de contenido como JSON
            },
            body: JSON.stringify({
                id_cliente: id_cliente
            }), // Convertir los datos a formato JSON
        });

        const text = await response.text();

        if(!text.trim()) {
            throw new Error('Respuesta vacía del servidor');
        }
        console.log('text:', text);

        if(!response.ok){
            console.error('❌ HTTP ERROR', response.status);
            console.error(text.slice(0, 300));
            throw new Error(`HTTP (error obtener_cliente_datos.php) ${response.status}`);
        }

        try {
            const data = JSON.parse(text);
            console.log('data:', data);
    
            if (data.success) {
                console.log('success is true');

                console.log(`id_cliente: [${id_cliente}] --- nombre: [${data.nombre}] --- telefono: [${data.telefono}] --- comentario: [${data.comentario}]`);

                return data;    
                
            } else {
                console.log('success is false');
                return 'no_hay_datos';              
            }

        } catch (error) {
            
            console.error('❌ JSON inválido en obtener_cliente_datos.php');
            console.error(text.slice(0, 500));
            console.error('error.name: ', error.name);            
            console.error('error.message: ', error.message);            

            throw new Error(
                'JSON inválido en obtener_cliente_datos.php',
                { cause: error }
            );
        }

    } catch (error) {
        console.error('Error en getDataClienteFromBd(): error.message: ', error.message);
    }
}
