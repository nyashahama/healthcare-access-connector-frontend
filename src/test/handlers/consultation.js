import { rest } from "msw";

export const consultationHandlers = [
  rest.get(
    "*/api/v1/telemedicine/consultations/:id",
    (req, res, ctx) => {
      return res(
        ctx.json({
          id: req.params.id,
          patient_id: "p1",
          status: "in_progress",
          channel: "chat",
          created_at: "2024-01-15T10:00:00Z",
        })
      );
    }
  ),

  rest.get(
    "*/api/v1/telemedicine/consultations/:id/messages",
    (req, res, ctx) => {
      return res(
        ctx.json({
          messages: [
            {
              id: "m1",
              consultation_id: req.params.id,
              sender_role: "patient",
              content: "Hello doctor",
              message_type: "text",
              sent_at: "2024-01-15T10:05:00Z",
              is_read: true,
            },
            {
              id: "m2",
              consultation_id: req.params.id,
              sender_role: "provider_staff",
              content: "Hi, how can I help?",
              message_type: "text",
              sent_at: "2024-01-15T10:06:00Z",
              is_read: false,
            },
          ],
          count: 2,
          limit: 20,
          offset: 0,
        })
      );
    }
  ),
];
