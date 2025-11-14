document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    const productsDomElement = document.querySelector('.listaProductosDelete');
    

    //Funciones

    function renderProducts(products) {
        productsDomElement.innerHTML = '';
        const tablaProd = crearTablaModificarEliminar(products);
        productsDomElement.appendChild(tablaProd);
    }


    function crearTablaModificarEliminar(products){

        const newProductTable = document.createElement('table');
        newProductTable.setAttribute('class', 'tablaEliminar');
        //TD tabla
        const etiquetas = ["Producto", "Precio", "Categoria", "Marca", "Modelo", "Color",  "Cantidad"];
        const encabezadosTabla = document.createElement('tr');
        etiquetas.forEach(etiqueta => {
            const th = document.createElement('th');
            th.textContent = etiqueta;
            encabezadosTabla.appendChild(th);
        });
        newProductTable.appendChild(encabezadosTabla);

        products.forEach(product => {
        const filaProducto = document.createElement('tr');
        const valores = [product.name, product.price, product.category, product.marca, product.modelo, product.color, product.qty];
        valores.forEach(val => {
            const td = document.createElement('td');
            td.textContent = val || '-';
            filaProducto.appendChild(td);
        });

        //Modificar
        const btnTdMod = document.createElement('td');
        const btnModificar = document.createElement('a');
        btnModificar.setAttribute('href', `./modificarPRDForm.html?code=${encodeURIComponent(product.id)}`);
        btnModificar.textContent = 'Modificar';
        btnModificar.setAttribute('class', 'botonGeneral');
        btnTdMod.appendChild(btnModificar);
        filaProducto.appendChild(btnTdMod);

        //Eliminar
        const btnTdDel = document.createElement('td');
        const btnEliminar = document.createElement('a');
        btnEliminar.setAttribute('id', 'btnEliminar');
        btnEliminar.textContent = 'Eliminar';
        btnTdDel.appendChild(btnEliminar);
        btnTdDel.setAttribute('class', 'botonGeneral');
        filaProducto.appendChild(btnTdDel);
        //Evento para eliminar producto
        btnEliminar.onclick = () => deleteProductsFromAirTable(product.id); 
     
        newProductTable.appendChild(filaProducto);
    });

        return newProductTable;
    }


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

    async function deleteProductsFromAirTable(codigoProducto) {
     
        try {
            // Con GET y credenciales obtengo prds de base 
            const response = await fetch(`${API_URL}/${codigoProducto}`, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json' 
            }
        });

        const data = await response.json();
        console.log('Producto eliminado', data); 
        getProductsFromAirTable();

        } catch (error) {
            console.log('Error al intentar eliminar producto de Air Table.')
        }
    }

    getProductsFromAirTable();

})