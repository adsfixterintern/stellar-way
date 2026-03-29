import api from "@/utils/apiInstance";
import { IOverView } from "./overview.interface";

export const getOverView = async (): Promise<IOverView[]> => {
  try {
    const response = await api.get('/orders/stats/overview');
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching overview:", error);
    return [];
  }
};