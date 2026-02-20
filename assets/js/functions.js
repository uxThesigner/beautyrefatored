// ======================================================
// WHITE-LABEL - FUNCTIONS.JS
// ======================================================

let cartItems = [];
let appliedCoupon = null;

// --- WHITE-LABEL HELPERS ---
function wlBrandName() {
    return (window.WL && WL.config && WL.config.business && WL.config.business.name) ? WL.config.business.name :
           (window.APP_CONFIG && APP_CONFIG.business && APP_CONFIG.business.name) ? APP_CONFIG.business.name : '';
}
function wlBrandNameUpper() {
    return wlBrandName() ? wlBrandName().toUpperCase() : '';
}

// --- CORE & INIT ---

function escapeHtml(text) {
    if (!text) return text;
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function setupHeaderLogic() {
    setupScrolledHeader();
    syncHeaderPlaceholderHeight(); 
    setupMobileMenu(); 
    setupSearch(); 
    updateCartCount();

    setupAccountMenu();

    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.cart || e.key === STORAGE_KEYS.coupon) {
            loadCart(); 
            updateCartCount();
            if (document.body.classList.contains('cart-page')) renderCartPage();
            if (document.body.classList.contains('checkout-page')) setupPaymentPage(); 
        }
    });
}


function setupAccountMenu() {
    const AUTH_KEY = 'beauty_auth';
    const SESSION_KEY = (window.BeautyAuth && BeautyAuth.SESSION_KEY) ? BeautyAuth.SESSION_KEY : 'beauty_session_v1';
    const isLogged = () => window.BeautyAuth ? BeautyAuth.isLoggedIn() : (localStorage.getItem(AUTH_KEY) === 'true');
    const getRole = () => {
        if (window.BeautyAuth) return BeautyAuth.role();
        return isLogged() ? 'cliente' : null;
    };

    

    // Logout global (cobre dropdown, menu mobile e menus internos como cliente.html)
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[data-account-action="logout"]');
        if (!a) return;
        e.preventDefault();
        if (window.BeautyAuth) BeautyAuth.logout();
        else localStorage.removeItem(AUTH_KEY);
        window.location.href = 'index.html';
    });
function applyVisibility(root) {
        if (!root) return;
        root.querySelectorAll('.account-logged-in').forEach(el => {
            el.style.display = isLogged() ? '' : 'none';
        });
        root.querySelectorAll('.account-logged-out').forEach(el => {
            el.style.display = isLogged() ? 'none' : '';
        });

        // RBAC no dropdown: itens exclusivos de cliente vs staff/admin
        const r = getRole();
        root.querySelectorAll('.account-role-client').forEach(el => {
            el.style.display = (r === 'cliente') ? '' : 'none';
        });
        root.querySelectorAll('.account-role-staff-admin').forEach(el => {
            el.style.display = (r === 'staff' || r === 'admin') ? '' : 'none';
        });
    }

    // Desktop dropdown (header-right)
    const dropdown = document.getElementById('account-dropdown');
    if (dropdown) {
        const btn = dropdown.querySelector('.account-toggle');
        const close = () => dropdown.classList.remove('open');

        applyVisibility(dropdown);

        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });
        }

        dropdown.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const action = a.getAttribute('data-account-action');
            if (action === 'logout') {
                e.preventDefault();
                if (window.BeautyAuth) BeautyAuth.logout();
                else localStorage.removeItem(AUTH_KEY);
                close();
                window.location.href = 'index.html';
            }
        });

        document.addEventListener('click', close);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    // Mobile menu account section (same classes)
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        applyVisibility(mobileMenu);

        mobileMenu.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const action = a.getAttribute('data-account-action');
            if (action === 'logout') {
                e.preventDefault();
                if (window.BeautyAuth) BeautyAuth.logout();
                else localStorage.removeItem(AUTH_KEY);
                window.location.href = 'index.html';
            }
        });
    }

    // Keep in sync if auth changes in another tab
    window.addEventListener('storage', (e) => {
        if (e.key === AUTH_KEY || e.key === SESSION_KEY) {
            applyVisibility(dropdown);
            applyVisibility(mobileMenu);
        }
    });
}


function loadComponent(id, url, cb) {
    const el = document.getElementById(id); 
    if (!el) return;

    fetch(url)
        .then(r => r.ok ? r.text() : Promise.reject(r.statusText))
        .then(h => { 
            el.innerHTML = h;
            if (window.WL && typeof WL.applyBindings === 'function') WL.applyBindings(el);
            if(cb) cb(); 
        })
        .catch(e => console.error(e));
}

// White-label: chaves de storage por cliente (evita colisão entre clientes)
const __WL_PREFIX = (window.WL && WL.config && WL.config.client && WL.config.client.id) ? WL.config.client.id : 'client';
const STORAGE_KEYS = {
    cart: `${__WL_PREFIX}_cart`,
    coupon: `${__WL_PREFIX}_appliedCouponCode`,
    appointment: `${__WL_PREFIX}_appointmentISO`,
    lgpd: 'lgpdConsent' // pode ser global mesmo
};

// --- AGENDAMENTO (SERVIÇOS) ---
let __scheduleModalBound = false;
let __scheduleModalNext = null;

function initScheduleModal() {
    if (__scheduleModalBound) return;
    const modal = document.getElementById('schedule-modal');
    if (!modal) return;

    __scheduleModalBound = true;

    const closeBtn = document.getElementById('schedule-modal-close');
    const cancelBtn = document.getElementById('schedule-cancel-btn');
    const confirmBtn = document.getElementById('schedule-confirm-btn');
    const input = document.getElementById('appointment-datetime');

    const close = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        __scheduleModalNext = null;
    };

    const open = () => {
        // pré-preenche com o último valor escolhido
        const stored = localStorage.getItem(STORAGE_KEYS.appointment);
        if (input) {
            input.value = stored || '';
            try {
                const now = new Date();
                // datetime-local espera horário local; toISOString() é UTC.
                const local = new Date(now.getTime() - now.getTimezoneOffset()*60000);
                input.min = local.toISOString().slice(0,16);
                input.step = 900; // 15min
            } catch (e) {}
        }
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        setTimeout(() => input && input.focus(), 50);
    };

    // Click fora fecha
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    // ESC fecha
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
    closeBtn && closeBtn.addEventListener('click', close);
    cancelBtn && cancelBtn.addEventListener('click', close);

    confirmBtn && confirmBtn.addEventListener('click', () => {
        const v = input ? (input.value || '').trim() : '';
        if (!v) {
            if (input) { input.focus(); input.style.borderColor = 'red'; }
            return;
        }
        if (input) input.style.borderColor = '';
        localStorage.setItem(STORAGE_KEYS.appointment, v);
        const next = __scheduleModalNext;
        close();
        if (typeof next === 'function') next(v);
    });

    // expõe abrir modal
    window.WL_openScheduleModal = (next) => {
        __scheduleModalNext = next;
        open();
    };
}

