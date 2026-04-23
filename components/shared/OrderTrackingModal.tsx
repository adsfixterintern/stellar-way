/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { 
  IoCloseOutline, IoStar, IoCallOutline, 
  IoChatbubbleEllipsesOutline, IoPaperPlane 
} from "react-icons/io5";
import { useSocket } from "@/app/hooks/useSocket";
import toast from "react-hot-toast";

const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
      Initializing Map...
    </div>
  )
});

const OrderTrackingModal = ({ isOpen, onClose, order, status }: any) => {
  const socket = useSocket();

  // ✅ বাইরের status এবং সকেটের লাইভ স্ট্যাটাস ম্যানেজ করা
  const [liveStatus, setLiveStatus] = useState(status || "preparing");
  const [showChatBox, setShowChatBox] = useState(false);
  const [message, setMessage] = useState("");
  
  const [riderLocation, setRiderLocation] = useState<[number, number]>([
    order?.riderId?.lastLocation?.lat ?? 23.8103,
    order?.riderId?.lastLocation?.lng ?? 90.4125
  ]);

  const customerLocation: [number, number] = [
    order?.deliveryLocation?.lat ?? 23.8103,
    order?.deliveryLocation?.lng ?? 90.4125
  ];

  const [estimatedTime, setEstimatedTime] = useState("Calculating...");

  // ✅ Initial status sync
  useEffect(() => {
    if (status) setLiveStatus(status);
  }, [status]);

  useEffect(() => {
    if (!socket || !isOpen || !order?._id) return;

    socket.emit("join-order", order._id);

    const handleLocationUpdate = (data: any) => {
      if (data?.currentLocation) {
        setRiderLocation([data.currentLocation.lat, data.currentLocation.lng]);
      }
      if (data?.status) {
        setLiveStatus(data.status);
      }
      if (data?.status === 'near-location') {
        setEstimatedTime("2 - 5 mins");
      } else if (data?.status === 'on-the-way') {
        setEstimatedTime("10 - 15 mins");
      }
    };

    socket.on("location-updates", handleLocationUpdate);
    return () => {
      socket.off("location-updates", handleLocationUpdate);
    };
  }, [socket, isOpen, order?._id]);

  // ✅ মেসেজ পাঠানোর ফাংশন (মোডালের ভেতর থেকেই)
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (socket) {
      socket.emit("send-message", {
        orderId: order._id,
        riderId: order.riderId?._id,
        message: message,
        sender: "customer"
      });
      
      toast.success("Message sent to rider!");
      setMessage("");
      setShowChatBox(false);
    }
  };

  if (!isOpen || !order) return null;

  const isDelivered = liveStatus === "delivered";
  const isOnTheWay = liveStatus === "on-the-way";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden font-sans">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-[32px] relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[110] p-1.5 bg-black text-white rounded-full hover:scale-110 transition-transform shadow-lg"
        >
          <IoCloseOutline size={22} />
        </button>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="text-center">
            <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight uppercase">
              Live Tracking
            </h2>

            <div className="relative w-full h-48 sm:h-56 rounded-[28px] overflow-hidden mb-6 border border-gray-100 z-10 shadow-inner">
              <MapComponent 
                riderLocation={riderLocation} 
                customerLocation={customerLocation} 
              />
            </div>

            <p className="text-[11px] text-gray-400 font-bold mb-1 uppercase tracking-widest">
              Estimated Arrival
            </p>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 uppercase">
              {isDelivered ? "Arrived" : isOnTheWay ? estimatedTime : "Preparing..."}
            </h3>

            <div className="bg-[#F9FAE3] rounded-[28px] p-5 text-left border border-[#F0F2D0] space-y-4">
              <h4 className="font-black text-gray-800 text-[10px] uppercase opacity-60">
                Order ID - #{order.transactionId?.slice(-8).toUpperCase()}
              </h4>
                
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={order.riderId?.userId?.image || "https://cdn-icons-png.flaticon.com/512/10433/10433048.png"} 
                    className="w-10 h-10 rounded-full object-cover border" 
                    alt="rider" 
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-900 truncate uppercase">
                      {order.riderId?.userId?.name || "Assigning..."}
                    </p>
                    <div className="flex items-center text-amber-500 text-[10px] font-bold">
                      <IoStar className="mr-1" /> 4.8
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* ✅ মেসেজ বাটন: ক্লিক করলে বক্স খুলবে */}
                  {isOnTheWay && (
                    <button 
                      onClick={() => setShowChatBox(!showChatBox)}
                      className={`p-2.5 rounded-full shadow-md transition-all ${showChatBox ? 'bg-black text-white' : 'bg-white text-[#1A4E11] border border-gray-100'}`}
                    >
                      <IoChatbubbleEllipsesOutline size={20} />
                    </button>
                  )}

                  {order.riderId?.phoneNumber && (
                    <a 
                      href={`tel:${order.riderId.phoneNumber}`} 
                      className="p-2.5 bg-[#1A4E11] text-white rounded-full shadow-lg active:scale-90 transition-transform"
                    >
                      <IoCallOutline size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* ✅ মেসেজ এরিয়া: নিচে বড় করে টেক্সট এরিয়া */}
              {showChatBox && isOnTheWay && (
                <div className="bg-white p-4 rounded-2xl border-2 border-[#1A4E11]/10 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[10px] font-black text-[#1A4E11] uppercase mb-2 tracking-widest">Instruction for rider</p>
                  <textarea 
                    rows={3}
                    placeholder="e.g. Please keep it at the door..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold outline-none resize-none"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-full mt-2 bg-[#1A4E11] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Send to Rider <IoPaperPlane size={14} />
                  </button>
                </div>
              )}

              {/* Status Banner */}
              <div className="bg-[#1C1C1C] text-white p-4 rounded-[22px] flex items-center gap-4 shadow-xl">
                <div className="w-10 h-10 bg-[#F39C12] rounded-full flex items-center justify-center text-xl shrink-0">
                  {isDelivered ? "✅" : isOnTheWay ? "🛵" : "👨‍🍳"}
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                    {liveStatus?.replace('-', ' ')}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium leading-tight">
                    {isDelivered ? "Delivered. Enjoy!" : isOnTheWay ? "Rider is moving!" : "Chef is cooking."}
                  </p>
                </div>
              </div>
            </div>

            {!isDelivered && (
              <div className="mt-6 p-4 border-2 border-dashed border-[#1A4E11]/30 rounded-[24px] bg-[#F4F9F1]">
                <p className="text-[9px] font-black text-[#1A4E11] uppercase tracking-widest">
                  Delivery OTP
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1A4E11] tracking-[8px] sm:tracking-[10px] ml-2">
                  {order.otp || "----"}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;