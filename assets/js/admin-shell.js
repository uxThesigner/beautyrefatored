// ======================================================
// ADMIN-SHELL.JS - MENU LATERAL PADRÃO (PARTIAL)
// ======================================================
(function () {
  function getRole() {
    if (window.BeautyAuth) return BeautyAuth.role();
    // fallback legado: se o usuário "logou" no modo antigo, trata como cliente
    return null;
  }

  function guardAdminArea() {
    if (!window.BeautyAuth || !BeautyAuth.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }

    const role = BeautyAuth.role();
    const current = (window.location.pathname.split('/').pop() || 'admin.html').split('?')[0];

    // Staff só pode: agenda + crm
    if (role === 'staff') {
      const allowed = ['agenda.html', 'crm.html'];
      if (!allowed.includes(current)) {
        window.location.href = 'agenda.html';
        return false;
      }
    }

    // Cliente nunca entra no admin
    if (role === 'cliente') {
      window.location.href = 'cliente.html';
      return false;
    }

    return true;
  }

  function setActiveLink() {
    const current = (window.location.pathname.split('/').pop() || 'admin.html').split('?')[0];
    document.querySelectorAll('.admin-nav a').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (href && href === current) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  function applyRbacToSidebar() {
    if (!window.BeautyAuth) return;
    const role = BeautyAuth.role();
    document.querySelectorAll('.admin-nav li[data-rbac]').forEach((li) => {
      const allowed = (li.getAttribute('data-rbac') || '').split(',').map(s => s.trim()).filter(Boolean);
      if (!allowed.length) return;
      li.style.display = allowed.includes(role) ? '' : 'none';
    });
  }

  function initAdminSidebar() {
    if (typeof loadComponent !== 'function') return;
    if (!guardAdminArea()) return;
    const placeholder = document.getElementById('admin-sidebar-placeholder');
    if (!placeholder) return;

    loadComponent('admin-sidebar-placeholder', 'partials/admin-sidebar.html', () => {
      applyRbacToSidebar();
      setActiveLink();
    });
  }

  document.addEventListener('DOMContentLoaded', initAdminSidebar);
})();
