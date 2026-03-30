"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { getAllFeedbacks } from "../app/modules/feedback/feedback.api";
import { ITestimonial } from "../types/testimonial.interface";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const Testimonial = () => {
  const [feedbacks, setFeedbacks] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await getAllFeedbacks();
        if (res?.success && res?.data) {
          // ডাটাবেসে থাকা ৭টি ডাটাই এখানে আসবে
          setFeedbacks(res.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center font-bold text-[#3A4D39]">
        Loading Testimonials...
      </div>
    );
  }

  return (
    <section className="relative  md:py-24 py-10 border-b border-[#3A4D39]/10 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dme9eydlq/image/upload/v1774760460/1d268939c20db529607350e532b6a64c904b6dd6_oks0nk.png')" }}
      />

      {/* Overlay (halka color) */}
      <div className="absolute inset-0 bg-[#F5F5DC]/90"></div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl text-left">
            <span className="text-[#3A4D39] font-bold tracking-[0.2em] uppercase text-sm mb-3 block">
              TESTIMONIAL
            </span>
            <h2 className="text-4xl md:text-[56px] font-bold text-[#1a1a1a] leading-[1.1]">
              What Our Guests Say
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mb-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-[52px] h-[52px] rounded-lg border border-gray-300 flex items-center justify-center bg-white hover:bg-[#3A4D39] hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
            >
              <HiOutlineArrowLeft size={24} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-[52px] h-[52px] rounded-lg bg-[#3A4D39] text-white flex items-center justify-center hover:bg-[#2d3d2d] shadow-lg transition-all duration-300 cursor-pointer"
            >
              <HiOutlineArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
              slidesPerGroup: 1,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
          }}
          className="testimonial-swiper md:!pb-10"
        >
          {feedbacks.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-[28px] shadow-[0px_10px_30px_rgba(0,0,0,0.05)] border border-[#E8EED5] flex flex-col h-full relative group hover:border-[#3A4D39]/30 transition-all duration-500 min-h-[340px]">
                {/* Quote Icon */}
                <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg width="45" height="35" viewBox="0 0 45 35">
                    <path
                      d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 5.6 25 12.5 25H15C15 30.5 10.5 35 5 35V30C8.3 30 11 27.3 11 24V12.5C11 5.6 5.4 0 0 0H12.5ZM42.5 0C35.6 0 30 5.6 30 12.5C30 19.4 35.6 25 42.5 25H45C45 30.5 40.5 35 35 35V30C38.3 30 41 27.3 41 24V12.5C41 5.6 35.4 0 30 0H42.5Z"
                      fill="#3A4D39"
                    />
                  </svg>
                </div>

                {/* User */}
                <div className="flex items-center gap-4 mb-8 text-left">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FDFEF4] shadow-md bg-gray-50 flex-shrink-0">
                    <Image
                      src={
                        item.companyLogo ||
                        "https://res.cloudinary.com/dme9eydlq/image/upload/v1774687848/da51eeb666b47082979fc8f73e09a33816df2fe2_gkasir.jpg"
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[22px] font-bold text-[#1a1a1a] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[#3A4D39]/70 text-sm font-semibold uppercase tracking-wider">
                      {item.designation}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#555555] text-[17px] leading-[1.7] italic text-left">
                  "{item.description}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
