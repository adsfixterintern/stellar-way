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
import { getAllBookings, deleteBooking } from "@/app/modules/eventBooking/eventBooking.api";
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

  // SweetAlert Delete Functionality
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      customClass: {
        title: "text-lg font-black",
        confirmButton: "rounded-xl px-6 py-3",
        cancelButton: "rounded-xl px-6 py-3",
        popup: "rounded-3xl"
      },
      didOpen: (modal) => {
        modal.style.borderRadius = "1.5rem";
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteBooking(id);
          if (res.success) {
            Swal.fire({
              title: "Deleted!",
              text: "Booking has been deleted.",
              icon: "success",
              confirmButtonColor: "#1A4E11",
            });
            fetchAllBookingsData();
          }
        } catch (err: any) {
          toast.error(err?.message || "Failed to delete booking");
        }
      }
    });
  };

  const openDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };


  console.log(bookings)
  return (
    <div className="p-3 md:p-8  min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Event Bookings
          </h1>
          <p className="text-xs text-[#1A4E11] font-bold mt-1 uppercase tracking-widest">
            Manage Reservations & Payments
          </p>
        </div>
        <button
          onClick={fetchAllBookingsData}
          className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <IoRefreshOutline size={18} className={isLoading ? "animate-spin" : ""} /> REFRESH
        </button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative lg:col-span-2">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Transaction ID..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer focus:border-[#1A4E11]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <IoFilterOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer focus:border-[#1A4E11]"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="SSL">SSLCommerz</option>
            <option value="Stripe">Stripe</option>
          </select>
          <IoFilterOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest">Transaction Info</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest">Event Name</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest text-center">Seats</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest text-center">Amount</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                <th className="p-5 text-[11px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <TableSkeleton />
              ) : bookings.length > 0 ? (
                bookings.map((booking: any) => (
                  <tr key={booking._id} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-gray-900 group-hover:text-[#1A4E11] transition-colors">
                          {booking.transactionId}
                        </span>
                        <span className="text-[11px] text-gray-500 font-bold flex items-center gap-1.5 mt-1">
                          {booking.paymentMethod === "Stripe" ? <IoCardOutline className="text-blue-500" /> : <IoWalletOutline className="text-purple-500" />}
                          {booking.paymentMethod}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-gray-800">{booking.userId.name}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{booking.userId.email}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-[13px] font-bold text-gray-700 line-clamp-1 max-w-[200px]">
                        {booking.eventName || booking.eventId?.title}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className="text-[13px] font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        {booking.numberOfSeats}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <span className="text-sm font-black text-gray-900">৳{booking.totalAmount}</span>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm border ${
                        booking.paymentStatus === "paid" 
                        ? "bg-green-50 text-green-700 border-green-100" 
                        : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {booking.paymentStatus === "paid" ? <IoCheckmarkCircle size={14} /> : <IoTimeOutline size={14} />}
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openDetails(booking)}
                          className="p-3 bg-gray-50 text-gray-500 hover:text-[#1A4E11] hover:bg-green-50 rounded-2xl transition-all shadow-sm"
                          title="View Details"
                        >
                          <IoEyeOutline size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-3 bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm"
                          title="Delete"
                        >
                          <IoTrashOutline size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                        <IoSearchOutline size={40} />
                      </div>
                      <span className="text-sm font-black text-gray-400 uppercase tracking-[5px]">No Data Found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default AdminBookingPage;