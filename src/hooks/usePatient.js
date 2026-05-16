import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import patientService from "api/services/patientService";
import { queryKeys } from "platform/query/queryKeys";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error || err.message || fallback;

export const usePatient = () => {
  const queryClient = useQueryClient();
  const [patient, setPatient] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => setLoadingCount((count) => count + 1), []);
  const stopLoading = useCallback(
    () => setLoadingCount((count) => Math.max(0, count - 1)),
    []
  );

  const setPatientCache = useCallback(
    (profile) => {
      setPatient(profile || null);
      if (profile) {
        queryClient.setQueryData(queryKeys.patient.current, profile);
        queryClient.setQueryData(queryKeys.patient.profile(profile.id), profile);
        queryClient.setQueryData(queryKeys.patient.byUser(profile.user_id), profile);
      }
    },
    [queryClient]
  );

  const run = useCallback(
    async (fn, fallback) => {
      startLoading();
      setError(null);
      try {
        const data = await fn();
        stopLoading();
        return { success: true, data };
      } catch (err) {
        const message = getErrorMessage(err, fallback);
        setError(message);
        stopLoading();
        return { success: false, error: message };
      }
    },
    [startLoading, stopLoading]
  );

  const createPatientProfile = useCallback(
    async (data) =>
      run(async () => {
        const response = await patientService.createPatientProfile(data);
        setPatientCache(response);
        return response;
      }, "Failed to create patient profile"),
    [run, setPatientCache]
  );

  const getPatientProfile = useCallback(
    async (patientId) =>
      run(async () => {
        const response = await patientService.getPatientProfile(patientId);
        setPatientCache(response);
        return response;
      }, "Failed to load patient profile"),
    [run, setPatientCache]
  );

  const getPatientProfileByUserId = useCallback(
    async (userId) =>
      run(async () => {
        const response = await patientService.getPatientProfileByUserId(userId);
        setPatientCache(response);
        return response;
      }, "Failed to load patient profile"),
    [run, setPatientCache]
  );

  const getCurrentPatientProfile = useCallback(
    async () =>
      run(async () => {
        const response = await patientService.getCurrentPatientProfile();
        setPatientCache(response);
        return response;
      }, "Failed to load patient profile"),
    [run, setPatientCache]
  );

  const updatePatientProfile = useCallback(
    async (patientId, data) =>
      run(async () => {
        const response = await patientService.updatePatientProfile(patientId, data);
        setPatientCache(response);
        return response;
      }, "Failed to update patient profile"),
    [run, setPatientCache]
  );

  const deletePatientProfile = useCallback(
    async (patientId) =>
      run(async () => {
        const response = await patientService.deletePatientProfile(patientId);
        setPatient(null);
        queryClient.invalidateQueries({ queryKey: queryKeys.patient.current });
        return response;
      }, "Failed to delete patient profile"),
    [queryClient, run]
  );

  const upsertPatientProfile = useCallback(
    async (data) =>
      run(async () => {
        const response = await patientService.upsertPatientProfile(data);
        setPatientCache(response);
        return response;
      }, "Failed to save patient profile"),
    [run, setPatientCache]
  );

  const searchPatients = useCallback(
    async (params = {}) =>
      run(async () => {
        const response = await patientService.searchPatients(params);
        queryClient.setQueryData(queryKeys.patient.search(params), response);
        return response;
      }, "Failed to search patients"),
    [queryClient, run]
  );

  const getDemographicsSummary = useCallback(
    async () =>
      run(async () => {
        const response = await patientService.getDemographicsSummary();
        queryClient.setQueryData(["patient", "demographics"], response);
        return response;
      }, "Failed to load demographics"),
    [queryClient, run]
  );

  const clearPatientState = useCallback(() => {
    setPatient(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    createPatientProfile,
    getPatientProfile,
    getPatientProfileByUserId,
    getCurrentPatientProfile,
    updatePatientProfile,
    deletePatientProfile,
    upsertPatientProfile,
    searchPatients,
    getDemographicsSummary,
    clearPatientState,
    clearError,
    validatePatientProfile: patientService.validatePatientProfile,
    patient,
    profileCompletion: patientService.calculateProfileCompletion(patient),
    loading: loadingCount > 0,
    error,
    hasPatient: Boolean(patient),
  };
};
