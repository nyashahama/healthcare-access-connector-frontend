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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAppointmentState = useCallback(() => {
    setAppointment(null);
    setAppointments([]);
    setError(null);
  }, []);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  return {
    // Appointment Methods
    bookAppointment,

    // Utility Methods
    clearError,
    clearAppointmentState,

    // State
    loading,
    error,
    appointment,
    appointments,

    // Derived State
    hasAppointment: !!appointment,
    hasAppointments: appointments.length > 0,
  };
};
