// Arreglo inicial de objetos con los productos de la tienda "Entre Bombillas".
const datosIniciales = [
  { id: 1, nombre: "Playadito Suave", peso: "1klg", tipo: "Con Palo", precio: 4200, stock: 10 },
  { id: 2, nombre: "Taragüi Sin Palo", peso: "500gr", tipo: "Sin Palo", precio: 2600, stock: 8 },
  { id: 3, nombre: "CBSé Hierbas Serranas", peso: "500gr", tipo: "Compuesta", precio: 2400, stock: 12 },
  { id: 4, nombre: "La Merced Barbacuá ", peso: "500gr", tipo: "Barbacua", precio: 5100, stock: 5 }
];

// Lee de localStorage la base de datos o usa los datos iniciales si está vacío.
// Se vincula con toda la persistencia de datos de la página.
let yerbas = JSON.parse(localStorage.getItem("yerbas_db")) || datosIniciales;

// ==========================================
// REFERENCIAS A LOS ELEMENTOS DEL HTML (DOM)
// ==========================================

// Captura la etiqueta <form id="form-yerba"> para controlar el CRUD de creación/edición.
const form = document.getElementById("form-yerba");

// Captura la etiqueta <div id="lista-productos" class="grilla"> donde se dibujará dinámicamente el catálogo.
const listaProductos = document.getElementById("lista-productos");

// ==========================================
// FUNCIÓN GENERAL DE SINCRONIZACIÓN Y GUARDADO
// ==========================================
// Guarda los cambios en el navegador y redibuja la tienda en pantalla.
function guardarYActualizar() {
  localStorage.setItem("yerbas_db", JSON.stringify(yerbas));
  renderizarTienda();
}

// ==========================================
// CRUD: READ (Leer y mostrar el catálogo en el HTML)
// ==========================================
// Recorre el arreglo de yerbas y genera tarjetas HTML dentro de <div id="lista-productos">.
function renderizarTienda() {
  // Limpia el contenedor antes de renderizar para evitar duplicados en pantalla.
  listaProductos.innerHTML = "";

  // Itera sobre cada objeto del arreglo "yerbas".
  yerbas.forEach((yerba) => {
    // Crea un elemento <div> en memoria para cada tarjeta de producto.
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    // Inyecta el contenido HTML con los datos de la yerba y los botones de acción vinculados a funciones.
    tarjeta.innerHTML = `
      <h3>${yerba.nombre}</h3>
      <p>Tipo: ${yerba.tipo}</p>
      <p>Peso: ${yerba.peso}</p>
      <p>Precio: <strong>$${yerba.precio}</strong></p>
      <p>Stock disponible: ${yerba.stock}</p>
      
      <button onclick="cargarParaEditar(${yerba.id})" class="btn-editar">Editar</button>
      <button onclick="eliminarYerba(${yerba.id})" class="btn-eliminar">Eliminar</button>
    `;

    // Agrega la tarjeta terminada como hijo dentro de <div id="lista-productos">.
    listaProductos.appendChild(tarjeta);
  });
}

// ==========================================
// CRUD: CREATE & UPDATE (Crear o Modificar productos desde el formulario)
// ==========================================
// Escucha el evento 'submit' de la etiqueta <form id="form-yerba">.
form.addEventListener("submit", function (e) {
  // Evita que la página se recargue por defecto al enviar el formulario.
  e.preventDefault();

  // Lee el valor del campo oculto <input type="hidden" id="yerba-id"> para saber si se está editando.
  const id = document.getElementById("yerba-id").value;
  
  // Lee los valores escritos por el usuario en los inputs del formulario.
  const nombre = document.getElementById("nombre").value;
  const tipo = document.getElementById("tipo").value;
  const peso = document.getElementById("peso").value;
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);

  // Si el campo ID tiene contenido, realizamos una actualización (UPDATE).
  if (id) {
    const index = yerbas.findIndex((y) => y.id == id);
    yerbas[index] = { id: Number(id), nombre, tipo, peso, precio, stock };
  } else {
    // Si el ID está vacío, creamos un registro nuevo (CREATE).
    const nuevoId = yerbas.length > 0 ? Math.max(...yerbas.map((y) => y.id)) + 1 : 1;
    yerbas.push({ id: nuevoId, nombre, tipo, peso, precio, stock });
  }

  // Resetea los inputs y actualiza la interfaz visual y el almacenamiento.
  limpiarFormulario();
  guardarYActualizar();
});

// Carga los datos de un producto específico en las etiquetas del formulario para editarlos.
function cargarParaEditar(id) {
  const yerba = yerbas.find((y) => y.id === id);
  
  // Asigna los valores del producto a los inputs del formulario en el HTML.
  document.getElementById("yerba-id").value = yerba.id;
  document.getElementById("nombre").value = yerba.nombre;
  document.getElementById("peso").value = yerba.peso;
  document.getElementById("tipo").value = yerba.tipo;
  document.getElementById("precio").value = yerba.precio;
  document.getElementById("stock").value = yerba.stock;
  
  // Cambia el texto de la etiqueta <h2 id="titulo-form"> para indicar que se está editando.
  document.getElementById("titulo-form").innerText = "Editando: " + yerba.nombre;
}

// ==========================================
// CRUD: DELETE (Eliminar un producto del JSON)
// ==========================================
// Elimina una yerba del arreglo filtrando por su ID al hacer clic en el botón de eliminar.
function eliminarYerba(id) {
  // Muestra una ventana emergente de confirmación nativa del navegador.
  if (confirm("¿Seguro que querés eliminar esta yerba?")) {
    // Filtra el arreglo descartando el elemento cuyo ID coincida.
    yerbas = yerbas.filter((y) => y.id !== id);
    // Guarda los cambios y actualiza la vista.
    guardarYActualizar();
  }
}

// Limpia los campos del formulario y restablece el título original de la sección.
function limpiarFormulario() {
  form.reset();
  document.getElementById("yerba-id").value = "";
  document.getElementById("titulo-form").innerText = "Agregar Nueva Yerba";
}

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
// Ejecuta la función principal al cargar el script para renderizar la tienda por primera vez.
guardarYActualizar();