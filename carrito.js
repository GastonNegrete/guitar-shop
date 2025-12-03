document.addEventListener('DOMContentLoaded', () => {

    //Info API
    const API_TOKEN = 'patvj4vvgsHhiLs1m.c0c21acba723646db966d0a42231149185a5910124f0deea33c633dd362ea3a1';
    const BASE_ID = 'appBo03PEB9uKUQf3';
    const TABLE_NAME = 'Products';
    const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    //Elementos DOM

    const productsDomElement = document.querySelector('.tarjetasProductos');
    const productsDomElementTotal = document.querySelector('.tarjetaTotal'); 
    //Obtengo productos en carrito

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    function renderProductCarrito(carrito){

        const contenedor = document.createElement('div');
        contenedor.setAttribute('class', 'contenedorCarrito')

        if (carrito.length === 0) {
            const mensaje = document.createElement('h3');
            const btnProductos = document.createElement('a');
            btnProductos.setAttribute('class', 'botonGeneral');
            btnProductos.setAttribute('href', './index.html');
            btnProductos.innerHTML = 'Ver Productos';
            mensaje.textContent = 'Carrito vacío...';
            mensaje.setAttribute('class', 'mensajeCarritoVacio');
            contenedor.appendChild(mensaje);
            contenedor.append(btnProductos);
            return contenedor;
        }
    

        carrito.forEach(producto => {
            const tarjetaProductoCarrito = document.createElement('div');
            tarjetaProductoCarrito.setAttribute('class', 'tarjetaProductoCarrito');
            
            // Nombre
            const nombreProducto = document.createElement('p');
            nombreProducto.setAttribute('class', 'nombreProductoCarrito');
            nombreProducto.textContent = producto.name;

            // Precio
            const precioProducto= document.createElement('p');
            precioProducto.setAttribute('class', 'precioProductoCarrito');
            precioProducto.innerHTML = `<strong>Precio:</strong> $${producto.price}`;

            // Cantidad
            const cantidadProducto = document.createElement('p');
            cantidadProducto.innerHTML = `<strong>Cantidad:</strong> ${producto.cantidad}`;

            // Imagen
            const img = document.createElement('img');
            img.src = producto.img;
            img.alt = producto.name;
            img.setAttribute('class', 'imgCarritoPrd')

            const subtotal = document.createElement('p');
            subtotal.setAttribute('class', 'precioProductoCarrito');
            const total = producto.price * producto.cantidad;
            subtotal.innerHTML = `<strong>Subtotal:</strong> $${total}`;

            const btnEliminar = document.createElement('a');
            btnEliminar.setAttribute('class', 'botonGeneral');
            btnEliminar.setAttribute('id', 'btnEliminar');
            btnEliminar.textContent = 'Eliminar';

            //Evento para eliminar producto
            btnEliminar.onclick = () => {
                const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
                const indiceCarrito = carritoActual.findIndex(item =>
                item.id === producto.id);
                
                if (indiceCarrito !== -1) {
                    carritoActual.splice(indiceCarrito, 1);
                    localStorage.setItem("carrito", JSON.stringify(carritoActual));
                    renderCarritoCompleto();
                }
            };

            tarjetaProductoCarrito.appendChild(img);
            tarjetaProductoCarrito.appendChild(nombreProducto);
            tarjetaProductoCarrito.appendChild(precioProducto);
            tarjetaProductoCarrito.appendChild(cantidadProducto);
            tarjetaProductoCarrito.appendChild(subtotal);
            tarjetaProductoCarrito.appendChild(btnEliminar);

            contenedor.appendChild(tarjetaProductoCarrito);
            
        });

        return contenedor;
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

        const btnVaciar = document.createElement('a');
        btnVaciar.setAttribute('class', 'botonGeneral');
        btnVaciar.setAttribute('id', 'btnEliminar');
        btnVaciar.textContent = 'Vaciar Carrito';
        btnVaciar.onclick = () => {localStorage.setItem("carrito", JSON.stringify([]));
            renderCarritoCompleto();
        };

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
                mostrarToastCompra(`No hay suficiente stock para: ${sinStock.map(p => p.name).join(', ')}`);
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
                if (carrito.length != 0) {
                    localStorage.setItem("carrito", JSON.stringify([]));
                    renderCarritoCompleto();
                    mostrarToastCompra('Compra finalizada con exito');
                }
              //  localStorage.setItem("carrito", JSON.stringify([]));
              //  renderCarritoCompleto();
              //  mostrarToastCompra('Compra finalizada con exito');

            } catch (error) {
                console.error("Error al finalizar la compra:", error);
            }
        };
        divTotalCompra.appendChild(tituloResumen);
        divTotalCompra.appendChild(totalCarrito);
        divTotalCompra.appendChild(botonFinalizar);
        divTotalCompra.appendChild(btnVaciar);

        return divTotalCompra;
    }

    function renderCarritoCompleto() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

        productsDomElement.innerHTML = "";
        productsDomElementTotal.innerHTML = "";

        const tarjetas = renderProductCarrito(carrito);
        const resumen = renderTotalCarrito(carrito);

        productsDomElement.appendChild(tarjetas);
        productsDomElementTotal.appendChild(resumen);
    }

    function mostrarToastCompra(mensaje) {
        const toast = document.getElementById('alerta-principal');
        const mensajeToast = document.getElementById('toast-mensaje');
        mensajeToast.textContent = mensaje;
        toast.classList.add('mostrar');
        setTimeout(() => {
            toast.classList.remove('mostrar');
        }, 3000);
    }

    renderCarritoCompleto();

})