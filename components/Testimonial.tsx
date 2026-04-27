/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// API
import { getAllPublishedFeedbacks } from "@/app/modules/feedback/feedback.api";
import { IFeedback } from "@/app/modules/feedback/feedback.interface";

/* -------------------- SKELETON -------------------- */
const TestimonialSkeleton = () => {
  return (
    <div className="bg-white/70 p-8 rounded-[28px] border border-gray-100 animate-pulse min-h-[340px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
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
        if (res.success) {
          setFeedbacks(res.data);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  console.log(feedbacks);


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
            <span className="text-[#3A4D39] font-bold tracking-[0.2em] uppercase text-sm block mb-3">
              TESTIMONIAL
            </span>
            <h2 className="text-4xl md:text-[56px] font-bold text-[#1a1a1a] leading-[1.1]">
              What Our Guests Say
            </h2>
          </div>

          {/* Custom Navigation Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-[52px] h-[52px] rounded-lg border border-gray-300 flex items-center justify-center bg-white hover:bg-[#3A4D39] hover:text-white transition-all shadow-sm"
            >
              <HiOutlineArrowLeft size={24} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-[52px] h-[52px] rounded-lg bg-[#3A4D39] text-white flex items-center justify-center hover:bg-[#2d3d2d] transition-all shadow-sm"
            >
              <HiOutlineArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="testimonial-swiper"
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <TestimonialSkeleton />
                </SwiperSlide>
              ))
            : feedbacks.map((item) => (
                <SwiperSlide key={item._id}>
                  <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-[28px] border border-[#E8EED5] flex flex-col min-h-[360px] group hover:border-[#3A4D39]/30 hover:shadow-xl transition-all duration-500">
                    {/* User Profile Info */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-50 shrink-0">
                        <Image
                          src={
                            item?.userId?.image
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-[20px] md:text-[22px] font-bold text-[#1a1a1a] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[#3A4D39]/70 text-[12px] font-bold uppercase tracking-wider">
                          {item.designation || "Customer"}
                        </p>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="relative">
                      {/* Quote Icon Background (Optional) */}
                      <span className="absolute -top-4 -left-2 text-6xl text-[#3A4D39]/5 font-serif select-none">
                        “
                      </span>
                      <p className="text-[#555] text-[16px] md:text-[17px] leading-[1.8] italic relative z-10">
                        {item.description};
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
