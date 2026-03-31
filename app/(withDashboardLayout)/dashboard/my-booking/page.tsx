/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoCloseOutline,
  IoSaveOutline,
  IoCreateOutline,
  IoTrashOutline
} from "react-icons/io5";

// API এবং ইন্টারফেস ইমপোর্ট
import { getMyBookingsApi, updateBookingApi, deleteBookingApi } from "@/app/modules/booking/booking.api";
import { IBooking } from "@/app/modules/booking/booking.interface";
import Swal from "sweetalert2";

const MyBookings = () => {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
    guest: 0,
    date: "",
    time: ""
  });

  // বুকিং ডাটা ফেচ করার ফাংশন
  const fetchMyBookings = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await getMyBookingsApi(userId);
      if (res.success) {
        setBookings(res.data);
      }
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: "This booking will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
     customClass: {
    popup: 'rounded-[30px]', 
  }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteBookingApi(id);
          if (res.success) {
            Swal.fire("Deleted!", "Booking has been removed.", "success");
            setBookings(prev => prev.filter(b => b._id !== id));
          }
        } catch (error) {
          toast.error("Delete failed!");
        }
      }
    });
  };

  // এডিট মোডাল ওপেন
  const openEditModal = (e: React.MouseEvent, booking: IBooking) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setEditFormData({
      name: booking.name || "",
      phone: booking.phone || "",
      address: booking.address || "",
      guest: Number(booking.guest) || 0,
      date: booking.date || "",
      time: booking.time || ""
    });
    setIsEditModalOpen(true);
  };

  // আপডেট হ্যান্ডলার
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking?._id) return;

    try {
      const res = await updateBookingApi(selectedBooking._id, {
        ...editFormData,
        guest: Number(editFormData.guest) // Ensuring number type
      });

      if (res.success) {
        setIsEditModalOpen(false);
        toast.success("Booking updated successfully!");
        fetchMyBookings(); 
      }
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#1A4E11] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-gray-50/30 min-h-screen p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">My Reservations</h1>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[4px]">Active booking history</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center shadow-sm">
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-[2px]">No bookings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                onClick={() => { setSelectedBooking(booking); setIsDetailsModalOpen(true); }}
                className="bg-white p-6 rounded-[30px] border border-gray-100 cursor-pointer hover:border-[#1A4E11] transition-all group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <div className="space-y-3">
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[8px] font-black uppercase rounded-full border border-gray-100">
                      ID: {booking._id?.slice(-6).toUpperCase()}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                      Booking for {booking.guest} Persons
                    </h3>
                    <div className="flex gap-4 text-gray-400 text-[11px] font-bold">
                       <span className="flex items-center gap-1"><IoCalendarOutline/> {booking.date}</span>
                       <span className="flex items-center gap-1"><IoTimeOutline/> {booking.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => openEditModal(e, booking)}
                      className="p-3 border border-gray-100 hover:bg-gray-50 rounded-2xl text-gray-600 transition-all"
                    >
                      <IoCreateOutline size={18}/>
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, booking._id!)}
                      className="p-3 border border-gray-100 hover:bg-red-50 hover:text-red-500 rounded-2xl text-gray-600 transition-all"
                    >
                      <IoTrashOutline size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Details View Modal --- */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] border border-gray-100 p-8 md:p-12 relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setIsDetailsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-black">
              <IoCloseOutline size={28}/>
            </button>
            <div className="mb-8 border-b border-gray-50 pb-6">
              <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">Reservation Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase">Number of Guests</p>
                     <p className="text-sm font-bold text-gray-800">{selectedBooking.guest} Persons</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase">Booked Date</p>
                     <p className="text-sm font-bold text-gray-800">{selectedBooking.date}</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase">Reserved By</p>
                     <p className="text-sm font-bold text-gray-800">{selectedBooking.name}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase">Address</p>
                     <p className="text-sm font-bold text-gray-800 leading-tight">{selectedBooking.address || 'Not Provided'}</p>
                  </div>
               </div>
            </div>
            <button onClick={() => setIsDetailsModalOpen(false)} className="w-full mt-10 py-4 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* --- Edit Modal --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] border border-gray-100 p-8 max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">Edit Reservation</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-black">
                <IoCloseOutline size={24}/>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11] transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Phone</label>
                <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11] transition-all" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Date</label>
                  <input type="date" value={editFormData.date} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11] transition-all" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Time</label>
                  <input type="text" value={editFormData.time} onChange={(e) => setEditFormData({...editFormData, time: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11] transition-all" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Number of Guests</label>
                <input type="number" value={editFormData.guest} onChange={(e) => setEditFormData({...editFormData, guest: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11] transition-all" required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Address</label>
                <textarea value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11] min-h-[80px] transition-all" />
              </div>

              <button type="submit" className="w-full py-4 bg-[#1A4E11] text-white rounded-2xl text-[11px] font-black uppercase tracking-[2px] mt-2 flex items-center justify-center gap-2 hover:bg-[#143d0d] transition-all shadow-lg shadow-[#1a4e11]/20">
                 <IoSaveOutline size={18}/> Update All Info
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;