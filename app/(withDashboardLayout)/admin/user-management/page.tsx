/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoTrashOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import api from "@/utils/apiInstance";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  const fetchUsers = useCallback(
    async (pageNumber = 1) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", pageNumber.toString());
        params.append("limit", meta.limit.toString());
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (roleFilter) params.append("role", roleFilter);

        const { data } = await api.get(`/auth/all-users?${params.toString()}`);
        if (data.success) {
          setUsers(data.data);
          setMeta(data.meta);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    },
    [meta.limit, searchTerm, roleFilter],
  );

  useEffect(() => {
    const handler = setTimeout(() => fetchUsers(1), 500);
    return () => clearTimeout(handler);
  }, [searchTerm, roleFilter, fetchUsers]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { data } = await api.patch(`/auth/users/update-status/${id}`, {
        status: newStatus,
      });
      if (data.success) {
        toast.success(`User status updated to ${newStatus}`);
        fetchUsers(meta.page);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

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

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "User will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#f1f1f1",
      confirmButtonText: "Yes, delete",
      customClass: { popup: "rounded-2xl" },
    });

    if (result.isConfirmed) {
      try {
        const { data } = await api.delete(`/auth/user/${id}`);
        if (data.success) {
          toast.success("User deleted successfully");
          fetchUsers(
            users.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page,
          );
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 md:py-10 min-h-screen">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
            User Controls
          </h1>
          <p className="text-[10px] text-[#1A4E11] font-black uppercase tracking-[3px] mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#1A4E11] rounded-full animate-pulse"></span>
            Active Accounts: {meta.total}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          <div className="relative group flex-1 sm:w-72">
            <IoSearchOutline
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-xs font-bold outline-none shadow-sm border border-transparent focus:border-[#1A4E11]/20 transition-all"
            />
          </div>

          <div className="relative sm:w-48">
            <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none shadow-sm appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="rider">Rider</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA CONTENT */}
      <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden border border-gray-50">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden lg:block">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <th className="p-6">User Identity</th>
                <th className="p-6 text-center">System Role</th>
                <th className="p-6 text-center">Account Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton />
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/30 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1A4E11] group-hover:text-white transition-all overflow-hidden border border-gray-100">
                          {user?.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <IoPersonOutline size={20} />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-gray-800 text-sm uppercase italic">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                            <IoMailOutline /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter outline-none focus:ring-2 ring-[#1A4E11]/5"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="rider">Rider</option>
                        <option value="chef">Chef</option>
                      </select>
                    </td>
                    <td className="p-6 text-center">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value)
                        }
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${
                          user.status === "active"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="w-10 h-10 inline-flex items-center justify-center text-gray-300 hover:text-red-500 bg-white border border-gray-100 rounded-xl shadow-sm transition-all"
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

        {/* MOBILE CARD VIEW */}
        <div className="lg:hidden">
          <div className="max-h-[65vh] overflow-y-auto divide-y divide-gray-50 scrollbar-hide">
            {loading ? (
              <TableSkeleton />
            ) : (
              users.map((user) => (
                <div key={user._id} className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#1A4E11]">
                        <IoPersonOutline size={18} />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-800 text-sm uppercase italic leading-none">
                          {user.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 lowercase">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <IoTrashOutline size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        Access Level
                      </span>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-100 p-2 rounded-xl text-[10px] font-black uppercase outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="rider">Rider</option>
                        <option value="chef">Chef</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        Status
                      </span>
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value)
                        }
                        className={`p-2 rounded-xl text-[10px] font-black uppercase outline-none border ${
                          user.status === "active"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : "bg-red-50 text-red-500 border-red-100"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="p-6 bg-gray-50/30 border-t border-gray-50">
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
