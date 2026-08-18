import axios from 'axios';

// In-memory cache for fast idempotent GET requests
const getCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 6000; // 6 seconds memory cache for high-frequency navigation

export const clearApiCache = () => {
  getCache.clear();
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // include HttpOnly auth cookie
  timeout: 12000,
});

// Cache & Deduplication interceptor
api.interceptors.request.use((config) => {
  // Clear cache on any data mutating method
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    getCache.clear();
  }
  return config;
}, (error) => Promise.reject(error));

// Wrap api.get with fast micro-cache & deduplication
const originalGet = api.get.bind(api);
api.get = (url, config = {}) => {
  const skipCache = config.skipCache || false;
  const cacheKey = `${url}_${JSON.stringify(config.params || {})}`;

  if (!skipCache) {
    const cached = getCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return Promise.resolve(cached.response);
    }

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }
  }

  const promise = originalGet(url, config)
    .then((response) => {
      if (!skipCache && response.status === 200) {
        getCache.set(cacheKey, {
          timestamp: Date.now(),
          response: { ...response, data: response.data },
        });
      }
      return response;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  if (!skipCache) {
    inFlightRequests.set(cacheKey, promise);
  }

  return promise;
};

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

