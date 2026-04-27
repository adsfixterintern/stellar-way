/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import { MdCall, MdSend } from "react-icons/md";
import { BiSolidMessageDots } from "react-icons/bi";
import { IoClose, IoNavigate } from "react-icons/io5";
import { FaStar, FaThumbsUp } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSocket } from "@/app/hooks/useSocket";
import {
  getChatHistoryFromDB,
  sendMessageApi,
} from "@/app/modules/chat/chat.api";
import toast from "react-hot-toast";

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
      map.invalidateSize();
    }
  }, [lat, lng, map]);
  return null;
}

const STATUS_CONFIG: any = {
  preparing: {
    title: "Preparing Order",
    sub: "Food is being cooked",
    eta: "30-40 min",
  },
  "on-the-way": {
    title: "Out For Delivery",
    sub: "Your Order Is On The Way.",
    eta: "15-20 min",
  },
  delivered: {
    title: "Delivered Successfully",
    sub: "Enjoy Your Meal!",
    eta: "Arrived",
  },
};

const OrderTrackingModal = ({
  status,
  order,
  isOpen,
  onClose,
  location,
  currentUser,
}: any) => {
  const socket = useSocket();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [liveLocation, setLiveLocation] = useState(
    location || { lat: 23.8103, lng: 90.4125 },
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const orderId = order?.orderId;
  console.log(orderId);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // JOIN + HISTORY
  useEffect(() => {
    if (!isOpen || !socket || !orderId) return;

    socket.emit("join-order", orderId);

    getChatHistoryFromDB(orderId).then((res) => {
      if (res.success) setMessages(res.data?.messages || []);
    });
  }, [isOpen, orderId, socket]);

  // SOCKET LISTENER
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    const handleLocation = (data: any) => {
      if (data?.currentLocation) {
        setLiveLocation(data.currentLocation);
      }
    };

    socket.on("new-message", handleMessage);
    socket.on("location-updates", handleLocation);

    return () => {
      socket.off("new-message", handleMessage);
      socket.off("location-updates", handleLocation);
    };
  }, [socket]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!newMessage.trim() || !socket || !orderId) return;

    // model name strictly backend-er sathe match hote hobe
    const senderModel =
      currentUser?.role?.toLowerCase() === "rider" ? "Rider" : "User";

    const payload = {
      orderId: orderId, // ensure eta string/ID
      sender: currentUser?.id || currentUser?._id, 
      senderModel: senderModel,
      message: newMessage.trim(),
    };

    // Debugging-er jonno ekhane log check korun
    console.log("PAYLOAD TO SOCKET:", payload);

    try {
      const res = await sendMessageApi(payload as any);
      if (res?.success) {
        socket.emit("send-message", payload);
        setNewMessage("");
      }
    } catch (err) {
      toast.error("Message send failed");
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[40px] w-full max-w-[420px] overflow-hidden relative shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="pt-8 pb-4 text-center relative">
          <h2 className="text-xl font-black text-gray-900">Track Your Order</h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-black text-white rounded-full p-1.5 z-[1001]"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="px-6 pb-8 overflow-y-auto custom-scrollbar">
          {/* Map Area */}
          <div className="h-[200px] rounded-[32px] overflow-hidden mb-6 relative border border-gray-100">
            <MapContainer
              center={[liveLocation.lat, liveLocation.lng]}
              zoom={15}
              zoomControl={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[liveLocation.lat, liveLocation.lng]}
                icon={riderIcon}
              />
              <RecenterMap lat={liveLocation.lat} lng={liveLocation.lng} />
            </MapContainer>
          </div>

          {/* OTP Section */}
          <div className="bg-orange-50 border-2 border-orange-100 rounded-3xl p-4 flex flex-col items-center mb-6">
            <span className="text-[10px] font-black text-orange-400 uppercase">
              Share OTP with Rider
            </span>
            <h1 className="text-4xl font-black text-orange-600 tracking-[0.3em]">
              {order.otp || "----"}
            </h1>
            <p className="text-gray-500 font-bold text-sm mt-2">
              Arriving in{" "}
              <span className="text-gray-900 font-black">{current?.eta}</span>
            </p>
          </div>

          {/* Rider Info */}
          <div className="bg-[#F9F9E5] rounded-[2.5rem] p-6 mb-4">
            <div className="bg-white rounded-[24px] p-3 flex items-center gap-3 shadow-sm border border-white">
              <img
                src={order.driver.avatarUrl || "https://i.pravatar.cc/150"}
                className="w-12 h-12 rounded-full object-cover"
                alt="Rider"
              />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-900">
                  {order.driver.name}
                </h4>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                  <FaStar className="text-orange-400" />{" "}
                  {order.driver.rating || "4.7"}
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${order.driver.phone}`}
                  className="w-9 h-9 rounded-full bg-green-900 flex items-center justify-center text-white"
                >
                  <MdCall size={18} />
                </a>
                <button
                  onClick={() => {
                    setIsChatOpen(!isChatOpen);
                    scrollToBottom();
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isChatOpen ? "bg-orange-500" : "bg-green-900"} text-white shadow-md`}
                >
                  <BiSolidMessageDots size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          {/* Chat Section */}
          {isChatOpen && (
            <div className="mt-2 border-2 border-gray-100 rounded-[32px] overflow-hidden h-[300px] flex flex-col bg-white shadow-xl animate-in slide-in-from-bottom-2">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 custom-scrollbar">
                {messages.map((msg, i) => {
                  // Current user er message check logic
                  const isMe =
                    msg.senderModel ===
                      (currentUser.role === "rider" ? "Rider" : "User") ||
                    (msg.sender?._id || msg.sender) === currentUser.id;

                  return (
                    <div
                      key={i}
                      className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar for other user */}
                      {!isMe && (
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-gray-200">
                          <img
                            src={
                              msg.sender?.image ||
                              msg.sender?.avatarUrl ||
                              "https://i.pravatar.cc/150"
                            }
                            className="w-full h-full object-cover"
                            alt="avatar"
                          />
                        </div>
                      )}

                      <div
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[200px] px-4 py-2.5 text-[12px] font-bold shadow-sm ${
                            isMe
                              ? "bg-green-900 text-white rounded-[20px] rounded-br-none"
                              : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-bl-none"
                          }`}
                        >
                          {msg.message}
                        </div>
                        {/* Time display */}
                        <span className="text-[8px] text-gray-400 mt-1 font-black uppercase">
                          {msg.time
                            ? new Date(msg.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t flex gap-2 items-center"
              >
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 text-xs bg-gray-50 rounded-2xl px-4 py-3 outline-none border border-transparent focus:border-green-900 transition-all font-bold"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-green-900 hover:bg-orange-500 disabled:bg-gray-200 text-white rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <MdSend size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
