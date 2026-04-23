/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";
import { getAllChefFromDB } from "@/app/modules/chef/chef.api";
import rightbg from "../../../../assets/img/aboutright.png";

/* ---------------- Average Rating Helper ---------------- */
const getAverageRating = (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
  return (total / reviews.length).toFixed(1);
};

/* ---------------- Skeleton ---------------- */
const ChefSkeleton = () => (
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

const ChefsP = () => {
  const [chefs, setChefs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await getAllChefFromDB();
        if (res?.data) setChefs(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChefs();
  }, []);

  const currentChef = chefs[currentIndex];
  const avgRating = getAverageRating(currentChef?.reviews);
  const totalReviews = currentChef?.reviews?.length || 0;

  const nextChef = () =>
    setCurrentIndex((prev) => (prev === chefs.length - 1 ? 0 : prev + 1));
  const prevChef = () =>
    setCurrentIndex((prev) => (prev === 0 ? chefs.length - 1 : prev - 1));

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
      <div className="text-center py-20 text-gray-500">No chefs found</div>
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

  {/* Clean card wrapper */}
  <div className="relative group">

    {/* Image */}
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white border border-gray-100">
      <Image
        src={currentChef?.image}
        alt={currentChef?.name}
        width={450}
        height={600}
        className="object-cover w-[320px] md:w-[400px] h-[420px] md:h-[500px] transition duration-500 group-hover:scale-105"
      />

      {/* Dark gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Name + Designation over image */}
      <div className="absolute bottom-5 left-5">
        <p className="text-white font-bold text-lg leading-tight">
          {currentChef?.name}
        </p>
        <p className="text-white/70 text-xs mt-0.5">{currentChef?.designation}</p>
      </div>
    </div>

    {/* Rating Badge - top right */}
    <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow flex items-center gap-1">
      <AiFillStar size={13} className="text-yellow-400" />
      <span className="text-xs font-bold text-gray-700">{avgRating}</span>
      <span className="text-xs text-gray-400">({totalReviews})</span>
    </div>

    {/* Status Badge - top left */}
    <div
      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase shadow ${
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
        <div className="w-full lg:w-1/2 bg-white rounded-[35px] p-7 md:p-12 ">

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

          {/* ✅ Stars + Rating Text */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <AiFillStar
                  key={i}
                  size={18}
                  className={
                    i < Math.round(Number(avgRating))
                      ? "text-[#8BA486]"
                      : "text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {avgRating}
            </span>
            <span className="text-sm text-gray-400">
              ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>

          <p className="text-gray-500 leading-relaxed mb-8 text-sm md:text-base">
            {currentChef?.bio}
          </p>

          {/* ✅ Nav + Chef Counter */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevChef}
              className="w-12 h-12 rounded-lg border flex items-center justify-center hover:bg-[#3A4D39] hover:text-white transition"
            >
              <HiArrowLeft size={24} />
            </button>

            <span className="text-sm text-gray-400">
              {currentIndex + 1} / {chefs.length}
            </span>

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