import api from "@/utils/apiInstance";
import { IOverView } from "./overview.interface";

export const getOverView = async (): Promise<IOverView | null> => {
  try {
    const response = await api.get('/orders/stats/overview');
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

export const getTrafficStats = async () => {
  try {
    const response = await api.get('/analytics/stats');
    return response.data.data;
  } catch (error) {
    console.error("Error fetching traffic stats:", error);
    return { direct: 0, social: 0, organic: 0 };
  }
};

// ✅ CHANGED: "all" period add করা হয়েছে — আগে ছিল "day" | "week" | "month"
export const getFilteredStats = async (
  period: "all" | "day" | "week" | "month",
  month?: number,
) => {
  try {
    const params = new URLSearchParams({ period });
    if (period === "month" && month !== undefined) {
      params.set("month", String(month));
    }
    const response = await api.get(`/orders/stats/filtered?${params}`);
    return response.data?.data || { totalRevenue: 0, totalOrders: 0, chartData: [] };
  } catch (error) {
    console.error("Error fetching filtered stats:", error);
    return { totalRevenue: 0, totalOrders: 0, chartData: [] };
  }
};