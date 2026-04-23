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

/* -------------------- STATIC DATA -------------------- */
const feedbacks = [
  {
    id: 1,
    companyLogo: "https://i.pravatar.cc/100?img=1",
    review:
      "Savory Nest offers an extraordinary dining experience. The food is exquisite, and the ambiance is perfect for a special night out. Highly recommended!",
    userImage: "https://i.pravatar.cc/100?img=11",
    name: "John Doe",
    designation: "Food Blogger",
  },
  {
    id: 2,
    companyLogo: "https://i.pravatar.cc/100?img=2",
    review:
      "From the moment we walked in, we were treated like royalty. The service was impeccable, and the dishes were masterpieces. Can't wait to come back!",
    userImage: "https://i.pravatar.cc/100?img=12",
    name: "Michael Lee",
    designation: "Content Creator",
  },
  {
    id: 3,
    companyLogo: "https://i.pravatar.cc/100?img=3",
    review:
      "Savory Nest has become our go-to place for celebrations. The chef’s tasting menu is a culinary journey that never disappoints.",
    userImage: "https://i.pravatar.cc/100?img=13",
    name: "Michael Smith",
    designation: "Travel Vlogger",
  },
  {
    id: 4,
    companyLogo: "https://i.pravatar.cc/100?img=4",
    review:
      "Absolutely loved the atmosphere and attention to detail. Every dish felt carefully crafted and full of flavor.",
    userImage: "https://i.pravatar.cc/100?img=14",
    name: "Sarah Johnson",
    designation: "Lifestyle Blogger",
  },
  {
    id: 5,
    companyLogo: "https://i.pravatar.cc/100?img=5",
    review:
      "One of the best dining experiences I’ve ever had. The staff was friendly and the presentation was world-class.",
    userImage: "https://i.pravatar.cc/100?img=15",
    name: "David Brown",
    designation: "Chef",
  },
  {
    id: 6,
    companyLogo: "https://i.pravatar.cc/100?img=6",
    review:
      "The flavors were unforgettable. Every bite felt like a story. Truly a premium restaurant experience.",
    userImage: "https://i.pravatar.cc/100?img=16",
    name: "Emily Davis",
    designation: "Food Critic",
  },
  {
    id: 7,
    companyLogo: "https://i.pravatar.cc/100?img=7",
    review:
      "Perfect place for family dinners and celebrations. The environment is cozy and elegant at the same time.",
    userImage: "https://i.pravatar.cc/100?img=17",
    name: "Robert Wilson",
    designation: "Photographer",
  },
  {
    id: 8,
    companyLogo: "https://i.pravatar.cc/100?img=8",
    review:
      "Exceptional service and outstanding food quality. Everything was beyond expectations. Will definitely visit again!",
    userImage: "https://i.pravatar.cc/100?img=18",
    name: "Anna Taylor",
    designation: "Travel Blogger",
  },
];


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
  const [loading, setLoading] = useState(true);

  // fake loading (demo feel)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative md:py-24 py-10 border-b border-[#3A4D39]/10 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dme9eydlq/image/upload/v1774760460/1d268939c20db529607350e532b6a64c904b6dd6_oks0nk.png')",
        }}
      />
      <div className="absolute inset-0 bg-[#F5F5DC]/90"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-[#3A4D39] font-bold tracking-[0.2em] uppercase text-sm block mb-3">
              TESTIMONIAL
            </span>
            <h2 className="text-4xl md:text-[56px] font-bold text-[#1a1a1a] leading-[1.1]">
              What Our Guests Say
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-[52px] h-[52px] rounded-lg border border-gray-300 flex items-center justify-center bg-white hover:bg-[#3A4D39] hover:text-white transition-all"
            >
              <HiOutlineArrowLeft size={24} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-[52px] h-[52px] rounded-lg bg-[#3A4D39] text-white flex items-center justify-center hover:bg-[#2d3d2d] transition-all"
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
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SwiperSlide key={i}>
                  <TestimonialSkeleton />
                </SwiperSlide>
              ))
            : feedbacks.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-[28px] border border-[#E8EED5] flex flex-col min-h-[340px] group hover:border-[#3A4D39]/30 transition-all">
                    
                    {/* User */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FDFEF4] shadow-md bg-gray-50">
                        <Image
                          src={item.userImage}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-[22px] font-bold text-[#1a1a1a]">
                          {item.name}
                        </h4>
                        <p className="text-[#3A4D39]/70 text-sm font-semibold uppercase">
                          {item.designation}
                        </p>
                      </div>
                    </div>

                    {/* Review */}
                    <p className="text-[#555] text-[17px] leading-[1.7] italic">
                      &ldquo;{item.review}&rdquo;
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
