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
    // খালি স্ট্রিং থাকলে সেটাকে 0 হিসেবে সেভ করবে ডাটাবেজের জন্য
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
        toast.success("Stats updated successfully!");
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
      text: "This will reset all stats to zero in the database!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
      customClass: {
        popup: "rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await resetRestaurantStats();
          if (res.success) {
            Swal.fire("Reset!", "Stats have been cleared.", "success");
            fetchStats();
          }
        } catch (err: any) {
          toast.error("Failed to reset stats");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A4E11]"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen">
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

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <IoStatsChartOutline className="text-[#1A4E11]" /> Restaurant
              Metrics
            </h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
              Manage numbers for the Counter section
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <IoTrashOutline size={20} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12"
        >
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  label: "Happy Clients",
                  name: "happyClients",
                  icon: <IoPeopleOutline className="text-blue-500" />,
                },
                {
                  label: "Years of Experience",
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
                <div key={item.name} className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    {item.icon} {item.label}
                  </label>
                  <input
                    type="number"
                    name={item.name}
                    value={stats[item.name] === 0 ? "" : stats[item.name]}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] outline-none font-black text-xl transition-all shadow-inner"
                  />
                </div>
              ))}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#1A4E11] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
              >
                {isUpdating ? (
                  <IoRefreshOutline className="animate-spin" size={24} />
                ) : (
                  <>
                    <IoSaveOutline size={24} /> UPDATE RESTAURANT STATS
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminStatsPage;
