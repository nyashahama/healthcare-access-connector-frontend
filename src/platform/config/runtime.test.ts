import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

describe("getRuntimeConfig", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("throws when VITE_API_URL is missing outside tests", async () => {
    vi.stubEnv("MODE", "development");
    vi.stubEnv("VITE_API_URL", "");
    delete process.env.VITE_API_URL;

    await expect(async () => {
      const { getRuntimeConfig } = await import("./runtime");
      getRuntimeConfig();
    }).rejects.toThrow(/VITE_API_URL/);

    vi.unstubAllEnvs();
  });
});
