/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  IoCloseOutline,
  IoStar,
  IoCallOutline,
  IoChatbubbleEllipsesOutline,
  IoPaperPlane,
  IoLocationSharp,
  IoTimeOutline,
} from "react-icons/io5";
import { useSocket } from "@/app/hooks/useSocket";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  getChatHistoryFromDB,
  sendMessageApi,
} from "@/app/modules/chat/chat.api";
import { motion, AnimatePresence } from "framer-motion";

// Leaflet specific imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Helpers ---
// Distance Calculation (Haversine Formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // returns distance in km
};

// Map Updater Component to pan the map when rider moves
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.panTo(center, { animate: true });
    }
  }, [center, map]);
  return null;
};

// Custom Marker Icons (Fixes Leaflet default icon issue in Next.js)
const riderIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/71/71422.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const customerIconMarker = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MapComponent = ({ riderLocation, customerLocation }: any) => {
  return (
    <div className="h-full w-full">
      <MapContainer
        center={riderLocation}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={riderLocation} icon={riderIcon}>
          <Popup>Rider is here</Popup>
        </Marker>
        <Marker position={customerLocation} icon={customerIconMarker}>
          <Popup>You are here</Popup>
        </Marker>
        <MapUpdater center={riderLocation} />
      </MapContainer>
    </div>
  );
};

