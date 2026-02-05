import providerService from "api/services/providerService";
import { useCallback, useState, useEffect } from "react";

/**
 * Custom hook for provider operations
 * @returns {Object} Provider methods and state
 */
export const useProvider = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [clinics, setClinics] = useState(null);
  const [staff, setStaff] = useState(null);
  const [service, setService] = useState(null);
  const [credential, setCredential] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  // Clinic Operations

  const registerClinic = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.registerClinic(data);
      setClinic(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to register clinic";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getClinic = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.getClinic(clinicId);
      setClinic(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to load clinic";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getClinics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.getClinics();
      // Handle nested data structure: response.data.data.clinics
      const clinicsData =
        response.data?.data?.clinics || response.data?.clinics || [];
      setClinics(Array.isArray(clinicsData) ? clinicsData : []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load clinics";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateClinic = useCallback(async (clinicId, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.updateClinic(clinicId, data);
      setClinic(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update clinic";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteClinic = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      await providerService.deleteClinic(clinicId);
      setClinic(null);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete clinic";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const verifyClinic = useCallback(async (clinicId, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.verifyClinic(clinicId, data);
      setClinic(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to verify clinic";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateVerifyClinic = useCallback(async (clinicId, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.updateVerifyClinic(clinicId, data);
      setClinic(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update clinic verification";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Staff Operations

  const registerStaff = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.registerStaff(data);
      setStaff(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to register staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStaff = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.getStaff(staffId);
      setStaff(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to load staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateStaff = useCallback(async (staffId, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.updateStaff(staffId, data);
      setStaff(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteStaff = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);

    try {
      await providerService.deleteStaff(staffId);
      setStaff(null);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const checkStaffStatus = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.checkStaffStatus(staffId);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to check staff status";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const listClinicStaff = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.listClinicStaff(clinicId);
      setStaffList(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to list clinic staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const listActiveClinicStaff = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.listActiveClinicStaff(clinicId);
      setStaffList(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to list active clinic staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Service Operations

  const registerService = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.registerService(data);
      setService(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to register service";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getService = useCallback(async (serviceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.getService(serviceId);
      setService(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load service";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateService = useCallback(async (serviceId, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.updateService(serviceId, data);
      setService(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update service";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteService = useCallback(async (serviceId) => {
    setLoading(true);
    setError(null);

    try {
      await providerService.deleteService(serviceId);
      setService(null);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete service";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const checkServiceExists = useCallback(async (serviceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.getService(serviceId);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to check service existence";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getClinicService = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.getClinicService(clinicId);
      setServiceList(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load clinic services";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Credential Operations

  const registerCredential = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.registerCredential(data);
      setCredential(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to register credential";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteCredential = useCallback(async (credentialId) => {
    setLoading(true);
    setError(null);

    try {
      await providerService.deleteCredential(credentialId);
      setCredential(null);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete credential";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStaffCredential = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await providerService.getStaffCredential(staffId);
      setCredential(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load staff credential";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Utility Methods

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearProviderState = useCallback(() => {
    setClinic(null);
    setStaff(null);
    setService(null);
    setCredential(null);
    setStaffList([]);
    setServiceList([]);
    setError(null);
  }, []);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  return {
    // Clinic Methods
    registerClinic,
    getClinic,
    getClinics,
    updateClinic,
    deleteClinic,
    verifyClinic,
    updateVerifyClinic,

    // Staff Methods
    registerStaff,
    getStaff,
    updateStaff,
    deleteStaff,
    checkStaffStatus,
    listClinicStaff,
    listActiveClinicStaff,

    // Service Methods
    registerService,
    getService,
    updateService,
    deleteService,
    checkServiceExists,
    getClinicService,

    // Credential Methods
    registerCredential,
    deleteCredential,
    getStaffCredential,

    // Utility Methods
    clearError,
    clearProviderState,

    // State
    loading,
    error,
    clinic,
    clinics,
    staff,
    service,
    credential,
    staffList,
    serviceList,

    // Derived State
    hasClinic: !!clinic,
    hasStaff: !!staff,
    hasService: !!service,
    hasCredential: !!credential,
    hasStaffList: staffList.length > 0,
    hasServiceList: serviceList.length > 0,
  };
};
