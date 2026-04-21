"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import resbg from "../../assets/img/bg.png";
import res1 from "../../assets/img/reserve1.png";
import res2 from "../../assets/img/rese2.png";

const Reserve = () => {
  const router = useRouter();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const leftImgRef = useRef<HTMLDivElement | null>(null);
  const rightImgRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // section fade
      gsap.from(sectionRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // content animation
      gsap.from(contentRef.current, {
        y: 80,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });

      // left image
      gsap.from(leftImgRef.current, {
        x: -120,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });

      // right image
      gsap.from(rightImgRef.current, {
        x: 120,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 md:py-20 px-4 md:px-10 overflow-hidden"
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src={resbg}
          alt="background"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 max-w-7xl mx-auto bg-white rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden">
        <div className="w-full flex flex-col lg:flex-row items-center relative min-h-[500px] lg:h-[450px]">
          {/* LEFT IMAGE */}
          <div
            ref={leftImgRef}
            className="hidden lg:block absolute bottom-0 left-0 w-[260px] xl:w-[300px] z-20 pointer-events-none"
          >
            <Image
              src={res1}
              alt="kabab"
              width={400}
              height={400}
              className="w-full h-auto object-contain translate-y-8"
            />
          </div>

          {/* CONTENT */}
          <div
            ref={contentRef}
            className="z-30 w-full lg:max-w-xl mx-auto text-center py-16 px-6 md:px-12"
          >
            <h2 className="text-3xl md:text-[44px] xl:text-[48px] font-bold text-[#1a1a1a] leading-[1.1] mb-5">
              Book Your Dining Experience Today!
            </h2>

            <p className="description mb-10 font-medium text-gray-500">
              Unlock a Culinary Journey Like No Other at Savory Nest.
            </p>

            {/* INPUT */}
            <div className="relative max-w-md mx-auto flex flex-col sm:flex-row items-center bg-[#f2f7e4] border border-[#e8f0d5] rounded-[20px] sm:rounded-full p-1.5 gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full flex-grow bg-transparent px-6 py-3 text-gray-700 outline-none placeholder:text-gray-400 text-[15px]"
              />

              <button
                onClick={() => router.push("/reservation")}
                className="w-full sm:w-auto bg-[#2d402d] hover:bg-[#1a261a] text-white px-8 py-3.5 rounded-[15px] sm:rounded-full font-bold text-[15px] transition-all whitespace-nowrap"
              >
                Reserve Now
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div
            ref={rightImgRef}
            className="hidden lg:block absolute top-[-150] right-0 h-full w-[35%] xl:w-[40%] z-10"
          >
            <div className="relative w-full h-full">
              <Image
                src={res2}
                alt="pan fry"
                fill
                className="object-contain object-right"
                priority
              />
            </div>
          </div>

          {/* MOBILE DECOR */}
          <div className="lg:hidden absolute bottom-[-20px] right-[-20px] w-32 opacity-20">
            <Image src={res2} alt="decoration" width={200} height={200} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reserve;
