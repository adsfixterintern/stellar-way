import api from "@/utils/apiInstance"; 

export const getAllFeedbacks = async () => {
    const response = await api.get('/feedback/all-feedback');
  return response.data;
};