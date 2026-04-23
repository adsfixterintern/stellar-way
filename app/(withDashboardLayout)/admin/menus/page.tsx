/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoImageOutline,
  IoCreateOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
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

  // React Query Hooks (Data fetching)
  const {
    data: menus = [],
    isLoading: menuLoading,
    refetch: refetchMenus,
  } = useMenu();
  const { data: categories = [] } = useCategories();
  const { data: chefs = [] } = useChefs();

  // Component States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination Logic
  const currentItems = menus.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Modal Handlers
  const openEditModal = (menu: IMenu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedMenu(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
  };

  // Delete Handler
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
        console.error("Delete Error:", err);
        const errorMessage = err.response?.data?.message || "Delete failed";
        toast.error(errorMessage);
      }
    }
  };
  return (
    <div className="w-full">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Menu Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Total Items: {menus.length}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 blockBtn px-6 py-3 bg-[#1A4E11] text-white rounded-xl font-bold transition-all hover:bg-opacity-90"
        >
          <IoAddOutline size={18} /> Add New Menu
        </button>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Price</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Stock</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {menuLoading ? (
                <TableSkeleton />
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px]">
                    No menus found
                  </td>
                </tr>
              ) : (
                currentItems.map((item: IMenu) => (
                  <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative">
                          {item.image?.url ? (
                            <Image src={item.image.url} alt={item.title} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <IoImageOutline size={20} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                          <span className="text-[9px] text-gray-400 font-black uppercase truncate w-32">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-gray-700 text-sm">৳{item.price}</td>
                    <td className="p-5 text-center">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.stock < 10 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500"}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === "active" ? "bg-green-50 text-[#1A4E11]" : "bg-gray-100 text-gray-400"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button onClick={() => openEditModal(item)} className="p-2.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
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

        {/* --- Pagination --- */}
        <PaginationDashboard
          totalItems={menus.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* --- Reusable Modal --- */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={selectedMenu}
        categories={categories}
        chefs={chefs}
        onSuccess={refetchMenus}
      />
    </div>
  );
};

export default MenuPage;