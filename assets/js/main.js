// ======================================================
// MAIN.JS - WHITE-LABEL
// ======================================================

// --- 0. GOOGLE ANALYTICS 4 (INJEÇÃO AUTOMÁTICA) ---
// Isso garante que todas as páginas sejam rastreadas sem sujar o HTML
// --- 0. GOOGLE ANALYTICS 4 (COM CONSENTIMENTO LGPD) ---
// Analytics só é habilitado após o usuário aceitar o banner de cookies.
// Chave de consentimento: localStorage.lgpdConsent === 'true'
(function setupAnalyticsWithConsent() {
    const GA_ID = (window.APP_CONFIG && window.APP_CONFIG.analytics) ? window.APP_CONFIG.analytics.ga4MeasurementId : null; // GA4 (white-label)

    // Queue padrão do gtag (mesmo antes do script carregar)
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

    // Consentimento padrão: negar analytics até o usuário aceitar
    window.gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted'
    });

    function loadGA() {
        if (!GA_ID) return;
        if (window.__gaLoaded) return;
        window.__gaLoaded = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        window.gtag('js', new Date());
        window.gtag('config', GA_ID, {
            anonymize_ip: true
        });
    }

    function enableAnalytics() {
        window.gtag('consent', 'update', { analytics_storage: 'granted' });
        loadGA();
    }

    // Se já aceitou antes, habilita imediatamente
    if (localStorage.getItem('lgpdConsent') === 'true') {
        enableAnalytics();
    }

    // Quando o banner for aceito nesta sessão, habilita sem precisar recarregar
    window.addEventListener('lgpdConsentGranted', enableAnalytics);
})();


window.PRODUCTS = [];

// --- WHITE-LABEL: SEO + bindings (config.js/theme.js) ---
function applySeoFromConfig() {
    if (!window.WL || !WL.config) return;

    const cfg = WL.config;
    const business = cfg.business || {};
    const siteUrl = (cfg.site && cfg.site.url) ? cfg.site.url.replace(/\/$/, '') : '';
    const filename = (window.location.pathname.split('/').pop() || 'index.html');
    const page = (cfg.seo && cfg.seo.pages && cfg.seo.pages[filename]) ? cfg.seo.pages[filename] : {};

    // helpers: get or create head tags
    const head = document.head || document.getElementsByTagName('head')[0];

    function getOrCreate(selector, createFn) {
        let el = document.querySelector(selector);
        if (!el) {
            el = createFn();
            head.appendChild(el);
        }
        return el;
    }

    function setMetaByName(name, content) {
        if (!content && content !== "") return;
        const el = getOrCreate(`meta[name="${name}"]`, () => {
            const m = document.createElement('meta');
            m.setAttribute('name', name);
            return m;
        });
        el.setAttribute('content', content);
    }

    function setMetaByProp(prop, content) {
        if (!content && content !== "") return;
        const el = getOrCreate(`meta[property="${prop}"]`, () => {
            const m = document.createElement('meta');
            m.setAttribute('property', prop);
            return m;
        });
        el.setAttribute('content', content);
    }

    // Title: prioridade para config.seo.pages[filename].title
    let title = page.title || document.title || '';
    if (!title) {
        title = (filename === 'index.html' || filename === '') 
            ? `${business.name || cfg.client?.name || ''} | ${business.tagline || ''}`.trim()
            : `${filename.replace('.html','')} | ${business.name || cfg.client?.name || ''}`.trim();
    }
    document.title = title;

    // Robots
    if (page.robots) setMetaByName('robots', page.robots);

    // Description
    const desc = page.description || (cfg.seo && cfg.seo.defaultDescription) || '';
    setMetaByName('description', desc);

    // Canonical
    const canonicalHref = siteUrl ? ((filename === 'index.html') ? `${siteUrl}/` : `${siteUrl}/${filename}`) : '';
    const canonicalEl = getOrCreate('link[rel="canonical"]', () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
    });
    if (canonicalHref) canonicalEl.setAttribute('href', canonicalHref);

    
    // Google Search Console verification (opcional)
    if (cfg.seo && cfg.seo.googleSiteVerification) {
        const gsv = getOrCreate('meta[name="google-site-verification"]', () => {
            const m = document.createElement('meta');
            m.setAttribute('name', 'google-site-verification');
            return m;
        });
        gsv.setAttribute('content', cfg.seo.googleSiteVerification);
    }

// OG / Twitter
    setMetaByProp('og:type', 'website');
    setMetaByProp('og:locale', 'pt_BR');
    setMetaByProp('og:site_name', business.name || cfg.client?.name || '');
    setMetaByProp('og:url', canonicalHref);
    setMetaByProp('og:title', document.title);
    setMetaByProp('og:description', desc);

    const ogImgVal = page.og_image || (cfg.seo && cfg.seo.defaultOgImage) || (window.WL.theme?.assets?.ogDefault) || '';
    const ogImg = ogImgVal ? (ogImgVal.startsWith('http') ? ogImgVal : (siteUrl ? `${siteUrl}/${ogImgVal.replace(/^\//,'')}` : ogImgVal)) : '';
    if (ogImg) setMetaByProp('og:image', ogImg);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:url', canonicalHref);
    setMetaByName('twitter:title', document.title);
    setMetaByName('twitter:description', desc);
    if (ogImg) setMetaByName('twitter:image', ogImg);

    // Atualiza schema.org (se existir)
    const ld = document.querySelector('script[type="application/ld+json"]');
    if (ld) {
        try {
            const data = JSON.parse(ld.textContent);
            data.name = business.name || data.name;
            data.alternateName = business.tagline ? `${business.tagline}` : (data.alternateName || data.name);
            if (siteUrl) {
                data.url = siteUrl;
                data['@id'] = siteUrl;
            }
            if (cfg.contacts?.whatsapp?.number) data.telephone = '+' + cfg.contacts.whatsapp.number;
            const logo = window.WL.theme?.assets?.logoHeader;
            if (logo && siteUrl) data.logo = logo.startsWith('http') ? logo : `${siteUrl}/${logo.replace(/^\//,'')}`;
            const hero = window.WL.theme?.assets?.ogDefault;
            if (hero && siteUrl) data.image = hero.startsWith('http') ? hero : `${siteUrl}/${hero.replace(/^\//,'')}`;
            ld.textContent = JSON.stringify(data, null, 2);
        } catch (e) { /* ignora */ }
    }
}

function applyWhiteLabelBindings() {
    if (window.WL && typeof WL.applyBindings === 'function') {
        WL.applyBindings(document);
    }
}



document.addEventListener('DOMContentLoaded', () => {

    applySeoFromConfig();
    applyWhiteLabelBindings();

    // 1. INICIALIZAÇÃO DE DADOS (Unificação segura de produtos e serviços)
    const safeServices = (typeof SERVICES_LIST !== 'undefined') ? SERVICES_LIST : [];
    const safeProducts = (typeof PRODUCTS_LIST !== 'undefined') ? PRODUCTS_LIST : [];
    window.PRODUCTS = [...safeServices, ...safeProducts];

    if (window.PRODUCTS.length === 0) console.warn("ALERTA: Catálogo vazio. Verifique products.js e services.js.");

    // 2. RECUPERAÇÃO DE CARRINHO (Link Compartilhado)
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedCartData = urlParams.get('cart');

        if (sharedCartData) {
            const parsedCart = JSON.parse(atob(sharedCartData));
            if (Array.isArray(parsedCart)) {
                localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(parsedCart));
                localStorage.removeItem(STORAGE_KEYS.coupon);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    } catch (e) { console.warn("Erro ao processar carrinho compartilhado."); }

    // 3. CARREGAR CARRINHO INICIAL
    loadCart();

    // 4. CARREGAR COMPONENTES (Header e Footer)
    
    // O callback 'setupHeaderLogic' vai ativar a busca, o menu mobile e o contador
    loadComponent('header-placeholder', 'partials/cabecalho.html', setupHeaderLogic);

    // Carrega Rodapé, Banner de Cookies e Botão Voltar ao Topo
    loadComponent('footer-placeholder', 'partials/rodape.html', () => {
        setupCookieBanner();
        setupBackToTop(); 
    }); 

    // 5. ROTEAMENTO E LÓGICA ESPECÍFICA POR PÁGINA
    const body = document.body;

    // HOME (Seção de Parceiros e Vídeo)
    if (document.querySelector('.hero-banner-static') || document.querySelector('.hero-banner-video')) {
        if (typeof setupPartnerContent === 'function') setupPartnerContent();
    }

    // PROMOÇÕES (Carrossel e Sliders)
    if (body.classList.contains('promocoes-page')) {
        setupInternalBannerCarousel('love-banner-carousel');
    }

    // AVALIAÇÃO (Wizard/Formulário Interativo)
    if (body.classList.contains('avaliacao-page') && typeof setupExclusivasPage === 'function') {
        setupExclusivasPage();
    }

    // BUSCA
    if (body.classList.contains('search-page')) {
        renderSearchPage();
        setupInternalBannerCarousel('internal-banner-carousel-busca');
    }

    // DETALHES DO PRODUTO
    if (body.classList.contains('product-detail-page')) {
        setupProductPage();
    }

    // CARRINHO (Lógica de Cupom e Compartilhamento)
    if (body.classList.contains('cart-page')) {
        renderCartPage();

        // Lógica de Cupom
        const btnCupom = document.getElementById('cupom-btn');
        const inputCupom = document.getElementById('cupom-input');
        const msgCupom = document.getElementById('cupom-status-message');

        if (btnCupom && inputCupom && typeof COUPONS !== 'undefined') {
            btnCupom.addEventListener('click', () => {
                const code = inputCupom.value.toUpperCase().trim();
                const coupon = COUPONS.find(c => c.code === code);
                const today = new Date().toISOString().split('T')[0];

                msgCupom.textContent = "";
                msgCupom.style.color = "";

                if (!coupon) {
                    msgCupom.textContent = "Cupom inválido.";
                    msgCupom.style.color = 'red';
                    return;
                }

                if (coupon.valid_until && coupon.valid_until < today) {
                    const d = coupon.valid_until.split('-');
                    msgCupom.textContent = `Expirado em ${d[2]}/${d[1]}/${d[0]}.`;
                    msgCupom.style.color = 'red';
                    return;
                }

                localStorage.setItem(STORAGE_KEYS.coupon, code);
                loadCart(); 
                updateCartSummary(); 
                msgCupom.textContent = `Cupom ${code} aplicado!`;
                msgCupom.style.color = 'var(--color-accent)';
            });
        }

        // Lógica de Compartilhar Carrinho (Link Mágico)
        const btnShare = document.getElementById('share-cart-btn');
        const msgShare = document.getElementById('share-cart-success');

        if (btnShare && msgShare) {
            btnShare.addEventListener('click', (e) => {
                e.preventDefault();
                if (cartItems.length === 0) return alert('Sacola vazia!');

                const link = `${window.location.origin}${window.location.pathname}?cart=${btoa(JSON.stringify(cartItems))}`;

                if (navigator.clipboard) {
                    navigator.clipboard.writeText(link).then(showShareSuccess);
                } else {
                    const el = document.createElement('textarea');
                    el.value = link;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    showShareSuccess();
                }

                function showShareSuccess() {
                    btnShare.style.display = 'none';
                    msgShare.style.display = 'inline-block';
                    setTimeout(() => { 
                        btnShare.style.display = 'inline-block'; 
                        msgShare.style.display = 'none'; 
                    }, 3000);
                }
            });
        }
    }

    // CHECKOUT
    if (body.classList.contains('checkout-page')) {
        setupPaymentPage();
    }

    // PÁGINA OBRIGADO (LIMPEZA FINAL)
    if (document.querySelector('.thank-you-main')) {
        localStorage.removeItem(STORAGE_KEYS.cart);      
        localStorage.removeItem(STORAGE_KEYS.coupon); 

        
        localStorage.removeItem(STORAGE_KEYS.appointment);
const cartCountEl = document.getElementById('cart-count');
        const cartCountMob = document.getElementById('cart-count-mobile');
        if (cartCountEl) cartCountEl.textContent = '0';
        if (cartCountMob) cartCountMob.textContent = '0';

        if (typeof cartItems !== 'undefined') cartItems = [];
    }
});
