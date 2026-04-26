/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from "@tanstack/react-query";
import { getAllFaqs } from "../modules/faq/faq.api";

export const useFaqs = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["faqs", params], 
    queryFn: () => getAllFaqs(params),
    staleTime: 1000 * 60 * 10, 
  });
};