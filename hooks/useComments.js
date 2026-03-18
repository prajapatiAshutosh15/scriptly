import { useState, useCallback } from 'react';
import api from '@/services/api';

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // type: 'post', 'question', 'answer'  |  targetId: the UUID of the target
  const fetchComments = useCallback(async (type, targetId, params) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/comments/${type}/${targetId}`, { params });
      return res.data;
    } catch (err) {
      setError(err?.message || 'Failed to fetch comments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createComment = useCallback(async (type, targetId, { body, parent_id }) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/comments/${type}/${targetId}`, { body, parent_id });
      return res.data;
    } catch (err) {
      setError(err?.message || 'Failed to create comment');
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
      setError(err?.message || 'Failed to delete comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchComments, createComment, deleteComment };
}
