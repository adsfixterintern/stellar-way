/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useMyOrders } from "@/app/hooks/useMyOrders";
import { useMenu } from "@/app/hooks/useMenu";
import { useMyBookings } from "@/app/hooks/useMyBookings";
import { useEvents } from "@/app/hooks/useEvent";

import {
  ShoppingBag,
  Star,
  Clock,
  Tag,
  ArrowRight,
  Calendar,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import CustomerDashboardSkeleton from "@/components/skeletons/CustomerDashboardSkeleton";

export default function CustomerDashboardOverview() {
  const { data: session } = useSession();
  const customerEmail = session?.user?.email as string;
  const userId = (session?.user as any)?.id;
  const [copied, setCopied] = useState(false);

  // --- Data Fetching ---
  const { data: ordersData, isLoading: ordersLoading } =
    useMyOrders(customerEmail);
  const { data: menusData, isLoading: menuLoading } = useMenu();
  const { data: bookingsData, isLoading: bookingsLoading } =
    useMyBookings(userId);
  const { data: eventsData, isLoading: eventsLoading } = useEvents();

  // --- Safe Data Extraction ---
  const orders = Array.isArray(ordersData?.data)
    ? ordersData.data
    : Array.isArray(ordersData)
      ? ordersData
      : [];

  const menusList = Array.isArray(menusData?.data)
    ? menusData.data
    : Array.isArray(menusData)
      ? menusData
      : [];

  const myBookingsList = Array.isArray(bookingsData?.data)
    ? bookingsData.data
    : Array.isArray(bookingsData)
      ? bookingsData
      : [];

  const globalEventsList = Array.isArray(eventsData?.data)
    ? eventsData.data
    : Array.isArray(eventsData)
      ? eventsData
      : [];

  // --- Orders Logic ---
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
  const recentOrder = orders.length > 0 ? orders[0] : null;

  const firstItemId =
    recentOrder?.items?.[0]?.menuId?.$oid || recentOrder?.items?.[0]?.menuId;
  const recentMenuDetails = menusList.find(
    (menu: any) => (menu._id?.$oid || menu._id) === firstItemId,
  );

  const recommendedItems = menusList.slice(0, 2);

  // --- Events Logic ---
  const myNextEvent = [...myBookingsList].sort(
    (a: any, b: any) =>
      new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime(),
  )[0];

  const upcomingGlobalEvents = globalEventsList.slice(0, 2);

  // --- Savings & Goals ---
  const totalSavings = deliveredOrders.reduce(
    (sum: number, order: any) =>
      sum + (order.discount || order.totalPrice * 0.1),
    0,
  );
  const monthlyGoal = 5000;
  const spendingPercentage = Math.min((totalSpent / monthlyGoal) * 100, 100);


  // ─── Skeleton Loading ───
  if (ordersLoading || menuLoading || bookingsLoading || eventsLoading) {
    return <CustomerDashboardSkeleton />;
  }

  // ─── Main UI ───
  return (
    <div className="bg-[#FDFCFD] min-h-screen p-2  md:p-8 font-sans antialiased">
      {/* Header */}
      <div className="md:flex justify-between items-center mb-10">
        <div className="text-center md:text-start mb-4 md:mb-0">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Guest"}!
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Ready for your next delicious meal?
          </p>
        </div>
        <Link
          href="/menu"
          className="bg-[#1A4E11] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 hover:opacity-90 transition-all"
        >
          Order Now <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
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
                className="text-[#1A4E11] text-xs font-bold flex items-center gap-1 hover:underline"
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
                      {recentMenuDetails?.title || "Delicious Feast"}{" "}
                      {recentOrder.items?.length > 1 &&
                        `+${recentOrder.items.length - 1} more`}
                    </h4>
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
                <div className="border-l-2 border-[#1A4E11] pl-4">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                    OTP for delivery
                  </p>
                  <p className="text-lg font-black text-[#1A4E11] tracking-[3px]">
                    {recentOrder.deliveryOTP || "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center py-10 text-gray-400 italic">
                No orders found.
              </p>
            )}
          </div>

          {/* Event Horizon & Spending Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Calendar size={18} className="text-[#1A4E11]" /> Event
                  Horizon
                </h3>
                <Link
                  href="/dashboard/my-events"
                  className="text-[10px] font-black text-[#1A4E11] uppercase hover:underline"
                >
                  My Bookings
                </Link>
              </div>
              {myNextEvent ? (
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:border-green-100 transition-colors">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-15">
                      <p className="text-[10px] font-black text-[#1A4E11] uppercase">
                        {new Date(myNextEvent.selectedDate).toLocaleDateString(
                          "en-US",
                          { month: "short" },
                        )}
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        {new Date(myNextEvent.selectedDate).getDate()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 text-sm line-clamp-1">
                        {myNextEvent.eventId?.title || "Reserved Event"}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                        {myNextEvent.selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    No upcoming reservations
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                <Tag size={18} className="text-[#1A4E11]" /> Spending Analysis
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mb-2">
                    <span>Monthly Target</span>
                    <span className="text-[#1A4E11]">
                      {Math.round(spendingPercentage)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1A4E11] rounded-full transition-all duration-1000"
                      style={{ width: `${spendingPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-bold text-gray-400 uppercase">
                    Total Savings
                  </p>
                  <p className="text-lg font-black text-green-600">
                    ৳{Math.round(totalSavings)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Special for You */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight mb-6">
              Special for You
            </h3>
            <div className="space-y-5">
              {recommendedItems.length > 0 ? (
                recommendedItems.map((item: any) => {
                  let displayRating = "0.0";
                  if (
                    item?.reviews &&
                    Array.isArray(item.reviews) &&
                    item.reviews.length > 0
                  ) {
                    const totalRating = item.reviews.reduce(
                      (acc: number, rev: any) =>
                        acc + (Number(rev.rating) || 0),
                      0,
                    );
                    displayRating = (
                      totalRating / item.reviews.length
                    ).toFixed(1);
                  }
                  return (
                    <Link
                      key={item._id?.$oid || item._id}
                      href={`/menu/${item._id?.$oid || item._id}`}
                      className="flex items-center gap-4 group pb-5 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-16 h-16 bg-gray-50 rounded-xl relative overflow-hidden shrink-0 border border-gray-200">
                        <Image
                          src={item.image?.url || "/placeholder-food.jpg"}
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
                            <Star size={12} className="fill-yellow-500" />
                            <span>{displayRating}</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-gray-300 group-hover:text-[#1A4E11] group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  );
                })
              ) : (
                <p className="text-center text-[10px] font-black text-gray-400 uppercase py-4">
                  No recommendations found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 space-y-8">
          {/* Stellar Spotlights */}
          <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500" /> Stellar
              Spotlights
            </h3>
            <div className="space-y-4">
              {upcomingGlobalEvents.map((event: any) => (
                <Link
                  key={event._id}
                  href="/event"
                  className="block relative group rounded-2xl overflow-hidden aspect-video border border-gray-100"
                >
                  <Image
                    src={event.image?.url || event.image || ""}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <p className="text-[8px] font-black text-yellow-400 uppercase tracking-widest mb-1">
                      Upcoming Rally
                    </p>
                    <h4 className="text-white font-black text-xs leading-tight line-clamp-1">
                      {event.title}
                    </h4>
                  </div>
                </Link>
              ))}
              <Link
                href="/dashboard/my-events"
                className="w-full py-3 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
              >
                Discover All Events <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
