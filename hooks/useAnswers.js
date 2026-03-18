"use client";
import api from '@/services/api';

export function useAnswers() {
  const createAnswer = async (questionId, data) => {
    const res = await api.post(`/answers/question/${questionId}`, data);
    return res.data;
  };

  const updateAnswer = async (id, data) => {
    const res = await api.patch(`/answers/${id}`, data);
    return res.data;
  };

  const deleteAnswer = async (id) => {
    await api.delete(`/answers/${id}`);
  };

  const acceptAnswer = async (id) => {
    const res = await api.post(`/answers/${id}/accept`);
    return res.data;
  };

  return { createAnswer, updateAnswer, deleteAnswer, acceptAnswer };
}
