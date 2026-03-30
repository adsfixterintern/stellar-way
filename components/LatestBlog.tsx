"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllBlogs } from "../app/modules/blog/blog.api";
import { IBlog } from "../types/blog.interface";
import leafImg from "../assets/img/FAQ1.png"; 

const LatestBlog = () => {
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getAllBlogs();
        if (res?.success && res?.data?.length > 0) {
          setBlog(res.data[res.data.length - 1]);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, []);

  const getFormattedDate = (dateObj: any) => {
    try {
      const rawDate = dateObj?.$date || dateObj;
      if (!rawDate) return "18 Jan 2026";

      return new Date(rawDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (err) {
      return "18 Jan 2026";
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-bold text-[#1B4314]">
        Loading Latest Post...
      </div>
    );
  }

  if (!blog) return null;

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      {/* বাম পাশের সেই পাতা/ডেকোরেশন */}
     <div className="absolute -top-10 -left-10 w-24 md:w-32 opacity-90 pointer-events-none">
          <Image src={leafImg} alt="leaf" className="object-contain" />
        </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#3A4D39] font-bold tracking-[0.2em] uppercase text-sm mb-2 block">
            BLOG
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a]">
            Latest Blog Post
          </h2>
        </div>

        {/* Blog Content Grid */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* থাম্বনেইল ইমেজ */}
          <div className="w-full lg:w-1/2 group relative">
             {/* ইমেজের পেছনে ছোট পাতা বা সজ্জা (যদি ডিজাইনে থাকে) */}
            <div className="relative h-[300px] md:h-[450px] w-full rounded-[20px] md:rounded-[30px] overflow-hidden border-[3px] border-[#60a5fa]/30 shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
              <Image
                src={blog.thumbnail}
                alt={blog.blogTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* কন্টেন্ট সেকশন */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-lg mb-6">
              <span className="text-[#1B4314]">📅</span>
              <span className="text-gray-600 font-medium">
                {getFormattedDate(blog.publishDate)}
              </span>
            </div>

            <h3 className="text-3xl md:text-[42px] leading-tight font-bold text-[#1a1a1a] mb-4 hover:text-[#1B4314] transition-colors cursor-pointer">
              {blog.blogTitle}
            </h3>

            {blog.blogSubtitle && (
              <p className="text-[#1B4314] font-medium mb-4 italic text-lg">
                {blog.blogSubtitle}
              </p>
            )}

            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-[530px] line-clamp-3">
              {blog.contentSections?.[0]?.desc || "No description available."}
            </p>

            <button className="flex items-center gap-2 text-[#1B4314] font-bold text-lg border-b-2 border-[#1B4314] pb-1 hover:gap-4 transition-all mb-10 group">
              Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* অথর প্রোফাইল */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 w-full">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src="/assets/img/FAQ1.png"
                  alt="Author"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Albert Flores</h4>
                <p className="text-gray-400 text-sm">Author</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;










