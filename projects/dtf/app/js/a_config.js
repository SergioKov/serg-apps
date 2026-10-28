
//==================================================================//
//start - header
//==================================================================//
const header = document.querySelector('header');
const hamburger = document.getElementById('hamburger');

const menu_contenido = document.getElementById('menu_contenido');
const eid_puntosMenu = document.getElementById('puntosMenu');
const los_puntosMenu_ul = eid_puntosMenu.querySelector('ul');
//==================================================================//
//end - header
//==================================================================//


//==================================================================//
//start - main
//==================================================================//
const eid_main = document.getElementById('main');














//==================================================================//
//end - main
//==================================================================//












//==================================================================//
//start - modal.js
//==================================================================//
const eid_myModal = document.getElementById('myModal');
const eid_myModalContent = document.getElementById('myModalContent');

const eid_modcont_header = document.getElementById('modcont_header');
const eid_modcont_body = document.getElementById('modcont_body');
const eid_modcont_footer = document.getElementById('modcont_footer');

const eid_bl_modalTop = document.getElementById('bl_modalTop');
const eid_bl_modalCenter = document.getElementById('bl_modalCenter');
const eid_bl_modalBottom = document.getElementById('bl_modalBottom');
const eid_bl_modalFull = document.getElementById('bl_modalFull');

const eid_bl_modalTopInner = document.getElementById('bl_modalTopInner');
const eid_bl_modalCenterInner = document.getElementById('bl_modalCenterInner');
const eid_bl_modalBottomInner = document.getElementById('bl_modalBottomInner');
const eid_bl_modalFullInner = document.getElementById('bl_modalFullInner');

const eid_h4_text = document.getElementById('h4_text');//text en el header de modcont_header
//==================================================================//
//end - modal.js
//==================================================================//


//==================================================================//
//start - toast
//==================================================================//
const eid_toast_container = document.getElementById("toast_container");
//==================================================================//
//end - toast
//==================================================================//






//====================================================//
//Medidas de pantallas para Media Queries - START
//====================================================//

//MOBILE (0px - 767px)
//const pantallaMobileMinPx = 0;//por ahora no lo uso...
//const pantallaMobileMaxPx = 575;//por ahora no lo uso...
const pantallaMobileMaxPx = 767;//por ahora no lo uso...

//TABLET (768px - )
let pantallaTabletMinPx = 768;//valor de tablet y mas (se usa muchisimo!)
//let pantallaTabletMaxPx = 991;//no uso


//let pantallaDesktopSmallMinPx = 992;//no uso
let pantallaTabletMaxPx = 1023;//uso 1 vez!

let pantallaDesktopSmallMinPx = 1024;//uso 1 vez
//let pantallaDesktopSmallMaxPx = 1199;// no uso

//let pantallaDesktopBigMinPx = 1200;//no uso

//Para ver en tablet verticalmente como en móvil
let modoMobile = false;//[true,false]//para ver como si fuera el móvil en tablet 

if(modoMobile){
    pantallaTabletMinPx = 1201;//pongo 1201 y no 1200 ya qye Samsung tab A9+ verticalmente es de 1200
    pantallaTabletMaxPx = 1439;//uso 1 vez
    pantallaDesktopSmallMinPx = 1439;//uso 1 vez
}
//====================================================//
//Medidas de pantallas para Media Queries - END
//====================================================//











let permitirShowToast = true;//para evitar mostrar varios toasts seguidos. uso con song_ajustes


let obj_ajustes_def = {
    objFindParamsAlmacen: {
        words_input: "alco",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },
    objFindParamsCliente: {
        words_input: "demko",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },
    objFindParamsClienteSm: {
        words_input: "demko",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },
    objFindParamsProducto: {
        words_input: "dtf",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },
    objFindParamsServicio: {
        words_input: "10",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },    
    objFindParamsBono: {
        words_input: "5",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },
    objFindParamsTarifa: {
        words_input: "10",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },
    objFindParamsTaquilla: {
        words_input: "1",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },
    objFindParamsPedido: {
        words_input: "10",
        modo: 3,
        buscar_en: 1,
        findedRows: 0,
    },    
}

let obj_ajustes = {};
// obj_ajustes = JSON.parse(localStorage.getItem('obj_ajustes')) || structuredClone(obj_ajustes_def);


try {
    const local_obj_ajustes = JSON.parse(localStorage.getItem('obj_ajustes'));

    if (local_obj_ajustes && typeof local_obj_ajustes === 'object') {
        obj_ajustes = local_obj_ajustes;
    }else{
        obj_ajustes = structuredClone(obj_ajustes_def);//por defecto.
    }

} catch (err) {
    console.error('error al cargar obj_ajustes. error: ', err);
}





// Desestructuración para CREAR ( con let sin parentesis. no redeclarar). ejemplo: let {...} = obj_ajustes;
let {
    objFindParamsAlmacen,
    objFindParamsCliente,
    objFindParamsClienteSm,//buscar cliente en crear pedido
    objFindParamsProducto,
    objFindParamsServicio,
    objFindParamsBono,
    objFindParamsTarifa,
    objFindParamsTaquilla,
    objFindParamsPedido

} = obj_ajustes;

localStorage.setItem('obj_ajustes', JSON.stringify(obj_ajustes));

//Block Activo
let BlockNameActive = localStorage.getItem('BlockNameActive') || 'almacenes';//default

//para pedidos
const arr_divs_permitidos = [
    'd_envio_gratis',
    'd_iva_incluido',
    'd_canal_venta',
    'd_canal_aviso',
    'd_tipo_concepto',
    'contenedor_tipos'
];

const arr_valores_permitidos = [
    'envio_gratis',
    'iva_incluido',
    'canal_venta',
    'canal_aviso',
    'tipo_concepto'
];


let pedido_old = {
    productos: [],
    bonos: [],
    servicios: [],
    subtotal: 0,
    iva_incluido: 1,
    iva_total: 0,
    total: 0
};


//new - como ejemplo
let pedido_def = {
    arr_items_pedido: [
        {
            tipo_concepto: 'producto',
            id: 1,
            nombre: 'DTF Textil',
            cantidad: 6,
            precio: 10,
            importe: 60
        },
        {
            tipo_concepto: 'bono',
            id: 2,
            nombre: 'Bono 5m',
            cantidad: 1,
            precio: 45,
            importe: 45
        },
        {
            tipo_concepto: 'servicio',
            id: 3,
            nombre: 'Envío Express',
            cantidad: 1,
            precio: 15,
            importe: 15
        }
    ],

    subtotal: 0,
    iva_incluido: 1,
    iva_total: 0,
    total: 0
};

let pedido = {
    arr_items_pedido: [],
    subtotal: 0,
    iva_incluido: 1,
    iva_total: 0,
    total: 0
};

let arr_items_pedido_bd = [];