function formatAppointmentBR(iso) {
    if (!iso) return '';
    // iso esperado: YYYY-MM-DDTHH:mm
    const [dPart, tPart] = iso.split('T');
    if (!dPart || !tPart) return iso;
    const [y,m,d] = dPart.split('-');
    const hhmm = tPart.slice(0,5);
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y} ${hhmm}`;
}



// --- LÓGICA DO CARRINHO ---

function saveCart() { 
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems)); 
}

function loadCart() { 
    const stored = localStorage.getItem(STORAGE_KEYS.cart);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            cartItems = parsed.map(item => {
                if (item.id === 'custom-avaliacao') return item;
                if (typeof PRODUCTS !== 'undefined') {
                    const live = PRODUCTS.find(p => p.id === item.id);
                    return live ? { ...item, name: live.name, image: live.image } : (item.isService ? item : null);
                }
                return item;
            }).filter(i => i !== null);
        } catch (e) {
            console.error("Erro ao ler carrinho:", e);
            cartItems = [];
        }
    } else {
        cartItems = [];
    }

    const cCode = localStorage.getItem(STORAGE_KEYS.coupon);
    if (cCode && typeof COUPONS !== 'undefined') {
        const c = COUPONS.find(x => x.code === cCode);
        const today = new Date().toISOString().split('T')[0];
        if (c && (!c.valid_until || c.valid_until >= today)) {
            appliedCoupon = c;
        } else { 
            localStorage.removeItem(STORAGE_KEYS.coupon); 
            appliedCoupon = null; 
        }
    }
}

function addItemToCart(pid, col, siz, qty) {
    if (typeof PRODUCTS === 'undefined') return; 

    const p = PRODUCTS.find(x => x.id === pid); 
    if (!p) return;

    let finalPrice = p.price; 

    if (p.region_prices && p.region_prices.length > 0) {
        const selectedRegionsNames = col.split(' + ');
        let baseRegionPrice = 0;
        selectedRegionsNames.forEach(name => {
            const regionData = p.region_prices.find(r => r.name === name);
            if (regionData) baseRegionPrice += regionData.price;
        });
        if (siz.toLowerCase().includes('pacote')) {
            finalPrice = baseRegionPrice * 3;
        } else {
            finalPrice = baseRegionPrice;
        }
    } 
    else if (siz.toLowerCase().includes('pacote') && p.price_package) {
        finalPrice = p.price_package;
    }
    else {
        finalPrice = p.price;
    }

    const id = `${pid}-${col}-${siz}`;
    const exist = cartItems.find(i => i.identifier === id);
    const isSrv = p.tags.includes('servico');

    if (exist) { 
        if (!isSrv) exist.quantity += qty; 
        exist.price = finalPrice; 
    } else {
        cartItems.push({ 
            identifier: id, 
            id: pid, 
            name: p.name, 
            image: p.image, 
            price: finalPrice, 
            color: col, 
            size: siz, 
            quantity: qty, 
            isService: isSrv 
        });
    }

    saveCart(); 
    updateCartCount(); 
    if (document.body.classList.contains('cart-page')) renderCartPage();
}

function addCustomItemToCart(d) {
    cartItems = cartItems.filter(item => item.id !== 'custom-avaliacao');
    cartItems.push({ 
        identifier: `custom-${Date.now()}`, 
        id: 'custom-avaliacao', 
        name: d.name, 
        image: d.image, 
        price: d.price, 
        color: d.color, 
        size: d.size, 
        quantity: 1, 
        customDetails: d.description, 
        isService: true 
    });
    saveCart(); 
    updateCartCount();
}

function removeItem(id) { 
    cartItems = cartItems.filter(i => i.identifier !== id); 
    saveCart(); 
    updateCartCount(); 
    renderCartPage(); 
}

function updateCartItemQuantity(id, qty) {
    const i = cartItems.find(x => x.identifier === id);
    if (i) {
        if (i.isService) qty = 1; 
        i.quantity = parseInt(qty);
        if (i.quantity <= 0) {
            removeItem(id); 
        } else { 
            saveCart(); 
            renderCartPage(); 
        }
    }
}

// --- CÁLCULO DE TOTAIS ---
function calculateTotals() {
    const sub = cartItems.reduce((t, i) => t + (i.price * i.quantity), 0);
    let ship = 0; 
    let disc = appliedCoupon ? (sub * appliedCoupon.discount_percent) : 0;
    return { subtotal: sub, shipping: ship, discount: disc, total: sub + ship - disc };
}

// --- UI HELPERS & VALIDAÇÕES ---

function formatPrice(v) { 
    if(typeof v === 'string') {
        v = parseFloat(v.replace(/[R$.]/g,'').replace(',','.').trim());
    }
    return `R$ ${v.toFixed(2).replace('.',',')}`; 
}

function getSearchQuery() { 
    const p = new URLSearchParams(window.location.search); 
    return p.get('q') ? p.get('q').toLowerCase() : null; 
}

function updateCartCount() { 
    const count = cartItems.reduce((a, b) => a + b.quantity, 0);
    const el = document.getElementById('cart-count'); 
    const elMob = document.getElementById('cart-count-mobile');
    if(el) el.textContent = count; 
    if(elMob) elMob.textContent = count;
}

function createColorSwatches(c) { 
    return c?.map(x => `<span class="color-swatch-text" style="display:inline-block; font-size:0.7em; border:1px solid #ddd; padding:2px 6px; border-radius:4px; margin-right:4px; color:#666; background:#f9f9f9;">${x}</span>`).join('') || ''; 
}

function calculateAge(d) { 
    if(!d) return ""; 
    const p = d.split('/'); 
    if(p.length !== 3) return ""; 
    const b = new Date(p[2], p[1]-1, p[0]);
    const t = new Date(); 
    let a = t.getFullYear() - b.getFullYear(); 
    if(t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) {
        a--;
    }
    return a; 
}

function isValidCPF(cpf) {
    if (typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    let soma = 0; let resto;
    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

function isValidDate(dateString) {
    if(!dateString || dateString.length !== 8) return false;
    const day = parseInt(dateString.substring(0, 2));
    const month = parseInt(dateString.substring(2, 4));
    const year = parseInt(dateString.substring(4, 8));
    const currentYear = new Date().getFullYear();
    if(year < 1920 || year > currentYear) return false;
    if(month < 1 || month > 12) return false;
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) monthDays[1] = 29;
    if(day < 1 || day > monthDays[month - 1]) return false;
    return true;
}

// --- RENDERIZAÇÃO ---





// --- RENDERIZAÇÃO ---

function renderProductCard(p) {
    // Lógica de Estoque Atualizada
    let priceDisplay;
    let badge = '';
    
    if (p.stock === 0) {
        priceDisplay = '<span style="color:red; font-weight:bold;">Indisponível</span>';
        // Badge de Esgotado sobre a imagem
        badge = '<span style="position:absolute; top:10px; right:10px; background:red; color:white; padding:4px 8px; font-size:0.7em; border-radius:4px; font-weight:bold; z-index:2;">ESGOTADO</span>';
    } else {
        priceDisplay = p.price === 0 ? "Sob Consulta" : formatPrice(p.price);
    }

    return `
    <a href="produtos.html?id=${p.id}" class="product-card-link">
        <div class="product-card">
            <div class="product-image-container">
                <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="product-main-img" loading="lazy">
                ${badge}
            </div>
            <div class="product-info">
                <div class="product-meta">
                    <span class="rating"><i class="fas fa-star"></i> ${p.rating}</span>
                    <span class="reviews-count">${p.reviews} avaliações</span>
                </div>
                <h3>${escapeHtml(p.name)}</h3>
                <div class="price-box">
                    <span class="price-tag">${p.stock === 0 ? 'Produto' : 'a partir de'}</span>
                    <span class="current-price">${priceDisplay}</span>
                </div>
                <div style="margin-top:5px;">${createColorSwatches(p.colors)}</div>
            </div>
        </div>
    </a>`;
}

function renderSearchPage() {
    const el = document.getElementById('search-results'); 
    if(!el || typeof PRODUCTS === 'undefined') return;
    const q = getSearchQuery(); 
    if(!q) { el.innerHTML='<p class="search-no-results">Navegue pelo menu.</p>'; return; }
    const terms = decodeURIComponent(q).split(' ').filter(t => t.trim());
    const res = PRODUCTS.filter(p => { 
        const t = `${p.name} ${p.tags.join(' ')} ${p.collection}`.toLowerCase(); 
        return terms.every(x => t.includes(x)); 
    });
    // Usa o renderProductCard atualizado acima
    el.innerHTML = res.length ? res.map(renderProductCard).join('') : '<p class="search-no-results">Nada encontrado.</p>';
}

function renderCartPage() {
    const b = document.getElementById('cart-list-body'); 
    if(!b) return;
    const s = document.querySelector('.cart-summary'), bk = document.querySelector('.back-to-shop');

    if(!cartItems.length) {
        if(s) s.style.display='none'; 
        if(bk) bk.style.display='none';
        document.querySelector('.cart-content-wrapper').style.gridTemplateColumns='1fr';
        b.innerHTML = `<tr class="empty-cart-row"><td colspan="6" class="empty-cart-cell"><div class="empty-content"><i class="fas fa-shopping-bag"></i><p>Sua sacola está vazia.</p><a href="index.html" class="btn-link-empty">Ver tratamentos</a></div></td></tr>`;
    } else {
        if(s) s.style.display='block'; 
        if(bk) bk.style.display='block';
        document.querySelector('.cart-content-wrapper').style.gridTemplateColumns='';
        b.innerHTML = cartItems.map(i => `
            <tr>
                <td class="product-info-cell">
                    <img src="${escapeHtml(i.image)}" class="cart-product-img">
                    <div style="display:flex; flex-direction:column;">
                        <span style="font-weight:600; color:var(--color-primary);">${escapeHtml(i.name)}</span>
                        ${i.isService ? '<span style="font-size:0.75em; color:var(--color-accent); text-transform:uppercase; letter-spacing:1px;"><i class="fas fa-calendar-check"></i> Serviço</span>' : ''}
                        ${i.id==='custom-avaliacao' ? `<span style="font-size:0.75em; color:#666;">${escapeHtml(i.customDetails)}</span>` : ''}
                    </div>
                </td>
                <td>${escapeHtml(i.color)}</td>
                <td>${escapeHtml(i.size)}</td>
                <td>
                    <input type="number" min="1" value="${i.quantity}" class="cart-quantity-input" data-identifier="${i.identifier}" ${i.isService ? 'readonly style="background:#f5f5f5;"' : ''}>
                </td>
                <td style="font-weight:600;">${formatPrice(i.price * i.quantity)}</td>
                <td>
                    <button class="btn-remove-item" data-identifier="${i.identifier}"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }
    updateCartSummary(); 
    setupCartListeners();
    initScheduleModal();
}

