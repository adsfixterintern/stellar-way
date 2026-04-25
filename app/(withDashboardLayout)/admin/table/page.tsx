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
  // Data fetching using React Query Hook
  const {
    data: tablesResponse,
    isLoading: tableLoading,
    refetch: refetchTables,
  } = useTables();

  const tables = tablesResponse?.data || [];

  // States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<ITable | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination Logic
  const currentItems = tables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
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
      text: "This table will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteTableApi(id);
        if (res.success) {
          toast.success("Table deleted successfully");
          refetchTables();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Table Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Total Tables: {tables.length}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 blockBtn px-6 py-3 bg-[#1A4E11] text-white rounded-xl font-bold transition-all hover:bg-opacity-90"
        >
          <IoAddOutline size={18} /> Add New Table
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Table Info</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Position</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Seats</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableLoading ? (
                <TableSkeleton />
              ) : tables.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px]">
                    No tables found
                  </td>
                </tr>
              ) : (
                currentItems.map((table: ITable) => (
                  <tr key={table._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative">
                          {table.image ? (
                            <Image src={table.image} alt={table.tableNumber} fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <IoImageOutline size={20} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">Table {table.tableNumber}</span>
                          <span className="text-[9px] text-gray-400 font-black uppercase truncate w-32">
                            {table.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {table.position}
                      </span>
                    </td>
                    <td className="p-5 text-center font-bold text-gray-700 text-sm">
                      {table.totalSeat} Persons
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest 
                        ${table.status === "available" ? "bg-green-50 text-[#1A4E11]" : 
                          table.status === "booked" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500"}`}>
                        {table.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button onClick={() => openEditModal(table)} className="p-2.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                        <IoCreateOutline size={20} />
                      </button>
                      <button onClick={() => handleDelete(table._id)} className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <IoTrashOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationDashboard
          totalItems={tables.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Table Modal (For Add/Edit) */}
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