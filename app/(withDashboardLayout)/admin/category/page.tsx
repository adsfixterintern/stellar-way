
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  IoAddOutline,
  IoCreateOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from "react-icons/io5";

import { 
  getAllCategoriesForAdminApi, 
  createCategoryApi, 
  updateCategoryApi 
} from "@/app/modules/category/category.api";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [catName, setCatName] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [status, setStatus] = useState<string>("active"); 
  
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

 
  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getAllCategoriesForAdminApi();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err: any) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // স্ট্যাটাস টগল করার ফাংশন (Active <-> Inactive)
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await updateCategoryApi(id, { status: newStatus });
      if (res.success) {
        toast.success(`Category is now ${newStatus}`);
        fetchCategories();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const openModal = (category: any | null = null) => {
    if (category) {
      setIsEditMode(true);
      setSelectedId(category._id);
      setCatName(category.name);
      setSortOrder(category.sortOrder);
      setStatus(category.status);
    } else {
      setIsEditMode(false);
      setCatName("");
      setSortOrder(1);
      setStatus("active");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const payload = { name: catName, sortOrder: Number(sortOrder), status };
      let res;
      if (isEditMode && selectedId) {
        res = await updateCategoryApi(selectedId, payload);
      } else {
        res = await createCategoryApi(payload);
      }

      if (res.success) {
        toast.success(isEditMode ? "Updated!" : "Created!");
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/30 min-h-screen w-full p-6 md:p-10 font-sans">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Categories</h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[0.4em]">Admin Management</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#1A4E11] text-white px-8 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest shadow-xl">
          <IoAddOutline size={20} /> Add New Category
        </button>
      </div>

      <div className="bg-white rounded-[35px] border border-gray-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Name</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Order</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
              <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat._id} className={`hover:bg-gray-50/50 transition-all ${cat.status === 'inactive' ? 'opacity-60' : ''}`}>
                <td className="p-6">
                   <span className="font-black text-gray-800 text-sm uppercase tracking-tight">{cat.name}</span>
                </td>
                <td className="p-6 text-center font-bold text-gray-500">{cat.sortOrder}</td>
                <td className="p-6 text-center">
                   <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${cat.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {cat.status}
                   </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Toggle Status Button */}
                    <button 
                      onClick={() => handleToggleStatus(cat._id, cat.status)} 
                      className={`p-3 rounded-2xl transition-all ${cat.status === 'active' ? 'text-gray-300 hover:text-red-500 hover:bg-red-50' : 'text-gray-300 hover:text-green-600 hover:bg-green-50'}`}
                      title={cat.status === 'active' ? 'Hide Category' : 'Show Category'}
                    >
                      {cat.status === 'active' ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
                    </button>
                    <button onClick={() => openModal(cat)} className="p-3 text-gray-300 hover:text-[#1A4E11] hover:bg-green-50 rounded-2xl transition-all">
                      <IoCreateOutline size={22} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal with Status Selection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8">
            <h2 className="text-xl font-black uppercase italic mb-6">{isEditMode ? "Edit" : "New"} Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Name</label>
                <input type="text" required value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full border-2 border-gray-50 p-4 rounded-[20px] outline-none focus:border-[#1A4E11] font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Order</label>
                  <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full border-2 border-gray-50 p-4 rounded-[20px] outline-none focus:border-[#1A4E11] font-bold" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border-2 border-gray-50 p-4 rounded-[20px] outline-none focus:border-[#1A4E11] font-black text-[10px] uppercase">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button disabled={btnLoading} className="w-full bg-[#1A4E11] text-white py-5 rounded-[22px] font-black uppercase tracking-widest text-[11px] mt-4">
                {btnLoading ? "Processing..." : "Save Category"}
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-400 font-black uppercase text-[10px] tracking-widest mt-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;