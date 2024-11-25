import { useQuery, useMutation } from "@tanstack/react-query"
import api, { endpoints } from "@/lib/api"
import type { ServiceProvider, TransactionDetails } from "@/types/offramp"

interface ApiResponse {
  success: boolean;
  data: ServiceProvider[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export const useListOfframpProviders = () => {
  return useQuery<ServiceProvider[], Error>({
    queryKey: ["offrampProviders"],
    queryFn: async () => {
      const res = await api.get<ApiResponse>(endpoints.offramps.providers.list)
      if (!res.data.success || !Array.isArray(res.data.data)) {
        throw new Error("API did not return a valid list of providers")
      }
      return res.data.data.map(provider => ({
        ...provider,
        logo: provider.logo || `/placeholder.svg?height=32&width=32`, // Use provided logo or fallback to placeholder
      }))
    },
  })
}

export const useCreateOfframpRequest = () => {
  return useMutation<TransactionDetails, Error, TransactionDetails>({
    mutationFn: async (details) => {
      const res = await api.post(endpoints.offramps.requests.create, details)
      return res.data
    },
  })
}

export const useExecuteOfframpRequest = () => {
  return useMutation<any, Error, string>({
    mutationFn: async (id) => {
      const res = await api.post(`${endpoints.offramps.requests.execute}/${id}`)
      return res.data
    },
  })
}