function updateCartSummary() {
    const t = calculateTotals();
    const srvOnly = cartItems.length > 0 && cartItems.every(i => i.isService);

    document.getElementById('summary-subtotal').textContent = formatPrice(t.subtotal);

    const ship = document.getElementById('summary-shipping'); 
    if(ship) {
        if(srvOnly) {
            ship.textContent = "-"; 
        } else {
            ship.textContent = "A combinar"; 
            ship.style.fontSize = "0.9em"; 
        }
    }

    const disc = document.getElementById('summary-discount-line');
    if(t.discount > 0) { 
        disc.style.display = 'flex'; 
        disc.style.color = 'var(--color-accent)'; 
        document.getElementById('discount-percent').textContent = `${(appliedCoupon.discount_percent*100).toFixed(0)}%`; 
        document.getElementById('summary-discount').textContent = `- ${formatPrice(t.discount)}`; 
    } else {
        disc.style.display = 'none';
    }

    document.getElementById('summary-total').textContent = formatPrice(t.total);

    const btn = document.getElementById('checkout-btn');
    if(btn) {
        btn.disabled = t.total <= 0;

        if(t.total <= 0) {
            btn.innerHTML = 'SACOLA VAZIA';
        } else {
            const hs = cartItems.some(i => i.isService);
            const hp = cartItems.some(i => !i.isService);

            // Se tiver serviço, sempre agenda antes (mesmo que tenha produto junto)
            if (hs) btn.innerHTML = '<i class="fas fa-calendar-check"></i> Agendar';
            else btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Finalizar compra';

            btn.onclick = () => {
                if(t.total <= 0) return;

                if (hs) {
                    // abre modal para escolher data/hora antes de ir para o checkout
                    if (typeof window.WL_openScheduleModal === 'function') {
                        window.WL_openScheduleModal(() => { window.location.href = 'pagamento.html'; });
                    } else {
                        window.location.href = 'pagamento.html';
                    }
                } else {
                    window.location.href = 'pagamento.html';
                }
            };
        }
    }
}








// --- PÁGINA DE PRODUTO --- 






// --- PÁGINA DE PRODUTO --- 

function loadRelatedProducts(currentItem) {
    if (typeof PRODUCTS === 'undefined') return;

    // Filtra produtos da mesma categoria (tags) que não sejam o atual
    const related = PRODUCTS.filter(p => 
        p.id !== currentItem.id && 
        p.tags.some(tag => currentItem.tags.includes(tag))
    ).slice(0, 4); // Pega no máximo 4

    if (related.length > 0) {
        const section = document.getElementById('related-section');
        const slider = document.getElementById('related-products-slider');
        
        if (section && slider) {
            // Usa o renderProductCard (que já sabe lidar com estoque 0)
            slider.innerHTML = related.map(renderProductCard).join('');
            section.style.display = 'block';
        }
    }
}

