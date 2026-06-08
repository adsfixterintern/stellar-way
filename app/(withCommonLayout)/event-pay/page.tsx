/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useState, useMemo } from "react";
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
  ChevronDown,
  LogIn,
} from "lucide-react";
import { countries, getEmojiFlag, TCountryCode } from "countries-list";
import {
  createSSLBooking,
  createStripeBooking,
} from "@/app/modules/eventBooking/eventBooking.api";
import SingleHero from "@/components/shared/SingleHero";

const EventPayContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [seatCount, setSeatCount] = useState(1);
  const [countryCode, setCountryCode] = useState("+880");

  const countryOptions = useMemo(() => {
    return Object.entries(countries)
      .map(([code, country]) => ({
        name: country.name,
        phone: `+${country.phone[0]}`,
        emoji: getEmojiFlag(code as TCountryCode),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const eventId = searchParams.get("eventId");
  const title = searchParams.get("title");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const unitPrice = Number(searchParams.get("price") || 0);

  const user = session?.user as any;
  const totalPrice = unitPrice * seatCount;
  const isValidPhone = phoneNumber.length === 10;

  const handleBookingPayment = async (method: "SSL" | "Stripe") => {
    if (!isValidPhone)
      return toast.error("Phone number must be exactly 11 digits");
    setIsProcessing(true);
    const loadingToast = toast.loading(`Initiating ${method} Gateway...`);

    const bookingData = {
      userId: user?.id || user?._id,
      eventId: eventId,
      eventName: title,
      userName: user?.name,
      userEmail: user?.email,
      numberOfSeats: seatCount,
      phone: `${countryCode}${phoneNumber}`,
      date: date,
      time: time,
      totalAmount: totalPrice,
    };

    try {
      const response =
        method === "SSL"
          ? await createSSLBooking(bookingData)
          : await createStripeBooking(bookingData);
      if (response.success && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || "Failed to load gateway");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Network instability detected.");
      setIsProcessing(false);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="bg-[#F4F7F2] min-h-screen pb-24">
      <SingleHero
        isCenter={true}
        subtitle="Secure Transaction"
        title="Payment Gateway"
        description={
          status === "unauthenticated"
            ? "Login to complete your booking"
            : `Booking for: ${title || "Selected Event"}`
        }
      />

      <div className="max-w-6xl mx-auto px-6 mt-20 relative z-10">
        {status === "unauthenticated" ? (
          <div className="bg-white rounded-[40px] p-12 md:p-20 shadow-xl border border-white text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-8 mx-auto animate-pulse">
              <Lock size={36} />
            </div>
            <h2 className="text-3xl font-black text-[#1D3A15] uppercase tracking-tighter italic mb-4">
              Access Restricted
            </h2>
            <p className="text-gray-500 font-bold text-xs tracking-[2px] uppercase mb-10 leading-relaxed">
              For security reasons, you must be logged in <br /> to access the
              checkout system.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-3 bg-[#1D3A15] text-white px-12 py-5 rounded-2xl cursor-pointer font-black  text-sm  active:scale-95 transition-all shadow-2xl shadow-green-900/30 mx-auto"
            >
              <LogIn size={20} /> Please log in first
            </button>
          </div>
        ) : (
          /* লগইন থাকলে মেইন পেমেন্ট ফর্ম দেখাবে */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Side */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-white">
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-1.5 h-8 bg-[#1D3A15] rounded-full" />
                  <h3 className="text-xl font-black text-[#1D3A15] uppercase italic tracking-tighter">
                    Enter Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-1">
                      Contact Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative shrink-0">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="h-16 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-[#1D3A15] outline-none focus:bg-white focus:border-[#1D3A15] transition-all appearance-none cursor-pointer"
                        >
                          {countryOptions.map((c, index) => (
                            <option key={index} value={c.phone}>
                              {c.emoji} {c.phone}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                      <div className="relative flex-1 group">
                        <Phone
                          size={18}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1D3A15]"
                        />
                        <input
                          type="text"
                          // যেহেতু '০' কান্ট্রি কোড থেকে আসছে, তাই এখানে ১০ ডিজিট লিমিট থাকবে
                          maxLength={10}
                          placeholder="17XXXXXXXX"
                          value={phoneNumber}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            // যদি ইউজার ভুলে শুরুতে '0' টাইপ করে ফেলে, সেটা অটো রিমুভ করে দিবে
                            if (val.startsWith("0")) {
                              setPhoneNumber(val.substring(1));
                            } else {
                              setPhoneNumber(val);
                            }
                          }}
                          className={`w-full h-16 pl-14 pr-4 bg-gray-50 border ${
                            phoneNumber && phoneNumber.length !== 10
                              ? "border-red-200"
                              : "border-gray-100"
                          } rounded-2xl font-bold text-[#1D3A15] outline-none focus:bg-white focus:border-[#1D3A15] transition-all shadow-inner`}
                        />
                      </div>
                    </div>
                    {phoneNumber && phoneNumber.length !== 10 && (
                      <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ml-2">
                        Enter 10 digits (Excluding the first 0)
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-1">
                      Number of Guests
                    </label>
                    <div className="relative group">
                      <Users
                        size={18}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1D3A15]"
                      />
                      <select
                        value={seatCount}
                        onChange={(e) => setSeatCount(Number(e.target.value))}
                        className="w-full h-16 pl-14 pr-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[#1D3A15] outline-none focus:bg-white focus:border-[#1D3A15] appearance-none transition-all cursor-pointer shadow-inner"
                      >
                        {[1, 2, 3, 4, 5, 8, 10].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Person" : "People"}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-14 p-10 bg-[#1D3A15] rounded-[32px] text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl shadow-green-900/30 border-b-4 border-black/20">
                  <div className="text-center md:text-left">
                    <span className="block text-[10px] font-black uppercase tracking-[4px] opacity-40 mb-3">
                      Net Payable Amount
                    </span>
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      <span className="text-5xl font-black italic tracking-tighter font-serif">
                        ৳{totalPrice}
                      </span>
                      <span className="text-xs font-bold opacity-60">
                        / BDT
                      </span>
                    </div>
                  </div>
                  <div className="w-full md:w-px h-px md:h-14 bg-white/10" />
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-[4px] opacity-40 mb-1 text-gray-300">
                      Summary
                    </p>
                    <p className="font-black text-xl italic text-green-400">
                      {seatCount} Attendee(s)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Side */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[40px] p-8 border border-white shadow-xl shadow-gray-200/50 sticky top-24">
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                  <div className="p-3 bg-green-50 text-[#1D3A15] rounded-2xl">
                    <Lock size={20} />
                  </div>
                  <h4 className="text-xs font-black text-[#1D3A15] uppercase tracking-widest">
                    Secure Check-out
                  </h4>
                </div>
                <div className="space-y-4">
                  <button
                    disabled={isProcessing || !isValidPhone}
                    onClick={() => handleBookingPayment("SSL")}
                    className="w-full group p-6 rounded-[24px] border-2 border-gray-50 hover:border-[#1D3A15] hover:bg-green-50/30 transition-all flex items-center justify-between disabled:opacity-40 disabled:grayscale active:scale-95"
                  >
                    <div className="text-left">
                      <span className="block font-black text-[#1D3A15] text-[11px] uppercase tracking-widest">
                        SSLCommerz
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        Local MFS & Cards
                      </span>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-[#1D3A15] flex items-center justify-center transition-all">
                      <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[#1D3A15]" />
                    </div>
                  </button>

                  <button
                    disabled={isProcessing || !isValidPhone}
                    onClick={() => handleBookingPayment("Stripe")}
                    className="w-full group p-6 rounded-[24px] border-2 border-gray-100 hover:border-[#1D3A15] hover:bg-green-50/30 transition-all flex items-center justify-between disabled:opacity-40 disabled:grayscale active:scale-95"
                  >
                    <div className="text-left">
                      <span className="block font-black text-[#1D3A15] text-[11px] uppercase tracking-widest">
                        International
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                        Stripe Powered
                      </span>
                    </div>
                    <CreditCard
                      size={22}
                      className="text-gray-300 group-hover:text-[#1D3A15] transition-colors"
                    />
                  </button>
                </div>
                <div className="mt-12 bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex gap-3 items-start">
                    <Info size={16} className="text-[#1D3A15] mt-1 shrink-0" />
                    <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
                      Please review the total amount. By proceeding, you agree
                      to our booking terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EventPayPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F4F7F2]">
        <div className="w-16 h-16 border-[6px] border-gray-200 border-t-[#1D3A15] rounded-full animate-spin" />
        <p className="font-black text-[#1D3A15] uppercase tracking-[6px] text-xs animate-pulse">
          Establishing Connection
        </p>
      </div>
    }
  >
    <EventPayContent />
  </Suspense>
);

export default EventPayPage;
