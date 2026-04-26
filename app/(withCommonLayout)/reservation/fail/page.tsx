"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, Home, AlertCircle, PhoneCall } from "lucide-react";

const BookingFailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL theke query parameter nibe (jodi thake)
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-2xl text-center relative overflow-hidden border border-red-50">
        {/* Top Danger Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

        {/* Error Icon */}
        <div className="mb-6 mt-4 flex justify-center">
          <div className="bg-red-50 p-5 rounded-full animate-pulse">
            <XCircle size={60} className="text-red-500" />
          </div>
        </div>

        {/* Title & Message */}
        <h1 className="text-3xl font-black text-[#1D3A15] mb-2 uppercase tracking-tight">
          Payment Failed!
        </h1>
        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
          Oops! Something went wrong with your transaction. No worries, if any
          amount was deducted, it will be refunded automatically.
        </p>

        {/* Transaction Summary (Optional) */}
        {transactionId && (
          <div className="bg-red-50 rounded-[24px] p-5 mb-8 border border-red-100 text-left">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[2px] mb-1">
              Reference ID
            </p>
            <p className="text-sm font-mono font-bold text-red-700 break-all">
              {transactionId}
            </p>
          </div>
        )}

        {/* Helpful Note */}
        <div className="mb-8 text-left bg-orange-50 p-4 rounded-2xl flex gap-3 items-start border border-orange-100">
          <AlertCircle size={20} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-[11px] text-orange-700 leading-relaxed">
            Common reasons: Insufficient balance, network timeout, or incorrect
            card details. Please try again from the bookings page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/reservation")} 
            className="w-full bg-[#1D3A15] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-green-900/10"
          >
            <ArrowLeft size={18} /> Back to Reservations
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-white text-gray-500 font-bold py-4 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Home size={18} /> Go to Homepage
          </button>
        </div>

        {/* Support Section */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
          <PhoneCall size={14} />
          <span className="text-[11px] font-medium uppercase tracking-wider">
            Call Support: +880 1XXX XXXXXX
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingFailPage;
