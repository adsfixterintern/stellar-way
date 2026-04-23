/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";
import { IFeedback, IFeedbackResponse } from "./feedback.interface";

export const createFeedbackApi = async (payload: Partial<IFeedback>) => {
  const response = await api.post("/feedback/create-feedback", payload);
  return response.data;
};

export const getAllPublishedFeedbacks =
  async (): Promise<IFeedbackResponse> => {
    const response = await api.get(
      "/feedback/all-feedback?status=published&limit=3",
    );
    return response.data;
  };


export const getAllFeedbacksForAdmin = async (
  page = 1,
  limit = 10,
): Promise<IFeedbackResponse> => {
  const response = await api.get(
    `/feedback/all-feedback?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const updateFeedbackApi = async (
  id: string,
  payload: Partial<IFeedback>,
) => {
  const response = await api.patch(`/feedback/${id}`, payload);
  return response.data;
};

export const deleteFeedbackApi = async (id: string) => {
  const response = await api.delete(`/feedback/${id}`);
  return response.data;
};