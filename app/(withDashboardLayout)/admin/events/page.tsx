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
  IoPeopleOutline,
  IoWalletOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import Image from "next/image";
import { useEvents } from "@/app/hooks/useEvent";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import {
  createEventApi,
  deleteEventApi,
  updateEventApi,
} from "@/app/modules/event/event.api";

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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
    const formattedDate = event.date
      ? new Date(event.date).toISOString().split("T")[0]
      : "";
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
    setFormData({
      title: "",
      subTitle: "",
      date: "",
      time: "",
      seat: "",
      price: "",
      status: "active",
      featured: false,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      data.append(key, String(value)),
    );
    if (imageFile) data.append("image", imageFile);

    try {
      const res = editId
        ? await updateEventApi(editId, data)
        : await createEventApi(data);
      if (res.success) {
        toast.success(editId ? "Updated!" : "Published!");
        closeModal();
        refetch();
      }
    } catch (err: any) {
      toast.error("Operation failed!");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Remove Event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Delete",
      customClass: { popup: "rounded-2xl border-none" },
    });

    if (result.isConfirmed) {
      try {
        await deleteEventApi(id);
        toast.success("Removed");
        refetch();
      } catch (err) {
        toast.error("Error");
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto  min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-[#1A4E11] uppercase italic tracking-tighter">
            Event Hub
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-1">
            Manage Restaurant Experiences
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#1A4E11] text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#1A4E11]/20 active:scale-95 transition-all"
        >
          <IoAddOutline size={20} /> Create Event
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="p-6">General Info</th>
                <th className="p-6 text-center">Timing</th>
                <th className="p-6 text-center">Capacity</th>
                <th className="p-6 text-center">Price</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                events.map((event: any) => (
                  <tr
                    key={event._id}
                    className="hover:bg-gray-50/50 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden relative shadow-sm">
                          <Image
                            src={event.image || "/placeholder.png"}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-black text-gray-800 text-sm uppercase tracking-tight">
                            {event.title}
                          </h3>
                          <p className="text-[9px] font-bold text-gray-400 uppercase">
                            {event.status} •{" "}
                            {event.featured ? "Featured" : "Standard"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-block text-[10px] font-black text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg uppercase">
                        {event.date} | {event.time}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <p className="text-xs font-black text-[#1A4E11]">
                        {event.availableSeat}/{event.seat}
                      </p>
                      <p className="text-[8px] font-bold text-gray-300 uppercase">
                        Left
                      </p>
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                        {event.price} BDT
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-2.5 bg-white shadow-sm text-gray-400 hover:text-[#1A4E11] rounded-xl"
                        >
                          <IoCreateOutline size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2.5 bg-white shadow-sm text-gray-400 hover:text-red-500 rounded-xl"
                        >
                          <IoTrashOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-50">
          {events.map((event: any) => (
            <div key={event._id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 relative overflow-hidden shadow-sm">
                    <Image
                      src={event.image || "/placeholder.png"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">
                      {event.date}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[8px] font-black uppercase ${event.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                >
                  {event.status}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-700">
                    {event.availableSeat}/{event.seat}
                  </p>
                  <p className="text-[7px] font-bold text-gray-400 uppercase">
                    Seats
                  </p>
                </div>
                <div className="text-center border-x border-gray-200 px-4">
                  <p className="text-[10px] font-black text-amber-600">
                    {event.price} BDT
                  </p>
                  <p className="text-[7px] font-bold text-gray-400 uppercase">
                    Ticket
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-700">
                    {event.time}
                  </p>
                  <p className="text-[7px] font-bold text-gray-400 uppercase">
                    Time
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(event)}
                  className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-black text-[9px] uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-t-[32px] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom duration-500">
            <div className="p-6 flex justify-between items-center bg-white border-b border-gray-50">
              <h2 className="text-xl font-black text-[#1A4E11] uppercase italic tracking-tight">
                {editId ? "Update" : "Launch"} Event
              </h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-all"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 md:p-8 overflow-y-auto space-y-6"
            >
              {/* Image Preview Area */}
              <div
                onClick={() =>
                  (document.getElementById("imageInput") as any).click()
                }
                className="relative w-full h-40 md:h-52 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <IoImageOutline size={40} className="text-gray-200" />
                    <span className="text-[10px] font-black uppercase text-gray-400 mt-2 tracking-widest">
                      Select Experience Cover
                    </span>
                  </>
                )}
                <input
                  id="imageInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                    Event Title
                  </label>
                  <input
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:bg-white focus:shadow-md transition-all font-bold text-sm"
                    placeholder="Title..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 p-4 rounded-xl font-bold text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                    Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 p-4 rounded-xl font-bold text-sm outline-none"
                    placeholder="07:00 PM"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="seat"
                    required
                    value={formData.seat}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 p-4 rounded-xl font-bold text-sm outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                    Ticket Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 p-4 rounded-xl font-bold text-sm outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-[#1A4E11] text-white py-5 rounded-xl font-black uppercase text-[10px] tracking-[4px] shadow-xl shadow-[#1A4E11]/20 active:scale-95 transition-all"
              >
                {btnLoading
                  ? "Processing..."
                  : editId
                    ? "Update Experience"
                    : "Launch Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;
