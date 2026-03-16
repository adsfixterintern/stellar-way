import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getMenus = async (categoryId?: string) => {
  // এখানে categoryId পাঠানো হচ্ছে যা ব্যাকএন্ডের req.query.categoryId এর সাথে মিলবে
  const { data } = await API.get('/menu', {
    params: { 
      categoryId: (categoryId === 'All' || !categoryId) ? undefined : categoryId 
    }
  });
  console.log(data.data)
  return data.data; 
};