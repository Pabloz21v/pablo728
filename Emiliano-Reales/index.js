
// ARRAY DONDE VAMOS A GUARDAR LOS PRODUCTOS
let productos = [];


// CARGAR LOS PRODUCTOS DEL ARCHIVO JSON
fetch("index.json")
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {

        productos = datos;

        leerProductos();

    });


// BUSCAR PRODUCTO POR ID
function buscarProductoPorId(id) {

    let producto = productos.find(function(producto) {
        return producto.id === id;
    });

    return producto;

}


// CREAR TARJETA DEL PRODUCTO
function crearTarjetaProducto(producto) {

    let tarjeta = document.createElement("article");
    tarjeta.className = "producto";

    let nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    let descripcion = document.createElement("p");
    descripcion.textContent = producto.descripcion;

    let categoria = document.createElement("p");
    categoria.textContent = "Categoría: " + producto.categoria;

    let precio = document.createElement("p");
    precio.textContent = "Precio: $" + producto.precio;

    let stock = document.createElement("p");
    stock.textContent = "Stock: " + producto.stock;


    let botonEditar = document.createElement("button");
    botonEditar.textContent = "Editar";

    botonEditar.addEventListener("click", function() {
        mostrarFormularioEdicion(producto.id);
    });


    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", function() {
        eliminarProducto(producto.id);
    });


    tarjeta.appendChild(nombre);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(categoria);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(stock);
    tarjeta.appendChild(botonEditar);
    tarjeta.appendChild(botonEliminar);

    return tarjeta;

}


// CREAR PRODUCTO (CREATE)
function crearProducto(datos) {

    let nuevoProducto = {

        id: Date.now(),
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        categoria: datos.categoria,
        precio: datos.precio,
        stock: datos.stock

    };

    productos.push(nuevoProducto);

    leerProductos();

}



function leerProductos() {

    let lista = document.querySelector("#lista-productos");

    lista.innerHTML = "";

    productos.forEach(function(producto) {

        let tarjeta = crearTarjetaProducto(producto);

        lista.appendChild(tarjeta);

    });

}


// ACTUALIZAR PRODUCTO (UPDATE)
function actualizarProducto(id, datos) {

    let producto = buscarProductoPorId(id);

    if (producto != undefined) {

        producto.nombre = datos.nombre;
        producto.descripcion = datos.descripcion;
        producto.categoria = datos.categoria;
        producto.precio = datos.precio;
        producto.stock = datos.stock;

        leerProductos();

    }

}


// ELIMINAR PRODUCTO (DELETE)
function eliminarProducto(id) {

    productos = productos.filter(function(producto) {
        return producto.id !== id;
    });

    leerProductos();

}


// MOSTRAR FORMULARIO PARA EDITAR
function mostrarFormularioEdicion(id) {

    let producto = buscarProductoPorId(id);

    if (producto != undefined) {

        document.querySelector("#id").value = producto.id;
        document.querySelector("#nombre").value = producto.nombre;
        document.querySelector("#descripcion").value = producto.descripcion;
        document.querySelector("#categoria").value = producto.categoria;
        document.querySelector("#precio").value = producto.precio;
        document.querySelector("#stock").value = producto.stock;

        document.querySelector("#botonAgregar").textContent = "Guardar cambios";

    }

}


// BOTON CANCELAR
document.querySelector("#botonCancelar").addEventListener("click", function() {

    document.querySelector("#formulario").reset();

    document.querySelector("#id").value = "";

    document.querySelector("#botonAgregar").textContent = "Agregar producto";

});


// FORMULARIO
document.querySelector("#formulario").addEventListener("submit", function(evento) {

    evento.preventDefault();

    let id = document.querySelector("#id").value;

    let datos = {

        nombre: document.querySelector("#nombre").value,
        descripcion: document.querySelector("#descripcion").value,
        categoria: document.querySelector("#categoria").value,
        precio: parseFloat(document.querySelector("#precio").value),
        stock: parseInt(document.querySelector("#stock").value)

    };


    if (id == "") {

        crearProducto(datos);

    } else {

        actualizarProducto(parseInt(id), datos);

    }


    document.querySelector("#formulario").reset();

    document.querySelector("#id").value = "";

    document.querySelector("#botonAgregar").textContent = "Agregar producto";

});
