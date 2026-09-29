const eid_style_modcont_body = document.getElementById('style_modcont_body');

//start - modal.js
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
//end - modal.js

const eid_btn_sp_atras = document.getElementById('btn_sp_atras');
const eid_h4_text = document.getElementById('h4_text');//text en el header de modcont_header
const eid_bl_modalFilter = document.getElementById('bl_modalFilter');
const eid_bl_modalFilter_inner = document.getElementById('bl_modalFilter_inner');


// const loginForm = document.getElementById('login_form');
//const login_form = document.getElementById('login_form');
//const btnSubmit = document.getElementById('btn_submit');

const arrIdForms = [
    'bl_register_form',
    'bl_email_form',
    'bl_change_email_form',
    'bl_login_form',
    'bl_sesion_iniciada'
];

let debug = false;
debug = true;//para test. luego comentar!