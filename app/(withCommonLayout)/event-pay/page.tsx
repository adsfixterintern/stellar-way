"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  CreditCard,
  Lock,
  Phone,
  Users,
  Info,
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
  const [seatCount, setSeatCount] = useState(1);

  const eventId = searchParams.get("eventId");
  const title = searchParams.get("title");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const unitPrice = Number(searchParams.get("price") || 0);

  const user = session?.user as ExtendedUser;

  // মোট দাম ক্যালকুলেশন
  const totalPrice = unitPrice * seatCount;

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
      eventName: title, // ইভেন্টের নাম পাঠানো হচ্ছে
      userName: user?.name,
      userEmail: user?.email,
      numberOfSeats: seatCount, // সিলেক্ট করা সিট সংখ্যা
      phone: phoneNumber,
      date: date,
      time: time,
      totalAmount: totalPrice, // মোট টাকা
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

      <SingleHero
        isCenter={true}
        subtitle="SECURE CHECKOUT"
        title="Complete Your Reservation"
        description={`Confirming your spot for: ${title || "Exclusive Event"}`}
      />

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT SECTION */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-10 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-extrabold text-[#1D3A15] mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                <Info size={20} /> Review Booking
              </h3>

              {/* PHONE & SEATS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
                    Contact Number
                  </label>
                  <div className="relative group">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1D3A15]"
                    />
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold text-[#1D3A15] outline-none focus:border-[#1D3A15] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">
                    Number of Seats
                  </label>
                  <div className="relative group">
                    <Users
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1D3A15]"
                    />
                    <select
                      value={seatCount}
                      onChange={(e) => setSeatCount(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl font-bold text-[#1D3A15] outline-none focus:border-[#1D3A15] appearance-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Seat" : "Seats"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* EVENT INFO */}
              <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-wider">
                    <Calendar size={16} /> Date
                  </div>
                  <span className="font-black text-[#1D3A15]">{date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-wider">
                    <Clock size={16} /> Scheduled Time
                  </div>
                  <span className="font-black text-[#1D3A15]">{time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-wider">
                    <Users size={16} /> Unit Price
                  </div>
                  <span className="font-black text-[#1D3A15]">
                    ৳{unitPrice}
                  </span>
                </div>
              </div>

              {/* TOTAL AMOUNT */}
              <div className="mt-8 p-8 bg-[#1D3A15] rounded-2xl text-white flex justify-between items-center shadow-xl shadow-[#1D3A15]/20">
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                    Total Payable Amount
                  </span>
                  <span className="text-3xl font-black">৳{totalPrice}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                    Reservation For
                  </span>
                  <span className="text-sm font-bold">
                    {seatCount} Person(s)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION (PAYMENT) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-10 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <Lock size={16} className="text-[#3D5334]" />
                <h3 className="text-xs font-extrabold text-[#1D3A15] uppercase tracking-[0.2em]">
                  Secure Payment Method
                </h3>
              </div>

              <div className="space-y-4">
                <button
                  disabled={isProcessing || phoneNumber.length < 11}
                  onClick={() => handleBookingPayment("SSL")}
                  className="w-full group p-5 rounded-2xl border-2 border-gray-100 hover:border-[#1D3A15] hover:bg-[#F4F7F2] transition-all flex items-center justify-between disabled:opacity-50 active:scale-[0.98]"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-black text-[#1D3A15] uppercase text-xs">
                      SSLCommerz
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      Local Cards / Mobile Banking
                    </span>
                  </div>
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 group-hover:border-[#1D3A15] flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-[#1D3A15] transition-all"></div>
                  </div>
                </button>

                <button
                  disabled={isProcessing || phoneNumber.length < 11}
                  onClick={() => handleBookingPayment("Stripe")}
                  className="w-full group p-5 rounded-2xl border-2 border-gray-100 hover:border-[#1D3A15] hover:bg-[#F4F7F2] transition-all flex items-center justify-between disabled:opacity-50 active:scale-[0.98]"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-black text-[#1D3A15] uppercase text-xs">
                      International Card
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      Powered by Stripe
                    </span>
                  </div>
                  <CreditCard
                    className="text-gray-300 group-hover:text-[#1D3A15] transition-colors"
                    size={24}
                  />
                </button>
              </div>

              <p className="mt-8 text-[9px] text-gray-400 font-bold uppercase text-center leading-relaxed tracking-widest">
                By clicking, you agree to our <br /> Terms of Service & Refund
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventPayPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center font-black text-[#1D3A15] uppercase tracking-widest">
        Loading Gateway...
      </div>
    }
  >
    <EventPayContent />
  </Suspense>
);

export default EventPayPage;
