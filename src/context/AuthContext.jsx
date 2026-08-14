import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('fixit_token') || null);
  const [loading, setLoading] = useState(true);

  // Keep axios defaults in sync with token so requests use the header immediately
  useEffect(() => {
    if (token) {
      api.defaults.headers = api.defaults.headers || {};
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      if (api.defaults.headers && api.defaults.headers.common) {
        delete api.defaults.headers.common.Authorization;
      }
    }

    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.data);
          localStorage.setItem('fixit_user', JSON.stringify(res.data.data));
        } else {
          // If API indicates no success, clear stored auth
          localStorage.removeItem('fixit_token');
          localStorage.removeItem('fixit_user');
          setToken(null);
          setUser(null);
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
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: jwtToken, user: userData } = res.data.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('fixit_token', jwtToken);
        localStorage.setItem('fixit_user', JSON.stringify(userData));
        // ensure axios instance has header for subsequent immediate requests
        api.defaults.headers = api.defaults.headers || {};
        api.defaults.headers.common = api.defaults.headers.common || {};
        api.defaults.headers.common.Authorization = `Bearer ${jwtToken}`;
        return userData;
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.success) {
        const { token: jwtToken, user: newUserData } = res.data.data;
        setToken(jwtToken);
        setUser(newUserData);
        localStorage.setItem('fixit_token', jwtToken);
        localStorage.setItem('fixit_user', JSON.stringify(newUserData));
        api.defaults.headers = api.defaults.headers || {};
        api.defaults.headers.common = api.defaults.headers.common || {};
        api.defaults.headers.common.Authorization = `Bearer ${jwtToken}`;
        return newUserData;
      }
      throw new Error(res.data?.message || 'Registration failed');
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('fixit_token');
    localStorage.removeItem('fixit_user');
    setToken(null);
    setUser(null);
    if (api.defaults.headers && api.defaults.headers.common) {
      delete api.defaults.headers.common.Authorization;
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data?.success) {
        setUser(res.data.data);
        localStorage.setItem('fixit_user', JSON.stringify(res.data.data));
        return res.data.data;
      }
      throw new Error(res.data?.message || 'Update profile failed');
    } catch (err) {
      console.error('Update profile error:', err);
      throw err;
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
