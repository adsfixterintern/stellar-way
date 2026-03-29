/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Copy,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { IOverView } from "@/app/modules/overview/overview.interface";
import {
  getLowStockItems,
  getOverView,
} from "@/app/modules/overview/overview.api";
import { useCategories } from "@/app/hooks/useCategories"; // হুক ইমপোর্ট করুন
import { useChefs } from "@/app/hooks/useChefs"; // হুক ইমপোর্ট করুন
import { MiniChart } from "@/components/admin-dashboard/MiniChart";
import toast from "react-hot-toast";
import Image from "next/image";
import { MenuModal } from "@/components/admin-dashboard/MenuModal";

// --- Custom Components ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenueItem = payload.find((p: any) => p.dataKey === "revenue");
    const ordersItem = payload.find((p: any) => p.dataKey === "orders");
    return (
      <div className="bg-white shadow-2xl p-4 rounded-xl border border-gray-100 font-sans text-xs min-w-[160px]">
        <p className="text-gray-400 font-bold uppercase mb-2">{label} 2026</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500">Total Revenue:</span>
            <span className="font-bold text-[#4F46E5] text-sm">৳{revenueItem?.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500">Total Orders:</span>
            <span className="font-bold text-[#F59E0B] text-sm">{ordersItem?.value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = () => (
  <div className="flex justify-end items-center gap-6 text-gray-500 font-semibold text-[11px] mb-4">
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-sm bg-[#4F46E5]"></div>
      <span>Total Revenue (৳)</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]"></div>
      <span>Total Orders</span>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<IOverView | null>(null);
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // External Data Hooks
  const { data: categories = [] } = useCategories();
  const { data: chefs = [] } = useChefs();

  // Fetch Logic
  const fetchOverviewData = useCallback(async () => {
    try {
      const data = await getOverView();
      setStats(data);
    } catch (error) {
      console.error("Error fetching overview:", error);
    }
  }, []);

  const fetchLowStockData = useCallback(async () => {
    try {
      const data = await getLowStockItems();
      setLowStockItems(data);
    } catch (error) {
      console.error("Error fetching low stock:", error);
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchOverviewData(), fetchLowStockData()]);
      setLoading(false);
    };
    loadAllData();
  }, [fetchOverviewData, fetchLowStockData]);

  const handleLowStockClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast.success("Link copied!");
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading...</div>;

  return (
    <div className="bg-[#F8F9FA] min-h-screen p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <button className="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm text-gray-600 hover:bg-gray-50 transition-all">
          Export Report 📥
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Order */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm relative overflow-hidden h-48">
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-lg font-bold text-gray-800">Total Order</h3>
                <div className="bg-[#FFF4E5] p-3 rounded-full text-[#FFA043]"><ShoppingBag size={22} /></div>
              </div>
              <div className="mt-4 flex items-baseline gap-3 relative z-10">
                <h2 className="text-4xl font-extrabold text-gray-900">{stats?.totalPaidOrders || 0}</h2>
                <span className="text-[#10B981] font-bold text-sm flex items-center">{stats?.orderTrend}% <ArrowUpRight size={16} /></span>
              </div>
              <MiniChart data={[{uv:400},{uv:300},{uv:500},{uv:400},{uv:600}]} color="#10B981" />
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm relative overflow-hidden h-48">
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-lg font-bold text-gray-800">Total Revenue</h3>
                <div className="bg-[#EEF0FF] p-3 rounded-full text-[#6366F1]"><DollarSign size={22} /></div>
              </div>
              <div className="mt-4 flex items-baseline gap-3 relative z-10">
                <h2 className="text-4xl font-extrabold text-gray-900">৳{stats?.totalRevenue?.toLocaleString()}</h2>
                <span className="text-[#10B981] font-bold text-sm flex items-center">{stats?.revenueTrend}% <ArrowUpRight size={16} /></span>
              </div>
              <MiniChart data={[{uv:300},{uv:500},{uv:400},{uv:700},{uv:500}]} color="#6366F1" />
            </div>

            {/* Cancel Order */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm relative overflow-hidden h-48">
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-lg font-bold text-gray-800">Cancel Order</h3>
                <div className="bg-[#FFF1F2] p-3 rounded-full text-[#F43F5E]"><Trash2 size={22} /></div>
              </div>
              <div className="mt-4 flex items-baseline gap-3 relative z-10">
                <h2 className="text-4xl font-extrabold text-gray-900">120</h2>
                <span className="text-[#F43F5E] font-bold text-sm flex items-center">5% <ArrowDownRight size={16} /></span>
              </div>
              <MiniChart data={[{uv:600},{uv:400},{uv:500},{uv:300},{uv:400}]} color="#F43F5E" />
            </div>
          </div>

          {/* Big Chart */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
            <h3 className="font-bold text-xl text-gray-800 mb-8">Product Selling Overview</h3>
            <CustomLegend />
            <div className="h-80 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.salesChartData || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#9CA3AF', fontSize:12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill:'#9CA3AF', fontSize:12}} tickFormatter={(v)=>`৳${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} dot={{r:4}} />
                  <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={3} dot={{r:4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm text-center">
            <div className="flex gap-3 mb-8">
              <button onClick={() => window.open("/", "_blank")} className="flex-1 bg-[#4F46E5] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">Visit website <ExternalLink size={18} /></button>
              <button onClick={handleCopyLink} className="p-4 rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50"><Copy size={20} /></button>
            </div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Total Visitors</p>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-8">5,316</h3>
            <div className="flex items-end justify-between h-32 gap-3">
              <div className="bg-[#4F46E5] rounded-xl h-full w-full"></div>
              <div className="bg-[#F59E0B] rounded-xl h-[60%] w-full"></div>
              <div className="bg-[#EF4444] rounded-xl h-[30%] w-full"></div>
            </div>
          </div>

          {/* Low Stock Items Section */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
            <h3 className="font-bold text-xl text-gray-900 mb-8">Low Stock Items</h3>
            <div className="space-y-6">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleLowStockClick(item)} // এখানে ক্লিক ইভেন্ট
                    className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-12 rounded-2xl overflow-hidden relative border border-gray-50">
                        <Image src={item.image.url} fill alt={item.title} className="object-cover" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-gray-900">{item.title}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">৳{item.price} • {item.categoryId?.name}</p>
                      </div>
                    </div>
                    <span className="text-[#EF4444] font-black text-[11px] bg-[#FEF2F2] px-3 py-1 rounded-lg">
                      {item.stock.toString().padStart(2, "0")}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-xs py-4">Inventory is healthy! ✨</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Reusable Modal --- */}
      <MenuModal
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} 
        editData={selectedItem} 
        categories={categories} 
        chefs={chefs} 
        onSuccess={() => {
          fetchLowStockData(); // লিস্ট আপডেট করবে
          fetchOverviewData(); // সম্ভব হলে ওভারভিউ-ও রিফ্রেশ করবে
        }} 
      />
    </div>
  );
}