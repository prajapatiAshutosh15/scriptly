"use client";
import { useState } from 'react';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notificationStore';

export function useNotifications() {
  const [loading, setLoading] = useState(false);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const fetchNotifications = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/notifications', { params });
      return res.data;
    } finally { setLoading(false); }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.data?.count || 0);
      return res.data?.count || 0;
    } catch { return 0; }
  };

  const markAsRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
  };

  const markAllAsRead = async () => {
    await api.patch('/notifications/read-all');
    setUnreadCount(0);
  };

  return { loading, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead };
}
