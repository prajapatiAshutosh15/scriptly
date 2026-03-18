"use client";
import { useState } from 'react';
import api from '@/services/api';

export function useRag() {
  const [loading, setLoading] = useState(false);

  const ask = async (question, conversationId = null) => {
    setLoading(true);
    try {
      const res = await api.post('/rag/ask', { question, conversation_id: conversationId });
      return res.data;
    } finally { setLoading(false); }
  };

  const getConversations = async () => {
    const res = await api.get('/rag/conversations');
    return res.data;
  };

  const getConversation = async (id) => {
    const res = await api.get(`/rag/conversations/${id}`);
    return res.data;
  };

  return { loading, ask, getConversations, getConversation };
}
