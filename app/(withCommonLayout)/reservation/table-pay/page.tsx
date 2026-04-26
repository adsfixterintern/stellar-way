/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import { Calendar, Clock, CreditCard, Lock, Users, Info } from "lucide-react";
import SingleHero from "@/components/shared/SingleHero";
import api from "@/utils/apiInstance";


const TablePayContent = () => {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const date = searchParams.get("date");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const tableIds = searchParams.get("tableIds")?.split(",") || [];
  const totalPrice = searchParams.get("totalPrice");
  const guest = searchParams.get("guest");
  const phone = searchParams.get("phone");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");

  const handlePayment = async (method: "SSL" | "Stripe") => {
    setIsProcessing(true);
    const loadingToast = toast.loading(`Connecting to ${method}...`);

    const bookingData = {
      userId: (session?.user as any)?.id || (session?.user as any)?._id,
      name: `${firstName} ${lastName}`,
      email: session?.user?.email,
      phone,
      date,
      startTime,
      endTime,
      tableIds,
      totalPrice: Number(totalPrice),
      guest: Number(guest),
      paymentMethod: method
    };

    try {
    
      const endpoint = method === "SSL" ? "/bookings/create-ssl-booking" : "/bookings/create-stripe-booking";
      const response = await api.post(endpoint, bookingData);

      if (response.data.success && response.data.data?.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      } else {
        toast.error("Gateway error occurred");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
      setIsProcessing(false);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="bg-[#F4F7F2] ">
      <Toaster />
      
 <SingleHero
          subtitle="SECURE CHECKOUT"
          title="Table Reservation Payment"
          description="Complete your secure payment now to finalize your reservation"
          buttonTitle=""
          buttonLink=""
          isCenter={true}
        />
      <div className="max-w-5xl mx-auto px-6 py-24  relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Order Summary */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] p-10 border border-gray-200 shadow-lg">
              <h3 className="text-lg font-extrabold text-[#1D3A15] mb-8 uppercase tracking-widest flex items-center gap-3">
                <Info size={20} /> Review Reservation
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                   <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase"><Calendar size={16}/> Date</div>
                   <span className="font-black text-[#1D3A15]">{date}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                   <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase"><Clock size={16}/> Duration</div>
                   <span className="font-black text-[#1D3A15]">{startTime} - {endTime}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                   <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase"><Users size={16}/> Selected Tables</div>
                   <span className="font-black text-[#1D3A15]">{tableIds.length} Table(s)</span>
                </div>
              </div>

              <div className="mt-8 p-8 bg-[#1D3A15] rounded-2xl text-white flex justify-between items-center shadow-xl">
                <div>
                  <span className="block text-[10px] font-black uppercase opacity-60">Total Amount</span>
                  <span className="text-3xl font-black">৳{totalPrice}</span>
                </div>
                <div className="text-right">
                   <span className="block text-[10px] font-black uppercase opacity-60">Contact info</span>
                   <span className="text-sm font-bold">{phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Gateways */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-10 border border-gray-200 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <Lock size={16} className="text-[#3D5334]" />
                <h3 className="text-xs font-extrabold text-[#1D3A15] uppercase tracking-widest">Payment Methods</h3>
              </div>

              <div className="space-y-4">
                <button 
                   disabled={isProcessing} 
                   onClick={() => handlePayment("SSL")}
                   className="w-full group p-5 rounded-2xl border-2 hover:border-[#1D3A15] flex items-center justify-between transition-all"
                >
                  <span className="font-black text-[#1D3A15] uppercase text-xs">SSLCommerz</span>
                  <div className="h-5 w-5 rounded-full border-2 group-hover:bg-[#1D3A15]"></div>
                </button>

                <button 
                   disabled={isProcessing} 
                   onClick={() => handlePayment("Stripe")}
                   className="w-full group p-5 rounded-2xl border-2 hover:border-[#1D3A15] flex items-center justify-between transition-all"
                >
                  <span className="font-black text-[#1D3A15] uppercase text-xs">International Card</span>
                  <CreditCard size={24} className="text-gray-300 group-hover:text-[#1D3A15]"/>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const TablePayPage = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Payment...</div>}>
    <TablePayContent />
  </Suspense>
);

export default TablePayPage;