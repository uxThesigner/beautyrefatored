// promocoes.js - White-label wrapper (dados vêm do config.js)
const PROMO_DATA = (window.APP_CONFIG && window.APP_CONFIG.data && window.APP_CONFIG.data.promotions) ? window.APP_CONFIG.data.promotions : {};
window.PROMO_DATA = PROMO_DATA;
