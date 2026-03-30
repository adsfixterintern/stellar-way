"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import {
  Calendar,
  Clock,
  CreditCard,
  Lock,
  Phone,
} from "lucide-react";
import {
  createSSLBooking,
  createStripeBooking,
} from "@/app/modules/eventBooking/eventBooking.api";
import SingleHero from "@/components/shared/SingleHero";

type ExtendedUser = {
  id?: string;
  _id?: string;
  name?: string | null;
  email?: string | null;
};

const EventPayContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const eventId = searchParams.get("eventId");
  const title = searchParams.get("title");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const price = Number(searchParams.get("price") || 0);

  const user = session?.user as ExtendedUser;

  const handleBookingPayment = async (method: "SSL" | "Stripe") => {
    if (!session?.user) return toast.error("Please login to complete booking");

    if (!phoneNumber || phoneNumber.length < 11) {
      return toast.error("Please enter a valid phone number");
    }

    setIsProcessing(true);
    const loadingToast = toast.loading(`Connecting to ${method}...`);

    const bookingData = {
      userId: user?.id || user?._id,
      eventId: eventId,
      userName: user?.name,
      userEmail: user?.email,
      numberOfSeats: 1,
      phone: phoneNumber,
      date: date,
      time: time,
    };

    try {
      const response =
        method === "SSL"
          ? await createSSLBooking(bookingData)
          : await createStripeBooking(bookingData);

      if (response.success && response.data?.paymentUrl) {
        toast.success("Redirecting to gateway...");
        setTimeout(() => {
          window.location.href = response.data.paymentUrl;
        }, 1000);
      } else {
        toast.error(response.message || "Gateway error");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Network error, try again.");
      setIsProcessing(false);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="bg-[#F4F7F2] min-h-screen pb-24">
      <Toaster />

      <SingleHero
        isCenter={true}
        subtitle="SECURE CHECKOUT"
        title="Complete Your Reservation"
        description={`Confirming your spot for: ${
          title || "Exclusive Event"
        }`}
      />

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-10 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-lg font-extrabold text-[#1D3A15] mb-8 uppercase tracking-[0.2em]">
                Review Booking
              </h3>

              {/* PHONE */}
              <div className="mb-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">
                  Contact Information
                </label>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone
                      size={18}
                      className="text-gray-400 group-focus-within:text-[#1D3A15]"
                    />
                  </div>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl font-semibold text-[#1D3A15] focus:border-[#1D3A15] focus:ring-2 focus:ring-[#1D3A15]/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="space-y-6">
                <div className="flex items-center justify-between py-5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500 uppercase">
                      Date
                    </span>
                  </div>
                  <span className="font-black text-[#1D3A15]">
                    {date}
                  </span>
                </div>

                <div className="flex items-center justify-between py-5">
                  <div className="flex items-center gap-4">
                    <Clock size={18} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500 uppercase">
                      Slot
                    </span>
                  </div>
                  <span className="font-black text-[#1D3A15]">
                    {time}
                  </span>
                </div>
              </div>

              {/* TOTAL */}
              <div className="mt-10 p-7 bg-gradient-to-r from-[#1D3A15] to-[#2F4F2F] rounded-2xl text-white flex justify-between items-center shadow-lg">
                <span className="font-bold uppercase tracking-widest text-xs opacity-70">
                  Total
                </span>
                <span className="text-3xl font-black">৳{price}</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-10 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <Lock size={16} className="text-[#3D5334]" />
                <h3 className="text-xs font-extrabold text-[#1D3A15] uppercase tracking-[0.2em]">
                  Payment Method
                </h3>
              </div>

              <div className="space-y-4">
                {/* SSL */}
                <button
                  disabled={isProcessing || phoneNumber.length < 11}
                  onClick={() => handleBookingPayment("SSL")}
                  className="w-full group p-5 rounded-xl border border-gray-200 hover:border-[#1D3A15] hover:bg-[#F4F7F2] transition-all flex items-center justify-between disabled:opacity-50 active:scale-[0.98]"
                >
                  <span className="font-black text-[#1D3A15] uppercase text-xs">
                    SSLCommerz
                  </span>
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 group-hover:border-[#1D3A15]"></div>
                </button>

                {/* STRIPE */}
                <button
                  disabled={isProcessing || phoneNumber.length < 11}
                  onClick={() => handleBookingPayment("Stripe")}
                  className="w-full group p-5 rounded-xl border border-gray-200 hover:border-[#1D3A15] hover:bg-[#F4F7F2] transition-all flex items-center justify-between disabled:opacity-50 active:scale-[0.98]"
                >
                  <span className="font-black text-[#1D3A15] uppercase text-xs">
                    Stripe
                  </span>
                  <CreditCard className="text-gray-400 group-hover:text-[#1D3A15]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Suspense wrapper
const EventPayPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EventPayContent />
  </Suspense>
);

export default EventPayPage;