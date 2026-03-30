
import { useQuery } from '@tanstack/react-query';
import { getAllFaqs } from '../modules/faq/faq.api';

export const useFaqs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: getAllFaqs,
    staleTime: 1000 * 60 * 10, 
  });
};