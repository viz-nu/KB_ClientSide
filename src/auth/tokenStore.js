/**
 * TokenStore — Secure token management
 *
 * Access Token  → in-memory ONLY (never persisted anywhere)
 * Refresh Token → sessionStorage (cleared on tab/browser close)
 * User info     → sessionStorage (non-sensitive display data)
 *
 * In production, prefer httpOnly cookies set by the server for
 * the refresh token. This approach is the best we can do client-side.
 */

const KEYS = {
  REFRESH: '__emb_rt',
  USER: '__emb_user',
};

class TokenStore {
  constructor() {
    this._accessToken = null;
  }

  // ── Access Token (in-memory) ──────────────────
  setAccess(token) {
    this._accessToken = token;
  }

  getAccess() {
    return this._accessToken;
  }

  clearAccess() {
    this._accessToken = null;
  }

  // ── Refresh Token (sessionStorage) ───────────
  setRefresh(token) {
    try { sessionStorage.setItem(KEYS.REFRESH, token); }
    catch (e) { console.warn('sessionStorage unavailable:', e); }
  }

  getRefresh() {
    try { return sessionStorage.getItem(KEYS.REFRESH); }
    catch { return null; }
  }

  // ── User (sessionStorage) ─────────────────────
  setUser(user) {
    try { sessionStorage.setItem(KEYS.USER, JSON.stringify(user)); }
    catch { /* ignore */ }
  }

  getUser() {
    try {
      const raw = sessionStorage.getItem(KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  // ── Full clear on logout ──────────────────────
  clear() {
    this._accessToken = null;
    try {
      sessionStorage.removeItem(KEYS.REFRESH);
      sessionStorage.removeItem(KEYS.USER);
    } catch { /* ignore */ }
  }

  isAuthenticated() {
    return !!(this._accessToken || this.getRefresh());
  }
}

export const tokenStore = new TokenStore();
