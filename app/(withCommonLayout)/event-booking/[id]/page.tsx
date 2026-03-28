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
} from "lucide-react";
import { getSingleEventFromDB } from "@/app/modules/event/event.api";
import SingleHero from "@/components/shared/SingleHero";
import { toast, Toaster } from "react-hot-toast";

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      return toast.error("Please select both date and time to proceed");
    }

    // চেকআউট পেজে ডাটা পাঠিয়ে দেওয়া
    const checkoutUrl = `/event-pay?type=event&id=${id}&date=${selectedDate}&time=${selectedTime}&price=${event.price}`;

    toast.success("Redirecting to checkout...");
    router.push(checkoutUrl);
  };
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getSingleEventFromDB(id as string);
        if (data.success) setEvent(data.data);
      } catch (error) {
        console.error("Error loading event");
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
      <Toaster />
      <SingleHero
        isCenter={true}
        subtitle="EXCLUSIVE EXPERIENCE"
        title={event.title}
        description={
          event.subTitle || "Join us for a curated culinary journey."
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* বাম পাশে ইমেজ এবং ডিটেইলস */}
          <div className="lg:col-span-7 space-y-10">
            <div className="relative h-[400px] md:h-[600px] rounded-[32px] overflow-hidden shadow-sm">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="px-2">
              <h2 className="text-3xl font-black text-[#1D3A15] mb-6 tracking-tight">
                Experience Details
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                Our {event.title} is more than just an event; it's a celebration
                of culinary excellence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {[
                  "Professional Guidance",
                  "Premium Ingredients",
                  "Tasting Session",
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
            <div className="bg-[#F8F9F8] rounded-[40px] p-10 border border-gray-100">
              <div className="mb-10 pb-6 border-b border-gray-200/50 text-center lg:text-left">
                <p className="text-4xl font-black text-[#1D3A15]">
                  ৳{event.price}
                </p>
              </div>

              {/* ২. ইনপুট ফিল্ডস - এখান থেকে ডাটা সিলেক্ট হবে */}
              <div className="space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Choose Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1D3A15]/5 transition-all"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Choose Time Slot
                  </label>
                  <select
                    className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1D3A15]/5 transition-all cursor-pointer"
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select a slot</option>
                    <option value="12:00 PM">12:00 PM (Lunch)</option>
                    <option value="04:00 PM">04:00 PM (Snacks)</option>
                    <option value="08:00 PM">08:00 PM (Dinner)</option>
                  </select>
                </div>

                <hr className="border-gray-100 my-6" />

                {/* ৩. স্ট্যাটিক প্রিভিউ সেকশন */}
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ring-1 ring-black/5">
                    <CalendarIcon size={20} className="text-[#3D5334]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Your Selected Date
                    </p>
                    <p className="font-bold text-[#1D3A15]">
                      {selectedDate ? selectedDate : "Pick a date above"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ring-1 ring-black/5">
                    <Clock size={20} className="text-[#3D5334]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Preferred Slot
                    </p>
                    <p className="font-bold text-[#1D3A15]">
                      {selectedTime ? selectedTime : "Select your time"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ring-1 ring-black/5">
                    <MapPin size={20} className="text-[#3D5334]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Location
                    </p>
                    <p className="font-bold text-[#1D3A15]">Savory Nest Hall</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!selectedDate || !selectedTime) {
                    return toast.error("Please select date and time");
                  }

                  toast.success("Proceeding to reservation");

                  const queryParams = new URLSearchParams({
                    eventId: id as string,
                    date: selectedDate,
                    time: selectedTime,
                    price: event.price.toString(),
                    title: event.title,
                  }).toString();

                  router.push(`/event-pay?${queryParams}`);
                }}
                className="w-full bg-[#1D3A15] text-white py-6 rounded-2xl font-black uppercase tracking-[0.1em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#1D3A15]/10 active:scale-95"
              >
                CONFIRM RESERVATION <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
