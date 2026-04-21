/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import SingleHero from "@/components/shared/SingleHero";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, ArrowRight, Loader2, MapPin } from "lucide-react";
import { getAllEventsFromDB } from "@/app/modules/event/event.api";
import Contact from "@/components/shared/Contact";

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPage: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await getAllEventsFromDB(page, 3);
      if (data.success) {
        setEvents(data.data);
        setMeta(data.meta);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(events)

  useEffect(() => {
    fetchEvents(meta.page);
  }, [meta.page]);

  return (
    <div className="bg-[#FCFCFC] min-h-screen pb-24">
      <SingleHero
        isCenter={true}
        subtitle="Exclusive"
        title="Savory Events"
        description="Join our curated culinary journeys and masterclasses."
      />

      <div className="max-w-6xl mx-auto px-6 mt-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#1D3A15]" size={32} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col"
                >
                  {/* Compact Image Section */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1D3A15] shadow-sm">
                        {event.status}
                      </span>
                    </div>
                  </div>

                  {/* Minimalist Content Section */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-[#1D3A15] leading-tight group-hover:text-black transition-colors">
                        {event.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#3D5334]" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-[#3D5334]" />
                        <span>{event.seat} Left</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Price per seat</p>
                        <p className="text-lg font-black text-[#1D3A15]">৳{event.price}</p>
                      </div>
                      
                      <Link
                        href={`/event-booking/${event._id}`}
                        className="bg-[#1D3A15] text-white h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-black transition-all active:scale-90 shadow-lg shadow-[#1D3A15]/20"
                      >
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Pagination */}
            {meta.totalPage > 1 && (
              <div className="flex justify-center mt-20 gap-3 items-center">
                <button
                  disabled={meta.page === 1}
                  onClick={() => setMeta({ ...meta, page: meta.page - 1 })}
                  className="h-10 px-5 rounded-xl border border-gray-100 text-xs font-bold uppercase tracking-tighter hover:bg-white hover:shadow-sm disabled:opacity-20 transition-all"
                >
                  Prev
                </button>
                <div className="bg-white px-4 py-2 rounded-xl border border-gray-50 shadow-sm text-xs font-black text-[#1D3A15]">
                   {meta.page} <span className="text-gray-300 mx-1">/</span> {meta.totalPage}
                </div>
                <button
                  disabled={meta.page === meta.totalPage}
                  onClick={() => setMeta({ ...meta, page: meta.page + 1 })}
                  className="h-10 px-5 rounded-xl bg-[#1D3A15] text-white text-xs font-bold uppercase tracking-tighter hover:bg-black disabled:opacity-20 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Contact></Contact>
    </div>
  );
};

export default EventsPage;