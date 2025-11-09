document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;


    async function agregarProductoNuevo() {
    
        const nuevo = {
        fields: datosForm()};

        try {
            const response = await fetch(API_URL, {
            method: 'POST',
            headers:{
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevo)
        });

        const prdNuevoJson = await response.json();
        console.log('Producto cargado OK', prdNuevoJson); 

        //Limpio form despues de enviar OK
        document.querySelectorAll('.datosForm, .mensajeContacto').forEach(input => input.value = '');

        } catch (error) {
            console.log('Error al intentar cargar producto a Air Table: ', error);
        }
    }

    //Obtengo datos de FORM

    function datosForm() {
    return {
        Name: document.getElementById('nombre').value,
        Price: parseInt(document.getElementById('precio').value),
        Category: document.getElementById('categoria').value,
        Descripcion: document.getElementById('descripcion').value,
        Img: document.getElementById('img').value,
        Img0: document.getElementById('img0').value,
        Img1: document.getElementById('img1').value,
        Img2: document.getElementById('img2').value,
        Img3: document.getElementById('img3').value,
        Marca: document.getElementById('marca').value,
        Modelo: document.getElementById('modelo').value,
        Madera: document.getElementById('madera').value,
        Color: document.getElementById('color').value,
        Diapason: document.getElementById('diapason').value,
        Escala: document.getElementById('escala').value,
        Trastes: parseInt(document.getElementById('traste').value),
        qty: parseInt(document.getElementById('qty').value)
    };
}

document.querySelector('.botonEnviar').addEventListener('click', function(e) {
    e.preventDefault();
    agregarProductoNuevo();
});

})