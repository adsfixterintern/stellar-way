/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoImageOutline,
  IoCreateOutline,
  IoSearchOutline,
  IoFilterOutline
} from "react-icons/io5";
import Swal from "sweetalert2";
import { matchSorter } from "match-sorter";
import { useMenu } from "@/app/hooks/useMenu";
import { useCategories } from "@/app/hooks/useCategories";
import { useChefs } from "@/app/hooks/useChefs";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import { MenuModal } from "@/components/admin-dashboard/MenuModal";
import { deleteMenuFromDB } from "@/app/modules/menu/menu.api";

const MenuPage: React.FC = () => {
  // Data fetching
  const { data: menus = [], isLoading: menuLoading, refetch: refetchMenus } = useMenu();
  const { data: categories = [] } = useCategories();
  const { data: chefs = [] } = useChefs();

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Component States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Filtering Logic (Updated to use categoryId) ---
  const filteredMenus = useMemo(() => {
    let filtered = menus;

    // ১. ক্যাটাগরি ফিল্টার (categoryId._id দিয়ে চেক)
    if (selectedCategory !== "all") {
      filtered = menus.filter((m: any) => m.categoryId?._id === selectedCategory);
    }

    // ২. সার্চ (Title দিয়ে)
    if (!searchQuery) return filtered;
    return matchSorter(filtered, searchQuery, { keys: ["title"] });
  }, [menus, searchQuery, selectedCategory]);

  // Pagination
  const currentItems = filteredMenus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Item will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteMenuFromDB(id);
        if (data.success) {
          toast.success("Deleted successfully");
          refetchMenus();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="w-full">
      {/* --- Header & Search/Filter Section --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic uppercase">
            Menu Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[0.3em]">
            Showing {filteredMenus.length} of {menus.length} Items
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search food title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-[#1A4E11] transition-all shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative sm:w-48">
            <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { setSelectedMenu(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1A4E11] text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs uppercase"
          >
            <IoAddOutline size={20} /> Add New
          </button>
        </div>
      </div>

      {/* --- Main Table/Card Container --- */}
      <div className="bg-white rounded-2xl md:rounded-[15px] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-gray-50">
          {menuLoading ? (
             <div className="p-10 text-center text-xs font-bold text-gray-400">Loading Menus...</div>
          ) : filteredMenus.length === 0 ? (
            <div className="p-10 text-center text-[10px] font-black uppercase text-gray-300">No items found matching filter</div>
          ) : (
            currentItems.map((item: any) => (
              <div key={item._id} className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden relative border border-gray-50 shrink-0">
                    <Image src={item.image?.url || ""} alt="" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[10px] font-black text-[#1A4E11]">৳{item.price}</span>
                       {/* Updated Display for Mobile */}
                       <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 font-bold uppercase">
                          {item.categoryId?.name || "No Category"}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => { setSelectedMenu(item); setIsModalOpen(true); }} className="flex-1 py-2.5 bg-gray-50 text-gray-400 rounded-lg font-bold text-[10px] uppercase flex justify-center items-center gap-1">
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

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Category</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Price</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Stock</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {menuLoading ? <TableSkeleton /> : (
                currentItems.map((item: any) => (
                  <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 relative shrink-0 bg-gray-50">
                          <Image src={item.image?.url || ""} alt="" fill className="object-cover" />
                        </div>
                        <span className="font-bold text-gray-800 text-sm uppercase tracking-tight">{item.title}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                       {/* Updated Display for Desktop Table */}
                       <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                         {item.categoryId?.name || "N/A"}
                       </span>
                    </td>
                    <td className="p-5 font-bold text-gray-700 text-sm">৳{item.price}</td>
                    <td className="p-5 text-center">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.stock < 10 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500"}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button onClick={() => { setSelectedMenu(item); setIsModalOpen(true); }} className="p-2.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
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

        {/* Pagination Section */}
        <div className="p-4 border-t border-gray-50">
          <PaginationDashboard
            totalItems={filteredMenus.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Menu Edit/Add Modal */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={selectedMenu}
        categories={categories}
        chefs={chefs}
        onSuccess={refetchMenus}
      />
    </div>
  );
};

export default MenuPage;