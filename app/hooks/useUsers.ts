/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../api/userApi';


export const useUsers = (params?: Record<string, any>) => {
  return useQuery({ 
    queryKey: ['users', params], 
    queryFn: () => getAllUsers(params),
    staleTime: 1000 * 60 * 5, 
  });
};