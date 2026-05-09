import { createContext, useContext, useState, useCallback } from 'react';
import { tokenStore } from '../auth/tokenStore.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());

  const login = useCallback((userData, accessToken, refreshToken) => {
    tokenStore.setAccess(accessToken);
    tokenStore.setRefresh(refreshToken);
    tokenStore.setUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    tokenStore.setUser(updated);
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
