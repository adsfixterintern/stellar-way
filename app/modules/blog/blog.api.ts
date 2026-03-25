import api from "@/utils/apiInstance";

export const getAllBlogs = async () => {
  const response = await api.get('/blogs');
  return response.data;
};
export const getSingleBlog = async (id: string) => {
  const response = await api.get(`/blogs/${id}`); 
  return response.data;
};