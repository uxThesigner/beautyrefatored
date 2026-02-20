// Page: anamnese.html (Admin - Prontuários & Anamneses)
(function () {
  function init() {
    const input = document.getElementById('searchName');
    if (input) {
      input.addEventListener('keyup', (e) => {
        const term = (e.target.value || '').toLowerCase();
        document.querySelectorAll('.anamnese-card').forEach((card) => {
          const nameEl = card.querySelector('h3');
          const name = (nameEl ? nameEl.innerText : '').toLowerCase();
          card.style.display = name.includes(term) ? 'grid' : 'none';
        });
      });
    }

    document.querySelectorAll('[data-go-to]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-go-to');
        if (url) window.location.href = url;
      });
    });

    // Botões de impressão (placeholder: imprime a página)
    document.querySelectorAll('.btn-view[title="Imprimir PDF"]').forEach((btn) => {
      btn.addEventListener('click', () => window.print());
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
