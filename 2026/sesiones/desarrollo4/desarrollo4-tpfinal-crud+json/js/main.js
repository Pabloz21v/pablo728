/* ======================================================================
   TP-Final Integrador — Script compartido
   Funciones: menú móvil, tabla de contenidos activa (scroll-spy),
   checklist con progreso persistido (localStorage), quiz rápido,
   pestañas, botón "copiar código", carga del código fuente completo,
   simulador de ancho del iframe y toast de feedback.
   No depende de ningún framework: JavaScript puro (ES6+).
   ====================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCopyButtons();
  initScrollSpy();
  initChecklist();
  initQuiz();
  initTabs();
  initFrameDemos();
  initCodeLoader();
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

/* ---------- Botón "copiar" en bloques de código ----------
   Los bloques marcados con [data-own-copy] manejan su propia copia
   (por ejemplo el visor JSON del laboratorio): se saltean para no
   enganchar dos manejadores en el mismo botón. */
function initCopyButtons() {
  document.querySelectorAll('.code-block').forEach((block) => {
    if (block.hasAttribute('data-own-copy')) return;
    const btn = block.querySelector('.copy-btn');
    const codeEl = block.querySelector('pre code');
    if (!btn || !codeEl) return;

    btn.addEventListener('click', async () => {
      const texto = codeEl.textContent;
      if (!texto.trim()) {
        btn.textContent = 'Sin contenido';
        setTimeout(() => (btn.textContent = 'Copiar'), 1800);
        return;
      }
      try {
        await navigator.clipboard.writeText(texto);
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

/* ---------- Checklist con progreso guardado ----------
   Cada .checklist busca SU .progress-bar-fill y SU .progress-label dentro
   del contenedor más cercano (.lab-box / .crud-lab / section), así pueden
   convivir varios checklists en la misma página sin pisarse. */
function initChecklist() {
  document.querySelectorAll('.checklist').forEach((list) => {
    const scope = list.closest('.lab-box') || list.closest('section') || document;
    const storageKey = list.dataset.storageKey || 'dev4-checklist';
    const boxes = list.querySelectorAll('input[type="checkbox"]');
    const bar = scope.querySelector('.progress-bar-fill');
    const label = scope.querySelector('.progress-label');
    if (!boxes.length) return;

    // Restaurar estado guardado
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (err) {
      saved = {};
    }

    boxes.forEach((box) => {
      if (saved[box.id]) {
        box.checked = true;
        box.closest('li').classList.add('checked');
      }
    });
    updateProgress();

    boxes.forEach((box) => {
      box.addEventListener('change', () => {
        let state = {};
        try {
          state = JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch (err) {
          state = {};
        }
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
        showToast('¡Checklist completo! Guardá el progreso y mostralo en la defensa 🎉');
      }
    }
  });
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

/* ---------- Pestañas genéricas ----------
   Estructura esperada:
   <div class="tabs">
     <div class="tab-buttons"><button data-tab="x">...</button></div>
     <div class="tab-panel" data-panel="x">...</div>
   </div> */
function initTabs() {
  document.querySelectorAll('.tabs').forEach((tabs) => {
    const buttons = tabs.querySelectorAll('.tab-buttons button');
    const panels = tabs.querySelectorAll('.tab-panel');
    if (!buttons.length || !panels.length) return;

    function activate(name) {
      buttons.forEach((b) => {
        const on = b.dataset.tab === name;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', String(on));
      });
      panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === name));
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => activate(btn.dataset.tab));
    });

    activate(buttons[0].dataset.tab);
  });
}

/* ---------- Simulador de ancho para la demo embebida ----------
   Botones con data-width (en px o "full") que cambian el ancho del
   iframe, para ver el mismo HTML en formato escritorio / tablet / móvil. */
function initFrameDemos() {
  document.querySelectorAll('.demo-frame').forEach((demo) => {
    const iframe = demo.querySelector('iframe');
    const buttons = demo.querySelectorAll('.frame-toolbar button');
    if (!iframe || !buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const width = btn.dataset.width;
        iframe.style.maxWidth = width === 'full' ? '1000px' : width + 'px';
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

/* ---------- Carga del código fuente completo ----------
   El bloque #codigo-original se llena con el contenido real del archivo
   ofrecido (original/ecommerce-codigo-ing-invertida.html). Se usa fetch +
   textContent: nunca innerHTML, así el código se ve tal cual y no se
   interpreta como HTML. Si el fetch falla (por ejemplo al abrir el archivo
   con file://) se muestra un aviso con el enlace de descarga directa. */
function initCodeLoader() {
  const target = document.querySelector('#codigo-original code');
  if (!target) return;

  const file = 'original/ecommerce-codigo-ing-invertida.html';

  fetch(file)
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then((texto) => {
      target.textContent = texto;
      const meta = document.getElementById('codigo-original-meta');
      if (meta) {
        const lineas = texto.split('\n').length;
        meta.textContent = `${file} · ${lineas} líneas · ${(texto.length / 1024).toFixed(1)} KB`;
      }
    })
    .catch(() => {
      target.textContent =
        '// No se pudo cargar el archivo por fetch (por ejemplo, abriendo la página con file://).\n' +
        '// Usá el botón "Descargar archivo" o abrí la ruta: ' + file;
      showToast('No se pudo leer el archivo; usá el botón de descarga');
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

// Disponible también para crud-demo.js
window.showToast = showToast;
