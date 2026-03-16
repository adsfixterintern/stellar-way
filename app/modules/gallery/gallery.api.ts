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