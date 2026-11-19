
// FUNCIÓN PARA MOSTRAR PRECIOS EN PESOS ARGENTINOS
function formatearPrecio(precio) {
  return Number(precio).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}



// FUNCIONES GENERALES DE BURGER HOUSE

// Mostrar notificación
function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = mensaje;
  toast.classList.add("mostrar");

  setTimeout(() => {
    toast.classList.remove("mostrar");
  }, 2500);
}

// Mostrar productos dinámicamente
function mostrarProductos(lista = productos) {
  const contenedor = document.getElementById("listaProductos");

  if (!contenedor) return;

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center py-5">
        <h4>No se encontraron productos.</h4>
      </div>
    `;
    actualizarResultados(0);
    return;
  }

  contenedor.innerHTML = lista.map(p => `
    <div class="col-sm-6 col-lg-4 col-xl-3">
      <div class="tarjeta-producto">
        <a href="detalle.html?id=${p.id}">
          <img src="${p.imagen}" alt="${p.nombre}" class="imagen-producto">
        </a>

        <div class="p-3">
          <span class="categoria">${p.categoria}</span>
          <h5>${p.nombre}</h5>
          <p class="precio">${formatearPrecio(p.precio)}</p>

          <a href="detalle.html?id=${p.id}"
             class="btn btn-outline-dark w-100 mb-2">
             Ver detalle
          </a>

          <button class="btn btn-warning w-100"
            onclick="agregarAlCarrito(${p.id})">
            Agregar al carrito 🛒
          </button>
        </div>
      </div>
    </div>
  `).join("");

  actualizarResultados(lista.length);
}

// Mostrar cantidad de resultados
function actualizarResultados(cantidad) {
  const resultados = document.getElementById("resultados");

  if (resultados) {
    resultados.textContent =
      `Mostrando ${cantidad} de ${productos.length} productos`;
  }
}

// Aplicar búsqueda, filtros y ordenamiento
function aplicarFiltros() {
  const buscador = document.getElementById("buscador");
  const categoria = document.getElementById("categoria");
  const precioMin = document.getElementById("precioMin");
  const precioMax = document.getElementById("precioMax");
  const orden = document.getElementById("orden");

  if (!buscador) return;

  const texto = buscador.value.toLowerCase().trim();
  const cat = categoria.value;
  const minimo = precioMin.value === "" ? 0 : Number(precioMin.value);
  const maximo = precioMax.value === "" ? Infinity : Number(precioMax.value);

  let filtrados = productos.filter(p => {
    const coincideTexto =
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto);

    const coincideCategoria = !cat || p.categoria === cat;
    const coincidePrecio = p.precio >= minimo && p.precio <= maximo;

    return coincideTexto && coincideCategoria && coincidePrecio;
  });

  if (orden.value === "menor") {
    filtrados.sort((a, b) => a.precio - b.precio);
  } else if (orden.value === "mayor") {
    filtrados.sort((a, b) => b.precio - a.precio);
  } else if (orden.value === "nombre") {
    filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  mostrarProductos(filtrados);
}

// Limpiar todos los filtros
function limpiarFiltros() {
  document.getElementById("buscador").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("precioMin").value = "";
  document.getElementById("precioMax").value = "";
  document.getElementById("orden").value = "";

  mostrarProductos(productos);
}

// Mostrar detalle de producto según URL
function mostrarDetalle() {
  const contenedor = document.getElementById("detalleProducto");

  if (!contenedor) return;

  const parametros = new URLSearchParams(window.location.search);
  const id = Number(parametros.get("id"));

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    contenedor.innerHTML = `
      <div class="text-center py-5">
        <h2>Producto no encontrado</h2>
        <a href="index.html" class="btn btn-warning">Volver al inicio</a>
      </div>
    `;
    return;
  }

  contenedor.innerHTML = `
    <div class="row align-items-center g-4">
      <div class="col-md-6">
        <img src="${producto.imagen}" class="detalle-imagen"
             alt="${producto.nombre}">
      </div>

      <div class="col-md-6">
        <span class="categoria">${producto.categoria}</span>
        <h1 class="mt-2">${producto.nombre}</h1>
        <h3 class="precio">${formatearPrecio(producto.precio)}</h3>
        <p>${producto.descripcion}</p>
        <h5>Características:</h5>
        <p>${producto.caracteristicas}</p>

        <label for="cantidadProducto" class="form-label">
          Cantidad:
        </label>

        <input type="number" id="cantidadProducto"
               class="form-control mb-3"
               min="1" value="1">

        <button id="agregarDetalle"
                class="btn btn-warning w-100">
          Agregar al carrito 🛒
        </button>
      </div>
    </div>
  `;

  document.getElementById("agregarDetalle").addEventListener("click", () => {
    const cantidad = Number(document.getElementById("cantidadProducto").value);

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      alert("Ingresá una cantidad válida.");
      return;
    }

    agregarAlCarrito(producto.id, cantidad);
  });
}

// Validación adicional del formulario de contacto
function configurarContacto() {
  const formulario = document.getElementById("formContacto");

  if (!formulario) return;

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const asunto = document.getElementById("asunto");
    const mensaje = document.getElementById("mensaje");

    let valido = true;

    document.querySelectorAll(".error").forEach(e => e.textContent = "");

    if (nombre.value.trim().length < 3) {
      document.getElementById("errorNombre").textContent =
        "El nombre debe tener al menos 3 caracteres.";
      valido = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      document.getElementById("errorEmail").textContent =
        "Ingresá un correo electrónico válido.";
      valido = false;
    }

    if (asunto.value.trim().length < 3) {
      document.getElementById("errorAsunto").textContent =
        "El asunto debe tener al menos 3 caracteres.";
      valido = false;
    }

    if (mensaje.value.trim().length < 10) {
      document.getElementById("errorMensaje").textContent =
        "El mensaje debe tener al menos 10 caracteres.";
      valido = false;
    }

    if (valido) {
      document.getElementById("confirmacion").textContent =
        "¡Mensaje enviado correctamente! Gracias por contactarnos.";

      formulario.reset();
    }
  });
}

// Iniciar funciones según la página abierta
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("listaProductos")) {
    mostrarProductos();

    document.getElementById("buscador").addEventListener("input", aplicarFiltros);
    document.getElementById("categoria").addEventListener("change", aplicarFiltros);
    document.getElementById("precioMin").addEventListener("input", aplicarFiltros);
    document.getElementById("precioMax").addEventListener("input", aplicarFiltros);
    document.getElementById("orden").addEventListener("change", aplicarFiltros);
    document.getElementById("limpiar").addEventListener("click", limpiarFiltros);
  }

  mostrarDetalle();
  configurarContacto();
});




// Menú hamburguesa con JavaScript puro
document.addEventListener("DOMContentLoaded", () => {
  const botonMenu = document.querySelector(".navbar-toggler");
  const menu = document.getElementById("menu");

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }

  // Mostrar carrito cuando se abre carrito.html
  if (document.getElementById("productosCarrito")) {
    mostrarCarrito();
  }
});