import api from './api';

export const questionService = {
  async getQuestions(params = {}) {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  async getQuestionById(id) {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/questions/categories');
    return response.data;
  },

  async searchQuestions(query, params = {}) {
    const response = await api.get('/questions/search', {
      params: { q: query, ...params },
    });
    return response.data;
  },
};
