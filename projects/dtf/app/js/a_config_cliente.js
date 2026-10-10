//clientes

//==================================================================//
//start - main
//==================================================================//

const eid_block_clientes = document.getElementById('block_clientes');
const eid_bl_buscar_clientes = document.getElementById('bl_buscar_clientes');
const eid_filtros_aplicados_clientes = document.getElementById('filtros_aplicados_clientes');
const eid_contenedor_clientes = document.getElementById('contenedor_clientes');

//==================================================================//
//end - main
//==================================================================//


let id_cliente = null;//id actual
let objCliente = {};//de solo un cliente
let objDataClientesBd = {};//objeto con datos de BD de todos los clientes 
let objDataClientes = {};//objeto con datos de todos los clientes general
let objDataClientesFinded = {};//objeto con datos de todos los clientes encontrados en 'Buscar' 

let objClienteDef = {
    id_cliente: 5,
    nombre: "Juan",
    telefono: "622315345",
    codigo_cliente: "5345",
    comentario: "es un cliente fiable!...",
    taquilla: "5",
    descuento: "20%",
    precio_fijo_dtf: "",
    precio_fijo_uv: "",
    saldo: "100",
    created_at: "2026/09/29 16:20:05",
    updated_at: "2026/09/29 16:20:05",
}    
objCliente = objClienteDef;


let objModoBusquedaCliente = {
    modo1: {
        n: 1,
        titulo: "1) Palabras PARCIALES",
        desc_sm: "1) Palabras PARCIALES, cualquier orden",
        desc_full: "Busca registros que contengan todas las palabras introducidas, aunque aparezcan como parte de otras palabras. <br><br> El orden de las palabras no importa; si falta alguna, el registro no se encontrará.",
        ejemplo: "Al introducir «naz rom», se encontrarán los registros que contengan tanto «naz» como «rom», aunque formen parte de otras palabras y aparezcan en cualquier orden. <br><br> Por ejemplo, «Nazar Roman» y «Roman Nazar» coinciden, pero «Nazar» no, porque falta «rom»."
    },
    modo2: {
        n: 2,
        titulo: "2) Palabras EXACTAS",
        desc_sm: "2) Palabras EXACTAS, cualquier orden",
        desc_full: "Busca registros que contengan todas las palabras introducidas como palabras completas, sin importar el orden. <br><br> No coincidirá si una palabra aparece solo como parte de otra palabra.",
        ejemplo: "Al introducir «naz rom», se encontrarán los registros que contengan las palabras completas «naz» y «rom», en cualquier orden. <br><br> Por ejemplo, «naz rom» y «rom ... naz» coinciden, pero «nazar roman» no, porque «naz» y «rom» forman parte de otras palabras."
    },
    modo3: {
        n: 3,
        titulo: "3) Coincidir palabra PARCIAL",
        desc_sm: "3) Coincidir al menos una palabra PARCIAL, cualquier orden",
        desc_full: "Busca registros que contengan al menos una de las palabras introducidas, aunque aparezca como parte de otra palabra. <br><br> No es necesario que coincidan todas las palabras.",
        ejemplo: "Al introducir «naz rom», se encontrarán los registros que contengan «naz» o «rom», incluso como parte de otras palabras. <br><br> Por ejemplo, «Nazar» y «Roman» coinciden, pero un registro que no contenga ninguna de las dos palabras no se encontrará."
    },
    modo4: {
        n: 4,
        titulo: "4) Coincidir palabra EXACTA",
        desc_sm: "4) Coincidir al menos una palabra EXACTA, cualquier orden",
        desc_full: "Busca registros que contengan al menos una de las palabras introducidas como palabra completa, sin importar el orden. <br><br> No coincidirá si la palabra aparece solo como parte de otra palabra.",
        ejemplo: "Al introducir «naz rom», se encontrarán los registros que contengan la palabra completa «naz» o «rom», en cualquier orden. <br><br> Por ejemplo, «naz» y «rom ...» coinciden, pero «nazar» y «roman» no, porque las palabras buscadas forman parte de otras palabras."
    },
    modo5: {
        n: 5,
        titulo: "5) Palabras Parciales, con orden",
        desc_sm: "5) Palabras PARCIALES, respetando orden",
        desc_full: "Busca registros que contengan todas las palabras introducidas, aunque aparezcan como parte de otras palabras, y exige que aparezcan en el orden indicado. <br><br> Puede haber otras palabras o caracteres entre ellas.",
        ejemplo: "Al introducir «naz rom», se encontrarán registros en los que aparezca primero «naz» y después «rom», aunque ambas formen parte de otras palabras. <br><br> Por ejemplo, «Nazar Roman» coincide, mientras que «Roman Nazar» no."
    },
    modo6: {
        n: 6,
        titulo: "6) Palabras EXACTAS, con orden",
        desc_sm: "6) Palabras EXACTAS, respetando orden",
        desc_full: "Busca registros que contengan todas las palabras introducidas como palabras completas y en el orden indicado. <br><br> Puede haber otras palabras o caracteres entre ellas, pero no coincidirán si alguna palabra aparece solo como parte de otra.",
        ejemplo: "Al introducir «naz rom», se encontrarán registros en los que aparezca primero la palabra completa «naz» y después la palabra completa «rom». <br><br> Por ejemplo, «naz Pedro rom» coincide, mientras que «nazar Roman» y «rom ... naz» no."
    },
    modo7: {
        n: 7,
        titulo: "7) Frase EXACTA",
        desc_sm: "7) Frase EXACTA",
        desc_full: "Busca registros que contengan exactamente la frase introducida, manteniendo el orden y el contenido de la frase. <br><br> No es necesario que la frase coincida con todo el contenido del campo; puede haber otros caracteres o palabras antes o después.",
        ejemplo: "Al introducir «naz rom», se encontrarán registros que contengan exactamente la secuencia «naz rom». <br><br> Por ejemplo, «Nazar y rom» no coincide, mientras que «texto naz rom texto» sí."
    },
}

