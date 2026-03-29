/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

export const getRiderStatsAndOrders = async (email: string) => {
  const response = await api.get(`/orders/rider-stats/${email}`);
  return response.data;
};

export const updateDeliveryStatusApi = async (orderId: string, data: {
  status: 'on-the-way' | 'delivered'; 
  riderId: string;
  riderName?: string;
}) => {
  const response = await api.patch(`/orders/update-delivery-status/${orderId}`, data);
  return response.data;
};

export const getRiderOrderHistory = async (email: string) => {
  const response = await api.get(`/orders/rider-history/${email}`);
  return response.data;
};