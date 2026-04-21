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
    if (!blogs.length) return;

    const ctx = gsap.context(() => {
      // Section fade
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
      });

      // Cards scroll animation (BOTTOM → TOP)
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
  }, [blogs]);

  if (loading)
    return <div className="py-20 text-center font-bold">Loading...</div>;

  return (
    <section ref={sectionRef} className="py-20 px-4 md:px-12 bg-[#E4F5DC]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <div className="!mb-5">
            <span className="superTitle flex items-center gap-3">
              Blog
              <div className="w-10 h-[2px] bg-[#1A4E11]"></div>
            </span>
            <h2 className="secTitle mt-4">Latest Blog Post</h2>
          </div>

          <div className="flex gap-3">
            <button className="blog-prev w-12 h-12 rounded-lg border-2 border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-[#1A4E11] hover:text-white transition-all">
              <IoArrowBackOutline size={22} />
            </button>

            <button className="blog-next w-12 h-12 rounded-lg bg-[#2D4619] text-white flex items-center justify-center hover:bg-[#1A4E11] transition-all">
              <IoArrowForwardOutline size={22} />
            </button>
          </div>
        </div>

        {/* SWIPER */}
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
          {blogs.map((blog, index) => (
            <SwiperSlide key={blog._id}>
              <div
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                onClick={() => router.push(`/blog/${blog._id}`)}
                className="cursor-pointer"
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
