describe("getRuntimeConfig", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("throws when REACT_APP_API_URL is missing outside tests", () => {
    process.env.NODE_ENV = "development";
    delete process.env.REACT_APP_API_URL;

    expect(() => require("./runtime").getRuntimeConfig()).toThrow(
      /REACT_APP_API_URL/
    );
  });
});
