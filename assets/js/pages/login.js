// Page: login.html
(function () {
  function init() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const loginInput = document.getElementById('email');
      const passInput = document.getElementById('password');
      const loginId = loginInput ? loginInput.value : '';
      const password = passInput ? passInput.value : '';

      if (!window.BeautyAuth) {
        // Fallback ultra simples (caso auth.js não carregue)
        localStorage.setItem('beauty_auth', 'true');
        window.location.href = 'cliente.html';
        return;
      }

      const result = BeautyAuth.login(loginId, password);
      if (!result.ok) {
        // Mantém UI intacta: feedback mínimo via alert
        alert('Acesso inválido. Verifique seu login e senha.');
        return;
      }

      const r = BeautyAuth.role();
      window.location.href = BeautyAuth.redirectForRole(r);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
