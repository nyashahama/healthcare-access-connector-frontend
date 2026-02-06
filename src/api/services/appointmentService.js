import apiClient from "../apiClient";

const appointmentSerice = {
  bookAppointment: async (data) => {
    const response = await apiClient.post(
      "/api/v1/appointments/appointments",
      data
    );
    return response.data;
  },
};

export default appointmentSerice;
