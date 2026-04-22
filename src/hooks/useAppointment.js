import appointmentService from "api/services/appointmentService";
import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "platform/query/queryKeys";

/**
 * Custom hook for appointment operations
 * @returns {Object} Appointment methods and state
 */
export const useAppointment = () => {
  const queryClient = useQueryClient();

  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = useCallback(() => setLoadingCount((c) => c + 1), []);
  const stopLoading = useCallback(() => setLoadingCount((c) => Math.max(0, c - 1)), []);
  const loading = loadingCount > 0;

  // Query parameter states for useQuery hooks with enabled: false
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);
  const [activePatientId, setActivePatientId] = useState(null);
  const [activeClinicId, setActiveClinicId] = useState(null);
  const [activeClinicDate, setActiveClinicDate] = useState({ clinicId: null, date: null });
  const [activeTodayClinicId, setActiveTodayClinicId] = useState(null);
  const [activePendingClinicId, setActivePendingClinicId] = useState(null);
  const [activeCountPatientId, setActiveCountPatientId] = useState(null);

  // useQuery hooks with enabled: false (for cache registration only)
  useQuery({
    queryKey: queryKeys.appointment.detail(activeAppointmentId),
    queryFn: () => appointmentService.getAppointmentById(activeAppointmentId),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.appointment.list, { patientId: activePatientId }],
    queryFn: () => appointmentService.getAppointmentsByPatient(activePatientId),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.appointment.list, { clinicId: activeClinicId }],
    queryFn: () => appointmentService.getAppointmentsByClinic(activeClinicId),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.appointment.list, { clinicId: activeClinicDate.clinicId, date: activeClinicDate.date }],
    queryFn: () =>
      appointmentService.getAppointmentsByClinicAndDate(activeClinicDate.clinicId, activeClinicDate.date),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.appointment.today, { clinicId: activeTodayClinicId }],
    queryFn: () => appointmentService.getTodayAppointments(activeTodayClinicId),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.appointment.pending, { clinicId: activePendingClinicId }],
    queryFn: () => appointmentService.getPendingAppointments(activePendingClinicId),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.appointment.list, "count", { patientId: activeCountPatientId }],
    queryFn: () => appointmentService.getAppointmentCount(activeCountPatientId),
    enabled: false,
  });

  // Mutations
  const bookMutation = useMutation({
    mutationFn: (data) => appointmentService.bookAppointment(data),
    onSuccess: (data) => {
      setAppointment(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.rescheduleAppointment(id, data),
    onSuccess: (data) => {
      setAppointment(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) });
      }
    },
  });

  const confirmMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.confirmAppointment(id, data),
    onSuccess: (data) => {
      setAppointment(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) });
      }
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.updateAppointmentNotes(id, data),
    onSuccess: (data) => {
      setAppointment(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) });
      }
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id) => appointmentService.completeAppointment(id),
    onSuccess: (data) => {
      setAppointment(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) });
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.cancelAppointment(id, data),
    onSuccess: (data) => {
      setAppointment(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) });
      }
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.updateAppointmentStatus(id, data),
    onSuccess: (data) => {
      setAppointment(data);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      setAppointment(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending });
    },
  });

  // Appointment Operations

  const bookAppointment = async (data) => {
    startLoading();
    setError(null);
    try {
      const response = await bookMutation.mutateAsync(data);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to book appointment";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const getAppointmentById = async (id) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.appointment.detail(id),
        queryFn: () => appointmentService.getAppointmentById(id),
      });
      setAppointment(response);
      setActiveAppointmentId(id);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch appointment";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const getAppointmentsByPatient = async (patientId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, { patientId }],
        queryFn: () => appointmentService.getAppointmentsByPatient(patientId),
      });
      setAppointments(response.appointments || []);
      setActivePatientId(patientId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch patient appointments";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const getAppointmentsByClinic = async (clinicId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, { clinicId }],
        queryFn: () => appointmentService.getAppointmentsByClinic(clinicId),
      });
      setAppointments(response.appointments || []);
      setActiveClinicId(clinicId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch clinic appointments";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const getAppointmentsByClinicAndDate = async (clinicId, date) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, { clinicId, date }],
        queryFn: () => appointmentService.getAppointmentsByClinicAndDate(clinicId, date),
      });
      setAppointments(response.appointments || []);
      setActiveClinicDate({ clinicId, date });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch appointments";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const getTodayAppointments = async (clinicId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.today, { clinicId }],
        queryFn: () => appointmentService.getTodayAppointments(clinicId),
      });
      setTodayAppointments(response.appointments || []);
      setActiveTodayClinicId(clinicId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch today's appointments";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const getPendingAppointments = async (clinicId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.pending, { clinicId }],
        queryFn: () => appointmentService.getPendingAppointments(clinicId),
      });
      setPendingAppointments(response.appointments || []);
      setActivePendingClinicId(clinicId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch pending appointments";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const rescheduleAppointment = async (id, data) => {
    startLoading();
    setError(null);
    try {
      const response = await rescheduleMutation.mutateAsync({ id, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to reschedule appointment";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const confirmAppointment = async (id, data) => {
    startLoading();
    setError(null);
    try {
      const response = await confirmMutation.mutateAsync({ id, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to confirm appointment";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const updateAppointmentNotes = async (id, data) => {
    startLoading();
    setError(null);
    try {
      const response = await updateNotesMutation.mutateAsync({ id, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to update appointment notes";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const completeAppointment = async (id) => {
    startLoading();
    setError(null);
    try {
      const response = await completeMutation.mutateAsync(id);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to complete appointment";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const cancelAppointment = async (id, data) => {
    startLoading();
    setError(null);
    try {
      const response = await cancelMutation.mutateAsync({ id, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to cancel appointment";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const updateAppointmentStatus = async (id, data) => {
    startLoading();
    setError(null);
    try {
      const response = await updateStatusMutation.mutateAsync({ id, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to update appointment status";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const deleteAppointment = async (id) => {
    startLoading();
    setError(null);
    try {
      await deleteMutation.mutateAsync(id);
      stopLoading();
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to delete appointment";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const getAppointmentCount = async (patientId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, "count", { patientId }],
        queryFn: () => appointmentService.getAppointmentCount(patientId),
      });
      setAppointmentCount(response.count);
      setActiveCountPatientId(patientId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch appointment count";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  const clearError = useCallback(() => {
    setError(null);
    bookMutation.reset();
    rescheduleMutation.reset();
    confirmMutation.reset();
    updateNotesMutation.reset();
    completeMutation.reset();
    cancelMutation.reset();
    updateStatusMutation.reset();
    deleteMutation.reset();
  }, [bookMutation, rescheduleMutation, confirmMutation, updateNotesMutation, completeMutation, cancelMutation, updateStatusMutation, deleteMutation]);

  const clearAppointmentState = useCallback(() => {
    setAppointment(null);
    setAppointments([]);
    setAppointmentCount(0);
    setTodayAppointments([]);
    setPendingAppointments([]);
    setError(null);
    setActiveAppointmentId(null);
    setActivePatientId(null);
    setActiveClinicId(null);
    setActiveClinicDate({ clinicId: null, date: null });
    setActiveTodayClinicId(null);
    setActivePendingClinicId(null);
    setActiveCountPatientId(null);
    bookMutation.reset();
    rescheduleMutation.reset();
    confirmMutation.reset();
    updateNotesMutation.reset();
    completeMutation.reset();
    cancelMutation.reset();
    updateStatusMutation.reset();
    deleteMutation.reset();
  }, [bookMutation, rescheduleMutation, confirmMutation, updateNotesMutation, completeMutation, cancelMutation, updateStatusMutation, deleteMutation]);

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
    todayAppointments,
    pendingAppointments,

    // Derived State
    hasAppointment: !!appointment,
    hasAppointments: appointments.length > 0,
    hasTodayAppointments: todayAppointments.length > 0,
    hasPendingAppointments: pendingAppointments.length > 0,
  };
};
