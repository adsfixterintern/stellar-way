/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  IoAddOutline,
  IoCreateOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCloseOutline,
} from "react-icons/io5";

import {
  getAllCategoriesForAdminApi,
  createCategoryApi,
  updateCategoryApi,
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
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
    <div className="min-h-screen w-full">

      {/* Header Area */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-black text-[#1A4E11] uppercase italic tracking-tighter">
            Category List
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[3px] mt-1">
            Management Hub
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#1A4E11] text-white px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
        >
          <IoAddOutline size={20} /> Add New
        </button>
      </div>

      {/* Content Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="p-10 text-center font-black text-gray-300 animate-pulse uppercase tracking-[5px]">
            Loading Data...
          </div>
        )}

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-50">
          {!loading &&
            categories.map((cat) => (
              <div key={cat._id} className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-gray-800 text-sm uppercase">
                    {cat.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded text-[8px] font-black uppercase ${cat.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {cat.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400">
                    Order: {cat.sortOrder}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(cat)}
                      className="p-2.5 bg-gray-50 text-gray-400 rounded-lg"
                    >
                      <IoCreateOutline size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(cat._id, cat.status)}
                      className="p-2.5 bg-gray-50 text-gray-400 rounded-lg"
                    >
                      <IoEyeOutline size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Desktop View */}
        {!loading && (
          <div className="hidden md:block">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="p-6">Name</th>
                  <th className="p-6 text-center">Sort Order</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-gray-50/50 transition-all group"
                  >
                    <td className="p-6">
                      <span className="font-black text-gray-800 text-sm uppercase tracking-tight">
                        {cat.name}
                      </span>
                    </td>
                    <td className="p-6 text-center font-bold text-gray-500">
                      {cat.sortOrder}
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${cat.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() =>
                            handleToggleStatus(cat._id, cat.status)
                          }
                          className="w-10 h-10 flex items-center justify-center bg-white shadow-sm rounded-xl text-gray-400 hover:text-[#1A4E11] transition-all"
                        >
                          {cat.status === "active" ? (
                            <IoEyeOutline size={18} />
                          ) : (
                            <IoEyeOffOutline size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => openModal(cat)}
                          className="w-10 h-10 flex items-center justify-center bg-white shadow-sm rounded-xl text-gray-400 hover:text-[#1A4E11] transition-all"
                        >
                          <IoCreateOutline size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compact & Clean Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 flex justify-between items-center bg-white">
              <h2 className="text-xl font-black text-[#1A4E11] uppercase italic tracking-tight">
                {isEditMode ? "Update" : "Create"} Category
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <IoCloseOutline size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:bg-white focus:shadow-md transition-all font-bold text-sm"
                  placeholder="e.g. Sea Food"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:bg-white focus:shadow-md transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-gray-300 ml-1 tracking-widest">
                    Visibility Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-gray-50 p-4 rounded-xl outline-none focus:bg-white focus:shadow-md transition-all font-black text-[10px] uppercase appearance-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={btnLoading}
                  className="w-full bg-[#1A4E11] text-white py-4 rounded-xl font-black uppercase tracking-[4px] text-[10px] shadow-xl shadow-[#1A4E11]/20 active:scale-95 transition-all disabled:bg-gray-300"
                >
                  {btnLoading ? "Processing..." : "Confirm & Save"}
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
