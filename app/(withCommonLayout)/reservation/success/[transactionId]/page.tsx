"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  Calendar,
  Clock,
  Receipt,
  Home,
  ArrowRight,
} from "lucide-react";

const BookingSuccessPage = () => {
  const params = useParams();
  const router = useRouter();
  const transactionId = params?.transactionId;

  return (
    <div className="min-h-screen bg-[#F0F9F0] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Success Header Background Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#1D3A15]"></div>

        {/* Success Icon */}
        <div className="mb-6 mt-4 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full animate-bounce">
            <CheckCircle size={60} className="text-[#1D3A15]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-[#1D3A15] mb-2 uppercase tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-gray-500 font-medium mb-8">
          Your reservation has been successfully placed. We have sent the
          details to your email.
        </p>

        {/* Transaction Summary Card */}
        <div className="bg-gray-50 rounded-[24px] p-6 mb-8 border border-gray-100 text-left">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] mb-4 border-b pb-2">
            Reservation Details
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Receipt size={18} className="text-[#1D3A15]" />
              <div>
                <p className="text-[10px] text-gray-400 leading-none mb-1">
                  Transaction ID
                </p>
                <p className="text-sm font-mono font-bold text-gray-700">
                  {transactionId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#1D3A15]" />
              <div>
                <p className="text-[10px] text-gray-400 leading-none mb-1">
                  Status
                </p>
                <p className="text-sm font-bold text-green-600">
                  Payment Paid Successfully
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 text-left bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
          <Clock size={20} className="text-blue-500 mt-1 shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Please keep your <strong>QR Code</strong> ready (available in your
            dashboard) to show at the entrance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard/my-booking")} 
            className="w-full bg-[#1D3A15] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#2d5a21] transition-all shadow-lg shadow-green-900/20"
          >
            View My Bookings <ArrowRight size={18} />
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-white text-gray-500 font-bold py-4 rounded-2xl border-2 border-gray-50 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
          >
            <Home size={18} /> Back to Home
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[10px] text-gray-400 italic">
          Thank you for choosing our service!
        </p>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
