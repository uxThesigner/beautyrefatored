// coupons.js - White-label wrapper (dados vêm do config.js)
const COUPONS = (window.APP_CONFIG && window.APP_CONFIG.data && window.APP_CONFIG.data.coupons) ? window.APP_CONFIG.data.coupons : [];
window.COUPONS = COUPONS;
