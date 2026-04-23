/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CommonHero from "@/components/shared/CommonHero";
import Contact from "@/components/shared/Contact";
import reservationImg from "@/assets/img/reservationHero.jpg";
import bookingtableHero from "@/assets/img/bookingtableHero.png";
import { createBooking } from "@/app/modules/booking/booking.api"; 

const ReservationPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const user = session?.user as any;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

      if (status === "unauthenticated" || !user) {
      toast.error("Please login to book a table");
      router.push("/login");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);


    const payload: any = {
      userId: user.id || user._id, 
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: user.email,
      phone: formData.get("phone") as string,
      address: (formData.get("address") as string) || "Not Specified",
      guest: Number(formData.get("guest")),
      time: formData.get("time") as string,
      date: formData.get("date") as string,
      specialRequest: "", 
    };

    try {
      const res = await createBooking(payload);
      
      if (res.success) {
        toast.success("Table reserved successfully!");
        (e.target as HTMLFormElement).reset();
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1D3A15]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <CommonHero
        isAboutPage={true}
        title={
          <span>
            Reserve Your <br /> Table
          </span>
        }
        description="Book your table at Savory Nest and enjoy a delightful dining experience with friends and family."
        mainImage={reservationImg.src}
        buttonText=""
        buttonPath=""
        youtubeVideoId="14QoPp2Wl7E"
      />

      <section className="py-20 bg-cover bg-center bg-no-repeat"
      style={{
          backgroundImage: `linear-gradient(rgba(228, 245, 220, 0.9), rgba(228, 245, 220, 0.9)), url(${bookingtableHero.src})`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <p className="superTitle">FORM</p>
            <h2 className="secTitle">Online Booking Form</h2>
          </div>

          <div className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
              {/* First Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">First Name</label>
                <input
                  required
                  name="firstName"
                  type="text"
                  defaultValue={user?.name?.split(" ")[0] || ""}
                  placeholder="Input your first name"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Last Name</label>
                <input
                  required
                  name="lastName"
                  type="text"
                  defaultValue={user?.name?.split(" ")[1] || ""}
                  placeholder="Input your last name"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Phone Number</label>
                <input
                  required
                  name="phone"
                  type="text"
                  placeholder="Input your phone number"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Email (Read Only as it's from session) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Email</label>
                <input
                  readOnly
                  value={user?.email || ""}
                  name="email"
                  type="email"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#f0f0f0] cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Address</label>
                <input
                  name="address"
                  type="text"
                  placeholder="Input your address"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">Guests</label>
                <input
                  required
                  name="guest"
                  type="number"
                  min="1"
                  placeholder="Number of guests"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">Time</label>
                  <input
                    required
                    name="time"
                    type="time"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">Date</label>
                  <input
                    required
                    name="date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]} 
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-6">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full blockBtn disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Reserve Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div className="py-20 bg-white">
        <Contact />
      </div>
    </div>
  );
};

export default ReservationPage;