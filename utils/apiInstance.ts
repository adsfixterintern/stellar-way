
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

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

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    
    if (status === 403 || (message && message.toLowerCase().includes("blocked"))) {
      
      toast.error("Your account is blocked! Logging out...");
      await signOut({ callbackUrl: '/login' });
    }

    return Promise.reject(error);
  }
);

export default api;