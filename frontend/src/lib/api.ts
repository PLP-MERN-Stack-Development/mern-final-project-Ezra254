import axios, { type AxiosAdapter } from 'axios';
import { handleDemoRequest } from '../mocks/demoData';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

const demoAdapter: AxiosAdapter = async (config) => {
  const payload =
    typeof config.data === 'string' && config.data.length > 0 ? JSON.parse(config.data) : config.data;
  const response = await handleDemoRequest({
    method: config.method ?? 'get',
    url: config.url,
    data: payload,
    params: config.params,
  });

  return {
    data: response.data,
    status: response.status,
    statusText: 'OK',
    headers: {},
    config,
    request: {},
  };
};

export const api = axios.create({
  baseURL,
  withCredentials: !isDemoMode,
  adapter: isDemoMode ? demoAdapter : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (!isDemoMode) {
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
}

