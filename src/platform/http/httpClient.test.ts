import { describe, it, expect, vi } from 'vitest';
import MockAdapter from "axios-mock-adapter";
import { createHttpClient } from "./httpClient";

describe("http client", () => {
  it("returns normalized auth errors instead of redirecting the browser", async () => {
    const client = createHttpClient({
      baseURL: "http://localhost:8080",
      getToken: () => "expired-token",
      onUnauthorized: vi.fn(),
    });

    const mock = new MockAdapter(client as never);
    mock.onGet("/protected").reply(401, { error: "unauthorized" });

    await expect(client.get("/protected")).rejects.toMatchObject({
      kind: "auth",
      status: 401,
    });
  });
});
