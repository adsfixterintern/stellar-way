

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { 
  IoAddOutline, IoTrashOutline, IoSearchOutline, 
  IoImageOutline, IoCloseOutline, IoNewspaperOutline,
  IoCreateOutline 
} from "react-icons/io5";

import { BlogApiService } from '@/app/modules/blog/blog.api';
import { IBlog, ICategory } from '@/app/modules/blog/blog.interface';

function BlogAdminPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as any)?.id;

  // --- States ---
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
    contentSections: [{ title: "", desc: "" }]
  };
  const [formData, setFormData] = useState<Partial<IBlog>>(initialForm as any);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // --- Functions ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogRes, catRes] = await Promise.all([
        BlogApiService.getAllBlogs(),
        BlogApiService.getAllCategories()
      ]);
      const sorted = (blogRes.data || []).sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBlogs(sorted);
      setCategories(catRes.data || []);
    } catch (err) {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedBlogId(null);
    setFormData(initialForm as any);
    setThumbnail(null);
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
      contentSections: blog.contentSections || [{ title: "", desc: "" }]
    });
    setThumbnail(null); 
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (btnLoading) return;


  if (!isEditMode && !thumbnail) return toast.error("Please select a thumbnail!");
  if (!currentUserId) return toast.error("Login required!");

  setBtnLoading(true);
  try {

    const cleanCategoryId = typeof formData.categoryId === 'object' 
      ? (formData.categoryId as any)?._id 
      : formData.categoryId;

    const payload = { 
      ...formData, 
      categoryId: cleanCategoryId,
      userId: currentUserId 
    };

    if (isEditMode && selectedBlogId) {
      
      const response = await BlogApiService.updateBlog(selectedBlogId, payload, thumbnail || undefined);
      if (response.success) {
        toast.success("Blog Updated Successfully!");
        setIsModalOpen(false);
        fetchData();
      }
    } else {
   
      const response = await BlogApiService.createBlog(payload, thumbnail!);
      if (response.success) {
        toast.success("Blog Published Successfully!");
        setIsModalOpen(false);
        setFormData(initialForm as any);
        setThumbnail(null);
        fetchData();
      }
    }
  } catch (err: any) {
   
    console.error("API Error:", err.response?.data);
    toast.error(err.response?.data?.message || "Operation failed");
  } finally {
    setBtnLoading(false);
  }
};

  const handleDelete = async (id: string) => {
  
    const res = await Swal.fire({
      title: 'Are you sure?',
      text: "Delete this article permanently?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1A4E11',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete',
      customClass: {
        popup: 'rounded-[35px]', 
      }
    });

    if (res.isConfirmed) {
      try {
        const response = await BlogApiService.deleteBlog(id);
        if (response.success) {
          toast.success("Blog deleted successfully");
          fetchData(); 
        }
      } catch (err) {
        toast.error("Failed to delete the blog");
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#1A4E11] animate-pulse">SYNCING ASSETS...</div>;

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
            <IoNewspaperOutline className="text-[#1A4E11]" /> Assets Manager
          </h1>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-[0.2em]">Stellar Way Dashboard</p>
        </div>
        <button onClick={handleOpenCreateModal} className="bg-[#1A4E11] text-white px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-[#1A4E11] transition-all shadow-xl flex items-center gap-2">
          <IoAddOutline size={20} /> Create New Post
        </button>
      </div>

      {/* Filter */}
      <div className="mb-8 flex bg-white p-3 rounded-[18px] border-2 border-slate-100 items-center max-w-md shadow-sm">
        <IoSearchOutline className="ml-2 text-slate-400" size={22} />
        <input type="text" placeholder="Filter by title..." className="w-full p-2 text-sm font-bold outline-none bg-transparent text-slate-700" onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[35px] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 font-black text-[10px] uppercase text-slate-400 tracking-widest">
                <th className="p-6">Preview</th>
                <th className="p-6">Article Metadata</th>
                <th className="p-6">Visibility</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blogs.filter(b => b.blogTitle?.toLowerCase().includes(searchTerm.toLowerCase())).map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="p-6">
                    <div className="w-20 h-14 rounded-[14px] overflow-hidden border-2 border-white shadow-sm relative bg-slate-100">
                      <img src={blog.thumbnail} alt="" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm truncate max-w-[250px]">{blog.blogTitle}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">{blog.blogSubtitle}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 text-[#1A4E11] border border-green-100">{blog.status}</span>
                  </td>
                  <td className="p-6 text-right flex justify-end gap-2">
                    <button onClick={() => handleOpenEditModal(blog)} className="p-3 text-slate-400 hover:text-[#1A4E11] hover:bg-green-50 rounded-[15px] transition-all">
                      <IoCreateOutline size={20} />
                    </button>
                    <button onClick={() => blog._id && handleDelete(blog._id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-[15px] transition-all">
                      <IoTrashOutline size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{isEditMode ? "Modify Article" : "Deploy Publication"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all shadow-sm"><IoCloseOutline size={28} className="text-slate-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto">
              <div className="relative group border-4 border-dashed border-slate-100 rounded-[35px] p-10 text-center hover:bg-slate-50 hover:border-[#1A4E11]/20 transition-all cursor-pointer">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} />
                <IoImageOutline size={40} className="mx-auto mb-3 text-slate-200 group-hover:text-[#1A4E11]" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{thumbnail ? thumbnail.name : isEditMode ? "Change Thumbnail (Optional)" : "Select Featured Image"}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Main Title</label>
                  <input type="text" required value={formData.blogTitle} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[18px] text-sm font-bold text-slate-800 focus:border-[#1A4E11]/20 outline-none transition-all" onChange={(e) => setFormData({...formData, blogTitle: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sub Headline</label>
                  <input type="text" required value={formData.blogSubtitle} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[18px] text-sm font-bold text-slate-800 focus:border-[#1A4E11]/20 outline-none transition-all" onChange={(e) => setFormData({...formData, blogSubtitle: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Category</label>
                  <select required value={formData.categoryId as any} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[18px] text-sm font-bold text-slate-800 focus:border-[#1A4E11]/20 outline-none cursor-pointer" onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
                    <option value="">Select Tag</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Status</label>
                  <select value={formData.status} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[18px] text-sm font-bold text-slate-800 focus:border-[#1A4E11]/20 outline-none" onChange={(e) => setFormData({...formData, status: e.target.value as any})}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Description</label>
                <textarea rows={4} required value={formData.contentSections?.[0]?.desc} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[18px] text-sm font-bold text-slate-800 focus:border-[#1A4E11]/20 outline-none resize-none" onChange={(e) => {
                  const sections = [...(formData.contentSections || [])];
                  if(!sections[0]) sections[0] = { title: "", desc: "" };
                  sections[0].desc = e.target.value;
                  sections[0].title = formData.blogTitle || "Intro";
                  setFormData({...formData, contentSections: sections});
                }}></textarea>
              </div>

              <button type="submit" disabled={btnLoading} className="w-full bg-[#1A4E11] text-white py-5 rounded-[24px] font-black uppercase text-[12px] tracking-[3px] shadow-2xl hover:bg-[#1A4E11] hover:-translate-y-1 transition-all disabled:opacity-50">
                {btnLoading ? "Processing..." : isEditMode ? "Save Modifications" : "Confirm Publication"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogAdminPage;