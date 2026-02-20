// products.js - White-label wrapper (dados vêm do config.js)
const PRODUCTS_LIST = (window.APP_CONFIG && window.APP_CONFIG.data && window.APP_CONFIG.data.products) ? window.APP_CONFIG.data.products : [];
window.PRODUCTS_LIST = PRODUCTS_LIST;
