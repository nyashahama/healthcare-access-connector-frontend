import apiClient from "../apiClient";

const providerService = {
  // Clinic routes
  registerClinic: async (data) => {
    const response = await apiClient.post("/api/v1/providers/clinics", data);
    return response.data;
  },

  getClinic: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}`
    );
    return response.data;
  },

  getClinics: async () => {
    const response = await apiClient.get("/api/v1/providers/clinics");
    return response.data;
  },

  updateClinic: async (clinicId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/clinics/${clinicId}`,
      data
    );
    return response.data;
  },

  deleteClinic: async (clinicId) => {
    const response = await apiClient.delete(
      `/api/v1/providers/clinics/${clinicId}`
    );
    return response.data;
  },

  verifyClinic: async (clinicId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/clinics/${clinicId}/verify`,
      data
    );
    return response.data;
  },

  updateVerifyClinic: async (clinicId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/clinics/${clinicId}/verification-status`,
      data
    );
    return response.data;
  },

  // Staff routes
  registerStaff: async (data) => {
    const response = await apiClient.post("/api/v1/providers/staff", data);
    return response.data;
  },

  getStaff: async (staffId) => {
    const response = await apiClient.get(`/api/v1/providers/staff/${staffId}`);
    return response.data;
  },

  updateStaff: async (staffId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/staff/${staffId}`,
      data
    );
    return response.data;
  },

  deleteStaff: async (staffId) => {
    const response = await apiClient.delete(
      `/api/v1/providers/staff/${staffId}`
    );
    return response.data;
  },

  checkStaffStatus: async (staffId) => {
    const response = await apiClient.get(
      `/api/v1/providers/staff/${staffId}/exists`
    );
    return response.data;
  },

  // Clinic-specific staff routes
  listClinicStaff: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}/staff`
    );
    return response.data;
  },

  listActiveClinicStaff: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}/staff/active`
    );
    return response.data;
  },

  // Service routes
  registerService: async (data) => {
    const response = await apiClient.post("/api/v1/providers/services", data);
    return response.data;
  },

  getService: async (serviceId) => {
    const response = await apiClient.get(
      `/api/v1/providers/services/${serviceId}`
    );
    return response.data;
  },

  updateService: async (serviceId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/services/${serviceId}`,
      data
    );
    return response.data;
  },

  deleteService: async (serviceId) => {
    const response = await apiClient.delete(
      `/api/v1/providers/services/${serviceId}`
    );
    return response.data;
  },

  checkServiceExists: async (serviceId) => {
    const response = await apiClient.get(
      `/api/v1/providers/services/${serviceId}/exists`
    );
    return response.data;
  },

  // Clinic-specific service routes
  getClinicService: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}/services`
    );
    return response.data;
  },

  // Credential routes
  registerCredential: async (data) => {
    const response = await apiClient.post(
      "/api/v1/providers/credentials/",
      data
    );
    return response.data;
  },

  deleteCredential: async (credentialId) => {
    const response = await apiClient.delete(
      `/api/v1/providers/credentials/${credentialId}`
    );
    return response.data;
  },

  // Staff-specific credential routes
  getStaffCredential: async (staffId) => {
    const response = await apiClient.get(
      `/api/v1/providers/staff/${staffId}/credentials`
    );
    return response.data;
  },
};

export default providerService;
