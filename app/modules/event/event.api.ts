/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

import { IEvent } from "./event.interface"; 

export const getEvents = async (query: string = ""): Promise<{ 
  success: boolean; 
  data: IEvent[]; 
  meta?: any 
}> => {
  const response = await api.get(`/events/event${query}`);
  return response.data;
};
export const getAllEventsFromDB = async (page = 1, limit = 3) => {
  const response = await api.get(`/events/event?page=${page}&limit=${limit}`);
  return response.data;
};
export const getSingleEventFromDB = async (id: string) => {
  const response = await api.get(`/events/event/${id}`);
  return response.data;
};
export const createEventApi = async (formData: FormData) => {
  const response = await api.post("/events/create-event", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateEventApi = async (id: string, formData: FormData) => {
  const response = await api.put(`/events/event/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteEventApi = async (id: string) => {
  const response = await api.delete(`/events/event/${id}`);
  return response.data;
};
