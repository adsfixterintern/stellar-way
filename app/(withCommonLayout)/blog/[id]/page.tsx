"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getSingleBlog } from "@/app/modules/blog/blog.api";
import { IBlog } from "@/types/blog.interface";
import SingleHero from "@/components/shared/SingleHero";
import { FaFacebookF, FaLinkedinIn, FaLink } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

/* 🔥 Skeleton UI */
const BlogDetailsSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-pulse">
      {/* header */}
      <div className="flex justify-between mb-12 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex gap-10">
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col lg:flex-row gap-16">
        {/* left */}
        <div className="lg:w-2/3 space-y-8">
          <div className="h-10 w-2/3 bg-gray-200 rounded" />

          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-200 rounded" />

                {i === 1 && (
                  <div className="h-[450px] w-full bg-gray-200 rounded-[40px] mt-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* right */}
        <div className="lg:w-1/3 space-y-8">
          <div className="h-[300px] bg-gray-200 rounded-[40px]" />
          <div className="h-[180px] bg-gray-200 rounded-[40px]" />
        </div>
      </div>
    </div>
  );
};

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const res = await getSingleBlog(id as string);
        if (res?.success) setBlog(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  /* 🔥 Skeleton render */
  if (loading) {
    return (
      <>
        <Toaster position="top-center" />
        <SingleHero
          isCenter={true}
          subtitle="Loading..."
          title="Loading Blog..."
          buttonTitle="Loading"
          buttonLink="#"
        />
        <BlogDetailsSkeleton />
      </>
    );
  }

  if (!blog)
    return (
      <div className="py-20 text-center">Blog not found!</div>
    );

  return (
    <main className="bg-white min-h-screen">
      <Toaster position="top-center" />

      <SingleHero
        isCenter={true}
        subtitle="dada"
        title="Savoring Excellence: Chef Alex's Top Culinary Tips"
        buttonTitle="Order Now"
        buttonLink="/menu"
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between mb-12 pb-8 border-b border-gray-100 gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#3A4D39]/10">
              <Image src="/assets/img/FAQ1.png" alt="Author" fill className="object-cover" />
            </div>
            <div>
              <h4 className="font-bold text-[#1a1a1a] text-lg">Albert Flores</h4>
              <p className="text-gray-400 text-sm">Digital Marketer</p>
            </div>
          </div>

          <div className="flex gap-8 md:gap-16 text-sm md:text-base">
            <div>
              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Category</p>
              <p className="font-bold text-[#1a1a1a]">Digital Marketing</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Publish Date</p>
              <p className="font-bold text-[#1a1a1a]">June 10, 2024</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] mb-10 leading-tight">
              Introduction: {blog.blogTitle}
            </h2>

            <div className="space-y-16">
              {blog.contentSections?.map((section, index) => (
                <div key={index} id={`section-${index}`} className="scroll-mt-32">
                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">
                    {index + 1}. {section.title}
                  </h3>

                  <p className="text-gray-600 leading-[1.8] text-lg mb-8 text-justify">
                    {section.desc}
                  </p>

                  {index === 0 && (
                    <div className="relative h-[450px] w-full rounded-[40px] overflow-hidden my-12 shadow-xl">
                      <Image src={blog.thumbnail} alt="Banner" fill className="object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="sticky top-28 space-y-8">
              <div className="bg-[#F8F9FA] p-10 rounded-[40px] border border-gray-50 shadow-sm">
                <h3 className="text-2xl font-black text-[#1a1a1a] mb-8">
                  Table of Contents
                </h3>
                <ul className="space-y-5">
                  {blog.contentSections?.map((section, index) => (
                    <li
                      key={index}
                      onClick={() => scrollToSection(`section-${index}`)}
                      className="text-gray-500 hover:text-[#3A4D39] font-bold cursor-pointer"
                    >
                      {index + 1}. {section.title}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                <h4 className="text-lg font-black mb-6">Share This Article</h4>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      window.open(
                        `https://facebook.com/sharer/sharer.php?u=${shareUrl}`
                      )
                    }
                    className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center"
                  >
                    <FaFacebookF />
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        `https://linkedin.com/sharing/share-offsite/?url=${shareUrl}`
                      )
                    }
                    className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center"
                  >
                    <FaLinkedinIn />
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex-1 h-12 rounded-full bg-gray-100 font-bold flex items-center justify-center gap-2"
                  >
                    <FaLink /> Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
