    /* ============================================================
       MINI ECOMMERCE - CRUD en memoria sobre un JSON
       ------------------------------------------------------------
       MAPA DEL CRUD (una función por operación):
         CREATE  →  crearProducto(datos)
         READ    →  leerProductos()
         UPDATE  →  actualizarProducto(id, datos)
         DELETE  →  eliminarProducto(id)

       MAPA DE LA UI:
         Botón "+ Agregar producto"   →  mostrarFormularioCreacion()
         Botón "Editar" de la tarjeta →  mostrarFormularioEdicion(id)
         Botón "X" de la tarjeta      →  eliminarProducto(id)
         Botón "Cancelar" del form    →  ocultarFormulario()
         Submit del form              →  crearProducto() o actualizarProducto()

       Regla de oro:
         Cada función del CRUD modifica el array `productos`
         y vuelve a llamar a `leerProductos()` para refrescar el DOM.
       ============================================================ */

    // ------------------------------------------------------------
    // 1. "BASE DE DATOS": el JSON original
    // ------------------------------------------------------------
    const productosJSON = await (await fetch("./productos.json")).json();

    // Copia de trabajo: sobre esta se hace el CRUD
    let productos = [...productosJSON];

    // Contador para IDs de productos nuevos
    let proximoId = 5;

    // ------------------------------------------------------------
    // 2. REFERENCIAS AL DOM
    // ------------------------------------------------------------
    const listaProductos = document.getElementById("lista-productos");
    const seccionForm    = document.getElementById("seccion-form");
    const formProducto   = document.getElementById("form-producto");
    const inputId        = document.getElementById("producto-id");
    const inputNombre    = document.getElementById("nombre");
    const inputPrecio    = document.getElementById("precio");
    const inputImagen    = document.getElementById("imagen");
    const inputStock     = document.getElementById("stock");
    const tituloForm     = document.getElementById("titulo-form");
    const btnNuevo       = document.getElementById("btn-nuevo");
    const btnCancelar    = document.getElementById("btn-cancelar");

    /* ============================================================
       3. HELPERS  (apoyo para no repetir código)
       ============================================================ */

    // Busca un producto por id y lo devuelve (o null si no existe)
    function buscarProductoPorId(id) {
      let encontrado = null;
      productos.forEach(function (p) {
        if (p.id === id) {
          encontrado = p;
        }
      });
      return encontrado;
    }

    // Busca la POSICIÓN de un producto en el array (-1 si no existe)
    function buscarIndicePorId(id) {
      let indice = -1;
      productos.forEach(function (p, i) {
        if (p.id === id) {
          indice = i;
        }
      });
      return indice;
    }

    // Construye el DOM de UNA sola tarjeta a partir de un producto
    function crearTarjetaProducto(producto) {
      const card = document.createElement("div");
      card.className = "card";

      if (producto.imagen) {
        const img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;
        card.appendChild(img);
      }

      const titulo = document.createElement("h3");
      titulo.textContent = producto.nombre;

      const precio = document.createElement("p");
      precio.className = "precio";
      precio.textContent = "$" + producto.precio;

      const stock = document.createElement("small");
      stock.textContent = "Stock: " + producto.stock;

      // --- Solo Editar y Eliminar. Nada de "Agregar" acá. ---
      const acciones = document.createElement("div");
      acciones.className = "acciones";

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.className = "secundario";
      btnEditar.addEventListener("click", function () {
        mostrarFormularioEdicion(producto.id);
      });

      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "X";
      btnEliminar.className = "peligro";
      btnEliminar.addEventListener("click", function () {
        eliminarProducto(producto.id);
      });

      acciones.appendChild(btnEditar);
      acciones.appendChild(btnEliminar);

      card.appendChild(titulo);
      card.appendChild(precio);
      card.appendChild(stock);
      card.appendChild(acciones);

      return card;
    }

    /* ============================================================
       4. CONTROL DEL FORMULARIO (mostrar / ocultar / precargar)
       ============================================================ */

    // Deja el formulario vacío y en modo "Crear"
    function limpiarFormulario() {
      formProducto.reset();
      inputId.value = "";
      tituloForm.textContent = "Agregar producto";
    }

    // Muestra el formulario vacío para CREAR un producto nuevo
    function mostrarFormularioCreacion() {
      limpiarFormulario();
      seccionForm.hidden = false;
      inputNombre.focus();
      seccionForm.scrollIntoView({ behavior: "smooth" });
    }

    // Muestra el formulario con los datos de un producto para EDITARLO
    function mostrarFormularioEdicion(id) {
      const producto = buscarProductoPorId(id);
      if (!producto) return;

      inputId.value     = producto.id;
      inputNombre.value = producto.nombre;
      inputPrecio.value = producto.precio;
      inputImagen.value = producto.imagen || "";
      inputStock.value  = producto.stock;

      tituloForm.textContent = "Editar producto";
      seccionForm.hidden = false;
      inputNombre.focus();
      seccionForm.scrollIntoView({ behavior: "smooth" });
    }

    // Oculta el formulario y lo deja limpio
    function ocultarFormulario() {
      seccionForm.hidden = true;
      limpiarFormulario();
    }

    /* ============================================================
       5. CRUD  (una función por operación)
       ============================================================ */

    // ----------------------------------------
    // CREATE → crearProducto(datos)
    // ----------------------------------------
    function crearProducto(datos) {
      const nuevoProducto = {
        id: proximoId,
        nombre: datos.nombre,
        precio: datos.precio,
        imagen: datos.imagen,
        stock:  datos.stock
      };

      proximoId = proximoId + 1;
      productos.push(nuevoProducto);

      leerProductos();
    }

    // ----------------------------------------
    // READ → leerProductos()
    // ----------------------------------------
    function leerProductos() {
      listaProductos.innerHTML = "";

      if (productos.length === 0) {
        listaProductos.innerHTML = "<p>No hay productos cargados.</p>";
        return;
      }

      productos.forEach(function (producto) {
        const tarjeta = crearTarjetaProducto(producto);
        listaProductos.appendChild(tarjeta);
      });
    }

    // ----------------------------------------
    // UPDATE → actualizarProducto(id, datos)
    // ----------------------------------------
    function actualizarProducto(id, datos) {
      const producto = buscarProductoPorId(id);
      if (!producto) return;

      producto.nombre = datos.nombre;
      producto.precio = datos.precio;
      producto.imagen = datos.imagen;
      producto.stock  = datos.stock;

      leerProductos();
    }

    // ----------------------------------------
    // DELETE → eliminarProducto(id)
    // ----------------------------------------
    function eliminarProducto(id) {
      if (!confirm("¿Eliminar este producto?")) return;

      const indice = buscarIndicePorId(id);
      if (indice === -1) return;

      productos.splice(indice, 1);
      leerProductos();
    }

    /* ============================================================
       6. EVENTOS  (atan las acciones del usuario al CRUD)
       ============================================================ */

    // Botón "+ Agregar producto" del header → abre el form vacío
    btnNuevo.addEventListener("click", function () {
      mostrarFormularioCreacion();
    });

    // Botón "Cancelar" del form → cierra y limpia
    btnCancelar.addEventListener("click", function () {
      ocultarFormulario();
    });

    // Submit del form → decide entre CREATE y UPDATE según haya id
    formProducto.addEventListener("submit", function (evento) {
      evento.preventDefault();

      const datos = {
        nombre: inputNombre.value.trim(),
        precio: Number(inputPrecio.value),
        imagen: inputImagen.value.trim(),
        stock:  Number(inputStock.value)
      };

      if (inputId.value) {
        actualizarProducto(Number(inputId.value), datos);  // UPDATE
      } else {
        crearProducto(datos);                              // CREATE
      }

      ocultarFormulario();
    });

    /* ============================================================
       7. INICIO
       ============================================================ */
    leerProductos(); // READ inicial