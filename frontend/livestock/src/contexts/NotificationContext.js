import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();
export const useNotificationContext = () => useContext(NotificationContext);

const POLL_INTERVAL = 30000; // 30 seconds

export const NotificationProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const fetch = useCallback(() => {
    if (!isLoggedIn) return;
    api.get('/notifications/')
      .then((res) => setNotifications(res.data))
      .catch(() => {});
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) { setNotifications([]); return; }
    fetch();
    const id = setInterval(fetch, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [isLoggedIn, fetch]);

  const markRead = async (notifId) => {
    try {
      await api.patch(`/notifications/${notifId}/read`);
      setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const remove = async (notifId) => {
    try {
      await api.delete(`/notifications/${notifId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, remove, refresh: fetch }}>
      {children}
    </NotificationContext.Provider>
  );
};
