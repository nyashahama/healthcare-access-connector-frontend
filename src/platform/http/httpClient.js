import axios from "axios";
import { normalizeHttpError } from "./httpError";

export const createHttpClient = ({ baseURL, getToken, onUnauthorized }) => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalized = normalizeHttpError(error);
      if (normalized.kind === "auth") {
        // Only trigger logout for genuine authentication failures,
        // not for 401s caused by missing resources or permissions.
        const msg = (normalized.message || "").toLowerCase();
        const isRealAuthFailure =
          msg.includes("invalid") ||
          msg.includes("expired") ||
          msg.includes("unauthorized") ||
          msg.includes("unauthenticated") ||
          msg.includes("token") ||
          msg.includes("sign in") ||
          msg.includes("login");
        if (isRealAuthFailure) {
          onUnauthorized?.(normalized);
        }
      }
      return Promise.reject(normalized);
    }
  );

  return client;
};
