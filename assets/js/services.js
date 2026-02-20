// services.js - White-label wrapper (dados vêm do config.js)
const SERVICES_LIST = (window.APP_CONFIG && window.APP_CONFIG.data && window.APP_CONFIG.data.services) ? window.APP_CONFIG.data.services : [];
window.SERVICES_LIST = SERVICES_LIST;
