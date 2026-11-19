
// CARRITO DE COMPRAS
// Número del emprendimiento: reemplazar por el número real.
// Formato internacional, sin + ni espacios.
const NUMERO_WHATSAPP = "5492804000000";

// Obtener el carrito guardado
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

// Guardar cambios en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

// Actualizar contador del encabezado
function actualizarContador() {
  const carrito = obtenerCarrito();
  const cantidad = carrito.reduce((total, p) => total + p.cantidad, 0);

  const contador = document.getElementById("contador");

  if (contador) {
    contador.textContent = cantidad;
  }
}

// Agregar un producto
function agregarAlCarrito(id, cantidad = 1) {
  const producto = productos.find(p => p.id === Number(id));

  if (!producto) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      ...producto,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);

  if (typeof mostrarToast === "function") {
    mostrarToast("¡Producto agregado al carrito!");
  }
}

// Cambiar cantidad
function cambiarCantidad(id, cambio) {
  let carrito = obtenerCarrito();

  const producto = carrito.find(p => p.id === Number(id));

  if (!producto) return;

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== Number(id));
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

// Eliminar producto
function eliminarProducto(id) {
  const carrito = obtenerCarrito().filter(p => p.id !== Number(id));

  guardarCarrito(carrito);
  mostrarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
  localStorage.removeItem("carrito");
  actualizarContador();
  mostrarCarrito();
}

// Mostrar productos del carrito
function mostrarCarrito() {
  const contenedor = document.getElementById("productosCarrito");

  if (!contenedor) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center py-5">
        <h3>Tu carrito está vacío 🛒</h3>
        <a href="index.html" class="btn btn-warning mt-3">
          Volver a la tienda
        </a>
      </div>
    `;

    document.getElementById("total").textContent = "$0";
    document.getElementById("cantidadTotal").textContent = "0";
    return;
  }

  contenedor.innerHTML = carrito.map(p => `
    <div class="producto-carrito">
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="flex-grow-1">
        <h5>${p.nombre}</h5>
        <p>Precio: ${formatearPrecio(p.precio)}</p>
        <p>Subtotal: ${formatearPrecio(p.precio * p.cantidad)}</p>

        <button class="btn btn-sm btn-dark"
          onclick="cambiarCantidad(${p.id}, -1)">−</button>

        <span class="mx-2">${p.cantidad}</span>

        <button class="btn btn-sm btn-dark"
          onclick="cambiarCantidad(${p.id}, 1)">+</button>

        <button class="btn btn-sm btn-danger ms-2"
          onclick="eliminarProducto(${p.id})">Eliminar</button>
      </div>
    </div>
  `).join("");

  const total = carrito.reduce(
    (suma, p) => suma + p.precio * p.cantidad, 0
  );

  const cantidad = carrito.reduce(
    (suma, p) => suma + p.cantidad, 0
  );

  document.getElementById("total").textContent = formatearPrecio(total);
  document.getElementById("cantidadTotal").textContent = cantidad;
}

// Dar formato a los precios
function formatearPrecio(precio) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

// Enviar pedido por WhatsApp
function enviarWhatsApp() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const nombre = document.getElementById("nombreCliente").value.trim();
  const direccion = document.getElementById("direccionCliente").value.trim();
  const aclaraciones = document.getElementById("aclaraciones").value.trim();

  if (!nombre || !direccion) {
    alert("Completá tu nombre y dirección.");
    return;
  }

  const detalle = carrito.map(p =>
    `- ${p.nombre} x${p.cantidad}: ${formatearPrecio(p.precio * p.cantidad)}`
  ).join("\n");

  const total = carrito.reduce(
    (suma, p) => suma + p.precio * p.cantidad, 0
  );

  const mensaje = `
¡Hola Burger House! Quiero realizar un pedido.

Nombre: ${nombre}
Dirección o zona de entrega: ${direccion}

Mi pedido:
${detalle}

Total: ${formatearPrecio(total)}

Aclaraciones: ${aclaraciones || "Sin aclaraciones"}

¡Muchas gracias!
  `;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

// Actualizar contador al cargar la página
document.addEventListener("DOMContentLoaded", actualizarContador);


// FORMATEAR PRECIOS EN PESOS ARGENTINOS
function formatearPrecio(precio) {
  return Number(precio).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

