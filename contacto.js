document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.querySelector("form");
    const formButton = document.querySelector(".botonEnviar");
    
    formButton.addEventListener('click', (event) => {
        event.preventDefault();
        const datosFormulario = JSON.parse(localStorage.getItem('datosFormulario')) || [];
        //Datos de cliente que guardo
        const objetoForm = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('mail').value,
            telefono: document.getElementById('telefono').value,
            mensaje: document.getElementById('msg').value,
            motivo: document.querySelector('input[name="Motivo"]:checked')?.value || ''
            };

        datosFormulario.push(objetoForm);
        console.log("Formulario guardado:", datosFormulario);
        localStorage.setItem('datosFormulario', JSON.stringify(datosFormulario));
        formulario.reset();
    })

})