import { API_TOKEN, BASE_ID, TABLE_NAME } from "./env.js";

document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const api_token = API_TOKEN;
    const base_id = BASE_ID;
    const table_name= TABLE_NAME;
    const API_URL = `https://api.airtable.com/v0/${base_id}/${table_name}/${product.id}`;

    function getProductFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('code');
    }

    const codigoProducto = getProductFromURL();
    console.log('Codigo de producto obtenido de URL', codigoProducto);

        //Obtengo productos de AirTable
    async function getProductsDetail() {
     
        try {
            // Con GET y credenciales obtengo prds de base 
            const response = await fetch(API_URL, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${api_token}`,
                'Content-Type': 'application/json' 
            }
        });

        //Si se cumple la promesa paso a json los datos recibidos
        const data = await response.json();
        console.log('Producto obtenido OK', data); 

        //Mapeo la data recibida para que coincidan con mis prds
        const mappedProducts = data.records.map(item => ({
            id: item.id,
            name: item.fields.Name,
            price: item.fields.Price,
            category: item.fields.Category,
            img: item.fields.Img
        }))
         
        // Con la funcion que tenia muestro los prods en pantalla
        renderProducts(mappedProducts);

        } catch (error) {
            console.log('Error al intentar obtener productos de Air Table.')
        }
    }
    
})