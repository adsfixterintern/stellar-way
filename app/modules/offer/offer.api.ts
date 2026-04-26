/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

export const createOfferApi = async (data: any) => {
  const response = await api.post("/offer/create", data);
  return response.data;
};

export const getAllOffersApi = async () => {
  const response = await api.get("/offer");
  return response.data;
};

export const getActiveOffersApi = async () => {
  const response = await api.get("/offer/active");
  return response.data;
};

export const deleteOfferApi = async (id: string) => {
  const response = await api.delete(`/offer/${id}`);
  return response.data;
};

export const updateOfferApi = async (id: string, payload: any) => {
  const response = await api.patch(`/offer/${id}`, payload);
  return response.data;
};