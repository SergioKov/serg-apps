

window.addEventListener('DOMContentLoaded', () => {

    if(document.body.dataset.logout == '1'){

        showToastLogin(
            'ok',
            'Has cerrado sesión',
            3000,
            'center'
        );

        // limpiar URL
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );

    }

    const loginErrors = document.getElementById('login_errors');

    if(loginErrors){

        const errores = JSON.parse(loginErrors.dataset.errors);

        showToastLogin(
            'error',
            errores.join('<br>'),
            null,
            'center',
            true,
            'Error'
        );
    }

    setTimeout(()=>{
        openModal('top',null,null,'showLogin');
    },1000);




});

// When the user clicks anywhere outside of the eid_myModal, close it
window.onclick = (e)=>{
    //console.log('window.onclick on eid_myModal');
    if(e.target == eid_myModal || e.target == eid_myModalContent){
        closeModal(null,true);//click_fuera_o_x
    }
}

// loginForm.addEventListener('submit', async (e) => {
//     console.log('=== click en btn_submit ===');

//     e.preventDefault();

//     await iniciarSesionHS();
// });