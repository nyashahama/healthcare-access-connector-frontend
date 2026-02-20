import providerAvailabilityService from "api/services/providerAvailabilityService";
import { useCallback, useState } from "react";

/**
 * Custom hook for provider availability operations.
 *
 * staff_id is never sent — derived from JWT.
 */
export const useProviderAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [myAvailability, setMyAvailability] = useState(null);
  const [staleProviders, setStaleProviders] = useState([]);

  // ─── Patient-facing ─────────────────────────────────────────────────────

  const fetchAvailableProviders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await providerAvailabilityService.getAvailableProviders(
        params
      );
      setAvailableProviders(response.providers || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch available providers";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchAvailableProvidersBySpecialization = useCallback(
    async (specialization) => {
      setLoading(true);
      setError(null);
      try {
        const response =
          await providerAvailabilityService.getAvailableProvidersBySpecialization(
            specialization
          );
        setAvailableProviders(response.providers || []);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          "Failed to fetch providers by specialization";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    []
  );

  // ─── Provider self-management ───────────────────────────────────────────

  const goOnline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await providerAvailabilityService.goOnline();
      setMyAvailability(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to go online";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const goOffline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await providerAvailabilityService.goOffline();
      setMyAvailability(null);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to go offline";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const setAccepting = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await providerAvailabilityService.setAccepting(data);
      setMyAvailability(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to update accepting state";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const updateStatus = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await providerAvailabilityService.updateStatus(data);
        // Optionally refresh myAvailability
        if (myAvailability) {
          setMyAvailability((prev) => ({ ...prev, ...data }));
        }
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to update status";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [myAvailability]
  );

  const updateWaitTime = useCallback(
    async (minutes) => {
      setLoading(true);
      setError(null);
      try {
        const response = await providerAvailabilityService.updateWaitTime(
          minutes
        );
        if (myAvailability) {
          setMyAvailability((prev) => ({
            ...prev,
            estimated_wait_minutes: minutes,
          }));
        }
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to update wait time";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [myAvailability]
  );

  const sendHeartbeat = useCallback(async () => {
    // Heartbeat is a fire-and-forget; no loading state to avoid UI jitter
    try {
      await providerAvailabilityService.sendHeartbeat();
      return { success: true };
    } catch (err) {
      // Silently fail? Optionally log but don't show to user
      return { success: false, error: err.message };
    }
  }, []);

  const fetchMyAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await providerAvailabilityService.getMyAvailability();
      setMyAvailability(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch your availability";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Admin / background jobs ────────────────────────────────────────────

  const fetchStaleProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await providerAvailabilityService.getStaleProviders();
      setStaleProviders(response.providers || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to fetch stale providers";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const setStaleProvidersOffline = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await providerAvailabilityService.setStaleProvidersOffline();
      setStaleProviders([]); // Clear after marking offline
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to set stale providers offline";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Clear helpers ──────────────────────────────────────────────────────

  const clearProviders = useCallback(() => {
    setAvailableProviders([]);
    setMyAvailability(null);
    setStaleProviders([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Methods
    fetchAvailableProviders,
    fetchAvailableProvidersBySpecialization,
    goOnline,
    goOffline,
    setAccepting,
    updateStatus,
    updateWaitTime,
    sendHeartbeat,
    fetchMyAvailability,
    fetchStaleProviders,
    setStaleProvidersOffline,
    clearProviders,
    clearError,

    // State
    loading,
    error,
    availableProviders,
    myAvailability,
    staleProviders,

    // Derived
    hasAvailableProviders: availableProviders.length > 0,
    isOnline: !!myAvailability?.is_online,
    isAccepting: !!myAvailability?.is_accepting,
  };
};
