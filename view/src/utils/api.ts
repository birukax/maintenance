import axios, { type AxiosInstance, AxiosResponse, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { store } from '../store/store';
import { setTokens, logout } from '../store/slices/authSlice';
interface Tokens {
  access: string;
  refresh: string;
}

interface OriginalRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
const api: AxiosInstance = axios.create({
  baseURL: '/api'
  // baseURL: 'http://localhost:8009',
  // baseURL: 'http://localhost:8000',
});

let isLoggingOut = false;

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const tokens: Tokens | null = state.auth.tokens;
    if (tokens?.access) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  }, (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error?.config as OriginalRequestConfig;
    if (error?.response?.status == 401 && !originalRequest._retry && !isLoggingOut) {
      originalRequest._retry = true;
      isLoggingOut = true;

      try {
        const state = store.getState();
        const tokens: Tokens | null = state.auth.tokens;

        if (tokens?.refresh) {
          const response = await api.post<Tokens>('/api/token/refresh/', {
            refresh: tokens.refresh,
          });

          const newTokens: Tokens = {
            access: response.data.access,
            refresh: tokens.refresh,
          };

          store.dispatch(setTokens(newTokens));

          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

          isLoggingOut = false;

          return api(originalRequest);
        } else {
          store.dispatch(logout());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        isLoggingOut = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;