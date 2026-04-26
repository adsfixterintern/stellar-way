"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, Home, AlertCircle } from "lucide-react";

const PaymentFailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen bg-[#FDF2F2] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-2xl border border-red-50 text-center">
        
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <XCircle size={64} className="text-red-500" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl font-black text-[#1D3A15] mb-2 uppercase tracking-tight">
          Payment Failed
        </h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Something went wrong with the transaction. If any amount was deducted, 
          it will be automatically refunded within 3-5 business days.
        </p>

        {/* Transaction Info */}
        {transactionId && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-dashed border-gray-200">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Reference ID
            </span>
            <span className="text-xs font-mono font-bold text-gray-700">
              {transactionId}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          {/* Back to Events Button */}
          <button
            onClick={() => router.push("/events")} // Apnar event listing path-ti ekhane din
            className="w-full bg-[#1D3A15] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#2d5a21] transition-all shadow-lg shadow-green-900/10"
          >
            <ArrowLeft size={18} /> Back to Events
          </button>

          {/* Go to Home Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full bg-white text-gray-600 font-bold py-4 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
          >
            <Home size={18} /> Go to Homepage
          </button>
        </div>

        {/* Support Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400 text-[11px]">
          <AlertCircle size={14} />
          <span>Need help? Contact our support team.</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;