"use client";
import React from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import bg from "@/assets/img/expbg.png";

const Exp = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="w-full relative group z-10">
        <div className="relative w-full h-[350px] md:h-[550px] lg:h-[650px] overflow-hidden bg-black shadow-none">
          <Image
            src={bg}
            alt="Experience Savory Nest"
            fill
            className="object-cover brightness-[0.5] group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            priority
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-3xl md:text-[50px] lg:text-[72px] font-bold text-white mb-4 tracking-tight leading-tight">
              Experience Savory Nest
            </h2>

            <p className="text-white/80 text-[14px] md:text-[18px] font-normal tracking-[0.2em] mb-12 uppercase">
              Take a Virtual Tour of Our Restaurant
            </p>

            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full animate-pulse"></div>

              <button className="relative w-16 h-16 md:w-20 md:h-20 bg-[#2d402d] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110">
                <FaPlay className="ml-1 text-xl md:text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Exp;
