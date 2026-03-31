"use client";

import { useQuery } from '@tanstack/react-query';
import { getMyOrdersFromDB } from '../modules/order/order.api';


export const useMyOrders = (email: string) => {
  return useQuery({
    queryKey: ["my-orders", email],
    queryFn: () => getMyOrdersFromDB(email),
    enabled: !!email, 
  });
};