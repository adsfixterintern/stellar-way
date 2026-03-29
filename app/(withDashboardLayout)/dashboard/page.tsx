
"use client"
import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink, 
  Copy,
} from 'lucide-react';
import { IOverView } from '@/app/modules/overview/overview.interface';
import { getOverView } from '@/app/modules/overview/overview.api';


export default function DashboardPage() {
const [stats, setStats] = useState<IOverView | null>(null);
const [loading, setLoading] = useState(true);

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

if (loading) return <div className="text-center py-20">Loading Statistics...</div>;
  return (
    <div className="bg-[#F8F9FA] min-h-screen p-6 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm text-gray-600">
          <span>Export Report</span>
          <span className="text-lg">📥</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Banner image */}
          <div className="bg-[#F0F5FF] rounded-3xl p-8 flex justify-between items-center relative overflow-hidden h-[220px]">
            <div className="z-10">
              <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                Zatiq <br /> 
                <span className="font-normal">উদ্যোক্তা পরিবারে</span> <br />
                <span className="text-[#3B4DFF]">১,৫০০+</span> সদস্য
              </h2>
              <div className="flex gap-1.5 mt-6">
                <div className="w-8 h-2 bg-[#3B4DFF] rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            <div className="relative w-1/2 h-full">
              <img 
                src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773564244/3ae59afda4b6c04a1e44916237d3441e07dd5c93_xtonf9.png" 
                alt="Zatiq Team" 
                className="object-contain w-full h-full scale-125"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Order */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Order</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-3xl font-bold">1440</h3>
                    <span className="text-green-500 text-xs font-bold flex items-center">8% <ArrowUpRight size={14}/></span>
                  </div>
                </div>
                <div className="bg-[#FFF4E5] p-2.5 rounded-full text-[#FFA043]">
                  <ShoppingBag size={20} />
                </div> </div>
              <div className="mt-4 h-12 w-full bg-[url('https://i.ibb.co/Vv9Z9Rj/wave-green.png')] bg-contain bg-no-repeat bg-bottom opacity-40"></div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-3xl font-bold">5,12,500</h3>
                    <span className="text-green-500 text-xs font-bold flex items-center">21.6% <ArrowUpRight size={14}/></span>
                  </div>
                </div>
                <div className="bg-[#EEF0FF] p-2.5 rounded-full text-[#6366F1]">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="mt-4 h-12 w-full bg-[url('https://i.ibb.co/Vv9Z9Rj/wave-green.png')] bg-contain bg-no-repeat bg-bottom opacity-40"></div>
            </div>

            {/* Cancel Order */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Cancel Order</p>
                  <div className="flex items-center gap-2 mt-1">
                    <h3 className="text-3xl font-bold">120</h3>
                    <span className="text-red-500 text-xs font-bold flex items-center">5% <ArrowDownRight size={14}/></span>
                  </div>
                </div>
                <div className="bg-[#FFF1F2] p-2.5 rounded-full text-[#F43F5E]">
                  <XCircle size={20} />
                </div>
              </div>
              <div className="mt-4 h-12 w-full bg-[url('https://i.ibb.co/Vv9Z9Rj/wave-green.png')] bg-contain bg-no-repeat bg-bottom opacity-40"></div>
            </div>
          </div>

          {/* Large Selling Chart */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-800">Product Selling Overview</h3>
              <select className="bg-gray-50 border border-gray-100 text-xs rounded-lg p-2 px-3 outline-none">
                <option>Monthly</option>
              </select>
            </div>
            <div className="mb-4 flex items-center gap-3">
               <h4 className="text-3xl font-bold">$5,12,500</h4>
               <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">21.6% <ArrowUpRight size={12}/></span>
               <span className="text-gray-400 text-xs ml-2">from January to December</span>
            </div>
            {/* ডামি গ্রাফ ইমেজ বা ড্রয়িং */}
            <div className="h-64 w-full relative">
               <img src="https://i.ibb.co/vYmZz6X/chart-dummy.png" alt="chart" className="w-full h-full object-contain" />
               <div className="absolute top-1/2 left-[60%] bg-white shadow-xl p-3 rounded-xl border border-gray-50 text-[10px]">
                  <p className="text-gray-400 font-bold uppercase">July 17, 2025</p>
                  <div className="flex justify-between gap-4 mt-1">
                    <span>Total Revenue ($):</span> <span className="font-bold text-blue-600">4,300</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Total Orders:</span> <span className="font-bold text-orange-500">15</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex gap-2 mb-8">
              <button className="flex-1 bg-[#4F46E5] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm">
                Visit website <ExternalLink size={16} />
              </button>
              <button className="p-3.5 rounded-xl border border-gray-200 text-gray-500 flex items-center justify-center gap-2 text-sm font-bold">
                Copy <Copy size={16} />
              </button>
            </div>

            <div className="flex justify-between items-center mb-2">
              <h4 className="text-gray-500 text-sm font-medium">Total Visitors</h4>
              <select className="text-[10px] bg-gray-50 p-1 px-2 border border-gray-100 rounded-md">
                <option>Last 30 Day</option>
              </select>
            </div>
            <h3 className="text-3xl font-bold mb-6">5316</h3>

            {/* Vertical Bars Section */}
            <div className="flex items-end justify-between h-36 gap-4 px-2 mb-2">
              <div className="w-full">
                 <div className="text-[10px] text-green-500 font-bold mb-1 flex items-center"><ArrowUpRight size={10}/> +0.8%</div>
                 <div className="bg-[#4F46E5] rounded-lg h-32 w-full"></div>
              </div>
              <div className="w-full">
                 <div className="text-[10px] text-red-500 font-bold mb-1 flex items-center"><ArrowDownRight size={10}/> +0.8%</div>
                 <div className="bg-[#FFB84D] rounded-lg h-20 w-full"></div>
              </div>
              <div className="w-full">
                 <div className="text-[10px] text-red-500 font-bold mb-1 flex items-center"><ArrowDownRight size={10}/> +0.8%</div>
                 <div className="bg-[#FF4D17] rounded-lg h-10 w-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-extrabold text-gray-400 mt-4 px-1">
              <div className="text-left"><p>Direct</p> <p className="text-gray-800 text-xs">61%</p></div>
              <div className="text-left"><p>Social</p> <p className="text-gray-800 text-xs">27%</p></div>
              <div className="text-left"><p>Organic</p> <p className="text-gray-800 text-xs">12%</p></div>
            </div>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900">Low Stock Iteams</h3>
              <button className="text-[#4F46E5] text-xs font-bold border border-[#4F46E5] px-3 py-1.5 rounded-lg">View All</button>
            </div>

            <div className="space-y-6">
              {[
                { name: 'MacBook Air', price: '990', sku: 'MBA-256', stock: '08' },
                { name: 'Iphone', price: '880', sku: 'IP16-PRO', stock: '06' },
                { name: 'Headphone', price: '510', sku: 'HPH-WLS', stock: '09' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-xl">
                      {idx === 0 ? '💻' : idx === 1 ? '📱' : '🎧'}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">${item.price} • SKU: #{item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold mb-0.5">Stock Left:</p>
                    <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-0.5 rounded-md border border-red-100">{item.stock}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}