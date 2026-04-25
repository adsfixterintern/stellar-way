/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

export const getRestaurantStats = async () => {
  const res = await api.get("/stats");
  return res.data;
};

export const createRestaurantStats = async (data: any) => {
  const res = await api.post("/stats/create", data);
  return res.data;
};

export const updateRestaurantStats = async (data: any) => {
  const res = await api.patch("/stats/update", data);
  return res.data;
};

export const resetRestaurantStats = async () => {
  const res = await api.delete("/stats/reset");
  return res.data;
};