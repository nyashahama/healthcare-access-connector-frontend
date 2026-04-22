const requiredKeys = ["REACT_APP_API_URL"];

export const getRuntimeConfig = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const wsUrl =
    process.env.REACT_APP_WS_URL ||
    (apiUrl ? apiUrl.replace(/^http/, "ws") : "ws://localhost:8080");

  if (process.env.NODE_ENV !== "test") {
    requiredKeys.forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    });
  }

  return {
    apiUrl: apiUrl || "http://localhost:8080",
    wsUrl,
    environment:
      process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development",
  };
};
