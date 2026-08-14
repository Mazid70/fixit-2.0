import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef(new Map());

  // Add toast helper
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    const t = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      toastTimers.current.delete(id);
    }, duration);
    toastTimers.current.set(id, t);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = toastTimers.current.get(id);
    if (t) {
      clearTimeout(t);
      toastTimers.current.delete(id);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      const success = !!res.data?.success;
      const payload = res.data?.data ?? res.data;

      if (success && payload) {
        if (Array.isArray(payload)) {
          setNotifications(payload);
          setUnreadCount(0);
        } else {
          setNotifications(payload.notifications ?? payload.items ?? []);
          setUnreadCount(payload.unreadCount ?? res.data.unreadCount ?? 0);
        }
      } else if (!success && Array.isArray(payload)) {
        // Some APIs may return array directly without a success flag
        setNotifications(payload);
        setUnreadCount(0);
      }
    } catch (err) {
      // Ignore background notification poll errors but log for debugging
      console.error('Notification fetch error:', err);
    }
  }, [isAuthenticated]);

  // Mark single as read
  const markAsRead = async (id) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      if (res.data?.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id || n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const res = await api.patch('/notifications/read-all');
      if (res.data?.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
        addToast('All notifications marked as read', 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000); // 15s poll
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    return () => {
      // clear any pending toast timers on unmount
      for (const t of toastTimers.current.values()) clearTimeout(t);
      toastTimers.current.clear();
    };
  }, []);

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    toasts,
    addToast,
    removeToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