const OrderTrackingModal = ({ isOpen, onClose, order, status }: any) => {
  const { data: session } = useSession();
  const socket = useSocket();
  const orderId = order?._id || order?.orderId;

  const [liveStatus, setLiveStatus] = useState(status || "preparing");
  const [showChatBox, setShowChatBox] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [etaTime, setEtaTime] = useState<string>("Calculating...");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [riderLocation, setRiderLocation] = useState<[number, number]>(() => {
    const rLat = order?.riderId?.lastLocation?.lat;
    const rLng = order?.riderId?.lastLocation?.lng;

    if (rLat && rLng && rLat !== 0) {
      return [rLat, rLng];
    }
    return [22.701, 90.3535]; 
  });

  const customerLocation: [number, number] = useMemo(
    () => [
      order?.deliveryLocation?.lat || 23.8103,
      order?.deliveryLocation?.lng || 90.4125,
    ],
    [order],
  );

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- Real-time Location & ETA Logic ---
  useEffect(() => {
    if (!socket || !isOpen || !orderId) return;

    socket.emit("join-order", orderId);

    const handleLocationUpdate = (data: any) => {
      // কনসোল চেক করুন ডেটা আসছে কিনা
      console.log("Received Tracking Data:", data);

      if (data?.currentLocation?.lat && data?.currentLocation?.lng) {
        const newLat = data.currentLocation.lat;
        const newLng = data.currentLocation.lng;
        if (newLat !== 0 && newLng !== 0) {
          setRiderLocation([newLat, newLng]);

          const dist = calculateDistance(
            newLat,
            newLng,
            customerLocation[0],
            customerLocation[1],
          );

          const timeInMin = Math.round((dist / 20) * 60);
          setEtaTime(dist < 0.2 ? "Arriving Now" : `${timeInMin + 2} mins`);
        }
      }

      if (data?.status) {
        setLiveStatus(data.status);
      }
    };

    socket.on("location-updates", handleLocationUpdate);
    socket.on("new-message", (msg: any) => {
      setChatMessages((prev) => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      socket.off("location-updates");
      socket.off("new-message");
    };
  }, [socket, isOpen, orderId, customerLocation]);

  // Initial Chat & Status Sync
  useEffect(() => {
    if (status) setLiveStatus(status);
    if (isOpen && orderId) {
      getChatHistoryFromDB(orderId).then((res) => {
        if (res.success) setChatMessages(res.data?.messages || []);
        setTimeout(scrollToBottom, 200);
      });
    }
  }, [status, isOpen, orderId]);

  const handleSendMessage = async () => {
    if (!message.trim() || !socket || !orderId) return;
    const currentUser: any = session?.user;
    const payload = {
      orderId,
      sender: currentUser?.id || currentUser?._id,
      senderModel:
        currentUser?.role?.toLowerCase() === "rider" ? "Rider" : "User",
      message: message.trim(),
    };

    try {
      const res = await sendMessageApi(payload);
      if (res.success) {
        socket.emit("send-message", payload);
        setMessage("");
      }
    } catch (err) {
      toast.error("Failed to send");
    }
  };

  if (!isOpen || !order) return null;

  const isDelivered = liveStatus === "delivered";
  const isOnTheWay =
    liveStatus === "on-the-way" || liveStatus === "near-location";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-white w-full max-w-md shadow-2xl rounded-[40px] relative flex flex-col max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">
              Track Delivery
            </h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              Order: #
              {order?.orderNumber?.slice(-8).toUpperCase() || "SAVORY-NEST"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-full transition-all"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Map & ETA */}
          <div className="relative w-full h-56 rounded-[35px] overflow-hidden shadow-inner border border-gray-100 bg-gray-50">
            <MapComponent
              riderLocation={riderLocation}
              customerLocation={customerLocation}
            />
            <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl flex justify-between items-center shadow-lg border border-white/50 z-[10]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1A4E11]/10 text-[#1A4E11] rounded-xl">
                  <IoTimeOutline
                    size={20}
                    className={isOnTheWay ? "animate-pulse" : ""}
                  />
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase leading-none mb-1">
                    Time to arrive
                  </p>
                  <p className="text-sm font-black text-gray-900">
                    {isDelivered
                      ? "Reached"
                      : isOnTheWay
                        ? etaTime
                        : "Preparing"}
                  </p>
                </div>
              </div>
              <IoLocationSharp
                className="text-[#1A4E11] animate-bounce"
                size={20}
              />
            </div>
          </div>

          {/* Rider & Chat Section (UI from your code) */}
          <div className="bg-[#F8FAF6] rounded-[35px] p-5 border border-[#E4F5DC] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      order.riderId?.userId?.image ||
                      "https://cdn-icons-png.flaticon.com/512/10433/10433048.png"
                    }
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
                    alt="rider"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 uppercase mb-1">
                    {order.riderId?.userId?.name || "Rider Assigning..."}
                  </p>
                  <span className="flex items-center text-amber-500 text-[10px] font-black bg-white px-2 py-0.5 rounded-full border border-amber-100">
                    <IoStar className="mr-0.5" /> 4.9
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowChatBox(!showChatBox);
                    setTimeout(scrollToBottom, 300);
                  }}
                  className={`p-3 rounded-2xl transition-all shadow-sm ${showChatBox ? "bg-black text-white" : "bg-white text-[#1A4E11] border border-gray-200"}`}
                >
                  <IoChatbubbleEllipsesOutline size={22} />
                </button>
              </div>
            </div>

            {/* Chat Box (Same as before) */}
            <AnimatePresence>
              {showChatBox && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 280, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white rounded-[25px] border border-gray-100 shadow-inner overflow-hidden flex flex-col mb-4"
                >
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/20 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.senderModel === "User" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 rounded-[18px] text-[11px] font-bold shadow-sm ${msg.senderModel === "User" ? "bg-[#1A4E11] text-white rounded-tr-none" : "bg-white text-gray-800 border rounded-tl-none"}`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                  <div className="p-3 border-t bg-white flex gap-2">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Message your rider..."
                      className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-[11px] font-bold outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-[#1A4E11] text-white p-2.5 rounded-xl"
                    >
                      <IoPaperPlane size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="bg-[#1C1C1C] text-white p-5 rounded-[30px] flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">
                {isDelivered ? "✅" : isOnTheWay ? "🛵" : "👨‍🍳"}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase text-amber-400 tracking-wider mb-1">
                  {liveStatus?.replace("-", " ")}
                </p>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: isDelivered ? "100%" : isOnTheWay ? "70%" : "30%",
                    }}
                    className="h-full bg-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OTP Section */}
          {!isDelivered && (
            <div className="p-6 bg-[#F4F9F1] rounded-[35px] text-center border-2 border-dashed border-[#1A4E11]/20">
              <p className="text-[10px] font-black text-[#1A4E11] uppercase tracking-[0.2em] mb-1">
                Confirmation OTP
              </p>
              <h2 className="text-4xl font-black text-[#1A4E11] tracking-[12px] ml-3">
                {order.otp || "----"}
              </h2>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OrderTrackingModal;
