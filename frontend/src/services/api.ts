import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { store } from "@/store";
import { logout, updateTokens } from "@/store/auth/authSlice";

type RefreshResponse = {
  access: string;
  refresh?: string;
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => store.getState().auth.tokens?.access || null;
const getRefreshToken = () => store.getState().auth.tokens?.refresh || null;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const access = getAccessToken();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      store.dispatch(logout());
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const resp = await axios.post<RefreshResponse>(
        `${BASE_URL}/api/v1/auth/token/refresh/`,
        { refresh }
      );

      const newAccess = resp.data.access;

      store.dispatch(
        updateTokens({
          access: newAccess,
          refresh,
        })
      );

      api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

      processQueue(null, newAccess);

      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      store.dispatch(logout());
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
