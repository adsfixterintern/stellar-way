

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTables } from "@/app/hooks/useTables"; 
import { useAvailability } from "@/app/hooks/useAvailability"; 
import { createBooking } from "@/app/modules/booking/booking.api";
import bookingtableHero from "@/assets/img/bookingtableHero.png";
import { IoChevronDown, IoCheckmark, IoWalletOutline } from "react-icons/io5";

const TableReservationForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as any;
  
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTables, setSelectedTables] = useState<string[]>([]);

  const { data: tablesResponse } = useTables(); 
  const { data: bookedTableIds = [], isLoading: isChecking } = useAvailability(date, startTime, endTime);

  const allTables = tablesResponse?.data || [];

  useEffect(() => {
    setSelectedTables([]);
  }, [date, startTime, endTime]);

  const availableTables = allTables.filter((table: any) => {
    const isBooked = bookedTableIds.some(
      (bookedId: string) => String(bookedId) === String(table._id)
    );
    return table.status === "available" && !isBooked;
  });

 
  const calculateTotalBill = () => {
    if (!startTime || !endTime || selectedTables.length === 0) return 0;
    const start = new Date(`2026-01-01T${startTime}`);
    const end = new Date(`2026-01-01T${endTime}`);
    const diffInMs = end.getTime() - start.getTime();
    const hours = diffInMs / (1000 * 60 * 60);
    if (hours <= 0) return 0;
    return (selectedTables.length * 200 * hours).toFixed(0);
  };

  const toggleTable = (id: string) => {
    setSelectedTables(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "unauthenticated") {
      toast.error("Please login first");
      return router.push("/login");
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      userId: user.id || user._id, 
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: user.email,
      phone: formData.get("phone") as string,
      address: (formData.get("address") as string) || "Not Specified",
      guest: Number(formData.get("guest")),
      date, startTime, endTime,     
      tableIds: selectedTables, 
      totalPrice: Number(calculateTotalBill()) // ব্যাকএন্ডে প্রাইস পাঠানোর জন্য
    };

    try {
      const res = await createBooking(payload);
      if (res.success) {
        toast.success("Reservation Successful!");
        setSelectedTables([]);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <section 
        className="py-20 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(228, 245, 220, 0.9), rgba(228, 245, 220, 0.9)), url(${bookingtableHero.src})` }}
      >
        <div className="text-center mb-12">
          <h1 className="superTitle">Reserve</h1>
          <p className="secTitle">Table Booking Form</p>
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-6 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold">First Name</label>
                <input required name="firstName" type="text" defaultValue={user?.name?.split(" ")[0]} className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Last Name</label>
                <input required name="lastName" type="text" defaultValue={user?.name?.split(" ")[1]} className="form-input" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Arrival</label>
                <input required type="time" onChange={(e) => setStartTime(e.target.value)} className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Departure</label>
                <input required type="time" onChange={(e) => setEndTime(e.target.value)} className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Date</label>
                <input required type="date" min={new Date().toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Guests</label>
                <input required name="guest" type="number" min="1" className="form-input" />
              </div>

              {/* Table Selection Dropdown */}
              <div className="md:col-span-2 space-y-2 relative" ref={dropdownRef}>
                <label className="text-sm font-bold flex justify-between">
                  <span>Select Table(s) <span className="text-orange-600 ml-2 font-normal">(200 TK/hr per table)</span></span>
                  {(!date || !startTime || !endTime) && (
                    <span className="text-[10px] text-red-500 italic">Select time first!</span>
                  )}
                </label>
                
                <div 
                  onClick={() => (date && startTime && endTime) && setIsDropdownOpen(!isDropdownOpen)}
                  className={`form-input flex justify-between items-center cursor-pointer ${(!date || !startTime || !endTime) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                >
                  <span className={selectedTables.length > 0 ? "text-[#1D3A15] font-bold" : "text-gray-400"}>
                    {isChecking ? "Checking..." : selectedTables.length > 0 ? `${selectedTables.length} Selected` : "Choose Tables"}
                  </span>
                  <IoChevronDown />
                </div>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white  rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto p-2">
                    {availableTables.map((table: any) => (
                      <div 
                        key={table._id}
                        onClick={() => toggleTable(table._id)}
                        className={`flex items-center justify-between p-3 mb-1 rounded-xl cursor-pointer ${selectedTables.includes(table._id) ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'}`}
                      >
                        <div>
                          <p className="font-bold text-[#1D3A15]">Table {table.tableNumber}</p>
                          <p className="text-[10px] text-gray-500">{table.position} • {table.totalSeat} Seats</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-orange-600">200 TK/hr</p>
                           {selectedTables.includes(table._id) && <IoCheckmark className="text-green-600 inline-block" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Phone</label>
                <input required name="phone" type="text" className="form-input" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Address</label>
                <input required name="address" type="text" className="form-input" />
              </div>

              {/* Live Bill Summary */}
              {selectedTables.length > 0 && Number(calculateTotalBill()) > 0 && (
                <div className="md:col-span-2 bg-[#F3F6F2] p-5 rounded-2xl border-l-4 border-[#1A4E11] flex justify-between items-center transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm"><IoWalletOutline className="text-xl text-[#1A4E11]" /></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Bill</p>
                      <p className="text-[10px] text-gray-400 italic">Rate: Tables ({selectedTables.length}) × 200 TK</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-[#1A4E11]">{calculateTotalBill()} TK</p>
                  </div>
                </div>
              )}

              <button
                disabled={loading || Number(calculateTotalBill()) <= 0 && selectedTables.length > 0}
                type="submit"
                className="md:col-span-2 w-full bg-[#1A4E11] text-white py-4 rounded-xl font-bold uppercase hover:bg-[#1A4E11]/90 transition-all disabled:bg-gray-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                {loading ? "Booking..." : `Confirm Booking`}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx>{`
        .form-input { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #e5e7eb; background-color: #f9fafb; outline: none; transition: all 0.2s; }
        .form-input:focus { border-color: #1D3A15; background-color: white; box-shadow: 0 0 0 4px rgba(29, 58, 21, 0.05); }
      `}</style>
    </div>
  );
};

export default TableReservationForm;

