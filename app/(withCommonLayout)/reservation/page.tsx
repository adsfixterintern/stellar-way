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

    const payload = {
      userId: user._id || user.id,
      guest: Number(formData.get("guest")),
      time: formData.get("time"),
      date: formData.get("date"),
      address: formData.get("address") || "Not Specified",
      name: user.name,
      email: user.email,
      phone: formData.get("phone"),
    };

    try {
      //   console.log("Sending Data:", payload);
      toast.success("Table reserved successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Loading...
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
      />

      {/* ২. Online Booking Form Section */}
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
                <label className="text-sm font-bold text-gray-800 ml-1">
                  First Name
                </label>
                <input
                  required
                  name="firstName"
                  type="text"
                  placeholder="Input your first name"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">
                  Last Name
                </label>
                <input
                  required
                  name="lastName"
                  type="text"
                  placeholder="Input your last name"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-800 ml-1">
                  Phone Number
                </label>
                <input
                  required
                  name="phone"
                  type="text"
                  placeholder="Input your phone number"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Email (Pre-filled if logged in) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-800 ml-1">
                  Email
                </label>
                <input
                  defaultValue={user?.email || ""}
                  name="email"
                  type="email"
                  placeholder="Input your email"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-800 ml-1">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  placeholder="Input your address"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Guests */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-800 ml-1">
                  Guests
                </label>
                <input
                  required
                  name="guest"
                  type="number"
                  placeholder="Number of guests"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                />
              </div>

              {/* Date & Time Container */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">
                    Time
                  </label>
                  <input
                    required
                    name="time"
                    type="time"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-800 ml-1">
                    Date
                  </label>
                  <input
                    required
                    name="date"
                    type="date"
                    className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-[#F9FBF9] focus:outline-none focus:ring-1 focus:ring-[#1D3A15] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-6">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full blockBtn"
                >
                  {loading ? "Processing..." : "Reserve"}
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
