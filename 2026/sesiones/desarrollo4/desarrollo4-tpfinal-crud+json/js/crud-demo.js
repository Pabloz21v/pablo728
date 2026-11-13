/* ======================================================================
   TP-Final Integrador — Laboratorio CRUD interactivo
   ----------------------------------------------------------------------
   Este archivo es la DEMO FUNCIONANDO de lo que el alumno debe entregar.
   Está escrito con el mismo esqueleto del código ofrecido para ingeniería
   inversa (ecommerce-codigo-ing-invertida.html), pero:

     1. El array inicial ya NO está escrito a mano en el JS: se CONSUME
        desde data/productos.json con fetch() + response.json().
     2. Hay un VISOR que muestra el JSON en vivo, para ver cómo cambia el
        mismo conjunto de datos después de cada operación.
     3. Hay un LOG que registra qué función del CRUD se ejecutó y con qué
        argumentos (sirve para la defensa oral).
     4. Se puede volver al JSON original con un botón (reset).

   Mapa del CRUD (una función por operación):
     CREATE -> crearProducto(datos)
     READ   -> leerProductos()
     UPDATE -> actualizarProducto(id, datos)
     DELETE -> eliminarProducto(id)

   Regla de oro: cada función del CRUD modifica el array `productos`
   y vuelve a llamar a `leerProductos()` para reconstruir el DOM.
   ====================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------
     1. ESTADO
     -------------------------------------------------------------- */
  const RUTA_JSON = 'data/productos.json';

  // Copia de respaldo por si fetch falla (abriendo con file://, por ejemplo).
  // Mantiene la misma forma que el JSON para que el resto del código no cambie.
  const RESPALDO = [
    { id: 1, nombre: 'Remera básica', categoria: 'Indumentaria', precio: 8500, stock: 15, imagen: 'images/producto-remera.svg' },
    { id: 2, nombre: 'Gorra negra', categoria: 'Accesorios', precio: 6200, stock: 8, imagen: 'images/producto-gorra.svg' },
    { id: 3, nombre: 'Buzo canguro', categoria: 'Indumentaria', precio: 18900, stock: 5, imagen: 'images/producto-buzo.svg' },
    { id: 4, nombre: 'Zapatillas urbanas', categoria: 'Calzado', precio: 32000, stock: 3, imagen: 'images/producto-zapatillas.svg' },
    { id: 5, nombre: 'Mochila urbana', categoria: 'Accesorios', precio: 24500, stock: 6, imagen: 'images/producto-mochila.svg' },
    { id: 6, nombre: 'Medias pack x3', categoria: 'Indumentaria', precio: 3900, stock: 22, imagen: 'images/producto-medias.svg' }
  ];

  let productos = [];          // datos de trabajo (sobre esto se hace el CRUD)
  let proximoId = 1;           // contador de IDs
  let textoJsonOriginal = '';  // snapshot del JSON tal como vino, para el reset
  let productosOriginales = []; // copia profunda, para el reset
  let resaltarId = null;       // id a animar tras la última operación
  let resaltarTipo = '';       // 'is-new' | 'is-edited'

  const MAX_LOG = 40;
  let logs = [];

  /* --------------------------------------------------------------
     2. REFERENCIAS AL DOM
     -------------------------------------------------------------- */
  let lista, formWrap, form, tituloForm, inputId, inputNombre, inputCategoria,
      inputPrecio, inputStock, inputImagen, formError, jsonOut, logOut,
      statTotal, statValor, statStock, statcats, btnNuevo, btnCancelar,
      btnReset, btnCopiarJson, btnDescargar;

  /* --------------------------------------------------------------
     3. HELPERS
     -------------------------------------------------------------- */
  function buscarProductoPorId(id) {
    // Versión moderna del forEach del código original: find() devuelve el
    // primer elemento que cumple la condición, o undefined.
    return productos.find(function (p) { return p.id === id; });
  }

  function buscarIndicePorId(id) {
    return productos.findIndex(function (p) { return p.id === id; });
  }

  function formatearPrecio(valor) {
    // toLocaleString agrupa los miles según la configuración regional.
    return '$' + Number(valor).toLocaleString('es-AR');
  }

  function clonar(lista) {
    // structuredClone copia profunda sin referencias compartidas.
    return JSON.parse(JSON.stringify(lista));
  }

  /* --------------------------------------------------------------
     4. LOG DE OPERACIONES (para la defensa oral)
     -------------------------------------------------------------- */
  function registrar(op, detalle) {
    const ahora = new Date();
    const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    logs.unshift({ op: op, detalle: detalle, hora: hora });
    if (logs.length > MAX_LOG) logs.pop();
    pintarLog();
  }

  function pintarLog() {
    if (!logOut) return;
    if (!logs.length) {
      logOut.innerHTML = '<li class="log-empty">Todavía no hay operaciones. Usá el laboratorio y mirá cómo se registra cada paso.</li>';
      return;
    }
    logOut.innerHTML = '';
    logs.forEach(function (item) {
      const li = document.createElement('li');
      li.className = 'op-' + item.op.toLowerCase();

      const tag = document.createElement('span');
      tag.className = 'op-tag';
      tag.textContent = item.op + ' ';

      li.appendChild(tag);
      li.appendChild(document.createTextNode(item.detalle + ' · ' + item.hora));
      logOut.appendChild(li);
    });
  }

  /* --------------------------------------------------------------
     5. PINTADO DEL JSON (visor en vivo)
     -------------------------------------------------------------- */
  function escaparHtml(txt) {
    return String(txt)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function colorearJson(valor, sangria) {
    const pad = '  '.repeat(sangria);
    const padHijo = '  '.repeat(sangria + 1);

    if (Array.isArray(valor)) {
      if (!valor.length) return '<span class="j-punc">[]</span>';
      const items = valor.map(function (v) {
        return padHijo + colorearJson(v, sangria + 1);
      });
      return '<span class="j-punc">[</span>\n' + items.join('<span class="j-punc">,</span>\n') + '\n' + pad + '<span class="j-punc">]</span>';
    }

    if (valor !== null && typeof valor === 'object') {
      const claves = Object.keys(valor);
      if (!claves.length) return '<span class="j-punc">{}</span>';
      const items = claves.map(function (k) {
        return padHijo +
          '<span class="j-key">"' + escaparHtml(k) + '"</span><span class="j-punc">: </span>' +
          colorearJson(valor[k], sangria + 1);
      });
      return '<span class="j-punc">{</span>\n' + items.join('<span class="j-punc">,</span>\n') + '\n' + pad + '<span class="j-punc">}</span>';
    }

    if (typeof valor === 'number') return '<span class="j-num">' + valor + '</span>';
    if (typeof valor === 'boolean') return '<span class="j-bool">' + valor + '</span>';
    if (valor === null) return '<span class="j-bool">null</span>';
    return '<span class="j-str">"' + escaparHtml(valor) + '"</span>';
  }

  function pintarJson() {
    if (!jsonOut) return;
    // El JSON se construye con JSON.stringify para mostrar exactamente lo
    // que se guardaría (misma serialización que un backend real).
    const texto = JSON.stringify(productos, null, 2);
    jsonOut.innerHTML = colorearJson(productos, 0);
  }

  /* --------------------------------------------------------------
     6. TARJETA DE PRODUCTO (construcción de DOM con createElement)
     -------------------------------------------------------------- */
  function crearTarjetaProducto(producto) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = String(producto.id);
    if (resaltarId === producto.id) card.classList.add(resaltarTipo);

    // --- imagen ---
    const imgWrap = document.createElement('div');
    imgWrap.className = 'pc-img';

    const img = document.createElement('img');
    img.src = producto.imagen || 'images/producto-generico.svg';
    img.alt = 'Imagen del producto ' + producto.nombre;
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      // Si la URL no existe, no rompemos la tarjeta: mostramos un SVG local.
      img.src = 'images/producto-generico.svg';
    });
    imgWrap.appendChild(img);

    // --- cuerpo ---
    const body = document.createElement('div');
    body.className = 'pc-body';

    const head = document.createElement('div');
    head.className = 'pc-head';

    const titulo = document.createElement('h4');
    titulo.textContent = producto.nombre;

    const idTag = document.createElement('span');
    idTag.className = 'pc-id';
    idTag.textContent = '#' + producto.id;

    head.appendChild(titulo);
    head.appendChild(idTag);

    const cat = document.createElement('span');
    cat.className = 'pc-cat';
    cat.textContent = producto.categoria || 'Sin categoría';

    const precio = document.createElement('p');
    precio.className = 'pc-precio';
    precio.textContent = formatearPrecio(producto.precio);

    const stock = document.createElement('span');
    stock.className = 'pc-stock';
    if (Number(producto.stock) <= 3) stock.classList.add('bajo');
    stock.textContent = 'Stock: ' + producto.stock + (Number(producto.stock) === 0 ? ' (sin stock)' : '');

    // --- acciones ---
    const acciones = document.createElement('div');
    acciones.className = 'pc-acciones';

    const btnEditar = document.createElement('button');
    btnEditar.type = 'button';
    btnEditar.textContent = 'Editar';
    btnEditar.setAttribute('aria-label', 'Editar ' + producto.nombre);
    btnEditar.addEventListener('click', function () {
      mostrarFormularioEdicion(producto.id);
    });

    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.className = 'del';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.setAttribute('aria-label', 'Eliminar ' + producto.nombre);
    btnEliminar.addEventListener('click', function () {
      eliminarProducto(producto.id);
    });

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);

    body.appendChild(head);
    body.appendChild(cat);
    body.appendChild(precio);
    body.appendChild(stock);
    body.appendChild(acciones);

    card.appendChild(imgWrap);
    card.appendChild(body);

    return card;
  }

  /* --------------------------------------------------------------
     7. ESTADÍSTICAS
     -------------------------------------------------------------- */
  function pintarEstadisticas() {
    const total = productos.length;
    const valor = productos.reduce(function (acc, p) {
      return acc + Number(p.precio) * Number(p.stock);
    }, 0);
    const stockTotal = productos.reduce(function (acc, p) {
      return acc + Number(p.stock);
    }, 0);
    const categorias = new Set(productos.map(function (p) { return p.categoria || 'Sin categoría'; }));

    if (statTotal) statTotal.textContent = String(total);
    if (statValor) statValor.textContent = formatearPrecio(valor);
    if (statStock) statStock.textContent = String(stockTotal);
    if (statcats) statcats.textContent = String(categorias.size);
  }

  /* --------------------------------------------------------------
     8. CONTROL DEL FORMULARIO
     -------------------------------------------------------------- */
  function limpiarFormulario() {
    form.reset();
    inputId.value = '';
    inputStock.value = '1';
    tituloForm.textContent = 'Agregar producto';
    formError.textContent = '';
  }

  function mostrarFormularioCreacion() {
    limpiarFormulario();
    formWrap.hidden = false;
    inputNombre.focus();
    formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function mostrarFormularioEdicion(id) {
    const producto = buscarProductoPorId(id);
    if (!producto) return;

    inputId.value = producto.id;
    inputNombre.value = producto.nombre;
    inputCategoria.value = producto.categoria || 'Indumentaria';
    inputPrecio.value = producto.precio;
    inputStock.value = producto.stock;
    inputImagen.value = producto.imagen || '';

    tituloForm.textContent = 'Editar producto #' + producto.id;
    formError.textContent = '';
    formWrap.hidden = false;
    inputNombre.focus();
    formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function ocultarFormulario() {
    formWrap.hidden = true;
    limpiarFormulario();
  }

  /* --------------------------------------------------------------
     9. CRUD — una función por operación
     -------------------------------------------------------------- */

  // CREATE ------------------------------------------------
  function crearProducto(datos) {
    const nuevoProducto = {
      id: proximoId,
      nombre: datos.nombre,
      categoria: datos.categoria,
      precio: datos.precio,
      stock: datos.stock,
      imagen: datos.imagen
    };

    proximoId = proximoId + 1;
    productos.push(nuevoProducto);

    resaltarId = nuevoProducto.id;
    resaltarTipo = 'is-new';
    registrar('CREATE', 'crearProducto() → id ' + nuevoProducto.id + ' "' + nuevoProducto.nombre + '"');

    leerProductos();
  }

  // READ --------------------------------------------------
  function leerProductos() {
    lista.innerHTML = '';

    if (productos.length === 0) {
      const vacio = document.createElement('p');
      vacio.className = 'empty-state';
      vacio.textContent = 'No hay productos cargados. Usá "+ Agregar producto" o "Volver al JSON original".';
      lista.appendChild(vacio);
      pintarJson();
      pintarEstadisticas();
      return;
    }

    // Un DocumentFragment evita reflows: se arma todo y se inserta de una vez.
    const frag = document.createDocumentFragment();
    productos.forEach(function (producto) {
      frag.appendChild(crearTarjetaProducto(producto));
    });
    lista.appendChild(frag);

    pintarJson();
    pintarEstadisticas();

    // La animación de resaltado se aplica una sola vez
    resaltarId = null;
    resaltarTipo = '';
  }

  // UPDATE ------------------------------------------------
  function actualizarProducto(id, datos) {
    const producto = buscarProductoPorId(id);
    if (!producto) return;

    producto.nombre = datos.nombre;
    producto.categoria = datos.categoria;
    producto.precio = datos.precio;
    producto.stock = datos.stock;
    producto.imagen = datos.imagen;

    resaltarId = id;
    resaltarTipo = 'is-edited';
    registrar('UPDATE', 'actualizarProducto(' + id + ') → "' + datos.nombre + '"');

    leerProductos();
  }

  // DELETE ------------------------------------------------
  function eliminarProducto(id) {
    const producto = buscarProductoPorId(id);
    if (!producto) return;

    if (!window.confirm('¿Eliminar "' + producto.nombre + '" (id ' + id + ')?')) return;

    const indice = buscarIndicePorId(id);
    if (indice === -1) return;

    productos.splice(indice, 1);
    registrar('DELETE', 'eliminarProducto(' + id + ') → "' + producto.nombre + '"');

    leerProductos();
  }

  /* --------------------------------------------------------------
     10. CARGA INICIAL DEL JSON
     -------------------------------------------------------------- */
  function normalizar(listaCruda) {
    // Defensa básica: solo aceptamos objetos con las claves esperadas y
    // completamos defaults para que el DOM no reciba undefined.
    return listaCruda
      .filter(function (p) { return p && typeof p === 'object' && p.nombre; })
      .map(function (p, i) {
        return {
          id: Number(p.id) || i + 1,
          nombre: String(p.nombre),
          categoria: p.categoria || 'Sin categoría',
          precio: Number(p.precio) || 0,
          stock: Number(p.stock) || 0,
          imagen: p.imagen || ''
        };
      });
  }

  function aplicarDatos(listaCruda, origen) {
    productos = normalizar(listaCruda);
    productosOriginales = clonar(productos);
    proximoId = productos.reduce(function (max, p) {
      return Math.max(max, p.id);
    }, 0) + 1;
    textoJsonOriginal = JSON.stringify(productos, null, 2);
    registrar('READ', 'leerProductos() → ' + productos.length + ' registros desde ' + origen);
    leerProductos();
  }

  function cargarProductos() {
    registrar('READ', 'GET ' + RUTA_JSON + ' → response.json()');
    fetch(RUTA_JSON)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        aplicarDatos(data, 'data/productos.json');
      })
      .catch(function () {
        // Fallback: si el archivo no se puede leer por fetch (file://),
        // seguimos funcionando con los mismos datos embebidos.
        aplicarDatos(RESPALDO, 'respaldo embebido (fetch falló)');
        if (window.showToast) window.showToast('No se pudo leer el JSON por fetch; se usó el respaldo local');
      });
  }

  /* --------------------------------------------------------------
     11. EVENTOS
     -------------------------------------------------------------- */
  function init() {
    lista = document.getElementById('crud-lista');
    if (!lista) return; // el laboratorio no está en esta página

    formWrap = document.getElementById('crud-form-wrap');
    form = document.getElementById('crud-form');
    tituloForm = document.getElementById('crud-form-titulo');
    inputId = document.getElementById('crud-id');
    inputNombre = document.getElementById('crud-nombre');
    inputCategoria = document.getElementById('crud-categoria');
    inputPrecio = document.getElementById('crud-precio');
    inputStock = document.getElementById('crud-stock');
    inputImagen = document.getElementById('crud-imagen');
    formError = document.getElementById('crud-form-error');
    jsonOut = document.getElementById('crud-json');
    logOut = document.getElementById('crud-log');
    statTotal = document.getElementById('stat-total');
    statValor = document.getElementById('stat-valor');
    statStock = document.getElementById('stat-stock');
    statcats = document.getElementById('stat-categorias');
    btnNuevo = document.getElementById('crud-btn-nuevo');
    btnCancelar = document.getElementById('crud-btn-cancelar');
    btnReset = document.getElementById('crud-btn-reset');
    btnCopiarJson = document.getElementById('crud-btn-copiar');
    btnDescargar = document.getElementById('crud-btn-descargar');

    // "+ Agregar producto" -> abre el formulario vacío (CREATE)
    btnNuevo.addEventListener('click', function () {
      mostrarFormularioCreacion();
    });

    // "Cancelar" -> cierra y limpia
    btnCancelar.addEventListener('click', function () {
      ocultarFormulario();
    });

    // Submit -> decide CREATE o UPDATE según haya id guardado en el hidden
    form.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const nombre = inputNombre.value.trim();
      const categoria = inputCategoria.value;
      const precio = Number(inputPrecio.value);
      const stock = Number(inputStock.value);
      const imagen = inputImagen.value.trim();

      // Validación explícita (además de la nativa del HTML)
      if (nombre.length < 2) {
        formError.textContent = 'El nombre necesita al menos 2 caracteres.';
        inputNombre.focus();
        return;
      }
      if (!Number.isFinite(precio) || precio < 0) {
        formError.textContent = 'El precio debe ser un número mayor o igual a 0.';
        inputPrecio.focus();
        return;
      }
      if (!Number.isFinite(stock) || stock < 0) {
        formError.textContent = 'El stock debe ser un número mayor o igual a 0.';
        inputStock.focus();
        return;
      }
      formError.textContent = '';

      const datos = {
        nombre: nombre,
        categoria: categoria,
        precio: precio,
        stock: stock,
        imagen: imagen
      };

      if (inputId.value) {
        actualizarProducto(Number(inputId.value), datos); // UPDATE
      } else {
        crearProducto(datos);                             // CREATE
      }

      ocultarFormulario();
    });

    // Reset -> vuelve al JSON original
    btnReset.addEventListener('click', function () {
      if (!window.confirm('¿Volver al JSON original? Se perderán los cambios de esta demo.')) return;
      productos = clonar(productosOriginales);
      proximoId = productos.reduce(function (max, p) { return Math.max(max, p.id); }, 0) + 1;
      resaltarId = null;
      registrar('READ', 'reset → ' + productos.length + ' registros originales');
      leerProductos();
      if (window.showToast) window.showToast('Datos restaurados desde el JSON original');
    });

    // Copiar el JSON actual (serializado)
    btnCopiarJson.addEventListener('click', function () {
      const texto = JSON.stringify(productos, null, 2);
      navigator.clipboard.writeText(texto)
        .then(function () {
          if (window.showToast) window.showToast('JSON actual copiado al portapapeles');
        })
        .catch(function () {
          if (window.showToast) window.showToast('No se pudo copiar; seleccioná el texto manualmente');
        });
    });

    // Descargar el JSON actual como archivo .json
    btnDescargar.addEventListener('click', function () {
      const texto = JSON.stringify(productos, null, 2);
      const blob = new Blob([texto], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos-actualizado.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (window.showToast) window.showToast('productos-actualizado.json descargado');
    });

    pintarLog();
    cargarProductos();
  }

  // El script se carga con defer, así que el DOM ya está listo.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
