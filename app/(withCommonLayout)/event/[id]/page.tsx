/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Users,
  ArrowRight,
  Loader2,
  Clock,
  MapPin,
  CheckCircle,
  Ticket,
} from "lucide-react";
import { getSingleEventFromDB } from "@/app/modules/event/event.api";
import SingleHero from "@/components/shared/SingleHero";
import { toast } from "react-hot-toast";

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getSingleEventFromDB(id as string);
        if (data.success) {
          setEvent(data.data);
          setSelectedDate(data.data.date);
        }
      } catch (error) {
        console.error("Error loading event");
        toast.error("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#1D3A15]" size={32} />
      </div>
    );

  if (!event)
    return <div className="text-center py-20 font-bold">Event not found!</div>;

  return (
    <div className="bg-white min-h-screen">
      <SingleHero
        isCenter={true}
        subtitle="EXCLUSIVE EXPERIENCE"
        title={event.title}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-10">
            <div className="relative h-[400px] md:h-[600px] rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              {/* Seats Info Overlay */}
              <div className="absolute bottom-8 left-8 flex flex-col md:flex-row gap-3">
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                  <Users size={20} className="text-[#3D5334]" />
                  <span className="font-black text-[#1D3A15]">
                    {event.availableSeat} Available
                  </span>
                </div>
                <div className="bg-black/80 backdrop-blur px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                  <Ticket size={20} className="text-white" />
                  <span className="font-black text-white">
                    {event.seat} Total Capacity
                  </span>
                </div>
              </div>
            </div>

            <div className="px-2">
              <h2 className="text-3xl font-black text-[#1D3A15] mb-6 tracking-tight">
                About the Experience
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                {event.subTitle ||
                  `Our ${event.title} is a premium culinary event designed for
                enthusiasts. Experience the finest flavors and expert techniques
                in a cozy setting.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {[
                  "Professional Guidance",
                  "Premium Ingredients",
                  "Live Cooking",
                  "Networking",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-[#1D3A15] font-bold text-sm uppercase"
                  >
                    <CheckCircle size={18} className="text-[#3D5334]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ডান পাশে বুকিং কার্ড */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-[#F8F9F8] rounded-[40px] p-10 border border-gray-100 shadow-sm">
              <div className="mb-10 pb-6 border-b border-gray-200/50 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Ticket Price
                  </p>
                  <p className="text-4xl font-black text-[#1D3A15]">
                    ৳{event.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${event.status === "active" ? "bg-[#1D3A15] text-white" : "bg-red-500 text-white"}`}
                  >
                    {event.status}
                  </span>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1D3A15]/5 transition-all bg-white font-bold text-[#1D3A15]"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <hr className="border-gray-200/50 my-6" />

                {/* Event Schedule Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                      <Clock size={20} className="text-[#3D5334]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                        Fixed Time Slot
                      </p>
                      <p className="font-bold text-[#1D3A15] uppercase">
                        {event.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                      <Users size={20} className="text-[#3D5334]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                        Seat Status
                      </p>
                      <p className="font-bold text-[#1D3A15]">
                        {event.availableSeat} / {event.seat} Seats Left
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                      <MapPin size={20} className="text-[#3D5334]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                        Location
                      </p>
                      <p className="font-bold text-[#1D3A15]">
                        Savory Nest Main Hall
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={event.availableSeat <= 0 || event.status !== "active"}
                onClick={() => {
                  if (!selectedDate) {
                    return toast.error("Please select a date");
                  }

                  const queryParams = new URLSearchParams({
                    eventId: id as string,
                    date: selectedDate,
                    time: event.time,
                    price: event.price.toString(),
                    title: event.title,
                  }).toString();

                  router.push(`/event-pay?${queryParams}`);
                }}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
                  event.availableSeat <= 0 || event.status !== "active"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-[#1D3A15] text-white hover:bg-black shadow-[#1D3A15]/10"
                }`}
              >
                {event.availableSeat <= 0
                  ? "FULLY BOOKED"
                  : "PROCEED TO BOOKING"}{" "}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
