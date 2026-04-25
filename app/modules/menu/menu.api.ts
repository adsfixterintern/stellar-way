/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

/* =========================
        MENU APIs
========================= */

// GET ALL MENUS
export const getMenus = async (categoryId?: string) => {
  const res = await api.get("/menu", {
    params: {
      categoryId: categoryId === "All" || !categoryId ? undefined : categoryId,
      limit: 100,
    },
  });

  return res.data.data;
};

// GET SINGLE MENU
export const getSingleMenu = async (id: string) => {
  const res = await api.get(`/menu/${id}`);
  return res.data.data;
};

// DELETE MENU
export const deleteMenuFromDB = async (id: string) => {
  const res = await api.delete(`/menu/${id}`);
  return res.data;
};

// CREATE MENU
export const createMenu = async (formData: object) => {
  const res = await api.post("/menu/create-menu", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// UPDATE MENU
export const updateMenu = async (id: string, formData: object) => {
  const res = await api.patch(`/menu/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// MENU REVIEW
export const submitMenuReview = async (menuId: string, payload: any) => {
  const res = await api.patch(`/menu/${menuId}`, payload);
  return res.data;
};

// RIDER REVIEW
export const submitRiderReview = async (payload: any) => {
  const res = await api.post(`/rider/review`, payload);
  return res.data;
};
