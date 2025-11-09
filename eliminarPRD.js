document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    const productsDomElement = document.querySelector('.listaProductosDelete');

    //Funciones

    function renderProducts(products){
        productsDomElement.innerHTML = '';
        products.forEach(product => {
        const newProduct = createProduct(product);
        productsDomElement.appendChild(newProduct);
    })}

    function createProduct(product){
        //Creo Tarjeta Producto
        const newProduct = document.createElement('div');
        newProduct.setAttribute('class', 'flexListaPrdDelete')

        const productName = document.createElement('p');
        productName.innerText = product.name;
    
       // const newImg = document.createElement('img');
       // newImg.setAttribute('src', product.img);
       // newImg.setAttribute('class', 'imgProductosPrincipal');
       // newImg.setAttribute('alt', product.name);

        const productPrice = document.createElement('p');
        productPrice.innerText =  `$ ${product.price}`;

        const productCategory = document.createElement('p');
        productCategory.innerText =  product.category;

        const productMarca = document.createElement('p');
        productMarca.innerText =  product.marca;

        const productModelo = document.createElement('p');
        productModelo.innerText =  product.modelo;

        const productColor = document.createElement('p');
        productColor.innerText =  product.color;

        const productqty = document.createElement('p');
        productqty.innerText =  product.qty;

        const newDeleteButton = document.createElement('button');
        newDeleteButton.setAttribute('class', 'botonGeneral');
        newDeleteButton.innerText = 'Eliminar Producto';


        newProduct.appendChild(productName);
        //newProduct.appendChild(newImg);
        newProduct.appendChild(productPrice);
        newProduct.appendChild(productCategory);
        newProduct.appendChild(productMarca);
        newProduct.appendChild(productModelo);
        newProduct.appendChild(productColor);
        newProduct.appendChild(productqty);
        newProduct.appendChild(newDeleteButton);

        return newProduct;
    }

//document.querySelector('.botonEnviar').addEventListener('click', function(e) {
//    e.preventDefault();
//    agregarProductoNuevo();
//});

//Obtengo productos de AirTable
    async function getProductsFromAirTable() {
     
        try {
            // Con GET y credenciales obtengo prds de base 
            const response = await fetch(API_URL, {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${API_TOKEN}`,
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
            img: item.fields.Img,
            marca: item.fields.Marca, 
            modelo: item.fields.Modelo, 
            color: item.fields.Color,
            qty: item.fields.qty
        }))
         
        // Con la funcion que tenia muestro los prods en pantalla
        renderProducts(mappedProducts);

        } catch (error) {
            console.log('Error al intentar obtener productos de Air Table.')
        }
    }

    getProductsFromAirTable();


})