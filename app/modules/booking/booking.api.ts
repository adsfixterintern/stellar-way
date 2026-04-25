import api from "@/utils/apiInstance";
import { IBooking, ICreateBookingRequest } from "./booking.interface";

// Create
export const createBooking = async (bookingData: ICreateBookingRequest) => {
  const response = await api.post('/bookings/create-booking', bookingData);
  return response.data;
};

// Get My Bookings 
export const getMyBookingsApi = async (userId: string) => {
  const response = await api.post('/bookings/my-bookings', { userId });
  return response.data;
};

// Update Booking
export const updateBookingApi = async (id: string, bookingData: Partial<IBooking>) => {
  const response = await api.patch(`/bookings/${id}`, bookingData);
  return response.data;
};

// Delete Booking
export const deleteBookingApi = async (id: string) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

export const checkTableAvailability = async (date: string, startTime: string, endTime: string) => {
  const response = await api.get('/bookings/check-availability', {
    params: {
      date,
      startTime,
      endTime
    }
  });
  return response.data;
};