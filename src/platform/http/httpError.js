export const normalizeHttpError = (error) => {
  if (!error.response) {
    return {
      kind: "network",
      status: 0,
      message: "Unable to reach the server",
      cause: error,
    };
  }

  const status = error.response.status;
  const message = error.response.data?.error || error.message;

  if (status === 401) return { kind: "auth", status, message, cause: error };
  if (status === 403) return { kind: "forbidden", status, message, cause: error };
  if (status === 404) return { kind: "not_found", status, message, cause: error };
  if (status === 409) return { kind: "conflict", status, message, cause: error };
  if (status === 422) return { kind: "validation", status, message, cause: error };

  return { kind: "server", status, message, cause: error };
};
