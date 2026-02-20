// partners.js - White-label wrapper (dados vêm do config.js)
const PARTNERS = (window.APP_CONFIG && window.APP_CONFIG.data && window.APP_CONFIG.data.partners) ? window.APP_CONFIG.data.partners : [];
window.PARTNERS = PARTNERS;
