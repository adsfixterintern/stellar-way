"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoImageOutline,
  IoPersonOutline,
  IoCreateOutline,
  IoStarOutline,
  IoBriefcaseOutline,
  IoInformationCircleOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";

// --- Interfaces ---
interface Chef {
  _id: string;
  name: string;
  designation: string;
  bio: string;
  speciality: string;
  rating: number;
  status: "active" | "inactive";
  image?: string;
}

const ChefPage: React.FC = () => {
  const BASE_URL = "http://localhost:8000/api/v1";

  // List States
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

 
  const fetchChefs = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/chefs`);
      if (data.success) {
        setChefs(data.data);
      }
    } catch (err: any) {
      toast.error("Failed to load chefs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  // ২. ইমেজ প্রিভিউ হ্যান্ডলার
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };


  const openEditModal = (chef: Chef) => {
    setEditId(chef._id); 
    setName(chef.name);
    setDesignation(chef.designation);
    setBio(chef.bio);
    setSpeciality(chef.speciality);
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

  //(Create vs Update Logic)
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      let response;

      // ১. যদি নতুন ছবি (imageFile) সিলেক্ট করা থাকে
      if (imageFile) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("designation", designation);
        formData.append("bio", bio);
        formData.append("speciality", speciality);
        formData.append("rating", rating);
        formData.append("status", status);
        formData.append("image", imageFile);

        if (editId) {
          response = await axios.patch(
            `${BASE_URL}/chefs/${editId}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        } else {
          response = await axios.post(
            `${BASE_URL}/chefs/create-chef`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        }
      }
      // ২. যদি ছবি না থাকে (Postman এ আমরা যেভাবে JSON পাঠাই)
      else {
        const payload = {
          name,
          designation,
          bio,
          speciality,
          rating: Number(rating),
          status,
        };

        if (editId) {
          // এটি সরাসরি JSON পাঠাবে, যা ব্যাকএন্ড সহজে আপডেট করতে পারবে
          response = await axios.patch(`${BASE_URL}/chefs/${editId}`, payload);
        } else {
          response = await axios.post(`${BASE_URL}/chefs/create-chef`, payload);
        }
      }

      if (response.data.success) {
        toast.success(
          editId ? "Chef updated successfully!" : "Chef added successfully!",
        );
        closeModal();
        fetchChefs();
      }
    } catch (err: any) {
      console.error("Update Error Payload:", err.response?.data);
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete",
      customClass: { popup: "rounded-[12px]" },
    });

    if (result.isConfirmed) { try {
        const { data } = await axios.delete(`${BASE_URL}/chefs/${id}`);
        if (data.success) {
          toast.success("Chef removed");
          setChefs((prev) => prev.filter((item) => item._id !== id));
        }
      } catch (err) {
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
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A4E11] text-white px-6 py-3.5 rounded-[8px] font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-[#1A4E11]/10"
        >
          <IoAddOutline size={18} /> Add New Chef
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Chef Info
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Speciality
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
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest animate-pulse"
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                chefs.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/30 transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                          <img
                            src={
                              item.image || "https://via.placeholder.com/150"
                            }
                            className="w-full h-full object-cover"
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
                    <td className="p-5 font-bold text-gray-700 text-sm">
                      {item.speciality}
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

      {/* --- Add/Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-[12px] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-900">
                {editId ? "Update Chef Profile" : "Add New Chef"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex justify-center mb-4">
                  <label className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden group">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IoImageOutline size={30} className="text-gray-200" />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Designation
                  </label>
                  <input
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Speciality
                  </label>
                  <input
                    required
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Bio
                  </label>
                  <textarea
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold resize-none"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    Status:
                  </span>
                  <div className="flex gap-2">
                    {["active", "inactive"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s as any)}
                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${status === s ? "bg-[#1A4E11] text-white shadow-md" : "bg-gray-100 text-gray-400"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={btnLoading}
                  className="w-full bg-[#1A4E11] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[2px] shadow-xl shadow-[#1A4E11]/20"
                >
                  {btnLoading
                    ? "Processing..."
                    : editId
                      ? "Confirm Update"
                      : "Save Chef"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefPage;
