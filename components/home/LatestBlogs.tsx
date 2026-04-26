/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import BlogCard from "@/app/(withCommonLayout)/blog/_components/BlogCard";
import { getAllBlogs } from "@/app/modules/blog/blog.api";
import { useRouter } from "next/navigation";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

// --- SKELETON COMPONENT ---
const BlogCardSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-pulse h-full">
    {/* Image Skeleton */}
    <div className="w-full h-64 bg-slate-200"></div>
    {/* Content Skeleton */}
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <div className="h-4 w-20 bg-slate-200 rounded-full"></div>
        <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
      </div>
      <div className="h-6 w-full bg-slate-200 rounded-lg"></div>
      <div className="h-6 w-2/3 bg-slate-200 rounded-lg"></div>
      <div className="pt-4 flex justify-between items-center border-t border-slate-50">
        <div className="h-4 w-24 bg-slate-100 rounded"></div>
        <div className="h-8 w-8 rounded-full bg-slate-100"></div>
      </div>
    </div>
  </div>
);

const LatestBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getAllBlogs();
        if (res?.success) {
          setBlogs(res.data.slice(0, 9));
        }
      } catch (error) {
        console.error("Error loading blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  /* ---------------- GSAP SCROLL ANIMATION ---------------- */
  useEffect(() => {
    if (loading || !blogs.length) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 100,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [blogs, loading]);

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-12 bg-[#E4F5DC]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <div className="!mb-5">
            <span className="superTitle flex items-center gap-3 text-[#1A4E11] font-bold uppercase tracking-widest text-sm">
              Blog
              <div className="w-10 h-[2px] bg-[#1A4E11]"></div>
            </span>
            <h2 className="secTitle mt-4 text-3xl md:text-5xl font-black text-slate-900">Latest Blog Post</h2>
          </div>

          <div className="flex gap-3">
            <button className="blog-prev w-12 h-12 rounded-lg border-2 border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-[#1A4E11] hover:text-white transition-all shadow-sm">
              <IoArrowBackOutline size={22} />
            </button>

            <button className="blog-next w-12 h-12 rounded-lg bg-[#2D4619] text-white flex items-center justify-center hover:bg-[#1A4E11] transition-all shadow-lg">
              <IoArrowForwardOutline size={22} />
            </button>
          </div>
        </div>

        {/* SWIPER / SKELETON LOGIC */}
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          slidesPerGroup={1}
          navigation={{
            prevEl: ".blog-prev",
            nextEl: ".blog-next",
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {loading
            ? 
              Array.from({ length: 3 }).map((_, idx) => (
                <SwiperSlide key={`skeleton-${idx}`}>
                  <BlogCardSkeleton />
                </SwiperSlide>
              ))
            : blogs.map((blog, index) => (
                <SwiperSlide key={blog._id}>
                  <div
                    ref={(el) => {
                      if (el) cardsRef.current[index] = el;
                    }}
                    onClick={() => router.push(`/blog/${blog._id}`)}
                    className="cursor-pointer h-full"
                  >
                    <BlogCard blog={blog} />
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
};

export default LatestBlogs;