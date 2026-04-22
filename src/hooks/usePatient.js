import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import patientService from "api/services/patientService";
import { queryKeys } from "platform/query/queryKeys";

export const usePatient = () => {
  const client = useQueryClient();
  const profileQuery = useQuery({
    queryKey: queryKeys.patient.current,
    queryFn: patientService.getCurrentPatientProfile,
    enabled: false,
  });

  const upsertMutation = useMutation({
    mutationFn: patientService.upsertPatientProfile,
    onSuccess: (data) => {
      client.setQueryData(queryKeys.patient.current, data);
    },
  });

  return {
    getCurrentPatientProfile: () => profileQuery.refetch(),
    upsertPatientProfile: upsertMutation.mutateAsync,
    patient: profileQuery.data ?? null,
    profileCompletion: patientService.calculateProfileCompletion(profileQuery.data),
    loading: profileQuery.isFetching || upsertMutation.isPending,
    error: profileQuery.error?.message || upsertMutation.error?.message || null,
    hasPatient: Boolean(profileQuery.data),
  };
};
