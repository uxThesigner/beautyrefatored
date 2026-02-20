// Page: historico.html
(function () {
  function init() {
    document.querySelectorAll('[data-go-to]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-go-to');
        if (url) window.location.href = url;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
