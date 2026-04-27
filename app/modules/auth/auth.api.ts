/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance"; 
import { IAuthResponse, ILoginCredentials, IRegisterData } from "../auth/auth.interface";

export const registerUserApi = async (userData: IRegisterData): Promise<IAuthResponse> => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUserApi = async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logoutUserApi = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const resetPasswordApi = async (token: string, password: string): Promise<IAuthResponse> => {
  const response = await api.patch(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const forgetPasswordApi = async (email: string): Promise<IAuthResponse> => {
  const response = await api.post("/auth/forget-password", { email });
  return response.data;
};

export const getMeApi = async (userId?: string): Promise<IAuthResponse> => {
  const response = await api.get(`/auth/me`, {
    params: { userId }
  });
  return response.data;
};


export const updateProfileApi = async (updateData: any): Promise<IAuthResponse> => {
  const response = await api.patch("/auth/update-profile", updateData);
  return response.data;
};

// Change Password API
export const changePasswordApi = async (passwords: any): Promise<IAuthResponse> => {
  const response = await api.patch("/auth/change-password", passwords);
  return response.data;
};


export const getAllUsersApi = async (limit: number = 999): Promise<any> => {
  const response = await api.get("/auth/all-users", {
    params: { limit }
  });
  return response.data;
};