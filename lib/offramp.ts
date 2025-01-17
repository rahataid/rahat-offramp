import api, { endpoints } from "@/lib/api";
import { joinLocalAndApiProviders } from "@/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
// import type {
//   ServiceProvider,
//   OfframpRequest,
//   ProviderAction,
//   SingleOfframpRequest,
// } from "@/types/offramp";

export type OfframpData = {
  mobileMoneyReceiver: {
    networkProvider: string;
    phoneNumber: string;
    accountName: string;
  };
  currency: string;
  chain: string;
  token: string;
  cryptoAmount: number;
  senderAddress: string;
  wallet_id: string;
  request_id: string;
  customer_key: string;
};

export const useListOfframpProviders = () => {
  return useQuery({
    queryKey: ["offrampProviders"],
    queryFn: async () => {
      const res = await api.get(endpoints.offramps.providers.list);
      const sluggedData = res.data?.data.map((d) => {
        const slug = d.name.toLowerCase().replace(/\s/g, "") + "Provider";
        return {
          ...d,
          slug,
        };
      });
      const joined = joinLocalAndApiProviders(sluggedData || []);
      return joined || [];
    },
  });
};

export const useCreateOfframpRequest = () => {
  return useMutation<any, Error, Omit<any, "id">>({
    mutationFn: async (request) => {
      const res = await api.post(endpoints.offramps.create, request);
      return res.data?.data;
    },
  });
};
export const useExecuteOfframpRequest = () => {
  return useMutation<
    any,
    Error,
    {
      providerUuid: string;
      requestUuid: string;
      data: OfframpData;
    }
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
  return useMutation<any, Error, any>({
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
  return useQuery<any, Error>({
    queryKey: ["singleOfframpRequest", payload],
    queryFn: async () => {
      const res = await api.get(endpoints.offramps.single, {
        params: payload,
      });
      return res.data?.data;
    },
  });
};

export const useGetCustomerMobileMoneyWalletByPhone = () => {
  const providerAction = useProviderAction();
  return useMutation({
    mutationKey: ["get-customer-wallet-by-phone"],
    mutationFn: async (data: {
      providerUuid: string;
      payload: {
        phone_number: string;
      };
    }) => {
      const res = await providerAction.mutateAsync({
        uuid: data.providerUuid,
        action: "get-customer-wallet-by-phone",
        payload: data.payload,
      });
      return res?.data || {};
    },
  });
};
export const useCreateCustomerMobileMoneyWallet = () => {
  const providerAction = useProviderAction();
  return useMutation({
    mutationKey: ["create-customer-mobile-wallet"],
    mutationFn: async (data: {
      providerUuid: string;
      payload: {
        country_code: string;
        phone_number: string;
        network: string;
        account_name: string;
      };
    }) => {
      const res = await providerAction.mutateAsync({
        uuid: data.providerUuid,
        action: "create-customer-mobile-wallet",
        payload: data.payload,
      });
      return res?.data?.data || {};
    },
  });
};

export const useGetFiatWallets = (providerUuid: string) => {
  const providerAction = useProviderAction();
  return useQuery({
    queryKey: ["get-fiat-wallet"],
    queryFn: async () => {
      const res = await providerAction.mutateAsync({
        uuid: providerUuid,
        action: "get-fiat-wallet",
      });
      return res?.data || [];
    },
  });
};

export const useCheckOfframpStatus = () => {
  const providerAction = useProviderAction();
  return useMutation({
    mutationKey: ["check-offramp-status"],

    mutationFn: async (data: {
      providerUuid: string;
      payload: {
        referenceId: string;
      };
    }) => {
      const res = await providerAction.mutateAsync({
        uuid: data.providerUuid,
        action: "check-offramp-status",
        payload: data.payload,
      });
      return res?.data.data || {};
    },
  });
};
