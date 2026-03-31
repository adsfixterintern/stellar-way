"use client";
import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { getAllBlogs } from "@/app/modules/blog/blog.api";
import { IBlog } from "@/types/blog.interface";

const BlogInitialPage = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6; 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getAllBlogs();
        if (res?.success && res?.data) {
          setBlogs(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);



  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {currentBlogs.length > 0 ? (
          currentBlogs.map((blog: any) => (
            <BlogCard key={blog._id} blog={blog} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">No blogs found.</p>
        )}
      </div>

      {blogs.length > blogsPerPage && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12 border-t border-gray-100 pt-10">
          
          {/* Previous Button */}
          <button 
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 font-bold transition-all ${
              currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:text-[#3A4D39]"
            }`}
          >
            <span className="text-xl">←</span> Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                  currentPage === number 
                    ? "bg-[#3A4D39] text-white shadow-lg scale-110" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button 
            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 font-bold transition-all ${
              currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-[#3A4D39] hover:gap-3"
            }`}
          >
            Next <span className="text-xl">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogInitialPage;