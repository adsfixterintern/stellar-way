import api from "@/utils/apiInstance"; 
import { IAuthResponse, ILoginCredentials, IRegisterData } from "../auth/auth.interface";

export const registerUserApi = async (userData: IRegisterData): Promise<IAuthResponse> => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUserApi = async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
  console.log(response.data)
};

export const logoutUserApi = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post("/auth/logout");
  return response.data;
};