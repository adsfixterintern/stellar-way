import api from "@/utils/apiInstance";
import { IBooking, ICreateBookingRequest } from "./booking.interface";

export const createBooking = async (bookingData: ICreateBookingRequest): Promise<{ success: boolean; data: IBooking; message: string }> => {
  const response = await api.post('/bookings/create-booking', bookingData);
  return response.data;
};