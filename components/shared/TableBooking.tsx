/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { createBooking } from "../../app/modules/booking/booking.api";
import { ICreateBookingRequest } from "../../app/modules/booking/booking.interface";
import img from "../../assets/img/tablebooking.png";
import { useSession } from "next-auth/react";

const TableBooking = () => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!session || !session.user) {
    toast.error("Please login first to reserve a table!");
    return;
  }

  setLoading(true);
  const formData = new FormData(e.currentTarget);

  const bookingData: ICreateBookingRequest = {
    userId: (session.user as any).id, 
    email: session.user.email as string,
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    address: (formData.get("address") as string) || "Not Specified",
    guest: Number(formData.get("guest")),
    time: formData.get("time") as string,
    date: formData.get("date") as string,
    specialRequest: (formData.get("specialRequest") as string) || "",
  };

  try {
    const res = await createBooking(bookingData);
    if (res.success) {
      toast.success("Table Reserved Successfully!");
      (e.target as HTMLFormElement).reset();
    }
  } catch (error: any) {
    console.error("Booking Error:", error.response?.data);
    toast.error(error?.response?.data?.message || "Failed to reserve table");
  } finally {
    setLoading(false);
  }
};
  return (
<section className="py-24 bg-[#EDEBD7]">
  <div className="max-w-7xl mx-auto px-6">

    <div className="flex flex-col lg:flex-row items-center gap-20">

      {/* LEFT FORM */}
<div className="w-full lg:w-1/2 p-10">

  <h2 className="text-[42px] font-semibold text-[#1a1a1a] mb-12 relative inline-block">
    Table Booking
    <span className="absolute -bottom-2 left-0 w-20 h-[4px] bg-[#C7A17A] rounded"></span>
  </h2>

  <form
    onSubmit={handleBooking}
    className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10"
  >

    {/* Reservation Date */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] text-gray-600 font-medium">
        Reservation Date
      </label>
      <input
        name="date"
        type="date"
        className="border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#C7A17A] transition"
        required
      />
    </div>

    {/* Reservation Time */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] text-gray-600 font-medium">
        Reservation Time
      </label>
      <input
        name="time"
        type="time"
        className="border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#C7A17A] transition"
        required
      />
    </div>

    {/* Guest */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] text-gray-600 font-medium">
        Guest Number
      </label>
      <input
        name="guest"
        type="number"
        placeholder="How many guests?"
        className="border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#C7A17A] transition"
        required
      />
    </div>

    {/* Name */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] text-gray-600 font-medium">
        Full Name
      </label>
      <input
        name="name"
        type="text"
        placeholder="Enter your name"
        className="border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#C7A17A] transition"
        required
      />
    </div>

    {/* Phone */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] text-gray-600 font-medium">
        Phone Number
      </label>
      <input
        name="phone"
        type="text"
        placeholder="Enter phone number"
        className="border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#C7A17A] transition"
        required
      />
    </div>

    {/* Special Request */}
    <div className="flex flex-col gap-2">
      <label className="text-[14px] text-gray-600 font-medium">
        Special Request
      </label>
      <textarea
        name="specialRequest"
        placeholder="Any special request?"
        rows={1}
        className="border-b border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#C7A17A] resize-none transition"
      />
    </div>

    {/* Button */}
    <div className="md:col-span-2 pt-6">
      <button
        type="submit"
        disabled={loading || !session}
        className="w-full bg-[#1E4A14] text-white py-4 rounded-xl font-semibold text-[17px] hover:bg-[#16380f] transition shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "Reserving..." : "Reserve Table"}
      </button>
    </div>

  </form>

</div>

      {/* RIGHT IMAGE */}
      <div className="w-full lg:w-1/2">
        <div className="relative h-[480px] rounded-[30px] overflow-hidden shadow-lg">
          <Image
            src={img}
            alt="table booking"
            fill
            className="object-cover hover:scale-105 transition duration-700"
          />
        </div>
      </div>

    </div>

  </div>
</section>
  );
};

export default TableBooking;
