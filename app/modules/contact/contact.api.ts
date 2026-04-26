/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

export interface IContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendContactMessageApi = async (data: IContactFormData) => {
  try {
    const response = await api.post("/contact/send", data);
    return response.data;
  } catch (error: any) {
    console.error("Error sending contact message:", error);
    throw error;
  }
};

export const getAllMessagesApi = async () => {
  try {
    const response = await api.get("/contact/all-messages");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const deleteContactMessageApi = async (id: string) => {
  try {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting message:", error);
    throw error;
  }
};
