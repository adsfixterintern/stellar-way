"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCalendarOutline,
  IoLayersOutline,
  IoCloseOutline,
  IoReorderThreeOutline,
  IoCreateOutline // এডিট আইকন
} from "react-icons/io5";
import Swal from "sweetalert2";

interface Category {
  _id: string;
  name: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface FetchResponse {
  success: boolean;
  message: string;
  data: Category[];
}

const CategoryPage: React.FC = () => {
  const BASE_URL = "http://localhost:8000/api/v1";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [catName, setCatName] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(1);
  
  // নতুন স্টেট আপডেট করার জন্য
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await axios.get<FetchResponse>(`${BASE_URL}/categories`);
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

  // মডাল খোলার ফাংশন (Add এবং Update দুটোর জন্যই)
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

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const payload = {
        name: catName,
        sortOrder: Number(sortOrder),
      };

      let res;
      if (isEditMode && selectedId) {
        // আপডেট রিকোয়েস্ট
        res = await axios.patch(`${BASE_URL}/categories/${selectedId}`, payload);
      } else {
        // ক্রিয়েট রিকোয়েস্ট
        res = await axios.post(`${BASE_URL}/categories/create-category`, payload);
      }

      if (res.data.success) {
        toast.success(isEditMode ? "Updated successfully!" : "Created successfully!");
        setIsModalOpen(false);
        fetchCategories();
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
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: { popup: "rounded-2xl" },
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(`${BASE_URL}/categories/${id}`);
        if (data.success) {
          toast.success("Category deleted");
          fetchCategories();
        }
      } catch (err: any) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen w-full font-sans p-4 md:p-8">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Category Management</h1>
            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Organize your menu items</p>
          </div>
          <button
            onClick={() => openModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A4E11] text-white px-6 py-3.5 rounded-[8px] cursor-pointer font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
          >
            <IoAddOutline size={18} /> Add Category
          </button>
        </div>

        <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Name</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Sort Order</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                 <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Update</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading...</td>
                  </tr>
                ) : categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1A4E11]/5 flex items-center justify-center text-[#1A4E11]"><IoLayersOutline size={20} /></div>
                        <span className="font-bold text-gray-800 text-sm">{cat.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[11px] font-bold text-gray-600">{cat.sortOrder}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                        <IoCalendarOutline /> {new Date(cat.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {/* আপডেট বাটন */}
                        <button 
                          onClick={() => openModal(cat)} 
                          className="p-2.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <IoCreateOutline size={20} />
                        </button>
                        {/* ডিলিট বাটন */}
                        <button 
                          onClick={() => handleDelete(cat._id)} 
                          className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md shadow-2xl rounded-[10px] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {isEditMode ? "Update Category" : "Add Category"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all"><IoCloseOutline size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Italian Pizza"
                    className="w-full border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#1A4E11] transition-all text-sm bg-gray-50 focus:bg-white font-semibold"
                  />
                  <IoLayersOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Sort Order</label>
                <div className="relative">
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full border border-gray-100 p-4 rounded-2xl outline-none focus:border-[#1A4E11] transition-all text-sm bg-gray-50 focus:bg-white font-semibold"
                  />
                  <IoReorderThreeOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={btnLoading}
                  className="w-full bg-[#1A4E11] text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {btnLoading ? "Processing..." : (isEditMode ? "Update Category" : "Create Category")}
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