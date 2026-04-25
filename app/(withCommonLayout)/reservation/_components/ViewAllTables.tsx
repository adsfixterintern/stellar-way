
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { useTables } from "@/app/hooks/useTables";
import { IoLocationOutline, IoPeopleOutline, IoLayersOutline, IoChevronDown } from "react-icons/io5";
import { SkeletonCardForViewTables } from "@/components/shared/SkeletonCard";


const ViewAllTables = () => {
  const { data: tablesResponse, isLoading } = useTables();
  const tables = tablesResponse?.data || [];

  // States
  const [filterPosition, setFilterPosition] = useState("all");
  const [limit, setLimit] = useState(6); 
  const [isPosOpen, setIsPosOpen] = useState(false);
  const [isLimitOpen, setIsLimitOpen] = useState(false);

  // Filter Logic
  const filteredTables = tables
    .filter((table: any) => 
      filterPosition === "all" ? true : table.position === filterPosition
    )
    .slice(0, limit);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 px-3 md:px-0">
        <div className="animate-pulse flex flex-col gap-2 mb-10">
          {/* Title and Subtitle skeletons */}
          <div className="h-10 bg-gray-200 rounded-lg w-32 md:w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded-md w-48 md:w-64"></div>
        </div>

        {/* Tables Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCardForViewTables key={idx} />
          ))}
        </div>
      </div>
    );
  }
  

  return (
    <div className="w-full max-w-7xl mx-auto py-16 px-3 md:px-0 relative z-10">
      
      {/* Top Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="text-center md:text-start">
          <h1 className="superTitle">Tables</h1>
          <p className="secTitle">Your Preferred Location</p>
        </div>

        {/* Custom Dropdowns Container */}
        <div className="flex gap-3 w-full md:w-auto">
          
          {/* Custom Position Dropdown */}
          <div className="relative flex-1 md:w-48">
            <div 
              onClick={() => { setIsPosOpen(!isPosOpen); setIsLimitOpen(false); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider flex justify-between items-center cursor-pointer select-none shadow-sm"
            >
              {filterPosition === 'all' ? "All Positions" : filterPosition}
              <IoChevronDown className={`transition-transform ${isPosOpen ? 'rotate-180' : ''}`} />
            </div>

            {isPosOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-100 overflow-hidden">
                {["all", "window-side", "center", "corner", "outdoor"].map((pos) => (
                  <div 
                    key={pos}
                    onClick={() => { setFilterPosition(pos); setIsPosOpen(false); }}
                    className="px-4 py-2 text-[10px] font-bold uppercase hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    {pos}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Limit Dropdown */}
          <div className="relative flex-1 md:w-32">
            <div 
              onClick={() => { setIsLimitOpen(!isLimitOpen); setIsPosOpen(false); }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold uppercase tracking-wider flex justify-between items-center cursor-pointer select-none shadow-sm"
            >
              Show {limit}
              <IoChevronDown className={`transition-transform ${isLimitOpen ? 'rotate-180' : ''}`} />
            </div>

            {isLimitOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl z-100 overflow-hidden">
                {[6, 12, 20, 30].map((num) => (
                  <div 
                    key={num}
                    onClick={() => { setLimit(num); setIsLimitOpen(false); }}
                    className="px-4 py-2 text-[10px] font-bold uppercase hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                  >
                    Show {num}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Tables Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTables.length > 0 ? (
          filteredTables.map((table: any) => (
            <div 
              key={table._id} 
              className="group relative h-87.5 w-full rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500"
            >
              <img 
                src={table.image} 
                alt={table.tableNumber} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-black/80 to-transparent">
                <h3 className="text-white text-2xl font-black uppercase tracking-tighter">{table.tableNumber}</h3>
                <p className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">{table.position}</p>
              </div>

              <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
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
                    <p className="text-gray-300 text-[14px] leading-relaxed italic">
                      &quot;{table.description}&quot;
                    </p>
                  </div>
                
                </div>
                <div className="absolute top-4 right-4 text-white/20">
                    <IoLayersOutline size={40}/>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest">No tables found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllTables;