/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});


api.interceptors.request.use(async (config) => {
  const session: any = await getSession();
  
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;