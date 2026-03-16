// "use client";

// import { useQuery } from '@tanstack/react-query';
// import { getMenus } from '../api/menuApi';
// import { IMenu } from '@/types/menu';

// export const useMenu = (category?: string) => {
//   const { 
//     data: menus = [], 
//     isLoading, 
//     isError, 
//     refetch, 
//     isFetching 
//   } = useQuery<IMenu[]>({
    
//     queryKey: ['menus', category],
//     queryFn: () => getMenus(category),
    
  
//     staleTime: 1000 * 60 * 5, 
//     refetchInterval: 5000,    
//     refetchOnWindowFocus: true, 
//   });

//   return { menus, isLoading, isError, refetch, isFetching };
// };

"use client";

import { useQuery } from '@tanstack/react-query';
import { getMenus } from '../api/menuApi';
import { IMenu } from '@/types/menu';

export const useMenu = () => {
  return useQuery<IMenu[]>({
    queryKey: ['menus'], 
    queryFn: getMenus,
    refetchInterval: 5000, 
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, 
  });
};