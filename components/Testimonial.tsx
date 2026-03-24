"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";
import { getAllFeedbacks } from "../app/modules/feedback/feedback.api";
import { ITestimonial } from "../types/testimonial.interface";

const Testimonial = () => {
  const [feedbacks, setFeedbacks] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await getAllFeedbacks();
        if (res?.success && res?.data) {
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
    <section className="py-20 bg-[#FDFEF4] overflow-hidden relative border-b border-[#3A4D39]/10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section with Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[#3A4D39] font-bold tracking-[0.2em] uppercase text-sm mb-3 block">
              TESTIMONIAL
            </span>
            <h2 className="text-4xl md:text-[56px] font-bold text-[#1a1a1a] leading-[1.1]">
              What Our Guests Say
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3 mb-2">
            <button className="w-[52px] h-[52px] rounded-lg border border-gray-300 flex items-center justify-center hover:bg-[#3A4D39] hover:text-white transition-all duration-300 group">
              <HiOutlineArrowLeft size={24} className="group-hover:scale-110" />
            </button>
            <button className="w-[52px] h-[52px] rounded-lg bg-[#3A4D39] text-white flex items-center justify-center hover:bg-[#2d3d2d] shadow-lg transition-all duration-300 group">
              <HiOutlineArrowRight size={24} className="group-hover:scale-110" />
            </button>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {feedbacks.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 md:p-10 rounded-[28px] shadow-[0px_10px_30px_rgba(0,0,0,0.03)] border border-[#E8EED5] flex flex-col h-full relative group hover:border-[#3A4D39]/30 transition-all duration-500"
            >
              {/* Quote Icon SVG (Design Consistent) */}
              <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg width="45" height="35" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 5.6 25 12.5 25H15C15 30.5 10.5 35 5 35V30C8.3 30 11 27.3 11 24V12.5C11 5.6 5.4 0 0 0H12.5ZM42.5 0C35.6 0 30 5.6 30 12.5C30 19.4 35.6 25 42.5 25H45C45 30.5 40.5 35 35 35V30C38.3 30 41 27.3 41 24V12.5C41 5.6 35.4 0 30 0H42.5Z" fill="#3A4D39"/>
                </svg>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FDFEF4] shadow-md bg-gray-50">
                  <Image
                    src={item.companyLogo || "/assets/img/FAQ1.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight">
                    {item.name}
                  </h4>
                  <p className="text-[#3A4D39]/70 text-sm font-semibold uppercase tracking-wider">
                    {item.designation}
                  </p>
                </div>
              </div>

              {/* Feedback Description */}
              <p className="text-[#555555] text-[17px] leading-[1.7] font-medium italic">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;