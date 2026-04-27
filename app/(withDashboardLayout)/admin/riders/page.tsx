/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  getAllRidersApi, 
  approveRiderApi, 
  rejectRiderApi, 
  deleteRiderApi 
} from "@/app/modules/rider/rider.api";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import Image from "next/image";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline,
  IoTrashOutline 
} from "react-icons/io5";

const RidersPage = () => {
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRiders = async () => {
    setLoading(true);
    try {
      const res = await getAllRidersApi();
      if (res.success) {
        setRiders(res.data);
      }
    } catch (error: any) {
      toast.error("Failed to load riders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  // ১. এপ্রুভ হ্যান্ডলার
  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: "Approve Rider?",
      text: "This user will be granted rider access.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, Approve",
    });

    if (result.isConfirmed) {
      setBtnLoading(id);
      try {
        const res = await approveRiderApi(id);
        if (res.success) {
          toast.success("Rider Approved Successfully!");
          fetchRiders();
        }
      } catch (error: any) {
        toast.error("Approval failed");
      } finally {
        setBtnLoading(null);
      }
    }
  };

 
  const handleReject = async (id: string) => {
    const result = await Swal.fire({
      title: "Reject Rider?",
      text: "This application will be rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Reject",
    });

    if (result.isConfirmed) {
      setBtnLoading(id);
      try {
        const res = await rejectRiderApi(id);
        if (res.success) {
          toast.success("Rider Rejected Successfully!");
          fetchRiders();
        }
      } catch (error: any) {
        toast.error("Rejection failed");
      } finally {
        setBtnLoading(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Rider application will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteRiderApi(id);
        if (res.success) {
          toast.success("Deleted successfully");
          fetchRiders();
        }
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredRiders = riders.filter((rider: any) => {
    if (statusFilter === "all") return true;
    return rider.status === statusFilter;
  });

  const currentItems = filteredRiders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Rider Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Total Applicants: {filteredRiders.length}
          </p>
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          {["all", "pending", "active", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[1.5px] transition-all ${
                statusFilter === status
                  ? "bg-[#1A4E11] text-white shadow-lg shadow-[#1A4E11]/20"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {status === "active" ? "approved" : status} 
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Rider / Profile
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Vehicle & Area
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Status
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <TableSkeleton />
              ) : filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-300 font-black uppercase text-[10px] tracking-widest">
                    No riders found
                  </td>
                </tr>
              ) : (
                currentItems.map((item: any) => (
                  <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 overflow-hidden relative">
                          {item.userId?.image ? (
                            <Image src={item.userId.image} alt={item.userId?.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#1A4E11]/5 text-[#1A4E11] font-black text-xs">
                              {item.userId?.name?.charAt(0) || "R"}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">
                            {item.userId?.name || "New Applicant"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold italic lowercase">
                            {item.phoneNumber}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit">
                          {item.vehicleType}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400">
                          {item.area}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        item.status === "active" 
                        ? "bg-green-50 text-[#1A4E11]" 
                        : item.status === "pending" 
                        ? "bg-orange-50 text-orange-600" 
                        : "bg-red-50 text-red-500"
                      }`}>
                        {item.status === "active" ? "approved" : item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-2">
                    
                      {item.status === "pending" && (
                        <>
                          <button 
                            onClick={() => handleApprove(item._id)}
                            disabled={btnLoading === item._id}
                            title="Approve"
                            className="p-2.5 text-gray-300 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <IoCheckmarkCircleOutline 
                              size={18} 
                              className={btnLoading === item._id ? "animate-spin" : ""} 
                            />
                          </button>
                          
                          <button 
                            onClick={() => handleReject(item._id)}
                            disabled={btnLoading === item._id}
                            title="Reject"
                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <IoCloseCircleOutline 
                              size={18} 
                              className={btnLoading === item._id ? "animate-spin" : ""} 
                            />
                          </button>
                        </>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                        className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

        {filteredRiders.length > 0 && (
          <PaginationDashboard
            totalItems={filteredRiders.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default RidersPage;