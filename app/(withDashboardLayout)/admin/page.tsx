/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import { domToPng } from "modern-screenshot";
import {
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Zap,
  LayoutGrid,
  Settings,
  PlusCircle,
  TrendingUp,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getLowStockItems,
  getOverView,
  getTrafficStats,
  getFilteredStats,
} from "@/app/modules/overview/overview.api";
import { useCategories } from "@/app/hooks/useCategories";
import { useChefs } from "@/app/hooks/useChefs";
import { useUsers } from "@/app/hooks/useUsers";
import { MiniChart } from "@/components/admin-dashboard/MiniChart";
import toast from "react-hot-toast";
import Image from "next/image";
import { MenuModal } from "@/components/admin-dashboard/MenuModal";
import Link from "next/link";

// ✅ CHANGED: "all" add করা হয়েছে — আগে ছিল "day" | "week" | "month"
type FilterPeriod = "all" | "day" | "week" | "month";

const MONTHS = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December",
];

// ─── Skeleton Components (কোনো পরিবর্তন নেই) ────────────────────────────────
const SkeletonPulse = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-44 space-y-4">
    <div className="flex justify-between items-center">
      <SkeletonPulse className="w-10 h-10 rounded-2xl" />
      <SkeletonPulse className="w-12 h-4" />
    </div>
    <SkeletonPulse className="w-24 h-3" />
    <SkeletonPulse className="w-32 h-8" />
    <SkeletonPulse className="w-full h-6 rounded-xl" />
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <SkeletonPulse className="w-32 h-5" />
        <SkeletonPulse className="w-48 h-3" />
      </div>
      <div className="flex gap-3">
        <SkeletonPulse className="w-20 h-7 rounded-lg" />
        <SkeletonPulse className="w-20 h-7 rounded-lg" />
      </div>
    </div>
    <div className="h-80 flex items-end gap-3 px-4">
      {[55, 80, 45, 90, 60, 75, 50].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end">
          <SkeletonPulse
            className="w-full rounded-t-lg"
            style={{ height: `${h}%` } as any}
          />
        </div>
      ))}
    </div>
  </div>
);

const StockCardSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
    <SkeletonPulse className="w-16 h-16 rounded-2xl shrink-0" />
    <div className="flex-1 space-y-2">
      <SkeletonPulse className="w-3/4 h-3" />
      <SkeletonPulse className="w-1/2 h-3" />
      <SkeletonPulse className="w-full h-1.5 rounded-full" />
    </div>
  </div>
);

// ─── Custom Tooltip (কোনো পরিবর্তন নেই) ─────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-2xl p-4 rounded-2xl border border-gray-100 text-[11px]">
        <p className="text-gray-400 font-black uppercase mb-2 border-b pb-1">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between gap-6">
            <span className="text-gray-500 font-bold">REVENUE:</span>
            <span className="font-black text-[#4F46E5]">
              ৳{payload[0]?.value?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-gray-500 font-bold">ORDERS:</span>
            <span className="font-black text-[#F59E0B]">
              {payload[1]?.value}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// ─── Filter Tab (কোনো পরিবর্তন নেই) ─────────────────────────────────────────
const FilterTab = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${
      active
        ? "bg-[#1A4E11] text-white shadow-md"
        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
    }`}
  >
    {label}
  </button>
);

// ─── Month Dropdown (কোনো পরিবর্তন নেই) ──────────────────────────────────────
const MonthDropdown = ({
  selectedMonth,
  onChange,
}: {
  selectedMonth: number;
  onChange: (idx: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#EEF0FF] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all duration-200"
      >
        <Calendar size={11} />
        {MONTHS[selectedMonth]}
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2">
          {MONTHS.map((month, idx) => (
            <button
              key={idx}
              onClick={() => {
                onChange(idx);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#1A4E11]/5 ${
                selectedMonth === idx
                  ? "text-[#1A4E11] bg-[#1A4E11]/5"
                  : "text-gray-500"
              }`}
            >
              {month}
              {selectedMonth === idx && (
                <Check size={11} className="text-[#1A4E11]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState<any | null>(null);
  const [filteredStats, setFilteredStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    chartData: { name: string; revenue: number; orders: number }[];
  }>({ totalRevenue: 0, totalOrders: 0, chartData: [] });

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [trafficStats, setTrafficStats] = useState({
    direct: 0,
    social: 0,
    organic: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // ✅ CHANGED: default "all" — page load-এ সব data দেখাবে
  const [period, setPeriod] = useState<FilterPeriod>("all");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );

  const { data: categories = [] } = useCategories();
  const { data: chefs = [] } = useChefs();
  const { data: users = [], isLoading: usersLoading } = useUsers();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [overview, lowStock, traffic] = await Promise.all([
        getOverView(),
        getLowStockItems(),
        getTrafficStats(),
      ]);
      setStats(overview);
      setLowStockItems(lowStock);
      setTrafficStats(traffic);
    } catch (error) {
      console.error("Dashboard sync error:", error);
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilteredStats = useCallback(async () => {
    setFilterLoading(true);
    try {
      const data = await getFilteredStats(
        period,
        period === "month" ? selectedMonth : undefined,
      );
      setFilteredStats({
        totalRevenue: data?.totalRevenue ?? 0,
        totalOrders: data?.totalOrders ?? 0,
        chartData: data?.chartData ?? [],
      });
    } catch (error) {
      console.error("Filter fetch error:", error);
      toast.error("Failed to load filtered data");
      setFilteredStats({ totalRevenue: 0, totalOrders: 0, chartData: [] });
    } finally {
      setFilterLoading(false);
    }
  }, [period, selectedMonth]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);
  useEffect(() => { fetchFilteredStats(); }, [fetchFilteredStats]);

  // ✅ CHANGED: "all" label add করা হয়েছে
  const periodLabel = useMemo(() => {
    if (period === "all") return "All Time";
    if (period === "day") return "Today";
    if (period === "week") return "This Week";
    return MONTHS[selectedMonth];
  }, [period, selectedMonth]);

  const dynamicStatsCards = useMemo(
    () => [
      {
        label: "Total Revenue",
        sublabel: periodLabel,
        value: `৳${filteredStats.totalRevenue.toLocaleString()}`,
        allTime: `৳${(stats?.totalRevenue ?? 0).toLocaleString()} all-time`,
        trend: stats?.revenueTrend || 0,
        icon: <DollarSign size={20} />,
        color: "#4F46E5",
        bg: "#EEF0FF",
        chartData:
          filteredStats.chartData.length > 0
            ? filteredStats.chartData.map((d) => ({ uv: d.revenue }))
            : [{ uv: 0 }],
      },
      {
        label: "Total Orders",
        sublabel: periodLabel,
        value: filteredStats.totalOrders,
        allTime: `${stats?.totalPaidOrders ?? 0} all-time`,
        trend: stats?.orderTrend || 0,
        icon: <ShoppingBag size={20} />,
        color: "#F59E0B",
        bg: "#FFF4E5",
        chartData:
          filteredStats.chartData.length > 0
            ? filteredStats.chartData.map((d) => ({ uv: d.orders }))
            : [{ uv: 0 }],
      },
      {
        label: "Growth Rate",
        sublabel: "Overall",
        value: `${stats?.growthRate || "14.2"}%`,
        allTime: null,
        trend: stats?.growthTrend || "+2.5",
        icon: <TrendingUp size={20} />,
        color: "#10B981",
        bg: "#ECFDF5",
        chartData: [{ uv: 20 },{ uv: 40 },{ uv: 35 },{ uv: 50 },{ uv: 45 }],
      },
      {
        label: "System Users",
        sublabel: "Total",
        value: users.length || 0,
        allTime: null,
        trend: stats?.userTrend || "+0",
        icon: <Users size={20} />,
        color: "#8B5CF6",
        bg: "#F5F3FF",
        chartData: [{ uv: 10 },{ uv: 25 },{ uv: 20 },{ uv: 30 },{ uv: 40 }],
      },
    ],
    [stats, users, filteredStats, periodLabel],
  );

  const handleExportReport = async () => {
    const el = document.getElementById("dashboard-content");
    if (!el) return;
    const toastId = toast.loading("Generating PDF Report...");
    try {
      const dataUrl = await domToPng(el, { scale: 2, backgroundColor: "#F8F9FA" });
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [el.offsetWidth * 2, el.offsetHeight * 2],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, el.offsetWidth * 2, el.offsetHeight * 2);
      pdf.save(`Analytics-Report-${new Date().toLocaleDateString()}.pdf`);
      toast.success("Report Saved!", { id: toastId });
    } catch {
      toast.error("Export Failed", { id: toastId });
    }
  };

  const getTrafficPercent = (count: number) => {
    const total =
      trafficStats.direct + trafficStats.social + trafficStats.organic || 1;
    return Math.round((count / total) * 100);
  };

  // ─── Skeleton ─────────────────────────────────────────────────────────────
  if (loading || usersLoading) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen p-4 md:p-8 font-sans">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="space-y-2">
            <SkeletonPulse className="w-44 h-8" />
            <SkeletonPulse className="w-60 h-3" />
          </div>
          <div className="flex gap-3">
            <SkeletonPulse className="w-32 h-11 rounded-2xl" />
            <SkeletonPulse className="w-32 h-11 rounded-2xl" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-8 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm w-fit">
          <SkeletonPulse className="w-5 h-5 rounded-md" />
          <SkeletonPulse className="w-14 h-7 rounded-xl" />
          <SkeletonPulse className="w-16 h-7 rounded-xl" />
          <SkeletonPulse className="w-20 h-7 rounded-xl" />
          <SkeletonPulse className="w-20 h-7 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8"><ChartSkeleton /></div>
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <SkeletonPulse className="w-32 h-4 mx-auto" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonPulse key={i} className="h-20 rounded-3xl" />)}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <SkeletonPulse className="w-28 h-5" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <SkeletonPulse className="w-14 h-3" />
                    <SkeletonPulse className="w-8 h-3" />
                  </div>
                  <SkeletonPulse className="w-full h-2 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <SkeletonPulse className="w-36 h-5" />
              <SkeletonPulse className="w-52 h-3" />
            </div>
            <SkeletonPulse className="w-20 h-8 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <StockCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main UI ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F8F9FA] min-h-screen p-4 md:p-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Dashboard <Zap className="text-yellow-400 fill-current" size={24} />
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[3px]">
            Real-time Analytics Feed
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportReport}
            className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            Export Data
          </button>
          <Link
            href="/admin/menus"
            className="flex-1 md:flex-none bg-[#1A4E11] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} /> Add Item
          </Link>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm w-fit">
        <Calendar size={14} className="text-gray-400 mr-1" />

        {/* ✅ CHANGED: "All" button add করা হয়েছে — default active */}
        <FilterTab
          label="All"
          active={period === "all"}
          onClick={() => setPeriod("all")}
        />
        <FilterTab
          label="Day"
          active={period === "day"}
          onClick={() => setPeriod("day")}
        />
        <FilterTab
          label="Week"
          active={period === "week"}
          onClick={() => setPeriod("week")}
        />
        <FilterTab
          label="Month"
          active={period === "month"}
          onClick={() => setPeriod("month")}
        />

        {/* Month dropdown শুধু "Month" select করলে দেখাবে */}
        {period === "month" && (
          <>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <MonthDropdown
              selectedMonth={selectedMonth}
              onChange={setSelectedMonth}
            />
          </>
        )}

        <div className="w-px h-5 bg-gray-200 mx-1" />

        {filterLoading ? (
          <span className="text-[10px] font-black text-[#4F46E5] uppercase tracking-widest animate-pulse">
            Loading...
          </span>
        ) : (
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {periodLabel}
          </span>
        )}
      </div>

      <div id="dashboard-content" className="space-y-8">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dynamicStatsCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative h-44"
            >
              <div className="flex justify-between items-center mb-3 relative z-10">
                <div
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: stat.bg, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center text-[10px] font-black ${
                    parseFloat(stat.trend.toString()) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.trend}%{" "}
                  {parseFloat(stat.trend.toString()) >= 0 ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                </div>
              </div>
              <div className="relative z-10">
                <h4 className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 flex-wrap">
                  {stat.label}
                  <span
                    className="px-1.5 py-0.5 rounded-md text-[8px]"
                    style={{ backgroundColor: stat.bg, color: stat.color }}
                  >
                    {stat.sublabel}
                  </span>
                </h4>
                {filterLoading && i < 2 ? (
                  <div className="animate-pulse bg-gray-200 rounded-xl w-28 h-8 mt-1" />
                ) : (
                  <h2 className="text-3xl font-black text-gray-900 mt-1">
                    {stat.value}
                  </h2>
                )}
                {stat.allTime && (
                  <p className="text-[9px] text-gray-400 font-bold mt-0.5">
                    {stat.allTime}
                  </p>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-14 opacity-20 group-hover:opacity-40 transition-all">
                <MiniChart
                  data={stat.chartData.length > 0 ? stat.chartData : [{ uv: 10 }, { uv: 20 }]}
                  color={stat.color}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN CHART */}
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h3 className="font-black text-xl text-gray-900 tracking-tight">
                  Sales Trends
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {periodLabel} — Revenue & Orders
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#4F46E5] uppercase bg-[#EEF0FF] px-3 py-1 rounded-lg">
                  Revenue
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#F59E0B] uppercase bg-[#FFF4E5] px-3 py-1 rounded-lg">
                  Orders
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              {filterLoading ? (
                <div className="h-full flex items-end gap-3 px-4">
                  {[55, 80, 45, 90, 60, 75, 50].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="animate-pulse bg-gray-200 rounded-t-lg w-full"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              ) : filteredStats.chartData.length === 0 ||
                filteredStats.chartData.every(
                  (d) => d.revenue === 0 && d.orders === 0,
                ) ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-gray-300" />
                  </div>
                  <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest">
                    No data for {periodLabel}
                  </p>
                  <p className="text-[10px] text-gray-300 font-bold">
                    Orders: 0 &nbsp;•&nbsp; Revenue: ৳0
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredStats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 900 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 900 }}
                      tickFormatter={(v) => `৳${v / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4F46E5"
                      strokeWidth={4}
                      dot={{ r: 4, fill: "#4F46E5" }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#F59E0B"
                      strokeWidth={4}
                      dot={{ r: 4, fill: "#F59E0B" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* TRAFFIC & ACTIONS (কোনো পরিবর্তন নেই) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-6 text-center underline decoration-[#1A4E11]/20">
                Command Center
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Menus", icon: <LayoutGrid size={18} />, link: "/admin/menus" },
                  { label: "Orders", icon: <ShoppingBag size={18} />, link: "/admin/orders" },
                  { label: "Users", icon: <Users size={18} />, link: "/admin/user-management" },
                  { label: "Settings", icon: <Settings size={18} />, link: "/admin/settings" },
                ].map((act, idx) => (
                  <Link
                    key={idx}
                    href={act.link}
                    className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-gray-50 hover:bg-[#1A4E11] hover:text-white transition-all group"
                  >
                    <span className="text-gray-400 group-hover:text-white">{act.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{act.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 text-lg tracking-tight mb-8">
                Visitor Traffic
              </h3>
              <div className="space-y-6">
                {[
                  { label: "Direct", val: trafficStats.direct, color: "#4F46E5" },
                  { label: "Social", val: trafficStats.social, color: "#F59E0B" },
                  { label: "Organic", val: trafficStats.organic, color: "#EF4444" },
                ].map((t, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-400">{t.label}</span>
                      <span className="text-gray-900">{getTrafficPercent(t.val)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${getTrafficPercent(t.val)}%`, backgroundColor: t.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* STOCK WARNINGS (কোনো পরিবর্তন নেই) */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-black text-xl text-gray-900 tracking-tight">
                Stock Warnings
              </h3>
              <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                Found {lowStockItems.length} items below safety limit
              </p>
            </div>
            <Link
              href="/admin/menus"
              className="text-[10px] font-black text-[#1A4E11] uppercase tracking-widest bg-[#1A4E11]/5 px-4 py-2 rounded-xl"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                  className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white">
                    <Image
                      src={item.image.url}
                      fill
                      alt={item.title}
                      className="object-cover group-hover:scale-110 transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-gray-800 line-clamp-1">{item.title}</h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">
                      ৳{item.price} • {item.categoryId?.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.min((item.stock / 15) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-red-500 uppercase">
                        {item.stock} Unit
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 opacity-50 font-black uppercase text-[10px]">
                No low stock alerts today
              </div>
            )}
          </div>
        </div>
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={selectedItem}
        categories={categories}
        chefs={chefs}
        onSuccess={fetchAllData}
      />
    </div>
  );
}