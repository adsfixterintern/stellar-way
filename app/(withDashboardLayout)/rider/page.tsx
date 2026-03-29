/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Bike, CheckCircle, Clock, MapPin, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { getRiderStatsAndOrders, updateDeliveryStatusApi } from "@/app/modules/rider/rider.api";

interface IOrder {
  _id: string;
  transactionId: string;
  totalPrice: number;
  address: string;
  deliveryStatus: string;
}

const RiderDashboard: React.FC = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRiderData = async () => {
    if (!session?.user?.email) return;
    
    try {
      setLoading(true);
      const res = await getRiderStatsAndOrders(session.user.email);
      
      if (res.success) {
        setStats({
          totalEarnings: res.data.totalEarnings || 0,
          completed: res.data.completedCount || 0,
          pending: res.data.pendingCount || 0,
        });
        setOrders(res.data.availableOrders || []);
      }
    } catch (err: any) {
      console.error("Data fetch failed:", err);
      toast.error(err?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, [session?.user?.email]); // Dependencies ঠিক করা হলো

  const handleAcceptOrder = async (orderId: string) => {
    try {
      // সেশন থেকে আইডি নেওয়া (NextAuth অনুযায়ী)
      const riderId = (session?.user as any)?.id || (session?.user as any)?._id;
      
      if(!riderId) {
          return toast.error("Rider ID not found. Please re-login.");
      }

      const res = await updateDeliveryStatusApi(orderId, {
        status: 'on-the-way',
        riderId: riderId,
        riderName: session?.user?.name || "Rider"
      });

      if (res.success) {
        toast.success("Order Accepted! Drive safe.");
        // লোকালি স্টেট আপডেট করা যাতে রিফ্রেশ ছাড়া অর্ডারটি চলে যায়
        setOrders(prev => prev.filter(order => order._id !== orderId));
        // স্ট্যাটাস কার্ডগুলো আপডেট করা
        fetchRiderData();
      }
    } catch (err: any) {
      console.error("Accept error:", err);
      toast.error(err?.response?.data?.message || "Could not accept order.");
    }
  };

  const statCards = [
    { label: "Total Earnings", value: `৳${stats.totalEarnings}`, icon: Bike, color: "bg-blue-600" },
    { label: "Completed", value: stats.completed.toString(), icon: CheckCircle, color: "bg-green-600" },
    { label: "Pending Tasks", value: stats.pending.toString(), icon: Clock, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg shadow-gray-200`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Requests List */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          New Delivery Requests 
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20 text-gray-400 font-medium">Loading requests...</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="bg-white border border-gray-100 rounded-[35px] p-7 shadow-sm hover:shadow-xl transition-all border-b-4 border-b-[#c2a15e]/30">
                 <div className="flex justify-between items-start mb-5">
                    <div className="bg-gray-50 px-3 py-1 rounded-full">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ID: #{order.transactionId.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#1e3316]">৳{order.totalPrice}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-start gap-3 mb-8">
                    <div className="bg-red-50 p-2 rounded-lg text-red-500 shrink-0"><MapPin size={20} /></div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Delivery Address</p>
                        <p className="text-sm font-bold text-gray-700 leading-snug">{order.address}</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => handleAcceptOrder(order._id)}
                   className="w-full py-4 bg-[#1e3316] text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-green-900/20 active:scale-[0.98]"
                 >
                   ACCEPT ORDER & START
                 </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <ShoppingBag size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No orders available right now</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;