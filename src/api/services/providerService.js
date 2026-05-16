import apiClient from "../apiClient";

const CLINIC_TYPE_ALIASES = {
  private: "private_clinic",
  public: "public_health_clinic",
  community: "community_health_center",
  mobile: "mobile_clinic",
};

const normalizeClinicPayload = (data = {}) => {
  const { operating_hours, ...rest } = data;
  const payload = {
    ...rest,
    clinic_type: CLINIC_TYPE_ALIASES[data.clinic_type] || data.clinic_type,
    accepts_medical_aid: Boolean(data.accepts_medical_aid),
  };

  if (operating_hours && typeof operating_hours === "object") {
    payload.operating_hours = operating_hours;
  }

  return payload;
};

const normalizeStaffPayload = (data = {}) => {
  const payload = {
    ...data,
    staff_role: data.staff_role || data.role,
    work_email: data.work_email || data.email,
    work_phone: data.work_phone || data.phone_number,
    employment_status: data.employment_status || data.status || "active",
  };

  delete payload.role;
  delete payload.email;
  delete payload.phone_number;
  delete payload.status;
  return payload;
};

const normalizeServicePayload = (data = {}) => ({
  ...data,
  cost_currency: data.cost_currency || "ZAR",
  follow_up_required: Boolean(data.follow_up_required),
  is_covered_by_medical_aid: Boolean(data.is_covered_by_medical_aid),
  is_active: data.is_active !== undefined ? data.is_active : true,
  requires_appointment:
    data.requires_appointment !== undefined ? data.requires_appointment : true,
  walk_in_allowed: Boolean(data.walk_in_allowed),
});

const normalizeStaff = (staff = {}) => ({
  ...staff,
  staff_id: staff.staff_id || staff.id,
  role: staff.role || staff.staff_role,
  email: staff.email || staff.work_email,
  phone_number: staff.phone_number || staff.work_phone || staff.personal_phone,
  status: staff.status || staff.employment_status || "active",
});

const normalizeService = (service = {}) => ({
  ...service,
  service_id: service.service_id || service.id,
});

const normalizeStaffList = (payload = {}) => ({
  ...payload,
  staff: (payload.staff || []).map(normalizeStaff),
});

const normalizeServiceList = (payload = {}) => ({
  ...payload,
  services: (payload.services || []).map(normalizeService),
});

const normalizeVerificationPayload = (dataOrUserId, notes) => {
  if (typeof dataOrUserId === "object" && dataOrUserId !== null) {
    return {
      verified_by: dataOrUserId.verified_by,
      notes:
        dataOrUserId.notes ||
        dataOrUserId.rejection_reason ||
        dataOrUserId.status ||
        "Clinic verification reviewed",
      status: dataOrUserId.status || dataOrUserId.verification_status,
    };
  }

  return {
    verified_by: dataOrUserId,
    notes: notes || "Clinic verified",
    status: "verified",
  };
};

const providerService = {
  // Clinic routes
  registerClinic: async (data) => {
    const response = await apiClient.post(
      "/api/v1/providers/clinics",
      normalizeClinicPayload(data)
    );
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

  /**
   * Get the current user's clinic
   * @returns {Promise<Object>} Current user's clinic data
   */
  getMyClinic: async () => {
    const response = await apiClient.get("/api/v1/providers/clinics/my-clinic");
    return response.data;
  },

  updateClinic: async (clinicId, data) => {
    let existing = {};
    try {
      const response = await apiClient.get(
        `/api/v1/providers/clinics/${clinicId}`
      );
      existing = response.data || {};
    } catch {
      existing = {};
    }

    const response = await apiClient.put(
      `/api/v1/providers/clinics/${clinicId}`,
      normalizeClinicPayload({ ...existing, ...data })
    );
    return response.data;
  },

  deleteClinic: async (clinicId) => {
    const response = await apiClient.delete(
      `/api/v1/providers/clinics/${clinicId}`
    );
    return response.data;
  },

  verifyClinic: async (clinicId, data, notes) => {
    const payload = normalizeVerificationPayload(data, notes);
    const response = await apiClient.put(
      `/api/v1/providers/clinics/${clinicId}/verify`,
      {
        verified_by: payload.verified_by,
        notes: payload.notes,
      }
    );
    return response.data;
  },

  updateVerifyClinic: async (clinicId, data) => {
    const payload = normalizeVerificationPayload(data);
    if (payload.status === "rejected") {
      throw new Error("Clinic rejection is not supported by the backend API");
    }
    return providerService.verifyClinic(clinicId, payload);
  },

  // Staff routes
  registerStaff: async (data) => {
    const response = await apiClient.post(
      "/api/v1/providers/staff",
      normalizeStaffPayload(data)
    );
    return normalizeStaff(response.data);
  },

  getStaff: async (staffId) => {
    const response = await apiClient.get(`/api/v1/providers/staff/${staffId}`);
    return normalizeStaff(response.data);
  },

  updateStaff: async (staffId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/staff/${staffId}`,
      normalizeStaffPayload(data)
    );
    return normalizeStaff(response.data);
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
    return normalizeStaffList(response.data);
  },

  listActiveClinicStaff: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}/staff/active`
    );
    return normalizeStaffList(response.data);
  },

  // Service routes
  registerService: async (data) => {
    const response = await apiClient.post(
      "/api/v1/providers/services",
      normalizeServicePayload(data)
    );
    return normalizeService(response.data);
  },

  getService: async (serviceId) => {
    const response = await apiClient.get(
      `/api/v1/providers/services/${serviceId}`
    );
    return normalizeService(response.data);
  },

  updateService: async (serviceId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/services/${serviceId}`,
      normalizeServicePayload(data)
    );
    return normalizeService(response.data);
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
    return normalizeServiceList(response.data);
  },

  // Credential routes
  registerCredential: async (data) => {
    const response = await apiClient.post(
      "/api/v1/providers/credentials",
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
