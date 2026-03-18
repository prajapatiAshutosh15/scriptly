"use client";
import api from '@/services/api';

export function useVotes() {
  const vote = async (type, id, value) => {
    const res = await api.post(`/votes/${type}/${id}`, { value });
    return res.data;
  };

  return { vote };
}
