import type { RestHandler } from "msw";
import { authHandlers } from "./auth";
import { patientHandlers } from "./patient";
import { providerHandlers } from "./provider";
import { consultationHandlers } from "./consultation";

export const handlers: RestHandler[] = [
  ...authHandlers.handlers,
  ...patientHandlers.handlers,
  ...providerHandlers.handlers,
  ...consultationHandlers,
];

export { authHandlers, patientHandlers, providerHandlers };
