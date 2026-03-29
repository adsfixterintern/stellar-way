/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoImageOutline,
  IoCreateOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoWalletOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import Image from "next/image";
import { useEvents } from "@/app/hooks/useEvent"; 
import { IEvent } from "@/app/modules/event/event.interface"; 
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import { createEventApi, deleteEventApi, updateEventApi } from "@/app/modules/event/event.api";

const EventPage: React.FC = () => {
  const { data: eventData, isLoading, refetch } = useEvents();
  const events = (eventData as any)?.data || [];

  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    date: "",
    time: "",
    seat: "",
    price: "",
    status: "active" as "active" | "expired",
    featured: false,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (event: IEvent) => {
    setEditId(event._id);
    setFormData({
      title: event.title,
      subTitle: event.subTitle || "",
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : "", 
      time: event.time,
      seat: String(event.seat),
      price: String(event.price),
      status: event.status as "active" | "expired",
      featured: event.featured,
    });
    setImagePreview(event.image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ title: "", subTitle: "", date: "", time: "", seat: "", price: "", status: "active", featured: false });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subTitle", formData.subTitle);
    data.append("date", formData.date);
    data.append("time", formData.time);
    data.append("seat", formData.seat);
    data.append("price", formData.price);
    data.append("status", formData.status);
    data.append("featured", String(formData.featured));
    
    if (imageFile) data.append("image", imageFile);

    try {
      const res = editId ? await updateEventApi(editId, data) : await createEventApi(data);
      if (res.success) {
        toast.success(editId ? "Event updated successfully!" : "Event created successfully!");
        closeModal();
        refetch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This event will be deleted forever!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteEventApi(id);
        if (res.success) {
          toast.success("Event removed successfully");
          refetch();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Event Management</h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">Culinary Expo & Workshops</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto flex items-center justify-center gap-2 blockBtn py-3">
          <IoAddOutline size={18} /> Add New Event
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Event Details</th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Schedule</th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Capacity/Price</th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <TableSkeleton />
              ) : events.length > 0 ? (
                events.map((event: IEvent) => (
                  <tr key={event._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative shrink-0">
                          <Image 
                            src={event.image && event.image.includes('http') ? event.image : "/placeholder-image.png"} 
                            alt={event.title} 
                            fill 
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm line-clamp-1">{event.title}</span>
                          <span className="text-[11px] font-semibold ">
                            {event.subTitle}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-[10px] md:text-[11px] font-bold text-gray-600 flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap"><IoCalendarOutline /> {new Date(event.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 text-gray-400 whitespace-nowrap"><IoTimeOutline /> {event.time}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-[10px] md:text-[11px] font-bold text-gray-600 flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1 text-[#1A4E11] whitespace-nowrap"><IoPeopleOutline /> {event.seat} Seats</span>
                        <span className="flex items-center gap-1 text-amber-600 whitespace-nowrap"><IoWalletOutline /> {event.price} BDT</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${event.status === "active" ? "bg-green-50 text-[#1A4E11]" : "bg-red-50 text-red-500"}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button onClick={() => openEditModal(event)} className="p-2 text-gray-400 hover:text-[#1A4E11] hover:bg-green-50 rounded-lg transition-all"><IoCreateOutline size={18} /></button>
                      <button onClick={() => handleDelete(event._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><IoTrashOutline size={18} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No events found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationDashboard totalItems={events.length} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">{editId ? "Update Event" : "Add New Event"}</h2>
                <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Provide event schedule & details</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><IoCloseOutline size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                <div className="md:col-span-2">
                   <label className="relative w-full h-36 md:h-44 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#1A4E11] hover:bg-green-50/30 overflow-hidden transition-all group">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /> 
                    ) : ( 
                      <div className="flex flex-col items-center text-gray-400">
                        <IoImageOutline size={32} className="group-hover:scale-110 transition-transform"/> 
                        <span className="text-[9px] font-black uppercase mt-2 tracking-widest">Upload Cover Image</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Title</label>
                  <input name="title" required value={formData.title} onChange={handleInputChange} placeholder="Event Name" className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold transition-all" />
                </div>

                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Date</label>
                   <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold" />
                </div>

                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Time</label>
                   <input type="text" name="time" placeholder="06:30 PM" required value={formData.time} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold" />
                </div>

                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Total Seats</label>
                   <input type="number" name="seat" required value={formData.seat} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold" />
                </div>

                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Price (BDT)</label>
                   <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold" />
                </div>

                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                   <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold appearance-none cursor-pointer">
                     <option value="active">Active</option>
                     <option value="expired">Expired</option>
                   </select>
                </div>

                <div className="space-y-1">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Featured</label>
                   <select name="featured" value={String(formData.featured)} onChange={(e) => setFormData(p => ({...p, featured: e.target.value === "true"}))} className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold appearance-none cursor-pointer">
                     <option value="false">Standard</option>
                     <option value="true">Featured</option>
                   </select>
                </div>

                <div className="md:col-span-2 space-y-1">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                   <textarea name="subTitle" rows={2} required value={formData.subTitle} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl outline-none focus:border-[#1A4E11] text-xs md:text-sm font-bold resize-none" />
                </div>
              </div>

              <button type="submit" disabled={btnLoading} className="w-full bg-[#1A4E11] text-white py-4 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-[2px] mt-6 hover:bg-[#25631a] transition-all shadow-lg disabled:opacity-50">
                {btnLoading ? "Processing..." : editId ? "Save Changes" : "Publish Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;