import { useQuery } from '@tanstack/react-query';
import { getMyBookings } from '../modules/eventBooking/eventBooking.api';


export const useMyBookings = (userId: string) => {
  return useQuery({
    queryKey: ["my-bookings", userId],
    queryFn: () => getMyBookings(userId),
    enabled: !!userId, 
  
    staleTime: 5 * 60 * 1000, 
  });
};