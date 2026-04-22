import { rest } from "msw";

export const createProviderHandlers = () => {
  let hasClinic = false;

  return {
    handlers: [
      rest.get("*/api/v1/providers/clinics/my-clinic", (req, res, ctx) => {
        if (!hasClinic) {
          return res(
            ctx.status(404),
            ctx.json({ error: "Clinic not found" })
          );
        }
        return res(
          ctx.json({
            clinic: {
              id: "c1",
              name: "City Clinic",
              address: "456 Clinic Ave",
              city: "Harare",
              country: "Zimbabwe",
            },
          })
        );
      }),
    ],
    setHasClinic: (value) => {
      hasClinic = value;
    },
  };
};

export const providerHandlers = createProviderHandlers();
