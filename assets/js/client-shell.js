// ======================================================
// CLIENT-SHELL.JS - MENU LATERAL PADRÃO (PARTIAL) + RBAC
// ======================================================
(function () {
  function guardClientArea() {
    if (!window.BeautyAuth || !BeautyAuth.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }

    const role = BeautyAuth.role();

    // Cliente ok
    if (role === 'cliente') return true;

    // Staff/Admin não devem entrar na área do cliente
    if (role === 'staff' || role === 'admin') {
      window.location.href = BeautyAuth.redirectForRole(role);
      return false;
    }

    window.location.href = 'login.html';
    return false;
  }

  function setActiveLink() {
    const current = (window.location.pathname.split('/').pop() || 'cliente.html').split('?')[0];
    document.querySelectorAll('.client-sidebar a[href]').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (!href) return;
      if (href === current) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  function applyUserInfo() {
    if (!window.BeautyAuth) return;
    const session = BeautyAuth.getSession();
    if (!session) return;

    const fullNameEl = document.getElementById('user-full-name');
    if (fullNameEl) fullNameEl.textContent = session.name || session.username || 'Cliente';

    const initialsEl = document.getElementById('user-initials');
    if (initialsEl) {
      const name = (session.name || session.username || 'C').toString().trim();
      const parts = name.split(/\s+/).filter(Boolean);
      const initials = (parts[0]?.[0] || 'C') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : '');
      initialsEl.textContent = initials.toUpperCase();
    }
  }

  function ensureActiveCss() {
    // CSS mínimo (não altera layout): apenas destaque
    if (document.getElementById('client-shell-active-style')) return;
    const style = document.createElement('style');
    style.id = 'client-shell-active-style';
    style.textContent = `.client-sidebar a.active{color: var(--color-accent) !important; font-weight: bold !important;}`;
    document.head.appendChild(style);
  }

  function initClientSidebar() {
    if (typeof loadComponent !== 'function') return;
    if (!guardClientArea()) return;

    const placeholder = document.getElementById('client-sidebar-placeholder');
    if (!placeholder) return;

    loadComponent('client-sidebar-placeholder', 'partials/client-sidebar.html', () => {
      ensureActiveCss();
      applyUserInfo();
      setActiveLink();
    });
  }

  document.addEventListener('DOMContentLoaded', initClientSidebar);
})();
