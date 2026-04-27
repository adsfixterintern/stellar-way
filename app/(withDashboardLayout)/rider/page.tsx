/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bike,
  CheckCircle,
  Clock,
  ShoppingBag,
  Lock,
  Loader2,
  Send,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";
import { BiSolidMessageDots } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  getRiderDashboardData,
  updateDeliveryStatusApi,
} from "@/app/modules/rider/rider.api";
import { useSocket } from "@/app/hooks/useSocket";
import {
  getChatHistoryFromDB,
  sendMessageApi,
} from "@/app/modules/chat/chat.api";
import { motion, AnimatePresence } from "framer-motion";

interface IOrder {
  _id: string;
  transactionId: string;
  totalPrice: number;
  address: string;
  deliveryStatus:
    | "pending"
    | "confirmed"
    | "cooking"
    | "on-the-way"
    | "delivered"
    | "near-location";
  phone?: string;
  customerName?: string;
}

const RiderDashboard: React.FC = () => {
  const { data: session } = useSession();
  const socket = useSocket();

  const [availableOrders, setAvailableOrders] = useState<IOrder[]>([]);
  const [myAcceptedOrders, setMyAcceptedOrders] = useState<IOrder[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderToVerify, setOrderToVerify] = useState<IOrder | null>(null);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(
      () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

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

        // Filter out orders that are already available for pickup
        setAvailableOrders(res.data.availableOrders || []);
        const activeOnly = (res.data.myAcceptedOrders || []).filter(
          (order: IOrder) => order.deliveryStatus !== "delivered",
        );
        setMyAcceptedOrders(activeOnly);
      }
    } catch (err: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Location tracking logic
  useEffect(() => {
    if (!socket || myAcceptedOrders.length === 0) return;

    const sendLocationToSocket = (lat: number, lng: number) => {
      myAcceptedOrders.forEach((order) => {
        if (
          order.deliveryStatus === "on-the-way" ||
          order.deliveryStatus === "near-location"
        ) {
          socket.emit("update-location", {
            orderId: order._id,
            currentLocation: { lat, lng },
            riderId: (session?.user as any)?.id,
            status: order.deliveryStatus,
          });
        }
      });
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocationToSocket(latitude, longitude);
      },
      (err) => console.error("Initial GPS Error:", err),
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 0,
      },
    );

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        sendLocationToSocket(latitude, longitude);
      },
      (err) => console.error("GPS Watch Error:", err),
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, myAcceptedOrders, session]);

  useEffect(() => {
    fetchRiderData();
  }, [session?.user?.email]);

  // Chat Logics
  useEffect(() => {
    if (activeChatId && socket) {
      getChatHistoryFromDB(activeChatId).then((res) => {
        if (res.success) setMessages(res.data?.messages || []);
        scrollToBottom();
      });
      socket.emit("join-order", activeChatId);
    }
  }, [activeChatId, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };
    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message");
    };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !activeChatId) return;

    const currentUser: any = session?.user;

    const senderModel: SenderModel =
      currentUser?.role?.toLowerCase() === "rider" ? "Rider" : "User";

    const payload = {
      orderId: activeChatId,
      sender: currentUser.id || currentUser._id,
      senderModel,
      message: newMessage.trim(),
    };

    try {
      const res = await sendMessageApi(payload);

      if (res.success) {
        socket.emit("send-message", payload);
        setNewMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const riderId = (session?.user as any)?.id || (session?.user as any)?._id;
      const res = await updateDeliveryStatusApi(orderId, {
        status: "on-the-way",
        riderId,
        riderName: session?.user?.name ?? "Rider",
      });
      if (res.success) {
        toast.success("Mission Accepted!");
        fetchRiderData();
      }
    } catch (err) {
      toast.error("Could not accept mission.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!orderToVerify || otpValue.length < 4) return;
    try {
      setIsVerifying(true);
      const riderId = (session?.user as any)?.id || (session?.user as any)?._id;

      const res = await updateDeliveryStatusApi(orderToVerify._id, {
        status: "delivered",
        riderId,
        otp: otpValue,
      });

      if (res.success) {
        toast.success("Mission Accomplished! 🎉");
        setIsOtpModalOpen(false);
        setOtpValue("");
        setActiveChatId(null); // Close chat if open
        // Refresh data to remove the card and update stats
        await fetchRiderData();
      } else {
        toast.error(res.message || "Invalid OTP Code");
      }
    } catch (err) {
      toast.error("Verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading && availableOrders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#1A4E11] mb-4" size={48} />
        <p className="font-black text-[#1A4E11] uppercase tracking-widest text-xs">
          Loading Mission Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 bg-[#f8fafc]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1A4E11] tracking-tight uppercase italic">
            Rider Command
          </h1>
          <p className="text-gray-500 font-bold mt-1">
            Logged in as: {session?.user?.name}
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Earnings",
            val: `৳${stats.totalEarnings}`,
            icon: <Bike />,
            color: "text-[#1A4E11]",
            bg: "bg-[#E4F5DC]",
          },
          {
            label: "Orders Completed",
            val: stats.completed,
            icon: <CheckCircle />,
            color: "text-emerald-700",
            bg: "bg-emerald-50",
          },
          {
            label: "Active Missions",
            val: myAcceptedOrders.length,
            icon: <Clock />,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-6"
          >
            <div
              className={`${stat.bg} ${stat.color} w-16 h-16 rounded-3xl flex items-center justify-center text-2xl`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-gray-900">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Active Missions Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
          <h2 className="text-2xl font-black text-gray-900 uppercase">
            Live Missions
          </h2>
        </div>

        {myAcceptedOrders.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {myAcceptedOrders.map((order) => (
              <div
                key={order._id}
                className="bg-[#1A4E11] rounded-[3rem] p-8 text-white shadow-xl relative overflow-hidden transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="bg-orange-500 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic">
                      Delivery In Progress
                    </span>
                    <h3 className="text-3xl font-black text-[#E4F5DC] mt-2 italic">
                      #{order.transactionId.slice(-8).toUpperCase()}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-300 uppercase">
                      Fee
                    </p>
                    <p className="text-2xl font-black text-white">
                      ৳{order.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <MapPin className="text-orange-400 shrink-0" size={18} />
                    <p className="text-xs font-bold text-gray-200">
                      {order.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <Phone className="text-orange-400 shrink-0" size={18} />
                    <p className="text-xs font-bold text-gray-200">
                      {order.phone}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setOrderToVerify(order);
                      setIsOtpModalOpen(true);
                    }}
                    className="flex-1 bg-white text-[#1A4E11] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#E4F5DC] transition-all flex items-center justify-center gap-2"
                  >
                    Finish Mission (OTP)
                  </button>
                  <button
                    onClick={() =>
                      setActiveChatId(
                        activeChatId === order._id ? null : order._id,
                      )
                    }
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeChatId === order._id ? "bg-orange-500" : "bg-white/10 hover:bg-white/20"}`}
                  >
                    <BiSolidMessageDots size={24} />
                  </button>
                </div>

                {/* Chat UI */}
                <AnimatePresence>
                  {activeChatId === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 pt-6 border-t border-white/10"
                    >
                      <div className="bg-white rounded-3xl h-60 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                          {messages.map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${msg.senderModel === "Rider" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] px-4 py-2 rounded-2xl text-[10px] font-bold ${msg.senderModel === "Rider" ? "bg-[#1A4E11] text-white rounded-tr-none" : "bg-white text-gray-800 border rounded-tl-none shadow-sm"}`}
                              >
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
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSendMessage()
                            }
                            placeholder="Type a reply..."
                            className="flex-1 bg-gray-100 rounded-xl px-4 text-[10px] text-gray-900 outline-none"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="w-10 h-10 bg-[#1A4E11] rounded-xl flex items-center justify-center text-white"
                          >
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-100 text-center text-gray-400 font-bold">
            No active missions. Check the job board below!
          </div>
        )}
      </section>

      {/* Job Board */}
      <section className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-[#1A4E11]" />
            <h2 className="text-xl font-black text-gray-900 uppercase">
              Mission Board
            </h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-400 uppercase border-b border-gray-50">
                <th className="px-10 py-5">Order ID</th>
                <th className="px-10 py-5">Drop-off</th>
                <th className="px-10 py-5">Earning</th>
                <th className="px-10 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {availableOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-[#E4F5DC]/10 transition-colors"
                >
                  <td className="px-10 py-6 font-black text-gray-900">
                    #{order.transactionId.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-10 py-6 text-[11px] font-bold text-gray-500">
                    {order.address}
                  </td>
                  <td className="px-10 py-6 font-black text-emerald-700">
                    ৳{order.totalPrice}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="bg-[#1A4E11] text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-orange-500 transition-all flex items-center gap-2 ml-auto"
                    >
                      Accept <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => !isVerifying && setIsOtpModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-[3.5rem] p-10 text-center shadow-2xl"
            >
              <div className="bg-[#E4F5DC] w-20 h-20 rounded-[2rem] flex items-center justify-center text-[#1A4E11] mx-auto mb-6">
                <Lock size={40} />
              </div>

              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                Mission Verification
              </h3>
              <p className="text-gray-500 font-bold text-xs mt-2">
                Enter the 6-digit code from the customer.
              </p>

              <input
                type="text"
                maxLength={6}
                // 0 er bodole ekhane chhoto chhoto dash placeholder hisebe dewa hoyeche
                placeholder="- - - - - -"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-gray-50 border-4 border-[#E4F5DC] rounded-[2rem] px-4 py-6 mt-8 text-center text-4xl font-black tracking-[0.2em] focus:border-orange-500 outline-none transition-all text-[#1A4E11] placeholder:text-gray-300"
              />

              <button
                disabled={isVerifying || otpValue.length < 6}
                onClick={handleVerifyOtp}
                className="w-full bg-[#1A4E11] text-white py-6 rounded-[2rem] mt-8 font-black text-[10px] tracking-widest hover:bg-orange-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-lg active:scale-95"
              >
                {isVerifying ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  "COMPLETE MISSION"
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiderDashboard;
