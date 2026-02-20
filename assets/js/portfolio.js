// portfolio.js - White-label wrapper (dados vêm do config.js)
const PORTFOLIO_LIST = (window.APP_CONFIG && window.APP_CONFIG.data && window.APP_CONFIG.data.portfolio) ? window.APP_CONFIG.data.portfolio : [];
window.PORTFOLIO_LIST = PORTFOLIO_LIST;
