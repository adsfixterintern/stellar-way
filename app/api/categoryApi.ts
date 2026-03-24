import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getCategories = async () => {
  const { data } = await API.get('/categories');
  // console.log(data.data)
  return data.data; 
};