/* eslint-disable @typescript-eslint/no-explicit-any */
// import api from "@/utils/apiInstance";
// import { IBooking, ICreateBookingRequest } from "./booking.interface";

// // Create
// export const createBooking = async (bookingData: ICreateBookingRequest) => {
//   const response = await api.post('/bookings/create-booking', bookingData);
//   return response.data;
// };

// // Get My Bookings 
// export const getMyBookingsApi = async (userId: string) => {
//   const response = await api.post('/bookings/my-bookings', { userId });
//   return response.data;
// };

// // Update Booking
// export const updateBookingApi = async (id: string, bookingData: Partial<IBooking>) => {
//   const response = await api.patch(`/bookings/${id}`, bookingData);
//   return response.data;
// };

// // Delete Booking
// export const deleteBookingApi = async (id: string) => {
//   const response = await api.delete(`/bookings/${id}`);
//   return response.data;
// };

// export const checkTableAvailability = async (date: string, startTime: string, endTime: string) => {
//   const response = await api.get('/bookings/check-availability', {
//     params: {
//       date,
//       startTime,
//       endTime
//     }
//   });
//   return response.data;
// };



import api from "@/utils/apiInstance";
import { IBooking } from "./booking.interface";

// ১. SSLCommerz এর মাধ্যমে বুকিং তৈরি
export const createSSLBookingApi = async (bookingData: any) => {
  const response = await api.post('/bookings/create-ssl-booking', bookingData);
  return response.data;
};

// ২. Stripe এর মাধ্যমে বুকিং তৈরি
export const createStripeBookingApi = async (bookingData: any) => {
  const response = await api.post('/bookings/create-stripe-booking', bookingData);
  return response.data;
};

// ৩. ইউজার নিজের সব বুকিং দেখবে (আমরা ব্যাকএন্ডে GET এবং params সেট করেছি)
export const getMyBookingsApi = async (userId: string) => {
  const response = await api.get(`/bookings/my-bookings/${userId}`);
  return response.data;
};

// ৪. টেবিল অ্যাভেইলেবিলিটি চেক করা (Query Params ব্যবহার করে)
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

// ৫. সিঙ্গেল বুকিং ডিটেইলস দেখা
export const getSingleBookingApi = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// ৬. বুকিং আপডেট করা
export const updateBookingApi = async (id: string, bookingData: Partial<IBooking>) => {
  const response = await api.patch(`/bookings/${id}`, bookingData);
  return response.data;
};

// ৭. বুকিং ডিলিট করা
export const deleteBookingApi = async (id: string) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// ৮. অ্যাডমিনের জন্য সব বুকিং দেখা (ফিল্টার সহ)
export const getAllBookingsApi = async (query?: Record<string, any>) => {
  const response = await api.get('/bookings', { params: query });
  return response.data;
};