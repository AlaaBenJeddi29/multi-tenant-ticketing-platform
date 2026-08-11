import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Track in-flight refresh request to prevent race conditions
let refreshPromise: Promise<void> | null = null;

/**
 * Response interceptor to handle 401 errors with automatic token refresh
 * 
 * On any 401 response (except from auth endpoints):
 * 1. Attempts POST /auth/refresh once
 * 2. If refresh succeeds, retries the original request
 * 3. If refresh fails, rejects with original error
 * 
 * Multiple concurrent 401s share a single refresh attempt to prevent races.
 */
api.interceptors.response.use(
  // Success response - pass through
  (response) => response,
  
  // Error response - handle 401 with refresh logic
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't attempt refresh for auth endpoints themselves
    const url = originalRequest?.url || "";
    const isAuthEndpoint = 
      url.includes("/auth/login") || 
      url.includes("/auth/register") || 
      url.includes("/auth/refresh");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Don't retry if we've already attempted refresh for this request
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Mark this request as being retried
    originalRequest._retry = true;

    try {
      // If a refresh is already in progress, wait for it
      // Otherwise, start a new refresh attempt
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then(() => {
            // Refresh successful
            refreshPromise = null;
          })
          .catch((refreshError) => {
            // Refresh failed
            refreshPromise = null;
            throw refreshError;
          });
      }

      // Wait for the refresh to complete
      await refreshPromise;

      // Refresh succeeded - retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed - reject with the original 401 error
      // This lets normal error handling (e.g., RequireAuth) take over
      return Promise.reject(error);
    }
  }
);
