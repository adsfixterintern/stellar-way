/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoCallOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoRestaurantOutline,
  IoFilterOutline,
  IoWalletOutline,
} from "react-icons/io5";
import api from "@/utils/apiInstance";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

const AdminBookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering States
  const [filterDate, setFilterDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const fetchBookings = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(
        `/bookings?page=${pageNumber}&limit=${meta.limit}`,
      );
      if (data.success) {
        setBookings(data.data);
        setMeta(data.meta);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchDate = filterDate ? booking.date === filterDate : true;

   
      const matchStart = startTime ? booking.startTime >= startTime : true;
      const matchEnd = endTime ? booking.endTime <= endTime : true;

      return matchDate && matchStart && matchEnd;
    });
  }, [bookings, filterDate, startTime, endTime]);

  const clearFilters = () => {
    setFilterDate("");
    setStartTime("");
    setEndTime("");
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Reservation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, Delete",
      customClass: { popup: "rounded-2xl" },
    });

    if (result.isConfirmed) {
      try {
        const { data } = await api.delete(`/bookings/${id}`);
        if (data.success) {
          toast.success("Booking deleted successfully");
          fetchBookings(meta.page);
        }
      } catch (err) {
        toast.error("Failed to delete");
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto  min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-[#1A4E11] uppercase italic tracking-tighter">
            Table Reservations
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-1">
            Found {filteredBookings.length} matching results
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchBookings(1)}
            className="p-3 bg-white text-gray-700 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <IoRefreshOutline
              size={20}
              className={loading ? "animate-spin" : ""}
            />
          </button>
          {(filterDate || startTime || endTime) && (
            <button
              onClick={clearFilters}
              className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm border border-red-100"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-3 rounded-2xl border border-gray-50 flex items-center gap-4 px-5 shadow-sm">
          <IoCalendarOutline className="text-[#1A4E11]" size={22} />
          <div className="flex flex-col w-full">
            <span className="text-[8px] font-black text-gray-400 uppercase">
              Reservation Date
            </span>
            <input
              type="date"
              className="bg-transparent font-bold text-sm outline-none w-full"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-50 flex items-center gap-4 px-5 shadow-sm">
          <IoTimeOutline className="text-blue-500" size={22} />
          <div className="flex flex-col w-full">
            <span className="text-[8px] font-black text-gray-400 uppercase">
              Range Start (From)
            </span>
            <input
              type="time"
              className="bg-transparent font-bold text-sm outline-none w-full"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-50 flex items-center gap-4 px-5 shadow-sm">
          <IoTimeOutline className="text-amber-500" size={22} />
          <div className="flex flex-col w-full">
            <span className="text-[8px] font-black text-gray-400 uppercase">
              Range End (To)
            </span>
            <input
              type="time"
              className="bg-transparent font-bold text-sm outline-none w-full"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-50">
        {/* DESKTOP VIEW */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="p-6">Customer Details</th>
                <th className="p-6">Schedule</th>
                <th className="p-6 text-center">Assigned Tables</th>
                <th className="p-6 text-center">Payment Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton />
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <IoFilterOutline size={40} className="text-gray-100" />
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[5px]">
                        No results found
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50/30 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-800 text-sm uppercase">
                          {booking.name}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <IoCallOutline /> {booking.phone}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-[#1A4E11]">
                          {booking.date}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex flex-wrap justify-center gap-1 max-w-[150px] mx-auto">
                        {booking.tableIds?.map((t: any) => (
                          <span
                            key={t._id}
                            className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-[9px] font-black border border-gray-200 uppercase"
                          >
                            {t.tableNumber}
                          </span>
                        ))}
                        <div className="w-full text-[9px] font-bold text-gray-300 mt-1 uppercase flex items-center justify-center gap-1">
                          <IoPeopleOutline /> {booking.guest} Guests
                        </div>
                      </div>
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
                        className="w-10 h-10 inline-flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-300 hover:text-red-500 rounded-xl transition-all"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="lg:hidden">
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-50 scrollbar-hide">
            {loading ? (
              <TableSkeleton />
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="p-5 flex flex-col gap-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black text-gray-800 uppercase italic">
                        {booking.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <IoRestaurantOutline
                          className="text-[#1A4E11]"
                          size={12}
                        />
                        <span className="text-[10px] font-black text-[#1A4E11] bg-[#1A4E11]/5 px-2 py-0.5 rounded uppercase">
                          {booking.tableIds
                            ?.map((t: any) => t.tableNumber)
                            .join(", ") || "N/A"}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${booking.paymentStatus === "paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl grid grid-cols-2 gap-4 border border-gray-100/50">
                    <div>
                      <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">
                        Date & Time
                      </p>
                      <p className="text-[10px] font-black text-gray-800">
                        {booking.date}
                      </p>
                      <p className="text-[9px] font-bold text-gray-500">
                        {booking.startTime}-{booking.endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-gray-400 uppercase mb-1">
                        Total Guests
                      </p>
                      <p className="text-sm font-black text-gray-900">
                        {booking.guest}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${booking.phone}`}
                      className="flex-1 bg-white border border-gray-100 text-gray-600 text-center py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-sm"
                    >
                      Call Now
                    </a>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl transition-active active:scale-95"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="p-6 bg-gray-50/30 border-t border-gray-50">
          <PaginationDashboard
            totalItems={meta.total}
            itemsPerPage={meta.limit}
            currentPage={meta.page}
            onPageChange={(page) => fetchBookings(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDashboard;
