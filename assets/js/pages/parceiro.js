// Page: parceiro.html (Detalhe do parceiro)
(function () {
  function formatPhone(phone) {
    if (!phone) return '';
    const only = phone.toString().replace(/\D/g, '');
    const m = only.match(/^(?:55)?(\d{2})(\d{4,5})(\d{4})$/);
    if (!m) return phone;
    const ddd = m[1];
    const p1 = m[2];
    const p2 = m[3];
    return `(${ddd}) ${p1}-${p2}`;
  }

  function init() {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('id');

    if (!pid || typeof PARTNERS === 'undefined') {
      const main = document.querySelector('main');
      if (main) {
        main.innerHTML = '<div class="container" style="padding:100px; text-align:center;">Parceiro não encontrado. <a href="index.html">Voltar</a></div>';
      }
      return;
    }

    const p = PARTNERS.find((partner) => partner.id === pid);
    if (!p) return;

    const brand = (typeof wlBrandName === 'function') ? wlBrandName() : (window.WL?.config?.business?.name || '');
    document.title = `${p.name} | Parceiro | ${brand}`.trim();

    const img = document.getElementById('p-image');
    if (img) img.src = `imagens/Fotos Parceiros/${p.image}`;

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('p-name', p.name);
    setText('p-role', p.role);
    setText('p-company', p.company);

    const instaClean = (p.instagram || '').replace('@', '').trim();
    const btnInsta = document.getElementById('btn-insta');
    if (btnInsta && instaClean) btnInsta.href = `https://instagram.com/${instaClean}`;

    const btnWhats = document.getElementById('btn-whats');
    if (btnWhats) {
      if (p.whatsapp) {
        const whatsNum = p.whatsapp.toString().replace(/\D/g, '');
        btnWhats.href = `https://wa.me/${whatsNum}`;
      } else {
        btnWhats.style.display = 'none';
      }
    }

    setText('p-desc', p.description || (brand ? `Profissional parceiro da ${brand}.` : 'Profissional parceiro.'));
    setText('p-address', p.address || 'Endereço sob consulta.');
    setText('p-phone', p.whatsapp ? formatPhone(p.whatsapp) : 'Contato via Instagram');

    const servList = document.getElementById('p-services-list');
    if (servList) {
      if (p.services && p.services.length > 0) {
        servList.innerHTML = p.services
          .map((s) => `
            <div class="service-list-item">
              <span class="service-name">${escapeHtml(s.name)}</span>
              <span class="service-price">${escapeHtml(s.price)}</span>
            </div>
          `)
          .join('');
      } else {
        servList.innerHTML = '<p>Entre em contato para consultar valores.</p>';
      }
    }

    if (p.portfolio && p.portfolio.length > 0) {
      const sec = document.getElementById('portfolio-section');
      if (sec) sec.style.display = 'block';

      const portGrid = document.getElementById('p-portfolio-grid');
      if (portGrid) {
        portGrid.innerHTML = p.portfolio
          .map((item) => `
            <div class="portfolio-item-wrapper">
              <div class="portfolio-img-box">
                <img src="imagens/Resultados/${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
              </div>
              <p class="portfolio-caption">${escapeHtml(item.title)}</p>
            </div>
          `)
          .join('');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
