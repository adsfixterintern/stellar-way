/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { getAllChefFromDB } from "@/app/modules/chef/chef.api";
import rightbg from "../../../../assets/img/aboutright.png";

/* ---------------- Skeleton ---------------- */
const ChefSkeleton = () => {
  return (
    <div className="w-full lg:w-1/2 bg-white rounded-[35px] p-7 md:p-12 shadow-md animate-pulse">
      <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
      <div className="h-8 w-3/4 bg-gray-200 rounded mb-6" />
      <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />

      <div className="flex gap-2 mb-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-4/6 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

const ChefsP = () => {
  const [chefs, setChefs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await getAllChefFromDB();
        if (res?.data) {
          setChefs(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const currentChef = chefs[currentIndex];

  const nextChef = () =>
    setCurrentIndex((prev) => (prev === chefs.length - 1 ? 0 : prev + 1));

  const prevChef = () =>
    setCurrentIndex((prev) => (prev === 0 ? chefs.length - 1 : prev - 1));

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <section className="py-20 bg-[#F2F7E4]">
        <div className="max-w-7xl mx-auto px-5 flex justify-center">
          <ChefSkeleton />
        </div>
      </section>
    );
  }

  if (!chefs.length) {
    return (
      <div className="text-center py-20 text-gray-500">
        No chefs found
      </div>
    );
  }

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#F2F7E4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 flex flex-col lg:flex-row items-center gap-12">

        {/* BG DECOR */}
        <div className="absolute right-0 top-0 opacity-80 hidden md:block">
          <Image src={rightbg} alt="decor" width={220} height={200} />
        </div>

        {/* ================= IMAGE SECTION ================= */}
        <div className="relative w-full lg:w-1/2 flex justify-center items-center">

          {/* glow background */}
          <div className="absolute w-[360px] h-[460px] bg-[#3A4D39]/10 rounded-[50px] blur-2xl" />

          {/* tilted background */}
          <div className="absolute bottom-0 w-[85%] h-[80%] bg-gradient-to-br from-[#3A4D39] to-[#1f2e1c] rounded-[45px] rotate-[-3deg] shadow-2xl" />

          {/* image wrapper */}
          <div className="relative z-10 group">

            {/* glow ring */}
            <div className="absolute -inset-4 rounded-[40px] bg-[#8BA486]/20 blur-xl opacity-70 group-hover:opacity-100 transition" />

            {/* image */}
            <div className="relative overflow-hidden rounded-[40px] border-4 border-white shadow-2xl bg-white">
              <Image
                src={currentChef?.image}
                alt={currentChef?.name}
                width={450}
                height={600}
                className="object-cover w-[320px] md:w-[420px] h-[420px] md:h-[520px] transform group-hover:scale-105 transition duration-700"
              />
            </div>

            {/* rating badge */}
            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#3A4D39] shadow">
              ⭐ {currentChef?.rating || 0}
            </div>

            {/* status badge */}
            <div
              className={`absolute bottom-5 right-5 px-3 py-1 rounded-full text-xs font-bold uppercase shadow ${
                currentChef?.status === "active"
                  ? "bg-green-100 text-green-700"
                  : currentChef?.status === "inactive"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {currentChef?.status}
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="w-full lg:w-1/2 bg-white rounded-[35px] p-7 md:p-12 shadow-md">

          {/* DESIGNATION + STATUS */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#8BA486] font-semibold tracking-widest text-xs uppercase">
              {currentChef?.designation}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-3">
            Chef Profile
          </h2>

          <h3 className="text-xl font-bold">{currentChef?.name}</h3>

          <p className="text-sm text-gray-500 mt-1 mb-3">
            Speciality: {currentChef?.speciality}
          </p>

          {/* STARS */}
          <div className="flex gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <AiFillStar
                key={i}
                size={18}
                className={
                  i < Math.round(currentChef?.rating || 0)
                    ? "text-[#8BA486]"
                    : "text-gray-200"
                }
              />
            ))}
          </div>

          {/* BIO */}
          <p className="text-gray-500 leading-relaxed mb-8 text-sm md:text-base">
            {currentChef?.bio}
          </p>

          {/* NAV BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={prevChef}
              className="w-12 h-12 rounded-lg border flex items-center justify-center hover:bg-[#3A4D39] hover:text-white transition"
            >
              <HiArrowLeft size={24} />
            </button>

            <button
              onClick={nextChef}
              className="w-12 h-12 rounded-lg border flex items-center justify-center hover:bg-[#3A4D39] hover:text-white transition"
            >
              <HiArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefsP;
