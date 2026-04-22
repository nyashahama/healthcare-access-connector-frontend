import { rest } from "msw";

export const createPatientHandlers = () => {
  let profileCompletion = 30;
  let shouldReturn401 = false;

  return {
    handlers: [
      rest.get("*/api/v1/patients/patients/me", (req, res, ctx) => {
        if (shouldReturn401) {
          return res(
            ctx.status(401),
            ctx.json({ error: "Unauthorized" })
          );
        }
        return res(
          ctx.json({
            id: "p1",
            user_id: "u1",
            first_name: "Amina",
            last_name: "Dube",
            date_of_birth: "1990-05-15",
            gender: "female",
            phone: "+1234567890",
            address: "123 Main St",
            city: "Harare",
            country: "Zimbabwe",
            emergency_contact_name: "John Dube",
            emergency_contact_phone: "+0987654321",
            medical_conditions: ["hypertension"],
            allergies: ["penicillin"],
            blood_type: "O+",
            profile_completion: profileCompletion,
          })
        );
      }),
    ],
    setProfileCompletion: (value) => {
      profileCompletion = value;
    },
    setReturn401: (value) => {
      shouldReturn401 = value;
    },
  };
};

export const patientHandlers = createPatientHandlers();
