/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import SingleHero from "@/components/shared/SingleHero";
import Link from "next/link";
// এপিআই মডিউল ইমপোর্ট করুন
import { updatePaymentStatusApi } from "@/app/modules/payment/payment.api";

const PaymentSuccessPage = () => {
  const { transactionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verifyAndUpdatePayment = async () => {
      // transactionId স্ট্রিং হিসেবে নিশ্চিত করা
      const tId = Array.isArray(transactionId) ? transactionId[0] : transactionId;
      
      if (!tId) return;

      try {
        setLoading(true);
        // মডিউল থেকে এপিআই কল
        const res = await updatePaymentStatusApi(tId, "paid");

        if (res.success) {
          setStatus("success");
          toast.success("Payment confirmed and order updated!");
        } else {
          throw new Error("Update failed");
        }
      } catch (error: any) {
        console.error("Payment update error:", error);
        setStatus("error");
        toast.error(error.response?.data?.message || "Could not update payment status.");
      } finally {
        setLoading(false);
      }
    };

    verifyAndUpdatePayment();
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <Toaster position="top-center" />
      
      <SingleHero
        subtitle="Success"
        title="Payment Completed"
        isCenter={true}
      />

      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
        {loading ? (
          <div className="space-y-6">
            <div className="w-16 h-16 border-4 border-[#1D3A15] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xl font-black text-gray-400 uppercase tracking-tighter italic">
              Verifying your payment...
            </p>
          </div>
        ) : status === "success" ? (
          <div className="bg-white border border-gray-100 rounded-[50px] p-12 shadow-2xl shadow-gray-100 relative overflow-hidden">
            {/* সাজানোর জন্য একটি গ্রিন সার্কেল ব্যাকগ্রাউন্ড */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl"></div>
            
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[30px] flex items-center justify-center mx-auto mb-10 text-5xl font-black rotate-3">
              ✓
            </div>
            
            <h2 className="text-5xl font-black text-[#1D3A15] mb-6 tracking-tighter uppercase italic">
              Thank You!
            </h2>
            
            <p className="text-lg text-gray-500 mb-10 font-medium">
              Your payment was successful. Your transaction ID is: <br />
              <span className="font-mono font-black text-[#1D3A15] bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl mt-4 inline-block shadow-sm">
                {transactionId}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link
                href="/dashboard/my-orders"
                className="w-full sm:w-auto bg-[#1D3A15] text-white px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-900/20"
              >
                VIEW MY ORDERS
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto border-2 border-gray-100 text-gray-400 px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:text-black transition-all"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-[50px] p-12">
             <div className="w-20 h-20 bg-red-100 text-red-600 rounded-[30px] flex items-center justify-center mx-auto mb-8 text-4xl font-black">
              !
            </div>
            <h2 className="text-3xl font-black text-red-600 mb-4 uppercase italic">Update Failed</h2>
            <p className="text-gray-600 mb-8 font-medium">
              Payment received, but we couldnt sync the status. <br/>
              Transaction ID: <span className="font-bold underline">{transactionId}</span>
            </p>
            <Link
              href="/"
              className="inline-block bg-red-600 text-white px-10 py-5 rounded-[25px] font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
            >
              GO TO HOME
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;