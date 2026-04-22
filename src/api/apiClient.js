import { getRuntimeConfig } from "platform/config/runtime";
import { createHttpClient } from "platform/http/httpClient";
import { sessionManager } from "platform/auth/sessionManager";

const { apiUrl } = getRuntimeConfig();

const apiClient = createHttpClient({
  baseURL: apiUrl,
  getToken: () => sessionManager.hydrate().token,
  onUnauthorized: () => sessionManager.handleUnauthorized(),
});

export default apiClient;
