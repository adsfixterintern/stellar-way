/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { MdCall, MdSend } from "react-icons/md";
import { BiSolidMessageDots } from "react-icons/bi";
import { IoClose, IoNavigate } from "react-icons/io5";
import { FaStar, FaThumbsUp } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSocket } from "@/app/hooks/useSocket";
import { getChatHistoryFromDB, sendMessageApi } from "@/app/modules/chat/chat.api";

const DEFAULT_LAT = 23.8103;
const DEFAULT_LNG = 90.4125;

const riderIcon = L.divIcon({
  className: "custom-rider-icon",
  html: `<div class="relative flex items-center justify-center">
          <div class="w-10 h-10 rounded-full border-2 border-green-800 overflow-hidden bg-white shadow-lg">
            <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-4 bg-orange-500 p-1 rounded-lg shadow-md text-white text-[10px]">🛵</div>
        </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
      setTimeout(() => map.invalidateSize(), 400);
    }
  }, [lat, lng, map]);
  return null;
}

const STATUS_CONFIG: any = {
  preparing: { title: "Preparing Order", sub: "Food is being cooked", icon: "👨‍🍳", eta: "30-40 min" },
  "on-the-way": { title: "Out For Delivery", sub: "Your Order Is On The Way To Your Location.", icon: "🛵", eta: "15-20 min" },
  delivered: { title: "Delivered Successfully", sub: "Your Order Has Been Delivered. Enjoy Your Meal!", icon: "✅", eta: "Arrived" },
};

const OrderTrackingModal = ({ status, order, isOpen, onClose, location, currentUser }: any) => {
  const socket = useSocket();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const lat = location?.lat || DEFAULT_LAT;
  const lng = location?.lng || DEFAULT_LNG;
  const normalizedStatus = status?.toLowerCase().trim() || "preparing";
  const current = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG.preparing;

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isOpen && order?.orderId) {
      getChatHistoryFromDB(order.orderId).then(res => {
        if (res.success) setMessages(res.data?.messages || []);
      });
      socket?.emit("join-order", order.orderId);
    }
  }, [isOpen, order?.orderId, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-message", (msg: any) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    });
    return () => { socket.off("new-message"); };
  }, [socket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket) return;
    const payload = {
      orderId: order.orderId,
      sender: currentUser.id,
      senderModel: (currentUser.role === "rider" ? "Rider" : "User") as "Rider" | "User",
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] w-full max-w-[420px] overflow-hidden relative shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="pt-8 pb-4 text-center relative">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Track Your Order</h2>
          <button onClick={onClose} className="absolute top-6 right-6 bg-black text-white rounded-full p-1.5 z-[1001] active:scale-90 transition-transform">
            <IoClose size={20} />
          </button>
        </div>

        <div className="px-6 pb-8 overflow-y-auto custom-scrollbar">
          {/* Map Area */}
          <div className="h-[200px] rounded-[32px] overflow-hidden mb-6 relative border border-gray-100 shadow-inner">
            <MapContainer center={[lat, lng]} zoom={15} zoomControl={false} style={{height: "100%", width: "100%"}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[lat, lng]} icon={riderIcon} />
              <RecenterMap lat={lat} lng={lng} />
            </MapContainer>
            <div className="absolute bottom-4 right-4 z-[1000] bg-green-900 p-2 rounded-full text-white shadow-lg">
              <IoNavigate size={22} />
            </div>
          </div>

          {/* New Highlighted OTP & ETA Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-4 w-full flex flex-col items-center gap-1 shadow-sm">
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Share OTP with Rider</span>
              <h1 className="text-4xl font-black text-orange-600 tracking-[0.3em]">{order.otp || "4582"}</h1>
              <div className="h-[1px] w-12 bg-orange-200 my-1"></div>
              <p className="text-gray-500 font-bold text-sm">
                Arriving in <span className="text-gray-900 font-black">{current.eta}</span>
              </p>
            </div>
          </div>

          {/* Yellow Info Card */}
          <div className="bg-[#F9F9E5] rounded-[2.5rem] p-6 shadow-sm border border-yellow-100/50 mb-4">
            <div className="mb-4">
              <h3 className="text-[16px] font-black text-gray-800 tracking-tight">Order - #{order.orderNumber}</h3>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">{order.foodName} ×{order.foodQuantity}</p>
            </div>

            {/* Rider Profile */}
            <div className="bg-white rounded-[24px] p-3 flex items-center gap-3 mb-6 shadow-sm border border-white">
              <img src={order.driver.avatarUrl || "https://i.pravatar.cc/150"} className="w-12 h-12 rounded-full object-cover bg-gray-100" alt="Rider" />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-900">{order.driver.name}</h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                  <FaStar className="text-orange-400" /> {order.driver.rating || "4.7"}
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${order.driver.phone}`} className="w-9 h-9 rounded-full bg-green-900 flex items-center justify-center text-white"><MdCall size={18}/></a>
                <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isChatOpen ? 'bg-orange-500' : 'bg-green-900'} text-white shadow-md`}><BiSolidMessageDots size={18}/></button>
              </div>
            </div>

            {/* Progress UI */}
            <div className="flex items-center justify-between px-4 mb-8 relative">
              <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[1px] border-t-2 border-dashed border-orange-200" />
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md z-10 border border-gray-50">
                <img src="https://cdn-icons-png.flaticon.com/512/3500/3500833.png" className="w-5 opacity-80" alt="booked" />
              </div>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg z-10 bg-white border-2 border-orange-50 ${normalizedStatus === 'on-the-way' ? 'scale-110 animate-pulse' : 'opacity-40'}`}>
                <img src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png" className="w-6" alt="bike" />
              </div>
              <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md z-10 border border-gray-50 ${normalizedStatus === 'delivered' ? 'opacity-100' : 'opacity-40'}`}>
                <FaThumbsUp className={normalizedStatus === 'delivered' ? 'text-pink-500' : 'text-gray-300'} size={14} />
              </div>
            </div>

            {/* Dark Status Box */}
            <div className="bg-[#141414] rounded-[24px] p-4 flex items-center gap-4 shadow-2xl border border-white/5">
              <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner shadow-orange-600/20">
                 {normalizedStatus === 'delivered' ? '✅' : (normalizedStatus === 'on-the-way' ? '🛵' : '🍳')}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-black text-sm uppercase tracking-wider">{current.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold leading-tight">{current.sub}</p>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          {isChatOpen && (
            <div className="mt-4 border-2 border-gray-100 rounded-[32px] overflow-hidden h-[240px] flex flex-col bg-white shadow-2xl animate-in slide-in-from-bottom-4">
              <div className="bg-gray-50 p-2 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b">Live Support</div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.senderModel === (currentUser.role === 'rider' ? 'Rider' : 'User') ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2 rounded-[20px] text-[12px] font-bold shadow-sm ${msg.senderModel === (currentUser.role === 'rider' ? 'Rider' : 'User') ? 'bg-green-900 text-white rounded-tr-none' : 'bg-white text-gray-700 border rounded-tl-none'}`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
              <div className="p-3 border-t flex gap-2 bg-white">
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type something..." className="flex-1 text-xs bg-gray-100 rounded-2xl px-4 outline-none border border-transparent focus:border-green-900/20 transition-all" />
                <button onClick={handleSendMessage} className="w-11 h-11 bg-green-900 rounded-2xl text-white flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-green-900/20"><MdSend size={20}/></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;