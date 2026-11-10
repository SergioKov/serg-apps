// Pila global de modales secundarios
const modal2Stack = [];

// Un único listener global para Escape
document.addEventListener('keydown', (e) => {

    if (e.key !== 'Escape') return;

    // Obtener el modal que está en primer plano
    const modal_actual = modal2Stack[modal2Stack.length - 1];

    if (modal_actual) {
        e.preventDefault();
        modal_actual.cerrarModal2();
    }

});


function showModal2Content({
    titulo = '',
    contenedor = null,
    overlay_position = 'center', //'top', 'center'
    cerrar_exterior = true,
    mostrar_btn_cerrar = true,
    onClose = null,
    contenido
} = {}) {
    console.log('=== function showModal2Content() ===');

    const modal2_container = contenedor || document.body;

    // Crear overlay
    const modal2_overlay = document.createElement('div');
    modal2_overlay.className = `modal2_container_inner ${overlay_position}`;

    // Crear modal2
    const modal2 = document.createElement('div');
    modal2.className = 'modal2';

    let modal2_head = null;//se reasigna luego

    // Cabecera
    if (titulo || mostrar_btn_cerrar) {

        const modal2_head = document.createElement('div');
        modal2_head.className = 'modal2_head';

        const titulo_elemento = document.createElement('div');
        titulo_elemento.className = 'modal2_title';
        titulo_elemento.textContent = titulo;

        modal2_head.append(titulo_elemento);

        if (mostrar_btn_cerrar) {
            const btn_cerrar = document.createElement('div');
            btn_cerrar.className = 'modal2_close close';
            btn_cerrar.textContent = '✕';

            btn_cerrar.onclick = cerrarModal2;

            modal2_head.append(btn_cerrar);
        }

        modal2.append(modal2_head);
    }

    // Cuerpo
    const modal2_body = document.createElement('div');
    modal2_body.className = 'modal2_body';

    if (contenido instanceof Node) {
        // Añadir elemento conservando sus escuchadores
        modal2_body.append(contenido);

    } else if (typeof contenido === 'string') {
        // Permitir contenido HTML
        modal2_body.innerHTML = contenido;
    }

    modal2.append(modal2_body);

    // Cerrar al pulsar fuera del modal2
    modal2_overlay.onclick = (e) => {
        if (cerrar_exterior && e.target === modal2_overlay) {
            cerrarModal2();
        }
    };

    // Añadir overlay y modal al DOM
    modal2_overlay.append(modal2);
    modal2_container.append(modal2_overlay);

    // Objeto que representa este modal
    const obj_modal2 = {
        modal2_overlay,
        modal2,
        modal2_head,
        modal2_body,
        cerrarModal2
    };

    // Añadir a la pila
    modal2Stack.push(obj_modal2);

    // Actualizar z-index de todos los modales
    actualizarZIndexModal2();

    // Forzar que el navegador registre el estado inicial (para que funcione animación de apariencia)
    modal2_overlay.offsetHeight;

    // Mostrar con transición en el siguiente frame
    requestAnimationFrame(() => {
        modal2_overlay.classList.add('show');
        modal2.classList.add('show');
    });

    // Cerrar al pulsar fuera del modal
    modal2_overlay.onclick = (e) => {
        if (cerrar_exterior && e.target === modal2_overlay) {
            cerrarModal2();
        }
    };

    // Cerrar modal
    let cerrado = false;

    function cerrarModal2() {

        if (cerrado) return;
        cerrado = true;

        // Eliminar de la pila
        const index = modal2Stack.indexOf(obj_modal2);

        if (index !== -1) {
            modal2Stack.splice(index, 1);
        }

        // Animación de cierre
        modal2.classList.remove('show');
        modal2_overlay.classList.remove('show');

        // Eliminar del DOM
        setTimeout(() => {
            modal2_overlay.remove();
            if (typeof onClose === 'function') {
                onClose();
            }
        }, 300);

        // Actualizar z-index de los restantes
        actualizarZIndexModal2();
    }

    // Devolver referencias y función de cierre
    return obj_modal2;

}

// Actualizar z-index según posición en la pila
function actualizarZIndexModal2() {
    modal2Stack.forEach((modal_obj, index) => {
        modal_obj.modal2_overlay.style.zIndex = 10000 + index;
    });
}

//test
function buildModalBuscarCliente(input_hidden) {
    console.log('=== function buildModalBuscarCliente() ===');

    if(!input_hidden){
        alert('no hay input oculto para guardar el cliente seleccionado. No puedo continuar.');
        return;
    }

    const titulo_head = 'Selecciona cliente';

    const contenido = document.createElement('div');
    contenido.className = 'zzz_new';//luego mirar si lo cambio

    let cl_d_limpiar_input = 'd-flex';

    contenido.innerHTML = `
        <div class="d_title_form">
            <div>&nbsp;</div>
            <div class="btn btn_mostrar_todos">Mostrar todos</div>
        </div>

        <form>

            <div class="wr_input_data_buscar form_group wr_input_general">
                <div class="d_limpiar_input ${cl_d_limpiar_input}" onclick="limpiarInput('#buscar_cliente')">
                    <img src="images/x_white.png">
                </div>
                <input id="buscar_cliente" type="text" name="buscar_cliente" required="" placeholder=" " value="">
                <label for="buscar_cliente">Buscar cliente</label>
            </div>            
        
        </form>

        <div id="regs_finded_cliente_sm" class="wr_cliente_find d-none">
            <!-- aki divs de clientes encontrados -->
        </div>
    `;

    const btn_mostrar_todos = contenido.querySelector('.btn_mostrar_todos');
    btn_mostrar_todos.onclick = async () => {
        console.log('muestro todos clientes');
        await findWordsClienteSm(find_by = 'all', modal2, input_hidden);
    };

    //al teclear texto en la busqueda de cliente
    let timeoutBuscarCliente;

    // buscar_cliente
    const input_buscar_cliente = contenido.querySelector('#buscar_cliente');
    input_buscar_cliente.oninput = (e) => {
        console.log('=== listener --- input_buscar_cliente');
    
        const input_val = e.currentTarget.value.trim();
        console.log('input_val: ', input_val);
    
        clearTimeout(timeoutBuscarCliente);
    
        //no permito buscar al teclear menos de 2 carácteres
        if(input_val.length < 2){
            return;
        }
    
        timeoutBuscarCliente = setTimeout(async () => {
            await findWordsClienteSm(find_by = 'words', modal2, input_hidden);
        }, 400);
    };

    // Mostrar el modal (y añadir al DOM) y guardar la referencia en modal2
    const modal2 = showModal2Content({
        titulo: titulo_head,
        overlay_position: 'top',
        contenido: contenido,
        cerrar_exterior: true
    });

    //despues de añadir al DOM uso .focus()
    requestAnimationFrame(() => {
        modal2.modal2_body.querySelector('#buscar_cliente')?.focus();
    });
}
