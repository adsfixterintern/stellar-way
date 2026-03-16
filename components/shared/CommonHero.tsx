import React from "react";
import Image from "next/image";
import Navbar from "../shared/Navbar";
import { Play } from "lucide-react";
import CustomButton from "./CustomBtn";

interface CommonHeroProps {
  title: React.ReactNode;
  description: string;
  mainImage: string;
  buttonText: string;
  buttonPath: string;
  isAboutPage?: boolean;
}

const CommonHero = ({
  title,
  description,
  mainImage,
  buttonText,
  buttonPath,
  isAboutPage = false,
}: CommonHeroProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Image */}
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

      {/* Navbar Call */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto  pt-32 lg:pt-40 pb-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* pata icon */}
        <div className="absolute top-24 right-180 ">
          <Image
            width={44}
            height={84}
            alt="pata icon"
            src={
              "https://res.cloudinary.com/dn5t9fhya/image/upload/v1773631792/5ac3ee29ac4640e424f5dc9bacca419667a64f4f_seh1ho.png"
            }
            className="rotate-[65deg]"
          />
        </div>
        {/* tomato icon */}
        <div className="absolute -right-32 top-22">
          <Image
            width={209}
            height={290}
            alt="tomato"
            src={
              "https://res.cloudinary.com/dn5t9fhya/image/upload/v1773566661/9d94ced4fa581ea7095acfbdd8f900c7719fc123_sz9sqr.png"
            }
            className="-rotate-[16deg]"
          />
        </div>

        {/* Left Content Area */}
        <div
          className={`w-full ${isAboutPage ? "lg:w-[45%]" : "lg:w-1/2"} space-y-8 text-center lg:text-left`}
        >
          <div className="space-y-6">
            {isAboutPage && (
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="text-gray-400 uppercase tracking-widest text-sm font-bold">
                  About Us
                </span>
                <div className="w-12 h-[1px] bg-gray-400"></div>
              </div>
            )}

            <h1 className="text-white text-5xl lg:text-7xl font-bold leading-[1.1]">
              {title}
            </h1>

            <p className="text-gray-300 text-lg font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>
          </div>

         <CustomButton
          title={buttonText}
          link={buttonPath}
         />
        </div>

        {/* Right Content Area (Image/Video) */}
        <div
          className={`relative w-full ${isAboutPage ? "lg:w-[55%]" : "lg:w-1/2"} flex justify-center lg:justify-end`}
        >
          <div
            className={`relative ${isAboutPage ? "w-full aspect-video rounded-3xl overflow-hidden" : "w-[320px] h-[320px] md:w-[500px] md:h-[500px]"}`}
          >
            <Image
              src={mainImage}
              alt="Hero Visual"
              fill
              className={`${isAboutPage ? "object-cover" : "object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"}`}
            />

            {isAboutPage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group cursor-pointer">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonHero;
