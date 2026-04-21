import api from "@/utils/apiInstance";


export const createChef = async (formData: FormData) => {
  const res = await api.post('/chefs/create-chef', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};


export const updateChef = async (id: string, formData: FormData) => {
  const res = await api.patch(`/chefs/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const deleteChefFromDB = async (id: string) => {
  const res = await api.delete(`/chefs/${id}`);
  return res.data;
};


export const getAllChefFromDB = async () => {
  const res = await api.get(`/chefs`);
  return res.data;
};
