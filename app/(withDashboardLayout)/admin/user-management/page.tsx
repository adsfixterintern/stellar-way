"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoTrashOutline,
  IoPersonOutline,
} from "react-icons/io5";
import api from "@/utils/apiInstance";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  //  fetch users with pagination
  const fetchUsers = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/auth/all-users?page=${pageNumber}&limit=${meta.limit}`
      );

      if (data.success) {
        setUsers(data.data);
        setMeta(data.meta);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [meta.limit]);

  useEffect(() => {
    fetchUsers(meta.page);
  }, [fetchUsers, meta.page]);

  // role change
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const { data } = await api.patch(`/auth/users/update-role/${id}`, {
        role: newRole,
      });

      if (data.success) {
        toast.success("Role updated successfully");
        fetchUsers(meta.page);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  //  delete user
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "User will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
      background: "#fff",
      customClass: {
        title: "font-black uppercase text-sm tracking-widest",
        htmlContainer: "text-xs font-bold text-gray-500",
        confirmButton: "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
        cancelButton: "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
      },
    });

    if (result.isConfirmed) {
      try {
        const { data } = await api.delete(`/auth/user/${id}`);

        if (data.success) {
          toast.success("User deleted successfully");

          //  Handle page transition if last item is deleted
          const nextPage =
            users.length === 1 && meta.page > 1
              ? meta.page - 1
              : meta.page;

          fetchUsers(nextPage);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
            User Management
          </h1>
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Manage Users, Roles & Permissions
            </p>
            <p className="text-[10px] text-[#1A4E11] font-black uppercase tracking-widest">
              Total Records: {meta.total}
            </p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  User Information
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                  System Role
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                  Account Status
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">
                  Manage
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {loading ? (
                
                    <TableSkeleton />
                  
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                    No users found in database
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors group">
                    {/* USER */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1A4E11]/5 flex items-center justify-center text-[#1A4E11]">
                          <IoPersonOutline size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-semibold tracking-tight">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="p-5 text-center">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider outline-none focus:border-[#1A4E11] transition-all cursor-pointer"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="rider">Rider</option>
                        <option value="chef">Chef</option>
                      </select>
                    </td>

                    {/* STATUS */}
                    <td className="p-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          user.status === "active"
                            ? "bg-green-50 text-[#1A4E11] border-green-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/20">
          <PaginationDashboard
            totalItems={meta.total}
            itemsPerPage={meta.limit}
            currentPage={meta.page}
            onPageChange={(page) => fetchUsers(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;