import { API_TOKEN, BASE_ID, TABLE_NAME } from "./env.js";

document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const api_token = API_TOKEN;
    const base_id = BASE_ID;
    const table_name= TABLE_NAME;
    const API_URL = `https://api.airtable.com/v0/${base_id}/${table_name}`;

    //Elementos DOM
    const productsDomElement = document.querySelector('.productosPrincipal'); //DIV Padre de tarjeta productos
    const inputSearch = document.getElementById('input-search-product');
    const categoryFilter = document.querySelectorAll('.opcionesFiltro');

    //Funciones

    function renderProducts(products){
        productsDomElement.innerHTML = '';
        products.forEach(product => {
        const newProduct = createProduct(product);
        productsDomElement.appendChild(newProduct);
    })}

    function filterProducts(text){
        const productsFiltered = listProducts.filter(product => product.name.toLowerCase().includes(text.toLowerCase()));
        return productsFiltered;
    }

     function filterProductsByCategory(category){
        const productsFiltered = listProducts.filter(product => product.category === category);
        return productsFiltered;
    }

    function createProduct(product){
        //Creo Tarjeta Producto
        const newProduct = document.createElement('div');
        newProduct.setAttribute('class', 'tarjetaProducto');

        const newProductName = document.createElement('h2');
        newProductName.innerText = product.name;
    
        const newImg = document.createElement('img');
        newImg.setAttribute('src', product.img);
        newImg.setAttribute('class', 'imgProductosPrincipal');
        newImg.setAttribute('alt', product.name);

        const newProductPrice = document.createElement('h3');
        newProductPrice.innerText =  `$ ${product.price}`;

        const newProductButtonDiv = document.createElement('div');
        newProductButtonDiv.setAttribute('class', 'botonesTarjetaProducto');

        const newCartAnchor = document.createElement('a');
        newCartAnchor.setAttribute('href', './carrito.html');
        newCartAnchor.setAttribute('class', 'botonGeneral');
        newCartAnchor.innerText = 'Agregar al Carrito';
        //Funcion para agregar al carrito (local storage)
        newCartAnchor.addEventListener('click', (event) => {
        event.preventDefault();
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(product);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        })

        const newProductAnchor = document.createElement('a');
        //Armo la URL del producto obteniendo el ID de AirTable con el fetch que uso para recuperar los productos
        newProductAnchor.setAttribute('href', `./producto.html?code=${encodeURIComponent(product.id)}`);
        newProductAnchor.setAttribute('class', 'botonGeneral');
        newProductAnchor.innerText = 'Ver Producto';

        newProduct.appendChild(newProductName);
        newProduct.appendChild(newImg);
        newProduct.appendChild(newProductPrice);
        newProduct.appendChild(newProductButtonDiv);
        newProductButtonDiv.appendChild(newCartAnchor);
        newProductButtonDiv.appendChild(newProductAnchor);

        return newProduct;
    }

    // Eventos

    inputSearch.addEventListener('keyup', (event) => {
        const text = event.target.value;
        const productsFiltered = filterProducts(text);
        renderProducts(productsFiltered);
    })

    categoryFilter.forEach(link =>{
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const text = event.target.innerText.toLowerCase();
            const productsFilteredCategory = filterProductsByCategory(text);
            if (text === 'limpiar') {
                renderProducts(listProducts);
            }else{
                renderProducts(productsFilteredCategory);
            }
    })})

    //Obtengo productos de AirTable
    async function getProductsFromAirTable() {
     
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
        console.log('Productos obtenidos OK', data); 

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

    getProductsFromAirTable();

})

