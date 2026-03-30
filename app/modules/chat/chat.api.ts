/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

export const getChatHistoryFromDB = async (orderId: string): Promise<{
  success: boolean;
  message: string;
  data: any;
}> => {
  const response = await api.get(`/chats/${orderId}`);
  return response.data;
};

export const sendMessageApi = async (messageData: {
  orderId: string;
  sender: string;
  senderModel: "User" | "Rider";
  message: string;
}) => {
  const response = await api.post("/chats/send", messageData);
  return response.data;
};


export const markChatAsReadApi = async (orderId: string) => {
  const response = await api.patch(`/chat/read/${orderId}`);
  return response.data;
};