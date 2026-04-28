/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  IoStatsChartOutline,
  IoSaveOutline,
  IoRefreshOutline,
  IoTrashOutline,
  IoPeopleOutline,
  IoRestaurantOutline,
  IoRibbonOutline,
  IoTrophyOutline,
  IoGitBranchOutline,
} from "react-icons/io5";
import {
  getRestaurantStats,
  updateRestaurantStats,
  resetRestaurantStats,
  createRestaurantStats,
} from "@/app/modules/stats/restaurantStats.api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AdminStatsPage = () => {
  const [stats, setStats] = useState<any>({
    happyClients: 0,
    yearsOfExperience: 0,
    totalDishes: 0,
    awards: 0,
    branches: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await getRestaurantStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats({ ...stats, [name]: value === "" ? 0 : Number(value) });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = stats._id
        ? await updateRestaurantStats(stats)
        : await createRestaurantStats(stats);

      if (res.success) {
        toast.success("Metrics updated successfully!");
        fetchStats();
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update stats");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will reset all stats to zero!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#f1f1f1",
      confirmButtonText: "Yes, reset!",
      customClass: { popup: "rounded-3xl shadow-xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await resetRestaurantStats();
          if (res.success) {
            Swal.fire("Reset!", "Stats cleared.", "success");
            fetchStats();
          }
        } catch (err: any) {
          toast.error("Failed to reset stats");
        }
      }
    });
  };

  return (
    <div className="min-h-screen ">
      <style jsx>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center justify-center sm:justify-start gap-3 italic uppercase tracking-tighter">
              <IoStatsChartOutline className="text-[#1A4E11]" /> Metrics
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[3px] mt-2">
              Management Dashboard
            </p>
          </div>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
          >
            <IoTrashOutline size={20} />
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 p-6 md:p-12">
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <form onSubmit={handleUpdate} className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    label: "Happy Clients",
                    name: "happyClients",
                    icon: <IoPeopleOutline className="text-blue-500" />,
                  },
                  {
                    label: "Years Exp.",
                    name: "yearsOfExperience",
                    icon: <IoRibbonOutline className="text-amber-500" />,
                  },
                  {
                    label: "Total Dishes",
                    name: "totalDishes",
                    icon: <IoRestaurantOutline className="text-green-500" />,
                  },
                  {
                    label: "Awards Won",
                    name: "awards",
                    icon: <IoTrophyOutline className="text-yellow-600" />,
                  },
                  {
                    label: "Total Branches",
                    name: "branches",
                    icon: <IoGitBranchOutline className="text-purple-500" />,
                  },
                ].map((item) => (
                  <div key={item.name} className="flex flex-col gap-3 group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      {item.icon} {item.label}
                    </label>
                    <input
                      type="number"
                      name={item.name}
                      value={stats[item.name] === 0 ? "" : stats[item.name]}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] focus:bg-white outline-none font-black text-2xl transition-all shadow-inner"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-[#1A4E11] text-white py-5 rounded-[1.5rem] font-black text-[11px] md:text-sm uppercase tracking-widest shadow-xl shadow-[#1A4E11]/10 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-gray-300"
                >
                  {isUpdating ? (
                    <IoRefreshOutline className="animate-spin" size={20} />
                  ) : (
                    <>
                      <IoSaveOutline size={20} /> Update All Stats
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// SKELETON COMPONENT
const StatsSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="h-3 w-24 bg-gray-100 rounded-full"></div>
          <div className="h-16 w-full bg-gray-50 rounded-2xl"></div>
        </div>
      ))}
    </div>
    <div className="h-16 w-full bg-gray-100 rounded-[1.5rem] mt-6"></div>
  </div>
);

export default AdminStatsPage;
