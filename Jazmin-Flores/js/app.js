/* =====================================================================
   AROMA CAFÉ — CRUD de productos con JSON propio
   Recorrido de un dato:  data/productos.json -> fetch -> array
                          'productos' (estado) -> renderizarCatalogo -> DOM
   Tres partes del archivo: ESTADO (el dato), ENLACE (querySelector +
   addEventListener) y PINTADO (la única función que escribe el catálogo).
   ===================================================================== */


/* ---------------------------------------------------------------------
   PASO 1 — ESTADO
   'let' porque el contenido se reemplaza con Create / Update / Delete.
   'editandoId' vale null cuando el formulario está en modo "crear".
   --------------------------------------------------------------------- */
let productos = [];
let editandoId = null;

// Para mostrar el nombre legible de cada categoría en las tarjetas
const nombresCategoria = {
    granos: 'Granos de café',
    accesorios: 'Accesorios',
    pasteleria: 'Pastelería'
};


/* ---------------------------------------------------------------------
   PASO 2 — GANCHOS: traigo los elementos del HTML por su id (una vez)
   --------------------------------------------------------------------- */
const contenedor = document.querySelector('#contenedor-productos');
const contador = document.querySelector('#contador');
const buscador = document.querySelector('#buscador');
const filtroCategoria = document.querySelector('#filtro-categoria');
const btnNuevo = document.querySelector('#btn-nuevo');

const formulario = document.querySelector('#form-producto');
const formTitulo = document.querySelector('#form-titulo');
const inputNombre = document.querySelector('#input-nombre');
const inputCategoria = document.querySelector('#input-categoria');
const inputDescripcion = document.querySelector('#input-descripcion');
const inputPrecio = document.querySelector('#input-precio');
const inputStock = document.querySelector('#input-stock');
const inputImagen = document.querySelector('#input-imagen');
const btnCancelar = document.querySelector('#btn-cancelar');


/* ---------------------------------------------------------------------
   CONSUMO DEL JSON: fetch pide el archivo y response.json() lo
   convierte de texto a un array de objetos (como JSON.parse).
   fetch es ASÍNCRONO: por eso se usa async / await y try / catch.
   --------------------------------------------------------------------- */
async function cargarProductos() {
    try {
        const respuesta = await fetch('data/productos.json');
        productos = await respuesta.json();   // texto -> array de objetos
        aplicarFiltros();                     // primer dibujado
    } catch (error) {
        console.error('Error al cargar el JSON:', error);
        contador.textContent = 'No se pudieron cargar los productos. ' +
            'Revisá que exista data/productos.json y que la página se abra desde un servidor.';
    }
}


/* ---------------------------------------------------------------------
   PASO 3 — PINTADO (READ): limpiar -> crear -> insertar
   --------------------------------------------------------------------- */
