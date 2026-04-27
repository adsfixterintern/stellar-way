/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoImageOutline,
  IoCreateOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import Image from "next/image";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import { ITable } from "@/app/modules/table/table.interface";
import { deleteTableApi } from "@/app/modules/table/table.api";
import { TableModal } from "@/components/admin-dashboard/TableModal";
import { useTables } from "@/app/hooks/useTables";

const TablePage: React.FC = () => {
  const {
    data: tablesResponse,
    isLoading: tableLoading,
    refetch: refetchTables,
  } = useTables();

  const tables = tablesResponse?.data || [];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<ITable | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentItems = tables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const openEditModal = (table: ITable) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedTable(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Permanent action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Delete",
      customClass: { popup: 'rounded-2xl' }
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteTableApi(id);
        if (res.success) {
          toast.success("Deleted successfully");
          refetchTables();
        }
      } catch (err: any) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto  min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-[#1A4E11] tracking-tighter uppercase italic">
            Tables List
          </h1>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[3px]">
            Capacity: {tables.length} Total Tables
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#1A4E11] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#1A4E11]/20 active:scale-95 transition-all"
        >
          <IoAddOutline size={20} /> Add New Table
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="p-6">Information</th>
                <th className="p-6">Position</th>
                <th className="p-6 text-center">Capacity</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableLoading ? (
                <TableSkeleton />
              ) : tables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest">No Tables Available</td>
                </tr>
              ) : (
                currentItems.map((table: ITable) => (
                  <tr key={table._id} className="hover:bg-[#F9FBFA] transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 overflow-hidden relative shadow-sm">
                          {table.image ? (
                            <Image src={table.image} alt={table.tableNumber} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                              <IoImageOutline size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 text-sm uppercase">Table {table.tableNumber}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase truncate max-w-[150px]">{table.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[9px] font-black uppercase text-gray-500 bg-gray-50 px-3 py-1 rounded-lg tracking-wider">
                        {table.position}
                      </span>
                    </td>
                    <td className="p-6 text-center font-black text-gray-700 text-xs uppercase tracking-tighter">
                      {table.totalSeat} Seats
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest 
                        ${table.status === "available" ? "bg-green-50 text-green-600" : 
                          table.status === "booked" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}>
                        {table.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => openEditModal(table)} className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-400 hover:text-[#1A4E11] rounded-xl transition-all">
                          <IoCreateOutline size={20} />
                        </button>
                        <button onClick={() => handleDelete(table._id)} className="w-10 h-10 flex items-center justify-center bg-white shadow-sm text-gray-400 hover:text-red-500 rounded-xl transition-all">
                          <IoTrashOutline size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Card Layout) */}
        <div className="md:hidden divide-y divide-gray-50">
          {!tableLoading && currentItems.map((table: ITable) => (
            <div key={table._id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-xl bg-gray-50 relative overflow-hidden">
                      {table.image && <Image src={table.image} alt={table.tableNumber} fill className="object-cover" />}
                   </div>
                   <div>
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Table {table.tableNumber}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{table.position}</p>
                   </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${table.status === "available" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                  {table.status}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-medium bg-gray-50 p-4 rounded-xl italic">{table.description}</p>
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{table.totalSeat} Persons Capacity</span>
                 <div className="flex gap-2">
                    <button onClick={() => openEditModal(table)} className="p-3 bg-blue-50 text-blue-600 rounded-xl"><IoCreateOutline size={18} /></button>
                    <button onClick={() => handleDelete(table._id)} className="p-3 bg-red-50 text-red-500 rounded-xl"><IoTrashOutline size={18} /></button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white">
          <PaginationDashboard
            totalItems={tables.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      <TableModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editData={selectedTable}
        onSuccess={refetchTables}
      />
    </div>
  );
};

export default TablePage;