// Page: novo.html (Novo Atendimento)
(function () {
  function init() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Simula o loading inicial
    if (step1 && step2) {
      setTimeout(() => {
        step1.classList.remove('active');
        step2.classList.add('active');
      }, 2500);
    }

    // Navegação por cards
    document.querySelectorAll('[data-go-to]').forEach((el) => {
      el.addEventListener('click', () => {
        const url = el.getAttribute('data-go-to');
        if (url) window.location.href = url;
      });
    });

    // Voltar
    const backBtn = document.getElementById('btn-back');
    if (backBtn) backBtn.addEventListener('click', () => window.history.back());
  }

  document.addEventListener('DOMContentLoaded', init);
})();
