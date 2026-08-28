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
