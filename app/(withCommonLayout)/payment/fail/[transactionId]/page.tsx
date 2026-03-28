"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, PhoneCall } from "lucide-react";
import SingleHero from "@/components/shared/SingleHero";
import { useSearchParams } from "next/navigation";

const FailContent = () => {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tranId");

  return (
    <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
      <div className="flex justify-center mb-10">
        <div className="bg-red-50 p-8 rounded-[40px] animate-pulse">
          <AlertCircle size={70} className="text-red-500" />
        </div>
      </div>

      <h2 className="text-5xl font-black text-[#1D3A15] mb-6 tracking-tight">
        Transaction Failed!
      </h2>
      <p className="text-gray-500 text-lg mb-4 max-w-md mx-auto font-medium">
        Something went wrong with your transaction. Please check your card details or try again later.
      </p>
      
      {tranId && (
        <p className="text-[10px] font-black text-red-400 uppercase tracking-[3px] mb-12">
          TRX ID: {tranId}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
        <Link 
          href="/cart" 
          className="flex items-center justify-center gap-3 bg-[#1D3A15] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1D3A15]/20 w-full sm:w-auto"
        >
          <RefreshCw size={20} /> Try Again
        </Link>
        
        <Link 
          href="/contact" 
          className="flex items-center justify-center gap-3 border-2 border-gray-100 text-gray-500 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all w-full sm:w-auto"
        >
          <PhoneCall size={20} /> Support
        </Link>
      </div>
    </div>
  );
};

const PaymentFailPage = () => {
  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <SingleHero subtitle="ERROR" title="Payment Failed" isCenter={true} />
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <FailContent />
      </Suspense>
    </div>
  );
};

export default PaymentFailPage;