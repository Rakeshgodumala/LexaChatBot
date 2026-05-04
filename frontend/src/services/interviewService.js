import api from './api';

export const interviewService = {
  async startInterview({ technology, difficulty, totalQuestions }) {
    const response = await api.post('/interview/start', {
      technology,
      difficulty,
      totalQuestions,
    });
    return response.data;
  },

  async submitAnswer({ sessionId, answer }) {
    const response = await api.post('/interview/answer', {
      sessionId,
      answer,
    });
    return response.data;
  },

  async getInterviewHistory() {
    const response = await api.get('/interview/history');
    return response.data;
  },

  async getInterviewById(id) {
    const response = await api.get(`/interview/${id}`);
    return response.data;
  },
};
