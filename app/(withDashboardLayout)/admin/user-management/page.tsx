"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoTrashOutline,
  IoPersonOutline,
} from "react-icons/io5";
import api from "@/utils/apiInstance";

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  // ✅ fetch users with pagination
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/auth/all-users?page=${page}&limit=${meta.limit}`
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
  };

  useEffect(() => {
    fetchUsers(meta.page);
  }, []);

  // ✅ role change
  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const { data } = await api.patch(`/auth/users/update-role/${id}`, {
        role: newRole,
      });

      if (data.success) {
        toast.success("Role updated");
        fetchUsers(meta.page);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  // ✅ delete user
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "User will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await api.delete(`/auth/user/${id}`);

        if (data.success) {
          toast.success("User deleted");

          // 🔥 edge case handle
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
      
      {/* ✅ HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Manage Users, Roles & Permissions
          </p>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Total Users: {meta.total}
          </p>
        </div>
      </div>

      {/* ✅ TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-200">
            
            {/* HEADER */}
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  User
                </th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                  Role
                </th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                  Status
                </th>
                <th className="p-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors group">
                    
                    {/* USER */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <IoPersonOutline />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-semibold">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="p-4 text-center">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg text-xs font-bold"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="rider">Rider</option>
                        <option value="chef">Chef</option>
                      </select>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          user.status === "active"
                            ? "bg-green-50 text-[#1A4E11]"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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

        {/* ✅ PAGINATION */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Page {meta.page} of {meta.totalPage}
          </p>

          <div className="flex gap-2">
            <button
              disabled={meta.page === 1}
              onClick={() => fetchUsers(meta.page - 1)}
              className="flex items-center gap-1 px-3 py-2 text-[10px] font-black uppercase bg-white border border-gray-200 rounded-lg disabled:opacity-30 hover:border-[#1A4E11] hover:text-[#1A4E11] transition-all"
            >
              Prev
            </button>

            <button
              disabled={meta.page >= meta.totalPage}
              onClick={() => fetchUsers(meta.page + 1)}
              className="flex items-center gap-1 px-3 py-2 text-[10px] font-black uppercase bg-white border border-gray-200 rounded-lg disabled:opacity-30 hover:border-[#1A4E11] hover:text-[#1A4E11] transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;