"use client";
import React, { useState } from "react";
import Image from "next/image";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { AiFillStar } from "react-icons/ai";

import pp from "../../../../assets/img/aboutpp.png";
import rightbg from "../../../../assets/img/aboutright.png";

const chefsData = [
  {
    id: 1,
    name: "Chef Alex Thompson",
    role: "CHEF",
    rating: 4,
    description:
      "Meet Chef Alex Thompson, the creative mind behind our signature dishes. With years of culinary experience and a passion for flavor, he leads our kitchen team in crafting meals that make every dining experience truly memorable.",
    image: pp,
  },
  {
    id: 2,
    name: "Chef Maria Garcia",
    role: "EXECUTIVE CHEF",
    rating: 5,
    description:
      "Chef Maria brings a sweet touch to Savory Nest. Her expertise in global cuisines and innovative techniques ensures a perfect dining experience.",
    image: pp,
  },
];

const ChefsP = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentChef = chefsData[currentIndex];

  const nextChef = () =>
    setCurrentIndex((prev) => (prev === chefsData.length - 1 ? 0 : prev + 1));

  const prevChef = () =>
    setCurrentIndex((prev) => (prev === 0 ? chefsData.length - 1 : prev - 1));

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#F2F7E4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 flex flex-col lg:flex-row items-center gap-12">
        <div className="absolute right-0 top-0 opacity-80 hidden md:block">
          <Image src={rightbg} alt="decor" width={220} height={200} />
        </div>

        <div className="relative w-full lg:w-1/2 flex justify-center">

          <div className="absolute bottom-0 w-[90%] h-[75%] bg-[#3A4D39] rounded-[40px] rotate-[-3deg]" />

          <div className="relative z-10">
            <Image
              src={currentChef.image}
              alt={currentChef.name}
              width={450}
              height={600}
              className="object-contain max-h-[420px] md:max-h-[520px]"
              priority
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-white rounded-[35px] p-7 md:p-12 shadow-md">

          <span className="text-[#8BA486] font-semibold tracking-widest text-xs uppercase">
            {currentChef.role}
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            Our Chef's Profile
          </h2>

          <h3 className="text-xl font-bold">{currentChef.name}</h3>

          <div className="flex gap-1 mt-2 mb-5">
            {[...Array(5)].map((_, i) => (
              <AiFillStar
                key={i}
                size={18}
                className={
                  i < currentChef.rating
                    ? "text-[#8BA486]"
                    : "text-gray-200"
                }
              />
            ))}
          </div>

          <p className="text-gray-500 leading-relaxed mb-8 text-sm md:text-base">
            {currentChef.description}
          </p>

          {/* buttons */}
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