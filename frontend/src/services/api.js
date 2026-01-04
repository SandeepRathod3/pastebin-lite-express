import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add test mode header if in test environment
    if (import.meta.env.VITE_TEST_MODE === 'true') {
      config.headers['x-test-now-ms'] = Date.now();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message;
    throw new Error(message);
  }
);

// API methods
export const pasteAPI = {
  create: async (data) => {
    return api.post('/pastes', data);
  },
  
  get: async (id, testNowMs = null) => {
    const headers = testNowMs ? { 'x-test-now-ms': testNowMs } : {};
    return api.get(`/pastes/${id}`, { headers });
  },
  
  health: async () => {
    return api.get('/healthz');
  },
};