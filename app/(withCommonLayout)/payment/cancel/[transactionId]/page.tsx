"use client";
import React from "react";
import Link from "next/link";
import { XCircle, ShoppingBag, ArrowRight } from "lucide-react";
import SingleHero from "@/components/shared/SingleHero";

const PaymentCancelPage = () => {
  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <SingleHero subtitle="CANCELLED" title="Order Cancelled" isCenter={true} />

      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
        <div className="flex justify-center mb-10">
          <div className="bg-orange-50 p-8 rounded-[40px]">
            <XCircle size={70} className="text-orange-500" />
          </div>
        </div>

        <h2 className="text-5xl font-black text-[#1D3A15] mb-6 tracking-tight">
          Payment Cancelled
        </h2>
        <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto font-medium">
          The payment process was cancelled. Your items are still in your cart, and no money has been deducted.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link 
            href="/cart" 
            className="flex items-center justify-center gap-3 bg-[#1D3A15] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-[#1D3A15]/20 w-full sm:w-auto"
          >
            <ShoppingBag size={20} /> Back to Cart
          </Link>
          
          <Link 
            href="/menu" 
            className="flex items-center justify-center gap-3 border-2 border-gray-100 text-gray-800 px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all w-full sm:w-auto"
          >
            Browse Menu <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;