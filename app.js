document.addEventListener('DOMContentLoaded', () => {
    //Datos
    const listProducts = [
        {name: 'Fender Vintera II Telecaster', price: 50000, img:'./img/fender-vintera-ii-road-worn-60s-tele-mn-blonde.jpg', category: 'guitarra'},
        {name: 'Fender Vintera 60 Stratocaster', price: 50000, img:'./img/fender-vintera-ii-road-worn-60s-strat-rw-sbl.jpg', category: 'guitarra'},
        {name: 'Fender Vintera 50 Jazzmaster', price: 50000, img:'./img/fender-vintera-ii-road-worn-50s-jazzmaster-rw-frd.jpg', category: 'guitarra'},
        {name: 'Epiphone Les Paul Custom', price: 50000, img:'./img/epiphone-les-paul-custom-quilt-ocean-blue.jpg', category: 'guitarra'},
        {name: 'Gibson Les Paul Custom 70', price: 50000, img:'./img/gibson-les-paul-custom-70s-eb.jpg', category: 'guitarra'},
        {name: 'Gretsch Synchromatic Falcon', price: 50000, img:'./img/gretsch-synchromatic-falcon-hollow-sc-bigsby-eb-black.jpg', category: 'guitarra'},
        {name: 'Yamaha Revstar RSS02T', price: 50000, img:'./img/yamaha-revstar-rss02t-fire-red.jpg', category: 'guitarra'},
        {name: 'Ibanez JSM10EM-TTB', price: 50000, img:'./img/ibanez-jsm10em-ttb.jpg', category: 'amplificador'}
    ];

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

        const newProductAnchor = document.createElement('a');
        newProductAnchor.setAttribute('href', './producto.html');
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

    renderProducts(listProducts);
})