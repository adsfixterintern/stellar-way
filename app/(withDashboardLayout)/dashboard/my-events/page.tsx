/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { 
  IoCalendarOutline, 
  IoTicketOutline, 
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoEllipsisHorizontalCircleOutline,
  IoDownloadOutline 
} from "react-icons/io5";
import Image from "next/image";
import EventDetailsModal from "@/components/user-dashboard/EventDetailsModal";
import { useMyBookings } from "@/app/hooks/useMyBookings";

const MyEventsPage = () => {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: bookingsData, isLoading } = useMyBookings(userId);

  const bookings = bookingsData?.data?.sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt?.$date || a.createdAt).getTime();
    const dateB = new Date(b.createdAt?.$date || b.createdAt).getTime();
    return dateB - dateA;
  }) || [];

  const handleOpenModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Ticket Download Logic
  const handleDownloadTicket = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full p-4 md:p-6 font-sans">
      <div className="mb-8 print:hidden">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase ">My Booked Events</h1>
        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[3px]">Manage your event reservations</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Event / Transaction</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Schedule</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Seats</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Payment</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <TableSkeleton />
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No events booked yet</td>
                </tr>
              ) : (
                bookings.map((booking: any) => (
                  <tr key={booking._id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 relative overflow-hidden border border-gray-100 shrink-0">
                          {booking.eventId?.image ? (
                             <Image 
                               src={booking.eventId.image} 
                               alt="event" 
                               fill 
                               className="object-cover"
                             />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                              <IoCalendarOutline size={20}/>
                            </div>
                          )}
                        </div>
                        <div className="text-[15px]">
                          <p className="font-black text-gray-800">
                            {booking.eventId?.title || "Unknown Event"}
                          </p>
                          <p className=" text-gray-400 text-[10px] font-black mt-1 uppercase tracking-tighter">
                            ID: {booking.transactionId?.slice(-12).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col items-center gap-1 text-[13px]">
                        <div className="flex items-center gap-1.5 text-gray-700 font-bold ">
                          <IoCalendarOutline className="text-[#1A4E11]" />
                          {booking.selectedDate}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 font-bold uppercase">
                          <IoTimeOutline />
                          {booking.selectedTime}
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                        <IoTicketOutline size={14} className="text-[#1A4E11]" />
                        <span className="text-[11px] font-black text-gray-700">{booking.numberOfSeats}</span>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        booking.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-orange-50 text-orange-500'
                      }`}>
                        {booking.paymentStatus === 'paid' ? <IoCheckmarkCircleOutline size={12}/> : <IoEllipsisHorizontalCircleOutline size={12}/>}
                        {booking.paymentStatus}
                      </span>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{booking.paymentMethod}</p>
                    </td>

                    <td className="p-5 text-right">
                      <p className="text-sm font-black text-gray-900">৳{booking.totalAmount}</p>
                      <button 
                        onClick={() => handleOpenModal(booking)}
                        className="text-[9px] font-black text-[#1A4E11] uppercase tracking-widest mt-1 hover:underline"
                      >
                        View Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Component with Download Props */}
      <EventDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        user={session?.user}
        onDownload={handleDownloadTicket} 
      />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
          }
          .print\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default MyEventsPage;