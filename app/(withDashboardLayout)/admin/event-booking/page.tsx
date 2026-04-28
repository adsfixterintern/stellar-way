/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  IoSearchOutline,
  IoFilterOutline,
  IoCardOutline,
  IoWalletOutline,
  IoRefreshOutline,
  IoTrashOutline,
} from "react-icons/io5";
import {
  getAllBookings,
  deleteBooking,
} from "@/app/modules/eventBooking/eventBooking.api";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const fetchAllBookingsData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("transactionId", searchTerm);
      if (statusFilter !== "all") params.append("paymentStatus", statusFilter);
      if (methodFilter !== "all") params.append("paymentMethod", methodFilter);

      const res = await getAllBookings(params.toString());
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAllBookingsData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter, methodFilter]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Booking will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#f8f8f8",
      confirmButtonText: "Yes, delete!",
      customClass: {
        popup: "rounded-3xl border-none shadow-xl",
        confirmButton: "rounded-xl px-6 py-3 font-bold",
        cancelButton: "rounded-xl px-6 py-3 text-gray-500 font-bold",
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteBooking(id);
        if (res.success) {
          toast.success("Booking deleted");
          fetchAllBookingsData();
        }
      } catch (err: any) {
        toast.error("Failed to delete booking");
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto  py-6 md:py-10 min-h-screen ">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 md:mb-12">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-[#1A4E11] uppercase italic tracking-tighter leading-none">
            Event Bookings
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mt-2">
            Finance & Reservation Panel
          </p>
        </div>
        <button
          onClick={fetchAllBookingsData}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95 border border-gray-50"
        >
          <IoRefreshOutline
            size={20}
            className={isLoading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="sm:col-span-2 relative">
          <IoSearchOutline
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search Transaction ID..."
            className="w-full pl-14 pr-4 py-4 bg-white rounded-2xl outline-none shadow-sm focus:ring-2 ring-[#1A4E11]/5 font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative group">
          <select
            className="w-full px-5 py-4 bg-white rounded-2xl outline-none shadow-sm font-black text-[11px] uppercase appearance-none cursor-pointer border border-transparent focus:border-gray-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <IoFilterOutline className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className="w-full px-5 py-4 bg-white rounded-2xl outline-none shadow-sm font-black text-[11px] uppercase appearance-none cursor-pointer border border-transparent focus:border-gray-100"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">Methods</option>
            <option value="SSLCommerz">SSLCommerz</option>
            <option value="Stripe">Stripe</option>
          </select>
          <IoFilterOutline className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* DATA CONTENT */}
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden border border-gray-50">
        {/* DESKTOP TABLE */}
        <div className="hidden lg:block">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="p-6">Transaction</th>
                <th className="p-6">Customer</th>
                <th className="p-6">Event</th>
                <th className="p-6 text-center">Seats</th>
                <th className="p-6 text-center">Amount</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <TableSkeleton />
              ) : bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50/30 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-800 tracking-tighter">
                          #{booking.transactionId}
                        </span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 flex items-center gap-1">
                          {booking.paymentMethod === "Stripe" ? (
                            <IoCardOutline className="text-blue-500" />
                          ) : (
                            <IoWalletOutline className="text-purple-500" />
                          )}
                          {booking.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">
                          {booking.userId?.name}
                        </span>
                        <span className="text-[10px] text-gray-400 lowercase">
                          {booking.userId?.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-gray-600 line-clamp-1">
                        {booking.eventName || booking.eventId?.title}
                      </span>
                    </td>
                    <td className="p-6 text-center font-black text-gray-800 text-xs">
                      {booking.numberOfSeats}
                    </td>
                    <td className="p-6 text-center font-black text-gray-900 text-sm">
                      ৳{booking.totalAmount}
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${booking.paymentStatus === "paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="w-9 h-9 inline-flex items-center justify-center bg-white border border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100 rounded-xl transition-all shadow-sm"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState />
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE & TABLET CARDS */}
        <div className="lg:hidden">
          <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-50 bg-white">
            {isLoading ? (
              <TableSkeleton />
            ) : bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <div key={booking._id} className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">
                        #{booking.transactionId}
                      </p>
                      <h3 className="font-black text-gray-800 text-sm uppercase leading-tight">
                        {booking.userId?.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 lowercase truncate max-w-[180px]">
                        {booking.userId?.email}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${booking.paymentStatus === "paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50/50 border border-gray-50 p-4 rounded-2xl">
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        Amount
                      </p>
                      <p className="text-sm font-black text-gray-900">
                        ৳{booking.totalAmount}
                      </p>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200"></div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        Seats
                      </p>
                      <p className="text-sm font-black text-gray-900">
                        {booking.numberOfSeats}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase transition-all active:scale-95"
                    >
                      <IoTrashOutline size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center text-gray-300 font-black uppercase text-[10px] tracking-widest">
                No Bookings Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <tr>
    <td colSpan={7} className="p-32 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-100">
          <IoSearchOutline size={40} />
        </div>
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[8px]">
          No Records Found
        </p>
      </div>
    </td>
  </tr>
);

export default AdminBookingPage;
