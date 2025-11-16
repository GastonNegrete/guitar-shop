    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Contactos';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.querySelector("form");
    const formButton = document.querySelector(".botonEnviar");

        async function agregarContactoNuevo() {

        const nuevoContacto = {
        fields: datosForm()};

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        try {
            const response = await fetch(API_URL, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoContacto)
        });

        const contactoNuevoJson = await response.json();
        console.log('Producto cargado OK', contactoNuevoJson); 
        mostrarToastContacto();

        //Limpio form despues de enviar OK
        formulario.reset();

        } catch (error) {
            console.log('Error al intentar cargar producto a Air Table: ', error);
        }
    }

    //Obtengo datos de FORM

    function datosForm() {
    const motivoSeleccionado = document.querySelector('input[name="Motivo"]:checked');
    return {
        Nombre: document.getElementById('nombre').value,
        Telefono: parseInt(document.getElementById('telefono').value),
        Email: document.getElementById('mail').value,
        Mensaje: document.getElementById('msg').value,
        Motivo: motivoSeleccionado ? motivoSeleccionado.value : ''
    };
}
    
    formButton.addEventListener('click', (event) => {
        event.preventDefault();
        agregarContactoNuevo()
    })

    function mostrarToastContacto() {
        const toast = document.getElementById('alerta-principal');
        toast.classList.add('mostrar');
        setTimeout(() => {
            toast.classList.remove('mostrar');
        }, 3000);
    }

})