import api from "@/utils/apiInstance";

export const getSingleMenu = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
    cache: 'no-store'
  });
  const result = await res.json();
  return result.data;
};



export const deleteMenuFromDB = async (id: string) => {
  const res = await api.delete(`/menu/${id}`);
  return res.data; 
};

export const createMenu = async (formData:object) => {
  const res = await api.post('/menu/create-menu', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updateMenu = async (id: string, formData:object) => {
  const res = await api.patch(`/menu/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};