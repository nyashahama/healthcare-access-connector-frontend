import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8089";

console.log("API URL from env:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're already redirecting to prevent multiple redirects
let isRedirecting = false;

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

      const isAuthPage =
        currentPath.includes("/auth/") ||
        currentPath.includes("/signin") ||
        currentPath.includes("/sign-in") ||
        currentPath.includes("/signup") ||
        currentPath.includes("/sign-up");

      const isLogoutRequest = error.config?.url?.includes("/logout");

      if (!isAuthPage && !isLogoutRequest && !isRedirecting) {
        // Set flag to prevent multiple redirects
        isRedirecting = true;

        // Clear auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");

        // Redirect to signin
        window.location.href = "/auth/sign-in";

        // Reset flag after redirect
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
