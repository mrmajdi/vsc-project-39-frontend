import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authStr = localStorage.getItem('petshop-auth');
      if (authStr) {
        try {
          const { token } = JSON.parse(authStr);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (e) {
          // Invalid JSON, ignore token
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by clearing auth and redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('petshop-auth');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
