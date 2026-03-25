"use client";
import { useState, useRef } from 'react';
import api from '@/services/api';

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const search = async (query, params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/search', { params: { q: query, ...params } });
      return res.data;
    } finally { setLoading(false); }
  };

  const suggest = async (query) => {
    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await api.get('/search/suggest', {
        params: { q: query },
        signal: controller.signal,
      });
      return res.data;
    } catch (err) {
      if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') return null;
      return null;
    }
  };

  return { loading, search, suggest };
}
