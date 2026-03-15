import React from "react";
import {
  OrderModalProps,
  OrderStatusDetails,
  OrderStatus,
} from "@/types/order";
import { MdCall } from "react-icons/md";
import { BiSolidMessageDots } from "react-icons/bi";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

/**
 * @component OrderTrackingModal
 * @description A highly reusable tracking modal for Next.js & TS.
 * * FEATURES:
 * 1. Dynamic UI: ETA, Titles, and Timeline update automatically via 'status' prop.
 * 2. Map Integration: Uses dynamic Latitude/Longitude to show real-time location.
 * 3. Responsive: Optimized for mobile and desktop views.
 * * PROPS:
 * - status: 'preparing' | 'on-the-way' | 'delivered'
 * - order: Object containing order number, food details, and driver info.
 * - location: { lat: number, lng: number } - Coordinates for the map.
 */

const STATUS_CONFIG: Record<OrderStatus, OrderStatusDetails> = {
  preparing: {
    title: "Preparing Your Order",
    subTitle: "Your food is being prepared with love!",
    eta: "30 - 40 minutes",
  },
  "on-the-way": {
    title: "Out For Delivery",
    subTitle: "Your Order Is On The Way To Your Location.",
    eta: "15 - 20 minutes",
  },
  delivered: {
    title: "Order Delivered",
    subTitle: "Enjoy your fresh meal!",
    eta: "Arrived",
  },
};

const OrderTrackingModal: React.FC<OrderModalProps> = ({
  status,
  order,
  isOpen,
  onClose,
  location = { lat: 23.8103, lng: 90.4125 }, // Default to Dhaka
}) => {
  if (!isOpen) return null;

  const currentStatus = STATUS_CONFIG[status];

  // Dynamic Google Maps Embed URL using provided coordinates
  const googleMapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* Modal Card */}
      <div className="bg-white rounded-[32px] w-full max-w-[454px] overflow-hidden relative shadow-2xl p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-black  cursor-pointer hover:text-red-500 bg-black rounded-full p-2 transition-all active:scale-90 z-20"
        >
          <IoClose size={20} color="white" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Track Your Order</h2>
        </div>

        {/* Dynamic Map Section */}
        <div className="h-[280px] rounded-3xl overflow-hidden mb-6 border border-gray-100 shadow-inner relative bg-gray-100">
          <iframe
            title="Order Location"
            src={googleMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="grayscale-[20%] opacity-90"
          />

          {/* Custom Overlay Markers (Static UI placeholders) */}
          <div className="absolute top-[30%] left-[48%] flex flex-col items-center pointer-events-none">
            <img
              src="/markers/location_driver.png"
              alt="Driver"
              className="w-10 h-10 rounded-full border-4 border-white shadow-xl"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        </div>

        {/* Delivery Info Section */}
        <div className="space-y-6">
          <div className="text-left">
            <p className="text-[20px] text-gray-500 font-medium">
              Estimated Arrival:{" "}
              <strong className="text-black font-extrabold">
                {currentStatus.eta}
              </strong>
            </p>
          </div>

          {/* Yellow Order Card */}
          <div className="bg-[#F5F5DC] p-6 rounded-3xl border border-gray-100">
            <div className="mb-5">
              <h3 className="font-bold text-gray-900 text-[20px] leading-tight">
                Your Order Number - {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {order.foodName} ×{order.foodQuantity}
              </p>
            </div>

            {/* Driver Profile & Actions */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-[12px] shadow-sm mb-5">
              <div className="w-[40px] h-[40px] rounded-full relative overflow-hidden bg-gray-200">
                <img
                  src={order.driver.avatarUrl}
                  alt={order.driver.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-gray-900 text-base">
                  {order.driver.name}
                </h4>
                <p className="text-xs font-bold flex items-center gap-1">
                  <FaStar className="text-yellow-600" size={16} />
                  {order.driver.rating.toFixed(1)}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-[36px] h-[36px] rounded-full bg-[#1A4E11] flex items-center justify-center hover:opacity-80">
                  <MdCall color="white" size={16} />
                </button>
                <button className="w-[36px] h-[36px] rounded-full bg-[#1A4E11] flex items-center justify-center hover:opacity-80">
                  <BiSolidMessageDots color="white" size={16} />
                </button>
              </div>
            </div>

            {/* Visual Timeline Tracker */}
            <div className="flex items-center justify-between px-4 mb-8 relative">
              <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] flex">
                <div
                  className={`flex-1 border-t-2 border-dashed transition-all ${
                    status !== "preparing"
                      ? "border-pink-400"
                      : "border-gray-300"
                  }`}
                ></div>
                <div
                  className={`flex-1 border-t-2 border-dashed transition-all ${
                    status === "delivered"
                      ? "border-pink-400"
                      : "border-gray-300"
                  }`}
                ></div>
              </div>

              {/* Status Points */}
              <div className="w-11 h-11 rounded-full bg-white shadow-sm border-2 z-10 flex items-center justify-center border-gray-100 text-lg">
                📋
              </div>
              <div
                className={`w-11 h-11 rounded-full bg-white shadow-sm border-2 z-10 flex items-center justify-center transition-all ${
                  status === "on-the-way" || status === "delivered"
                    ? "border-pink-100 scale-110"
                    : "border-gray-50 opacity-60"
                } text-lg`}
              >
                <span
                  className={status === "on-the-way" ? "animate-bounce" : ""}
                >
                  🛵
                </span>
              </div>
              <div
                className={`w-11 h-11 rounded-full bg-white shadow-sm border-2 z-10 flex items-center justify-center transition-all ${
                  status === "delivered"
                    ? "border-gray-100 scale-110"
                    : "border-gray-50 opacity-50"
                } text-lg`}
              >
                👍
              </div>
            </div>

            {/* Bottom Status Badge */}
            <div className="bg-stone-900 p-4 rounded-2xl flex items-start gap-4 shadow-lg">
              <img
                src="/assets/images/Menu Icon.png"
                alt="Status"
                className="w-[38px] h-[38px] object-contain"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://cdn-icons-png.flaticon.com/512/3502/3502688.png")
                }
              />
              <div>
                <h4 className="font-semibold text-white leading-tight">
                  {currentStatus.title}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {currentStatus.subTitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;

//   <OrderTrackingModal
//     status={currentStatus}
//     order={dummyOrder}
//     isOpen={isModalOpen}
//     onClose={() => setIsModalOpen(false)}
//   />
