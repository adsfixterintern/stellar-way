/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { IoCloseOutline, IoStar, IoChatbubbleEllipsesOutline, IoCallOutline } from "react-icons/io5";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const isDelivered = order.deliveryStatus === "delivered";
  const isOnTheWay = order.deliveryStatus === "on-the-way";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-[32px] overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 bg-black text-white rounded-full hover:scale-110 transition-transform"
        >
          <IoCloseOutline size={22} />
        </button>

        <div className="p-6 text-center">
          <h2 className="text-lg font-black text-gray-900 mb-4 tracking-tight">Track Your Order</h2>

          {/* Map Illustration */}
          <div className="relative w-full h-64 bg-[#E4F5DC] rounded-[28px] overflow-hidden mb-6 border border-gray-100 shadow-inner">
             <img 
               src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/90.3995,23.7771,13,0/400x400?access_token=YOUR_MAPBOX_TOKEN" 
               alt="map" 
               className="w-full h-full object-cover opacity-60"
             />
             
             {/* Destination Marker (User) */}
             <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-5 h-5 bg-[#1A4E11] rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-5 h-5 bg-[#1A4E11] rounded-full absolute top-0 animate-ping opacity-50"></div>
             </div>

             {/* Rider Marker */}
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
              {isDelivered ? "00 - 00 minutes" : isOnTheWay ? "15 – 20 minutes" : "30 – 40 minutes"}
          </h3>

          {/* Order Info Card (The Yellow Section) */}
          <div className="bg-[#F9FAE3] rounded-[28px] p-5 text-left border border-[#F0F2D0]">
              <h4 className="font-black text-gray-800 text-sm">Your Order Number - #{order.transactionId?.slice(-8).toUpperCase()}</h4>
              <p className="text-[11px] text-gray-400 font-bold mb-4">Total Items: {order.items?.length || 0}</p>

              {/* Rider Info Row */}
              <div className="flex items-center justify-between bg-white p-3 rounded-2xl mb-6 shadow-sm border border-gray-50">
                  <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={order.riderId?.image || "https://cdn-icons-png.flaticon.com/512/10433/10433048.png"} 
                          className="w-11 h-11 rounded-full object-cover border border-gray-100" 
                          alt="rider" 
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                          <p className="text-sm font-black text-gray-900">{order.riderId?.name || "Assigning Rider"}</p>
                          <div className="flex items-center text-amber-500 text-[11px] font-bold">
                              <IoStar className="mr-1" /> {order.riderId?.rating || "4.7"}
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

              {/* Custom Stepper (Pink Progress Line) */}
              <div className="flex items-center justify-between px-3 mb-6 relative">
                  <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-gray-200 -translate-y-1/2 z-0"></div>
                  <div 
                    className="absolute top-1/2 left-4 h-[2px] bg-[#E91E63] -translate-y-1/2 z-0 transition-all duration-700" 
                    style={{ width: isDelivered ? '90%' : isOnTheWay ? '45%' : '5%' }}
                  ></div>

                  {/* Step 1: Restaurant */}
                  <div className={`w-9 h-9 rounded-full z-10 flex items-center justify-center bg-white border-2 transition-colors ${!isDelivered ? 'border-[#E91E63] text-[#E91E63]' : 'border-gray-200 text-gray-300'}`}>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7z"/></svg>
                  </div>
                  {/* Step 2: Rider */}
                  <div className={`w-11 h-11 rounded-full z-10 flex items-center justify-center bg-white border-2 transition-all ${isOnTheWay || isDelivered ? 'border-[#E91E63]' : 'border-gray-200'}`}>
                      <img src="https://cdn-icons-png.flaticon.com/512/2830/2830305.png" className={`w-7 h-7 object-contain ${!isOnTheWay && !isDelivered && 'grayscale opacity-30'}`} alt="delivery" />
                  </div>
                  {/* Step 3: Check/Done */}
                  <div className={`w-9 h-9 rounded-full z-10 flex items-center justify-center border-2 transition-colors ${isDelivered ? 'bg-[#E91E63] border-[#E91E63] text-white shadow-lg shadow-pink-200' : 'bg-white border-gray-200 text-gray-300'}`}>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="font-bold"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>
                  </div>
              </div>

              {/* Status Message Box (The Dark Box) */}
              <div className="bg-[#1C1C1C] text-white p-4 rounded-[22px] flex items-center gap-4 shadow-xl">
                  <div className="w-11 h-11 bg-[#F39C12] rounded-full flex items-center justify-center text-xl shadow-inner">
                      {isDelivered ? "✅" : isOnTheWay ? "🛵" : "👨‍🍳"}
                  </div>
                  <div>
                      <p className="text-[13px] font-black uppercase tracking-wider">
                          {isDelivered ? "Delivered Successfully" : isOnTheWay ? "Out For Delivery" : "Preparing Your Order"}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium tracking-tight">
                          {isDelivered ? "Enjoy your fresh meal!" : isOnTheWay ? "Rider is on the way to you." : "The Restaurant is cooking your meal."}
                      </p>
                  </div>
              </div>
          </div>

          {/* OTP Section for User */}
          {!isDelivered && (
             <div className="mt-6 p-4 border-2 border-dashed border-[#1A4E11]/30 rounded-[24px] bg-[#F4F9F1]">
                <p className="text-[11px] font-black text-[#1A4E11] uppercase mb-1 tracking-widest">Share this OTP with Rider</p>
                <h2 className="text-3xl font-black text-[#1A4E11] tracking-[10px] ml-[10px]">{order.deliveryOTP || "1234"}</h2>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;