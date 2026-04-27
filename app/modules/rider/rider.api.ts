/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";
import { IRider } from "./rider.interface";



export const applyForRiderApi = async (riderData: Partial<IRider>) => {
  const response = await api.post("/riders/apply-rider", riderData);
  return response.data;
};


export const getAllRidersApi = async (query: string = "") => {
  const response = await api.get(`/riders${query}`);
  return response.data;
};


export const getSingleRiderApi = async (id: string) => {
  const response = await api.get(`/riders/${id}`);
  return response.data;
};



export const getRiderByUserIdApi = async (userId: string) => {
  const response = await api.get(`/riders?userId=${userId}`);
  return response.data; 
};


export const approveRiderApi = async (id: string) => {
  const response = await api.patch(`/riders/approve-rider/${id}`);
  return response.data;
};


export const updateRiderApi = async (id: string, updateData: Partial<IRider>) => {
  const response = await api.patch(`/riders/${id}`, updateData);
  return response.data;
};


export const deleteRiderApi = async (id: string) => {
  const response = await api.delete(`/riders/${id}`);
  return response.data;
};

export const rejectRiderApi = async (id: string) => {
  const response = await api.patch(`/riders/reject-rider/${id}`);
  return response.data;
};

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



export const updateRiderRatingApi = async (payload: {
  riderId: string;
  userId: string;
  rating: number;
  comment?: string;
}) => {
  const response = await api.patch("/riders/update-rating", payload);
  return response.data;
};


export const getMyOrdersApi = async (email: string) => {
  const response = await api.get(`/orders/${email}`);
  return response.data;
};


export const getMyProfileApi = async (userId: string) => {
  const response = await api.get(`/auth/me?userId=${userId}`);
  return response.data;
};


export const updateProfileApi = async (updateData: {
  name: string;
  phone: string;
  userId: string;
  image?: string;
}) => {
  const response = await api.patch("/auth/update-profile", updateData);
  return response.data;
};