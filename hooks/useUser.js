import { useState, useCallback } from 'react';
import api from '@/services/api';

export function useUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (username) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/users/${username}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (username, data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.patch(`/users/${username}`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const followUser = useCallback(async (username) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.post(`/users/${username}/follow`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unfollowUser = useCallback(async (username) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.delete(`/users/${username}/follow`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchProfile, updateProfile, followUser, unfollowUser };
}
