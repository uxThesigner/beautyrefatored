// Page: dados.html
(function () {
  function init() {
    const btn = document.getElementById('btn-save');
    if (!btn) return;

    btn.addEventListener('click', () => {
      // Placeholder (V2.0: persistir no banco)
      alert('Dados atualizados com sucesso!');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
