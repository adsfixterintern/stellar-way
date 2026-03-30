"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import BlogCard from "@/app/(withCommonLayout)/blog/_components/BlogCard";
import { getAllBlogs } from "@/app/modules/blog/blog.api";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const LatestBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  if (loading)
    return <div className="py-20 text-center font-bold">Loading...</div>;

  return (
    <section className="py-20 px-4 md:px-12 bg-[#E4F5DC]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="!mb-5">
            <span className="superTitle flex items-center gap-3 ">Blog
              <div className="w-10 h-[2px] bg-[#1A4E11]"></div> 
            </span>
            <h2 className="secTitle mt-4">Latest Blog Post</h2>
          </div>

       

          <div className="flex gap-3">
            <button className="blog-prev w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#1A4E11] hover:text-white transition-all duration-300">
              <IoArrowBackOutline size={22} />
            </button>
            <button className="blog-next w-12 h-12 rounded-full bg-[#1A4E11] text-white flex items-center justify-center hover:bg-[#133A0C] transition-all duration-300">
              <IoArrowForwardOutline size={22} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          // Main setting is 1 to allow mouse dragging one by one
          slidesPerGroup={1}
          navigation={{
            prevEl: ".blog-prev",
            nextEl: ".blog-next",
          }}
          // This ensures that when using navigation buttons, it skips 3
          // and when dragging, it stays flexible
          breakpoints={{
            640: {
              slidesPerView: 1,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 2,
              slidesPerGroup: 1,
            },
            1024: {
              slidesPerView: 3,
              // Mouse drag er jonno eta 1 e thakbe
              slidesPerGroup: 1,
            },
          }}
          // Adding this to control the button behavior specifically
          onBeforeInit={(swiper: any) => {
            swiper.params.navigation.prevEl = ".blog-prev";
            swiper.params.navigation.nextEl = ".blog-next";
          }}
          // Specific Logic for 3-slide jump on button click
          onNavigationNext={(swiper) => {
            if (window.innerWidth >= 1024) {
              swiper.slideTo(swiper.activeIndex + 2);
            }
          }}
          onNavigationPrev={(swiper) => {
            if (window.innerWidth >= 1024) {
              swiper.slideTo(swiper.activeIndex - 2);
            }
          }}
          className="pb-10"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog._id}>
              <BlogCard blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default LatestBlogs;
