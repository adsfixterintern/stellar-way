/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoImageOutline,
  IoCreateOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import { IEvent } from "@/types/event";
import Image from "next/image";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import { useEvents } from "@/app/hooks/useEvent";

const EventPage: React.FC = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // React Query Hook
  const {
    data: events = [],
    isLoading: eventLoading,
    refetch: refetchEvents,
  } = useEvents();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [seat, setSeat] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [featured, setFeatured] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    // 10MB check (10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large! Please upload under 10MB.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }
};

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentItems = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openEditModal = (event: IEvent) => {
    setEditId(event._id);
    setTitle(event.title);
    setSubTitle(event.subTitle || "");
    setDate(event.date); 
    setTime(event.time);
    setSeat(String(event.seat));
    setPrice(String(event.price));
    setStatus(event.status);
    setFeatured(event.featured);
    setImagePreview(event.image || null);
    setIsModalOpen(true);
  };


  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!editId && !imageFile) {
    return toast.error("Please upload an image first!");
  }

  setBtnLoading(true);

  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("seat", seat); 
    formData.append("price", price);
    formData.append("status", status);
    formData.append("featured", String(featured));

    
    if (imageFile) {
      formData.append("image", imageFile); 
    }

    const url = editId
      ? `${BASE_URL}/events/event/${editId}`
      : `${BASE_URL}/events/create-event`;
    
    const method = editId ? "put" : "post";

   
    const response = await axios({
      method,
      url,
      data: formData, 
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      toast.success(editId ? "Updated!" : "Created!");
      closeModal();
      refetchEvents();
    }
  } catch (err: any) {
    console.error("Submit Error:", err.response?.data);
    toast.error(err.response?.data?.message || "Something went wrong");
  } finally {
    setBtnLoading(false);
  }
};


const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setTitle("");
    setSubTitle("");
    setDate("");
    setTime("");
    setSeat("");
    setPrice("");
    setStatus("active");
    setFeatured(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Event will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(`${BASE_URL}/events/event/${id}`);
        if (data.success) {
          toast.success("Event Deleted");
          refetchEvents();
        }
      } catch (err) {
        console.log(err)
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Event Management</h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Total Items: {events.length}
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 blockBtn">
          <IoAddOutline size={18} /> Add New Event
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Schedule</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Seat</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Price</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {eventLoading ? (
                <TableSkeleton />
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px]">No events found</td>
                </tr>
              ) : (
                currentItems.map((item: IEvent) => (
                  <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                              <IoImageOutline size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                          <span className="text-[9px] text-gray-400 font-black uppercase truncate w-32">{item.subTitle}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700">{item.date}</span>
                        <span className="text-[9px] text-gray-400 font-black">{item.time}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gray-50 text-gray-500">{item.seat}</span>
                    </td>
                    <td className="p-5 font-bold text-gray-700 text-sm">৳{item.price}</td>
                    <td className="p-5 text-right space-x-1">
                      <button onClick={() => openEditModal(item)} className="p-2.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <IoCreateOutline size={20} />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <IoTrashOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <PaginationDashboard
          totalItems={events.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-900">{editId ? "Edit Event" : "Add Event"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full"><IoCloseOutline size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Event Title</label>
                  <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Sub Title</label>
                  <input required value={subTitle} onChange={(e) => setSubTitle(e.target.value)} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Event Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Time (e.g. 06:30 PM)</label>
                  <input type="text" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Total Seat</label>
                  <input type="number" required value={seat} onChange={(e) => setSeat(e.target.value)} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Ticket Price</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold" />
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#1A4E11]" />
                  <label className="text-[10px] font-black uppercase text-gray-400">Featured Event</label>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold appearance-none">
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 overflow-hidden">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <IoImageOutline size={30} className="text-gray-200" />
                        <span className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-widest">Upload Banner</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
              <button type="submit" disabled={btnLoading} className="w-full bg-[#1A4E11] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[2px] shadow-xl shadow-[#1A4E11]/20">
                {btnLoading ? "Processing..." : editId ? "Update Event" : "Save Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;