"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMyOrdersApi } from "@/app/modules/rider/rider.api"; 
import { IOrder } from "@/app/modules/rider/rider.interface";
import { 
  IoBagCheckOutline, IoTimeOutline, IoBicycleOutline, 
  IoCheckmarkDoneCircleOutline, IoFastFoodOutline 
} from "react-icons/io5";

const MyOrders = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.email) {
        try {
          const res = await getMyOrdersApi(session.user.email);
          if (res.success) {
            setOrders(res.data);
            setFilteredOrders(res.data);
          }
        } catch (err) {
          console.error("Order fetch error:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [session]);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.deliveryStatus === activeTab));
    }
  }, [activeTab, orders]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "on-the-way": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) return <div className="p-10 font-black text-[#1A4E11] text-center uppercase tracking-widest">Loading Stellar History...</div>;

  return (
    <div className="w-full px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">My Orders</h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Track your delicious journey with Stellar Way</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 p-1.5 bg-[#E4F5DC]/50 rounded-2xl w-fit border border-[#1A4E11]/5">
        {[
          { id: "all", label: "All", icon: <IoBagCheckOutline /> },
          { id: "pending", label: "Pending", icon: <IoTimeOutline /> },
          { id: "on-the-way", label: "On The Way", icon: <IoBicycleOutline /> },
          { id: "delivered", label: "Delivered", icon: <IoCheckmarkDoneCircleOutline /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id
                ? "bg-[#1A4E11] text-white shadow-xl shadow-green-900/20"
                : "text-gray-500 hover:bg-white hover:text-black"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container - Full Width */}
      <div className="w-full bg-white rounded-[30px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Menu Items</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Total Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Delivery OTP</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-[#E4F5DC]/10 transition-colors group">
                  <td className="px-8 py-6 font-mono text-xs font-bold text-gray-400 group-hover:text-[#1A4E11]">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-[#1A4E11] rounded-xl text-white">
                        <IoFastFoodOutline size={18} />
                      </div>
                      <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">
                        {order.items.length} {order.items.length > 1 ? "Variety Pack" : "Single Meal"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-[#1A4E11]">${order.totalPrice}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.deliveryStatus)}`}>
                      {order.deliveryStatus} </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-black border border-amber-100 tracking-widest">
                      {order.deliveryOTP || "----"}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;