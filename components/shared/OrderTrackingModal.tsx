/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { IoCloseOutline, IoStar, IoCallOutline } from "react-icons/io5";
import { useSocket } from "@/app/hooks/useSocket";

const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-tighter">
      Initializing Map...
    </div>
  )
});

const OrderTrackingModal = ({ isOpen, onClose, order }: any) => {
  const socket = useSocket();

  // ✅ FIX 1: initial state safe
  const [liveStatus, setLiveStatus] = useState("preparing");

  // ✅ FIX 2: rider location safe init
  const [riderLocation, setRiderLocation] = useState<[number, number]>([
    order?.riderId?.lastLocation?.lat ?? 23.8103,
    order?.riderId?.lastLocation?.lng ?? 90.4125
  ]);

  const customerLocation: [number, number] = [
    order?.deliveryLocation?.lat ?? 23.8103,
    order?.deliveryLocation?.lng ?? 90.4125
  ];

  const [estimatedTime, setEstimatedTime] = useState("Calculating...");

  // ✅ FIX 3: order status sync (VERY IMPORTANT)
  useEffect(() => {
    if (order?.deliveryStatus) {
      setLiveStatus(order.deliveryStatus);
    }
  }, [order?.deliveryStatus]);

  // ✅ FIX 4: socket handling (stable + clean)
  useEffect(() => {
    if (!socket || !isOpen || !order?._id) return;

    socket.emit("join-order", order._id);

    const handleLocationUpdate = (data: any) => {
      console.log("Socket Data:", data);

      // location update
      if (data?.currentLocation) {
        setRiderLocation([
          data.currentLocation.lat,
          data.currentLocation.lng
        ]);
      }

      // ✅ ALWAYS override status (main fix)
      if (data?.status) {
        setLiveStatus(data.status);
      }

      // ETA logic
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

  if (!isOpen || !order) return null;

  const isDelivered = liveStatus === "delivered";
  const isOnTheWay = liveStatus === "on-the-way";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-[32px] overflow-hidden relative my-8 animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[110] p-1.5 bg-black text-white rounded-full hover:scale-110 transition-transform"
        >
          <IoCloseOutline size={22} />
        </button>

        <div className="p-6 text-center">
          <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight">
            Live Tracking
          </h2>

          <div className="relative w-full h-64 rounded-[28px] overflow-hidden mb-6 border border-gray-100 z-10 shadow-inner">
            <MapComponent 
              riderLocation={riderLocation} 
              customerLocation={customerLocation} 
            />
          </div>

          <p className="text-[13px] text-gray-400 font-bold mb-1 uppercase tracking-widest">
            Estimated Arrival
          </p>

          <h3 className="text-2xl font-black text-gray-900 mb-6">
            {isDelivered 
              ? "Arrived" 
              : isOnTheWay 
              ? estimatedTime 
              : "Restaurant Cooking..."}
          </h3>

          <div className="bg-[#F9FAE3] rounded-[28px] p-5 text-left border border-[#F0F2D0]">
            
            <h4 className="font-black text-gray-800 text-[10px] uppercase">
              Order ID - #{order.transactionId?.slice(-8).toUpperCase()}
            </h4>
              
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl mb-4 shadow-sm mt-3 border border-gray-50">
              <div className="flex items-center gap-3">
                
                <img 
                  src={order.riderId?.userId?.image || "https://cdn-icons-png.flaticon.com/512/10433/10433048.png"} 
                  className="w-11 h-11 rounded-full object-cover border" 
                  alt="rider" 
                />

                <div>
                  <p className="text-sm font-black text-gray-900">
                    {order.riderId?.userId?.name || "Assigning..."}
                  </p>

                  <div className="flex items-center text-amber-500 text-[10px] font-bold">
                    <IoStar className="mr-1" /> 4.8
                  </div>
                </div>
              </div>

              {order.riderId?.phoneNumber && (
                <a 
                  href={`tel:${order.riderId.phoneNumber}`} 
                  className="p-2.5 bg-[#1A4E11] text-white rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  <IoCallOutline size={18} />
                </a>
              )}
            </div>

            <div className="bg-[#1C1C1C] text-white p-4 rounded-[22px] flex items-center gap-4 shadow-xl">
              <div className="w-11 h-11 bg-[#F39C12] rounded-full flex items-center justify-center text-xl animate-bounce">
                {isDelivered ? "✅" : isOnTheWay ? "🛵" : "👨‍🍳"}
              </div>

              <div>
                <p className="text-[12px] font-black uppercase text-amber-400 tracking-wider">
                  {liveStatus?.replace('-', ' ')}
                </p>

                <p className="text-[11px] text-gray-400 mt-0.5 font-medium leading-tight">
                  {isDelivered 
                    ? "Your meal has been delivered. Enjoy!" 
                    : isOnTheWay 
                    ? "Rider is picking up speed!" 
                    : "The chef is preparing your meal with care."}
                </p>
              </div>
            </div>
          </div>

          {!isDelivered && (
            <div className="mt-6 p-4 border-2 border-dashed border-[#1A4E11]/30 rounded-[24px] bg-[#F4F9F1]">
              <p className="text-[10px] font-black text-[#1A4E11] uppercase tracking-widest">
                Delivery OTP
              </p>
              <h2 className="text-3xl font-black text-[#1A4E11] tracking-[10px] ml-2">
                {order.deliveryOTP || "----"}
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
