
// ========================================
// ELEMENTOS DEL BUSCADOR Y FILTROS
// ========================================

const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const precioMinimo = document.getElementById("precioMinimo");
const precioMaximo = document.getElementById("precioMaximo");
const ordenamiento = document.getElementById("ordenamiento");
const botonLimpiar = document.getElementById("limpiarFiltros");


// ========================================
// FUNCIÓN PRINCIPAL DE FILTRADO
// ========================================

function aplicarFiltros() {

    // Copiamos todos los productos.
    let productosFiltrados = [...productos];

    // Obtenemos los valores de los filtros.
    const textoBusqueda = buscador.value.toLowerCase().trim();
    const categoriaSeleccionada = filtroCategoria.value;
    const minimo = precioMinimo.value;
    const maximo = precioMaximo.value;


    // FILTRAR POR NOMBRE Y DESCRIPCIÓN
    productosFiltrados = productosFiltrados.filter(producto => {

        return producto.nombre.toLowerCase().includes(textoBusqueda) ||
               producto.descripcion.toLowerCase().includes(textoBusqueda);

    });


    // FILTRAR POR CATEGORÍA
    if (categoriaSeleccionada !== "") {

        productosFiltrados = productosFiltrados.filter(producto =>
            producto.categoria === categoriaSeleccionada
        );

    }


    // FILTRAR POR PRECIO MÍNIMO
    if (minimo !== "") {

        productosFiltrados = productosFiltrados.filter(producto =>
            producto.precio >= Number(minimo)
        );

    }


    // FILTRAR POR PRECIO MÁXIMO
    if (maximo !== "") {

        productosFiltrados = productosFiltrados.filter(producto =>
            producto.precio <= Number(maximo)
        );

    }


    // ========================================
    // ORDENAMIENTO
    // ========================================

    if (ordenamiento.value === "menor") {

        productosFiltrados.sort((a, b) => a.precio - b.precio);

    } else if (ordenamiento.value === "mayor") {

        productosFiltrados.sort((a, b) => b.precio - a.precio);

    } else if (ordenamiento.value === "nombre") {

        productosFiltrados.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
        );

    }


    // MOSTRAR RESULTADOS
    mostrarProductos(productosFiltrados);

}


// ========================================
// EVENTOS DE LOS FILTROS
// ========================================

// Buscar mientras el usuario escribe.
buscador.addEventListener("input", aplicarFiltros);

// Actualizar al cambiar categoría.
filtroCategoria.addEventListener("change", aplicarFiltros);

// Actualizar al modificar precios.
precioMinimo.addEventListener("input", aplicarFiltros);
precioMaximo.addEventListener("input", aplicarFiltros);

// Actualizar al cambiar ordenamiento.
ordenamiento.addEventListener("change", aplicarFiltros);


// ========================================
// LIMPIAR TODOS LOS FILTROS
// ========================================

botonLimpiar.addEventListener("click", function() {

    buscador.value = "";
    filtroCategoria.value = "";
    precioMinimo.value = "";
    precioMaximo.value = "";
    ordenamiento.value = "";

    // Volvemos a mostrar todos los productos.
    aplicarFiltros();

});
