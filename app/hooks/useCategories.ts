import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categoryApi';
import { ICategory } from '@/types/category';


export const useCategories = () => {
  return useQuery<ICategory[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, 
  });
};