function renderizarCatalogo(lista) {
    // 1. Limpiar el contenedor antes de volver a dibujar (evita duplicados)
    contenedor.innerHTML = '';

    // Si no hay nada para mostrar, se avisa en pantalla
    if (lista.length === 0) {
        const vacio = document.createElement('p');
        vacio.classList.add('mensaje-vacio');
        vacio.textContent = 'No se encontraron productos con esos criterios.';
        contenedor.appendChild(vacio);
        return;
    }

    // 2. Recorrer el array y crear una tarjeta por producto
    lista.forEach((producto) => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('producto-card');
        // data-* guarda el id en la propia tarjeta (Sesión 2) para
        // saber, al hacer click, a qué producto pertenece el botón
        tarjeta.dataset.id = producto.id;
        tarjeta.dataset.categoria = producto.categoria;
        tarjeta.dataset.stock = producto.stock;

        // Imagen: si el producto no tiene URL, se muestra un marco de texto
        if (producto.imagen) {
            const imagen = document.createElement('img');
            imagen.classList.add('producto-imagen');
            imagen.setAttribute('src', producto.imagen);
            imagen.setAttribute('alt', producto.nombre);
            tarjeta.appendChild(imagen);
        } else {
            const marco = document.createElement('div');
            marco.classList.add('producto-sin-imagen');
            marco.textContent = 'Sin imagen';
            tarjeta.appendChild(marco);
        }

        const categoria = document.createElement('p');
        categoria.classList.add('producto-categoria');
        categoria.textContent = nombresCategoria[producto.categoria] || producto.categoria;

        const nombre = document.createElement('h3');
        nombre.classList.add('producto-nombre');
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement('p');
        descripcion.classList.add('producto-descripcion');
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement('p');
        precio.classList.add('producto-precio');
        precio.textContent = `$${producto.precio.toFixed(2)}`;

        // El stock se informa con texto, no solo con color (accesibilidad)
        const stock = document.createElement('p');
        stock.classList.add('producto-stock');
        if (producto.stock === 0) {
            stock.textContent = 'Agotado';
            stock.classList.add('stock-agotado');
        } else if (producto.stock <= 5) {
            stock.textContent = `¡Últimas ${producto.stock} unidades!`;
            stock.classList.add('stock-bajo');
        } else {
            stock.textContent = `Stock: ${producto.stock} u.`;
        }

        // Botones de la tarjeta (se atienden por delegación, más abajo)
        const acciones = document.createElement('div');
        acciones.classList.add('acciones');

        const btnEditar = document.createElement('button');
        btnEditar.setAttribute('type', 'button');
        btnEditar.classList.add('btn', 'btn-secundario', 'btn-editar');
        btnEditar.textContent = 'Editar';

        const btnEliminar = document.createElement('button');
        btnEliminar.setAttribute('type', 'button');
        btnEliminar.classList.add('btn', 'btn-peligro', 'btn-eliminar');
        btnEliminar.textContent = 'Eliminar';

        acciones.append(btnEditar, btnEliminar);

        // 3. Insertar los hijos en la tarjeta y la tarjeta en el contenedor
        tarjeta.append(categoria, nombre, descripcion, precio, stock, acciones);
        contenedor.appendChild(tarjeta);
    });
}


/* ---------------------------------------------------------------------
   BÚSQUEDA + FILTRO: combina texto Y categoría y vuelve a dibujar.
   --------------------------------------------------------------------- */
function aplicarFiltros() {
    const texto = buscador.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;

    const resultado = productos.filter((p) => {
        const coincideTexto = p.nombre.toLowerCase().includes(texto);
        const coincideCategoria = categoria === 'todas' || p.categoria === categoria;
        return coincideTexto && coincideCategoria;
    });

    contador.textContent = `Mostrando ${resultado.length} de ${productos.length} productos`;
    renderizarCatalogo(resultado);
}


/* ---------------------------------------------------------------------
   VALIDACIÓN: guard clause que usan Create y Update
   --------------------------------------------------------------------- */
function datosValidos(datos) {
    if (!datos.nombre || datos.nombre.trim() === '') {
        alert('Completá el nombre del producto');
        return false;
    }
    if (isNaN(datos.precio) || datos.precio < 0) {
        alert('El precio tiene que ser un número válido');
        return false;
    }
    if (isNaN(datos.stock) || datos.stock < 0) {
        alert('El stock tiene que ser un número válido');
        return false;
    }
    return true;
}


/* ---------------------------------------------------------------------
   CRUD — las cuatro operaciones modifican el array 'productos'
   y después vuelven a dibujar la pantalla.
   --------------------------------------------------------------------- */

// CREATE: agrega un producto nuevo al final del array
function agregarProducto(datos) {
    const nuevoProducto = {
        id: Date.now(),      // id único basado en la fecha/hora actual
        ...datos             // spread: copia nombre, descripcion, precio, etc.
    };
    productos.push(nuevoProducto);

    // Se limpian los filtros para que el producto nuevo se vea sí o sí
    buscador.value = '';
    filtroCategoria.value = 'todas';
    aplicarFiltros();
}

