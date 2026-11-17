import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest, setClientToken } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('citysync_jwt') || null;
    } catch (e) {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('citysync_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Sync token with HTTP client
  useEffect(() => {
    setClientToken(token);
    if (token) {
      try {
        localStorage.setItem('citysync_jwt', token);
      } catch (e) {}
    } else {
      try {
        localStorage.removeItem('citysync_jwt');
        localStorage.removeItem('citysync_user');
      } catch (e) {}
    }
  }, [token]);

  // Handle unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('citysync:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('citysync:unauthorized', handleUnauthorized);
  }, []);

  // Validate session on load
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await apiRequest('/api/auth/me');
        setUser(res.user);
        try {
          localStorage.setItem('citysync_user', JSON.stringify(res.user));
        } catch (e) {}
      } catch (err) {
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    verifySession();
  }, [token]);

  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const exchangeOneTimeCode = async (code) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/api/auth/exchange', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      setToken(res.token);
      setUser(res.user);
      try {
        localStorage.setItem('citysync_user', JSON.stringify(res.user));
      } catch (e) {}
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/api/auth/demo-login', {
        method: 'POST',
      });
      setToken(res.token);
      setUser(res.user);
      try {
        localStorage.setItem('citysync_user', JSON.stringify(res.user));
      } catch (e) {}
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setClientToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        loginWithGoogle,
        exchangeOneTimeCode,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
