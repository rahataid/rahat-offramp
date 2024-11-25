import api, { endpoints } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";

const createOfframpRequest = async () => {
  const res = await api.post(endpoints.offramps.requests.create);
  return res.data;
};

export const useCreateOfframpRequest = () => {
  return useMutation({
    mutationFn: createOfframpRequest,
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

const listOfframpRequests = async () => {
  const res = await api.get(endpoints.offramps.requests.list);
  return res.data;
};

export const useListOfframpRequests = () => {
  return useQuery({
    queryKey: ["offrampRequests"],
    queryFn: listOfframpRequests,
  });
};

const executeOfframpRequest = async (id: string) => {
  const res = await api.post(`${endpoints.offramps.requests.execute}/${id}`);
  return res.data;
};

export const useExecuteOfframpRequest = () => {
  return useMutation({
    mutationFn: executeOfframpRequest,
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
