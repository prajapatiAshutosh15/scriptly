import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

function getStoredAuth() {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('devblog-auth');
    if (stored) return JSON.parse(stored).state || {};
  } catch {}
  return {};
}

// Request interceptor — attach JWT access token
api.interceptors.request.use((config) => {
  const { token } = getStoredAuth();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if we're currently refreshing to avoid infinite loops
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

// Response interceptor — unwrap data, handle 401 with token refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we have a refresh token, try refreshing
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      const { refreshToken } = getStoredAuth();

      if (refreshToken && !originalRequest.url?.includes('/auth/refresh')) {
        if (isRefreshing) {
          // Queue this request until refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken: newToken, refreshToken: newRefresh } = res.data.data;

          // Update store
          const stored = JSON.parse(localStorage.getItem('devblog-auth') || '{}');
          if (stored.state) {
            stored.state.token = newToken;
            stored.state.refreshToken = newRefresh;
            localStorage.setItem('devblog-auth', JSON.stringify(stored));
          }

          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          localStorage.removeItem('devblog-auth');
          window.dispatchEvent(new Event('auth-logout'));
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // No refresh token — just logout
      localStorage.removeItem('devblog-auth');
      window.dispatchEvent(new Event('auth-logout'));
    }

    return Promise.reject(error.response?.data || { error: { message: error.message } });
  }
);

export default api;
