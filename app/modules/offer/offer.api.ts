/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

export const createOfferApi = async (data: any) => {
  const response = await api.post("/offer/create", data);
  return response.data;
};

export const getActiveOffersApi = async () => {
  const response = await api.get("/offer/active");
  console.log(response)
  return response.data;
};

export const deleteOfferApi = async (id: string) => {
  const response = await api.delete(`/offer/${id}`);
  return response.data;
};
