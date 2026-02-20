// Page: beauty.html (Admin - Gestão Beauty Club)
(function () {
  function init() {
    const searchInput = document.querySelector('input[type="text"], input');
    const tableBody = document.getElementById('club-table-body');

    if (searchInput && tableBody) {
      searchInput.addEventListener('keyup', (e) => {
        const term = (e.target.value || '').toLowerCase();
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row) => {
          const text = (row.innerText || '').toLowerCase();
          row.style.display = text.includes(term) ? '' : 'none';
        });
      });
    }

    const btnSync = document.getElementById('btn-sync');
    if (btnSync) btnSync.addEventListener('click', () => location.reload());
  }

  document.addEventListener('DOMContentLoaded', init);
})();
