import { useQuery } from "@tanstack/react-query";
import providerService from "api/services/providerService";
import { queryKeys } from "platform/query/queryKeys";

export const useProvider = () => {
  const clinicQuery = useQuery({
    queryKey: queryKeys.provider.clinic,
    queryFn: providerService.getMyClinic,
    enabled: false,
  });

  return {
    getMyClinic: () => clinicQuery.refetch(),
    clinic: clinicQuery.data?.clinic || clinicQuery.data || null,
    loading: clinicQuery.isFetching,
    error: clinicQuery.error?.message || null,
  };
};
