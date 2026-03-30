/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bike, CheckCircle, Clock, MapPin, ShoppingBag, 
  Navigation, Phone, Check, AlertCircle, TrendingUp, 
  X, Lock, History, Loader2 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { getRiderDashboardData, updateDeliveryStatusApi } from "@/app/modules/rider/rider.api";
import { useSocket } from "@/app/hooks/useSocket";

// Interfaces
interface IOrder {
  _id: string;
  transactionId: string;
  totalPrice: number;
  address: string;
  deliveryStatus: 'pending' | 'confirmed' | 'cooking' | 'on-the-way' | 'delivered';
  phone?: string;
}

interface IStats {
  totalEarnings: number;
  completed: number;
  pending: number;
}

const RiderDashboard: React.FC = () => {
  const { data: session } = useSession();
  const socket = useSocket();

  // States
  const [availableOrders, setAvailableOrders] = useState<IOrder[]>([]);
  const [myAcceptedOrders, setMyAcceptedOrders] = useState<IOrder[]>([]);
  const [activeOrder, setActiveOrder] = useState<IOrder | null>(null);
  const [stats, setStats] = useState<IStats>({ totalEarnings: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal & Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderToVerify, setOrderToVerify] = useState<IOrder | null>(null);
  
  const watchIdRef = useRef<number | null>(null);

  const fetchRiderData = async () => {
    if (!session?.user?.email) return;
    try {
      setLoading(true);
      const res = await getRiderDashboardData(session.user.email);
      if (res.success) {
        console.log(res.data)
        setStats({
          totalEarnings: res.data.totalEarnings || 0,
          completed: res.data.completedCount || 0,
          pending: res.data.pendingCount || 0,
        });
        
        setAvailableOrders(res.data.availableOrders || []);
        setMyAcceptedOrders(res.data.myAcceptedOrders || []);
        
        // Find if there's any order currently 'on-the-way'
        const currentActive = res.data.myAcceptedOrders?.find(
          (o: IOrder) => o.deliveryStatus === 'on-the-way'
        );
        
        if (currentActive) {
          setActiveOrder(currentActive);
          startTracking(currentActive._id);
        } else {
          setActiveOrder(null);
        }
      }
    } catch (err: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiderData();
  }, [session?.user?.email]);

  const startTracking = (orderId: string) => {
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    if ("geolocation" in navigator && socket) {
      socket.emit("join-order", orderId);
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("update-location", {
            orderId,
            riderId: (session?.user as any)?.id || (session?.user as any)?._id,
            currentLocation: { lat: latitude, lng: longitude },
            status: "on-the-way"
          });
        },
        (error) => console.error("Tracking Error:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      ) as unknown as number;
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const riderId = (session?.user as any)?.id || (session?.user as any)?._id;
      const res = await updateDeliveryStatusApi(orderId, {
        status: 'on-the-way',
        riderId,
        riderName: session?.user?.name ?? "Rider",
      });

      if (res.success) {
        toast.success("Order accepted! Mission started.");
        fetchRiderData();
      }
    } catch (err: any) {
      toast.error("Could not accept order.");
    }
  };

  const openOtpModal = (order: IOrder) => {
    setOrderToVerify(order);
    setIsOtpModalOpen(true);
  };

  const handleVerifyOtp = async () => {
    if (!orderToVerify || otpValue.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    try {
      setIsVerifying(true);
      const riderId = (session?.user as any)?.id || (session?.user as any)?._id;
      const res = await updateDeliveryStatusApi(orderToVerify._id, { 
        status: 'delivered',
        riderId,
        otp: otpValue
      });

      if (res.success) {
        toast.success("Order Delivered Successfully! 🎉");
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        socket?.emit("update-location", { orderId: orderToVerify._id, status: "delivered" });
        setIsOtpModalOpen(false);
        setOtpValue("");
        setOrderToVerify(null);
        fetchRiderData();
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error("Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading && availableOrders.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-500" size={48} />
        <p className="font-bold text-slate-500 animate-pulse">Syncing with Command Center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 bg-[#f8fafc]">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Rider Terminal</h1>
          <p className="text-slate-500 font-medium">Accept missions and track your performance</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Active Status</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group relative overflow-hidden">
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:rotate-12 transition-transform">
             <TrendingUp size={120} />
           </div>
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Bike size={24} /></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Earnings Total</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">৳{stats.totalEarnings}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><CheckCircle size={24} /></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Completed</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.completed}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
          <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-4"><Clock size={24} /></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Missions</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.pending}</h3>
        </div>
      </div>

      {/* Active High-Priority Mission */}
      {activeOrder && (
        <section className="relative">
          <div className="absolute -top-4 left-8 bg-orange-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl z-10">Live Tracking Active</div>
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-white/5">
            <div className="flex flex-col lg:flex-row justify-between gap-10">
              <div className="space-y-8 flex-1">
                <div>
                  <h2 className="text-5xl font-black tracking-tighter text-orange-400 italic">
                    #{activeOrder.transactionId.slice(-8).toUpperCase()}
                  </h2>
                  <p className="text-slate-400 mt-2 font-bold uppercase text-xs flex items-center gap-2">
                    <Navigation size={14} className="text-orange-500" /> Current Route: GPS Stabilized
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Drop-off point</p>
                    <p className="text-md font-bold mt-2 leading-snug text-slate-200">{activeOrder.address}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comms Line</p>
                    <p className="text-md font-bold mt-2 text-slate-200">{activeOrder.phone || "Secure Encrypted"}</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-80 flex flex-col justify-center gap-6">
                <div className="bg-white/5 p-8 rounded-[2rem] text-center border border-white/10 backdrop-blur-md">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mission Value</p>
                   <p className="text-5xl font-black text-white mt-2">৳{activeOrder.totalPrice}</p>
                </div>
                <button 
                  onClick={() => openOtpModal(activeOrder)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-[2rem] font-black text-sm tracking-widest transition-all shadow-lg shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  <Check size={20} /> COMPLETE MISSION
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Accepted Missions History / List */}
      <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-2xl shadow-sm text-slate-600"><History size={20} /></div>
            <div>
              <h2 className="font-black text-slate-900 tracking-tight text-xl uppercase">Your Missions</h2>
              <p className="text-xs font-bold text-slate-400">Total {myAcceptedOrders.length} records found</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
                <th className="px-10 py-6">Mission ID</th>
                <th className="px-10 py-6">Destination</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myAcceptedOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-10 py-7">
                    <p className="font-black text-slate-900 tracking-tight">#{order.transactionId.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-bold text-slate-600 block max-w-xs truncate">{order.address}</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.deliveryStatus === 'delivered' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600 animate-pulse'
                    }`}>
                      {order.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    {order.deliveryStatus !== 'delivered' && (
                       <button 
                        onClick={() => openOtpModal(order)}
                        className="bg-slate-900 text-white p-3 rounded-xl hover:bg-orange-500 transition-all active:scale-90"
                       >
                         <Check size={16} />
                       </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Available Jobs Table */}
      <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><ShoppingBag size={20} /></div>
            <h2 className="font-black text-slate-900 tracking-tight text-xl uppercase">Available Quests</h2>
          </div>
          <div className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
            {availableOrders.length} New Broadcasts
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-50">
                <th className="px-10 py-6">ID</th>
                <th className="px-10 py-6">Target Location</th>
                <th className="px-10 py-6">Reward</th>
                <th className="px-10 py-6 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {availableOrders.map((order) => (
                <tr key={order._id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-10 py-7">
                    <p className="font-black text-slate-900">#{order.transactionId.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">{order.address}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-lg font-black text-emerald-600">৳{order.totalPrice}</span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <button 
                      onClick={() => handleAcceptOrder(order._id)}
                      className="bg-slate-900 hover:bg-orange-600 text-white px-7 py-3.5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
                    >
                      Accept Quest
                    </button>
                  </td>
                </tr>
              ))}
              {availableOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20 grayscale">
                      <ShoppingBag size={64} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">Scanning frequencies for new jobs...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isVerifying && setIsOtpModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-orange-100 p-4 rounded-[1.5rem] text-orange-600"><Lock size={28} /></div>
                <button onClick={() => setIsOtpModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-300" /></button>
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Handover Auth</h3>
              <p className="text-slate-500 font-bold text-sm mt-3 leading-relaxed">Input the 6-digit authorization code provided by the customer to finalize settlement.</p>
              
              <div className="mt-10 space-y-5">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="------"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-5 text-center text-4xl font-black tracking-[0.4em] focus:border-orange-500 focus:outline-none transition-all placeholder:text-slate-200"
                />
                <button 
                  disabled={isVerifying || otpValue.length < 4}
                  onClick={handleVerifyOtp}
                  className="w-full bg-slate-900 disabled:bg-slate-100 disabled:text-slate-300 text-white py-5 rounded-[1.5rem] font-black text-sm tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                >
                  {isVerifying ? <Loader2 className="animate-spin" size={20} /> : "FINALIZE DELIVERY"}
                </button>
              </div>
            </div>
            <div className="bg-slate-50 px-10 py-5 text-center border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted Secure Handover Protocol v2.4</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;