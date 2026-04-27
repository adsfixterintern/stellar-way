/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const createFaq = async (data: any) => {
  const response = await axios.post(`${API_URL}/faq/create-faq`, data);
  return response.data;
};

export const getAllFaqs = async (params?: Record<string, any>) => {
  const response = await axios.get(`${API_URL}/faq/all-faq`, { params });
  return response.data.data; 
};

export const updateFaq = async (id: string, data: any) => {
  const response = await axios.put(`${API_URL}/faq/faq/${id}`, data);
  return response.data;
};

export const deleteFaq = async (id: string) => {
  const response = await axios.delete(`${API_URL}/faq/faq/${id}`);
  return response.data;
};