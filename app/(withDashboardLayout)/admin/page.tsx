/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  DollarSign,
  XCircle,
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
import { getOverView } from "@/app/modules/overview/overview.api";
import { MiniChart } from "@/components/admin-dashboard/MiniChart";

// --- Custom Components for Premium UI ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenueItem = payload.find((p: any) => p.dataKey === "revenue");
    const ordersItem = payload.find((p: any) => p.dataKey === "orders");
    return (
      <div className="bg-white shadow-2xl p-4 rounded-xl border border-gray-100 font-sans text-xs min-w-[160px]">
        <p className="text-gray-400 font-bold uppercase mb-2">{label} 17, 2025</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500">Total Revenue ($):</span>
            <span className="font-bold text-[#4F46E5] text-sm">
              {revenueItem?.value.toLocaleString()}
            </span>
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
      <span>Total Revenue ($)</span>
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

  // MiniChart এর জন্য ইমেজের মতো ঢেউ খেলানো ডাটা
  const miniChartData = [
    { uv: 400 }, { uv: 300 }, { uv: 550 }, { uv: 400 },
    { uv: 700 }, { uv: 500 }, { uv: 800 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOverView();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="flex justify-center items-center min-h-screen text-gray-400">Loading...</div>;

  return (
    <div className="bg-[#F8F9FA] min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <button className="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
          Export Report 📥
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Order */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm relative overflow-hidden group h-48">
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-lg font-bold text-gray-800">Total Order</h3>
                <div className="bg-[#FFF4E5] p-3 rounded-full text-[#FFA043]">
                  <ShoppingBag size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-3 relative z-10">
                <h2 className="text-4xl font-extrabold text-gray-900">{stats?.totalPaidOrders || 0}</h2>
                <span className="text-[#10B981] font-bold text-sm flex items-center">
                  {stats?.orderTrend}% <ArrowUpRight size={16} />
                </span>
              </div>
              <MiniChart data={miniChartData} color="#10B981" />
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm relative overflow-hidden group h-48">
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-lg font-bold text-gray-800">Total Revenue</h3>
                <div className="bg-[#EEF0FF] p-3 rounded-full text-[#6366F1]">
                  <DollarSign size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-3 relative z-10">
                <h2 className="text-4xl font-extrabold text-gray-900">{stats?.totalRevenue?.toLocaleString()}</h2>
                <span className="text-[#10B981] font-bold text-sm flex items-center">
                  {stats?.revenueTrend}% <ArrowUpRight size={16} />
                </span>
              </div>
              <MiniChart data={miniChartData} color="#10B981" />
            </div>

            {/* Cancel Order */}
            <div className="bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm relative overflow-hidden group h-48">
              <div className="flex justify-between items-start relative z-10">
                <h3 className="text-lg font-bold text-gray-800">Cancel Order</h3>
                <div className="bg-[#FFF1F2] p-3 rounded-full text-[#F43F5E]">
                  <Trash2 size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-3 relative z-10">
                <h2 className="text-4xl font-extrabold text-gray-900">120</h2>
                <span className="text-[#F43F5E] font-bold text-sm flex items-center">
                  5% <ArrowDownRight size={16} />
                </span>
              </div>
              <MiniChart data={miniChartData} color="#10B981" />
            </div>
          </div>

          {/* Product Selling Overview (Big Chart) */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl text-gray-800">Product Selling Overview</h3>
              <select className="bg-gray-50 border border-gray-100 text-xs font-bold rounded-xl p-2.5 px-4 outline-none text-gray-500">
                <option>Monthly</option>
              </select>
            </div>

            <div className="mb-8 flex items-center gap-4">
              <h4 className="text-4xl font-extrabold text-gray-900">${stats?.totalRevenue?.toLocaleString()}</h4>
              <span className="text-[#10B981] text-xs font-bold bg-[#ECFDF5] px-3 py-1.5 rounded-full flex items-center gap-1">
                {stats?.revenueTrend}% <ArrowUpRight size={14} />
              </span>
              <span className="text-gray-400 text-sm font-medium">from January to December</span>
            </div>

            <CustomLegend />

            <div className="h-80 w-full mt-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.salesChartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="0 0" horizontal={false} stroke="#F3F4F6" strokeWidth={1.5} />
                  
                  {/* July Highlighting Area */}
                  <ReferenceArea x1="Jul" x2="Jul" fill="#4F46E5" fillOpacity={0.05} />

                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 13, fontWeight: 500}} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 13, fontWeight: 500}}
                    tickFormatter={(value) => `$${value/1000}K`}
                  />
                  
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '5 5' }} />

                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4F46E5" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: "white", stroke: "#4F46E5", strokeWidth: 2 }}
                    activeDot={{ r: 7, strokeWidth: 0, fill: "#4F46E5" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: "white", stroke: "#F59E0B", strokeWidth: 2 }}
                    activeDot={{ r: 7, strokeWidth: 0, fill: "#F59E0B" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Small Info Cards */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
             <div className="flex gap-3 mb-10">
                <button className="flex-1 bg-[#4F46E5] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#4338CA] transition-all">
                  Visit website <ExternalLink size={18} />
                </button>
                <button className="p-4 rounded-2xl border border-gray-100 text-gray-400 hover:bg-gray-50 transition-all">
                  <Copy size={20} />
                </button>
             </div>
             <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Visitors</p>
             <h3 className="text-4xl font-extrabold text-gray-900 mb-8">5,316</h3>
             
             {/* Simple Custom Bar Chart for Visitors */}
             <div className="flex items-end justify-between h-40 gap-4 mb-6">
                <div className="bg-[#4F46E5] rounded-xl h-full w-full"></div>
                <div className="bg-[#F59E0B] rounded-xl h-[60%] w-full"></div>
                <div className="bg-[#EF4444] rounded-xl h-[30%] w-full"></div>
             </div>
             <div className="flex justify-between text-[11px] font-bold text-gray-400">
               <div>Direct <p className="text-gray-900 text-sm">61%</p></div>
               <div>Social <p className="text-gray-900 text-sm">27%</p></div>
               <div>Organic <p className="text-gray-900 text-sm">12%</p></div>
             </div>
           </div>

           {/* Low Stock Items */}
           <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
              <h3 className="font-bold text-xl text-gray-900 mb-8">Low Stock Items</h3>
              <div className="space-y-8">
                {[
                  { name: "MacBook Air", price: "990", sku: "MBA-256", stock: "08", icon: "💻" },
                  { name: "Iphone 16", price: "880", sku: "IP16-PRO", stock: "06", icon: "📱" },
                  { name: "Headphone", price: "510", sku: "HPH-WLS", stock: "09", icon: "🎧" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">{item.icon}</div>
                      <div>
                        <p className="font-extrabold text-[15px] text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400 font-bold">${item.price} • #{item.sku}</p>
                      </div>
                    </div>
                    <span className="text-[#EF4444] font-extrabold text-xs bg-[#FEF2F2] px-3 py-1 rounded-lg">{item.stock}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}