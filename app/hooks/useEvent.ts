"use client";

import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../modules/event/event.api'; 

export const useEvents = (query = "") => {
  return useQuery({
    queryKey: ["events", query], 
    queryFn: () => getEvents(query),
  });
};
