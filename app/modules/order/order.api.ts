import api from "@/utils/apiInstance";

export const createSSLOrder = async (data: any) => {
  const response = await api.post('/orders/create-order', data);
  return response.data;
};

export const createStripeOrder = async (data: any) => {
  const response = await api.post('/orders/create-stripe-order', data);
  return response.data;
};

export const getMyOrdersFromDB = async (email: string) => {
  const response = await api.get(`/orders/${email}`);
  return response.data;
};

