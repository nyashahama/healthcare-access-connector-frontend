import apiClient from "api/apiClient";

/**
 * Patient Service
 * Handles all API calls related to patient profiles and operations
 */
const patientService = {
  /**
   * Create a new patient profile
   * @param {Object} data - Patient profile data
   * @param {string} data.user_id - User ID
   * @param {string} data.first_name - First name
   * @param {string} data.last_name - Last name
   * @param {string} data.country - Country
   * @param {string} data.preferred_communication_method - Preferred communication method
   * @param {string} data.timezone - Timezone
   * @returns {Promise<Object>} Created patient profile
   */
  createPatientProfile: async (data) => {
    const response = await apiClient.post("/api/v1/patients/patients", data);
    return response.data;
  },

  /**
   * Get patient profile by ID
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Patient profile
   */
  getPatientProfile: async (patientId) => {
    const response = await apiClient.get(
      `/api/v1/patients/patients/${patientId}`
    );
    return response.data;
  },

  /**
   * Get patient profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Patient profile
   */
  getPatientProfileByUserId: async (userId) => {
    const response = await apiClient.get(
      `/api/v1/patients/patients/user/${userId}`
    );
    return response.data;
  },

  /**
   * Get patient by national ID
   * @param {string} nationalId - National ID number
   * @returns {Promise<Object>} Patient profile
   */
  getPatientByNationalId: async (nationalId) => {
    const response = await apiClient.get(
      `/api/v1/patients/patients/national-id/${nationalId}`
    );
    return response.data;
  },

  /**
   * Update patient profile
   * @param {string} patientId - Patient ID
   * @param {Object} data - Updated patient data
   * @returns {Promise<Object>} Updated patient profile
   */
  updatePatientProfile: async (patientId, data) => {
    const response = await apiClient.put(
      `/api/v1/patients/patients/${patientId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete patient profile
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Success message
   */
  deletePatientProfile: async (patientId) => {
    const response = await apiClient.delete(
      `/api/v1/patients/patients/${patientId}`
    );
    return response.data;
  },

  /**
   * Delete patient profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message
   */
  deletePatientProfileByUserId: async (userId) => {
    const response = await apiClient.delete(
      `/api/v1/patients/patients/user/${userId}`
    );
    return response.data;
  },

  /**
   * Search patients with filters
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {string} params.province - Province filter
   * @param {string} params.city - City filter
   * @param {boolean} params.has_medical_aid - Has medical aid filter
   * @param {string} params.gender - Gender filter
   * @param {string} params.communication_method - Communication method filter
   * @param {string} params.employment_status - Employment status filter
   * @param {string} params.medical_aid_provider - Medical aid provider filter
   * @param {boolean} params.requires_interpreter - Requires interpreter filter
   * @param {boolean} params.accepts_marketing_emails - Accepts marketing emails filter
   * @param {number} params.limit - Results limit
   * @param {number} params.offset - Results offset
   * @returns {Promise<Object>} Search results
   */
  searchPatients: async (params) => {
    const queryParams = new URLSearchParams();

    // Add all defined parameters
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const response = await apiClient.get(
      `/api/v1/patients/patients/search?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get demographics summary
   * @returns {Promise<Object>} Demographics summary
   */
  getDemographicsSummary: async () => {
    const response = await apiClient.get(
      "/api/v1/patients/patients/demographics"
    );
    return response.data;
  },

  /**
   * Get patient profile for current user
   * @returns {Promise<Object>} Patient profile
   */
  getCurrentPatientProfile: async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("No user found in localStorage");
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error("User ID not found");
    }

    return patientService.getPatientProfileByUserId(user.id);
  },

  /**
   * Create or update patient profile for current user
   * @param {Object} data - Patient profile data
   * @returns {Promise<Object>} Created/updated patient profile
   */
  upsertPatientProfile: async (data) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("No user found in localStorage");
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error("User ID not found");
    }

    // Try to get existing profile
    try {
      const existing = await patientService.getPatientProfileByUserId(user.id);

      // If exists, update it
      const updated = await patientService.updatePatientProfile(existing.id, {
        ...data,
        user_id: user.id,
      });
      return updated;
    } catch (error) {
      // If not found, create new
      if (error.response?.status === 404) {
        const created = await patientService.createPatientProfile({
          ...data,
          user_id: user.id,
        });
        return created;
      }
      throw error;
    }
  },

  /**
   * Calculate profile completion percentage
   * @param {Object} profile - Patient profile
   * @returns {number} Completion percentage (0-100)
   */
  calculateProfileCompletion: (profile) => {
    if (!profile) return 0;

    const requiredFields = [
      "first_name",
      "last_name",
      "country",
      "preferred_communication_method",
      "timezone",
    ];

    const optionalFields = [
      "preferred_name",
      "date_of_birth",
      "gender",
      "preferred_gender_pronouns",
      "primary_address",
      "city",
      "province",
      "language_preferences",
      "home_language",
      "medical_aid_number",
      "medical_aid_provider",
      "national_id_number",
      "employment_status",
      "education_level",
      "household_income_range",
      "profile_picture_url",
    ];

    let completed = 0;
    let total = requiredFields.length + optionalFields.length * 0.5; // Optional fields count half

    // Check required fields
    requiredFields.forEach((field) => {
      if (
        profile[field] &&
        (typeof profile[field] === "string" ? profile[field].trim() : true)
      ) {
        completed += 1;
      }
    });

    // Check optional fields
    optionalFields.forEach((field) => {
      if (
        profile[field] &&
        (typeof profile[field] === "string" ? profile[field].trim() : true)
      ) {
        completed += 0.5;
      }
    });

    // Check for medical aid info if has_medical_aid is true
    if (profile.has_medical_aid) {
      if (profile.medical_aid_number && profile.medical_aid_number.trim())
        completed += 0.5;
      if (profile.medical_aid_provider && profile.medical_aid_provider.trim())
        completed += 0.5;
    }

    // Check arrays
    if (
      profile.language_preferences &&
      profile.language_preferences.length > 0
    ) {
      completed += 0.5;
    }

    return Math.min(Math.round((completed / total) * 100), 100);
  },

  /**
   * Validate patient profile data
   * @param {Object} data - Patient profile data
   * @returns {Object} Validation result with isValid and errors
   */
  validatePatientProfile: (data) => {
    const errors = {};

    // Required fields
    if (!data.first_name?.trim()) {
      errors.first_name = "First name is required";
    }

    if (!data.last_name?.trim()) {
      errors.last_name = "Last name is required";
    }

    if (!data.country?.trim()) {
      errors.country = "Country is required";
    }

    if (!data.preferred_communication_method?.trim()) {
      errors.preferred_communication_method =
        "Preferred communication method is required";
    }

    if (!data.timezone?.trim()) {
      errors.timezone = "Timezone is required";
    }

    // Validate national ID if provided
    if (data.national_id_number && data.national_id_number.length < 13) {
      errors.national_id_number = "National ID must be at least 13 characters";
    }

    // Validate medical aid info if has_medical_aid is true
    if (data.has_medical_aid) {
      if (!data.medical_aid_number?.trim()) {
        errors.medical_aid_number =
          "Medical aid number is required when has medical aid is selected";
      }
      if (!data.medical_aid_provider?.trim()) {
        errors.medical_aid_provider =
          "Medical aid provider is required when has medical aid is selected";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export default patientService;
