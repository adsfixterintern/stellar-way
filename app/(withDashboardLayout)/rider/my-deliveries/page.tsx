/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  IoBicycleOutline,
  IoCheckmarkDoneCircleOutline,
  IoFastFoodOutline,
  IoWalletOutline,
  IoCloseOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoEyeOutline,
  IoLockClosedOutline, 
} from "react-icons/io5";
import { getMyDeliveriesApi } from "@/app/modules/rider/rider.api";
import { IOrder } from "@/app/modules/rider/rider.interface";

const MyDelivery = () => {
  const { data: session, status } = useSession();
  const [deliveries, setDeliveries] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [filterType, setFilterType] = useState<"range" | "specific">("range");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [specificDate, setSpecificDate] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      const riderId = (session?.user as any)?.riderId;
      if (!riderId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const deliveryRes = await getMyDeliveriesApi(riderId);
        if (deliveryRes.success) setDeliveries(deliveryRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") fetchDeliveries();
  }, [session, status]);

  const filtered = useMemo(() => {
    return deliveries.filter((d) => {
      const createdDate = new Date(d.createdAt);
      if (filterType === "specific" && specificDate) {
        return createdDate.toDateString() === new Date(specificDate).toDateString();
      }
      if (filterType === "range") {
        const createdTime = createdDate.getTime();
        const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
        const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;
        if (start && end) return createdTime >= start && createdTime <= end;
        if (start) return createdTime >= start;
        if (end) return createdTime <= end;
      }
      return true;
    });
  }, [deliveries, startDate, endDate, specificDate, filterType]);

  const doneCount = filtered.filter((d) => d.deliveryStatus === "delivered").length;
  const totalEarned = filtered
    .filter((d) => d.deliveryStatus === "delivered")
    .reduce((sum, d) => sum + (d.totalPrice ?? 0), 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "on-the-way": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="w-full  py-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Delivery Intelligence</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Advanced Rider Performance Logs</p>
      </div>

      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
            <button onClick={() => setFilterType("range")} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${filterType === 'range' ? 'bg-[#1A4E11] text-white' : 'bg-gray-100 text-gray-400'}`}>Date Range</button>
            <button onClick={() => setFilterType("specific")} className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${filterType === 'specific' ? 'bg-[#1A4E11] text-white' : 'bg-gray-100 text-gray-400'}`}>Specific Date</button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {filterType === "range" ? (
            <>
              <div className="w-full md:w-auto flex-1">
                <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block ml-2">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold"/>
              </div>
              <div className="w-full md:w-auto flex-1">
                <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block ml-2">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold"/>
              </div>
            </>
          ) : (
            <div className="w-full md:w-auto flex-1">
              <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block ml-2">Target Date</label>
              <input type="date" value={specificDate} onChange={(e) => setSpecificDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold"/>
            </div>
          )}
          <button onClick={() => { setStartDate(""); setEndDate(""); setSpecificDate(""); }} className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-6 py-3 rounded-xl w-full md:w-auto">Clear Filters</button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <IoBicycleOutline />, label: "Tasks", value: filtered.length, color: "text-gray-800" },
          { icon: <IoCheckmarkDoneCircleOutline />, label: "Success", value: doneCount, color: "text-green-600" },
          { icon: <IoWalletOutline />, label: "Earnings", value: `৳${totalEarned}`, color: "text-[#1A4E11]" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-[28px] border border-gray-50 p-5 flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-gray-50 rounded-2xl text-[#1A4E11] text-xl">{card.icon}</div>
            <div>
              <p className="text-[9px] font-black uppercase text-gray-400">{card.label}</p>
              <p className={`text-xl font-black italic tracking-tighter ${card.color}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List Section */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 font-black text-gray-200 animate-pulse uppercase tracking-widest">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-200 text-gray-400 font-black uppercase text-[10px]">No logs found</div>
        ) : (
          filtered.map((order) => (
            <div key={order._id} className="bg-white rounded-[32px] p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#1A4E11] transition-colors"><IoFastFoodOutline size={20} /></div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 italic">#{order.transactionId}</p>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{order.customerInfo?.name || "Customer"}</h3>
                        {/* OTP Badge in List */}
                        <p className="text-[9px] font-black text-amber-600 uppercase flex items-center gap-1 mt-0.5">
                            <IoLockClosedOutline size={10} /> OTP: {order.deliveryOTP}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:flex items-center gap-4 md:gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                    <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusStyle(order.deliveryStatus)}`}>{order.deliveryStatus}</span>
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Settlement</p>
                        <p className="text-xs font-black text-gray-900">৳{order.totalPrice}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(order)} className="col-span-2 md:col-auto bg-gray-900 text-white flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-[#1A4E11] transition-all"><IoEyeOutline size={16} /> Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter italic">Order Breakdown</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors"><IoCloseOutline size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              {/* Security Section (OTP) - NEW */}
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-3xl flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Security Check (OTP)</p>
                  <p className="text-2xl font-black text-amber-900 tracking-[8px]">{selectedOrder.deliveryOTP}</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${selectedOrder.isOTPVerified ? 'bg-green-500 text-white border-green-600' : 'bg-amber-200 text-amber-700 border-amber-300'}`}>
                  {selectedOrder.isOTPVerified ? "Verified" : "Pending"}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <IoLocationOutline size={24} className="text-[#1A4E11] mt-1" />
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Delivery To</p>
                  <h3 className="font-black text-gray-900 uppercase">{selectedOrder.customerInfo?.name}</h3>
                  <p className="text-[11px] font-bold text-gray-500 mt-1 leading-relaxed">{selectedOrder.address}</p>
                  <p className="text-[10px] font-black text-green-600 mt-1 uppercase">{selectedOrder.customerInfo?.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Parcel Items</p>
                {selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-50">
                    <img src={item.menuId?.image?.url} alt="img" className="w-12 h-12 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{item.menuId?.title}</h4>
                      <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity} × ৳{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1A4E11] p-6 rounded-3xl text-white flex justify-between items-center shadow-xl shadow-green-900/20">
                <div>
                  <p className="text-[8px] font-black uppercase opacity-60">Total Bill</p>
                  <p className="text-2xl font-black italic tracking-tighter">৳{selectedOrder.totalPrice}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black uppercase opacity-60">Order Date</p>
                   <p className="text-[10px] font-black uppercase tracking-widest">{new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDelivery;