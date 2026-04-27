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
  IoStarOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import Image from "next/image";

// Hooks & Interfaces
import { useChefs } from "@/app/hooks/useChefs";
import { IChef } from "@/types/menu";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import { createChef, deleteChefFromDB, updateChef } from "@/app/modules/chef/chef.api";

const ChefPage: React.FC = () => {
  const { data: chefs = [], isLoading, refetch } = useChefs();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [speciality, setSpeciality] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const currentItems = chefs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openEditModal = (chef: IChef) => {
    setEditId(chef._id);
    setName(chef.name);
    setDesignation(chef.designation);
    setBio((chef as IChef).bio || "");
    setSpeciality((chef as IChef).speciality || "");
    setRating(String(chef.rating));
    setStatus(chef.status);
    setImagePreview(chef.image || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setName("");
    setDesignation("");
    setBio("");
    setSpeciality("");
    setRating("");
    setStatus("active");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("designation", designation);
      formData.append("bio", bio);
      formData.append("speciality", speciality);
      formData.append("rating", rating);
      formData.append("status", status);
      if (imageFile) formData.append("image", imageFile);

      let response;
      if (editId) {
        response = await updateChef(editId, formData);
      } else {
        response = await createChef(formData);
      }

      if (response.success) {
        toast.success(editId ? "Chef updated!" : "Chef added!");
        closeModal();
        refetch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This chef will be removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteChefFromDB(id);
        if (data.success) {
          toast.success("Removed successfully");
          refetch();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">
            Chef Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[0.3em]">
            Team Overview • {chefs.length} Professional Chefs
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A4E11] text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs uppercase"
        >
          <IoAddOutline size={20} /> Add New Chef
        </button>
      </div>

      {/* Main Content (Table & Mobile Cards) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Mobile Card View (Visible on small screens) */}
        <div className="block md:hidden divide-y divide-gray-50">
          {isLoading ? (
            <div className="p-10 text-center text-[10px] font-black uppercase text-gray-400">Loading Team...</div>
          ) : (
            currentItems.map((item: IChef) => (
              <div key={item._id} className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 relative shrink-0">
                    <Image src={item.image || "https://via.placeholder.com/150"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">{item.name}</h3>
                    <p className="text-[9px] text-gray-400 font-black uppercase mb-2">{item.designation}</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded">
                        <IoStarOutline /> {item.rating}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${item.status === "active" ? "bg-green-50 text-[#1A4E11]" : "bg-gray-100 text-gray-400"}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(item)} className="flex-1 py-2.5 bg-gray-50 text-gray-400 rounded-lg font-bold text-[10px] uppercase flex justify-center items-center gap-1">
                    <IoCreateOutline size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="flex-1 py-2.5 bg-red-50 text-red-400 rounded-lg font-bold text-[10px] uppercase flex justify-center items-center gap-1">
                    <IoTrashOutline size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View (Hidden on small screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Chef Info</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Rating</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? <TableSkeleton /> : (
                currentItems.map((item: IChef) => (
                  <tr key={item._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative">
                          <Image src={item.image || "https://via.placeholder.com/150"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm uppercase tracking-tight">{item.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{item.designation}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                        <IoStarOutline /> {item.rating}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === "active" ? "bg-green-50 text-[#1A4E11]" : "bg-gray-100 text-gray-400"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button onClick={() => openEditModal(item)} className="p-2.5 text-gray-300 hover:text-[#1A4E11] hover:bg-gray-50 rounded-lg transition-all">
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

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50">
          <PaginationDashboard
            totalItems={chefs.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* --- Responsive Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeModal}></div>

          <div className="relative bg-white w-full h-full md:h-auto md:max-w-2xl shadow-2xl md:rounded-[40px] overflow-hidden transform transition-all flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-gray-50 bg-white shrink-0">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase italic">
                  {editId ? "Update Chef Profile" : "Add New Chef"}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Fill in the professional details
                </p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                <IoCloseOutline size={28} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 md:p-10 overflow-y-auto grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Photo Upload */}
                <div className="md:col-span-2 flex flex-col items-center mb-6">
                  <label className="relative w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#1A4E11] hover:bg-gray-50 overflow-hidden transition-all group shadow-inner bg-gray-50">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <IoImageOutline size={32} className="text-gray-300 group-hover:text-[#1A4E11]" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Browse Photo</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>

                {/* Input Fields */}
                {[
                  { label: "Name", value: name, setter: setName, placeholder: "e.g. Chef Saif" },
                  { label: "Designation", value: designation, setter: setDesignation, placeholder: "e.g. Executive Chef" },
                  { label: "Speciality", value: speciality, setter: setSpeciality, placeholder: "e.g. Italian Cuisine" },
                  { label: "Rating", value: rating, setter: setRating, placeholder: "5.0", type: "number" }
                ].map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">{field.label}</label>
                    <input
                      required
                      type={field.type || "text"}
                      step={field.type === "number" ? "0.1" : undefined}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#1A4E11] focus:bg-white text-sm font-bold transition-all"
                    />
                  </div>
                ))}

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Professional Bio</label>
                  <textarea
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell something about the chef's experience..."
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#1A4E11] focus:bg-white text-sm font-bold transition-all resize-none"
                  />
                </div>

                {/* Availability Status */}
                <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Availability Status</span>
                  <div className="flex w-full sm:w-auto gap-2">
                    {["active", "inactive"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[1px] transition-all ${status === s
                          ? "bg-[#1A4E11] text-white shadow-xl shadow-[#1A4E11]/20 scale-105"
                          : "bg-white text-gray-400 border border-gray-100"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-[#1A4E11] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[4px] shadow-2xl shadow-[#1A4E11]/30 mt-10 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {btnLoading ? "Processing..." : editId ? "Save Changes" : "Register Chef"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefPage;