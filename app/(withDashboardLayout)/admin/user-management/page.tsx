"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoTrashOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoFilterOutline,
} from "react-icons/io5";
import api from "@/utils/apiInstance";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });

  // Fetch Users Function
  const fetchUsers = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);

      // কুয়েরি প্যারামিটার তৈরি
      const params = new URLSearchParams();
      params.append("page", pageNumber.toString());
      params.append("limit", meta.limit.toString());
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (roleFilter) params.append("role", roleFilter);

      const { data } = await api.get(`/auth/all-users?${params.toString()}`);

      if (data.success) {
        setUsers(data.data);
        setMeta(data.meta);
      
        setCurrentPage(data.meta.page);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [meta.limit, searchTerm, roleFilter]); 


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(1); 
    }, 500); 

    return () => clearTimeout(handler);
  }, [searchTerm, roleFilter, fetchUsers]);


  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
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
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await api.delete(`/auth/user/${id}`);
        if (data.success) {
          toast.success("User deleted successfully");
        
          const nextPage = users.length === 1 && meta.page > 1 ? meta.page - 1 : meta.page;
          fetchUsers(nextPage);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
            User Management
          </h1>
          <p className="text-[10px] text-[#1A4E11] font-black uppercase tracking-widest mt-1">
            Total Records: {meta.total}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
          {/* সার্চ ইনপুট */}
          <div className="relative grow sm:w-64">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-bold outline-none focus:border-[#1A4E11] shadow-sm transition-all"
            />
          </div>

          {/* রোল ফিল্টার */}
          <div className="relative sm:w-44">
            <IoFilterOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[11px] font-black uppercase tracking-wider outline-none focus:border-[#1A4E11] shadow-sm cursor-pointer appearance-none"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="rider">Rider</option>
              <option value="chef">Chef</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">User Info</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Role</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                    No users found matching filters
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1A4E11]/5 flex items-center justify-center text-[#1A4E11]">
                          <IoPersonOutline size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                          <span className="text-[11px] text-gray-400 font-semibold">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase outline-none focus:border-[#1A4E11]"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="rider">Rider</option>
                        <option value="chef">Chef</option>
                      </select>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        user.status === "active" ? "bg-green-50 text-[#1A4E11] border-green-100" : "bg-red-50 text-red-500 border-red-100"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button onClick={() => handleDelete(user._id)} className="p-2.5 text-gray-300 hover:text-red-500 transition-all">
                        <IoTrashOutline size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50/20">
          <PaginationDashboard
            totalItems={meta.total}
            itemsPerPage={meta.limit}
            currentPage={meta.page}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;

