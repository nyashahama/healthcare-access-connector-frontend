import { rest } from "msw";
import type { RestHandler } from "msw";

interface CreateProviderHandlersReturn {
  handlers: RestHandler[];
  setHasClinic: (value: boolean) => void;
}

export const createProviderHandlers = (): CreateProviderHandlersReturn => {
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
    setHasClinic: (value: boolean) => {
      hasClinic = value;
    },
  };
};

export const providerHandlers = createProviderHandlers();
