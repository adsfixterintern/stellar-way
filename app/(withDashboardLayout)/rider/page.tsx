/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bike, CheckCircle, Clock, ShoppingBag, 
  Lock, Loader2, Send, MapPin, Phone, ChevronRight
} from "lucide-react";
import { BiSolidMessageDots } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { getRiderDashboardData, updateDeliveryStatusApi } from "@/app/modules/rider/rider.api";
import { useSocket } from "@/app/hooks/useSocket";
import { getChatHistoryFromDB, sendMessageApi } from "@/app/modules/chat/chat.api";
import { motion, AnimatePresence } from "framer-motion";

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

  const [availableOrders, setAvailableOrders] = useState<IOrder[]>([]);
  const [myAcceptedOrders, setMyAcceptedOrders] = useState<IOrder[]>([]);
  const [stats, setStats] = useState({ totalEarnings: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderToVerify, setOrderToVerify] = useState<IOrder | null>(null);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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
        setMyAcceptedOrders(res.data.myAcceptedOrders || []);
      }
    } catch (err: any) { 
        toast.error("Failed to load dashboard data"); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchRiderData(); }, [session?.user?.email]);

  useEffect(() => {
    if (activeChatId) {
      getChatHistoryFromDB(activeChatId).then(res => {
        if (res.success) setMessages(res.data?.messages || []);
        setTimeout(scrollToBottom, 100);
      });
      socket?.emit("join-order", activeChatId);
    }
  }, [activeChatId, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg: any) => {
      if (msg.orderId === activeChatId) {
        setMessages(prev => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      }
    };
    socket.on("new-message", handleNewMessage);
    return () => { socket.off("new-message", handleNewMessage); };
  }, [socket, activeChatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !activeChatId) return;
    const currentUser: any = session?.user;
    
    const payload: {
        orderId: string;
        sender: string;
        senderModel: "Rider" | "User";
        message: string;
    } = {
      orderId: activeChatId,
      sender: currentUser.id || currentUser._id,
      senderModel: "Rider",
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

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const riderId = (session?.user as any)?.id || (session?.user as any)?._id;
      const res = await updateDeliveryStatusApi(orderId, {
        status: 'on-the-way',
        riderId,
        riderName: session?.user?.name ?? "Rider",
      });
      if (res.success) {
        toast.success("Order Accepted!");
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
    return <div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#1A4E11]" size={48} /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 bg-[#f8fafc]">
      <header>
        <h1 className="text-4xl font-black text-[#1A4E11] tracking-tight uppercase">Mission Control</h1>
        <p className="text-gray-500 font-bold mt-1 italic">Welcome back, {session?.user?.name || 'Rider'}. Stand by for missions.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Earnings', val: `৳${stats.totalEarnings}`, icon: <Bike />, color: 'text-[#1A4E11]', bg: 'bg-[#E4F5DC]' },
          { label: 'Completed', val: stats.completed, icon: <CheckCircle />, color: 'text-emerald-700', bg: 'bg-emerald-50' },
          { label: 'Active Tasks', val: myAcceptedOrders.length, icon: <Clock />, color: 'text-[#c2a15e]', bg: 'bg-[#c2a15e]/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6">
            <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-3xl flex items-center justify-center text-2xl`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 ml-2">
          <div className="w-2 h-8 bg-[#c2a15e] rounded-full"></div>
          <h2 className="text-2xl font-black text-gray-900 uppercase italic">Active Missions ({myAcceptedOrders.length})</h2>
        </div>

        {myAcceptedOrders.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {myAcceptedOrders.map((order) => (
              <div key={order._id} className="group bg-[#1A4E11] rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="bg-[#c2a15e] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">On The Way</span>
                    <h3 className="text-3xl font-black text-[#E4F5DC] mt-2 italic">#{order.transactionId.slice(-8).toUpperCase()}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Payout</p>
                    <p className="text-2xl font-black text-white">৳{order.totalPrice}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <MapPin className="text-[#c2a15e] shrink-0" size={18} />
                    <p className="text-xs font-bold text-gray-200">{order.address}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Phone className="text-[#c2a15e] shrink-0" size={18} />
                    <p className="text-xs font-bold text-gray-200">{order.phone}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setOrderToVerify(order); setIsOtpModalOpen(true); }}
                    className="flex-1 bg-[#E4F5DC] text-[#1A4E11] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Complete Mission
                  </button>
                  <button 
                    onClick={() => setActiveChatId(activeChatId === order._id ? null : order._id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeChatId === order._id ? 'bg-[#c2a15e] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    <BiSolidMessageDots size={24} />
                  </button>
                </div>

                <AnimatePresence>
                  {activeChatId === order._id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
                    >
                      <div className="bg-white rounded-3xl h-64 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                          {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.senderModel === 'Rider' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-[10px] font-bold ${msg.senderModel === 'Rider' ? 'bg-[#1A4E11] text-white rounded-tr-none' : 'bg-white text-gray-800 border rounded-tl-none shadow-sm'}`}>
                                {msg.message}
                              </div>
                            </div>
                          ))}
                          <div ref={scrollRef} />
                        </div>
                        <div className="p-2 border-t flex gap-2 bg-white">
                          <input 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Message customer..." 
                            className="flex-1 bg-gray-100 rounded-xl px-4 text-[10px] text-gray-900 outline-none" 
                          />
                          <button onClick={handleSendMessage} className="w-10 h-10 bg-[#1A4E11] rounded-xl flex items-center justify-center text-white hover:bg-[#25631a]"><Send size={16} /></button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
             <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><Bike size={40} /></div>
             <p className="text-gray-400 font-bold">No active missions. Join a quest below!</p>
          </div>
        )}
      </section>

      <section className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-[#E4F5DC]/30">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-[#1A4E11]" />
            <h2 className="text-xl font-black text-gray-900 uppercase">Available Quests</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-400 uppercase border-b border-gray-50">
                <th className="px-10 py-5">Quest ID</th>
                <th className="px-10 py-5">Target Address</th>
                <th className="px-10 py-5">Earning</th>
                <th className="px-10 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {availableOrders.map((order) => (
                <tr key={order._id} className="hover:bg-[#E4F5DC]/10 transition-colors group">
                  <td className="px-10 py-6 font-black text-gray-900">#{order.transactionId.slice(-6).toUpperCase()}</td>
                  <td className="px-10 py-6 text-[11px] font-bold text-gray-500">{order.address}</td>
                  <td className="px-10 py-6 font-black text-emerald-700">৳{order.totalPrice}</td>
                  <td className="px-10 py-6 text-right">
                    <button onClick={() => handleAcceptOrder(order._id)} className="bg-[#1A4E11] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-[#c2a15e] transition-all active:scale-95 flex items-center gap-2 ml-auto shadow-md shadow-[#1A4E11]/10">
                      Accept <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <AnimatePresence>
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1A4E11]/80 backdrop-blur-sm" 
              onClick={() => !isVerifying && setIsOtpModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[3.5rem] p-12 text-center shadow-2xl"
            >
              <div className="bg-[#E4F5DC] w-20 h-20 rounded-[2rem] flex items-center justify-center text-[#1A4E11] mx-auto mb-8"><Lock size={40} /></div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Mission Handover</h3>
              <p className="text-gray-500 font-bold text-sm mt-2">Enter the OTP provided by the customer to finalize the delivery.</p>
              
              <input 
                type="text" maxLength={6} placeholder="------" value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-gray-50 border-4 border-[#E4F5DC] rounded-[2rem] px-6 py-6 mt-10 text-center text-5xl font-black tracking-[0.3em] focus:border-[#c2a15e] focus:outline-none transition-all text-[#1A4E11]"
              />
              
              <button 
                disabled={isVerifying || otpValue.length < 4}
                onClick={handleVerifyOtp}
                className="w-full bg-[#1A4E11] text-white py-6 rounded-[2rem] mt-8 font-black text-xs tracking-[0.2em] hover:bg-[#c2a15e] disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-xl shadow-[#1A4E11]/20"
              >
                {isVerifying ? <Loader2 className="animate-spin mx-auto" size={24} /> : "CONFIRM DELIVERY"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiderDashboard;