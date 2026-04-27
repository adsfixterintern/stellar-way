/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  IoEyeOutline,
  IoTrashOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoCloseOutline,
  IoLocationOutline,
  IoWalletOutline,
  IoDownloadOutline,
  IoPeopleOutline,
} from "react-icons/io5";

import {
  getMyBookingsApi,
  deleteBookingApi,
} from "@/app/modules/booking/booking.api";
import Swal from "sweetalert2";
import {motion} from 'framer-motion'

// --- Skeleton Component ---
const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="hidden md:grid grid-cols-5 gap-4 p-5 border-b border-gray-50"
      >
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-100 rounded-full w-16"></div>
        <div className="h-8 bg-gray-100 rounded-lg w-20 justify-self-center"></div>
      </div>
    ))}
    {/* Mobile Skeleton Card */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="md:hidden p-4 bg-white border border-gray-100 rounded-2xl space-y-3"
      >
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-100 rounded-full"></div>
        </div>
        <div className="h-3 w-32 bg-gray-100 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

const MyBookingsTable = () => {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchMyBookings = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await getMyBookingsApi(userId);
      if (res?.success) setBookings(res.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const handleDownloadTicket = () => {
    if (typeof window !== "undefined") window.print();
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Cancel Booking?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, Cancel",
      customClass: { popup: "rounded-[20px]" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteBookingApi(id);
          if (res?.success) {
            setBookings((prev) => prev.filter((b) => b._id !== id));
            toast.success("Booking deleted");
          }
        } catch (error) {
          toast.error("Error deleting booking");
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#FBFCFD] min-h-screen font-sans">
      <div className="mb-8 print:hidden flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
            Booking <span className="text-[#1A4E11]">History</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
            Manage your table reservations
          </p>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : bookings.length > 0 ? (
        <>
          {/* Desktop View Table */}
          <div className="hidden md:block overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm print:hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Date & Time
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Guest
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Total Price
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Payment
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-5">
                      <p className="text-sm font-bold text-gray-800">
                        {booking.date}
                      </p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                        <IoTimeOutline /> {booking.startTime} -{" "}
                        {booking.endTime}
                      </p>
                    </td>
                    <td className="p-5 text-sm font-bold text-gray-700">
                      {booking.guest} Persons
                    </td>
                    <td className="p-5 text-sm font-black text-[#1A4E11]">
                      ৳ {booking.totalPrice}
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {booking.paymentStatus === "paid" && (
                          <IoCheckmarkCircle />
                        )}{" "}
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsModalOpen(true);
                          }}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#1A4E11] hover:text-white transition-all"
                        >
                          <IoEyeOutline size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="p-2 bg-gray-100 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden print:hidden">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-black text-gray-900">
                      {booking.date}
                    </p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <IoTimeOutline /> {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                      booking.paymentStatus === "paid"
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-y border-dashed border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <IoPeopleOutline className="text-[#1A4E11]" size={14} />
                    </div>
                    <span className="text-xs font-bold text-gray-600">
                      {booking.guest} Guests
                    </span>
                  </div>
                  <p className="text-sm font-black text-[#1A4E11]">
                    ৳ {booking.totalPrice}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl text-[10px] font-black uppercase hover:bg-gray-100 transition-all"
                  >
                    <IoEyeOutline size={16} /> Details
                  </button>
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
                  >
                    <IoTrashOutline size={16} /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            No Bookings Found
          </p>
        </div>
      )}

      {/* --- Ticket Modal --- */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:static print:bg-white print:p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative print:shadow-none print:max-w-full print:rounded-none"
          >
            <div className="bg-[#1A4E11] p-6 text-center text-white print:bg-white print:text-black print:border-b">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 print:opacity-100">
                Booking Ticket
              </p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-6 text-white/50 hover:text-white transition-all print:hidden"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-center">
                {selectedBooking.qrCode ? (
                  <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-gray-100 print:border-solid">
                    <img
                      src={selectedBooking.qrCode}
                      alt="QR"
                      className="w-[140px] h-[140px] md:w-[160px] md:h-[160px]"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center text-[9px] text-gray-300 font-bold uppercase">
                    No QR
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-y-6 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                    Date
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedBooking.date}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                    Time
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedBooking.startTime}-{selectedBooking.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                    Guests
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {selectedBooking.guest} Persons
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">
                    Price
                  </p>
                  <p className="text-sm font-black text-[#1A4E11]">
                    ৳ {selectedBooking.totalPrice}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                <div>
                  <p className="text-[8px] text-gray-400 uppercase font-black mb-1">
                    Venue Address
                  </p>
                  <p className="text-[11px] text-gray-600 flex items-center gap-2 font-bold leading-tight">
                    <IoLocationOutline
                      className="text-[#1A4E11] flex-shrink-0"
                      size={16}
                    />{" "}
                    {selectedBooking.address || "Premium Restaurant Branch"}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <IoWalletOutline /> {selectedBooking.transactionId || "N/A"}
                  </div>
                  <span className="text-[8px] font-black uppercase text-green-600">
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDownloadTicket}
                className="w-full flex items-center justify-center gap-2 py-4.5 bg-[#1A4E11] text-white rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#1A4E11]/20 hover:bg-black transition-all print:hidden"
              >
                <IoDownloadOutline size={18} /> Print Ticket
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed.inset-0,
          .fixed.inset-0 * {
            visibility: visible;
          }
          .fixed.inset-0 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookingsTable;
