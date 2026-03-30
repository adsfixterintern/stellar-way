"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
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
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

const AdminBookingDashboard = () => {
  const BASE_URL = "http://localhost:8000/api/v1";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  // ১. ডাটা ফেচ করার ফাংশন
  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/bookings?page=${page}&limit=10`,
      );

      if (data.success) {
        setBookings(data.data);
        setMeta(data.meta);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this booking!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
      borderRadius: "15px",
      customClass: {
        title: "font-sans font-black uppercase text-sm tracking-widest",
        htmlContainer: "text-xs font-bold text-gray-500",
        confirmButton:
          "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
        cancelButton:
          "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
      },
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(`${BASE_URL}/bookings/${id}`);
        if (data.success) {
          toast.success("Booking deleted successfully");

          const nextPage =
            bookings.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page;
          fetchBookings(nextPage);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete booking");
      }
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">
              Table Reservations
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[3px]">
              Total Records: {meta.total}
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[#1A4E11]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest">
                    Customer info
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">
                    Date & Time
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-center">
                    Guest Details
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-32 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A4E11]"></div>
                      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Syncing with server...
                      </p>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic"
                    >
                      No active bookings found
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50/40 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="font-black text-gray-800 text-sm uppercase tracking-tighter">
                            {booking.name}
                          </p>
                          <div className="flex flex-col gap-0.5 opacity-60 font-bold text-[11px]">
                            <span className="flex items-center gap-1">
                              <IoMailOutline /> {booking.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <IoCallOutline /> {booking.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-center">
                        <div className="inline-flex flex-col items-center bg-[#1A4E11]/5 px-5 py-2.5 rounded-2xl border border-[#1A4E11]/10">
                          <span className="text-[13px] font-black text-[#1A4E11] flex items-center gap-1.5">
                            <IoCalendarOutline size={14} /> {booking.date}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 flex items-center gap-1 uppercase tracking-widest mt-1">
                            <IoTimeOutline size={12} /> {booking.time}
                          </span>
                        </div>
                      </td>

                      <td className="p-6 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-1.5 font-black text-gray-700 text-xs bg-gray-100 px-3 py-1 rounded-full">
                            <IoPeopleOutline className="text-[#1A4E11]" />{" "}
                            {booking.guest} Guests
                          </div>
                          {booking.address && (
                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 max-w-[150px] truncate">
                              <IoLocationOutline /> {booking.address}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-3 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-md"
                          title="Delete Booking"
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

          {/* Pagination */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
              Page {meta.page} of {meta.totalPage}
            </p>
            <div className="flex gap-3">
              <button
                disabled={meta.page === 1}
                onClick={() => fetchBookings(meta.page - 1)}
                className="flex items-center gap-1 px-4 py-2 text-[10px] font-black uppercase bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:border-[#1A4E11] hover:text-[#1A4E11] transition-all shadow-sm"
              >
                <IoChevronBackOutline /> Prev
              </button>
              <button
                disabled={meta.page >= meta.totalPage}
                onClick={() => fetchBookings(meta.page + 1)}
                className="flex items-center gap-1 px-4 py-2 text-[10px] font-black uppercase bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:border-[#1A4E11] hover:text-[#1A4E11] transition-all shadow-sm"
              >
                Next <IoChevronForwardOutline />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDashboard;
