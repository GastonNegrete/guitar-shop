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

        const contenedor = document.createElement('div');

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

        const tabla = renderProductCarrito(carrito);
        const resumen = renderTotalCarrito(carrito);

        productsDomElement.appendChild(tabla);
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