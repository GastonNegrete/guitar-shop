document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    //Elementos DOM
    const productsDomElement = document.querySelector('.tarjetaSinProducto');
    const productsDomElementTotal = document.querySelector('.tarjetaTotal');
  
    //Obtengo productos en carrito

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function renderProductCarrito(carrito){
        const newProductTable = document.createElement('table');
        newProductTable.setAttribute('class', 'tablaEliminar');
        //TD tabla
        const etiquetas = ["Producto", "Precio", "Cantidad", "Imagen", "Subtotal"];

       const encabezadosTabla = document.createElement('tr');
        etiquetas.forEach(etiqueta => {
            const th = document.createElement('th');
            th.textContent = etiqueta;
            encabezadosTabla.appendChild(th);
        });
        newProductTable.appendChild(encabezadosTabla);


        carrito.forEach(producto => {
            const filaProducto = document.createElement('tr');
            // Nombre
            const tdName = document.createElement('td');
            tdName.textContent = producto.name;
            filaProducto.appendChild(tdName);

            // Precio
            const tdPrice = document.createElement('td');
            tdPrice.textContent = `$${producto.price}`;
            filaProducto.appendChild(tdPrice);

            // Cantidad
            const tdQty = document.createElement('td');
            tdQty.textContent = producto.cantidad;
            filaProducto.appendChild(tdQty);

            // Imagen
            const tdImg = document.createElement('td');
            const img = document.createElement('img');
            img.src = producto.img;
            img.alt = producto.name;
            img.setAttribute('class', 'imgCarritoPrd')
            tdImg.appendChild(img);
            filaProducto.appendChild(tdImg);

            const tdSubtotal = document.createElement('td');
            if (producto.cantidad > 1){
                tdSubtotal.textContent = `$${producto.price * producto.cantidad}`;
            }else{
                tdSubtotal.textContent = `$${producto.price}`
            }
            
            filaProducto.appendChild(tdSubtotal);

            const btnTd = document.createElement('td');
            const btnEliminar = document.createElement('a');
            btnEliminar.setAttribute('class', 'botonGeneral');
            btnEliminar.setAttribute('id', 'btnEliminar');
            btnEliminar.textContent = 'Eliminar';
            btnTd.appendChild(btnEliminar);
            filaProducto.appendChild(btnTd);

            const btnTd2 = document.createElement('td');
            const btnVaciarTd = document.createElement('a');
            btnVaciarTd.setAttribute('class', 'botonGeneral');
            btnVaciarTd.setAttribute('id', 'btnEliminar');
            btnVaciarTd.textContent = 'Vaciar';
            btnTd2.appendChild(btnVaciarTd);
            filaProducto.appendChild(btnTd2);

            //Evento para eliminar producto
            btnEliminar.onclick = () => {
                const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
                const nuevoCarrito = carritoActual.filter(item => item.id !== producto.id);
                localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
                renderCarritoCompleto();
            };

            //Evento para vaciar carrito
            btnVaciarTd.onclick = () => {
                const nuevoCarrito = [];
                localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
                renderCarritoCompleto();
            };

            newProductTable.appendChild(filaProducto);

        });

        return newProductTable;
    }
       
    function renderTotalCarrito(carrito){
        let totalCompra = 0;

        carrito.forEach(producto => {
            totalCompra += producto.price * producto.cantidad;
        });

        const divTotalCompra = document.createElement('div');
        divTotalCompra.setAttribute('class', 'compraResumenTarjeta')

        const tituloResumen = document.createElement('h3');
        tituloResumen.textContent = 'Resumen de Compra';

        const totalCarrito = document.createElement('p')
        totalCarrito.innerText = `$${totalCompra}`;

        const botonFinalizar = document.createElement('a');
        botonFinalizar.href = ''; 
        botonFinalizar.textContent = 'Finalizar Compra';
        botonFinalizar.setAttribute('class', 'botonGeneral');

        //Evento para eliminar producto
        botonFinalizar.onclick = async (event) => {
        event.preventDefault();

        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        let mappedProducts = [];

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            console.log('Productos obtenidos OK', data);

            mappedProducts = data.records.map(item => ({
                id: item.id, 
                name: item.fields.Name,
                price: item.fields.Price,
                qty: item.fields.qty
            }));
            } catch (error) {
                console.log('Error al intentar obtener productos de Air Table.');
                return;
            }

            // Validar stock
            const sinStock = carrito.filter(producto => {
                const productoBase = mappedProducts.find(p => p.id === producto.id);
                return productoBase.qty < producto.cantidad;
            });

            if (sinStock.length > 0) {
                alert(`No hay suficiente stock para: ${sinStock.map(p => p.name).join(', ')}`);
                return;
            }
            // Actualizar stock en Airtable
            try {
                for (const producto of carrito) {
                    const productoBase = mappedProducts.find(p => p.id === producto.id);
                    const nuevoStock = productoBase.qty - producto.cantidad;

                    const response = await fetch(`${API_URL}/${producto.id}`, {
                        method: 'PATCH',
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fields: {
                                qty: nuevoStock
                            }
                        })
                    });
                    console.log(response);

                    if (!response.ok) {
                    console.error(`Error PATCH: ${response.status} ${response.statusText}`);
                    console.error(await response.text());
                    } else {
                        const resData = await response.json();
                        console.log("Respuesta PATCH:", resData);
                    }

                }

                // Vaciar carrito y confirmar
                localStorage.setItem("carrito", JSON.stringify([]));
                renderCarritoCompleto();
                alert("¡Compra realizada con éxito!");

            } catch (error) {
                console.error("Error al finalizar la compra:", error);
            }
        };
        divTotalCompra.appendChild(tituloResumen);
        divTotalCompra.appendChild(totalCarrito);
        divTotalCompra.appendChild(botonFinalizar);

        return divTotalCompra;
    }

    function renderCarritoCompleto() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        productsDomElement.innerHTML = "";
        productsDomElementTotal.innerHTML = "";

        const tabla = renderProductCarrito(carrito);
        const resumen = renderTotalCarrito(carrito);

        productsDomElement.appendChild(tabla);
        productsDomElementTotal.appendChild(resumen);
    }

    renderCarritoCompleto();

})