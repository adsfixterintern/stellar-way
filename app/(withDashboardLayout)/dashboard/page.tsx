/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useMyOrders } from "@/app/hooks/useMyOrders";
import { useMenu } from "@/app/hooks/useMenu";
import {
  ShoppingBag,
  Star,
  Clock,
  Tag,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CustomerDashboardOverview() {
  const { data: session } = useSession();
  const customerEmail = session?.user?.email as string;
  const [copied, setCopied] = useState(false);

  const { data: ordersData, isLoading: ordersLoading } =
    useMyOrders(customerEmail);
  const orders = ordersData?.data || [];
  const { data: allMenus, isLoading: menuLoading } = useMenu();

  const activeOrders = orders.filter(
    (order: any) =>
      order.deliveryStatus !== "delivered" &&
      order.deliveryStatus !== "cancelled",
  );
  const deliveredOrders = orders.filter(
    (order: any) => order.deliveryStatus === "delivered",
  );
  const totalSpent = deliveredOrders.reduce(
    (sum: number, order: any) => sum + (order.totalPrice || 0),
    0,
  );

  console.log(totalSpent)

  const recentOrder = orders.length > 0 ? orders[0] : null;

  const firstItemId =
    recentOrder?.items?.[0]?.menuId?.$oid || recentOrder?.items?.[0]?.menuId;

  const recentMenuDetails = allMenus?.find(
    (menu: any) => (menu._id?.$oid || menu._id) === firstItemId,
  );

  const recommendedItems = allMenus?.slice(0, 4) || [];

  const totalSavings = deliveredOrders.reduce(
    (sum: number, order: any) =>
      sum + (order.discount || order.totalPrice * 0.1),
    0,
  );

  const monthlyGoal = 5000;
  const spendingPercentage = Math.min((totalSpent / monthlyGoal) * 100, 100);

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Coupon code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (ordersLoading || menuLoading) {
    return (
      <div className="p-20 text-center font-black text-gray-400 animate-pulse">
        Loading Your Nest...
      </div>
    );
  }

  return (
    <div className="bg-[#FDFCFD] min-h-screen p-4 md:p-8 font-sans antialiased">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Guest"}!
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Ready for your next delicious meal?
          </p>
        </div>
        <Link
          href="/menu"
          className="bg-[#1A4E11] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-900/10 hover:opacity-90 transition-all"
        >
          Order Now <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-500">
                <Clock size={26} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  Active
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {activeOrders.length}
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-green-50 p-4 rounded-2xl text-[#1A4E11]">
                <ShoppingBag size={26} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  Orders
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {orders.length}
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                <Tag size={26} />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  Spent
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  ৳{totalSpent}
                </h3>
              </div>
            </div>
          </div>

          {/* Recent Order Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xl text-gray-900 uppercase tracking-tight">
                Recent Order
              </h3>
              <Link
                href="/dashboard/my-orders"
                className="text-[#1A4E11] text-xs font-bold flex items-center gap-1 hover:underline transition-all"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {recentOrder ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-50 p-6 rounded-2xl bg-gray-50/30 group">
                <div className="flex items-center gap-5 flex-1">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl relative overflow-hidden border border-gray-100 shadow-inner">
                    <Image
                      src={
                        recentMenuDetails?.image?.url ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                      }
                      alt="Order Item"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      ID: #{recentOrder.transactionId?.slice(-6).toUpperCase()}
                    </p>

                    <h4 className="font-black text-lg text-gray-900">
                      {recentMenuDetails?.title || "Delicious Feast"}
                      {recentOrder.items?.length > 1 &&
                        ` +${recentOrder.items.length - 1} more`}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium italic">
                      Placed on{" "}
                      {new Date(
                        recentOrder.createdAt?.$date || recentOrder.createdAt,
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        recentOrder.deliveryStatus === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {recentOrder.deliveryStatus || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                  {recentOrder.deliveryStatus === "delivered" ? (
                    <Link
                      href="/dashboard/my-orders"
                      className="w-full md:w-auto bg-[#1A4E11] text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[2px] shadow-lg flex items-center justify-center gap-2 hover:bg-black transition-colors"
                    >
                      Rate Now
                    </Link>
                  ) : (
                    <div className="text-center md:text-right border-l-2 border-[#1A4E11] pl-4">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        OTP for delivery
                      </p>
                      <p className="text-lg font-black text-[#1A4E11] tracking-[3px]">
                        {recentOrder.deliveryOTP || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                <ShoppingBag size={40} className="mx-auto text-gray-200" />
                <p className="text-gray-500 mt-4 font-medium italic">
                  No orders found.
                </p>
              </div>
            )}
          </div>
          {/* --- বাম পাশের নিচের নতুন সেকশন --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ১. Spending Analysis Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <Tag size={18} className="text-[#1A4E11]" /> Spending Analysis
              </h3>

              <div className="space-y-5 relative z-10">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    <span>Monthly Target (৳{monthlyGoal})</span>
                    <span className="text-[#1A4E11]">
                      {Math.round(spendingPercentage)}%
                    </span>
                  </div>
                  {/* ডাইনামিক প্রগ্রেস বার */}
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1A4E11] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${spendingPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                      Avg. Order
                    </p>
                    <p className="text-lg font-black text-gray-900 mt-1">
                      ৳
                      {orders.length > 0
                        ? Math.round(totalSpent / orders.length)
                        : 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-green-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                      Total Savings
                    </p>
                    {/* ডাইনামিক সেভিংস */}
                    <p className="text-lg font-black text-green-600 mt-1">
                      ৳{Math.round(totalSavings)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            {/* ২. Need Help / Support Card */}
            <div className="bg-linear-to-br from-gray-900 to-black p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <h3 className="font-black text-xl leading-tight">
                  Need help with
                  <br />
                  your order?
                </h3>
                <p className="text-gray-400 text-xs mt-3 font-medium">
                  Our support team is available 24/7 to assist you.
                </p>

                <div className="mt-8 space-y-3">
                  <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl text-xs font-bold transition-all">
                    Live Chat Support
                  </button>
                  <button className="w-full bg-[#1A4E11] hover:bg-green-700 py-3 rounded-xl text-xs font-bold transition-all">
                    Call Hotline
                  </button>
                </div>
              </div>
              {/* Background Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1A4E11] blur-[50px] opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-8">
          {/* Coupon Card */}
          <div className="bg-[#1A4E11] p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <Tag size={24} className="text-yellow-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[3px] text-green-200">
                Exclusive Offer
              </p>
              <h3 className="text-4xl font-extrabold mt-2 leading-tight tracking-tighter uppercase">
                30% OFF
              </h3>
              <p className="text-green-100 mt-2 text-sm font-medium">
                On order over ৳1,000
              </p>

              <div className="mt-8 flex items-center gap-3 bg-white/10 border border-white/10 p-2 rounded-xl backdrop-blur-sm">
                <span className="flex-1 text-center font-black text-xl tracking-[4px] text-yellow-300">
                  NEST30
                </span>
                <button
                  onClick={() => handleCopy("NEST30")}
                  className="bg-white text-[#1A4E11] px-4 py-2.5 rounded-lg font-bold text-[10px] uppercase hover:bg-yellow-100 transition-colors flex items-center gap-2 active:scale-95"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Items */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">
                Special for You
              </h3>
            </div>
            <div className="space-y-5">
              {recommendedItems.map((item: any) => (
                <Link
                  key={item._id?.$oid || item._id}
                  href="/menu"
                  className="flex items-center gap-4 group cursor-pointer pb-5 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-xl relative overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={item.image?.url || ""}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate group-hover:text-[#1A4E11] transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="font-black text-xs text-[#1A4E11]">
                        ৳{item.price}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500">
                        <Star size={12} className="fill-yellow-500" />{" "}
                        {item.averageRating || "4.5"}
                      </div>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-[#1A4E11] group-hover:translate-x-1 transition-all"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
