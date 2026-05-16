import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import providerService from "api/services/providerService";
import { queryKeys } from "platform/query/queryKeys";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error || err.message || fallback;

const unwrapClinic = (payload) => payload?.clinic || payload || null;
const unwrapClinics = (payload) => payload?.clinics || [];
const unwrapStaff = (payload) => payload?.staff || [];
const unwrapServices = (payload) => payload?.services || [];

export const useProvider = () => {
  const queryClient = useQueryClient();
  const [clinic, setClinic] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);

  const startLoading = useCallback(() => setLoadingCount((count) => count + 1), []);
  const stopLoading = useCallback(
    () => setLoadingCount((count) => Math.max(0, count - 1)),
    []
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

  const getMyClinic = useCallback(
    async () =>
      run(async () => {
        const response = await providerService.getMyClinic();
        const currentClinic = unwrapClinic(response);
        setClinic(currentClinic);
        queryClient.setQueryData(queryKeys.provider.clinic, response);
        return response;
      }, "Failed to load clinic"),
    [queryClient, run]
  );

  const getClinics = useCallback(
    async () =>
      run(async () => {
        const response = await providerService.getClinics();
        setClinics(unwrapClinics(response));
        queryClient.setQueryData(queryKeys.provider.clinics, response);
        return response;
      }, "Failed to load clinics"),
    [queryClient, run]
  );

  const getClinic = useCallback(
    async (clinicId) =>
      run(async () => {
        const response = await providerService.getClinic(clinicId);
        setClinic(response);
        queryClient.setQueryData([...queryKeys.provider.clinic, clinicId], response);
        return response;
      }, "Failed to load clinic"),
    [queryClient, run]
  );

  const registerClinic = useCallback(
    async (data) =>
      run(async () => {
        const response = await providerService.registerClinic(data);
        setClinic(response);
        setClinics((items) => [response, ...items.filter((item) => item.id !== response.id)]);
        queryClient.invalidateQueries({ queryKey: queryKeys.provider.clinics });
        return response;
      }, "Failed to register clinic"),
    [queryClient, run]
  );

  const updateClinic = useCallback(
    async (clinicId, data) =>
      run(async () => {
        const response = await providerService.updateClinic(clinicId, data);
        setClinic(response);
        setClinics((items) =>
          items.map((item) => (item.id === clinicId ? response : item))
        );
        queryClient.invalidateQueries({ queryKey: queryKeys.provider.clinics });
        return response;
      }, "Failed to update clinic"),
    [queryClient, run]
  );

  const deleteClinic = useCallback(
    async (clinicId) =>
      run(async () => {
        const response = await providerService.deleteClinic(clinicId);
        setClinics((items) => items.filter((item) => item.id !== clinicId));
        if (clinic?.id === clinicId) setClinic(null);
        queryClient.invalidateQueries({ queryKey: queryKeys.provider.clinics });
        return response;
      }, "Failed to delete clinic"),
    [clinic?.id, queryClient, run]
  );

  const markClinicVerified = useCallback((clinicId) => {
    setClinics((items) =>
      items.map((item) =>
        item.id === clinicId
          ? { ...item, is_verified: true, verification_status: "verified" }
          : item
      )
    );
    setClinic((item) =>
      item?.id === clinicId
        ? { ...item, is_verified: true, verification_status: "verified" }
        : item
    );
  }, []);

  const verifyClinic = useCallback(
    async (clinicId, data, notes) =>
      run(async () => {
        const response = await providerService.verifyClinic(clinicId, data, notes);
        markClinicVerified(clinicId);
        queryClient.invalidateQueries({ queryKey: queryKeys.provider.clinics });
        return response;
      }, "Failed to verify clinic"),
    [markClinicVerified, queryClient, run]
  );

  const updateVerifyClinic = useCallback(
    async (clinicId, data) =>
      run(async () => {
        const response = await providerService.updateVerifyClinic(clinicId, data);
        markClinicVerified(clinicId);
        queryClient.invalidateQueries({ queryKey: queryKeys.provider.clinics });
        return response;
      }, "Failed to update clinic verification"),
    [markClinicVerified, queryClient, run]
  );

  const listClinicStaff = useCallback(
    async (clinicId) =>
      run(async () => {
        const response = await providerService.listClinicStaff(clinicId);
        const list = unwrapStaff(response);
        setStaffList(list);
        queryClient.setQueryData(queryKeys.provider.staff(clinicId), response);
        return list;
      }, "Failed to load clinic staff"),
    [queryClient, run]
  );

  const listActiveClinicStaff = useCallback(
    async (clinicId) =>
      run(async () => {
        const response = await providerService.listActiveClinicStaff(clinicId);
        const list = unwrapStaff(response);
        setStaffList(list);
        queryClient.setQueryData(queryKeys.provider.activeStaff(clinicId), response);
        return list;
      }, "Failed to load active clinic staff"),
    [queryClient, run]
  );

  const registerStaff = useCallback(
    async (data) =>
      run(async () => {
        const response = await providerService.registerStaff(data);
        setStaffList((items) => [response, ...items.filter((item) => item.id !== response.id)]);
        return response;
      }, "Failed to register staff"),
    [run]
  );

  const getStaff = useCallback(
    async (staffId) =>
      run(() => providerService.getStaff(staffId), "Failed to load staff"),
    [run]
  );

  const updateStaff = useCallback(
    async (staffId, data) =>
      run(async () => {
        const response = await providerService.updateStaff(staffId, data);
        setStaffList((items) =>
          items.map((item) =>
            item.id === staffId || item.staff_id === staffId ? response : item
          )
        );
        return response;
      }, "Failed to update staff"),
    [run]
  );

  const deleteStaff = useCallback(
    async (staffId) =>
      run(async () => {
        const response = await providerService.deleteStaff(staffId);
        setStaffList((items) =>
          items.filter((item) => item.id !== staffId && item.staff_id !== staffId)
        );
        return response;
      }, "Failed to delete staff"),
    [run]
  );

  const checkStaffStatus = useCallback(
    async (staffId) =>
      run(
        () => providerService.checkStaffStatus(staffId),
        "Failed to check staff status"
      ),
    [run]
  );

  const getClinicService = useCallback(
    async (clinicId) =>
      run(async () => {
        const response = await providerService.getClinicService(clinicId);
        const list = unwrapServices(response);
        setServiceList(list);
        queryClient.setQueryData(queryKeys.provider.services(clinicId), response);
        return list;
      }, "Failed to load clinic services"),
    [queryClient, run]
  );

  const registerService = useCallback(
    async (data) =>
      run(async () => {
        const response = await providerService.registerService(data);
        setServiceList((items) => [
          response,
          ...items.filter((item) => item.id !== response.id),
        ]);
        return response;
      }, "Failed to register service"),
    [run]
  );

  const getService = useCallback(
    async (serviceId) =>
      run(() => providerService.getService(serviceId), "Failed to load service"),
    [run]
  );

  const updateService = useCallback(
    async (serviceId, data) =>
      run(async () => {
        const response = await providerService.updateService(serviceId, data);
        setServiceList((items) =>
          items.map((item) =>
            item.id === serviceId || item.service_id === serviceId ? response : item
          )
        );
        return response;
      }, "Failed to update service"),
    [run]
  );

  const deleteService = useCallback(
    async (serviceId) =>
      run(async () => {
        const response = await providerService.deleteService(serviceId);
        setServiceList((items) =>
          items.filter(
            (item) => item.id !== serviceId && item.service_id !== serviceId
          )
        );
        return response;
      }, "Failed to delete service"),
    [run]
  );

  const checkServiceExists = useCallback(
    async (serviceId) =>
      run(
        () => providerService.checkServiceExists(serviceId),
        "Failed to check service"
      ),
    [run]
  );

  const registerCredential = useCallback(
    async (data) =>
      run(
        () => providerService.registerCredential(data),
        "Failed to register credential"
      ),
    [run]
  );

  const deleteCredential = useCallback(
    async (credentialId) =>
      run(
        () => providerService.deleteCredential(credentialId),
        "Failed to delete credential"
      ),
    [run]
  );

  const getStaffCredential = useCallback(
    async (staffId) =>
      run(
        () => providerService.getStaffCredential(staffId),
        "Failed to load staff credentials"
      ),
    [run]
  );

  const clearProviderState = useCallback(() => {
    setClinic(null);
    setClinics([]);
    setStaffList([]);
    setServiceList([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    getMyClinic,
    getClinics,
    getClinic,
    registerClinic,
    updateClinic,
    deleteClinic,
    verifyClinic,
    updateVerifyClinic,
    registerStaff,
    getStaff,
    updateStaff,
    deleteStaff,
    checkStaffStatus,
    listClinicStaff,
    listActiveClinicStaff,
    getClinicService,
    registerService,
    getService,
    updateService,
    deleteService,
    checkServiceExists,
    registerCredential,
    deleteCredential,
    getStaffCredential,
    clearProviderState,
    clearError,
    clinic,
    clinics,
    staffList,
    staffTotal: staffList.length,
    serviceList,
    serviceTotal: serviceList.length,
    loading: loadingCount > 0,
    error,
  };
};
