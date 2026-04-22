import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import symptomCheckerService from "api/services/symptomCheckerService";
import { queryKeys } from "platform/query/queryKeys";

/**
 * Custom hook for symptom checker operations.
 *
 * Identity (patient_id, user_id) is NEVER included in the payload sent from
 * the frontend — the backend derives both from the validated JWT on every
 * request. The hook only sends clinical data.
 */
export const useSymptomChecker = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active query keys for cache observation
  const [activeSessionKey, setActiveSessionKey] = useState(null);
  const [activeSessionsKey, setActiveSessionsKey] = useState(null);
  const [activeEligibleKey, setActiveEligibleKey] = useState(null);

  // Query observers
  const sessionQuery = useQuery({
    queryKey: activeSessionKey || queryKeys.symptom.data,
    enabled: false,
  });

  const sessionsQuery = useQuery({
    queryKey: activeSessionsKey || queryKeys.symptom.history,
    enabled: false,
  });

  const eligibleQuery = useQuery({
    queryKey: activeEligibleKey || ["symptoms", "eligible"],
    enabled: false,
  });

  // Derived state from queries
  const currentSession = sessionQuery.data || null;
  const sessions = sessionsQuery.data?.sessions || [];
  const eligibleSession = eligibleQuery.data || null;

  // ========== Mutations ==========
  const submitSessionMutation = useMutation({
    mutationFn: symptomCheckerService.submitSession,
    onSuccess: (data) => {
      queryClient.setQueryData([...queryKeys.symptom.data, data.id], data);
      queryClient.invalidateQueries({ queryKey: queryKeys.symptom.history });
    },
  });

  const abandonSessionMutation = useMutation({
    mutationFn: symptomCheckerService.abandonSession,
    onSuccess: (_data, sessionId) => {
      queryClient.setQueryData(
        [...queryKeys.symptom.data, sessionId],
        (old) => (old ? { ...old, status: "abandoned" } : old)
      );
    },
  });

  // ─── Submit a new session ────────────────────────────────────────────────────
  const submitSession = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        // Client-side guard — real validation lives on the backend
        if (!data.chief_complaint?.trim()) {
          throw new Error("Chief complaint is required");
        }
        if (!data.symptoms_reported?.length) {
          throw new Error("At least one symptom is required");
        }
        if (data.is_for_dependent && !data.dependent_id) {
          throw new Error(
            "Dependent ID is required when session is for a dependent"
          );
        }

        // Strip any stale patient_id / user_id fields that may have crept in
        // from old code paths — the backend rejects them anyway and uses the JWT.
        const { patient_id: _pid, user_id: _uid, ...cleanPayload } = data;

        const response = await submitSessionMutation.mutateAsync(cleanPayload);
        setActiveSessionKey([...queryKeys.symptom.data, response.id]);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Failed to submit symptom session";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [submitSessionMutation]
  );

  // ─── Fetch a single session by ID ────────────────────────────────────────────
  const fetchSession = useCallback(
    async (sessionId) => {
      const key = [...queryKeys.symptom.data, sessionId];
      setLoading(true);
      setError(null);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => symptomCheckerService.getSessionById(sessionId),
        });
        setActiveSessionKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load session";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ─── Abandon a session ───────────────────────────────────────────────────────
  // No patient_id in body — backend resolves identity from JWT.
  const abandonSession = useCallback(
    async (sessionId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await abandonSessionMutation.mutateAsync(sessionId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to abandon session";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [abandonSessionMutation]
  );

  // ─── Fetch the authenticated patient's own sessions ──────────────────────────
  // Route is now /patients/me/sessions — no patientId in the URL.
  const fetchPatientSessions = useCallback(
    async (params = {}) => {
      const key = [...queryKeys.symptom.history, JSON.stringify(params)];
      setLoading(true);
      setError(null);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => symptomCheckerService.getPatientSessions(params),
        });
        setActiveSessionsKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load sessions";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ─── Fetch the latest eligible session ──────────────────────────────────────
  const fetchEligibleSession = useCallback(
    async () => {
      const key = ["symptoms", "eligible"];
      setLoading(true);
      setError(null);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => symptomCheckerService.getLatestEligibleSession(),
        });
        setActiveEligibleKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load eligible session";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ─── Fetch sessions for a specific dependent ─────────────────────────────────
  // Route is /patients/me/dependents/{dependentId}/sessions
  const fetchDependentSessions = useCallback(
    async (dependentId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["symptoms", "dependent", dependentId],
          queryFn: () =>
            symptomCheckerService.getDependentSessions(dependentId),
        });
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load dependent sessions";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ─── Admin: sessions by triage level ────────────────────────────────────────
  const fetchSessionsByTriageLevel = useCallback(
    async (params) => {
      const key = [...queryKeys.symptom.history, "triage", JSON.stringify(params)];
      setLoading(true);
      setError(null);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () =>
            symptomCheckerService.getSessionsByTriageLevel(params),
        });
        setActiveSessionsKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load sessions by triage";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ─── Admin: outcome counts ───────────────────────────────────────────────────
  const fetchOutcomeCounts = useCallback(
    async (params) => {
      setLoading(true);
      setError(null);

      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["symptoms", "outcomes", JSON.stringify(params)],
          queryFn: () =>
            symptomCheckerService.countSessionsByOutcome(params),
        });
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load outcome counts";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ─── Clear helpers ───────────────────────────────────────────────────────────
  const clearSessions = useCallback(() => {
    setActiveSessionKey(null);
    setActiveSessionsKey(null);
    setActiveEligibleKey(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Methods
    submitSession,
    fetchSession,
    abandonSession,
    fetchPatientSessions,
    fetchEligibleSession,
    fetchDependentSessions,
    fetchSessionsByTriageLevel,
    fetchOutcomeCounts,
    clearSessions,
    clearError,

    // State
    loading,
    error,
    sessions,
    currentSession,
    eligibleSession,

    // Derived
    hasSessions: sessions.length > 0,
    hasCurrentSession: !!currentSession,
  };
};
