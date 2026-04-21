/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BlogCard = ({ blog }: { blog: any }) => {
  const formattedDate = new Date(
    blog?.publishDate?.$date || blog?.publishDate,
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/blog/${blog._id?.$oid || blog._id}`}>
      <motion.div
        whileHover={{ y: -10 }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-[0px_10px_30px_rgba(0,0,0,0.03)] transition-all duration-500 hover:bg-[#3A4D39] flex flex-col h-full cursor-pointer overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-55 w-full rounded-[18px] overflow-hidden mb-6">
          <Image
            src={blog.thumbnail || "/assets/img/blog.png"}
            alt={blog.blogTitle}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="flex flex-col grow px-2">
          {/* Date */}
          <div className="flex items-center gap-2 bg-white border border-gray-100 group-hover:bg-white/10 group-hover:border-transparent w-fit px-4 py-1.5 rounded-lg mb-4 transition-all duration-300">
            <span className="text-[#3A4D39] group-hover:text-white text-lg">
              📅
            </span>
            <span className="text-gray-600 group-hover:text-white/90 text-sm font-semibold">
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[22px] font-bold text-[#1a1a1a] group-hover:text-white mb-3 leading-tight line-clamp-2 transition-colors duration-300">
            {blog.blogTitle}
          </h3>

          {/* Subtitle */}
          <p className="text-gray-500 group-hover:text-white/70 text-[15px] leading-relaxed mb-6 line-clamp-2 transition-colors">
            {blog.blogSubtitle}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-5 border-t border-gray-100 group-hover:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src="/assets/img/FAQ1.png"
                  alt="author"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-bold text-[15px] text-[#1a1a1a] group-hover:text-white transition-colors">
                Albert Flores
              </span>
            </div>

            {/* শুধু text, link না (nested avoid) */}
            <span className="flex items-center gap-1 text-[#3A4D39] group-hover:text-white font-bold text-[15px] border-b-2 border-transparent group-hover:hover:border-white transition-all">
              Read More <span className="text-lg">→</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BlogCard;
