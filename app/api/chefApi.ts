import { IChef } from '@/types/menu';
import axios from 'axios';


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getChefs = async (): Promise<IChef[]> => {
  const { data } = await API.get('/chefs');
  return data.data; 
};