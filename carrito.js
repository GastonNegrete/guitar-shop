document.addEventListener('DOMContentLoaded', () => {
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
            img.style.width = "80px";
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
                const nuevoCarrito = carritoActual.filter(item => item.id !== producto.id);
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