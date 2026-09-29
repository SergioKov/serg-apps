const arr_langs = ['ru','ua','es','en','de','it'];//array de idiomas disponibles
let lang = localStorage.getItem('lang') || navigator.languages[1] || 'ru';//idioma por defecto
//lang = 'ddddru';//test ok

let obj_lang = {};