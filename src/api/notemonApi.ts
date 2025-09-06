import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface SummaryResponse {
  summary: string;
  keyPoints: string[];
}

export interface FAQResponse {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const summarizeText = async (context: string): Promise<SummaryResponse> => {
  const response = await api.post('/api/report/summarize', { context });
  return response.data;
};

export const generateFaqs = async (context: string): Promise<FAQResponse> => {
  const response = await api.post('/api/faq', { context });
  return response.data;
};

export const generateMindmap = async (context: string) => {
  const response = await api.post('/api/mindmap', { context });
  return response.data;
};

export const chatWithDocument = async (message: string, context: string) => {
  const response = await api.post('/api/chat', { message, context });
  return response.data;
};

export default api;