import api from "@/utils/apiInstance";
import { IGalleryItem } from "./gallery.interface";

export const getAllGalleryItems = async (): Promise<IGalleryItem[]> => {
  try {
    const response = await api.get('/gallery');
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
};
export const createGalleryItemApi = async (formData: FormData) => {
  try {
    const response = await api.post('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating gallery item:", error);
    throw error;
  }
};

export const deleteGalleryItemApi = async (id: string) => {
  try {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    throw error;
  }
};
