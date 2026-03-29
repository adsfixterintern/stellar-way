import api from "@/utils/apiInstance";
import { IOverView } from "./overview.interface";

export const getOverView = async (): Promise<IOverView | null> => {
  try {
    const response = await api.get('/orders/stats/overview');
    // ইন্টারফেসে আপডেট করায় এখন response.data.data-তে চার্টের ডাটাও থাকবে
    return response.data?.data || null;
  } catch (error) {
    console.error("Error fetching overview:", error);
    return null;
  }
};

export const getLowStockItems = async () => {
  try {
    const response = await api.get('/menu/low-stock');
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    return [];
  }
};