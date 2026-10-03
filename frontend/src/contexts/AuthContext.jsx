import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clinicflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('clinicflow_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('clinicflow_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.user);
          localStorage.setItem('clinicflow_user', JSON.stringify(res.user));
        } catch (error) {
          console.warn('Session verification failed, logging out:', error.message);
          localStorage.removeItem('clinicflow_token');
          localStorage.removeItem('clinicflow_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('clinicflow_token', data.token);
    localStorage.setItem('clinicflow_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('clinicflow_token');
    localStorage.removeItem('clinicflow_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isStaff,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
