import api from './api';

export const chatService = {
  async sendMessage({ message, conversationId, category }) {
    const response = await api.post('/chat/message', {
      message,
      conversationId,
      category,
    });
    return response.data;
  },

  async getConversations() {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  async createConversation({ title, category }) {
    const response = await api.post('/chat/conversations', { title, category });
    return response.data;
  },

  async getConversationById(id) {
    const response = await api.get(`/chat/conversations/${id}`);
    return response.data;
  },

  async updateConversation(id, { title }) {
    const response = await api.patch(`/chat/conversations/${id}`, { title });
    return response.data;
  },

  async deleteConversation(id) {
    const response = await api.delete(`/chat/conversations/${id}`);
    return response.data;
  },

  async regenerateResponse(conversationId) {
    const response = await api.post(`/chat/regenerate/${conversationId}`);
    return response.data;
  },

  async submitFeedback(conversationId, messageId, feedback) {
    const response = await api.patch(
      `/chat/conversations/${conversationId}/messages/${messageId}/feedback`,
      { feedback }
    );
    return response.data;
  },

  async toggleSaveMessage(conversationId, messageId) {
    const response = await api.patch(
      `/chat/conversations/${conversationId}/messages/${messageId}/save`
    );
    return response.data;
  },

  async getSavedMessages() {
    const response = await api.get('/chat/saved');
    return response.data;
  },
};
