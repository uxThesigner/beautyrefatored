// page-promocoes.js - Lógica de Renderização
document.addEventListener('DOMContentLoaded', () => {
    
    // Verifica se os dados existem antes de tentar rodar
    if (typeof PROMO_DATA === 'undefined') {
        console.error("ERRO: O arquivo promocoes.js não foi carregado.");
        return;
    }

    renderFeaturedPromo();
    renderPromoGrid();
});

function renderFeaturedPromo() {
    const container = document.getElementById('featured-promo-container');
    const data = PROMO_DATA.featured;

    if (!container || !data) return;

    container.innerHTML = `
        <div class="featured-image-col">
            <div class="img-frame">
                <img src="${data.image}" alt="${data.title.replace('<br>', ' ')}">
            </div>
        </div>
        <div class="featured-text-col">
            <span class="featured-badge">${data.tag}</span>
            <h2>${data.title}</h2>
            <p>${data.description}</p>
            <div class="price-row">
                <span class="old">${data.oldPrice}</span>
                <span class="new">${data.newPrice}</span>
            </div>
            <a href="${data.link}" class="btn btn-primary">${data.btnText}</a>
        </div>
    `;
}

function renderPromoGrid() {
    const container = document.getElementById('promo-grid-container');
    const items = PROMO_DATA.items;

    if (!container || !items) return;

    container.innerHTML = items.map(item => `
        <div class="promo-card-item">
            <div class="card-tag">${item.tag}</div>
            <div class="card-img"><img src="${item.image}" alt="${item.title}"></div>
            <div class="card-body">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="card-price">${item.price}</span>
                <a href="${item.link}" class="btn btn-primary full-btn">${item.btnText}</a>
            </div>
        </div>
    `).join('');
}
