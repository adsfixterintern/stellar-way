import { useQuery } from "@tanstack/react-query";
import { checkTableAvailability } from "@/app/modules/booking/booking.api";

export const useAvailability = (date: string, startTime: string, endTime: string) => {
  return useQuery({
    queryKey: ["availability", date, startTime, endTime],
    queryFn: async () => {
      const response = await checkTableAvailability(date, startTime, endTime);
      return response.data || []; // শুধু আইডিগুলোর অ্যারে রিটার্ন করবে
    },
    // কন্ডিশন: তারিখ এবং সময় না থাকলে কল হবে না
    enabled: !!(date && startTime && endTime && startTime < endTime),
    staleTime: 1000 * 60 * 5, // ৫ মিনিট পর্যন্ত ক্যাশ থাকবে
  });
};