/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bike, CheckCircle, Clock, ShoppingBag, 
  Navigation, Check, X, Lock, History, Loader2, Send
} from "lucide-react";
import { BiSolidMessageDots } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { getRiderDashboardData, updateDeliveryStatusApi } from "@/app/modules/rider/rider.api";
import { useSocket } from "@/app/hooks/useSocket";
import { getChatHistoryFromDB, sendMessageApi } from "@/app/modules/chat/chat.api";

// Interfaces
interface IOrder {
  _id: string;
  transactionId: string;
  totalPrice: number;
  address: string;
  deliveryStatus: 'pending' | 'confirmed' | 'cooking' | 'on-the-way' | 'delivered';
  phone?: string;
  customerName?: string;
}

const RiderDashboard: React.FC = () => {
  const { data: session } = useSession();
  const socket = useSocket();

  // States
  const [availableOrders, setAvailableOrders] = useState<IOrder[]>([]);
  const [myAcceptedOrders, setMyAcceptedOrders] = useState<IOrder[]>([]);
  const [activeOrder, setActiveOrder] = useState<IOrder | null>(null);
  const [stats, setStats] = useState({ totalEarnings: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal & Verification States
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderToVerify, setOrderToVerify] = useState<IOrder | null>(null);

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const watchIdRef = useRef<number | null>(null);

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchRiderData = async () => {
    if (!session?.user?.email) return;
    try {
      setLoading(true);
      const res = await getRiderDashboardData(session.user.email);
      if (res.success) {
        setStats({
          totalEarnings: res.data.totalEarnings || 0,
          completed: res.data.completedCount || 0,
          pending: res.data.pendingCount || 0,
        });
        setAvailableOrders(res.data.availableOrders || []);
        const accepted = res.data.myAcceptedOrders || [];
        setMyAcceptedOrders(accepted);
        const currentActive = accepted.find((o: IOrder) => o.deliveryStatus !== 'delivered');
        if (currentActive) {
          setActiveOrder(currentActive);
          if (currentActive.deliveryStatus === 'on-the-way') startTracking(currentActive._id);
        } else {
          setActiveOrder(null);
        }
      }
    } catch (err: any) { toast.error("Failed to load dashboard data"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRiderData(); }, [session?.user?.email]);

  // Chat History & Socket Integration
  useEffect(() => {
    if (isChatOpen && activeOrder) {
      getChatHistoryFromDB(activeOrder._id).then(res => {
        if (res.success) setMessages(res.data?.messages || []);
        setTimeout(scrollToBottom, 100);
      });
      socket?.emit("join-order", activeOrder._id);
    }
  }, [isChatOpen, activeOrder, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-message", (msg: any) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    });
    return () => { socket.off("new-message"); };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !activeOrder) return;
    const currentUser: any = session?.user;
    const payload = {
      orderId: activeOrder._id,
      sender: currentUser.id || currentUser._id,
      senderModel: "Rider" as const,
      message: newMessage,
    };
    try {
      const res = await sendMessageApi(payload);
      if (res.success) {
        socket.emit("send-message", payload);
        setNewMessage("");
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) { console.error(err); }
  };

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
        toast.success("Mission Accepted!");
        fetchRiderData();
      }
    } catch (err) { toast.error("Could not accept order."); }
  };

  const handleVerifyOtp = async () => {
    if (!orderToVerify || otpValue.length < 4) return;
    try {
      setIsVerifying(true);
      const riderId = (session?.user as any)?.id || (session?.user as any)?._id;
      const res = await updateDeliveryStatusApi(orderToVerify._id, { 
        status: 'delivered', riderId, otp: otpValue
      });
      if (res.success) {
        toast.success("Order Delivered! 🎉");
        setIsOtpModalOpen(false);
        setOtpValue("");
        fetchRiderData();
      } else { toast.error(res.message || "Invalid OTP"); }
    } catch (err) { toast.error("Verification failed."); } 
    finally { setIsVerifying(false); }
  };

  if (loading && availableOrders.length === 0) {
    return <div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={48} /></div>;
  }

  console.log(activeOrder?.transactionId)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 bg-[#f8fafc]">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Rider Terminal</h1>
          <p className="text-slate-500 font-medium">Manage your active missions</p>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4"><Bike size={24} /></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</p>
           <h3 className="text-2xl font-black text-slate-900">৳{stats.totalEarnings}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4"><CheckCircle size={24} /></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</p>
           <h3 className="text-2xl font-black text-slate-900">{stats.completed}</h3>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-4"><Clock size={24} /></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</p>
           <h3 className="text-2xl font-black text-slate-900">{stats.pending}</h3>
        </div>
      </div>

      {/* Active Mission with Chat */}
      {activeOrder && (
        <section className="relative">
          <div className="absolute -top-4 left-8 bg-orange-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase z-10">Active Mission</div>
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-black text-orange-400 italic">#{activeOrder.transactionId.slice(-10)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Address</p>
                    <p className="font-bold text-slate-200 mt-1">{activeOrder.address}</p>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase">Customer</p>
                      <p className="font-bold text-slate-200 mt-1">{activeOrder.phone}</p>
                    </div>
                    {/* CHAT BUTTON */}
                    <button 
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${isChatOpen ? 'bg-orange-500' : 'bg-white text-slate-900'}`}
                    >
                      <BiSolidMessageDots size={24} />
                    </button>
                  </div>
                </div>

                {/* CHAT BOX INSIDE MISSION CARD */}
                {isChatOpen && (
                  <div className="bg-white rounded-[2rem] h-[300px] flex flex-col overflow-hidden animate-in slide-in-from-top-2">
                    <div className="p-3 bg-slate-50 border-b flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Live Chat with Customer</span>
                      <X size={16} className="text-slate-400 cursor-pointer" onClick={() => setIsChatOpen(false)} />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.senderModel === 'Rider' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-xs font-bold ${msg.senderModel === 'Rider' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border rounded-tl-none shadow-sm'}`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                      <div ref={scrollRef} />
                    </div>
                    <div className="p-3 border-t flex gap-2 bg-white">
                      <input 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Send a message..." 
                        className="flex-1 bg-slate-100 rounded-xl px-4 text-xs text-slate-900 outline-none" 
                      />
                      <button onClick={handleSendMessage} className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white"><Send size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:w-72 flex flex-col justify-center gap-4">
                <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/10">
                   <p className="text-[10px] font-black text-slate-500 uppercase">Mission Value</p>
                   <p className="text-4xl font-black text-white mt-1">৳{activeOrder.totalPrice}</p>
                </div>
                <button 
                  onClick={() => { setOrderToVerify(activeOrder); setIsOtpModalOpen(true); }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-[2rem] font-black text-xs tracking-widest transition-all shadow-xl shadow-orange-900/20 active:scale-95"
                >
                  FINALIZE MISSION (OTP)
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Quests Table */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
          <ShoppingBag size={20} className="text-orange-500" />
          <h2 className="font-black text-slate-900 uppercase">Available Quests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-50">
                <th className="px-8 py-4">Quest ID</th>
                <th className="px-8 py-4">Target</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {availableOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 font-black text-slate-900">#{order.transactionId.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{order.address}</td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => handleAcceptOrder(order._id)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-orange-500 transition-all active:scale-95">Accept</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => !isVerifying && setIsOtpModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] p-10 animate-in fade-in zoom-in duration-300">
            <div className="bg-orange-100 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-orange-600 mb-6"><Lock size={32} /></div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Handover OTP</h3>
            <p className="text-slate-500 font-bold text-sm mt-2">Enter the 4-6 digit code from the customer.</p>
            <input 
              type="text" maxLength={6} placeholder="------" value={otpValue}
              onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-6 py-5 mt-8 text-center text-4xl font-black tracking-[0.4em] focus:border-orange-500 focus:outline-none"
            />
            <button 
              disabled={isVerifying || otpValue.length < 4}
              onClick={handleVerifyOtp}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl mt-6 font-black text-xs tracking-widest hover:bg-orange-600 disabled:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? <Loader2 className="animate-spin" size={18} /> : "VERIFY & COMPLETE"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;