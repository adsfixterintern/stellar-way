/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllBlogs } from "../app/modules/blog/blog.api";
import { IBlog } from "../types/blog.interface";
import leafImg from "../assets/img/FAQ1.png";

// 👉 Simple Skeleton Component
const BlogSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 animate-pulse">
      <div className="w-full lg:w-1/2">
        <div className="h-[300px] md:h-[450px] w-full bg-gray-200 rounded-[30px]" />
      </div>

      <div className="w-full lg:w-1/2 space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        <div className="h-12 w-full bg-gray-200 rounded" />
        <div className="h-6 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded mt-6" />
      </div>
    </div>
  );
};

const LatestBlog = () => {
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getAllBlogs();

        if (res?.success && res?.data?.length > 0) {
          // 👉 draft বাদ দিয়ে last published blog নিচ্ছে
          const publishedBlogs = res.data.filter(
            (b: any) => b.status !== "draft",
          );

          setBlog(publishedBlogs[publishedBlogs.length - 1] || null);
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
    } catch {
      return "18 Jan 2026";
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <BlogSkeleton />
        </div>
      </section>
    );
  }

  if (!blog) return null;

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      <div className="absolute -top-10 -left-10 w-24 md:w-32 opacity-90 pointer-events-none">
        <Image src={leafImg} alt="leaf" className="object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#3A4D39] font-bold tracking-[0.2em] uppercase text-sm mb-2 block">
            BLOG
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a]">
            Latest Blog Post
          </h2>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Image */}
          <div className="w-full lg:w-1/2 group relative">
            <div className="relative h-[300px] md:h-[450px] w-full rounded-[30px] overflow-hidden border-[3px] border-[#60a5fa]/30 shadow-xl">
              <Image
                src={blog.thumbnail || "/assets/img/blog.png"}
                alt={blog.blogTitle}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-lg mb-6">
              <span>📅</span>
              <span className="text-gray-600 font-medium">
                {getFormattedDate(blog.publishDate)}
              </span>
            </div>

            <h3 className="text-3xl md:text-[42px] font-bold text-[#1a1a1a] mb-4 hover:text-[#1B4314] transition-colors">
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

            <button className="flex items-center gap-2 text-[#1B4314] font-bold text-lg border-b-2 border-[#1B4314] pb-1 hover:gap-4 transition-all">
              Read More <span>→</span>
            </button>

            {/* Author */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 w-full mt-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
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
