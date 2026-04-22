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
        onUnauthorized?.(normalized);
      }
      return Promise.reject(normalized);
    }
  );

  return client;
};