function setupProductPage() {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('id');
    const preSelectedOption = params.get('op'); 

    if (!pid || typeof PRODUCTS === 'undefined') { window.location.href = 'index.html'; return; }
    const p = PRODUCTS.find(x => x.id === pid);
    if (!p) { window.location.href = 'index.html'; return; }

    const isSrv = p.tags.includes('servico');
    // VERIFICA SE ESTÁ SEM ESTOQUE
    const isOutOfStock = (p.stock === 0);

    document.title = `${p.name} | ${wlBrandNameUpper()}`;

    const metaDesc = document.getElementById('product-description');
    if (metaDesc) metaDesc.content = p.description || `Confira ${p.name} na coleção ${p.collection} de ${wlBrandName()}.`;

    document.getElementById('main-product-image').src = p.image;
    document.getElementById('product-name').textContent = p.name;
    document.getElementById('product-rating').innerHTML = `<i class="fas fa-star"></i> ${p.rating}`;
    document.getElementById('product-reviews').textContent = `(${p.reviews} avaliações)`;

    const priceEl = document.getElementById('product-price');
    
    // ATUALIZAÇÃO DO PREÇO PRINCIPAL COM TRAVA VISUAL
    if (isOutOfStock) {
        priceEl.textContent = "Indisponível";
        priceEl.style.color = "red";
    } else {
        priceEl.textContent = p.price > 0 ? formatPrice(p.price) : "Selecione a opção";
        priceEl.style.color = ""; // Reseta cor caso tenha mudado antes
    }
    
    document.getElementById('product-material').textContent = p.material;

    if(document.getElementById('desc-content-main')) {
        document.getElementById('desc-content-main').textContent = p.description || "...";
        document.getElementById('desc-content-usage').textContent = p.usage || "...";
        document.getElementById('desc-content-care').textContent = p.care || "...";
        
        // Texto e Ícone do Botão (Lógica Inicial)
        let btnText = "";
        let btnIcon = "";

        if (isOutOfStock) {
            btnText = "PRODUTO ESGOTADO";
            btnIcon = "fas fa-ban";
        } else if (isSrv) {
            document.getElementById('desc-heading-main').textContent = "Sobre o Tratamento";
            document.getElementById('desc-heading-usage').textContent = "Por que fazer?";
            document.getElementById('icon-usage').className = "fas fa-heart"; 
            document.getElementById('desc-heading-care').textContent = "Cuidados";
            document.getElementById('icon-care').className = "fas fa-user-md"; 
            btnText = "AGENDAR SESSÃO";
            btnIcon = "fas fa-calendar-check";
        } else {
            document.getElementById('desc-heading-main').textContent = "Sobre o Produto";
            document.getElementById('desc-heading-usage').textContent = "Como Usar";
            document.getElementById('icon-usage').className = "fas fa-pump-soap"; 
            document.getElementById('desc-heading-care').textContent = "Precauções";
            document.getElementById('icon-care').className = "fas fa-exclamation-circle"; 
            btnText = "COLOCAR NA SACOLA";
            btnIcon = "fas fa-shopping-bag";
        }
        
        // Aplica texto e ícone no botão
        const mainBtn = document.querySelector('.add-to-cart-btn');
        if(mainBtn) mainBtn.innerHTML = `<i class="${btnIcon}"></i> ${btnText}`;
    }

    // CLONAGEM DO FORMULÁRIO (Para limpar eventos antigos)
    const oldForm = document.getElementById('add-to-cart-form');
    const newForm = oldForm.cloneNode(true);
    oldForm.parentNode.replaceChild(newForm, oldForm);

    const sizeSelect = document.getElementById('size-select');
    const colorSelect = document.getElementById('color-select');
    const colorGroup = colorSelect.parentElement;
    const btnSubmit = newForm.querySelector('.add-to-cart-btn'); 
    let selectedRegions = [];

    // SE NÃO TIVER ESTOQUE, BLOQUEIA O BOTÃO IMEDIATAMENTE
    if (isOutOfStock) {
        btnSubmit.disabled = true;
        btnSubmit.style.backgroundColor = "#ccc";
        btnSubmit.style.cursor = "not-allowed";
        btnSubmit.style.opacity = "0.7";
        // Desabilita selects também para evitar confusão visual
        sizeSelect.disabled = true;
        colorSelect.disabled = true;
        const qtyInput = document.getElementById('quantity-input');
        if(qtyInput) qtyInput.disabled = true;
    } else {
        // Garante que esteja habilitado se tiver estoque
        btnSubmit.disabled = false;
        btnSubmit.style.backgroundColor = "";
        btnSubmit.style.cursor = "";
        btnSubmit.style.opacity = "";
        sizeSelect.disabled = false;
        colorSelect.disabled = false;
        const qtyInput = document.getElementById('quantity-input');
        if(qtyInput) qtyInput.disabled = false;
    }

    // Lógica de Regiões (Se houver)
    if (p.region_prices && p.region_prices.length > 0) {
        colorGroup.style.display = 'none'; 
        colorSelect.removeAttribute('required'); 
        
        // Evita duplicar a div de regiões se a função rodar 2x
        const existingRegDiv = document.querySelector('.region-selection-container');
        if(existingRegDiv) existingRegDiv.remove();

        const regDiv = document.createElement('div');
        regDiv.className = 'region-selection-container';
        regDiv.innerHTML = `<span class="region-title">SELECIONE AS REGIÕES:</span><div class="region-grid"></div>`;
        sizeSelect.parentElement.parentElement.insertBefore(regDiv, sizeSelect.parentElement);
        const grid = regDiv.querySelector('.region-grid');
        
        p.region_prices.forEach(r => {
            const lbl = document.createElement('label');
            lbl.className = 'region-option';
            // Se estiver sem estoque, desabilita os checkboxes também
            const disabledAttr = isOutOfStock ? 'disabled' : '';
            lbl.innerHTML = `<input type="checkbox" value="${r.name}" data-price="${r.price}" ${disabledAttr}><span>${r.name}</span><strong class="region-price-hint">+${formatPrice(r.price)}</strong>`;
            grid.appendChild(lbl);
            lbl.querySelector('input').addEventListener('change', updateDynPrice);
        });

        function updateDynPrice() {
            if (isOutOfStock) return; // Não faz nada se esgotado

            const checks = grid.querySelectorAll('input:checked');
            let base = 0; 
            selectedRegions = [];
            checks.forEach(c => { base += parseFloat(c.dataset.price); selectedRegions.push(c.value); });
            
            const isPkg = sizeSelect.value.toLowerCase().includes('pacote');
            const total = isPkg ? (base * 3) : base;
            
            if (total === 0) { 
                priceEl.textContent = "Selecione as áreas"; 
                btnSubmit.disabled = true; 
            } else { 
                priceEl.textContent = formatPrice(total); 
                btnSubmit.disabled = false; 
            }
        }
        sizeSelect.addEventListener('change', updateDynPrice);
        // Roda uma vez para travar o botão caso nada esteja selecionado
        updateDynPrice();

    } else {
        // Lógica Padrão (Sem regiões)
        colorSelect.setAttribute('required', 'required');
        colorSelect.innerHTML = p.colors.map(c => `<option value="${c}">${c}</option>`).join('');
        
        sizeSelect.addEventListener('change', function() {
            if (isOutOfStock) return; // Não muda preço se esgotado

            const sel = this.value;
            if (sel.toLowerCase().includes('pacote') && p.price_package) {
                priceEl.textContent = formatPrice(p.price_package); 
                priceEl.style.color = '#AA9478';
            } else { 
                priceEl.textContent = formatPrice(p.price); 
                priceEl.style.color = ''; 
            }
        });
        
        // Se não tiver estoque, já foi desabilitado lá em cima. Se tiver, libera aqui.
        if (!isOutOfStock) btnSubmit.disabled = false; 
    }

    if (p.sizes?.length) {
        sizeSelect.innerHTML = p.sizes.map(s => {
            let lbl = s;
            if (s.toLowerCase().includes('pacote') && p.price_package && !p.region_prices) {
                const save = (p.price * 3) - p.price_package;
                if(save > 0) lbl += ` (Economia)`;
            }
            return `<option value="${s}">${lbl}</option>`;
        }).join('');
    } else { 
        sizeSelect.innerHTML = '<option value="Padrão">Padrão</option>'; 
    }

    if (preSelectedOption) {
        const keyword = preSelectedOption.toLowerCase(); 
        const targetOption = Array.from(sizeSelect.options).find(opt => opt.value.toLowerCase().includes(keyword));
        if (targetOption) {
            sizeSelect.value = targetOption.value;
            sizeSelect.dispatchEvent(new Event('change'));
        }
    }

    // ENVIO DO FORMULÁRIO (ADD AO CARRINHO)
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // TRAVA FINAL DE SEGURANÇA
        if (isOutOfStock) {
            alert("Desculpe, este produto está indisponível no momento.");
            return;
        }

        const size = sizeSelect.value;
        const qty = isSrv ? 1 : parseInt(document.getElementById('quantity-input').value);
        let variationName = "";
        
        if (p.region_prices) {
            if (!selectedRegions.length) return alert("Selecione pelo menos uma região.");
            variationName = selectedRegions.join(' + ');
        } else {
            variationName = colorSelect.value;
        }
        
        addItemToCart(p.id, variationName, size, qty);
        triggerAddToCartFeedback();
    });

    setupInternalBannerCarousel('internal-banner-carousel-produto'); 
    loadRelatedProducts(p);
}







// --- PARCEIROS & CHECKOUT (COM O SEU CÓDIGO ORIGINAL) ---

function renderPartnerCardRect(p) {
    return `<a href="${p.link}" class="partner-rect-card"><div class="partner-rect-img-box"><img src="imagens/Fotos Parceiros/${p.image}" alt="${p.name}" loading="lazy"></div><h3 class="partner-name">${p.name}</h3><span class="partner-role">${p.role}</span><div class="partner-insta"><i class="fab fa-instagram"></i> ${p.instagram}</div></a>`;
}

function setupPartnerContent() {
    setupHomePortfolio();
    const el = document.getElementById('static-partner-grid');
    if (el && typeof PARTNERS !== 'undefined') el.innerHTML = PARTNERS.slice(0, 3).map(renderPartnerCardRect).join('');
}

function generateWhatsAppOrderLink(d) {
    const t = calculateTotals();
    const hs = cartItems.some(i => i.isService);
    const hp = cartItems.some(i => !i.isService);
    let msg = "";
    const age = (d.data_nascimento && d.data_nascimento.length===10) ? calculateAge(d.data_nascimento)+" anos" : "N/I";

    if (hs && !hp) {
        // AJUSTE: Usando \n e encodeURIComponent
        msg += `Olá, ${wlBrandName()}! ✨\nEu sou *${d.nome_cliente}*, tenho ${age}, gostaria de agendar:\n\n`;
        cartItems.forEach(i => {
            msg += `💆‍♀️ *${i.name}*\n`;
            if(i.customDetails) msg += `   Detalhe Avaliação: ${i.customDetails}\n`;
            if(i.size!=='Padrão') msg += `   Opção: ${i.size}\n`;
            if(i.color!=='Padrão') msg += `   Detalhe: ${i.color}\n`;
            msg += `   (Valor: ${formatPrice(i.price)})\n`;
        });
        const apptISO = localStorage.getItem(STORAGE_KEYS.appointment);
        if (apptISO) {
            msg += `
📅 *Data/Hora desejada:* ${formatAppointmentBR(apptISO)}
`;
        }
        msg += `
----------------
*Total: ${formatPrice(t.total)}*
----------------
${apptISO ? 'Se precisar, posso sugerir outros horários.' : 'Aguardo horários!'}`;
    } else {
        msg += `Olá, ${wlBrandName()}! 🛍️\nPedido de Compra:\n\n`;
        cartItems.forEach(i => {
            if(i.isService) {
                msg += `💆‍♀️ *SERVIÇO: ${i.name}*\n`;
                msg += `   - Opção: ${i.size} | Detalhe: ${i.color}\n`;
                if(i.customDetails) msg += `   - Detalhe Avaliação: ${i.customDetails}\n`;
                msg += `   - Valor: ${formatPrice(i.price)}\n`;
            } else {
                msg += `🧴 *PRODUTO: ${i.name}*\n`;
                msg += `   - Qtd: ${i.quantity} | ${i.size}/${i.color}\n`;
                msg += `   - Unit: ${formatPrice(i.price)}\n`;
            }
        });
        msg += `\n----------------\nSubtotal: ${formatPrice(t.subtotal)}\n`;

        if(hp) msg += `Frete: A combinar\n`;

        if(t.discount>0) msg+=`Desc: -${formatPrice(t.discount)}\n`;
        msg += `*TOTAL PRODUTOS: ${formatPrice(t.total)}*\n----------------\n\n`;

        const apptISO2 = localStorage.getItem(STORAGE_KEYS.appointment);
        if (hs && apptISO2) {
            msg += `📅 *Data/Hora desejada:* ${formatAppointmentBR(apptISO2)}

`;
        }
        msg += `*CLIENTE:*
👤 ${d.nome_cliente} (${age})
📄 CPF: ${d.cpf_cliente}
🎂 ${d.data_nascimento}

`;
        msg += `*ENTREGA:*\n${d.rua}, ${d.numero}\n${d.bairro} - ${d.cidade}/${d.estado}\nCEP: ${d.cep}\n`;
        if(d.nome_pagador) msg+=`\n*PAGADOR:*\n${d.nome_pagador} (CPF: ${d.cpf_pagador})\n`;
    }

    return (window.WL && WL.buildWhatsAppLink) ? WL.buildWhatsAppLink(msg) : `#`;
}

