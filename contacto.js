document.addEventListener('DOMContentLoaded', () => {

    const btnEnviarForm = document.getElementsByClassName('botonEnviar');

    const main = document.querySelector('main');

    const newDivForm = document.createElement('div');

    const newTitleForm = document.createElement('h1');
    newTitleForm.innerText = 'Contactanos';

    const newForm = document.createElement('form');

    function crearSeccionForm(){

        const newDivForm = document.createElement('div');
        const newTitleForm = document.createElement('h1');
        newTitleForm.innerText = 'Contactanos';

        const newForm = document.createElement('form');

        const newPName = document.createElement('p');

        

        return newDivForm;
    }

    btnEnviarForm.addEventListener('click', (event) => {
        event.preventDefault();
        const datosFormulario = JSON.parse(localStorage.getItem('datosFormulario')) || [];
        //Datos de cliente que guardo
        const objetoForm = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('mail').value,
            telefono: document.getElementById('telefono').value,
            mensaje: document.getElementById('msg').value,
            motivo: document.querySelector('input[name="Contacto"]:checked')?.value || ''
            };

        datosFormulario.push(objetoForm);
        localStorage.setItem('datosFormulario', JSON.stringify(datosFormulario));
        })

})