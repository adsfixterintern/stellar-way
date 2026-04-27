/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import {
  IoCalendarOutline,
  IoTicketOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoEllipsisHorizontalCircleOutline,
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

  const bookings =
    bookingsData?.data?.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt?.$date || a.createdAt).getTime();
      const dateB = new Date(b.createdAt?.$date || b.createdAt).getTime();
      return dateB - dateA;
    }) || [];

  const handleOpenModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleDownloadTicket = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full p-4 md:p-8 font-sans bg-[#FBFCFD] min-h-screen">
      {/* Header */}
      <div className="mb-8 print:hidden">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
          My <span className="text-[#1A4E11]">Events</span>
        </h1>
        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[3px]">
          Manage your event reservations
        </p>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center">
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest">
            No events booked yet
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden print:hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Event Detail
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                      Schedule
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                      Seats
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                      Status
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((booking: any) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50/40 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 relative overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                            {booking.eventId?.image ? (
                              <Image
                                src={booking.eventId.image}
                                alt="event"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                <IoCalendarOutline size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-800 text-sm leading-tight">
                              {booking.eventId?.title || "Unknown Event"}
                            </p>
                            <p className="text-gray-400 text-[9px] font-black mt-1 uppercase tracking-tighter">
                              TRX: {booking.transactionId?.toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[12px] font-bold text-gray-700 flex items-center gap-1.5">
                            <IoCalendarOutline className="text-[#1A4E11]" />{" "}
                            {booking.selectedDate}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter flex items-center gap-1">
                            <IoTimeOutline /> {booking.selectedTime}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[11px] font-black text-gray-700">
                          <IoTicketOutline
                            className="text-[#1A4E11]"
                            size={14}
                          />{" "}
                          {booking.numberOfSeats}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-orange-50 text-orange-500"}`}
                        >
                          {booking.paymentStatus === "paid" ? (
                            <IoCheckmarkCircleOutline size={12} />
                          ) : (
                            <IoEllipsisHorizontalCircleOutline size={12} />
                          )}
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <p className="text-sm font-black text-gray-900 leading-none">
                          ৳{booking.totalAmount}
                        </p>
                        <button
                          onClick={() => handleOpenModal(booking)}
                          className="text-[9px] font-black text-[#1A4E11] uppercase tracking-widest mt-2 hover:text-black transition-colors block ml-auto"
                        >
                          View Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4 print:hidden">
            {bookings.map((booking: any) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 relative overflow-hidden border border-gray-100 shrink-0">
                    {booking.eventId?.image ? (
                      <Image
                        src={booking.eventId.image}
                        alt="event"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <IoCalendarOutline size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-black text-gray-800 text-sm leading-tight pr-2">
                        {booking.eventId?.title || "Unknown Event"}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-orange-50 text-orange-500"}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[9px] font-black mt-1 uppercase tracking-tighter italic">
                      ID: {booking.transactionId?.slice(-10).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-dashed border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                      Schedule
                    </p>
                    <p className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                      <IoCalendarOutline className="text-[#1A4E11]" />{" "}
                      {booking.selectedDate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                      Booking Info
                    </p>
                    <p className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                      <IoTicketOutline className="text-[#1A4E11]" />{" "}
                      {booking.numberOfSeats} Seats
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm font-black text-gray-900 italic">
                    ৳{booking.totalAmount}
                  </p>
                  <button
                    onClick={() => handleOpenModal(booking)}
                    className="px-4 py-2 bg-[#1A4E11] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/10 active:scale-95 transition-all"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
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
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MyEventsPage;