function setupPaymentPage() {
    if (!cartItems.length) { alert("Sacola vazia!"); window.location.href = 'index.html'; return; }
    const btn = document.getElementById('confirm-payment-btn');
    const form = document.getElementById('contact-info-form');
    const hs = cartItems.some(i => i.isService);
    const hp = cartItems.some(i => !i.isService);

    if (hs && !hp) {
        ['shipping-section','payer-section','row-shipping'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display='none'; });
        document.querySelectorAll('#shipping-section input').forEach(i => i.required = false);
        if(btn) btn.innerHTML = '<i class="fab fa-whatsapp"></i> SOLICITAR AGENDAMENTO';
    } else {
        ['shipping-section','payer-section'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display='block'; });
        document.querySelectorAll('#shipping-section input').forEach(i => i.required = true);
        if(btn) btn.innerHTML = (hs && hp) ? '<i class="fab fa-whatsapp"></i> AGENDAR E COMPRAR' : '<i class="fab fa-whatsapp"></i> FINALIZAR COMPRA';
    }

    const same = document.getElementById('mesmos-dados-check');
    if (same) same.onchange = function() {
        document.getElementById('pagador-nome').value = this.checked ? document.getElementById('nome-completo').value : '';
        document.getElementById('pagador-cpf').value = this.checked ? document.getElementById('cpf-cnpj').value : '';
    };

    if (form && btn) {
        const m = (id, f) => { 
            const el=document.getElementById(id); 
            if(el) el.oninput=e=>{ let cleanValue = e.target.value.replace(/\D/g,''); e.target.value = f(cleanValue); }; 
        };
        m('cpf-cnpj', v=>v.slice(0,11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4"));
        m('pagador-cpf', v=>v.slice(0,11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4"));
        m('data-nascimento', v=>v.slice(0,8).replace(/(\d{2})(\d{2})(\d{4})/,"$1/$2/$3"));
        m('cep', v=>v.slice(0,8).replace(/(\d{5})(\d{3})/,"$1-$2"));

        btn.onclick = e => {
            if (!form.checkValidity()) { form.reportValidity(); return; }
            const cpf = document.getElementById('cpf-cnpj').value.replace(/\D/g,'');
            const nasc = document.getElementById('data-nascimento').value.replace(/\D/g,'');
            const cep = (document.getElementById('cep')?.value || '').replace(/\D/g,'');
            if (!isValidCPF(cpf)) { alert("Por favor, insira um CPF válido."); return; }
            if (!isValidDate(nasc)) { alert("Data de nascimento inválida ou inexistente."); return; }
            if (document.getElementById('shipping-section').style.display!=='none' && cep.length < 8) { alert("CEP inválido."); return; }
            e.preventDefault();
            btn.disabled = true; 
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            const data = {
                nome_cliente: document.getElementById('nome-completo').value, cpf_cliente: document.getElementById('cpf-cnpj').value, data_nascimento: document.getElementById('data-nascimento').value,
                rua: document.getElementById('rua')?.value, numero: document.getElementById('numero')?.value,
                bairro: document.getElementById('bairro')?.value, cidade: document.getElementById('cidade')?.value,
                estado: document.getElementById('estado')?.value, cep: document.getElementById('cep')?.value,
                nome_pagador: document.getElementById('pagador-nome')?.value, cpf_pagador: document.getElementById('pagador-cpf')?.value
            };
            const link = generateWhatsAppOrderLink(data);
            window.open(link, '_blank');
            window.location.href = 'obrigado.html';
        };
    }

    const t = calculateTotals();
    const srvOnly = cartItems.length > 0 && cartItems.every(i => i.isService);

    if(document.getElementById('co_subtotal')) {
        document.getElementById('co_subtotal').textContent = formatPrice(t.subtotal);
        if(t.discount>0) { document.getElementById('row-cupom').style.display='flex'; document.getElementById('co_cupom').textContent="- "+formatPrice(t.discount); }

        document.getElementById('co_shipping').textContent = srvOnly ? "-" : "A combinar";

        document.getElementById('co_total').textContent = formatPrice(t.total);
    }
    document.getElementById('cancel-order-btn')?.addEventListener('click', e=>{e.preventDefault();document.getElementById('cancel-modal').style.display='flex'});
    document.getElementById('modal-keep-buying')?.addEventListener('click', e=>{e.preventDefault();document.getElementById('cancel-modal').style.display='none'});
    document.getElementById('modal-confirm-cancel')?.addEventListener('click', e=>{e.preventDefault();localStorage.removeItem(STORAGE_KEYS.cart);
        localStorage.removeItem(STORAGE_KEYS.appointment);window.location.href='index.html'});
}

// --- SETUP DE BUSCA (UNIFICADO) ---
function setupSearch() {
    // 1. Seleciona TODOS os inputs e botões de busca
    const inputs = document.querySelectorAll('.search-input');
    const buttons = document.querySelectorAll('.search-trigger-btn, .mobile-search-btn');

    // Função central que executa o redirecionamento
    const goSearch = (val) => {
        if (val && val.trim()) {
            window.location.href = `busca.html?q=${encodeURIComponent(val.trim())}`;
        }
    };

    // Adiciona evento de teclado (Enter) para todos os inputs encontrados
    inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                goSearch(input.value);
            }
        });
    });

    // Adiciona evento de clique para todos os botões de lupa
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Tenta encontrar o input que está no mesmo container do botão clicado
            const parent = btn.closest('.search-box-container') || btn.closest('.mobile-search-wrapper');
            const relatedInput = parent ? parent.querySelector('.search-input') : null;

            if (relatedInput) {
                goSearch(relatedInput.value);
            }
        });
    });
}

// --- WIZARD (AVALIAÇÃO) ---








// --- SUBSTITUA A FUNÇÃO setupExclusivasPage POR ESTA VERSÃO (CORREÇÃO DE FOCO + CORES) ---

