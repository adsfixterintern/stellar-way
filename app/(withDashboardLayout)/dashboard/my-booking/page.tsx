"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoLocationOutline,
  IoReceiptOutline,
  IoInformationCircleOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoCloseOutline,
  IoSaveOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoCallOutline
} from "react-icons/io5";

const MyBookings = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // সব ইনফো আপডেট করার জন্য স্টেট
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    address: "",
    guest: "",
    date: "",
    time: ""
  });

  const fetchMyBookings = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/bookings/my-bookings", 
        { userId } 
      );
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [userId]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      background: "#fff",
      borderRadius: "30px",
      customClass: {
        title: "font-black uppercase tracking-tighter italic",
        popup: "rounded-[30px] border border-gray-100",
        confirmButton: "rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest",
        cancelButton: "rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest"
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(`http://localhost:8000/api/v1/bookings/${id}`);
          if (data.success) {
            Swal.fire({
                title: "Deleted!",
                text: "Your booking has been deleted.",
                icon: "success",
                confirmButtonColor: "#1A4E11",
                borderRadius: "30px",
            });
            setBookings(bookings.filter(b => b._id !== id));
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to delete the booking.", "error");
        }
      }
    });
  };

  const openEditModal = (e, booking) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    // এডিট করার সময় সব বর্তমান ডাটা ইনপুট ফিল্ডে সেট করা
    setEditFormData({
      name: booking.name || "",
      phone: booking.phone || "",
      address: booking.address || "",
      guest: booking.guest || "",
      date: booking.date || "",
      time: booking.time || ""
    });
    setIsEditModalOpen(true);
  };

  const openDetailsModal = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(
        `http://localhost:8000/api/v1/bookings/${selectedBooking._id}`,
        editFormData
      );
      if (data.success) {
        setIsEditModalOpen(false);
        Swal.fire({
            title: "Success!",
            text: "All booking details updated successfully.",
            icon: "success",
            confirmButtonColor: "#1A4E11",
            borderRadius: "30px",
        });
        fetchMyBookings(); 
      }
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#1A4E11] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-gray-50/30 min-h-screen p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">My Reservations</h1>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[4px]">Active booking history</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-black uppercase tracking-[2px]">No bookings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                onClick={() => openDetailsModal(booking)}
                className="bg-white p-6 rounded-[30px] border border-gray-100 cursor-pointer hover:border-[#1A4E11] transition-all group"
              >
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                  <div className="space-y-3">
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[8px] font-black uppercase rounded-full border border-gray-100">
                      ID: {booking._id.slice(-6).toUpperCase()}
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
                      onClick={(e) => handleDelete(e, booking._id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] border border-gray-100 p-10 relative">
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
                     <p className="text-[9px] font-black text-gray-400 uppercase">Meeting Address</p>
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

      {/* --- Edit Modal (All Info Update) --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] border border-gray-100 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 text-xl font-black uppercase italic tracking-tighter">
              <h2>Edit Reservation</h2>
              <button onClick={() => setIsEditModalOpen(false)}><IoCloseOutline size={24}/></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Name & Phone */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Name</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11]" required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Phone</label>
                <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11]" required />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Date</label>
                  <input type="date" value={editFormData.date} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11]" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Time</label>
                  <input type="text" value={editFormData.time} onChange={(e) => setEditFormData({...editFormData, time: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11]" required />
                </div>
              </div>

              {/* Guests & Address */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Number of Guests</label>
                <input type="number" value={editFormData.guest} onChange={(e) => setEditFormData({...editFormData, guest: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11]" required />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-400 ml-1">Address</label>
                <textarea value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl text-xs font-bold outline-none focus:border-[#1A4E11] min-h-[80px]" />
              </div>

              <button type="submit" className="w-full py-4 bg-[#1A4E11] text-white rounded-2xl text-[11px] font-black uppercase tracking-[2px] mt-2 flex items-center justify-center gap-2">
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