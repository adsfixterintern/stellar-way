/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/utils/apiInstance";

export interface IUpdateStatusPayload {
  status: 'on-the-way' | 'delivered';
  riderId: string;
  riderName?: string;
  currentLocation?: { lat: number; lng: number } | null; 
  otp?:string
}

export const getRiderDashboardData = async (email: string) => {
  const response = await api.get(`/orders/rider-stats/${email}`);
  return response.data;
};

export const updateDeliveryStatusApi = async (orderId: string, payload: {
  status: 'on-the-way' | 'delivered';
  riderId: string;
  riderName?: string;
  otp?: string;
  currentLocation?: { lat: number; lng: number } | null;
}) => {
  const response = await api.patch(`/orders/update-delivery-status/${orderId}`, payload);
  return response.data;
};

export const getRiderOrderHistory = async (email: string) => {
  const response = await api.get(`/orders/rider-history/${email}`);
  return response.data;
};