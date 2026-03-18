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
      setError(err?.message || 'Failed to fetch posts');
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
      setError(err?.message || 'Failed to fetch post');
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
      setError(err?.message || 'Search failed');
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
      setError(err?.message || 'Failed to fetch drafts');
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
      setError(err?.message || 'Failed to fetch feed');
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
      setError(err?.message || 'Failed to create post');
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
      setError(err?.message || 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (slug) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/posts/${slug}`);
    } catch (err) {
      setError(err?.message || 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(async (slug) => {
    const res = await api.post(`/posts/${slug}/like`);
    return res.data;
  }, []);

  const unlikePost = useCallback(async (slug) => {
    const res = await api.delete(`/posts/${slug}/like`);
    return res.data;
  }, []);

  const recordView = useCallback(async (slug) => {
    try {
      await api.post(`/posts/${slug}/views`);
    } catch {}
  }, []);

  return {
    loading, error,
    fetchPosts, fetchBySlug, searchPosts, fetchDrafts, fetchFeed,
    createPost, updatePost, deletePost,
    likePost, unlikePost, recordView,
  };
}
