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
  IoStarOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import Image from "next/image";

// Hooks & Interfaces
import { useChefs } from "@/app/hooks/useChefs";
import { IChef } from "@/types/menu";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

const ChefPage: React.FC = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // React Query Hook
  const { data: chefs = [], isLoading, refetch } = useChefs();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [speciality, setSpeciality] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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

      const url = editId
        ? `${BASE_URL}/chefs/${editId}`
        : `${BASE_URL}/chefs/create-chef`;
      const method = editId ? "patch" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(editId ? "Chef updated!" : "Chef added!");
        closeModal();
        refetch();
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log("Server Error Data:", err.response?.data); 
        toast.error(err.response?.data?.message || "Operation failed");
      }
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
        const { data } = await axios.delete(`${BASE_URL}/chefs/${id}`);
        if (data.success) {
          toast.success("Removed successfully");
          refetch();
        }
      } catch (err) {
        console.log(err);
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Chef Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Team Overview
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 blockBtn"
        >
          <IoAddOutline size={18} /> Add New Chef
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Chef Info
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                  Rating
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Status
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <TableSkeleton />
              ) : (
                chefs.map((item: IChef) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/30 transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative">
                          <Image
                            src={
                              item.image || "https://via.placeholder.com/150"
                            }
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {item.designation}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                        <IoStarOutline /> {item.rating}
                      </span>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === "active" ? "bg-green-50 text-[#1A4E11]" : "bg-gray-100 text-gray-400"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <IoCreateOutline size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <IoTrashOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-2xl overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-white">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  {editId ? "Update Chef Profile" : "Add New Chef"}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                  Fill in the professional details
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 flex flex-col items-center mb-4">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">
                    Profile Photo
                  </label>
                  <label className="relative w-28 h-28 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#1A4E11] hover:bg-gray-50 overflow-hidden transition-all group">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <IoImageOutline
                          size={30}
                          className="text-gray-300 group-hover:text-[#1A4E11]"
                        />
                        <span className="text-[8px] font-black text-gray-400 uppercase">
                          Browse
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Input Fields */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
                    Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chef Saif"
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] focus:bg-white text-sm font-bold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
                    Designation
                  </label>
                  <input
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Executive Chef"
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] focus:bg-white text-sm font-bold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
                    Speciality
                  </label>
                  <input
                    required
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    placeholder="e.g. Italian Cuisine"
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] focus:bg-white text-sm font-bold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] focus:bg-white text-sm font-bold transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">
                    Professional Bio
                  </label>
                  <textarea
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell something about the chef's experience..."
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] focus:bg-white text-sm font-bold transition-all resize-none"
                  />
                </div>

                {/* Status Toggle */}
                <div className="md:col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Availability Status
                  </span>
                  <div className="flex gap-2">
                    {["active", "inactive"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-[1px] transition-all ${
                          status === s
                            ? "bg-[#1A4E11] text-white shadow-lg shadow-[#1A4E11]/20 scale-105"
                            : "bg-white text-gray-400 hover:text-gray-600"
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
                className="w-full bg-[#1A4E11] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[3px] shadow-2xl shadow-[#1A4E11]/30 mt-8 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {btnLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : editId ? (
                  "Save Changes"
                ) : (
                  "Register Chef"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefPage;
