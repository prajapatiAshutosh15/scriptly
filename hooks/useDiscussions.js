"use client";
import { useState } from 'react';
import api from '@/services/api';

export function useDiscussions() {
  const [loading, setLoading] = useState(false);

  const fetchDiscussions = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/discussions', { params });
      return res.data;
    } finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    const res = await api.get('/discussions/categories');
    return res.data;
  };

  const fetchBySlug = async (slug) => {
    setLoading(true);
    try {
      const res = await api.get(`/discussions/${slug}`);
      return res.data;
    } finally { setLoading(false); }
  };

  const createDiscussion = async (data) => {
    const res = await api.post('/discussions', data);
    return res.data;
  };

  const postReply = async (slug, data) => {
    const res = await api.post(`/discussions/${slug}/replies`, data);
    return res.data;
  };

  return { loading, fetchDiscussions, fetchCategories, fetchBySlug, createDiscussion, postReply };
}
