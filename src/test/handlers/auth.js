import { rest } from "msw";

export const createAuthHandlers = () => {
  let shouldLoginSucceed = true;

  return {
    handlers: [
      rest.post("*/api/v1/auth/login", (req, res, ctx) => {
        if (!shouldLoginSucceed) {
          return res(
            ctx.status(401),
            ctx.json({ error: "Invalid credentials" })
          );
        }
        return res(
          ctx.json({
            token: "test-token-abc123",
            user: {
              id: "u1",
              email: "test@example.com",
              role: "patient",
              first_name: "Test",
              last_name: "User",
            },
            expires_at: "2099-01-01T00:00:00Z",
          })
        );
      }),

      rest.post("*/api/v1/auth/logout", (req, res, ctx) => {
        return res(ctx.status(204));
      }),
    ],
    setLoginSuccess: (value) => {
      shouldLoginSucceed = value;
    },
  };
};

export const authHandlers = createAuthHandlers();
