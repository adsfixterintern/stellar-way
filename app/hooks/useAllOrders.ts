import { useQuery } from "@tanstack/react-query";
import api from "@/utils/apiInstance";

export const useAllOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["all-orders", page, limit],
    queryFn: async () => {
   
      const { data } = await api.get(`/orders?page=${page}&limit=${limit}`);
      return data;
    },
  });
};