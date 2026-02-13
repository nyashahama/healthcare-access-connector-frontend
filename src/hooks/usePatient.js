import patientService from "api/services/patientService";
import { useCallback, useState } from "react";

/**
 * Custom hook for patient operations
 * @returns {Object} Patient methods and state
 */
export const usePatient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Create patient profile
  const createPatientProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = patientService.validatePatientProfile(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await patientService.createPatientProfile(data);
      setPatient(response);
      setProfileCompletion(patientService.calculateProfileCompletion(response));
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to create patient profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get patient profile by ID
  const getPatientProfile = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await patientService.getPatientProfile(patientId);
      setPatient(response);
      setProfileCompletion(patientService.calculateProfileCompletion(response));
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load patient profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get patient profile by user ID
  const getPatientProfileByUserId = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await patientService.getPatientProfileByUserId(userId);
      setPatient(response);
      setProfileCompletion(patientService.calculateProfileCompletion(response));
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load patient profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get current patient profile (based on logged-in user)
  const getCurrentPatientProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await patientService.getCurrentPatientProfile();
      setPatient(response);
      setProfileCompletion(patientService.calculateProfileCompletion(response));
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to load patient profile";
      setError(errorMessage);
      setLoading(false);
      // Don't set patient to null here, as 404 is expected for new users
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update patient profile
  const updatePatientProfile = useCallback(async (patientId, data) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = patientService.validatePatientProfile(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await patientService.updatePatientProfile(
        patientId,
        data
      );
      setPatient(response);
      setProfileCompletion(patientService.calculateProfileCompletion(response));
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update patient profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete patient profile
  const deletePatientProfile = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);

    try {
      await patientService.deletePatientProfile(patientId);
      setPatient(null);
      setProfileCompletion(0);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete patient profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Search patients
  const searchPatients = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await patientService.searchPatients(params);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to search patients";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get demographics summary
  const getDemographicsSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await patientService.getDemographicsSummary();
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load demographics summary";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Create or update patient profile (upsert)
  const upsertPatientProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = patientService.validatePatientProfile(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await patientService.upsertPatientProfile(data);
      setPatient(response);
      setProfileCompletion(patientService.calculateProfileCompletion(response));
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to save patient profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Validate patient data
  const validatePatientData = useCallback((data) => {
    return patientService.validatePatientProfile(data);
  }, []);

  // Calculate profile completion
  const calculateProfileCompletion = useCallback((profileData) => {
    return patientService.calculateProfileCompletion(profileData);
  }, []);

  // Clear patient state
  const clearPatient = useCallback(() => {
    setPatient(null);
    setProfileCompletion(0);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // REMOVED: Auto-load useEffect that was causing infinite loops
  // Components should manually call getCurrentPatientProfile when needed

  return {
    // Methods
    createPatientProfile,
    getPatientProfile,
    getPatientProfileByUserId,
    getCurrentPatientProfile,
    updatePatientProfile,
    deletePatientProfile,
    searchPatients,
    getDemographicsSummary,
    upsertPatientProfile,
    validatePatientData,
    calculateProfileCompletion,
    clearPatient,
    clearError,

    // State
    loading,
    error,
    patient,
    profileCompletion,

    // Derived state
    hasPatient: !!patient,
    isProfileComplete: profileCompletion >= 80, // Consider 80% as complete
  };
};
