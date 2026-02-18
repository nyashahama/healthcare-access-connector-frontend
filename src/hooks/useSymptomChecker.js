import symptomCheckerService from "api/services/symptomCheckerService";
import { useCallback, useState } from "react";

/**
 * Custom hook for symptom checker operations.
 *
 * Identity (patient_id, user_id) is NEVER included in the payload sent from
 * the frontend — the backend derives both from the validated JWT on every
 * request. The hook only sends clinical data.
 */
export const useSymptomChecker = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [eligibleSession, setEligibleSession] = useState(null);

  // ─── Submit a new session ────────────────────────────────────────────────────
  const submitSession = useCallback(async (data) => {
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

      const response = await symptomCheckerService.submitSession(cleanPayload);
      setCurrentSession(response);
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
  }, []);

  // ─── Fetch a single session by ID ────────────────────────────────────────────
  const fetchSession = useCallback(async (sessionId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await symptomCheckerService.getSessionById(sessionId);
      setCurrentSession(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load session";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ─── Abandon a session ───────────────────────────────────────────────────────
  // No patient_id in body — backend resolves identity from JWT.
  const abandonSession = useCallback(
    async (sessionId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await symptomCheckerService.abandonSession(sessionId);
        if (currentSession?.id === sessionId) {
          setCurrentSession((prev) => ({ ...prev, status: "abandoned" }));
        }
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
    [currentSession]
  );

  // ─── Fetch the authenticated patient's own sessions ──────────────────────────
  // Route is now /patients/me/sessions — no patientId in the URL.
  const fetchPatientSessions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await symptomCheckerService.getPatientSessions(params);
      setSessions(response.sessions || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load sessions";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ─── Fetch the latest eligible session ──────────────────────────────────────
  const fetchEligibleSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await symptomCheckerService.getLatestEligibleSession();
      setEligibleSession(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load eligible session";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ─── Fetch sessions for a specific dependent ─────────────────────────────────
  // Route is /patients/me/dependents/{dependentId}/sessions
  const fetchDependentSessions = useCallback(async (dependentId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await symptomCheckerService.getDependentSessions(
        dependentId
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load dependent sessions";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ─── Admin: sessions by triage level ────────────────────────────────────────
  const fetchSessionsByTriageLevel = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await symptomCheckerService.getSessionsByTriageLevel(
        params
      );
      setSessions(response.sessions || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load sessions by triage";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ─── Admin: outcome counts ───────────────────────────────────────────────────
  const fetchOutcomeCounts = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await symptomCheckerService.countSessionsByOutcome(
        params
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load outcome counts";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ─── Clear helpers ───────────────────────────────────────────────────────────
  const clearSessions = useCallback(() => {
    setSessions([]);
    setCurrentSession(null);
    setEligibleSession(null);
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
