import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {store} from '../store/store';
import { setTokens, logout } from '../store/slices/authSlice';
interface Tokens {
    access: string;
    refresh: string;
}

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
});

let isLoggingOut = false;

api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
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
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status == 401 && !originalRequest._retry && !isLoggingOut){
            originalRequest._retry = true;
            const state = store.getState();
            const tokens: Tokens | null = state.auth.tokens;

            if (tokens?.refresh) {
                try {
                    const response = await api.post<Tokens>(
                        '/api/token/refresh/',
                        {refresh: tokens.refresh}
                    );
                    const newTokens: Tokens = {
                        access: response.data.access,
                        refresh: tokens.refresh,
                    }
                    store.dispatch(setTokens(newTokens));
                    originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
                    return api(originalRequest);
                }
                catch (refreshError) {
                    isLoggingOut = true;
                    store.dispatch(logout());
                    return Promise.reject(refreshError);
                }
            } else {
                isLoggingOut = true;
                store.dispatch(logout());
                return Promise.reject(error);
            } 
        }
        return Promise.reject(error);
    }
)

export default api;