import { useQuery, useMutation } from "@tanstack/react-query";
import api, { endpoints } from "@/lib/api";
import type {
  ServiceProvider,
  OfframpRequest,
  ProviderAction,
  SingleOfframpRequest,
} from "@/types/offramp";

export const useListOfframpProviders = () => {
  return useQuery<ServiceProvider[], Error>({
    queryKey: ["offrampProviders"],
    queryFn: async () => {
      const res = await api.get(endpoints.offramps.providers.list);
      return res.data.data;
    },
  });
};

export const useCreateOfframpRequest = () => {
  return useMutation<OfframpRequest, Error, Omit<OfframpRequest, "id">>({
    mutationFn: async (request) => {
      const res = await api.post(endpoints.offramps.create, request);
      return res.data;
    },
  });
};

export const useExecuteOfframpRequest = () => {
  return useMutation<
    any,
    Error,
    { providerUuid: string; requestUuid: string; data: any }
  >({
    mutationFn: async ({ providerUuid, requestUuid, data }) => {
      const res = await api.post(endpoints.offramps.execute, {
        providerUuid,
        requestUuid,
        data,
      });
      return res.data;
    },
  });
};

export const useProviderAction = () => {
  return useMutation<any, Error, ProviderAction>({
    mutationFn: async (action) => {
      const res = await api.post(endpoints.offramps.providers.actions, action);
      return res.data;
    },
  });
};

export const useGetSingleOfframpRequest = (payload: {
  uuid?: string;
  id?: number;
  requestId?: string;
}) => {
  return useQuery<SingleOfframpRequest, Error>({
    queryKey: ["singleOfframpRequest", payload],
    queryFn: async () => {
      const res = await api.get(endpoints.offramps.single, {
        params: payload,
      });
      return res.data?.data;
    },
  });
};
