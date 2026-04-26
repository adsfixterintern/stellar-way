/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  IoCloseOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoCheckmarkCircle,
  IoQrCodeOutline,
  IoDownloadOutline,
  IoLocationOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { QRCodeSVG } from "qrcode.react";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  user: any;
  onDownload?: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  user,
  onDownload,
}) => {
  if (!isOpen || !booking) return null;

  const qrValue = `BookingID: ${booking._id} | TXN: ${booking.transactionId} | Event: ${booking.eventId?.title}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all overflow-hidden print:bg-white print:p-0 print:static print:overflow-visible">
      {/* --- Ticket Print CSS --- */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-ticket,
          .printable-ticket * {
            visibility: visible;
          }
          .printable-ticket {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Ticket Modal - Following your requested design */}
      <div className="bg-white w-full max-w-md rounded-[35px] shadow-2xl overflow-hidden relative animate-in zoom-in duration-200 printable-ticket print:shadow-none print:max-w-full print:rounded-none">
        
        {/* Header Section */}
        <div className="bg-[#1A4E11] p-6 text-center text-white print:bg-white print:text-black print:border-b">
          <p className="text-[9px] font-black uppercase tracking-[3px] opacity-60 print:opacity-100">
            Event Entry Ticket
          </p>
          <h2 className="text-xl font-black uppercase tracking-tighter italic print:text-black">
            Booking Confirmed
          </h2>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/50 hover:text-white no-print"
          >
            <IoCloseOutline size={28} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* QR Code Section */}
          <div className="flex justify-center">
            <div className="bg-gray-50 p-3 rounded-2xl border border-dashed border-gray-200 print:border-solid">
              <QRCodeSVG
                value={qrValue}
                size={150}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          {/* Event Title */}
          <div className="text-center border-b border-gray-50 pb-4">
             <p className="text-[9px] text-gray-400 uppercase font-black">Event Name</p>
             <h3 className="font-black text-gray-900 text-lg leading-tight uppercase italic">
                {booking.eventId?.title}
             </h3>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-4 pt-2">
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black">Date</p>
              <p className="text-sm font-bold text-gray-800">
                {booking.selectedDate}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black">Time</p>
              <p className="text-sm font-bold text-gray-800">
                {booking.selectedTime}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black">Guests</p>
              <p className="text-sm font-bold text-gray-800">
                {booking.numberOfSeats} Person(s)
              </p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-black">Amount Paid</p>
              <p className="text-sm font-black text-[#1A4E11]">
                ৳ {booking.totalAmount}
              </p>
            </div>
          </div>

          {/* Customer Info Section */}
          <div className="space-y-2 border-t border-gray-50 pt-4">
            <p className="text-[9px] text-gray-400 uppercase font-black">Customer Details</p>
            <div className="bg-gray-50 p-3 rounded-xl space-y-1.5">
               <p className="text-[10px] font-bold text-gray-700 flex items-center gap-2">
                  <IoPersonOutline className="text-[#1A4E11]"/> {user?.name}
               </p>
               <p className="text-[10px] font-bold text-gray-700 flex items-center gap-2">
                  <IoCallOutline className="text-[#1A4E11]"/> {booking.phone}
               </p>
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-[#F9FBFA] p-4 rounded-xl border border-gray-100 print:bg-white">
            <p className="text-[8px] text-gray-400 uppercase font-black mb-1">
              Transaction Info
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 truncate">
              <IoWalletOutline /> {booking.transactionId}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A4E11] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-green-900/10 no-print"
          >
            <IoDownloadOutline size={18} /> Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;