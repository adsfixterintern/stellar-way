/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useTables } from "@/app/hooks/useTables";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { IoLocationOutline, IoPeopleOutline, IoLayersOutline } from "react-icons/io5";

const ViewAllTables = () => {
  const { data: tablesResponse, isLoading } = useTables();
  const tables = tablesResponse?.data || [];

  // States for Filtering
  const [filterPosition, setFilterPosition] = useState("all");
  const [limit, setLimit] = useState(6); 

  // Filter Logic
  const filteredTables = tables
    .filter((table: any) => 
      filterPosition === "all" ? true : table.position === filterPosition
    )
    .slice(0, limit);

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="w-full max-w-7xl mx-auto py-16">
      {/* Top Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="superTitle">Tables</h1>
          <p className="secTitle">Your Preferred Location</p>
        </div>

        <div className="flex gap-3">
          {/* Position Filter */}
          <select 
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#1A4E11]/20"
          >
            <option value="all">All Positions</option>
            <option value="window-side">Window Side</option>
            <option value="center">Center</option>
            <option value="corner">Corner</option>
            <option value="outdoor">Outdoor</option>
          </select>

          {/* Limit Filter */}
          <select 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider outline-none focus:ring-2 focus:ring-[#1A4E11]/20"
          >
            <option value="6">Show 6 Tables</option>
            <option value="12">Show 12 Tables</option>
            <option value="20">Show 20 Tables</option>
            <option value="30">Show 30 Tables</option>
          </select>
        </div>
      </div>

      {/* Tables Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTables.length > 0 ? (
          filteredTables.map((table: any) => (
            <div 
              key={table._id} 
              className="group relative h-[350px] w-full rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500"
            >
              {/* Background Image */}
              <img 
                src={table.image} 
                alt={table.tableNumber} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Default Bottom Overlay (Table Number) */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-2xl font-black uppercase tracking-tighter">{table.tableNumber}</h3>
                <p className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">{table.position}</p>
              </div>

              {/* Hover Content */}
              <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
                
                {/* Icons & Details */}
                <div className="space-y-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <IoPeopleOutline className="text-[#1A4E11]" size={30} />
                    <span className="text-white text-lg font-black uppercase tracking-widest">{table.totalSeat} Seats</span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <IoLocationOutline className="text-[#1A4E11]" size={25} />
                    <span className="text-gray-300 text-xs font-bold uppercase tracking-[0.2em]">{table.position}</span>
                  </div>

                  <div className="border-t border-white/10 pt-4 max-w-50">
                    <p className="text-gray-400 text-[11px] leading-relaxed italic">
                      &quot;{table.description}&quot;
                    </p>
                  </div>

                  <div className="pt-4">
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                      table.status === 'available' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                    }`}>
                      {table.status}
                    </span>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-4 right-4 text-white/20">
                    <IoLayersOutline size={40}/>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest">No tables found for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllTables;