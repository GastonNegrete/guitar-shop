document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    //const productsDomElementInd = document.querySelector('main'); //DIV Padre de tarjeta producto

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
            datosTabla: [data.fields.Marca, 
                         data.fields.Modelo, 
                         data.fields.Madera, 
                         data.fields.Color, 
                         data.fields.Diapason,
                         data.fields.Escala, 
                         data.fields.Trastes]
        }
         
        // Con la funcion que tenia muestro los prods en pantalla

            const main = document.querySelector('main');
            renderProductDescription(mappedProduct, main);

        } catch (error) {
            console.log('Error al intentar obtener productos de Air Table: ', error);
        }

    }

    function crearSeccionPrincipal(product){

        //Section Inicio Producto
        const newProductInd = document.createElement('section');
        newProductInd.setAttribute('class', 'flexProductoIndividual bordesSeparadores');

        //Imagen individual
        const newImgInd = document.createElement('img');
        newImgInd.setAttribute('src', product.img0);
        newImgInd.setAttribute('class', 'imgProductoIndividual');
        newImgInd.setAttribute('alt', product.name);

        //Flex tarjeta info
        const newProductCardDiv = document.createElement('div');
        newProductCardDiv.setAttribute('class', 'flexTarjetaCompra');
        //Titulo
        const newTitleProduct = document.createElement('h2');
        newTitleProduct.innerText = product.name;
        //Precio
        const newProductPriceInd = document.createElement('h2');
        newProductPriceInd.innerText =  `$ ${product.price}`;

        //Contenedor Buttons
        const newProductButtonDivInd = document.createElement('div');
        //Boton Carrito
        const newCartAnchorInd = document.createElement('a');
        newCartAnchorInd.setAttribute('href', './carrito.html');
        newCartAnchorInd.setAttribute('class', 'botonGeneral');
        newCartAnchorInd.innerText = 'Agregar al Carrito';
        //Funcion para agregar al carrito (local storage)
        newCartAnchorInd.addEventListener('click', (event) => {
        event.preventDefault();
        const qtyPRD = parseInt(document.getElementById('cantidadSelect').value);
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        //Datos que voy a mostrar en carrito
        const objetoCarrito = {
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                cantidad: qtyPRD
            };
        carrito.push(objetoCarrito);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        })

        const newProductAnchor = document.createElement('a');
        newProductAnchor.setAttribute('href', '#Descripcion');
        newProductAnchor.setAttribute('class', 'botonGeneral');
        newProductAnchor.innerText = 'Ver Descripcion';

        const newUListProduct = document.createElement('ul');
        const newElementListProduct1 = document.createElement('li');
        newElementListProduct1.setAttribute('class','elementoLista')
        newElementListProduct1.innerText = 'Tarjeta de credito s/interes';
        const newElementListProduct2 = document.createElement('li');
        newElementListProduct2.setAttribute('class','elementoLista')
        newElementListProduct2.innerText = 'Envio gratuito para CABA y alrededores';
        const newElementListProduct3 = document.createElement('li');
        newElementListProduct3.setAttribute('class','elementoLista')
        newElementListProduct3.innerText = 'Envios a todo el pais';
        const newElementListProduct4 = document.createElement('li');
        newElementListProduct4.setAttribute('class','elementoLista')
        newElementListProduct4.innerText = 'Producto con garantia de fabrica.';

        const newElementQtyEtiqueta = document.createElement('p');
        newElementQtyEtiqueta.setAttribute('class','infoqty')
        newElementQtyEtiqueta.innerText = `Cantidad: `;

        const newElementQty = document.createElement('p');
        newElementQty.setAttribute('class','infoqty')
        newElementQty.innerText = `${product.qty} disponibles`;
    
        newProductInd.appendChild(newImgInd);
        newProductInd.appendChild(newProductCardDiv);
        //Tarjeta Flex
        newProductCardDiv.appendChild(newTitleProduct);
        newProductCardDiv.appendChild(newProductPriceInd);
        //Lista Info
        newProductCardDiv.appendChild(newUListProduct);
        newUListProduct.appendChild(newElementListProduct1);
        newUListProduct.appendChild(newElementListProduct2);
        newUListProduct.appendChild(newElementListProduct3);
        newUListProduct.appendChild(newElementListProduct4);

        //Manejo cantidades

        newProductCardDiv.appendChild(newElementQty);

        if (product.qty > 0) {
        const labelQty = document.createElement('label');
        labelQty.setAttribute('for', 'cantidad');
        labelQty.textContent = 'Cantidad:';

        const selectQty = document.createElement('select');
        selectQty.id = 'cantidadSelect';
        selectQty.name = 'cantidad';

        for (let i = 1; i <= product.qty; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}`;
            selectQty.appendChild(option);
        }

        newProductCardDiv.appendChild(labelQty);
        newProductCardDiv.appendChild(selectQty);
        }
        
        //Flex botones
        newProductCardDiv.appendChild(newProductButtonDivInd);
        newProductButtonDivInd.appendChild(newProductAnchor);
        newProductButtonDivInd.appendChild(newCartAnchorInd);

        return newProductInd;
    }

    function crearSeccionTabla(product) {
         //Section Tabla
        const newTableSection = document.createElement('section');
        newTableSection.setAttribute('class', 'bordesSeparadores');
        newTableSection.setAttribute('id', 'Caracteristicas');

        const newProductTable = document.createElement('table');
        newProductTable.setAttribute('class', 'estiloTabla');

        //Titulo Tabla
        const newTitleTable = document.createElement('h2');
        newTitleTable.innerText = 'Caracteristicas del Producto';

        //TD tabla
        const etiqueta = ["Marca", "Modelo", "Madera", "Color", "Diapasón", "Escala", "Trastes"];

        product.datosTabla.forEach((producto, i) => {
            // Crear una nueva fila
            const tr = document.createElement('tr');
            // Iterar sobre los datos de la fila
            const th = document.createElement('th');
            th.textContent = etiqueta[i];

            const td = document.createElement('td');
            td.textContent = producto;
            
            tr.appendChild(th);
            tr.appendChild(td);
            // Agrego fila
            newProductTable.appendChild(tr);
        });

        newTableSection.appendChild(newTitleTable);
        newTableSection.appendChild(newProductTable);
        return newTableSection;
    }

    function crearSeccionImgs(product) {
        const newImgSection = document.createElement('section');
        newImgSection.setAttribute('class', 'bordesSeparadores');

        const newImgTitle = document.createElement('h2');
        newImgTitle.setAttribute('class', 'titulosProductoDetalle');
        newImgTitle.innerText = 'Imagenes del Producto';

        newImgSection.appendChild(newImgTitle);

        //Iteracion para mostrar imagenes
        for (let i = 1; i <= 3; i++) {
        const src = product[`img${i}`];
        if (src) {
            const newImgDetalle = document.createElement('img');
            newImgDetalle.setAttribute('src', src);
            newImgDetalle.setAttribute('alt', product.name);
            newImgDetalle.setAttribute('class', 'imgProductoDetalle');
            newImgSection.appendChild(newImgDetalle);
        }}  

        return newImgSection;
    }

    function crearSeccionDescripcion(product) {
        const newParagraphSection = document.createElement('section');

        const newParTitle = document.createElement('h2');
        newParTitle.setAttribute('class', 'titulosProductoDetalle');
        newParTitle.setAttribute('id', 'Descripcion');
        newParTitle.innerText = 'Descripcion del Producto';

        const newTextDescription = document.createElement('p');
        newTextDescription.setAttribute('class', 'parrafoDescripcionProducto');
        newTextDescription.innerText = product.descripcion;

        newParagraphSection.appendChild(newParTitle);
        newParagraphSection.appendChild(newTextDescription);

        return newParagraphSection;
    }

    function renderProductDescription(product, section){
        section.appendChild(crearSeccionPrincipal(product));
        section.appendChild(crearSeccionTabla(product));
        section.appendChild(crearSeccionImgs(product));
        section.appendChild(crearSeccionDescripcion(product));
    }

    //Ejecuciones    
    getProductDetailInd()



})