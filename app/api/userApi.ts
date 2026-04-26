/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getAllUsers = async (params?: Record<string, any>) => {
  const { data } = await API.get('/auth/all-users', {
    params: params 
  });
  return data; 
};