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
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchBookmarks };
}
