
"use client";

import { useQuery } from '@tanstack/react-query';
import { IEvent } from "@/types/event";
import { getEvents } from '../api/event';

export const useEvents = () => {
  return useQuery<IEvent[]>({
    queryKey: ["events"],
    queryFn: getEvents,
  });
};

