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

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear token and redirect if not already on signin page
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes("/signin") &&
        !currentPath.includes("/sign-in")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "/auth/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
