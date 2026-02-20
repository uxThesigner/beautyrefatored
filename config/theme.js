// ======================================================
// theme.js - White-label (tema/identidade visual)
// Tema configurado: Beauty Esthetica (padrão)
// ======================================================
//
// Para trocar a "skin" rapidamente:
// - Ajuste cores em APP_THEME.colors
// - Ajuste fontes em APP_THEME.fonts (e o link Google Fonts)
// - Ajuste logos/imagens em APP_THEME.assets
// - Ajuste arredondamento em APP_THEME.radius

(function () {
  window.WL = window.WL || {};

  const APP_THEME = {
    colors: {
      primary: "#454F4A",
      accent: "#AA9478",
      background: "#FAFAFA",
      marquee: "#DCD8CE",
      text: "#454F4A",
      border: "#E0E0E0",
      highlight: "#9E8569",
      textLight: "#FFFFFF"
    },

      fonts: {
        // Se mudar as fontes aqui, troque também o link abaixo.
        googleFontsHref: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Corinthia:wght@400&display=swap",
        sans: "'Poppins', 'Helvetica Neue', Arial, sans-serif",
        script: "'Corinthia', cursive"
      },

    radius: {
      // px
      button: 4,
      input: 8,
      card: 6,
      pill: 999
    },

    assets: {
      logoHeader: "imagens/Banners/logo-beauty.svg",
      logoFooter: "imagens/Banners/logo-beauty.svg",
      favicon: "imagens/Banners/favicon.png",
      ogDefault: "imagens/Banners/herobusca.jpg",
      heroHome: "imagens/Banners/hero-home.jpg",
      clubHero: "imagens/Banners/hero-home.jpg",
      searchBanner1: "imagens/Banners/herobusca.jpg",
      searchBanner2: "imagens/Banners/herobusca2.jpg",
      searchBanner3: "imagens/Banners/herobusca3.jpg",
      searchBanner4: "imagens/Banners/herobusca4.jpg",
      ownerPhoto: "imagens/Banners/hillary.jpg"
    }
  };

  function ensureLink(rel, href, extraAttrs = {}) {
    if (!href) return;
    const exists = Array.from(document.querySelectorAll(`link[rel="${rel}"]`)).some(l => l.href === href);
    if (exists) return;

    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    Object.entries(extraAttrs).forEach(([k,v]) => link.setAttribute(k, v));
    document.head.appendChild(link);
  }

  function injectFonts(theme) {
    const href = theme?.fonts?.googleFontsHref;
    if (!href) return;

    // Preconnects (não duplicar)
    ensureLink('preconnect', 'https://fonts.googleapis.com');
    ensureLink('preconnect', 'https://fonts.gstatic.com', { crossorigin: "" });

    // Stylesheet
    ensureLink('stylesheet', href);
  }

  function setCssVar(name, value) {
    if (!name || value === undefined || value === null || value === "") return;
    document.documentElement.style.setProperty(name, value);
  }

  function applyTheme(theme) {
    if (!theme) return;

    injectFonts(theme);

    // Cores (mantém compatibilidade com CSS existente: --color-*)
    setCssVar('--color-primary', theme.colors.primary);
    setCssVar('--color-accent', theme.colors.accent);
    setCssVar('--color-background', theme.colors.background);
    setCssVar('--color-marquee', theme.colors.marquee);
    setCssVar('--color-text', theme.colors.text);
    setCssVar('--color-border', theme.colors.border);
    setCssVar('--color-highlight', theme.colors.highlight);
    setCssVar('--color-text-light', theme.colors.textLight);

    // Fontes
    setCssVar('--font-sans', theme.fonts.sans);
    setCssVar('--font-script', theme.fonts.script);

    // Radius
    setCssVar('--radius-btn', theme.radius.button + 'px');
    setCssVar('--radius-input', theme.radius.input + 'px');
    setCssVar('--radius-card', theme.radius.card + 'px');
    setCssVar('--radius-pill', theme.radius.pill + 'px');

    // Assets (URLs) como CSS vars para uso em backgrounds
    const a = theme.assets || {};
    setCssVar('--asset-hero-home', a.heroHome ? `url("${a.heroHome}")` : '');
    setCssVar('--asset-club-hero', a.clubHero ? `url("${a.clubHero}")` : '');
    setCssVar('--asset-search-banner-1', a.searchBanner1 ? `url("${a.searchBanner1}")` : '');
    setCssVar('--asset-search-banner-2', a.searchBanner2 ? `url("${a.searchBanner2}")` : '');
    setCssVar('--asset-search-banner-3', a.searchBanner3 ? `url("${a.searchBanner3}")` : '');
    setCssVar('--asset-search-banner-4', a.searchBanner4 ? `url("${a.searchBanner4}")` : '');

    // theme-color meta (mobile UI)
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      m.setAttribute('content', theme.colors.primary);
    });

    // Preenche assets em elementos marcados
    if (window.WL && typeof window.WL.applyBindings === 'function') {
      // bindings podem depender de theme.assets
      window.WL.applyBindings(document);
    }
  }

  window.APP_THEME = APP_THEME;
  window.WL.theme = APP_THEME;
  window.WL.applyTheme = applyTheme;

  // Aplica imediatamente (evita flash)
  applyTheme(APP_THEME);
})();
