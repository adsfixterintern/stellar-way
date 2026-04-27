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
} from "react-icons/io5";

import {
  getMyBookingsApi,
  deleteBookingApi,
} from "@/app/modules/booking/booking.api";
import Swal from "sweetalert2";

// --- Skeleton Component ---
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="border-b border-gray-50">
        <td className="p-5 space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-32 bg-gray-100 rounded"></div>
        </td>
        <td className="p-5">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </td>
        <td className="p-5">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="p-5">
          <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
        </td>
        <td className="p-5">
          <div className="flex justify-center gap-2">
            <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-100 rounded-lg"></div>
          </div>
        </td>
      </tr>
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
      if (res?.success) {
        setBookings(res.data);
      }
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
    if (typeof window !== "undefined") {
      window.print();
    }
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
    <div className="max-w-6xl mx-auto p-2 md:p-8 bg-white min-h-screen">
      <div className="mb-8 print:hidden">
        <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">
          Booking History
        </h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Manage your table reservations
        </p>
      </div>

      <div className="overflow-x-auto rounded-[24px] border border-gray-100 shadow-sm print:hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date & Time</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Guest</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Price</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment</th>
              <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <TableSkeleton />
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <p className="text-sm font-bold text-gray-800">{booking.date}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                      <IoTimeOutline /> {booking.startTime} - {booking.endTime}
                    </p>
                  </td>
                  <td className="p-5 text-sm font-bold text-gray-700">{booking.guest} Persons</td>
                  <td className="p-5 text-sm font-black text-[#1A4E11]">৳ {booking.totalPrice}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                        booking.paymentStatus === "paid" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      }`}>
                      {booking.paymentStatus === "paid" && <IoCheckmarkCircle />} {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { setSelectedBooking(booking); setIsModalOpen(true); }}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#1A4E11] hover:text-white transition-all">
                        <IoEyeOutline size={18} />
                      </button>
                      <button onClick={() => handleDelete(booking._id)}
                        className="p-2 bg-gray-100 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400 text-xs font-bold uppercase">No Bookings Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Ticket Modal --- */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm print:static print:bg-white print:p-0">
          <div className="bg-white w-full max-w-md rounded-[35px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-200 print:shadow-none print:max-w-full print:rounded-none">
            {/* Modal Header */}
            <div className="bg-[#1A4E11] p-6 text-center text-white print:bg-white print:text-black print:border-b">
              <p className="text-[9px] font-black uppercase tracking-[3px] opacity-60 print:opacity-100">Reservation Ticket</p>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-white/50 hover:text-white print:hidden">
                <IoCloseOutline size={28} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* QR Section */}
              <div className="flex justify-center">
                {selectedBooking.qrCode ? (
                  <div className="bg-gray-50 p-3 rounded-2xl border border-dashed border-gray-200 print:border-solid">
                    <img src={selectedBooking.qrCode} alt="QR" className="w-[150px] h-[150px] rounded-lg" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase">No QR Generated</div>
                )}
              </div>

              {/* Booking Stats Grid */}
              <div className="grid grid-cols-2 gap-y-4 border-t border-gray-50 pt-6">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black">Date</p>
                  <p className="text-sm font-bold text-gray-800">{selectedBooking.date}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black">Time Slot</p>
                  <p className="text-sm font-bold text-gray-800">{selectedBooking.startTime}-{selectedBooking.endTime}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black">Guests</p>
                  <p className="text-sm font-bold text-gray-800">{selectedBooking.guest} Persons</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-black">Total Price</p>
                  <p className="text-sm font-black text-[#1A4E11]">৳ {selectedBooking.totalPrice}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] text-gray-400 uppercase font-black">Location/Address</p>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl flex items-center gap-2 font-medium">
                  <IoLocationOutline className="text-[#1A4E11]" /> {selectedBooking.address || "Main Restaurant"}
                </p>
              </div>

              <div className="bg-[#F9FBFA] p-4 rounded-xl border border-gray-100">
                <p className="text-[8px] text-gray-400 uppercase font-black mb-1">Transaction Info</p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                  <IoWalletOutline /> {selectedBooking.transactionId}
                </div>
              </div>

              <button onClick={handleDownloadTicket} className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A4E11] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-green-900/10 print:hidden">
                <IoDownloadOutline size={18} /> Download Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Printing */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0, .fixed.inset-0 * { visibility: visible; }
          .fixed.inset-0 { position: absolute; left: 0; top: 0; width: 100%; background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:text-black { color: black !important; }
          .print\\:border-b { border-bottom: 1px solid #eee !important; }
        }
      `}</style>
    </div>
  );
};

export default MyBookingsTable;