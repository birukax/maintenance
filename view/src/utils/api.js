import axios from "axios";
import { store } from "../store/store";
import { setTokens } from "../store/authSlice";

const api = axios.create({
    baseURL: 'http://localhost:8000',
})

api.interceptors.request.use(
    (config) => {
        const { tokens } = store.getState().auth;
        if (tokens?.access) {
            config.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const { tokens } = store.getState().auth;
            if (tokens?.refresh) {
                try {
                    const response = await api.post('/api/token/refresh/',
                        { refresh: tokens.refresh, });
                    const newTokens = { access: response.data.access, refresh: tokens.refresh };
                    store.dispatch(setTokens(newTokens));
                    originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    store.dispatch({ type: 'auth/logout' });
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
)



export default api