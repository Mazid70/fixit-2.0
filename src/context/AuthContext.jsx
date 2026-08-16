import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep axios defaults in sync with token so requests use the header immediately
  useEffect(() => {
    const fetchUser = async () => {
      // Using HttpOnly cookie for auth; call /auth/me to validate session
      try {
        const res = await api.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error('Session verification error:', err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    // Listen for global unauthorized events (e.g. 401 from axios) to clear in-memory user
    const onUnauthorized = () => {
      setUser(null);
      setToken(null);
      setLoading(false);
    };
    window.addEventListener('fixit:unauthorized', onUnauthorized);
    return () =>
      window.removeEventListener('fixit:unauthorized', onUnauthorized);
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { user: userData } = res.data.data;
        // Server sets HttpOnly cookie; keep user in memory only
        setUser(userData);
        return userData;
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  // Register handler
  const register = async userData => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data?.success) {
        const { user: newUserData } = res.data.data;
        setUser(newUserData);
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
    // Call server to clear the auth cookie
    try {
      api.post('/auth/logout');
    } catch {}
    setToken(null);
    setUser(null);
  };

  // Update profile
  const updateProfile = async formData => {
    try {
      const res = await api.put('/users/profile', formData);
      if (res.data?.success) {
        setUser(res.data.data);
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
    // Cookie-based auth: consider user presence as the authentication signal
    isAuthenticated: !!user,
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
