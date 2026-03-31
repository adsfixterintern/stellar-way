/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoLayersOutline,
  IoCloseOutline,
  IoReorderThreeOutline,
  IoCreateOutline
} from "react-icons/io5";
import Swal from "sweetalert2";

// API মডিউল ইমপোর্ট
import { 
  getAllCategoriesApi, 
  createCategoryApi, 
  updateCategoryApi, 
  deleteCategoryApi 
} from "@/app/modules/category/category.api";

interface Category {
  _id: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [catName, setCatName] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ডেটা ফেচিং
  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getAllCategoriesApi();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // মডাল কন্ট্রোল
  const openModal = (category: Category | null = null) => {
    if (category) {
      setIsEditMode(true);
      setSelectedId(category._id);
      setCatName(category.name);
      setSortOrder(category.sortOrder);
    } else {
      setIsEditMode(false);
      setSelectedId(null);
      setCatName("");
      setSortOrder(1);
    }
    setIsModalOpen(true);
  };

  // সাবমিট লজিক (Create/Update)
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const payload = { name: catName, sortOrder: Number(sortOrder) };

      let res;
      if (isEditMode && selectedId) {
        res = await updateCategoryApi(selectedId, payload);
      } else {
        res = await createCategoryApi(payload);
      }

      if (res.success) {
        toast.success(isEditMode ? "Category Updated!" : "Category Created!");
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  // ডিলিট লজিক
  const handleDelete = async (id: string): Promise<void> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Items in this category might be affected!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Delete!",
      customClass: { popup: "rounded-[30px]" },
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteCategoryApi(id);
        if (data.success) {
          toast.success("Category deleted");
          fetchCategories();
        }
      } catch (err: any) {
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <div className="bg-gray-50/30 min-h-screen w-full p-6 md:p-10 font-sans">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
            Categories
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[0.4em]">
            Manage your store classification
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#1A4E11] text-white px-8 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-green-900/10 active:scale-95"
        >
          <IoAddOutline size={20} /> Add New Category
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[35px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Order</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Created At</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-10 h-10 border-4 border-[#1A4E11] border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing Categories...</p>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400 font-black uppercase text-xs tracking-widest">No categories found.</td>
                </tr>
              ) : categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1A4E11] group-hover:bg-white group-hover:shadow-md transition-all">
                        <IoLayersOutline size={22} />
                      </div>
                      <span className="font-black text-gray-800 text-sm uppercase tracking-tight">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="inline-block px-4 py-1.5 bg-[#1A4E11]/5 rounded-xl text-[11px] font-black text-[#1A4E11] border border-[#1A4E11]/10">
                      {cat.sortOrder}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-gray-400 text-[11px] font-black uppercase">
                      <IoCalendarOutline size={14} /> {new Date(cat.createdAt).toLocaleDateString('en-GB')}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => openModal(cat)} 
                        className="p-3 text-gray-300 hover:text-[#1A4E11] hover:bg-green-50 rounded-2xl transition-all"
                      >
                        <IoCreateOutline size={22} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat._id)} 
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <IoTrashOutline size={22} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md shadow-2xl rounded-[40px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                  {isEditMode ? "Update Category" : "New Category"}
                </h2>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">Fill the details below</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-3 hover:bg-gray-100 rounded-full transition-all"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Category Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Traditional Burgers"
                    className="w-full border-2 border-gray-50 p-4 rounded-[20px] outline-none focus:border-[#1A4E11] focus:bg-white transition-all text-sm bg-gray-50 font-bold"
                  />
                  <IoLayersOutline className="absolute right-5 top-4.5 text-gray-300" size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Priority Order</label>
                <div className="relative">
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full border-2 border-gray-50 p-4 rounded-[20px] outline-none focus:border-[#1A4E11] focus:bg-white transition-all text-sm bg-gray-50 font-bold"
                  />
                  <IoReorderThreeOutline className="absolute right-5 top-4.5 text-gray-300" size={22} />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={btnLoading}
                  className="w-full bg-[#1A4E11] text-white py-5 rounded-[22px] font-black uppercase tracking-[0.2em] text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-900/20 disabled:bg-gray-200"
                >
                  {btnLoading ? "Processing..." : (isEditMode ? "Save Changes" : "Create Now")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;