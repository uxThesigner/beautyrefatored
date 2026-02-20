// ======================================================
// AUTH.JS (STATIC MOCK) - RBAC + SESSION
// - Sem backend: usa localStorage
// - Seeds de usuários de teste (cliente/staff/admin)
// - Suporta criação de conta (sempre role: cliente)
// ======================================================
(function (global) {
  const USERS_KEY = 'beauty_users_v1';
  const SESSION_KEY = 'beauty_session_v1';
  const LEGACY_AUTH_KEY = 'beauty_auth';

  function safeJsonParse(v, fallback) {
    try { return JSON.parse(v); } catch { return fallback; }
  }

  function seedUsersIfNeeded() {
    const existing = localStorage.getItem(USERS_KEY);
    if (existing) return;

    const seeded = [
      { username: 'cliente', password: '123', role: 'cliente', name: 'Cliente' },
      { username: 'staff',   password: '123', role: 'staff',   name: 'Staff' },
      { username: 'admin',   password: '123', role: 'admin',   name: 'Admin' },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  }

  function getUsers() {
    seedUsersIfNeeded();
    return safeJsonParse(localStorage.getItem(USERS_KEY), []);
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users || []));
  }

  function normalizeLogin(input) {
    return (input || '').toString().trim().toLowerCase();
  }

  function getSession() {
    const session = safeJsonParse(localStorage.getItem(SESSION_KEY), null);
    if (session && session.username && session.role) return session;
    return null;
  }

  function setSession(session) {
    if (!session) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LEGACY_AUTH_KEY);
      return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // compat
    localStorage.setItem(LEGACY_AUTH_KEY, 'true');
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function logout() {
    setSession(null);
  }

  function login(usernameOrEmailOrCpf, password) {
    seedUsersIfNeeded();
    const loginId = normalizeLogin(usernameOrEmailOrCpf);
    const pwd = (password || '').toString();
    if (!loginId || !pwd) return { ok: false, error: 'missing_credentials' };

    const users = getUsers();
    const found = users.find(u => normalizeLogin(u.username) === loginId);
    if (!found) return { ok: false, error: 'user_not_found' };
    if ((found.password || '').toString() !== pwd) return { ok: false, error: 'invalid_password' };

    setSession({
      username: found.username,
      role: found.role,
      name: found.name || found.username,
      ts: Date.now(),
    });

    return { ok: true, user: found };
  }

  function signup({ username, password, name }) {
    seedUsersIfNeeded();
    const loginId = normalizeLogin(username);
    const pwd = (password || '').toString();
    const displayName = (name || '').toString().trim() || username;
    if (!loginId || !pwd) return { ok: false, error: 'missing_fields' };

    const users = getUsers();
    const exists = users.some(u => normalizeLogin(u.username) === loginId);
    if (exists) return { ok: false, error: 'user_exists' };

    const newUser = { username: loginId, password: pwd, role: 'cliente', name: displayName };
    users.push(newUser);
    saveUsers(users);
    setSession({ username: newUser.username, role: newUser.role, name: newUser.name, ts: Date.now() });
    return { ok: true, user: newUser };
  }

  function role() {
    const s = getSession();
    return s ? s.role : null;
  }

  function hasRole(roles) {
    const r = role();
    if (!r) return false;
    if (Array.isArray(roles)) return roles.includes(r);
    return false;
  }

  function redirectForRole(r) {
    if (r === 'cliente') return 'cliente.html';
    if (r === 'staff') return 'agenda.html';
    if (r === 'admin') return 'admin.html';
    return 'login.html';
  }

  global.BeautyAuth = {
    USERS_KEY,
    SESSION_KEY,
    seedUsersIfNeeded,
    getUsers,
    getSession,
    setSession,
    isLoggedIn,
    login,
    signup,
    logout,
    role,
    hasRole,
    redirectForRole,
  };

  // Guard simples por classe no <body> (sem backend)
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    if (!body) return;

    // Admin area
    if (body.classList.contains('admin-app')) {
      if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
      }
      const r = role();
      if (r === 'cliente') {
        window.location.href = 'cliente.html';
        return;
      }
      if (r === 'staff') {
        const current = (window.location.pathname.split('/').pop() || '').split('?')[0];
        const allowed = ['agenda.html', 'crm.html'];
        if (current && !allowed.includes(current)) {
          window.location.href = 'agenda.html';
          return;
        }
      }
    }

    // Cliente area
    if (body.classList.contains('client-app')) {
      if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
      }
      const r = role();
      if (r !== 'cliente') {
        window.location.href = redirectForRole(r);
        return;
      }
    }
  });
})(window);
