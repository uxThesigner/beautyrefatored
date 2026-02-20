// Page: criar-conta.html
(function () {
  function init() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('signup-name')?.value || '';
      const username = document.getElementById('signup-username')?.value || '';
      const password = document.getElementById('signup-password')?.value || '';

      if (!window.BeautyAuth) {
        alert('Não foi possível criar a conta agora.');
        return;
      }

      const result = BeautyAuth.signup({ name, username, password });
      if (!result.ok) {
        const msg = result.error === 'user_exists'
          ? 'Esse acesso já existe. Tente outro.'
          : 'Não foi possível criar a conta. Verifique os dados.';
        alert(msg);
        return;
      }

      // Sempre cliente
      window.location.href = 'cliente.html';
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
