"use client";
import { useState } from 'react';
import api from '@/services/api';

export function useQuestions() {
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/questions', { params });
      return res.data;
    } finally { setLoading(false); }
  };

  const fetchBySlug = async (slug) => {
    setLoading(true);
    try {
      const res = await api.get(`/questions/${slug}`);
      return res.data;
    } finally { setLoading(false); }
  };

  const createQuestion = async (data) => {
    const res = await api.post('/questions', data);
    return res.data;
  };

  const updateQuestion = async (slug, data) => {
    const res = await api.patch(`/questions/${slug}`, data);
    return res.data;
  };

  const deleteQuestion = async (slug) => {
    await api.delete(`/questions/${slug}`);
  };

  return { loading, fetchQuestions, fetchBySlug, createQuestion, updateQuestion, deleteQuestion };
}
