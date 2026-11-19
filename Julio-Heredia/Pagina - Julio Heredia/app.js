
let productos = [
    {
        id: 1,
        nombre: "Scattergun",
        precio: 150,
        imagen: "https://img2.wikia.nocookie.net/__cb20130703013033/teamfortress/images/d/d8/Scattergun_item_icon_TF2.png",
        stock: 10,
        categoria: "Armas"
    },
    {
        id: 2,
        nombre: "Rocket Launcher",
        precio: 200,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Rocket_Launcher_item_icon_TF2.png",
        stock: 8,
        categoria: "Armas"
    },
    {
        id: 3,
        nombre: "Flame Thrower",
        precio: 180,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Flame_Thrower_item_icon_TF2.png",
        stock: 6,
        categoria: "Armas"
    },
    {
        id: 4,
        nombre: "Minigun",
        precio: 220,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Minigun_item_icon_TF2.png",
        stock: 5,
        categoria: "Armas"
    },
    {
        id: 5,
        nombre: "Pyro's Beanie",
        precio: 90,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Pyro%27s_Beanie.png",
        stock: 12,
        categoria: "Cosméticos"
    },
    {
        id: 6,
        nombre: "Gentleman's Gatsby",
        precio: 120,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Gentleman%27s_Gatsby.png",
        stock: 7,
        categoria: "Cosméticos"
    },
    {
        id: 7,
        nombre: "Mann Co. Supply Crate Key",
        precio: 250,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Mann_Co._Supply_Crate_Key.png",
        stock: 15,
        categoria: "Herramientas"
    },
    {
        id: 8,
        nombre: "Paint Can",
        precio: 100,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Paint_Can.png",
        stock: 9,
        categoria: "Herramientas"
    },
    {
        id: 9,
        nombre: "Sandvich",
        precio: 75,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Sandvich.png",
        stock: 20,
        categoria: "Misceláneos"
    },
    {
        id: 10,
        nombre: "Kazotsky Kick",
        precio: 300,
        imagen: "https://teamfortress.fandom.com/wiki/Special:FilePath/Kazotsky_Kick.png",
        stock: 4,
        categoria: "Misceláneos"
    }
];

// Elementos del HTML
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const imagen = document.getElementById("imagen");
const stock = document.getElementById("stock");
const categoria = document.getElementById("categoria");

const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const contenedorProductos = document.getElementById("contenedorProductos");

const botonGuardar = document.getElementById("botonGuardar");
const botonCancelar = document.getElementById("botonCancelar");

// Mostrar productos
function renderizarProductos() {
    const texto = buscador.value.toLowerCase();
    const categoriaSeleccionada = filtroCategoria.value;

    contenedorProductos.innerHTML = "";

    const productosFiltrados = productos.filter(producto => {
        const coincideNombre = producto.nombre.toLowerCase().includes(texto);

        const coincideCategoria =
            categoriaSeleccionada === "Todas" ||
            producto.categoria === categoriaSeleccionada;

        return coincideNombre && coincideCategoria;
    });

    if (productosFiltrados.length === 0) {
        contenedorProductos.innerHTML =
            "<p>No se encontraron artículos.</p>";
        return;
    }

    productosFiltrados.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <div class="imagen-producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>

            <div class="informacion-producto">
                <h3>${producto.nombre}</h3>
                <p>Categoría: ${producto.categoria}</p>
                <p>Precio: $${producto.precio}</p>
                <p>Stock: ${producto.stock}</p>

                <div class="acciones">
                    <button class="editar" data-id="${producto.id}">
                        Editar
                    </button>

                    <button class="eliminar" data-id="${producto.id}">
                        Eliminar
                    </button>
                </div>
            </div>
        `;

        const imagenProducto = tarjeta.querySelector("img");

        // Si la imagen no carga, se muestra un texto alternativo
        imagenProducto.addEventListener("error", () => {
            imagenProducto.style.display = "none";
            tarjeta.querySelector(".imagen-producto").textContent =
                "Imagen no disponible";
        });

        contenedorProductos.appendChild(tarjeta);
    });
}

// Agregar o modificar productos
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nuevoProducto = {
        id: productoId.value ? Number(productoId.value) : Date.now(),
        nombre: nombre.value.trim(),
        precio: Number(precio.value),
        imagen: imagen.value.trim(),
        stock: Number(stock.value),
        categoria: categoria.value
    };

    if (productoId.value) {
        const indice = productos.findIndex(
            producto => producto.id === Number(productoId.value)
        );

        if (indice !== -1) {
            productos[indice] = nuevoProducto;
        }
    } else {
        productos.push(nuevoProducto);
    }

    formulario.reset();
    productoId.value = "";
    botonGuardar.textContent = "Agregar artículo";
    botonCancelar.hidden = true;

    renderizarProductos();
});

// Editar y eliminar productos
contenedorProductos.addEventListener("click", function(evento) {
    const id = Number(evento.target.dataset.id);

    if (evento.target.classList.contains("editar")) {
        const producto = productos.find(p => p.id === id);

        if (producto) {
            productoId.value = producto.id;
            nombre.value = producto.nombre;
            precio.value = producto.precio;
            imagen.value = producto.imagen;
            stock.value = producto.stock;
            categoria.value = producto.categoria;

            botonGuardar.textContent = "Guardar cambios";
            botonCancelar.hidden = false;

            formulario.scrollIntoView({ behavior: "smooth" });
        }
    }

    if (evento.target.classList.contains("eliminar")) {
        const confirmar = confirm("¿Seguro que querés eliminar este artículo?");

        if (confirmar) {
            productos = productos.filter(p => p.id !== id);
            renderizarProductos();
        }
    }
});

// Cancelar edición
botonCancelar.addEventListener("click", function() {
    formulario.reset();
    productoId.value = "";

    botonGuardar.textContent = "Agregar artículo";
    botonCancelar.hidden = true;
});

// Buscador y filtros
buscador.addEventListener("input", renderizarProductos);
filtroCategoria.addEventListener("change", renderizarProductos);

// Mostrar productos al iniciar
renderizarProductos();
