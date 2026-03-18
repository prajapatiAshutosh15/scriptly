import { useState, useCallback } from 'react';
import api from '@/services/api';

export function useBookmarks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookmarks = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/bookmarks', { params });
      return res.data;
    } catch (err) {
      setError(err?.message || 'Failed to fetch bookmarks');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // type: 'post', 'question', 'discussion'  |  id: the UUID
  const addBookmark = useCallback(async (type, id) => {
    const res = await api.post(`/bookmarks/${type}/${id}`);
    return res.data;
  }, []);

  const removeBookmark = useCallback(async (type, id) => {
    const res = await api.delete(`/bookmarks/${type}/${id}`);
    return res.data;
  }, []);

  return { loading, error, fetchBookmarks, addBookmark, removeBookmark };
}
