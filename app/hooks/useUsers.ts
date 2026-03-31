/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../api/userApi';


export const useUsers = () => {
  return useQuery<any[]>({ 
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 5, 
  });
};