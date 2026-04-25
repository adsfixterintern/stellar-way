/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/utils/apiInstance";

export const createSSLBooking = async (bookingData: any) => {
  const response = await api.post(
    "/event-bookings/create-ssl-booking",
    bookingData,
  );
  return response.data;
};

export const createStripeBooking = async (bookingData: any) => {
  const response = await api.post(
    "/event-bookings/create-stripe-booking",
    bookingData,
  );
  return response.data;
};

export const getMyBookings = async (userId: string) => {
  const response = await api.get(`/event-bookings/my-bookings/${userId}`);
  return response.data;
};

export const getSingleBookingDetails = async (id: string) => {
  const response = await api.get(`/event-bookings/${id}`);
  return response.data;
};

export const getAllBookings = async (query: string = "") => {
  const url = query
    ? `/event-bookings/all-bookings?${query}`
    : "/event-bookings/all-bookings";
  const response = await api.get(url);
  return response.data;
};

export const confirmPayment = async (transactionId: string) => {
  const response = await api.post(
    `/event-bookings/confirm-payment/${transactionId}?status=success`,
  );
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const res = await api.delete(`/event-bookings/${id}`);
  return res.data;
};
