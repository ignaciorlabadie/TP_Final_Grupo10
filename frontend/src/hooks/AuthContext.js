import React, { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(() => storedToken ? decodeToken(storedToken) : null);

  const login = useCallback(async (email, password) => {
    const datos = await authService.login(email, password);
    localStorage.setItem('token', datos.token);
    setToken(datos.token);
    setUser(decodeToken(datos.token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
