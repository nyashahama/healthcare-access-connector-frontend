import consultationService from "api/services/consultationService";
import { useCallback, useState } from "react";

/**
 * Custom hook for consultation operations.
 *
 * Identity is always derived from the JWT on the backend — the frontend
 * never sends patient_id, user_id, or staff_id in request bodies.
 */
export const useConsultation = () => {
  const [loading, setLoading] = useState(false);
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

  // ─── Patient actions ────────────────────────────────────────────────────

  const requestConsultation = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure identity fields are not sent
      const { patient_id, ...cleanPayload } = data;
      const response = await consultationService.requestConsultation(
        cleanPayload
      );
      setCurrentConsultation(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to request consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchPatientActiveConsultation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.getPatientActiveConsultation();
      setActiveConsultation(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      // 404 is expected when no active consultation — treat as null, not error
      if (err.response?.status === 404) {
        setActiveConsultation(null);
        setLoading(false);
        return { success: true, data: null };
      }
      const msg =
        err.response?.data?.error || "Failed to fetch active consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchPatientConsultations = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.getPatientConsultations(
        params
      );
      setConsultations(response.consultations || []);
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      });
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to load patient consultations";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const cancelConsultation = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await consultationService.cancelConsultation(
          consultationId
        );
        if (currentConsultation?.id === consultationId) {
          setCurrentConsultation(response);
        }
        if (activeConsultation?.id === consultationId) {
          setActiveConsultation(null);
        }
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to cancel consultation";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [currentConsultation, activeConsultation]
  );

  const submitPatientRating = useCallback(async (consultationId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.submitPatientRating(
        consultationId,
        data
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to submit rating";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Shared actions ─────────────────────────────────────────────────────

  const fetchConsultationByID = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.getConsultationByID(
        consultationId
      );
      setCurrentConsultation(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchConsultationWithDetails = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.getConsultationWithDetails(
        consultationId
      );
      setCurrentConsultation(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch consultation details";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const updateConsultationChannel = useCallback(
    async (consultationId, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await consultationService.updateConsultationChannel(
          consultationId,
          data
        );
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to update channel";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    []
  );

  // ─── Provider actions ───────────────────────────────────────────────────

  const acceptConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.acceptConsultation(
        consultationId
      );
      // Optionally update waiting room and active list
      setWaitingRoom((prev) => prev.filter((c) => c.id !== consultationId));
      setProviderActiveConsultations((prev) => [...prev, response]);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to accept consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const startConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.startConsultation(
        consultationId
      );
      setProviderActiveConsultations((prev) =>
        prev.map((c) => (c.id === consultationId ? response : c))
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to start consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const completeConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.completeConsultation(
        consultationId
      );
      setProviderActiveConsultations((prev) =>
        prev.filter((c) => c.id !== consultationId)
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to complete consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const escalateConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.escalateConsultation(
        consultationId
      );
      setProviderActiveConsultations((prev) =>
        prev.map((c) => (c.id === consultationId ? response : c))
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to escalate consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const declineConsultation = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.declineConsultation(
        consultationId
      );
      setWaitingRoom((prev) => prev.filter((c) => c.id !== consultationId));
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to decline consultation";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const markNoShow = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.markNoShow(consultationId);
      setProviderActiveConsultations((prev) =>
        prev.filter((c) => c.id !== consultationId)
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to mark no-show";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchProviderActiveConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await consultationService.getProviderActiveConsultations();
      setProviderActiveConsultations(response.consultations || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Failed to fetch provider active consultations";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchProviderConsultationHistory = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.getProviderConsultationHistory(
        params
      );
      setProviderHistory(response.consultations || []);
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      });
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch provider history";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchWaitingRoom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.getWaitingRoom();
      setWaitingRoom(response.entries || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch waiting room";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Billing / admin actions ────────────────────────────────────────────

  const updatePaymentStatus = useCallback(async (consultationId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.updatePaymentStatus(
        consultationId,
        data
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to update payment status";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const linkFollowUpAppointment = useCallback(async (consultationId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationService.linkFollowUpAppointment(
        consultationId,
        data
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to link follow-up";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Clear helpers ──────────────────────────────────────────────────────

  const clearConsultations = useCallback(() => {
    setConsultations([]);
    setCurrentConsultation(null);
    setActiveConsultation(null);
    setWaitingRoom([]);
    setProviderActiveConsultations([]);
    setProviderHistory([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
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
