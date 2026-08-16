import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // include HttpOnly auth cookie
});
// We rely on HttpOnly cookie for auth; do not read token from localStorage
api.interceptors.request.use((config) => config, (error) => Promise.reject(error));

// Response interceptor for friendly error handling and token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, notify the app to clear any in-memory user state
      try {
        window.dispatchEvent(new Event('fixit:unauthorized'));
      } catch { }
    }
    return Promise.reject(error);
  }
);

export default api;
