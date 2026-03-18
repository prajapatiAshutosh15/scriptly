"use client";
import { useState } from 'react';
import api from '@/services/api';

export function useSearch() {
  const [loading, setLoading] = useState(false);

  const search = async (query, params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/search', { params: { q: query, ...params } });
      return res.data;
    } finally { setLoading(false); }
  };

  return { loading, search };
}
