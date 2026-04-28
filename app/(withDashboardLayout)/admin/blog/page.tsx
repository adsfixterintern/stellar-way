/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoAddOutline,
  IoTrashOutline,
  IoSearchOutline,
  IoImageOutline,
  IoCloseOutline,
  IoNewspaperOutline,
  IoCreateOutline,
} from "react-icons/io5";

import { BlogApiService } from "@/app/modules/blog/blog.api";
import { IBlog, ICategory } from "@/app/modules/blog/blog.interface";

// --- SKELETON COMPONENT ---
const BlogSkeleton = () => (
  <div className="animate-pulse flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-50">
    <div className="flex gap-5 items-center">
      <div className="w-20 h-16 rounded-xl bg-slate-200"></div>
      <div className="space-y-2">
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
        <div className="h-3 w-24 bg-slate-100 rounded"></div>
      </div>
    </div>
    <div className="flex gap-2">
      <div className="w-10 h-10 rounded-xl bg-slate-100"></div>
      <div className="w-10 h-10 rounded-xl bg-slate-100"></div>
    </div>
  </div>
);

function BlogAdminPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id;

  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initialForm = {
    blogTitle: "",
    blogSubtitle: "",
    categoryId: "",
    status: "published",
    contentSections: [{ title: "Introduction", desc: "" }],
  };

  const [formData, setFormData] = useState<Partial<IBlog>>(initialForm as any);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogRes, catRes] = await Promise.all([
        BlogApiService.getAllBlogs(),
        BlogApiService.getAllCategories(),
      ]);
      const sorted = (blogRes.data || []).sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setBlogs(sorted);
      setCategories(catRes.data || []);
    } catch {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedBlogId(null);
    setFormData(initialForm as any);
    setThumbnail(null);
    setPreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog: IBlog) => {
    setIsEditMode(true);
    setSelectedBlogId(blog._id || null);
    setFormData({
      blogTitle: blog.blogTitle,
      blogSubtitle: blog.blogSubtitle,
      categoryId: (blog.categoryId as any)?._id || blog.categoryId,
      status: blog.status,
      contentSections:
        blog.contentSections?.length > 0
          ? blog.contentSections
          : [{ title: "", desc: "" }],
    });
    setPreview(blog.thumbnail || null);
    setThumbnail(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (btnLoading) return;
    if (!isEditMode && !thumbnail)
      return toast.error("Please select a thumbnail!");
    if (!currentUserId) return toast.error("Login required!");

    setBtnLoading(true);
    try {
      const cleanCategoryId =
        typeof formData.categoryId === "object"
          ? (formData.categoryId as any)?._id
          : formData.categoryId;
      const payload = {
        ...formData,
        categoryId: cleanCategoryId,
        userId: currentUserId,
      };

      if (isEditMode && selectedBlogId) {
        const res = await BlogApiService.updateBlog(
          selectedBlogId,
          payload,
          thumbnail || undefined,
        );
        if (res?.success) {
          toast.success("Updated successfully!");
          setIsModalOpen(false);
          await fetchData();
        }
      } else {
        const res = await BlogApiService.createBlog(payload, thumbnail!);
        if (res?.success) {
          toast.success("Blog Published!");
          setIsModalOpen(false);
          await fetchData();
        }
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete it!",
    });

    if (res.isConfirmed) {
      await BlogApiService.deleteBlog(id);
      toast.success("Deleted successfully");
      fetchData();
    }
  };

  return (
    <div className="w-full min-h-screen ">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <IoNewspaperOutline className="text-[#1A4E11]" />
            Blog Manager
          </h1>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-[0.2em]">
            Content Control Panel
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-[#1A4E11] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
        >
          <IoAddOutline size={18} /> New Blog
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-10 flex items-center bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 max-w-md focus-within:ring-2 ring-[#1A4E11]/20 transition-all">
        <IoSearchOutline className="text-slate-400" size={20} />
        <input
          placeholder="Search blog title..."
          className="w-full bg-transparent outline-none text-sm font-semibold ml-3"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* BLOG LIST & LOADING STATE */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, idx) => <BlogSkeleton key={idx} />)
        ) : blogs.length > 0 ? (
          blogs
            .filter((b) =>
              b.blogTitle?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((blog) => (
              <div
                key={blog._id}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-slate-100 transition-all flex justify-between items-center group"
              >
                <div className="flex gap-5 items-center">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-50">
                    <img
                      src={blog.thumbnail}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1">
                      {blog.blogTitle}
                    </h3>
                    <p className="text-[10px] font-black text-[#1A4E11] uppercase tracking-wider">
                      {(blog.categoryId as any)?.name || "Uncategorized"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(blog)}
                    className="p-3 rounded-xl text-slate-400 hover:bg-green-50 hover:text-[#1A4E11] transition-all"
                  >
                    <IoCreateOutline size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id!)}
                    className="p-3 rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">
            No Blogs Found
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-xl font-black text-slate-800">
                {isEditMode ? "Update Blog" : "Create New Blog"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-800"
              >
                <IoCloseOutline size={26} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar"
            >
              <div className="relative group overflow-hidden bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 hover:border-[#1A4E11] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleImageChange}
                />
                {preview ? (
                  <div className="relative h-56 w-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <p className="text-white font-bold text-xs uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full">
                        Change Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-14 text-center">
                    <IoImageOutline
                      size={48}
                      className="mx-auto text-slate-300 mb-3 group-hover:text-[#1A4E11] transition-all"
                    />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Upload Thumbnail
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <input
                  value={formData.blogTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, blogTitle: e.target.value })
                  }
                  placeholder="Main Title"
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-[#1A4E11]/10 font-bold"
                  required
                />
                <input
                  value={formData.blogSubtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, blogSubtitle: e.target.value })
                  }
                  placeholder="Short Subtitle"
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-[#1A4E11]/10 font-medium"
                />
                <select
                  value={formData.categoryId as any}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl outline-none focus:ring-2 ring-[#1A4E11]/10 font-bold text-slate-600 appearance-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Article Content
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        contentSections: [
                          ...(formData.contentSections || []),
                          { title: "", desc: "" },
                        ],
                      })
                    }
                    className="text-[#1A4E11] text-xs font-black uppercase flex items-center gap-1 hover:underline"
                  >
                    <IoAddOutline size={16} /> Add Section
                  </button>
                </div>

                {(formData.contentSections || []).map((sec, i) => (
                  <div
                    key={i}
                    className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 space-y-4 group/sec relative"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <input
                        value={sec.title}
                        placeholder="Section Header"
                        className="bg-white px-4 py-3 rounded-xl outline-none text-sm font-bold flex-1 focus:ring-2 ring-slate-100"
                        onChange={(e) => {
                          const updated = [...(formData.contentSections || [])];
                          updated[i].title = e.target.value;
                          setFormData({
                            ...formData,
                            contentSections: updated,
                          });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(formData.contentSections || [])];
                          updated.splice(i, 1);
                          setFormData({
                            ...formData,
                            contentSections: updated,
                          });
                        }}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                    <textarea
                      value={sec.desc}
                      rows={4}
                      placeholder="Write content..."
                      className="w-full px-4 py-3 rounded-xl bg-white outline-none text-sm font-medium resize-none focus:ring-2 ring-slate-100"
                      onChange={(e) => {
                        const updated = [...(formData.contentSections || [])];
                        updated[i].desc = e.target.value;
                        setFormData({ ...formData, contentSections: updated });
                      }}
                      required
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-[#1A4E11] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:shadow-2xl hover:opacity-90 disabled:bg-slate-300 transition-all"
              >
                {btnLoading
                  ? "Syncing..."
                  : isEditMode
                    ? "Save Changes"
                    : "Publish Blog"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogAdminPage;
