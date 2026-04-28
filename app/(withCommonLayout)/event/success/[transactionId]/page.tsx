/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import SingleHero from "@/components/shared/SingleHero";
import axios from "axios";
import { CheckCircle2, CalendarDays, Home } from "lucide-react";

const EventSuccessPage = ({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) => {
  // লোডিং স্টেট ডিফল্ট ফলস করে দেওয়া হয়েছে যাতে সরাসরি কন্টেন্ট দেখায়
  const [isVerifying, setIsVerifying] = useState(true);

  const resolvedParams = use(params);
  const transactionId = resolvedParams.transactionId;

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/event-bookings/confirm-payment/${transactionId}?status=success`,
        );
      } catch (error) {
        console.log("Database updated or already confirmed");
      } finally {
        setIsVerifying(false);
      }
    };

    if (transactionId) {
      confirmPayment();
    }
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-[#F4F7F2] pb-24">
      <SingleHero
        subtitle="Confirmation"
        title="Payment Success"
        isCenter={true}
      />

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white border border-white rounded-[40px] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
            <CheckCircle2 size={52} strokeWidth={2.5} />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#1D3A15] uppercase italic tracking-tighter mb-4">
            Reservation Confirmed!
          </h2>

          <p className="text-gray-500 font-bold text-sm uppercase tracking-[2px] max-w-md mx-auto mb-12">
            Your payment was processed successfully. We&apos;ve sent a
            confirmation details to your registered email.
          </p>

          {/* Transaction Info Box */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-12 border border-gray-100 inline-block w-full max-w-xl">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] mb-2">
              Transaction Reference
            </p>
            <span className="font-mono text-lg font-black text-[#3D5334] break-all">
              {transactionId}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              href="/dashboard/my-events"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#1D3A15] text-white px-10 py-5 rounded-[20px] font-black uppercase text-xs tracking-widest hover:shadow-2xl hover:shadow-green-900/20 transition-all active:scale-95"
            >
              <CalendarDays size={18} /> View My Events
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 border-2 border-[#1D3A15] text-[#1D3A15] px-10 py-5 rounded-[20px] font-black uppercase text-xs tracking-widest hover:bg-[#1D3A15] hover:text-white transition-all active:scale-95"
            >
              <Home size={18} /> Return Home
            </Link>
          </div>

          {/* Background Background subtle text */}
          <p className="mt-12 text-[9px] text-gray-300 font-bold uppercase tracking-[3px]">
            Thank you for choosing our platform for your exclusive experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventSuccessPage;
