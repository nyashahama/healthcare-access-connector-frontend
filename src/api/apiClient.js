// src/api/apiClient.js
import axios from "axios";

// Use process.env for Create React App (not import.meta.env which is for Vite)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089";

console.log("API URL from env:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Don't redirect if:
      // 1. Already on an auth page
      // 2. The request was a logout attempt (which can fail if session already expired)
      const isAuthPage =
        currentPath.includes("/auth/") ||
        currentPath.includes("/signin") ||
        currentPath.includes("/sign-in") ||
        currentPath.includes("/signup") ||
        currentPath.includes("/sign-up");

      const isLogoutRequest = error.config?.url?.includes("/logout");

      if (!isAuthPage && !isLogoutRequest) {
        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");

        // Redirect to signin
        window.location.href = "/auth/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
