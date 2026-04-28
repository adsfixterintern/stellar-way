/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  getAllFeedbacksForAdmin,
  updateFeedbackApi,
  deleteFeedbackApi,
} from "@/app/modules/feedback/feedback.api";
import { IFeedback } from "@/app/modules/feedback/feedback.interface";
import {
  IoTrashOutline,
  IoCreateOutline,
  IoCloseOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";

const FeedbackSkeleton = () => (
  <div className="p-5 flex flex-col md:flex-row gap-6 animate-pulse items-center bg-white mb-2 rounded-xl">
    <div className="flex items-center gap-4 w-full md:w-1/4">
      <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
      <div className="space-y-2 grow">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="h-2 w-16 bg-gray-50 rounded" />
      </div>
    </div>
    <div className="grow w-full space-y-2">
      <div className="h-3 w-full bg-gray-50 rounded" />
      <div className="h-3 w-4/5 bg-gray-50 rounded" />
    </div>
    <div className="flex gap-2 w-full md:w-auto justify-end">
      <div className="h-10 w-20 bg-gray-50 rounded-lg" />
    </div>
  </div>
);

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [editData, setEditData] = useState({
    name: "",
    designation: "",
    status: "pending",
    description: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAllFeedbacks = async () => {
    try {
      const res = await getAllFeedbacksForAdmin();
      setFeedbacks(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  const openEditModal = (fb: IFeedback) => {
    setSelectedFeedback(fb);
    setEditData({
      name: fb.name,
      designation: fb.designation,
      status: fb.status as string,
      description: fb.description,
    });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateFeedbackApi(selectedFeedback._id, editData as any);
      toast.success("Updated Successfully!");
      setIsModalOpen(false);
      fetchAllFeedbacks();
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Delete",
      customClass: { popup: "rounded-2xl border-none" },
    });

    if (result.isConfirmed) {
      try {
        await deleteFeedbackApi(id);
        toast.success("Deleted");
        fetchAllFeedbacks();
      } catch (error) {
        toast.error("Error");
      }
    }
  };

  return (
    <div className="  min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-[#1A4E11] uppercase italic tracking-tight">
            Guest Testimonials
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mt-2 ml-1">
            Dashboard Management
          </p>
        </header>

        <div className="space-y-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => <FeedbackSkeleton key={i} />)
          ) : (
            <>
              {/* Data Table / List */}
              <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="hidden md:block">
                  <table className="w-full text-left">
                    <thead className="bg-[#F9FBFA]">
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="p-6">Reviewer</th>
                        <th className="p-6">Feedback</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {feedbacks.map((fb) => (
                        <tr
                          key={fb._id}
                          className="hover:bg-gray-50/50 transition-all group"
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                                <Image
                                  src={
                                    (fb.userId as any)?.image ||
                                    "/placeholder-avatar.png"
                                  }
                                  alt={fb.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-black text-gray-900 uppercase">
                                  {fb.name}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">
                                  {fb.designation}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-xs text-gray-500 italic max-w-sm font-medium leading-relaxed">
                            {fb.description}
                          </td>
                          <td className="p-6">
                            <span
                              className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${fb.status === "published" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
                            >
                              {fb.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                              <button
                                onClick={() => openEditModal(fb)}
                                className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                              >
                                <IoCreateOutline size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(fb._id)}
                                className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-300 hover:text-red-500 rounded-xl transition-all"
                              >
                                <IoTrashOutline size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden divide-y divide-gray-50">
                  {feedbacks.map((fb) => (
                    <div key={fb._id} className="p-6 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                            <Image
                              src={
                                (fb.userId as any)?.image ||
                                "/placeholder-avatar.png"
                              }
                              alt={fb.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800">
                              {fb.name}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                              {fb.designation}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${fb.status === "published" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}
                        >
                          {fb.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 italic leading-relaxed font-medium bg-[#F9FBFA] p-4 rounded-2xl">
                        {fb.description}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(fb)}
                          className="flex-1 py-3.5 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-[2px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(fb._id)}
                          className="flex-1 py-3.5 bg-red-50 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-[2px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- Minimalist Modal (No Borders, Soft Shadows) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full md:max-w-lg rounded-t-[32px] md:rounded-3xl shadow-[0_-20px_80px_rgba(0,0,0,0.15)] overflow-hidden animate-in slide-in-from-bottom duration-500">
            <div className="p-6 flex justify-between items-center bg-white">
              <h2 className="text-xl font-black text-[#1A4E11] uppercase italic tracking-tight">
                Edit Feedback
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateSubmit}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:shadow-md transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={editData.designation}
                    onChange={(e) =>
                      setEditData({ ...editData, designation: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:shadow-md transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-300 ml-1">
                  Visibility Status
                </label>
                <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl">
                  {["pending", "published"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditData({ ...editData, status: s })}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${editData.status === s ? "bg-white text-[#1A4E11] shadow-sm" : "text-gray-400"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-300 ml-1">
                  Review Message
                </label>
                <textarea
                  rows={4}
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full p-5 bg-gray-50 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:shadow-md transition-all resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-5 bg-[#1A4E11] text-white font-black rounded-2xl uppercase text-[10px] tracking-[4px] shadow-xl shadow-[#1A4E11]/20 hover:scale-[1.01] active:scale-95 transition-all"
              >
                {isUpdating ? "Saving..." : "Update Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;
