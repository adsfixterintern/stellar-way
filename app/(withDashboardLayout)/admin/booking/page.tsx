/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoMailOutline,
  IoCallOutline,
  IoTrashOutline,
  IoLocationOutline,
} from "react-icons/io5";
import api from "@/utils/apiInstance"; 
import PaginationDashboard from "@/components/shared/PaginationDashboard";


//  Booking type
interface IBooking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guest: number;
  address?: string;
}

interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

const AdminBookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<IMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  // 📌 Fetch bookings
  const fetchBookings = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/bookings?page=${pageNumber}&limit=${meta.limit}`);
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
    fetchBookings(meta.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 📌 Delete booking
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#fff",
      customClass: {
        title: "font-black uppercase text-sm tracking-widest",
        htmlContainer: "text-xs font-bold text-gray-500",
        confirmButton: "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
        cancelButton: "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
      },
    });

    if (result.isConfirmed) {
      try {
        const { data } = await api.delete(`/bookings/${id}`);
        if (data.success) {
          toast.success("Booking deleted successfully");
          const nextPage = bookings.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page;
          fetchBookings(nextPage);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to delete booking");
      }
    }
  };

  return (
    <div className="">
      <div className="w-full p-2 md:p-4">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
              Table Reservations
            </h1>
            <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
              Total Bookings: {meta.total}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-200">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Customer
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                    Date & Time
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                    Guests
                  </th>
                  <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/30 transition-colors group">
                      {/* CUSTOMER */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-800 text-sm">{booking.name}</span>
                          <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                            <IoMailOutline /> {booking.email}
                          </span>
                          <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                            <IoCallOutline /> {booking.phone}
                          </span>
                        </div>
                      </td>

                      {/* DATE & TIME */}
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center bg-[#1A4E11]/5 px-3 py-2 rounded-xl border border-[#1A4E11]/10">
                          <span className="text-[12px] font-black text-[#1A4E11] flex items-center gap-1">
                            <IoCalendarOutline size={14} /> {booking.date}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 mt-1 uppercase tracking-widest">
                            <IoTimeOutline size={12} /> {booking.time}
                          </span>
                        </div>
                      </td>

                      {/* GUESTS */}
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-black text-gray-700 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                            <IoPeopleOutline className="text-[#1A4E11]" /> {booking.guest} Guests
                          </span>
                          {booking.address && (
                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 truncate max-w-[150px]">
                              <IoLocationOutline /> {booking.address}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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

          {/* PAGINATION SECTION */}
          <div className="p-5 border-t border-gray-100 bg-gray-50/30">
            <PaginationDashboard
              totalItems={meta.total}
              itemsPerPage={meta.limit}
              currentPage={meta.page}
              onPageChange={(page) => fetchBookings(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDashboard;