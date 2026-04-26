/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "@/utils/apiInstance";

export const getAllCategoriesApi = async () => {
  const response = await api.get("/categories?status=active");
  return response.data;
};


export const getAllCategoriesForAdminApi = async () => {
  const response = await api.get("/categories"); 
  return response.data;
};


export const createCategoryApi = async (payload: { name: string; sortOrder: number; status: string }) => {
  const response = await api.post("/categories/create-category", payload);
  return response.data;
};


export const updateCategoryApi = async (id: string, payload: any) => {
  const response = await api.patch(`/categories/${id}`, payload);
  return response.data;
};