import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import { post, get } from 'api';
import { CUSTOMER_ROLE } from 'utils/auth';

export const AuthContext = createContext(null);

function persistSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password) => {
    const data = await post('/auth/login', { email, password });
    persistSession(data);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await post('/auth/register', { name, email, password });
    persistSession(data);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const data = await get('/auth/me');
      setUser(data.user);
    } catch {
      logout();
    }
  }, [logout]);

  const updateUser = useCallback((updated) => {
    const stored = localStorage.getItem('user');
    const current = stored ? JSON.parse(stored) : {};
    const merged = { ...current, ...updated };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const role = user ? CUSTOMER_ROLE : null;

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      checkAuth,
      updateUser,
      isAuthenticated: !!user,
      role,
      isCustomer: role === CUSTOMER_ROLE
    }),
    [user, login, register, logout, checkAuth, updateUser, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
