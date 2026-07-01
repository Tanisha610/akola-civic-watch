import axios from 'axios';

export const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const apiOrigin = apiBaseUrl.replace(/\/api\/?$/, '');

export const resolveApiAssetUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${apiOrigin}${value.startsWith('/') ? '' : '/'}${value}`;
};

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('acw-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('acw-token');
      localStorage.removeItem('acw-user');
    }

    return Promise.reject(error);
  }
);

export default api;
