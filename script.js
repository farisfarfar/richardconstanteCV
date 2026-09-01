// ==========================================================================
// Richard Constante — Portafolio profesional
// Interacciones: menú móvil, header al hacer scroll, barra de progreso,

// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const ledgerProgress = document.getElementById('ledgerProgress');
  const yearEl = document.getElementById('year');
  const emailCopy = document.getElementById('emailCopy');
  const copyHint = document.getElementById('copyHint');

  // Año dinámico en el footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---------- Menú móvil ----------
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Header con sombra + barra de progreso al hacer scroll ----------
  const updateOnScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 12);
    }

    if (ledgerProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      ledgerProgress.style.width = `${progress}%`;
    }
  };

  window.addEventListener('scroll', updateOnScroll, { passive: true });
  updateOnScroll();

  // ---------- Revelado de secciones al hacer scroll ----------
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: mostrar todo si no hay soporte de IntersectionObserver
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Resaltar enlace de navegación activo ----------
  const sections = document.querySelectorAll('main section[id]');

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('id');
          const link = document.querySelector(`.nav-link[href="#${id}"]`);
          if (!link) return;

          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  // ---------- Copiar correo al portapapeles ----------
  if (emailCopy && copyHint) {
    const defaultHint = copyHint.textContent;

    emailCopy.addEventListener('click', async () => {
      const email = emailCopy.dataset.email;

      try {
        await navigator.clipboard.writeText(email);
        copyHint.textContent = '¡Copiado!';
      } catch (err) {
        // Si el navegador bloquea el portapapeles, se ofrece un enlace mailto
        window.location.href = `mailto:${email}`;
        copyHint.textContent = 'Abriendo…';
      }

      setTimeout(() => {
        copyHint.textContent = defaultHint;
      }, 2000);
    });
  }
});
