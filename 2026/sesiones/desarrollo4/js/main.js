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
