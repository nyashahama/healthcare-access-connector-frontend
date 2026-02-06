import appointmentService from "api/services/appointmentService";
import { useCallback, useState, useEffect } from "react";

/**
 * Custom hook for appointment operations
 * @returns {Object} Appointment methods and state
 */
export const useAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(0);

  // Appointment Operations

  const bookAppointment = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.bookAppointment(data);
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to book appointment";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getAppointmentById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.getAppointmentById(id);
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch appointment";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getAppointmentsByPatient = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.getAppointmentsByPatient(
        patientId
      );
      setAppointments(response.appointments || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch patient appointments";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getAppointmentsByClinic = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.getAppointmentsByClinic(
        clinicId
      );
      setAppointments(response.appointments || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch clinic appointments";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getAppointmentsByClinicAndDate = useCallback(async (clinicId, date) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.getAppointmentsByClinicAndDate(
        clinicId,
        date
      );
      setAppointments(response.appointments || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch appointments";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getTodayAppointments = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.getTodayAppointments(clinicId);
      setAppointments(response.appointments || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch today's appointments";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getPendingAppointments = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.getPendingAppointments(
        clinicId
      );
      setAppointments(response.appointments || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch pending appointments";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const rescheduleAppointment = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.rescheduleAppointment(id, data);
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to reschedule appointment";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const confirmAppointment = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.confirmAppointment(id, data);
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to confirm appointment";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateAppointmentNotes = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.updateAppointmentNotes(
        id,
        data
      );
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to update appointment notes";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const completeAppointment = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.completeAppointment(id);
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to complete appointment";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const cancelAppointment = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.cancelAppointment(id, data);
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to cancel appointment";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.updateAppointmentStatus(
        id,
        data
      );
      setAppointment(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to update appointment status";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteAppointment = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await appointmentService.deleteAppointment(id);
      setAppointment(null);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to delete appointment";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getAppointmentCount = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await appointmentService.getAppointmentCount(patientId);
      setAppointmentCount(response.count);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch appointment count";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAppointmentState = useCallback(() => {
    setAppointment(null);
    setAppointments([]);
    setAppointmentCount(0);
    setError(null);
  }, []);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  return {
    // Appointment CRUD Methods
    bookAppointment,
    getAppointmentById,
    getAppointmentsByPatient,
    getAppointmentsByClinic,
    getAppointmentsByClinicAndDate,
    getTodayAppointments,
    getPendingAppointments,

    // Appointment Action Methods
    rescheduleAppointment,
    confirmAppointment,
    updateAppointmentNotes,
    completeAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    deleteAppointment,

    // Utility Methods
    getAppointmentCount,
    clearError,
    clearAppointmentState,

    // State
    loading,
    error,
    appointment,
    appointments,
    appointmentCount,

    // Derived State
    hasAppointment: !!appointment,
    hasAppointments: appointments.length > 0,
  };
};
