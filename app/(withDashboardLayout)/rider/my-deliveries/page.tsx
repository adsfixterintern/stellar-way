"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  IoBicycleOutline,
  IoCheckmarkDoneCircleOutline,
  IoFastFoodOutline,
  IoWalletOutline,
} from "react-icons/io5";
import {
  getMyDeliveriesApi,
  getRiderByUserIdApi,
} from "@/app/modules/rider/rider.api";
import { IOrder } from "@/app/modules/rider/rider.interface";

type FilterPeriod = "day" | "week" | "month";

const MyDelivery = () => {
  const { data: session } = useSession();
  const [deliveries, setDeliveries] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<FilterPeriod>("day");

  console.log(session)
  const id=session?.user.id
  console.log(id)

useEffect(() => {
  const fetchDeliveries = async () => {
    if (!session?.user?.id) return;
    try {
      
      // rider._id দিয়ে deliveries আনুন
      const res = await getMyDeliveriesApi(id.toString());
      console.log(res)
      if (res.success) setDeliveries(res.data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchDeliveries();
}, [session]);

  // ─── Day / Week / Month filtering ───
  const filtered = useMemo(() => {
    const now = new Date();
    return deliveries.filter((d) => {
      const created = new Date(d.createdAt);
      if (period === "day") {
        return created.toDateString() === now.toDateString();
      }
      if (period === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return created >= weekAgo;
      }
      // month
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    });
  }, [deliveries, period]);

  const doneCount = filtered.filter(
    (d) => d.deliveryStatus === "delivered"
  ).length;

  const totalEarned = filtered
    .filter((d) => d.deliveryStatus === "delivered")
    .reduce((sum, d) => sum + (d.totalPrice ?? 0), 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "on-the-way":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (loading)
    return (
      <div className="p-10 font-black text-[#1A4E11] text-center uppercase tracking-widest">
        Loading deliveries...
      </div>
    );

  return (
    <div className="w-full px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
          My Deliveries
        </h1>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Accepted deliveries from overview
        </p>
      </div>

      {/* Day / Week / Month Filter */}
      <div className="flex gap-3 p-1.5 bg-[#E4F5DC]/50 rounded-2xl w-fit border border-[#1A4E11]/5">
        {(
          [
            { id: "day", label: "Today" },
            { id: "week", label: "This Week" },
            { id: "month", label: "This Month" },
          ] as { id: FilterPeriod; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPeriod(tab.id)}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              period === tab.id
                ? "bg-[#1A4E11] text-white shadow-xl shadow-green-900/20"
                : "text-gray-500 hover:bg-white hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: <IoBicycleOutline size={20} />,
            label: "Total Deliveries",
            value: filtered.length,
            color: "text-gray-800",
          },
          {
            icon: <IoCheckmarkDoneCircleOutline size={20} />,
            label: "Completed",
            value: doneCount,
            color: "text-green-700",
          },
          {
            icon: <IoWalletOutline size={20} />,
            label: "Total Earned",
            value: `$${totalEarned.toFixed(2)}`,
            color: "text-[#1A4E11]",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2"
          >
            <div className="text-[#1A4E11]">{card.icon}</div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {card.label}
            </p>
            <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-[30px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
            No deliveries found for this period
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {[
                    "ID",
                    "Items",
                    "Total Price",
                    "Status",
                    "Delivery OTP",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-8 py-6 text-[10px] font-black uppercase tracking-[3px] text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((delivery) => (
                  <tr
                    key={delivery._id}
                    className="hover:bg-[#E4F5DC]/10 transition-colors group"
                  >
                    <td className="px-8 py-6 font-mono text-xs font-bold text-gray-400 group-hover:text-[#1A4E11]">
                      #{delivery._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#1A4E11] rounded-xl text-white">
                          <IoFastFoodOutline size={16} />
                        </div>
                        <span className="text-xs font-black text-gray-800 uppercase tracking-tighter">
                          {delivery.items.length}{" "}
                          {delivery.items.length > 1
                            ? "Variety Pack"
                            : "Single Meal"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-[#1A4E11]">
                        ${delivery.totalPrice}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(
                          delivery.deliveryStatus
                        )}`}
                      >
                        {delivery.deliveryStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-black border border-amber-100 tracking-widest">
                        {delivery.deliveryOTP ?? "----"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[11px] font-bold text-gray-400 uppercase">
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDelivery;