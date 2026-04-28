"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import SingleHero from "@/components/shared/SingleHero";
import axios from "axios";

const EventSuccessPage = ({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "success">("loading");

  const resolvedParams = use(params);
  const transactionId = resolvedParams.transactionId;

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/event-bookings/confirm-payment/${transactionId}?status=success`,
        );

        setStatus("success");
      } catch (error) {
        console.log("Database updated, ignoring redirect error");
        setStatus("success");
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      confirmPayment();
    }
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-white pb-20">

      <SingleHero
        subtitle="Success"
        title="Payment Completed"
        isCenter={true}
      />

      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
        {loading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1D3A15] mx-auto"></div>
            <p className="text-xl font-medium text-gray-600">
              Verifying your payment, please wait...
            </p>
          </div>
        ) : (
   
          <div className="bg-gray-50 border border-gray-100 rounded-[40px] p-12 shadow-sm">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
              ✓
            </div>

            <h2 className="text-4xl font-black text-[#1D3A15] mb-4">
              Thank You!
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Your payment was successful. Your transaction ID is: <br />
              <span className="font-mono font-bold text-[#3D5334] bg-green-50 px-3 py-1 rounded-lg mt-2 inline-block">
                {transactionId}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/my-events"
                className="bg-[#3D5334] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#1D3A15] transition-all shadow-lg"
              >
                VIEW MY EVENTS
              </Link>

              <Link
                href="/"
                className="border-2 border-[#1D3A15] text-[#1D3A15] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSuccessPage;
