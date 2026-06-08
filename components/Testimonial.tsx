/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";

// API
import { getAllPublishedFeedbacks } from "@/app/modules/feedback/feedback.api";
import { IFeedback } from "@/app/modules/feedback/feedback.interface";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* -------------------- SKELETON -------------------- */
const TestimonialSkeleton = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-10 animate-pulse">
      {/* Description Skeleton */}
      <div className="w-full space-y-3 mb-14 px-4">
        <div className="h-4 bg-gray-300/50 rounded-full w-full"></div>
        <div className="h-4 bg-gray-300/50 rounded-full w-5/6 mx-auto"></div>
        <div className="h-4 bg-gray-300/50 rounded-full w-4/6 mx-auto"></div>
      </div>

      {/* Profile Image Skeleton */}
      <div className="w-20 h-20 rounded-full bg-gray-300/50 mb-4 shadow-xl"></div>

      {/* Name and Designation Skeleton */}
      <div className="h-6 bg-gray-300/50 rounded-md w-32 mb-2"></div>
      <div className="h-3 bg-gray-300/50 rounded-md w-24"></div>
    </div>
  );
};

/* -------------------- COMPONENT -------------------- */
const Testimonial = () => {
  const swiperRef = useRef<any>(null);
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const res = await getAllPublishedFeedbacks();
        if (res.success) setFeedbacks(res.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (!loading && feedbacks.length === 0) return null;

  return (
    <section className="relative md:py-24 py-10 border-b border-[#3A4D39]/10 overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dme9eydlq/image/upload/v1774760460/1d268939c20db529607350e532b6a64c904b6dd6_oks0nk.png')",
        }}
      />
      <div className="absolute inset-0 bg-[#F5F5DC]/90"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="superTitle flex mb-2 items-center gap-2">
              Testimonial
            </span>
            <h2 className="secTitle leading-[1.1]">
              Sounds <span className="text-[#1a4e11]">That Matter</span>
            </h2>
          </div>

          <div className="hidden md:flex gap-4 pb-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="px-3 py-2 rounded-lg border border-gray-400 text-[#3A4D39] hover:bg-gray-100 transition-all"
            >
              <ArrowLeft size={20} />
            </button>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="px-3 py-2 rounded-lg bg-[#3A4D39] text-white hover:bg-[#2d3d2d] transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          loop={!loading}
          speed={1000}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="testimonial-swiper relative"
        >
          {loading ? (
            <SwiperSlide>
              <TestimonialSkeleton />
            </SwiperSlide>
          ) : (
            feedbacks.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-10 relative">
                  <p className="text-[#555] text-[18px] md:text-[22px] leading-[1.8] italic mb-14 px-4 font-medium">
                    &quot;{item.description}&quot;
                  </p>

                  <div className="flex flex-col items-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 mb-4">
                      <Image
                        src={
                          (item?.userId as any)?.image ||
                          "https://ui-avatars.com/api/?name=User"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-[24px] font-bold text-[#1a1a1a]">
                      {item.name}
                    </h4>
                    <p className="text-[#3A4D39]/70 text-[12px] font-black uppercase tracking-widest mt-1">
                      {item.designation}
                    </p>
                  </div>

                  {/* Quotation SVG */}
                  <div className="absolute bottom-0 right-0 md:right-10 opacity-30 hidden md:block transform rotate-180">
                    <svg
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="#3A4D39"
                      stroke="white"
                      strokeWidth="0.5"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
