/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { 
  getAllFeedbacksForAdmin, 
  updateFeedbackApi, 
  deleteFeedbackApi 
} from "@/app/modules/feedback/feedback.api";
import { IFeedback } from "@/app/modules/feedback/feedback.interface";
import { 
  IoCheckmarkCircleOutline, 
  IoTrashOutline, 
  IoTimeOutline, 
  IoCreateOutline, 
  IoCloseOutline 
} from "react-icons/io5";
import Swal from "sweetalert2";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [editData, setEditData] = useState({
    name: "",
    designation: "",
    status: "pending",
    description: ""
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
      description: fb.description
    });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback) return;

    setIsUpdating(true);
    try {
      await updateFeedbackApi(selectedFeedback._id, editData as any);
      toast.success("Feedback updated successfully!");
      setIsModalOpen(false);
      fetchAllFeedbacks();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

 const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1A4E11",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    background: "#fff",
    customClass: {
      popup: "rounded-3xl",
      title: "font-black uppercase text-lg",
      confirmButton: "font-black uppercase text-xs tracking-widest px-6 py-3",
      cancelButton: "font-black uppercase text-xs tracking-widest px-6 py-3",
    }
  });

  if (result.isConfirmed) {
    try {
      await deleteFeedbackApi(id);
      
  
      Swal.fire({
        title: "Deleted!",
        text: "The feedback has been removed.",
        icon: "success",
        confirmButtonColor: "#1A4E11",
      });
      
      fetchAllFeedbacks(); 
    } catch (error) {
      Swal.fire("Error!", "Failed to delete feedback.", "error");
    }
  }
};

  if (loading) return <div className="p-10 text-center font-black uppercase">Loading Feedbacks...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Guest Testimonials</h1>
          <p className="text-sm text-gray-500 font-medium">Manage and approve feedback to be displayed on the homepage.</p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">User</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">Feedback</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {feedbacks.map((fb) => (
                <tr key={fb._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={(fb.userId as any)?.image || "/placeholder-avatar.png"} alt={fb.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{fb.name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{fb.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 max-w-xs">
                    <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2">&ldquo;{fb.description}&rdquo;</p>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase ${fb.status === "published" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"}`}>
                      {fb.status === "published" ? <IoCheckmarkCircleOutline size={12}/> : <IoTimeOutline size={12}/>}
                      {fb.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(fb)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors" title="Edit Feedback">
                        <IoCreateOutline size={20} />
                      </button>
                      <button onClick={() => handleDelete(fb._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete Feedback">
                        <IoTrashOutline size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Edit Testimonial</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <IoCloseOutline size={28} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">User Name</label>
                  <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-[#1A4E11] outline-none transition-all" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400">Designation</label>
                  <input type="text" value={editData.designation} onChange={(e) => setEditData({...editData, designation: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-[#1A4E11] outline-none transition-all" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Feedback Status</label>
                <select value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-[#1A4E11] outline-none transition-all">
                  <option value="pending">Pending (Draft)</option>
                  <option value="published">Published (Visible on Home)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Review Text</label>
                <textarea rows={4} value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:border-[#1A4E11] outline-none transition-all resize-none" required />
              </div>

              <button type="submit" disabled={isUpdating} className="w-full py-4 bg-[#1A4E11] text-white font-black rounded-2xl uppercase text-xs tracking-widest shadow-xl hover:opacity-90 transition-all disabled:bg-gray-300">
                {isUpdating ? "Saving Changes..." : "Update Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;