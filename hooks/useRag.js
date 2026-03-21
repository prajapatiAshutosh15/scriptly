"use client";
import { useState } from 'react';
import api from '@/services/api';

export function useRag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ask = async (question, conversationId = null) => {
    setLoading(true);
    setError(null);
    try {
      const body = { question };
      if (conversationId) body.conversation_id = conversationId;
      const res = await api.post('/rag/ask', body);
      return res.data;
    } catch (err) {
      const msg = err?.message || err?.error?.message || 'AI service error';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getConversations = async () => {
    const res = await api.get('/rag/conversations');
    return res.data;
  };

  const getConversation = async (id) => {
    const res = await api.get(`/rag/conversations/${id}`);
    return res.data;
  };

  return { loading, error, ask, getConversations, getConversation };
}
