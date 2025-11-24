import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login') &&
      !error.config?._retry
    ) {
      error.config._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

