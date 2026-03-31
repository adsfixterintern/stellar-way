

"use client";

import { useQuery } from '@tanstack/react-query';
import { getMenus } from '../api/menuApi';


export const useMenu = (categoryId?: string) => {
  return useQuery({
    queryKey: ['menus', categoryId],
    queryFn: () => getMenus(categoryId), 
    staleTime: 0, 
    refetchOnMount: true, 
  });
};

