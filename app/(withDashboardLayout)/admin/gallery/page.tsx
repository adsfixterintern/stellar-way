/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  IoTrashOutline, 
  IoCloudUploadOutline, 
  IoSyncOutline, 
  IoImagesOutline 
} from "react-icons/io5";
import Swal from "sweetalert2";
import Image from "next/image";
import { getAllGalleryItems, createGalleryItemApi, deleteGalleryItemApi } from "@/app/modules/gallery/gallery.api";
import { IGalleryItem } from "@/app/modules/gallery/gallery.interface";

const GalleryManagementPage = () => {
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ডাটা লোড করা
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getAllGalleryItems();
      setItems(data);
    } catch (error) {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // ইমেজ আপলোড হ্যান্ডলার
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("sortOrder", "0");
    try {
      setUploading(true);
      const res = await createGalleryItemApi(formData);
      if (res.success) {
        toast.success("Image uploaded successfully!");
        fetchGallery(); 
        if (fileInputRef.current) fileInputRef.current.value = ""; 
      }
    } catch (error) {
      toast.error("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will be deleted from Cloudinary!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteGalleryItemApi(id);
        if (res.success) {
          toast.success("Deleted successfully");
          fetchGallery();
        }
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase  flex items-center gap-2">
            Gallery Management
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Total Assets: {items.length}
          </p>
        </div>

        <div className="flex gap-4">
          <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            onChange={handleUpload} 
            accept="image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-[#1A4E11] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:opacity-90 shadow-lg disabled:opacity-50"
          >
            {uploading ? <IoSyncOutline className="animate-spin" /> : <IoCloudUploadOutline size={18} />}
            {uploading ? "Uploading..." : "Upload New Image"}
          </button>
          <button onClick={fetchGallery} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
            <IoSyncOutline className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item._id} className="group relative bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="relative h-64 w-full">
                <Image 
                  src={item.image} 
                  alt="Gallery" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-all scale-90 group-hover:scale-100"
                  >
                    <IoTrashOutline size={24} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-white">
                <span className="text-[10px] font-black text-[#1A4E11] uppercase tracking-widest">
                  {item.categoryId?.name || "No Category"}
                </span>
                <span className="text-[10px] font-bold text-gray-300 italic">Order: {item.sortOrder}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManagementPage;