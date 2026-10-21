/* ======================================================================
   Desarrollo IV (Laboratorio) — Script compartido
   Funciones: menú móvil, tabla de contenidos activa (scroll-spy),
   checklist con progreso persistido (localStorage), quiz rápido,
   botón "copiar código" y toast de feedback.
   No depende de ningún framework: JavaScript puro (ES6+).
   ====================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCopyButtons();
  initScrollSpy();
  initChecklist();
  initQuiz();
  initFlexDemo();
  initGridDemo();
  initAreaDemo();
  initIframeDemos();
  initUtilityDemo();
  initEcommerceDemo();
  initWiringDemo();
});

/* ---------- Menú responsive (hamburguesa) ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cierra el menú al elegir un link (mejora la UX en mobile)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* ---------- Botón "copiar" en bloques de código ---------- */
function initCopyButtons() {
  document.querySelectorAll('.code-block').forEach((block) => {
    const btn = block.querySelector('.copy-btn');
    const codeEl = block.querySelector('pre code');
    if (!btn || !codeEl) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        btn.textContent = '¡Copiado!';
        showToast('Código copiado al portapapeles');
      } catch (err) {
        btn.textContent = 'Error al copiar';
      }
      setTimeout(() => (btn.textContent = 'Copiar'), 1800);
    });
  });
}

/* ---------- Tabla de contenidos: resalta la sección visible ---------- */
function initScrollSpy() {
  const links = document.querySelectorAll('.toc a');
  if (!links.length) return;

  const sections = Array.from(links)
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`.toc a[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ---------- Checklist de la actividad práctica con progreso guardado ---------- */
function initChecklist() {
  const list = document.querySelector('.checklist');
  if (!list) return;

  const storageKey = list.dataset.storageKey || 'dev4-checklist';
  const boxes = list.querySelectorAll('input[type="checkbox"]');
  const bar = document.querySelector('.progress-bar-fill');
  const label = document.querySelector('.progress-label');

  // Restaurar estado guardado
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  boxes.forEach((box) => {
    if (saved[box.id]) {
      box.checked = true;
      box.closest('li').classList.add('checked');
    }
  });
  updateProgress();

  boxes.forEach((box) => {
    box.addEventListener('change', () => {
      const state = JSON.parse(localStorage.getItem(storageKey) || '{}');
      state[box.id] = box.checked;
      localStorage.setItem(storageKey, JSON.stringify(state));
      box.closest('li').classList.toggle('checked', box.checked);
      updateProgress();
    });
  });

  function updateProgress() {
    const total = boxes.length;
    const done = Array.from(boxes).filter((b) => b.checked).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = `${done} de ${total} tareas completadas (${pct}%)`;
    if (pct === 100 && total > 0) {
      showToast('¡Actividad completa! Mostrale el resultado al docente 🎉');
    }
  }
}

/* ---------- Quiz rápido de autoevaluación ---------- */
function initQuiz() {
  document.querySelectorAll('.quiz').forEach((quiz) => {
    const buttons = quiz.querySelectorAll('.options button');
    const feedback = quiz.querySelector('.feedback');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        buttons.forEach((b) => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        if (!isCorrect) btn.classList.add('incorrect');
        if (feedback) {
          feedback.textContent = isCorrect
            ? '✅ ¡Correcto! ' + (btn.dataset.explain || '')
            : '❌ No es la opción correcta. ' + (btn.dataset.explain || 'Fijate cuál quedó resaltada en verde.');
        }
      });
    });
  });
}

/* ---------- Demo interactivo de Flexbox (Sesión 3) ----------
   Permite a los alumnos cambiar en vivo flex-direction, justify-content
   y align-items, y ver el resultado + el código CSS equivalente. */
function initFlexDemo() {
  const demo = document.querySelector('.flex-demo');
  if (!demo) return;

  const stage = demo.querySelector('.demo-stage');
  const codeOut = demo.querySelector('.demo-code');
  const direction = demo.querySelector('#demo-direction');
  const justify = demo.querySelector('#demo-justify');
  const align = demo.querySelector('#demo-align');

  function render() {
    const d = direction.value;
    const j = justify.value;
    const a = align.value;

    stage.style.display = 'flex';
    stage.style.flexDirection = d;
    stage.style.justifyContent = j;
    stage.style.alignItems = a;

    if (codeOut) {
      codeOut.textContent =
        `.contenedor {\n` +
        `  display: flex;\n` +
        `  flex-direction: ${d};\n` +
        `  justify-content: ${j};\n` +
        `  align-items: ${a};\n` +
        `}`;
    }
  }

  [direction, justify, align].forEach((select) => {
    if (select) select.addEventListener('change', render);
  });

  render(); // estado inicial
}

/* ---------- Demo interactivo de CSS Grid: columnas, filas y gap (Sesión 4) ----------
   Permite a los alumnos cambiar en vivo grid-template-columns, grid-template-rows
   y gap, viendo el resultado y el código CSS equivalente. */
function initGridDemo() {
  const demo = document.querySelector('.grid-demo');
  if (!demo) return;

  const stage = demo.querySelector('.demo-stage');
  const codeOut = demo.querySelector('.demo-code');
  const cols = demo.querySelector('#demo-cols');
  const rows = demo.querySelector('#demo-rows');
  const gap = demo.querySelector('#demo-gap');
  const gapValue = demo.querySelector('.range-value');

  function render() {
    const c = cols.value;
    const r = rows.value;
    const g = gap.value;

    stage.style.display = 'grid';
    stage.style.gridTemplateColumns = c;
    stage.style.gridTemplateRows = r;
    stage.style.gap = g + 'px';

    if (gapValue) gapValue.textContent = g + 'px';

    if (codeOut) {
      codeOut.textContent =
        `.contenedor {\n` +
        `  display: grid;\n` +
        `  grid-template-columns: ${c};\n` +
        `  grid-template-rows: ${r};\n` +
        `  gap: ${g}px;\n` +
        `}`;
    }
  }

  [cols, rows, gap].forEach((input) => {
    if (input) input.addEventListener('input', render);
  });

  render(); // estado inicial
}

/* ---------- Demo interactivo de grid-template-areas (Sesión 4) ----------
   Botones "Escritorio" / "Móvil" que redefinen las áreas de rejilla
   en vivo, mostrando cómo un mismo HTML se reordena solo cambiando CSS. */
function initAreaDemo() {
  const demo = document.querySelector('.area-demo');
  if (!demo) return;

  const stage = demo.querySelector('.area-stage');
  const codeOut = demo.querySelector('.demo-code');
  const buttons = demo.querySelectorAll('.demo-toolbar button');

  const layouts = {
    desktop: {
      columns: '200px 1fr 200px',
      rows: 'auto 1fr auto',
      areas: `"header header header"\n    "nav main aside"\n    "footer footer footer"`
    },
    mobile: {
      columns: '1fr',
      rows: 'auto auto auto auto auto',
      areas: `"header"\n    "nav"\n    "main"\n    "aside"\n    "footer"`
    }
  };

  function render(mode) {
    const layout = layouts[mode];
    stage.style.gridTemplateColumns = layout.columns;
    stage.style.gridTemplateRows = layout.rows;
    stage.style.gridTemplateAreas = layout.areas.replace(/\n\s*/g, ' ');

    buttons.forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));

    if (codeOut) {
      codeOut.textContent =
        `.contenedor {\n` +
        `  display: grid;\n` +
        `  grid-template-columns: ${layout.columns};\n` +
        `  grid-template-rows: ${layout.rows};\n` +
        `  grid-template-areas:\n    ${layout.areas};\n` +
        `}`;
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => render(btn.dataset.mode));
  });

  render('desktop'); // estado inicial
}

/* ---------- Simulador de ancho para demos embebidas en <iframe> (Sesión 5) ----------
   Cada .iframe-demo tiene botones con data-width (en px) que cambian el ancho
   del iframe embebido, simulando distintos tamaños de pantalla SIN necesidad
   de que el alumno redimensione la ventana real del navegador. */
function initIframeDemos() {
  document.querySelectorAll('.iframe-demo').forEach((demo) => {
    const iframe = demo.querySelector('iframe');
    const buttons = demo.querySelectorAll('.demo-toolbar button');
    if (!iframe || !buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const width = btn.dataset.width;
        iframe.style.maxWidth = width === 'full' ? '1100px' : width + 'px';
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

/* ---------- Demo "constructor de clases utilitarias" (Tailwind, Sesión 6) ----------
   El alumno combina selects de padding, tamaño de fuente, color de fondo
   y redondeado; el resultado se aplica EN VIVO a un chip de vista previa,
   y se muestra la cadena exacta de clases utilitarias equivalente. */
function initUtilityDemo() {
  const demo = document.querySelector('.utility-demo');
  if (!demo) return;

  const chip = demo.querySelector('.preview-chip');
  const codeOut = demo.querySelector('.demo-code');
  const padding = demo.querySelector('#demo-padding');
  const textSize = demo.querySelector('#demo-text-size');
  const bgColor = demo.querySelector('#demo-bg-color');
  const rounded = demo.querySelector('#demo-rounded');

  // Mapas clase-Tailwind → estilo CSS real equivalente, para que el
  // preview se vea igual sin depender de que Tailwind esté cargado.
  const paddingMap = { 'p-2': '8px', 'p-4': '16px', 'p-6': '24px', 'p-8': '32px' };
  const textMap = { 'text-sm': '14px', 'text-base': '16px', 'text-xl': '20px', 'text-3xl': '30px' };
  const bgMap = {
    'bg-teal-500': '#14b8a6',
    'bg-violet-500': '#8b5cf6',
    'bg-orange-500': '#f97316',
    'bg-rose-500': '#f43f5e'
  };
  const roundedMap = { 'rounded-none': '0px', 'rounded-md': '6px', 'rounded-xl': '12px', 'rounded-full': '9999px' };

  function render() {
    const p = padding.value;
    const t = textSize.value;
    const b = bgColor.value;
    const r = rounded.value;

    chip.style.padding = paddingMap[p];
    chip.style.fontSize = textMap[t];
    chip.style.backgroundColor = bgMap[b];
    chip.style.borderRadius = roundedMap[r];

    if (codeOut) {
      codeOut.textContent = `<button class="${p} ${t} ${b} ${r} text-white font-bold">\n  Agregar al carrito\n</button>`;
    }
  }

  [padding, textSize, bgColor, rounded].forEach((select) => {
    if (select) select.addEventListener('change', render);
  });

  render(); // estado inicial
}

/* ---------- Demo E-COMMERCE CRUD FUNCIONAL (Sesión 7) ----------
   Mini versión en vivo, embebida dentro de la propia página, del mismo
   patrón CRUD que el alumno construye en su proyecto: un array "productos"
   como estado central, funciones puras para Create/Update/Delete, y una
   única función renderizarCatalogoDemo() que vuelve a dibujar todo el DOM
   cada vez que el estado cambia. Usa SOLO las clases genéricas pedidas
   (producto-card, producto-nombre, btn-editar, etc.) para que el alumno
   pueda copiar la estructura 1:1 a su propio archivo HTML/CSS. */
function initEcommerceDemo() {
  const root = document.querySelector('.ecommerce-demo');
  if (!root) return;

  // 1. ESTADO CENTRAL: un único array de objetos "productos"
  let productosDemo = [
    { id: 1, nombre: 'Auriculares Bluetooth Pro', descripcion: 'Cancelación de ruido activa', precio: 79.99, stock: 25, imagen: 'https://picsum.photos/seed/auriculares/300/200', categoria: 'electronica' },
    { id: 2, nombre: 'Teclado Mecánico RGB', descripcion: 'Switches mecánicos, retroiluminado', precio: 129.99, stock: 3, imagen: 'https://picsum.photos/seed/teclado/300/200', categoria: 'electronica' },
    { id: 3, nombre: 'Monitor 27" 4K', descripcion: 'UHD para diseño y gaming', precio: 449.99, stock: 8, imagen: 'https://picsum.photos/seed/monitor/300/200', categoria: 'electronica' },
    { id: 4, nombre: 'Mochila Urbana', descripcion: 'Compartimento acolchado para notebook', precio: 39.5, stock: 14, imagen: 'https://picsum.photos/seed/mochila/300/200', categoria: 'accesorios' }
  ];

  const grid = root.querySelector('.producto-grid');
  const buscador = root.querySelector('.input-buscar');
  const filtroCategoria = root.querySelector('.filtro-categoria');
  const resultCount = root.querySelector('.result-count');
  const btnMostrarForm = root.querySelector('.btn-agregar-toggle');
  const form = root.querySelector('.form-producto');
  const formTitulo = form.querySelector('.form-titulo');
  const btnCancelar = form.querySelector('.btn-cancelar');
  let editandoId = null; // null = modo "crear" ; número = modo "editar"

  // 2. RENDERIZADO: recorre el array y reconstruye el DOM
  function renderizarCatalogoDemo(lista) {
    grid.innerHTML = ''; // limpiamos antes de redibujar

    if (lista.length === 0) {
      grid.innerHTML = '<p class="empty-state">No hay productos que coincidan con la búsqueda.</p>';
      resultCount.textContent = '0 productos';
      return;
    }

    lista.forEach((producto) => {
      // createElement + classList.add: construcción 100% por JS
      const tarjeta = document.createElement('article');
      tarjeta.classList.add('producto-card'); // EL INSTRUCTOR APLICA ESTILOS CSS AQUÍ
      tarjeta.dataset.id = producto.id;

      const img = document.createElement('img');
      img.classList.add('producto-imagen');
      img.setAttribute('src', producto.imagen);
      img.setAttribute('alt', producto.nombre);

      const nombre = document.createElement('h4');
      nombre.classList.add('producto-nombre');
      nombre.textContent = producto.nombre; // textContent: nunca innerHTML con datos de usuario

      const desc = document.createElement('p');
      desc.classList.add('producto-descripcion');
      desc.textContent = producto.descripcion;

      const precio = document.createElement('p');
      precio.classList.add('producto-precio');
      precio.textContent = `$${producto.precio.toFixed(2)}`;

      const stock = document.createElement('p');
      stock.classList.add('producto-stock');
      if (producto.stock <= 5) stock.classList.add('low');
      stock.textContent = producto.stock <= 5
        ? `⚠ Stock bajo: ${producto.stock} u.`
        : `Stock: ${producto.stock} u.`;

      const acciones = document.createElement('div');
      acciones.classList.add('card-actions');

      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn-editar');
      btnEditar.textContent = 'Editar';
      btnEditar.addEventListener('click', () => abrirFormularioEdicion(producto.id));

      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn-eliminar');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.addEventListener('click', () => eliminarProductoDemo(producto.id));

      acciones.append(btnEditar, btnEliminar);
      tarjeta.append(img, nombre, desc, precio, stock, acciones);
      grid.appendChild(tarjeta);
    });

    resultCount.textContent = `${lista.length} producto${lista.length === 1 ? '' : 's'}`;
  }

  // 3. READ con filtros: búsqueda por texto + filtro de categoría combinados
  function aplicarFiltros() {
    const texto = buscador.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;

    const filtrados = productosDemo.filter((p) => {
      const coincideTexto = p.nombre.toLowerCase().includes(texto);
      const coincideCategoria = categoria === 'todas' || p.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });

    renderizarCatalogoDemo(filtrados);
  }

  // 4. CREATE / UPDATE comparten el mismo formulario
  function abrirFormularioCreacion() {
    editandoId = null;
    formTitulo.textContent = 'Nuevo producto';
    form.reset();
    form.classList.add('open');
    form.querySelector('.input-nombre').focus();
  }

  function abrirFormularioEdicion(id) {
    const producto = productosDemo.find((p) => p.id === id); // READ puntual por id
    if (!producto) return;
    editandoId = id;
    formTitulo.textContent = `Editando: ${producto.nombre}`;
    form.querySelector('.input-nombre').value = producto.nombre;
    form.querySelector('.input-descripcion').value = producto.descripcion;
    form.querySelector('.input-precio').value = producto.precio;
    form.querySelector('.input-stock').value = producto.stock;
    form.querySelector('.input-categoria').value = producto.categoria;
    form.classList.add('open');
  }

  function cerrarFormulario() {
    form.classList.remove('open');
    form.reset();
    editandoId = null;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // evita que el formulario recargue la página

    const nombre = form.querySelector('.input-nombre').value.trim();
    const descripcion = form.querySelector('.input-descripcion').value.trim();
    const precio = parseFloat(form.querySelector('.input-precio').value);
    const stock = parseInt(form.querySelector('.input-stock').value, 10);
    const categoria = form.querySelector('.input-categoria').value;

    // Validación mínima antes de tocar el estado
    if (!nombre || isNaN(precio) || isNaN(stock)) {
      showToast('Completá nombre, precio y stock correctamente');
      return;
    }

    if (editandoId === null) {
      // CREATE: Date.now() como generador simple de id único
      productosDemo.push({
        id: Date.now(),
        nombre, descripcion, precio, stock, categoria,
        imagen: `https://picsum.photos/seed/${Date.now()}/300/200`
      });
      showToast('Producto agregado ✅');
    } else {
      // UPDATE: findIndex localiza la posición exacta a reemplazar
      const index = productosDemo.findIndex((p) => p.id === editandoId);
      if (index !== -1) {
        productosDemo[index] = { ...productosDemo[index], nombre, descripcion, precio, stock, categoria };
        showToast('Producto actualizado ✏️');
      }
    }

    cerrarFormulario();
    aplicarFiltros(); // re-renderiza respetando el filtro/búsqueda activos
  });

  function eliminarProductoDemo(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    productosDemo = productosDemo.filter((p) => p.id !== id); // DELETE
    showToast('Producto eliminado 🗑️');
    aplicarFiltros();
  }

  btnMostrarForm.addEventListener('click', () => {
    if (form.classList.contains('open') && editandoId === null) {
      cerrarFormulario();
    } else {
      abrirFormularioCreacion();
    }
  });
  btnCancelar.addEventListener('click', cerrarFormulario);
  buscador.addEventListener('input', aplicarFiltros);
  filtroCategoria.addEventListener('change', aplicarFiltros);

  renderizarCatalogoDemo(productosDemo); // primer render al cargar la página
}

/* ---------- Demo: "cómo se enlazan HTML, CSS y JS" (Sesión 7) ----------
   Materializa el patrón de 4 pasos: (1) el HTML tiene los ganchos con id,
   (2) querySelector los trae, (3) addEventListener los cablea y (4) el
   callback lee .value y escribe en el DOM con textContent / classList.
   Cada interacción se registra indicando QUÉ capa intervino, para que el
   alumno vea el enlace evento → JS → CSS ocurriendo en vivo. */
function initWiringDemo() {
  const widget = document.querySelector('.wiring-demo');
  if (!widget) return;

  const entrada = widget.querySelector('#wd-nombre');
  const salida = widget.querySelector('#wd-salida');
  const btnSaludar = widget.querySelector('#wd-saludar');
  const btnDestacar = widget.querySelector('#wd-destacar');
  const log = widget.querySelector('.wiring-log');
  const btnLimpiar = widget.querySelector('.wiring-log-clear');

  if (!entrada || !salida) return;

  // Escribe una línea en el "registro de ejecución" etiquetando la capa
  function registrar(tipo, mensaje) {
    if (!log) return;

    const vacio = log.querySelector('.lg-empty');
    if (vacio) vacio.remove();

    const item = document.createElement('li');
    const tag = document.createElement('span');
    tag.className = 'lg-tag ' + tipo;
    tag.textContent = tipo === 'event' ? 'EVENTO' : tipo.toUpperCase();

    const texto = document.createElement('span');
    texto.textContent = mensaje;

    item.append(tag, texto);
    log.appendChild(item);
    log.scrollTop = log.scrollHeight; // autoscroll al último mensaje
  }

  btnSaludar.addEventListener('click', () => {
    const nombre = entrada.value.trim();

    // 1) el navegador emitió el evento
    registrar('event', "click en #wd-saludar disparó el callback del listener");

    if (!nombre) {
      registrar('js', 'entrada.value está vacío → se muestra un aviso en vez de saludar');
      salida.textContent = 'Escribí tu nombre primero 🙂';
      return;
    }

    // 2) JS lee el valor del input
    registrar('js', `entrada.value = "${nombre}" (siempre es un string)`);
    // 3) JS escribe en el DOM
    salida.textContent = 'Hola, ' + nombre + ' 👋';
    registrar('js', 'salida.textContent = "Hola, ' + nombre + ' 👋" → el <p> cambió de texto');
    // 4) CSS repinta (solo si no está destacado, para no pisar esa clase)
    registrar('css', '#wd-salida.destacado aplica el color cian definido en el CSS');
  });

  btnDestacar.addEventListener('click', () => {
    registrar('event', "click en #wd-destacar disparó el callback del listener");

    // classList.toggle: agrega la clase si no está, la quita si ya está
    salida.classList.toggle('destacado');
    const activa = salida.classList.contains('destacado');

    registrar('js', `salida.classList.toggle('destacado') → clase ${activa ? 'AGREGADA' : 'QUITADA'}`);
    registrar('css', activa
      ? 'El CSS ahora coincide con la regla .destacado y repinta el fondo y el color'
      : 'Al quitarse la clase, el CSS vuelve al estado base de #wd-salida');
  });

  // Enter dentro del input equivale a tocar "Saludar" (mejora la UX)
  entrada.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      btnSaludar.click();
    }
  });

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      log.innerHTML = '';
      const item = document.createElement('li');
      item.className = 'lg-empty';
      item.textContent = 'Registro limpio. Volvé a tocar los botones para ver el enlace en acción.';
      log.appendChild(item);
      salida.classList.remove('destacado');
      salida.textContent = 'Todavía no saludaste a nadie.';
    });
  }
}

/* ---------- Toast simple de feedback ---------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}
