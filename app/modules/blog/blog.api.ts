import api from "@/utils/apiInstance";

export const getAllBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};