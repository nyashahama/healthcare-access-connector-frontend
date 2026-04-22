import consultationService from "api/services/consultationService";
import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "platform/query/queryKeys";

/**
 * Custom hook for consultation operations.
 *
 * Identity is always derived from the JWT on the backend — the frontend
 * never sends patient_id, user_id, or staff_id in request bodies.
 */
export const useConsultation = () => {
  const queryClient = useQueryClient();

  const [loadingCount, setLoadingCount] = useState(0);
  const startLoading = useCallback(() => setLoadingCount((c) => c + 1), []);
  const stopLoading = useCallback(() => setLoadingCount((c) => Math.max(0, c - 1)), []);
  const loading = loadingCount > 0;

  const [error, setError] = useState(null);

  const [consultations, setConsultations] = useState([]); // patient history
  const [currentConsultation, setCurrentConsultation] = useState(null);
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [waitingRoom, setWaitingRoom] = useState([]);
  const [providerActiveConsultations, setProviderActiveConsultations] =
    useState([]);
  const [providerHistory, setProviderHistory] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  });

  // Dynamic key states for useQuery hooks with enabled: false
  const [activeDetailId, setActiveDetailId] = useState(null);
  const [activePatientListParams, setActivePatientListParams] = useState({});
  const [activeProviderHistoryParams, setActiveProviderHistoryParams] = useState({});

  // useQuery hooks with enabled: false
  useQuery({
    queryKey: queryKeys.consultation.active,
    queryFn: async () => {
      try {
        return await consultationService.getPatientActiveConsultation();
      } catch (err) {
        // 404 is expected when no active consultation — treat as null, not error
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.consultation.list, activePatientListParams],
    queryFn: () => consultationService.getPatientConsultations(activePatientListParams),
    enabled: false,
  });

  useQuery({
    queryKey: queryKeys.consultation.detail(activeDetailId),
    queryFn: () => consultationService.getConsultationByID(activeDetailId),
    enabled: false,
  });

  useQuery({
    queryKey: ["consultations", "provider", "active"],
    queryFn: () => consultationService.getProviderActiveConsultations(),
    enabled: false,
  });

  useQuery({
    queryKey: ["consultations", "provider", "history", activeProviderHistoryParams],
    queryFn: () => consultationService.getProviderConsultationHistory(activeProviderHistoryParams),
    enabled: false,
  });

  useQuery({
    queryKey: ["consultations", "waitingRoom"],
    queryFn: () => consultationService.getWaitingRoom(),
    enabled: false,
  });

  // Mutations
  const requestConsultationMutation = useMutation({
    mutationFn: (data) => {
      const { patient_id, ...cleanPayload } = data;
      return consultationService.requestConsultation(cleanPayload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(data.id) });
      }
    },
  });

  const cancelConsultationMutation = useMutation({
    mutationFn: (consultationId) => consultationService.cancelConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.active });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const submitPatientRatingMutation = useMutation({
    mutationFn: ({ consultationId, data }) =>
      consultationService.submitPatientRating(consultationId, data),
    onSuccess: (data, { consultationId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list });
    },
  });

  const updateConsultationChannelMutation = useMutation({
    mutationFn: ({ consultationId, data }) =>
      consultationService.updateConsultationChannel(consultationId, data),
    onSuccess: (data, { consultationId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const acceptConsultationMutation = useMutation({
    mutationFn: (consultationId) => consultationService.acceptConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "waitingRoom"] });
      queryClient.invalidateQueries({ queryKey: ["consultations", "provider", "active"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const startConsultationMutation = useMutation({
    mutationFn: (consultationId) => consultationService.startConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "provider", "active"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const completeConsultationMutation = useMutation({
    mutationFn: (consultationId) => consultationService.completeConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "provider", "active"] });
      queryClient.invalidateQueries({ queryKey: ["consultations", "provider", "history"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list });
    },
  });

  const escalateConsultationMutation = useMutation({
    mutationFn: (consultationId) => consultationService.escalateConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "provider", "active"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const declineConsultationMutation = useMutation({
    mutationFn: (consultationId) => consultationService.declineConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "waitingRoom"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const markNoShowMutation = useMutation({
    mutationFn: (consultationId) => consultationService.markNoShow(consultationId),
    onSuccess: (data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ["consultations", "provider", "active"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ consultationId, data }) =>
      consultationService.updatePaymentStatus(consultationId, data),
    onSuccess: (data, { consultationId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  const linkFollowUpAppointmentMutation = useMutation({
    mutationFn: ({ consultationId, data }) =>
      consultationService.linkFollowUpAppointment(consultationId, data),
    onSuccess: (data, { consultationId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) });
    },
  });

  // ─── Patient actions ────────────────────────────────────────────────────

  const requestConsultation = async (data) => {
    startLoading();
    setError(null);
    try {
      const response = await requestConsultationMutation.mutateAsync(data);
      setCurrentConsultation(response);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to request consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const fetchPatientActiveConsultation = async () => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.consultation.active,
        queryFn: async () => {
          try {
            return await consultationService.getPatientActiveConsultation();
          } catch (err) {
            if (err.response?.status === 404) return null;
            throw err;
          }
        },
      });
      setActiveConsultation(response);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch active consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const fetchPatientConsultations = async (params = {}) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.consultation.list, params],
        queryFn: () => consultationService.getPatientConsultations(params),
      });
      setConsultations(response.consultations || []);
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      });
      setActivePatientListParams(params);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to load patient consultations";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const cancelConsultation = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await cancelConsultationMutation.mutateAsync(consultationId);
      if (currentConsultation?.id === consultationId) {
        setCurrentConsultation(response);
      }
      if (activeConsultation?.id === consultationId) {
        setActiveConsultation(null);
      }
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to cancel consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const submitPatientRating = async (consultationId, data) => {
    startLoading();
    setError(null);
    try {
      const response = await submitPatientRatingMutation.mutateAsync({ consultationId, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to submit rating";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  // ─── Shared actions ─────────────────────────────────────────────────────

  const fetchConsultationByID = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.consultation.detail(consultationId),
        queryFn: () => consultationService.getConsultationByID(consultationId),
      });
      setCurrentConsultation(response);
      setActiveDetailId(consultationId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const fetchConsultationWithDetails = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.consultation.detail(consultationId),
        queryFn: () =>
          consultationService.getConsultationWithDetails(consultationId),
      });
      setCurrentConsultation(response);
      setActiveDetailId(consultationId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch consultation details";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const updateConsultationChannel = async (consultationId, data) => {
    startLoading();
    setError(null);
    try {
      const response = await updateConsultationChannelMutation.mutateAsync({ consultationId, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to update channel";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  // ─── Provider actions ───────────────────────────────────────────────────

  const acceptConsultation = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await acceptConsultationMutation.mutateAsync(consultationId);
      setWaitingRoom((prev) => prev.filter((c) => c.id !== consultationId));
      setProviderActiveConsultations((prev) => [...prev, response]);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to accept consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const startConsultation = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await startConsultationMutation.mutateAsync(consultationId);
      setProviderActiveConsultations((prev) =>
        prev.map((c) => (c.id === consultationId ? response : c))
      );
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to start consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const completeConsultation = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await completeConsultationMutation.mutateAsync(consultationId);
      setProviderActiveConsultations((prev) =>
        prev.filter((c) => c.id !== consultationId)
      );
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to complete consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const escalateConsultation = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await escalateConsultationMutation.mutateAsync(consultationId);
      setProviderActiveConsultations((prev) =>
        prev.map((c) => (c.id === consultationId ? response : c))
      );
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to escalate consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const declineConsultation = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await declineConsultationMutation.mutateAsync(consultationId);
      setWaitingRoom((prev) => prev.filter((c) => c.id !== consultationId));
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to decline consultation";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const markNoShow = async (consultationId) => {
    startLoading();
    setError(null);
    try {
      const response = await markNoShowMutation.mutateAsync(consultationId);
      setProviderActiveConsultations((prev) =>
        prev.filter((c) => c.id !== consultationId)
      );
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to mark no-show";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const fetchProviderActiveConsultations = async () => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["consultations", "provider", "active"],
        queryFn: () => consultationService.getProviderActiveConsultations(),
      });
      setProviderActiveConsultations(response.consultations || []);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Failed to fetch provider active consultations";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const fetchProviderConsultationHistory = async (params = {}) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["consultations", "provider", "history", params],
        queryFn: () => consultationService.getProviderConsultationHistory(params),
      });
      setProviderHistory(response.consultations || []);
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      });
      setActiveProviderHistoryParams(params);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch provider history";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const fetchWaitingRoom = async () => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["consultations", "waitingRoom"],
        queryFn: () => consultationService.getWaitingRoom(),
      });
      setWaitingRoom(response.entries || []);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch waiting room";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  // ─── Billing / admin actions ────────────────────────────────────────────

  const updatePaymentStatus = async (consultationId, data) => {
    startLoading();
    setError(null);
    try {
      const response = await updatePaymentStatusMutation.mutateAsync({ consultationId, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to update payment status";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  const linkFollowUpAppointment = async (consultationId, data) => {
    startLoading();
    setError(null);
    try {
      const response = await linkFollowUpAppointmentMutation.mutateAsync({ consultationId, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to link follow-up";
      setError(msg);
      stopLoading();
      return { success: false, error: msg };
    }
  };

  // ─── Clear helpers ──────────────────────────────────────────────────────

  const clearConsultations = useCallback(() => {
    setConsultations([]);
    setCurrentConsultation(null);
    setActiveConsultation(null);
    setWaitingRoom([]);
    setProviderActiveConsultations([]);
    setProviderHistory([]);
    setError(null);
    setActiveDetailId(null);
    setActivePatientListParams({});
    setActiveProviderHistoryParams({});
    requestConsultationMutation.reset();
    cancelConsultationMutation.reset();
    submitPatientRatingMutation.reset();
    updateConsultationChannelMutation.reset();
    acceptConsultationMutation.reset();
    startConsultationMutation.reset();
    completeConsultationMutation.reset();
    escalateConsultationMutation.reset();
    declineConsultationMutation.reset();
    markNoShowMutation.reset();
    updatePaymentStatusMutation.reset();
    linkFollowUpAppointmentMutation.reset();
  }, [
    requestConsultationMutation,
    cancelConsultationMutation,
    submitPatientRatingMutation,
    updateConsultationChannelMutation,
    acceptConsultationMutation,
    startConsultationMutation,
    completeConsultationMutation,
    escalateConsultationMutation,
    declineConsultationMutation,
    markNoShowMutation,
    updatePaymentStatusMutation,
    linkFollowUpAppointmentMutation,
  ]);

  const clearError = useCallback(() => {
    setError(null);
    requestConsultationMutation.reset();
    cancelConsultationMutation.reset();
    submitPatientRatingMutation.reset();
    updateConsultationChannelMutation.reset();
    acceptConsultationMutation.reset();
    startConsultationMutation.reset();
    completeConsultationMutation.reset();
    escalateConsultationMutation.reset();
    declineConsultationMutation.reset();
    markNoShowMutation.reset();
    updatePaymentStatusMutation.reset();
    linkFollowUpAppointmentMutation.reset();
  }, [
    requestConsultationMutation,
    cancelConsultationMutation,
    submitPatientRatingMutation,
    updateConsultationChannelMutation,
    acceptConsultationMutation,
    startConsultationMutation,
    completeConsultationMutation,
    escalateConsultationMutation,
    declineConsultationMutation,
    markNoShowMutation,
    updatePaymentStatusMutation,
    linkFollowUpAppointmentMutation,
  ]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  return {
    // Methods
    requestConsultation,
    fetchPatientActiveConsultation,
    fetchPatientConsultations,
    cancelConsultation,
    submitPatientRating,
    fetchConsultationByID,
    fetchConsultationWithDetails,
    updateConsultationChannel,
    acceptConsultation,
    startConsultation,
    completeConsultation,
    escalateConsultation,
    declineConsultation,
    markNoShow,
    fetchProviderActiveConsultations,
    fetchProviderConsultationHistory,
    fetchWaitingRoom,
    updatePaymentStatus,
    linkFollowUpAppointment,
    clearConsultations,
    clearError,

    // State
    loading,
    error,
    consultations,
    currentConsultation,
    activeConsultation,
    waitingRoom,
    providerActiveConsultations,
    providerHistory,
    pagination,

    // Derived
    hasConsultations: consultations.length > 0,
    hasActiveConsultation: !!activeConsultation,
    hasWaitingRoomEntries: waitingRoom.length > 0,
    hasProviderActive: providerActiveConsultations.length > 0,
  };
};
