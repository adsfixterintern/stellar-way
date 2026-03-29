/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { IoCloseOutline, IoStar, IoChatbubbleEllipsesOutline, IoCallOutline } from "react-icons/io5";
import { useSocket } from "@/app/hooks/useSocket";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose, order }) => {
  const socket = useSocket();
  const [liveStatus, setLiveStatus] = useState(order?.deliveryStatus || "preparing");
  const [riderLocation, setRiderLocation] = useState({ 
    lat: order?.riderId?.lastLocation?.lat || 23.7771, 
    lng: order?.riderId?.lastLocation?.lng || 90.3995 
  });

  useEffect(() => {
    if (socket && isOpen && order?._id) {
      socket.emit("join-order", order._id);

      socket.on("location-updates", (data: any) => {
        if (data?.currentLocation) {
          setRiderLocation(data.currentLocation);
        }
        if (data?.status) {
          setLiveStatus(data.status);
        }
      });

      socket.on("notification", (data: any) => {
        console.log("Notification:", data.message);
      });
    }

    return () => {
      if (socket) {
        socket.off("location-updates");
        socket.off("notification");
      }
    };
  }, [socket, isOpen, order?._id]);

  if (!isOpen || !order) return null;

  const isDelivered = liveStatus === "delivered";
  const isOnTheWay = liveStatus === "on-the-way";
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-[32px] overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 bg-black text-white rounded-full hover:scale-110 transition-transform"
        >
          <IoCloseOutline size={22} />
        </button>

        <div className="p-6 text-center">
          <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight">Track Your Order</h2>

          <div className="relative w-full h-64 bg-[#E4F5DC] rounded-[28px] overflow-hidden mb-6 border border-gray-100 shadow-inner">
             <img 
               src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-home+1a4e11(${riderLocation.lng},${riderLocation.lat})/${riderLocation.lng},${riderLocation.lat},14/400x400?access_token=${mapboxToken}`} 
               alt="map" 
               className="w-full h-full object-cover opacity-80"
             />
             
             <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-5 h-5 bg-[#1A4E11] rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-5 h-5 bg-[#1A4E11] rounded-full absolute top-0 animate-ping opacity-50"></div>
             </div>

             <div className={`absolute transition-all duration-1000 ${isDelivered ? 'bottom-12 left-1/2 -translate-x-1/2' : 'top-16 left-1/3'} flex flex-col items-center`}>
                <div className="w-12 h-12 rounded-full border-2 border-[#1A4E11] overflow-hidden shadow-xl bg-white p-0.5">
                   <img 
                     src={order.riderId?.image || "https://cdn-icons-png.flaticon.com/512/10433/10433048.png"} 
                     alt="rider" 
                     className="object-cover w-full h-full rounded-full" 
                   />
                </div>
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#1A4E11] -mt-1"></div>
             </div>
          </div>

          <p className="text-[13px] text-gray-400 font-bold mb-1 uppercase tracking-widest">Estimated Arrival</p>
          <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">
              {isDelivered ? "00 - 00 minutes" : isOnTheWay ? "10 – 15 minutes" : "Calculating..."}
          </h3>

          <div className="bg-[#F9FAE3] rounded-[28px] p-5 text-left border border-[#F0F2D0]">
              <h4 className="font-black text-gray-800 text-sm">Order - #{order.transactionId?.slice(-8).toUpperCase()}</h4>

              <div className="flex items-center justify-between bg-white p-3 rounded-2xl mb-6 shadow-sm border border-gray-50 mt-3">
                  <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={order.riderId?.image || "https://cdn-icons-png.flaticon.com/512/10433/10433048.png"} 
                          className="w-11 h-11 rounded-full object-cover" 
                          alt="rider" 
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                          <p className="text-sm font-black text-gray-900">{order.riderId?.name || "Assigning Rider"}</p>
                          <div className="flex items-center text-amber-500 text-[11px] font-bold">
                              <IoStar className="mr-1" /> {order.riderId?.rating || "4.8"}
                          </div>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <a href={`tel:${order.riderId?.phone}`} className="p-2.5 bg-[#1A4E11] text-white rounded-full hover:scale-105 transition-all shadow-md">
                          <IoCallOutline size={18} />
                      </a>
                      <button className="p-2.5 bg-[#1A4E11] text-white rounded-full hover:scale-105 transition-all shadow-md">
                          <IoChatbubbleEllipsesOutline size={18} />
                      </button>
                  </div>
              </div>

              <div className="bg-[#1C1C1C] text-white p-4 rounded-[22px] flex items-center gap-4 shadow-xl">
                  <div className="w-11 h-11 bg-[#F39C12] rounded-full flex items-center justify-center text-xl shadow-inner">
                      {isDelivered ? "✅" : isOnTheWay ? "🛵" : "👨‍🍳"}
                  </div>
                  <div>
                      <p className="text-[13px] font-black uppercase tracking-wider">
                          {liveStatus?.replace('-', ' ') || "Processing"}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium tracking-tight">
                          {isDelivered ? "Enjoy your fresh meal!" : isOnTheWay ? "Rider is on the way to you." : "The Restaurant is cooking your meal."}
                      </p>
                  </div>
              </div>
          </div>

          {!isDelivered && (
             <div className="mt-6 p-4 border-2 border-dashed border-[#1A4E11]/30 rounded-[24px] bg-[#F4F9F1]">
                <p className="text-[11px] font-black text-[#1A4E11] uppercase mb-1 tracking-widest">Share this OTP with Rider</p>
                <h2 className="text-3xl font-black text-[#1A4E11] tracking-[10px] ml-[10px]">{order.deliveryOTP || "----"}</h2>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;