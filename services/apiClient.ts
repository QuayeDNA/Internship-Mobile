import axios from "axios";
import { API_BASE_URL } from "../constants/api";
import { AppError } from "../types";
import { parseApiError } from "../utils/error.utils";
import {
    deleteAccessToken,
    deleteRefreshToken,
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
} from "../utils/token.utils";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor to attach token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      if (config.headers) {
        (config.headers as any)["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
  config: any;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.config.headers["Authorization"] = `Bearer ${token}`;
      prom.resolve(apiClient(prom.config));
    }
  });
  failedQueue = [];
};

// response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // attempt refresh token
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          const resp = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { headers: { "Content-Type": "application/json" } },
          );
          const newToken = resp.data.access_token;
          await saveAccessToken(newToken);
          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        }
      } catch (err) {
        processQueue(err, null);
        // fall through to logout logic below
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      // clear stored tokens and optionally redirect -- intercept a logout event
      await deleteAccessToken();
      await deleteRefreshToken();
      // we can't dispatch here; the app should handle 401 globally maybe via context/event
      // For now, just show alert and navigate to login by external handler
      // Optionally use Linking or navigation event
    }

    const parsed: AppError = parseApiError(error);
    return Promise.reject(parsed);
  },
);

export default apiClient;
