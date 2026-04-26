import { useQuery } from "@tanstack/react-query";
import { getAllTables } from "../modules/table/table.api";

export const useTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const data = await getAllTables();
      return data;
    },
  });
};