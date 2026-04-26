"use client";

import React from "react";
import Image from "next/image";
import Navbar from "../shared/Navbar";
import CustomBtn from "./CustomBtn";

interface CommonHeroProps {
  subtitle?: string;
  title?: React.ReactNode;
  description?: string;
  buttonTitle?: string;
  buttonLink?: string;
  mainImage?: string;
  isCenter?: boolean;
}

const SingleHero = ({
  subtitle,
  title,
  description,
  buttonTitle,
  buttonLink,
  mainImage,
  isCenter = false,
}: CommonHeroProps) => {
  return (
    <div className="relative overflow-hidden flex flex-col pb-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773563794/3afac52152e35e30010981a1553eb6b0add11db0_y6nelx.png"
          alt="Banner Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1A4E11F0]/94 z-10" />
      </div>

      {/* Navbar Integration */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 pt-20">
        {/* Left/Center Content */}
        <div
          className={`w-full ${isCenter ? "text-center" : "lg:w-1/2 text-center lg:text-left"} space-y-6`}
        >
          {subtitle && (
            <div
              className={`flex items-center gap-3 mt-20 ${isCenter ? "justify-center" : "justify-center lg:justify-start"}`}
            >
              <span className="text-gray-300 uppercase tracking-widest text-sm font-bold ">
                {subtitle}
              </span>
              <div className="w-12 h-0.5 bg-gray-300"></div>
            </div>
          )}

          <h1 className="text-white text-5xl lg:text-7xl font-bold leading-[1.1]">
            {title}
          </h1>

          {/* <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0">
            {description}
          </p> */}
          <p className={`text-gray-300 text-lg md:text-xl max-w-2xl ${isCenter ? "mx-auto" : "mx-auto lg:mx-0"}`}>
    {description}
  </p>


          {buttonTitle && (
            <div className={`pt-4 ${isCenter ? "flex justify-center" : ""}`}>
              <CustomBtn
                title={buttonTitle}
                link={buttonLink}
                className={
                  isCenter
                    ? "bg-white text-[#1e3316]"
                    : "bg-[#1e3316] text-white"
                }
              />
            </div>
          )}
        </div>

        {/* Right Image (Only if mainImage is provided) */}
        {!isCenter && mainImage && (
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
              <Image
                src={mainImage}
                alt="Hero Feature"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>

      {/* Side Decorative Icons (Like the small tomato/leaves in your screenshot) */}
      <div className="absolute right-0 bottom-0">
        <Image
          width={209}
          height={290}
          alt="tomato"
          src={
            "https://res.cloudinary.com/dn5t9fhya/image/upload/v1773566661/9d94ced4fa581ea7095acfbdd8f900c7719fc123_sz9sqr.png"
          }
          className=""
        />
      </div>
    </div>
  );
};

export default SingleHero;
