const productosJSON = [
    {id: 1, nombre: "Aqua Sphere", categoria: "Hogar", precio: 250, imagen: ""},
    {id: 2, nombre: "Solar Leaf", categoria: "Energía", precio: 480, imagen: ""},
    {id: 3, nombre: "Air Pod", categoria: "Transporte", precio: 900, imagen: ""}
];

let productos = [...productosJSON];

const formulario = document.querySelector("#form-producto");
const lista = document.querySelector("#lista-productos");
const campoId = document.querySelector("#producto-id");
const botonCancelar = document.querySelector("#cancelar");
const titulo = document.querySelector("#titulo-formulario");

function leerProductos() {
    lista.innerHTML = "";

    productos.forEach(function(producto) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "col-md-4";

        const caja = document.createElement("div");
        caja.className = "card p-3 h-100";

        if (producto.imagen !== "") {
            const imagen = document.createElement("img");
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;
            imagen.className = "producto-imagen mb-3";
            caja.appendChild(imagen);
        }

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const categoria = document.createElement("p");
        categoria.textContent = producto.categoria;

        const precio = document.createElement("p");
        precio.textContent = producto.precio + " créditos";

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn btn-primary btn-sm me-2";
        botonEditar.addEventListener("click", function() {
            editarProducto(producto.id);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn btn-danger btn-sm";
        botonEliminar.addEventListener("click", function() {
            eliminarProducto(producto.id);
        });

        caja.appendChild(nombre);
        caja.appendChild(categoria);
        caja.appendChild(precio);
        caja.appendChild(botonEditar);
        caja.appendChild(botonEliminar);
        tarjeta.appendChild(caja);
        lista.appendChild(tarjeta);
    });
}

function crearProducto(datos) {
    datos.id = Date.now();
    productos.push(datos);
    leerProductos();
}

function editarProducto(id) {
    const producto = productos.find(function(item) {
        return item.id === id;
    });

    campoId.value = producto.id;
    document.querySelector("#nombre").value = producto.nombre;
    document.querySelector("#categoria").value = producto.categoria;
    document.querySelector("#precio").value = producto.precio;
    document.querySelector("#imagen").value = producto.imagen;

    titulo.textContent = "Editar producto";
    botonCancelar.hidden = false;
}

function actualizarProducto(id, datos) {
    const indice = productos.findIndex(function(item) {
        return item.id === id;
    });

    datos.id = id;
    productos[indice] = datos;
    leerProductos();
}

function eliminarProducto(id) {
    if (confirm("¿Querés eliminar este producto?")) {
        productos = productos.filter(function(item) {
            return item.id !== id;
        });
        leerProductos();
    }
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const datos = {
        nombre: document.querySelector("#nombre").value,
        categoria: document.querySelector("#categoria").value,
        precio: Number(document.querySelector("#precio").value),
        imagen: document.querySelector("#imagen").value
    };

    if (campoId.value === "") {
        crearProducto(datos);
    } else {
        actualizarProducto(Number(campoId.value), datos);
    }

    formulario.reset();
    campoId.value = "";
    botonCancelar.hidden = true;
    titulo.textContent = "Agregar producto";
});

botonCancelar.addEventListener("click", function() {
    formulario.reset();
    campoId.value = "";
    botonCancelar.hidden = true;
    titulo.textContent = "Agregar producto";
});

leerProductos();
