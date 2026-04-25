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

  const openEditModal = (event: any) => {
    setEditId(event._id);
    // Date format conversion for HTML input (YYYY-MM-DD)
    const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";
    
    setFormData({
      title: event.title,
      subTitle: event.subTitle || "",
      date: formattedDate,
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
        toast.success(editId ? "Event updated successfully!" : "Event published successfully!");
        closeModal();
        refetch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed!");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "All associated booking records might be affected!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Confirm Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteEventApi(id);
        if (res.success) {
          toast.success("Event removed");
          refetch();
        }
      } catch (err: any) {
        toast.error("Failed to delete event");
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-6 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Event Hub</h1>
          <p className="text-[10px] text-[#1A4E11] font-black mt-1 uppercase tracking-[3px]">Manage Restaurant Experiences</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#1A4E11] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#25631a] transition-all">
          <IoAddOutline size={20} /> Create Event
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">General Info</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Timing</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Available Seats</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Ticket Price</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <TableSkeleton />
              ) : events.length > 0 ? (
                events.map((event: any) => (
                  <tr key={event._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100">
                          <Image 
                            src={event.image || "/placeholder.png"} 
                            alt={event.title} 
                            fill 
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{event.title}</h3>
                          <p className="text-[11px] text-gray-400 font-medium">{event.status.toUpperCase()} • {event.featured ? 'FEATURED' : 'STANDARD'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                          <IoCalendarOutline /> {event.date}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                          At {event.time}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-black text-[#1A4E11]">{event.availableSeat} / {event.seat}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Seats Remaining</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-[11px] font-black">
                           {event.price} BDT
                        </span>
                    </td>
                    <td className="p-5 text-right space-x-2">
                      <button onClick={() => openEditModal(event)} className="p-2.5 text-gray-400 hover:text-[#1A4E11] hover:bg-green-50 rounded-xl transition-all">
                        <IoCreateOutline size={20} />
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <IoTrashOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">No Events Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationDashboard totalItems={events.length} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />
      </div>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-3xl shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black text-gray-900">{editId ? "Edit Event Details" : "Publish New Event"}</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Configure your guest experience</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <IoCloseOutline size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 overflow-y-auto custom-scrollbar space-y-8">
              {/* Image Upload */}
              <div className="group relative w-full h-48 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#1A4E11] transition-all overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <IoImageOutline size={40} className="mx-auto text-gray-300 group-hover:text-[#1A4E11] transition-colors" />
                    <span className="text-[10px] font-black uppercase text-gray-400 mt-2 block tracking-widest">Upload Cover Photo</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <label className="absolute inset-0 cursor-pointer" onClick={(e) => (e.target as any).previousSibling.click()} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Title</label>
                  <input name="title" required value={formData.title} onChange={handleInputChange} placeholder="e.g. Candlelight Jazz Night" className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#1A4E11]/20 focus:border-[#1A4E11] font-bold text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Date</label>
                  <input type="date" name="date" required value={formData.date} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Time</label>
                  <input type="text" name="time" placeholder="07:00 PM" required value={formData.time} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Total Capacity</label>
                  <div className="relative">
                    <IoPeopleOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="seat" required value={formData.seat} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl font-bold text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Ticket Price (BDT)</label>
                  <div className="relative">
                    <IoWalletOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl font-bold text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Display Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold text-sm appearance-none outline-none focus:border-[#1A4E11]">
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Promotion Level</label>
                  <select name="featured" value={String(formData.featured)} onChange={(e) => setFormData(p => ({...p, featured: e.target.value === "true"}))} className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl font-bold text-sm appearance-none outline-none focus:border-[#1A4E11]">
                    <option value="false">Standard Event</option>
                    <option value="true">Featured Experience</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Brief Description</label>
                  <textarea name="subTitle" rows={3} required value={formData.subTitle} onChange={handleInputChange} placeholder="Tell guests what to expect..." className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-[#1A4E11] font-bold text-sm resize-none" />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={btnLoading} className="w-full bg-[#1A4E11] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[3px] shadow-xl hover:bg-[#215a18] transition-all disabled:opacity-50">
                  {btnLoading ? "Synchronizing..." : editId ? "Update Experience" : "Launch Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;