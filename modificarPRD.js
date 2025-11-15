document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    function getProductFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('code');
    }

    const codigoProducto = getProductFromURL();
    console.log('Codigo de producto obtenido de URL', codigoProducto);

    //Obtengo producto de AirTable
    async function getProductDetailInd() {
     
        try {
            // Con GET y credenciales obtengo prds de base 
            const response = await fetch(`${API_URL}/${codigoProducto}`, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json' 
            }
        });

        //Si se cumple la promesa paso a json los datos recibidos
        const data = await response.json();
        console.log('Producto obtenido OK', data); 

        //Mapeo la data recibida para que coincidan con mis prds
        const mappedProduct = {
            id: data.id,
            name: data.fields.Name,
            price: data.fields.Price,
            category: data.fields.Category,
            img: data.fields.Img,
            img0: data.fields.Img0,
            img1: data.fields.Img1,
            img2: data.fields.Img2,
            img3: data.fields.Img3,
            qty: data.fields.qty,
            descripcion: data.fields.Descripcion,
            marca: data.fields.Marca, 
            modelo: data.fields.Modelo, 
            madera: data.fields.Madera, 
            color: data.fields.Color, 
            diapason: data.fields.Diapason,
            escala: data.fields.Escala, 
            trastes: data.fields.Trastes
        }
         
        // Cargo info de producto en formulario

            document.getElementById('nombre').value = mappedProduct.name || '';
            document.getElementById('precio').value = mappedProduct.price || '';
            document.getElementById('categoria').value = mappedProduct.category || '';
            document.getElementById('descripcion').value = mappedProduct.descripcion || '';
            document.getElementById('img').value = mappedProduct.img || '';
            document.getElementById('img0').value = mappedProduct.img0 || '';
            document.getElementById('img1').value = mappedProduct.img1 || '';
            document.getElementById('img2').value = mappedProduct.img2 || '';
            document.getElementById('img3').value = mappedProduct.img3 || '';
            document.getElementById('marca').value = mappedProduct.marca || '';
            document.getElementById('modelo').value = mappedProduct.modelo || '';
            document.getElementById('madera').value = mappedProduct.madera || '';
            document.getElementById('color').value = mappedProduct.color || '';
            document.getElementById('diapason').value = mappedProduct.diapason || '';
            document.getElementById('escala').value = mappedProduct.escala || '';
            document.getElementById('traste').value = mappedProduct.trastes || '';
            document.getElementById('qty').value = mappedProduct.qty || '';

        } catch (error) {
            console.log('Error al intentar obtener productos de Air Table: ', error);
        }
    }

    // Guardo prd modificado en Air Table

    async function modificarProducto() {
    
        const fields = {
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

        try {
            const response = await fetch(`${API_URL}/${codigoProducto}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fields})
        });

        const prdModJson = await response.json();
        console.log('Producto modificado OK', prdModJson); 

        //Limpio form despues de enviar OK
        document.querySelectorAll('.datosForm, .mensajeContacto').forEach(input => input.value = '');

        } catch (error) {
            console.log('Error al intentar cargar producto a Air Table: ', error);
        }
    }
    
    //Ejecuciones    
    getProductDetailInd()

    document.getElementById('btnModificar').addEventListener('click', function(e) {
    e.preventDefault();
    modificarProducto();
    });

})