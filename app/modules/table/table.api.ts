/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";
import { ITable, ITableResponse } from "./table.interface";

export const createTableApi = async (payload: FormData) => {
  const response = await api.post("/table/create-table", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getAllTables = async (): Promise<ITableResponse> => {
  const response = await api.get("/table");
  return response.data;
};

export const getSingleTable = async (id: string) => {
  const response = await api.get(`/table/${id}`);
  return response.data;
};

export const updateTableApi = async (id: string, payload: FormData) => {
  const response = await api.patch(`/table/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteTableApi = async (id: string) => {
  const response = await api.delete(`/table/${id}`);
  return response.data;
};