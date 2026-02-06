import apiClient from "../apiClient";

const appointmentService = {
  // Create appointment (already exists)
  bookAppointment: async (data) => {
    const response = await apiClient.post(
      "/api/v1/appointments/appointments",
      data
    );
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    const response = await apiClient.get(
      `/api/v1/appointments/appointments/${id}`
    );
    return response.data;
  },

  // Get appointments by patient
  getAppointmentsByPatient: async (patientId) => {
    const response = await apiClient.get(
      `/api/v1/appointments/appointments/patient/${patientId}`
    );
    return response.data;
  },

  // Get appointments by clinic
  getAppointmentsByClinic: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/appointments/appointments/clinic/${clinicId}`
    );
    return response.data;
  },

  // Get appointments by clinic and date
  getAppointmentsByClinicAndDate: async (clinicId, date) => {
    const response = await apiClient.get(
      `/api/v1/appointments/appointments/clinic/${clinicId}/date/${date}`
    );
    return response.data;
  },

  // Get today's appointments
  getTodayAppointments: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/appointments/appointments/clinic/${clinicId}/today`
    );
    return response.data;
  },

  // Get pending appointments
  getPendingAppointments: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/appointments/appointments/clinic/${clinicId}/pending`
    );
    return response.data;
  },

  // Reschedule appointment
  rescheduleAppointment: async (id, data) => {
    const response = await apiClient.put(
      `/api/v1/appointments/appointments/${id}/reschedule`,
      data
    );
    return response.data;
  },

  // Confirm appointment
  confirmAppointment: async (id, data) => {
    const response = await apiClient.put(
      `/api/v1/appointments/appointments/${id}/confirm`,
      data
    );
    return response.data;
  },

  // Update appointment notes
  updateAppointmentNotes: async (id, data) => {
    const response = await apiClient.put(
      `/api/v1/appointments/appointments/${id}/notes`,
      data
    );
    return response.data;
  },

  // Complete appointment
  completeAppointment: async (id) => {
    const response = await apiClient.put(
      `/api/v1/appointments/appointments/${id}/complete`
    );
    return response.data;
  },

  // Cancel appointment
  cancelAppointment: async (id, data) => {
    const response = await apiClient.put(
      `/api/v1/appointments/appointments/${id}/cancel`,
      data
    );
    return response.data;
  },

  // Update appointment status
  updateAppointmentStatus: async (id, data) => {
    const response = await apiClient.put(
      `/api/v1/appointments/appointments/${id}/status`,
      data
    );
    return response.data;
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await apiClient.delete(
      `/api/v1/appointments/appointments/${id}`
    );
    return response.data;
  },

  // Get appointment count for patient
  getAppointmentCount: async (patientId) => {
    const response = await apiClient.get(
      `/api/v1/appointments/appointments/patient/${patientId}/count`
    );
    return response.data;
  },
};

export default appointmentService;
