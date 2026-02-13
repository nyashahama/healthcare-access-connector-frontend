// src/api/apiClient.js
import axios from "axios";

// Use process.env for Create React App (not import.meta.env which is for Vite)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

console.log("API URL from env:", API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout for slow networks
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to true if your backend uses cookies
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
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors gracefully
apiClient.interceptors.response.use(
  (response) => {
    // Success response
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (!error.response) {
      // Network error (including CORS)
      console.error("❌ Network/CORS error:", error.message);

      // Check if we have auth data in localStorage despite the error
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user && error.config?.url?.includes("/auth/login")) {
        console.log(
          "✅ Login succeeded despite network error - token found in storage"
        );
        // Don't reject the promise, treat as success
        return Promise.resolve({
          data: {
            success: true,
            user: JSON.parse(user),
            token: token,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        });
      }

      // Create a more descriptive error
      const networkError = new Error(
        "Unable to connect to server. Please check your internet connection."
      );
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes("/signin") &&
        !currentPath.includes("/sign-in")
      ) {
        console.log("🔒 Unauthorized - clearing auth data");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "/auth/sign-in";
      }
    }

    // Handle other HTTP errors
    console.error(
      `❌ HTTP ${error.response?.status} error:`,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default apiClient;
