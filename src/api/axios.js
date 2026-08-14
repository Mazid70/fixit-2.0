import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fixit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for friendly error handling and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (
        window.location.pathname.startsWith('/dashboard') ||
        window.location.pathname.startsWith('/profile')
      ) {
        localStorage.removeItem('fixit_token');
        localStorage.removeItem('fixit_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
