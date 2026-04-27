/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  IoSearchOutline,
  IoFilterOutline,
  IoEyeOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
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
import EventDetailsModal from "@/components/user-dashboard/EventDetailsModal";

const AdminBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllBookingsData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("transactionId", searchTerm);
      if (statusFilter !== "all") params.append("paymentStatus", statusFilter);
      // Fixed: Filtering works now by matching exact paymentMethod values
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
    Swal.fire({
      title: "Are you sure?",
      text: "Booking will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#f1f1f1",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-6 py-3",
        cancelButton: "rounded-xl px-6 py-3 text-gray-500",
      },
    }).then(async (result) => {
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
    });
  };

  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto  min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-[#1A4E11] uppercase italic tracking-tighter">
            Event Bookings
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-1">
            Manage Reservations & Payments
          </p>
        </div>
        <button
          onClick={fetchAllBookingsData}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <IoRefreshOutline
            size={20}
            className={isLoading ? "animate-spin" : ""}
          />{" "}
          REFRESH DATA
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 relative group">
          <IoSearchOutline
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A4E11] transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search Transaction ID..."
            className="w-full pl-14 pr-4 py-4 bg-white rounded-2xl outline-none shadow-sm focus:shadow-md font-bold text-sm transition-all placeholder:text-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            className="w-full px-5 py-4 bg-white rounded-2xl outline-none shadow-sm font-black text-[11px] uppercase appearance-none cursor-pointer focus:shadow-md"
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
            className="w-full px-5 py-4 bg-white rounded-2xl outline-none shadow-sm font-black text-[11px] uppercase appearance-none cursor-pointer focus:shadow-md"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="SSLCommerz">SSLCommerz</option>
            <option value="Stripe">Stripe</option>
          </select>
          <IoFilterOutline className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* DATA CONTENT */}
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="p-6">Transaction</th>
                <th className="p-6">Customer</th>
                <th className="p-6">Event</th>
                <th className="p-6 text-center">Seats</th>
                <th className="p-6 text-center">Amount</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Actions</th>
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
                          {booking.transactionId}
                        </span>
                        <span className="text-[9px] text-gray-400 font-black uppercase mt-1 flex items-center gap-1">
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
                        <span className="text-[10px] text-gray-400 font-medium lowercase">
                          {booking.userId?.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-xs font-bold text-gray-600 line-clamp-1 max-w-[150px]">
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
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-50 text-green-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => openDetails(booking)}
                          className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-400 hover:text-[#1A4E11] rounded-xl"
                        >
                          <IoEyeOutline size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-400 hover:text-red-500 rounded-xl"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState />
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE & TABLET CARDS WITH SCROLLING */}
        <div className="lg:hidden">
          <div className="max-h-[600px] overflow-y-auto custom-scrollbar divide-y divide-gray-50">
            {isLoading ? (
              <TableSkeleton />
            ) : bookings.length > 0 ? (
              bookings.map((booking: any) => (
                <div
                  key={booking._id}
                  className="p-5 flex flex-col gap-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                        #{booking.transactionId}
                      </p>
                      <h3 className="font-black text-gray-800 text-sm uppercase">
                        {booking.userId?.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 lowercase">
                        {booking.userId?.email}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase">
                        Total Amount
                      </p>
                      <p className="text-sm font-black text-gray-900">
                        ৳{booking.totalAmount}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-gray-400 uppercase">
                        Seats
                      </p>
                      <p className="text-sm font-black text-gray-900">
                        {booking.numberOfSeats}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openDetails(booking)}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl active:scale-95 transition-all"
                    >
                      <IoTrashOutline size={20} />
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

      <EventDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        user={{
          name: selectedBooking?.userId?.name,
          email: selectedBooking?.userId?.email,
        }}
      />
    </div>
  );
};

// Sub-component for Empty State
const EmptyState = () => (
  <tr>
    <td colSpan={7} className="p-24 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
          <IoSearchOutline size={30} />
        </div>
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[5px]">
          No Bookings Record
        </p>
      </div>
    </td>
  </tr>
);

export default AdminBookingPage;
