import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getMenus = async (categoryId?: string) => {
  const { data } = await API.get('/menu', {
    params: { 
      categoryId: (categoryId === 'All' || !categoryId) ? undefined : categoryId,
      limit: 100 
    }
  });
  return data.data; 
};