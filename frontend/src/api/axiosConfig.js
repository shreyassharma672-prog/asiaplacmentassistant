import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const resumeApi = {
  generateResume: (data) => 
    api.post('/api/chat', data),
  analyzeUploadedResume: (formData) =>
    api.post('/api/analyze-uploaded-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  extractResume: (formData) =>
    api.post('/api/extract-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  improveUploadedResume: (data) =>
    api.post('/api/improve-uploaded-resume', data),
};

export default api;
