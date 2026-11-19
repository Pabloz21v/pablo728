/* Catálogo Apple - CRUD en memoria sobre un JSON
   CREATE: crearProducto   READ: leerProductos
   UPDATE: actualizarProducto   DELETE: eliminarProducto
   Cada función modifica el array y vuelve a llamar a leerProductos(). */

// Se lee el JSON que está escrito en index.html y se convierte en un array
const textoJSON = document.getElementById("datos-json").textContent;
let productos = JSON.parse(textoJSON);

// El próximo id es el más alto que haya + 1
let proximoId = 1;
productos.forEach(function (p) {
  if (p.id >= proximoId) {
    proximoId = p.id + 1;
  }
});

const listaProductos = document.getElementById("lista-productos");
const seccionForm    = document.getElementById("seccion-form");
const formProducto   = document.getElementById("form-producto");
const inputId        = document.getElementById("producto-id");
const inputNombre    = document.getElementById("nombre");
const inputCategoria = document.getElementById("categoria");
const inputDescrip   = document.getElementById("descripcion");
const inputImagen    = document.getElementById("imagen");
const inputPrecio    = document.getElementById("precio");
const inputStock     = document.getElementById("stock");
const tituloForm     = document.getElementById("titulo-form");
const btnNuevo       = document.getElementById("btn-nuevo");
const btnCancelar    = document.getElementById("btn-cancelar");


/* ---------- Helpers ---------- */

function buscarProductoPorId(id) {
  let encontrado = null;
  productos.forEach(function (p) {
    if (p.id === id) {
      encontrado = p;
    }
  });
  return encontrado;
}

function buscarIndicePorId(id) {
  let indice = -1;
  productos.forEach(function (p, i) {
    if (p.id === id) {
      indice = i;
    }
  });
  return indice;
}

function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta";

  // la clase de la banda es la categoría en minúscula (iphone, mac, ipad...)
  const banda = document.createElement("div");
  banda.className = "banda " + producto.categoria.toLowerCase();
  banda.textContent = producto.categoria;

  // si el producto tiene foto se arma la imagen y la banda se achica
  let foto = null;
  if (producto.imagen) {
    foto = document.createElement("img");
    foto.className = "foto";
    foto.src = producto.imagen;
    foto.alt = producto.nombre;
    banda.className = banda.className + " chica";
  }

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  const descripcion = document.createElement("p");
  descripcion.className = "descripcion";
  descripcion.textContent = producto.descripcion;

  const precio = document.createElement("p");
  precio.className = "precio";
  precio.textContent = "US$" + producto.precio.toLocaleString("es-AR");

  const stock = document.createElement("small");
  if (producto.stock > 0) {
    stock.textContent = "Stock: " + producto.stock;
  } else {
    stock.textContent = "Sin stock";
    stock.className = "sin-stock";
  }

  const acciones = document.createElement("div");
  acciones.className = "acciones";

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.className = "gris";
  btnEditar.addEventListener("click", function () {
    mostrarFormularioEdicion(producto.id);
  });

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "Eliminar";
  btnEliminar.className = "rojo";
  btnEliminar.addEventListener("click", function () {
    eliminarProducto(producto.id);
  });

  acciones.appendChild(btnEditar);
  acciones.appendChild(btnEliminar);

  if (foto) {
    tarjeta.appendChild(foto);
  }
  tarjeta.appendChild(banda);
  tarjeta.appendChild(titulo);
  tarjeta.appendChild(descripcion);
  tarjeta.appendChild(precio);
  tarjeta.appendChild(stock);
  tarjeta.appendChild(acciones);

  return tarjeta;
}

function mostrarMensaje(texto) {
  listaProductos.textContent = "";
  const parrafo = document.createElement("p");
  parrafo.className = "mensaje";
  parrafo.textContent = texto;
  listaProductos.appendChild(parrafo);
}


/* ---------- Formulario ---------- */

function limpiarFormulario() {
  formProducto.reset();
  inputId.value = "";
  tituloForm.textContent = "Agregar producto";
}

function mostrarFormularioCreacion() {
  limpiarFormulario();
  seccionForm.hidden = false;
  inputNombre.focus();
  seccionForm.scrollIntoView({ behavior: "smooth" });
}

function mostrarFormularioEdicion(id) {
  const producto = buscarProductoPorId(id);
  if (!producto) return;

  inputId.value        = producto.id;
  inputNombre.value    = producto.nombre;
  inputCategoria.value = producto.categoria;
  inputDescrip.value   = producto.descripcion;
  inputImagen.value    = producto.imagen || "";
  inputPrecio.value    = producto.precio;
  inputStock.value     = producto.stock;

  tituloForm.textContent = "Editar producto";
  seccionForm.hidden = false;
  inputNombre.focus();
  seccionForm.scrollIntoView({ behavior: "smooth" });
}

function ocultarFormulario() {
  seccionForm.hidden = true;
  limpiarFormulario();
}


/* ---------- CRUD ---------- */

// CREATE
function crearProducto(datos) {
  const nuevoProducto = {
    id: proximoId,
    nombre: datos.nombre,
    categoria: datos.categoria,
    descripcion: datos.descripcion,
    imagen: datos.imagen,
    precio: datos.precio,
    stock: datos.stock
  };

  proximoId = proximoId + 1;
  productos.push(nuevoProducto);

  leerProductos();
}

// READ
function leerProductos() {
  listaProductos.textContent = "";

  if (productos.length === 0) {
    mostrarMensaje("No hay productos cargados.");
    return;
  }

  productos.forEach(function (producto) {
    const tarjeta = crearTarjetaProducto(producto);
    listaProductos.appendChild(tarjeta);
  });
}

// UPDATE
function actualizarProducto(id, datos) {
  const producto = buscarProductoPorId(id);
  if (!producto) return;

  producto.nombre      = datos.nombre;
  producto.categoria   = datos.categoria;
  producto.descripcion = datos.descripcion;
  producto.imagen      = datos.imagen;
  producto.precio      = datos.precio;
  producto.stock       = datos.stock;

  leerProductos();
}

// DELETE
function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  const indice = buscarIndicePorId(id);
  if (indice === -1) return;

  productos.splice(indice, 1);
  leerProductos();
}


/* ---------- Eventos ---------- */

btnNuevo.addEventListener("click", function () {
  mostrarFormularioCreacion();
});

btnCancelar.addEventListener("click", function () {
  ocultarFormulario();
});

formProducto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datos = {
    nombre: inputNombre.value.trim(),
    categoria: inputCategoria.value,
    descripcion: inputDescrip.value.trim(),
    imagen: inputImagen.value.trim(),
    precio: Number(inputPrecio.value),
    stock: Number(inputStock.value)
  };

  if (inputId.value) {
    actualizarProducto(Number(inputId.value), datos);
  } else {
    crearProducto(datos);
  }

  ocultarFormulario();
});


/* ---------- Inicio ---------- */
leerProductos();
