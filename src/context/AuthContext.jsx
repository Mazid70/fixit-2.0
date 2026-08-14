import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fixit_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user if token exists on initial load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
          localStorage.setItem('fixit_user', JSON.stringify(res.data.data));
        }
      } catch (err) {
        console.error('Session verification error:', err);
        localStorage.removeItem('fixit_token');
        localStorage.removeItem('fixit_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('fixit_token', jwtToken);
      localStorage.setItem('fixit_user', JSON.stringify(userData));
      return userData;
    }
  };

  // Register handler
  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: jwtToken, user: newUserData } = res.data.data;
      setToken(jwtToken);
      setUser(newUserData);
      localStorage.setItem('fixit_token', jwtToken);
      localStorage.setItem('fixit_user', JSON.stringify(newUserData));
      return newUserData;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('fixit_token');
    localStorage.removeItem('fixit_user');
    setToken(null);
    setUser(null);
  };

  // Update profile
  const updateProfile = async (formData) => {
    const res = await api.put('/users/profile', formData);
    if (res.data.success) {
      setUser(res.data.data);
      localStorage.setItem('fixit_user', JSON.stringify(res.data.data));
      return res.data.data;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user ? user.role : null,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