function setupExclusivasPage() {
    const div = document.getElementById('wizard-content');
    const bar = document.getElementById('wiz-progress-bar');
    if(!div) return;

    // --- DADOS DO CLIENTE ---
    let d = {
        // Pessoais
        nome: "", cpf: "", dataNascimento: "", idade: "", sexo: "", telefone: "", email: "", endereco: "", cidade: "", estado: "", profissao: "",
        // Saúde
        condicoes: [], medicamentos: "",
        // Hábitos
        fumante: null, alcool: null, atividadeFisica: null, agua: "", sono: "",
        // Histórico
        tratamentosAnteriores: null, descTratamentos: "", protetorSolar: null,
        // Avaliação
        interesse: [], 
        facial: { tipoPele: "", queixas: [] },
        corporal: { peso: "", altura: "", queixas: [], regioes: [] },
        // Segurança
        termoAceito: false
    };

    let step = "intro"; 
    let queue = []; 
    let history = [];

    // --- HELPERS ---
    const getNested = (obj, path) => path.split('.').reduce((o,i)=> (o ? o[i] : undefined), obj);
    const setNested = (path, val) => {
        const keys = path.split('.');
        let obj = d;
        for (let i = 0; i < keys.length - 1; i++) { obj = obj[keys[i]]; }
        obj[keys[keys.length - 1]] = val;
    };
    const calculateAge = (dateString) => {
        if(!dateString) return "";
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    const updateBar = (s) => {
        if(!bar) return;
        const stepsMap = { intro:0, d_nome:5, d_cpf:10, d_nasc:15, d_sexo:20, d_contato:25, d_end:30, d_prof:35, saude:45, habitos:55, historico:65, escolha_foco:75, aval_facial:90, aval_corporal:90, final:100 };
        bar.style.width = `${stepsMap[s] || 50}%`;
    };

    const render = () => {
        div.innerHTML = ''; updateBar(step);
        let h = '', back = `<button class="btn btn-secondary" onclick="back()" style="margin-right:10px;">Voltar</button>`;
        
        // Helpers Visuais
        const checkBtn = (path, val, label) => {
            let list = path.includes('.') ? getNested(d, path) : d[path];
            if (!list) list = [];
            const isChecked = list.includes(val);
            const clickFn = path.includes('.') ? `togNested('${path}', '${val}')` : `tog('${path}', '${val}')`;
            return `<div class="wiz-checkbox-label ${isChecked?'checked':''}" onclick="${clickFn}"><i class="${isChecked?'fas fa-check-square':'far fa-square'}"></i> ${label}</div>`;
        };
        const radioBtn = (field, val, label) => {
            const isSel = d[field] === val;
            const valString = typeof val === 'string' ? `'${val}'` : val;
            return `<button class="wiz-radio-btn ${isSel?'selected':''}" onclick="setSelection('${field}', ${valString})">${label}</button>`;
        };

        // --- TELAS ---
        if (step === "intro") {
            h = `<h2 class="wiz-title">Ficha de Anamnese</h2><p class="wiz-subtitle">Bem-vinda(o)! Vamos criar sua ficha personalizada passo a passo.</p><div class="wiz-nav"><button class="btn btn-primary" onclick="next('intro')">Iniciar</button></div>`;
        } 
        
        // NOTA: Adicionei 'autofocus' manualmente nos inputs de texto simples para facilitar a digitação
        else if (step === "d_nome") {
            h = `<h2 class="wiz-title">Como se chama?</h2><input id="in-nm" class="wiz-input-sutil" placeholder="Nome Completo" value="${d.nome}" oninput="setVal('nome', this.value)" autofocus><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="req('nome', 'd_nome')">Próximo</button></div>`;
        }
        else if (step === "d_cpf") {
            h = `<h2 class="wiz-title">Seu CPF</h2><p class="wiz-subtitle">Necessário para seu cadastro seguro.</p><input id="in-cpf" type="tel" class="wiz-input-sutil" placeholder="000.000.000-00" value="${d.cpf}" oninput="setVal('cpf', this.value)" autofocus><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="req('cpf', 'd_cpf')">Próximo</button></div>`;
        }
        else if (step === "d_nasc") {
            h = `<h2 class="wiz-title">Data de Nascimento</h2><input id="in-nasc" type="date" class="wiz-input-sutil" value="${d.dataNascimento}" onchange="setVal('dataNascimento', this.value)">${d.dataNascimento ? `<p style="color:var(--color-accent); font-weight:bold;">Idade: ${calculateAge(d.dataNascimento)} anos</p>` : ''}<div class="wiz-nav">${back} <button class="btn btn-primary" onclick="saveNasc()">Próximo</button></div>`;
        }
        else if (step === "d_sexo") {
            h = `<h2 class="wiz-title">Sexo</h2><div class="wiz-radio-group" style="flex-direction:column; gap:15px;">${radioBtn('sexo', 'Feminino', 'Feminino')} ${radioBtn('sexo', 'Masculino', 'Masculino')} ${radioBtn('sexo', 'Outro', 'Outro')}</div><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="req('sexo', 'd_sexo')">Próximo</button></div>`;
        }
        else if (step === "d_contato") {
            h = `<h2 class="wiz-title">Contatos</h2><input id="in-tel" type="tel" class="wiz-input-sutil" placeholder="WhatsApp (com DDD)" value="${d.telefone}" oninput="setVal('telefone', this.value)" autofocus><input id="in-mail" type="email" class="wiz-input-sutil" placeholder="E-mail" value="${d.email}" oninput="setVal('email', this.value)"><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="req('telefone', 'd_contato')">Próximo</button></div>`;
        }
        else if (step === "d_end") {
            h = `<h2 class="wiz-title">Endereço</h2><input id="in-end" class="wiz-input-sutil" placeholder="Rua, Número, Bairro" value="${d.endereco}" oninput="setVal('endereco', this.value)" autofocus><div class="wiz-input-group"><input id="in-cid" class="wiz-input-sutil" placeholder="Cidade" value="${d.cidade}" oninput="setVal('cidade', this.value)"><input id="in-uf" class="wiz-input-sutil" placeholder="UF" value="${d.estado}" oninput="setVal('estado', this.value)"></div><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="next('d_end')">Próximo</button></div>`;
        }
        else if (step === "d_prof") {
            h = `<h2 class="wiz-title">Profissão</h2><input id="in-prof" class="wiz-input-sutil" placeholder="Sua profissão" value="${d.profissao}" oninput="setVal('profissao', this.value)" autofocus><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="next('d_prof')">Ir para Saúde</button></div>`;
        }
        
        // Telas Mistas (Inputs + Checkboxes) -> SEM AUTOFOCUS para não subir o teclado ao clicar nos boxes
        else if (step === "saude") {
            h = `<h2 class="wiz-title">Histórico de Saúde</h2><p class="wiz-subtitle">Assinale o que você possui (Contraindicações):</p><div class="wiz-checkbox-grid">${checkBtn('condicoes', 'Hipertensão', 'Hipertensão')}${checkBtn('condicoes', 'Diabetes', 'Diabetes')}${checkBtn('condicoes', 'Cardíaco', 'Prob. Cardíacos')}${checkBtn('condicoes', 'Hormonal', 'Prob. Hormonal')}${checkBtn('condicoes', 'Epilepsia', 'Epilepsia')}${checkBtn('condicoes', 'Autoimune', 'D. Autoimune')}${checkBtn('condicoes', 'Dermatológico', 'Prob. de Pele')}${checkBtn('condicoes', 'Marca-passo', 'Marca-passo')}${checkBtn('condicoes', 'Gestante', 'Gestante')}</div><p class="wiz-subtitle" style="margin-top:15px; text-align:left;">Medicamentos ou Alergias?</p><textarea id="in-meds" class="wiz-textarea-sutil" placeholder="Liste medicamentos contínuos e alergias aqui..." oninput="setVal('medicamentos', this.value)">${d.medicamentos}</textarea><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="next('saude')">Próximo</button></div>`;
        }
        else if (step === "habitos") {
            h = `<h2 class="wiz-title">Hábitos</h2><label style="display:block; text-align:left; margin-bottom:5px;">Fuma?</label><div class="wiz-radio-group">${radioBtn('fumante', true, 'Sim')} ${radioBtn('fumante', false, 'Não')}</div><label style="display:block; text-align:left; margin-bottom:5px;">Bebida Alcoólica?</label><div class="wiz-radio-group">${radioBtn('alcool', true, 'Sim')} ${radioBtn('alcool', false, 'Não')}</div><label style="display:block; text-align:left; margin-bottom:5px;">Atividade Física?</label><div class="wiz-radio-group">${radioBtn('atividadeFisica', true, 'Sim')} ${radioBtn('atividadeFisica', false, 'Não')}</div><label style="display:block; text-align:left; margin-bottom:5px;">Sono:</label><div class="wiz-radio-group">${radioBtn('sono', 'Boa', 'Boa')} ${radioBtn('sono', 'Regular', 'Regular')} ${radioBtn('sono', 'Ruim', 'Ruim')}</div><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="next('habitos')">Próximo</button></div>`;
        }
        else if (step === "historico") {
            h = `<h2 class="wiz-title">Histórico Estético</h2><p class="wiz-subtitle">Já fez procedimentos antes?</p><div class="wiz-radio-group">${radioBtn('tratamentosAnteriores', true, 'Sim')} ${radioBtn('tratamentosAnteriores', false, 'Não')}</div><textarea id="in-trats" class="wiz-textarea-sutil" placeholder="Quais? Teve reação adversa?" oninput="setVal('descTratamentos', this.value)">${d.descTratamentos}</textarea><p class="wiz-subtitle" style="margin-top:15px;">Usa protetor solar?</p><div class="wiz-radio-group">${radioBtn('protetorSolar', true, 'Sim')} ${radioBtn('protetorSolar', false, 'Não')}</div><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="next('historico')">Próximo</button></div>`;
        }
        else if (step === "escolha_foco") {
            h = `<h2 class="wiz-title">Foco da Avaliação</h2><div class="wiz-options-grid"><button class="wiz-btn-option ${d.interesse.includes('Facial')?'selected':''}" onclick="tog('interesse','Facial')"><i class="fas fa-smile"></i> Facial</button><button class="wiz-btn-option ${d.interesse.includes('Corporal')?'selected':''}" onclick="tog('interesse','Corporal')"><i class="fas fa-female"></i> Corporal</button></div><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="decideFluxo()">Continuar</button></div>`;
        }
        
        // TELAS DE AVALIAÇÃO: SEM AUTOFOCUS para evitar o teclado subindo ao clicar nos checks
        else if (step === "aval_facial") {
            h = `<h2 class="wiz-title">Avaliação Facial</h2><label style="display:block; text-align:left; margin-bottom:5px;">Tipo de Pele:</label><select id="in-pele" class="wiz-input-sutil" style="margin-bottom:20px;" onchange="setVal('facial.tipoPele', this.value)"><option value="" disabled ${d.facial.tipoPele===""?'selected':''}>Selecione...</option><option value="Normal" ${d.facial.tipoPele==="Normal"?'selected':''}>Normal</option><option value="Seca" ${d.facial.tipoPele==="Seca"?'selected':''}>Seca</option><option value="Oleosa" ${d.facial.tipoPele==="Oleosa"?'selected':''}>Oleosa</option><option value="Mista" ${d.facial.tipoPele==="Mista"?'selected':''}>Mista</option><option value="Acneica" ${d.facial.tipoPele==="Acneica"?'selected':''}>Acneica</option><option value="Sensível" ${d.facial.tipoPele==="Sensível"?'selected':''}>Sensível</option></select><p class="wiz-subtitle" style="text-align:left;">Queixas (Multiplas):</p><div class="wiz-checkbox-grid">${checkBtn('facial.queixas', 'Acne', 'Acne')}${checkBtn('facial.queixas', 'Manchas', 'Manchas')}${checkBtn('facial.queixas', 'Rugas', 'Rugas')}${checkBtn('facial.queixas', 'Flacidez', 'Flacidez')}${checkBtn('facial.queixas', 'Olheiras', 'Olheiras')}${checkBtn('facial.queixas', 'Cicatrizes', 'Cicatrizes')}</div><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="saveFacial()">${queue.length > 0 ? 'Próximo' : 'Finalizar'}</button></div>`;
        }
        else if (step === "aval_corporal") {
            h = `<h2 class="wiz-title">Avaliação Corporal</h2><div class="wiz-input-group"><input id="in-peso" type="tel" class="wiz-input-sutil" placeholder="Peso (kg)" value="${d.corporal.peso}" oninput="setVal('corporal.peso', this.value)"><input id="in-alt" type="tel" class="wiz-input-sutil" placeholder="Altura (m)" value="${d.corporal.altura}" oninput="setVal('corporal.altura', this.value)"></div><p class="wiz-subtitle" style="text-align:left;">Queixas:</p><div class="wiz-checkbox-grid">${checkBtn('corporal.queixas', 'Gordura', 'Gordura')}${checkBtn('corporal.queixas', 'Celulite', 'Celulite')}${checkBtn('corporal.queixas', 'Flacidez', 'Flacidez')}${checkBtn('corporal.queixas', 'Estrias', 'Estrias')}${checkBtn('corporal.queixas', 'Retenção', 'Retenção')}</div><p class="wiz-subtitle" style="text-align:left;">Regiões:</p><div class="wiz-checkbox-grid">${checkBtn('corporal.regioes', 'Abdômen', 'Abdômen')}${checkBtn('corporal.regioes', 'Coxas', 'Coxas')}${checkBtn('corporal.regioes', 'Glúteos', 'Glúteos')}${checkBtn('corporal.regioes', 'Braços', 'Braços')}</div><div class="wiz-nav">${back} <button class="btn btn-primary" onclick="saveCorporal()">Finalizar</button></div>`;
        }
        
        else if (step === "final") {
            const btnClass = d.termoAceito ? 'btn btn-primary' : 'btn btn-primary btn-disabled';
            const iconClass = d.termoAceito ? 'fas fa-check-square' : 'far fa-square';
            const checkClass = d.termoAceito ? 'wiz-term-check active' : 'wiz-term-check';

            h = `
                <h2 class="wiz-title">Confirmação</h2>
                <p class="wiz-subtitle">Leia o termo abaixo para liberar o envio.</p>
                
                <div class="wiz-terms-box">
                    <h4>9. TERMO DE CIÊNCIA E AUTORIZAÇÃO</h4>
                    <p>Declaro que forneci informações verdadeiras e completas sobre minha saúde e hábitos. Estou ciente de que a omissão de dados pode comprometer a segurança e a eficácia dos procedimentos.</p>
                    <p>Entendo que os procedimentos estéticos possuem indicações e contraindicações e autorizo a ${wlBrandName()} a realizar a avaliação detalhada das informações aqui prestadas.</p>
                    <p>Estou ciente dos possíveis benefícios, limitações e cuidados pré e pós-tratamento que serão orientados pelo profissional responsável.</p>
                </div>

                <div class="${checkClass}" onclick="toggleTerm()">
                    <i class="${iconClass}"></i> Li, compreendo e aceito os termos.
                </div>

                <div class="wiz-nav">
                    ${back} 
                    <button id="wiz-send" class="${btnClass}" ${!d.termoAceito ? 'disabled' : ''} style="background:#25D366; border-color:#25D366;">
                        <i class="fab fa-whatsapp"></i> ENVIAR FICHA
                    </button>
                </div>`;
        }

        div.innerHTML = h;
        // Removi o foco global que causava o problema do teclado
    };

    // --- LÓGICA ---
    window.tog = (arr, val) => { const i = d[arr].indexOf(val); i > -1 ? d[arr].splice(i,1) : d[arr].push(val); render(); };
    window.togNested = (path, val) => { let arr = getNested(d, path); if(arr) { const i = arr.indexOf(val); i > -1 ? arr.splice(i,1) : arr.push(val); render(); } };
    window.setSelection = (field, val) => { if (field.includes('.')) setNested(field, val); else d[field] = val; render(); };
    window.setVal = (field, val) => { if (field.includes('.')) setNested(field, val); else d[field] = val; };
    
    window.toggleTerm = () => { d.termoAceito = !d.termoAceito; render(); };

    window.req = (field, currentStep) => { if(!d[field]) return alert("Por favor, preencha este campo."); next(currentStep); };
    window.saveNasc = () => { if(!d.dataNascimento) return alert("Informe sua data de nascimento."); d.idade = calculateAge(d.dataNascimento); next('d_nasc'); };
    window.saveFacial = () => { const el = document.getElementById('in-pele'); if(el) d.facial.tipoPele = el.value; next('seq'); };
    window.saveCorporal = () => { const p = document.getElementById('in-peso'); if(p) d.corporal.peso = p.value; const a = document.getElementById('in-alt'); if(a) d.corporal.altura = a.value; next('seq'); };
    window.decideFluxo = () => { if(d.interesse.length === 0) return alert("Selecione pelo menos um foco."); queue = []; if(d.interesse.includes('Facial')) queue.push('aval_facial'); if(d.interesse.includes('Corporal')) queue.push('aval_corporal'); queue.push('final'); step = queue.shift(); history.push('escolha_foco'); render(); };
    
    window.next = (ctx) => {
        history.push(step);
        if(ctx === 'intro') step = 'd_nome';
        else if(ctx === 'd_nome') step = 'd_cpf';
        else if(ctx === 'd_cpf') step = 'd_nasc';
        else if(ctx === 'd_nasc') step = 'd_sexo';
        else if(ctx === 'd_sexo') step = 'd_contato';
        else if(ctx === 'd_contato') step = 'd_end';
        else if(ctx === 'd_end') step = 'd_prof';
        else if(ctx === 'd_prof') step = 'saude';
        else if(ctx === 'saude') step = 'habitos';
        else if(ctx === 'habitos') step = 'historico';
        else if(ctx === 'historico') step = 'escolha_foco';
        else if(queue.length > 0) step = queue.shift();
        else step = 'final';
        render();
    };

    window.back = () => { if(history.length) { if(step !== 'final' && step !== 'escolha_foco') queue.unshift(step); step = history.pop(); render(); } };

    // --- ENVIO ---
    div.addEventListener('click', e => {
        const btn = e.target.closest('#wiz-send');
        if(btn && !btn.disabled) {
            btn.disabled = true; 
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

            let msg = `📋 *FICHA DE ANAMNESE - ${wlBrandNameUpper()}*\n`;
            msg += `────────────────────────\n`;
            msg += `*1. DADOS PESSOAIS*\n`;
            msg += `👤 *Nome:* ${d.nome}\n`;
            msg += `📄 *CPF:* ${d.cpf}\n`;
            msg += `🎂 *Nasc:* ${d.dataNascimento.split('-').reverse().join('/')} (${d.idade} anos)\n`;
            msg += `⚧ *Sexo:* ${d.sexo}\n`;
            msg += `💼 *Prof:* ${d.profissao}\n`;
            msg += `📞 *Tel:* ${d.telefone}\n`;
            msg += `📧 *Email:* ${d.email}\n`;
            msg += `🏠 *End:* ${d.endereco}\n`;
            msg += `🏙️ *Cidade:* ${d.cidade}/${d.estado}\n\n`;

            msg += `*2. SAÚDE (Contraindicações)*\n`;
            if(d.condicoes.length) { msg += d.condicoes.map(c => `   • ${c}`).join('\n'); msg += `\n`; } 
            else { msg += `   • Nenhuma condição relatada\n`; }
            msg += `💊 *Meds/Alergias:* ${d.medicamentos || 'Não'}\n\n`;

            msg += `*3. HÁBITOS*\n`;
            msg += `🚬 Fuma: ${d.fumante?'Sim':'Não'} | 🍷 Álcool: ${d.alcool?'Sim':'Não'}\n`;
            msg += `🏃 Atividade: ${d.atividadeFisica?'Sim':'Não'}\n`;
            msg += `😴 Sono: ${d.sono}\n\n`;

            msg += `*4. HISTÓRICO*\n`;
            msg += `📜 Já fez antes: ${d.tratamentosAnteriores?'Sim':'Não'}\n`;
            if(d.descTratamentos) msg += `   Obs: ${d.descTratamentos}\n`;
            msg += `🧴 Protetor Solar: ${d.protetorSolar?'Sim':'Não'}\n\n`;

            if(d.interesse.includes('Facial')) {
                msg += `*5. AVALIAÇÃO FACIAL*\n`;
                msg += `🧖‍♀️ Pele: ${d.facial.tipoPele || '-'}\n`;
                msg += `🔍 Queixas: ${d.facial.queixas.join(', ') || '-'}\n\n`;
            }

            if(d.interesse.includes('Corporal')) {
                msg += `*6. AVALIAÇÃO CORPORAL*\n`;
                msg += `⚖️ ${d.corporal.peso}kg | ${d.corporal.altura}m\n`;
                msg += `🔍 Queixas: ${d.corporal.queixas.join(', ') || '-'}\n`;
                msg += `🎯 Regiões: ${d.corporal.regioes.join(', ') || '-'}\n\n`;
            }

            msg += `────────────────────────\n`;
            const agora = new Date().toLocaleString('pt-BR');
            msg += `✅ *TERMO ACEITO EM:* ${agora}\n`;
            msg += `Declaro informações verdadeiras e autorizo a avaliação.`;

            if(typeof addCustomItemToCart === 'function') {
                addCustomItemToCart({ name: `Ficha: ${d.nome}`, image: 'imagens/Banners/favicon.png', price: 0.00, color: 'Anamnese', size: 'Digital', description: `Ficha completa enviada.` });
            }

            window.open((window.WL && WL.buildWhatsAppLink) ? WL.buildWhatsAppLink(msg) : '#', '_blank');
            window.location.href = 'obrigado.html';
        }
    });

    render();
}







// --- GENERAL HELPERS ---

function setupHomePortfolio() {
    if (typeof PORTFOLIO_LIST === 'undefined') return;
    const c = document.querySelector('.recent-works-section .container'); if(!c) return;
    if(!c.querySelector('.comparison-grid')) {
        const t = c.querySelector('h2'); c.innerHTML=''; if(t)c.appendChild(t);
        const d = document.createElement('div'); d.className='comparison-grid'; c.appendChild(d);
        d.innerHTML = PORTFOLIO_LIST.map(i=>`<div class="comparison-card"><img src="imagens/Resultados/${i.image_after}" class="comparison-item img-after"><div class="img-before-wrapper"><img src="imagens/Resultados/${i.image_before}" class="comparison-item img-before"></div><div class="comparison-label"><h3>${i.title}</h3></div></div>`).join('');
    }
}

function setupMobileMenu() {
    const m = document.querySelector('.mobile-menu'), t = document.querySelector('.menu-toggle'), c = document.querySelector('.close-menu');
    if(m && t) { t.onclick=()=>m.classList.add('open'); c.onclick=()=>m.classList.remove('open'); }
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(b => b.onclick = e => { e.preventDefault(); b.classList.toggle('active'); b.nextElementSibling?.classList.toggle('open'); });
}

function setupScrolledHeader() {
    const h = document.querySelector('.header');
    if (!h) return;
    const onScroll = () => h.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}



function syncHeaderPlaceholderHeight() {
    const placeholder = document.getElementById('header-placeholder');
    const header = document.querySelector('.header');
    if (!placeholder || !header) return;

    const apply = () => {
        const h = header.offsetHeight || 0;
        if (h > 0) {
            placeholder.style.minHeight = h + 'px';
            document.documentElement.style.setProperty('--header-height', h + 'px');
            document.documentElement.style.setProperty('--header-height-mobile', h + 'px');
        }
    };

    apply();

    // Evita múltiplos binds
    if (syncHeaderPlaceholderHeight.__bound) return;
    syncHeaderPlaceholderHeight.__bound = true;

    window.addEventListener('resize', apply);

    // Observa mudanças (menu mobile abre/fecha, etc.)
    if ('ResizeObserver' in window) {
        try {
            const ro = new ResizeObserver(apply);
            ro.observe(header);
        } catch (e) {}
    }
}
function setupInternalBannerCarousel(id) {
    const el = document.getElementById(id); if(!el) return;
    const items = el.querySelectorAll('.internal-banner-item'); if(items.length <= 1) return;
    let curr = 0;
    const int = setInterval(() => {
        if(!document.getElementById(id)) { clearInterval(int); return; }
        items[curr].classList.remove('active'); curr = (curr + 1) % items.length; items[curr].classList.add('active');
    }, 4000);
}

function showToast(msg) {
    let t = document.getElementById('global-toast');
    if(!t) { t=document.createElement('div'); t.id='global-toast'; t.className='global-toast'; document.body.appendChild(t); }
    t.innerHTML = `<i class="fas fa-check-circle" style="color:var(--color-accent)"></i> ${msg}`;
    t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000);
}

function triggerAddToCartFeedback() {
    const old = document.getElementById('add-to-cart-message'); if(old) old.textContent="";
    showToast("Item adicionado à sacola! 🛍️");
}

function setupCartListeners() {
    document.querySelectorAll('.btn-remove-item').forEach(b => b.onclick = e => removeItem(e.currentTarget.dataset.identifier));
    document.querySelectorAll('.cart-quantity-input').forEach(i => i.oninput = e => updateCartItemQuantity(e.currentTarget.dataset.identifier, e.target.value));
}

function setupCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const btn = document.getElementById('accept-cookies-btn');
    if (!banner || !btn) return;
    if (!localStorage.getItem('lgpdConsent')) {
        setTimeout(() => banner.classList.add('show'), 2000);
    }
    btn.onclick = () => {
        localStorage.setItem('lgpdConsent', 'true');
        banner.classList.remove('show');
        // Notifica o main.js para habilitar analytics sem recarregar
        window.dispatchEvent(new Event('lgpdConsentGranted'));
    };
}

// --- NOVO: BOTÃO VOLTAR AO TOPO ---
function setupBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
