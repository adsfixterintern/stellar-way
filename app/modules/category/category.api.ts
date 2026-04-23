import api from "@/utils/apiInstance";

// সব ক্যাটাগরি ফেচ করার জন্য
export const getAllCategoriesApi = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// নতুন ক্যাটাগরি তৈরি করার জন্য
export const createCategoryApi = async (payload: { name: string; sortOrder: number }) => {
  const response = await api.post("/categories/create-category", payload);
  return response.data;
};

// ক্যাটাগরি আপডেট করার জন্য
export const updateCategoryApi = async (id: string, payload: { name: string; sortOrder: number }) => {
  const response = await api.patch(`/categories/${id}`, payload);
  return response.data;
};

// ক্যাটাগরি ডিলিট করার জন্য
export const deleteCategoryApi = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};