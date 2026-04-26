// import { useQuery } from '@tanstack/react-query';
// import { getCategories } from '../api/categoryApi';
// import { ICategory } from '@/types/category';


// export const useCategories = () => {
//   return useQuery<ICategory[]>({
//     queryKey: ['categories', "active"],
//     queryFn: getCategories,
//     staleTime: 1000 * 60 * 60, 
//   });
// };

import { useQuery } from '@tanstack/react-query';
// আপনার সঠিক API ফাইল থেকে ইমপোর্ট করুন


import { getAllCategoriesApi } from '../modules/category/category.api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: async () => {
      const response = await getAllCategoriesApi();
      // যদি আপনার API রেসপন্স { success: true, data: [] } ফরম্যাটে হয়
      return response.data; 
    },
    staleTime: 1000 * 60 * 60, 
  });
};