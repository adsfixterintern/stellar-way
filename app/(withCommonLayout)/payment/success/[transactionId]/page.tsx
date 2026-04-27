/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import SingleHero from "@/components/shared/SingleHero";
import Link from "next/link";
import { updatePaymentStatusApi } from "@/app/modules/payment/payment.api";

const PaymentSuccessPage = () => {
  const { transactionId } = useParams();
  const [status, setStatus] = useState<"success" | "error">("success"); 

  useEffect(() => {
    const verifyAndUpdatePayment = async () => {
      const tId = Array.isArray(transactionId) ? transactionId[0] : transactionId;
      if (!tId) return;

      try {
        const res = await updatePaymentStatusApi(tId, "paid");
        if (res.success) {
          setStatus("success");
          toast.success("Successfully confirmed payment!");
        } else {
          throw new Error("Update failed");
        }
      } catch (error: any) {
        console.error("Payment update error:", error);
        setStatus("error");
        toast.error("Status sync failed, but payment was received.");
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

      <div className="max-w-3xl mx-auto px-4 mt-10 md:mt-20 text-center">
        {status === "success" ? (
          <div className="bg-white border border-gray-100 rounded-[30px] md:rounded-[50px] p-8 md:p-12 shadow-2xl shadow-gray-100 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl"></div>
            
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 text-green-600 rounded-[25px] md:rounded-[30px] flex items-center justify-center mx-auto mb-6 md:mb-10 text-4xl md:text-5xl font-black rotate-3">
              ✓
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-[#1D3A15] mb-4 md:mb-6 tracking-tighter uppercase italic">
              Thank You!
            </h2>
            
            <p className="text-sm md:text-lg text-gray-500 mb-8 md:mb-10 font-medium">
              Your payment was successful. Transaction ID: <br />
              <span className="font-mono font-black text-[#1D3A15] bg-gray-50 border border-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl mt-4 inline-block shadow-sm break-all">
                {transactionId}
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard/my-orders"
                className="w-full sm:w-auto bg-[#1D3A15] text-white px-8 md:px-10 py-4 md:py-5 rounded-[20px] md:rounded-[25px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                VIEW MY ORDERS
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto border-2 border-gray-100 text-gray-400 px-8 md:px-10 py-4 md:py-5 rounded-[20px] md:rounded-[25px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-[30px] md:rounded-[50px] p-8 md:p-12">
             <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 text-red-600 rounded-[25px] flex items-center justify-center mx-auto mb-6 text-3xl font-black">
              !
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-red-600 mb-4 uppercase italic">Sync Issue</h2>
            <p className="text-sm md:text-gray-600 mb-8 font-medium">
              Payment received, but we couldn&apos;t sync the status automatically. <br/>
              ID: <span className="font-bold underline">{transactionId}</span>
            </p>
            <Link
              href="/"
              className="inline-block bg-red-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-[20px] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg"
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