import { useState, useCallback } from 'react';
import api from '@/services/api';

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async (slug, params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/comments/post/${slug}`, { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createComment = useCallback(async (slug, { content, parent_id }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/comments/post/${slug}`, { content, parent_id });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateComment = useCallback(async (id, { content }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.patch(`/comments/${id}`, { content });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/comments/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likeComment = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/comments/${id}/like`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikeComment = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/comments/${id}/like`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchComments, createComment, updateComment, deleteComment, likeComment, unlikeComment };
}
