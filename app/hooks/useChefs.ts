import { useQuery } from '@tanstack/react-query';
import { getChefs } from '../api/chefApi';
import { IChef } from '@/types/menu';


export const useChefs = () => {
  return useQuery<IChef[]>({
    queryKey: ['chefs'],
    queryFn: getChefs,
    staleTime: 1000 * 60 * 60, 
  });
};