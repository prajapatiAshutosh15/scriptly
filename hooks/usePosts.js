import { useState, useCallback } from 'react';
import api from '@/services/api';

export function usePosts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/posts', { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBySlug = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/posts/${slug}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPosts = useCallback(async (query, params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/posts/search', { params: { q: query, ...params } });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDrafts = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/posts/drafts', { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeed = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/posts/feed', { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/posts', data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (slug, data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.patch(`/posts/${slug}`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/posts/${slug}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/posts/${slug}/like`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/posts/${slug}/like`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bookmarkPost = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/posts/${slug}/bookmark`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unbookmarkPost = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/posts/${slug}/bookmark`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const recordView = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/posts/${slug}/views`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchPosts,
    fetchBySlug,
    searchPosts,
    fetchDrafts,
    fetchFeed,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    bookmarkPost,
    unbookmarkPost,
    recordView,
  };
}
