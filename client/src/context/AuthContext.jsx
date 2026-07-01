import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateStoredSession = async () => {
      const storedToken = localStorage.getItem('acw-token');
      const storedUser = localStorage.getItem('acw-user');

      if (!storedToken || !storedUser) {
        localStorage.removeItem('acw-token');
        localStorage.removeItem('acw-user');
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/users/me');
        localStorage.setItem('acw-user', JSON.stringify(data.user));
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('acw-token');
        localStorage.removeItem('acw-user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateStoredSession();
  }, []);

  const loginWithCredentials = async ({ name, email, password, mode }) => {
    const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
    const payload = mode === 'register' ? { name, email, password } : { email, password };
    const { data } = await api.post(endpoint, payload);
    localStorage.setItem('acw-token', data.token);
    localStorage.setItem('acw-user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('acw-token');
    localStorage.removeItem('acw-user');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      loginWithCredentials,
      logout,
      setUser
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