// UPDATE: busca la posición con findIndex y reemplaza mezclando lo viejo con lo nuevo
function editarProducto(id, datosActualizados) {
    const index = productos.findIndex((p) => p.id === id);

    if (index === -1) {
        console.error('No se encontró ningún producto con id', id);
        return;
    }

    productos[index] = { ...productos[index], ...datosActualizados };
    aplicarFiltros();
}

// DELETE: pide confirmación y crea un array nuevo sin ese producto
function eliminarProducto(id) {
    const confirmado = confirm('¿Seguro que querés eliminar este producto?');
    if (!confirmado) return;   // el usuario canceló: no hacemos nada

    productos = productos.filter((p) => p.id !== id);

    // Si justo se estaba editando ese producto, se cierra el formulario
    if (editandoId === id) {
        cerrarFormulario();
    }
    aplicarFiltros();
}


/* ---------------------------------------------------------------------
   FORMULARIO: abrir, cerrar y precargar para editar.
   JS decide CUÁNDO se ve; el CSS (.oculto) decide CÓMO.
   --------------------------------------------------------------------- */
function abrirFormulario() {
    formulario.classList.remove('oculto');
    inputNombre.focus();   // el navegador lleva la vista hasta el formulario
}

function cerrarFormulario() {
    formulario.reset();
    editandoId = null;                       // vuelve al modo "crear"
    formTitulo.textContent = 'Nuevo producto';
    formulario.classList.add('oculto');
}

// Precarga el formulario con los datos del producto elegido
function prepararEdicion(id) {
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    editandoId = id;                         // modo "editar"
    formTitulo.textContent = `Editando: ${producto.nombre}`;
    inputNombre.value = producto.nombre;
    inputCategoria.value = producto.categoria;
    inputDescripcion.value = producto.descripcion;
    inputPrecio.value = producto.precio;
    inputStock.value = producto.stock;
    inputImagen.value = producto.imagen;
    abrirFormulario();
}


/* ---------------------------------------------------------------------
   PASO 4 — EVENTOS: cada control queda cableado a una acción
   --------------------------------------------------------------------- */

// Búsqueda en vivo: 'input' se dispara en cada tecla
buscador.addEventListener('input', aplicarFiltros);

// Filtro por categoría: 'change' se dispara al elegir otra opción
filtroCategoria.addEventListener('change', aplicarFiltros);

// Botón "+ Nuevo producto": formulario vacío en modo "crear"
btnNuevo.addEventListener('click', () => {
    cerrarFormulario();   // limpia cualquier edición a medias
    abrirFormulario();
});

btnCancelar.addEventListener('click', cerrarFormulario);

// Envío del formulario: sirve tanto para crear como para editar
formulario.addEventListener('submit', (event) => {
    event.preventDefault();   // evita que la página se recargue

    // Todo lo que viene de un input es texto: se convierte a número
    const datos = {
        nombre: inputNombre.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        precio: parseFloat(inputPrecio.value),
        stock: parseInt(inputStock.value, 10),
        categoria: inputCategoria.value,
        imagen: inputImagen.value.trim()
    };

    if (!datosValidos(datos)) return;

    if (editandoId === null) {
        agregarProducto(datos);            // modo crear
    } else {
        editarProducto(editandoId, datos); // modo editar
    }
    cerrarFormulario();
});

// DELEGACIÓN: UN solo listener en el contenedor atiende los botones de
// TODAS las tarjetas, aunque se vuelvan a crear en cada render.
contenedor.addEventListener('click', (event) => {
    const tarjeta = event.target.closest('.producto-card');
    if (!tarjeta) return;                       // el click no fue en una tarjeta

    const id = Number(tarjeta.dataset.id);      // dataset siempre devuelve texto

    if (event.target.closest('.btn-editar')) {
        prepararEdicion(id);
    }
    if (event.target.closest('.btn-eliminar')) {
        eliminarProducto(id);
    }
});


/* PRIMER DIBUJADO al cargar la página: pedir el JSON y mostrarlo */
cargarProductos();
