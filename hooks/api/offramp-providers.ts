import api, { endpoints } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

const listOfframpProviders = async () => {
  const res = await api.get(endpoints.offramps.providers.list);
  return res.data;
};

const registerOfframpProvider = async (providerData: any) => {
  const res = await api.post(
    endpoints.offramps.providers.register,
    providerData
  );
  return res.data;
};

const performProviderAction = async (actionData: any) => {
  const res = await api.post(endpoints.offramps.providers.actions, actionData);
  return res.data;
};

export const useListOfframpProviders = () => {
  return useQuery({
    queryKey: ["offrampProviders"],
    queryFn: listOfframpProviders,
  });
};

export const useRegisterOfframpProvider = () => {
  return useMutation({
    mutationFn: registerOfframpProvider,
    onMutate: async () => {
      // Placeholder for optimistic update
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });
};

export const usePerformProviderAction = () => {
  return useMutation({
    mutationFn: performProviderAction,
    onMutate: async () => {
      // Placeholder for optimistic update
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });
};