let objBuscarEnBusquedaCliente = {
    buscar_en1: {
        n: 1,
        titulo: "1) Campos por defecto",
        desc_sm: "1) Todos los campos por defecto disponibles (rápido)",
        desc_full: "Busca en todos los campos disponibles: ID, nombre, teléfono, código de cliente, comentario y campo de búsqueda optimizado. <br><br> Es la opción recomendada para realizar una búsqueda general y rápida.",
        ejemplo: "Al introducir «naz rom», la búsqueda se realizará simultáneamente en todos los campos disponibles. <br><br> Se mostrarán los registros que cumplan los criterios del modo de búsqueda seleccionado en cualquiera de estos campos."
    },
    buscar_en2: {
        n: 2,
        titulo: "2) Campos disponibles",
        desc_sm: "2) Todos los campos disponibles (lento)",
        desc_full: "Busca en todos los campos disponibles del cliente, incluyendo nombre, teléfono, código, comentario, taquilla, descuento, precios y saldo. <br><br> Permite una búsqueda más amplia, pero puede ser más lenta.",
        ejemplo: "Al introducir «naz rom», la búsqueda se realizará en todos los campos disponibles del cliente y mostrará los registros que cumplan los criterios del modo de búsqueda seleccionado en cualquiera de ellos."
    },
    buscar_en3: {
        n: 3,
        titulo: "3) Campos de texto",
        desc_sm: "3) Todos los campos de texto disponibles",
        desc_full: "Busca únicamente en los campos de texto del cliente: nombre, teléfono, código de cliente y comentario. <br><br> No incluye otros campos como taquilla, descuento, precios o saldo.",
        ejemplo: "Al introducir «naz rom», la búsqueda se realizará únicamente en los campos de nombre, teléfono, código de cliente y comentario, aplicando el modo de búsqueda seleccionado."
    },
    buscar_en4: {
        n: 4,
        titulo: "4) Campos numéricos",
        desc_sm: "4) Todos los campos numéricos disponibles",
        desc_full: "Busca en todos los campos numéricos disponibles del cliente: ID, teléfono, código de cliente, taquilla, descuento, precios y saldo.",
        ejemplo: "Al introducir «123», la búsqueda se realizará únicamente en los campos numéricos disponibles, aplicando el modo de búsqueda seleccionado."
    },
    buscar_en5: {
        n: 5,
        titulo: "5) Identificador",
        desc_sm: "5) Sólo el identificador de cliente",
        desc_full: "Busca únicamente en el identificador del cliente (ID). No se tienen en cuenta el nombre, teléfono, código, comentario ni ningún otro campo.",
        ejemplo: "Al introducir «123», la búsqueda se realizará únicamente sobre el ID del cliente y no sobre el resto de sus datos."
    },
    buscar_en6: {
        n: 6,
        titulo: "6) Nombre",
        desc_sm: "6) Sólo el nombre",
        desc_full: "Busca únicamente en el nombre del cliente. No se tienen en cuenta el ID, teléfono, código, comentario ni ningún otro campo.",
        ejemplo: "Al introducir «naz rom», la búsqueda se realizará únicamente sobre el nombre del cliente, aplicando el modo de búsqueda seleccionado."
    },
    buscar_en7: {
        n: 7,
        titulo: "7) Teléfono",
        desc_sm: "7) Sólo el teléfono",
        desc_full: "Busca únicamente en el teléfono del cliente. No se tienen en cuenta el ID, nombre, código, comentario ni ningún otro campo.",
        ejemplo: "Al introducir «612345678», la búsqueda se realizará únicamente sobre el teléfono del cliente, aplicando el modo de búsqueda seleccionado."
    },
}









