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
  IoCheckmarkCircle
} from "react-icons/io5";
import Image from "next/image";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  user: any;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, booking, user }) => {
  if (!isOpen || !booking) return null;

  return (
    // আউটার র‍্যাপার: মোবাইলে উপর থেকে শুরু হবে (items-start) এবং প্যাডিং থাকবে
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all overflow-hidden">
      
      {/* মোডাল কন্টেইনার: max-h-[90vh] দেওয়া হয়েছে যাতে মোবাইল স্ক্রিনে এটি আটকে না যায় */}
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        
        {/* Header - এটি ফিক্সড থাকবে */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">Booking Details</h2>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
              TXN: {booking.transactionId}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
            <IoCloseOutline size={24} className="text-gray-500" />
          </button>
        </div>

        {/* স্ক্রলেবল কন্টেন্ট এরিয়া */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Side: Event Info */}
            <div className="space-y-4">
              <h3 className="text-[10px] sm:text-[11px] font-black uppercase text-[#1A4E11] tracking-widest border-b pb-2">Event Information</h3>
              <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                <Image 
                  src={booking.eventId?.image || "/placeholder.png"} 
                  alt="event" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-black text-gray-900 text-base sm:text-lg leading-tight">{booking.eventId?.title}</h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-2 leading-relaxed">{booking.eventId?.subTitle}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <IoCalendarOutline className="text-[#1A4E11]" /> {booking.selectedDate}
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <IoTimeOutline className="text-[#1A4E11]" /> {booking.selectedTime}
                </div>
              </div>
            </div>

            {/* Right Side: Customer & Payment */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="text-[10px] sm:text-[11px] font-black uppercase text-[#1A4E11] tracking-widest border-b pb-2">Customer Info</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                    <IoPersonOutline className="text-gray-400" size={16}/> {user?.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                    <IoMailOutline className="text-gray-400" size={16}/> <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                    <IoCallOutline className="text-gray-400" size={16}/> {booking.phone}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#1A4E11]/5 p-5 rounded-2xl border border-[#1A4E11]/10 space-y-3">
                <h3 className="text-[10px] sm:text-[11px] font-black uppercase text-[#1A4E11] tracking-widest">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-gray-500">
                    <span>Seats:</span>
                    <span className="text-gray-900">{booking.numberOfSeats} Person(s)</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-gray-500">
                    <span>Method:</span>
                    <span className="text-gray-900 uppercase">{booking.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-gray-500">
                    <span>Status:</span>
                    <span className="text-green-600 flex items-center gap-1 uppercase">
                      <IoCheckmarkCircle /> {booking.paymentStatus}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#1A4E11]/10 flex justify-between items-end">
                    <span className="text-[10px] sm:text-[11px] font-black text-[#1A4E11] uppercase">Amount Paid</span>
                    <span className="text-xl sm:text-2xl font-black text-gray-900">৳{booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - এটি ফিক্সড থাকবে */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-10 py-3 bg-[#1A4E11] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[2px] rounded-xl shadow-lg hover:shadow-[#1A4E11]/20 transition-all active:scale-95"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;