/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  IoTrashOutline,
  IoCloudUploadOutline,
  IoSyncOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import Image from "next/image";
import {
  getAllGalleryItems,
  createGalleryItemApi,
  deleteGalleryItemApi,
} from "@/app/modules/gallery/gallery.api";
import { IGalleryItem } from "@/app/modules/gallery/gallery.interface";

const GalleryManagementPage = () => {
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      toast.error("Upload failed.");
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
      customClass: { popup: "rounded-3xl" },
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
    <div className=" min-h-screen ">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
            Gallery Management
          </h1>
          <p className="text-[10px] font-bold text-[#1A4E11] uppercase tracking-[3px] mt-1">
            Total Assets: {items.length}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
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
            className="flex-1 sm:flex-none bg-[#1A4E11] text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 shadow-sm disabled:opacity-50 transition-all"
          >
            {uploading ? (
              <IoSyncOutline className="animate-spin" />
            ) : (
              <IoCloudUploadOutline size={18} />
            )}
            {uploading ? "Uploading..." : "Upload New"}
          </button>
          <button
            onClick={fetchGallery}
            className="p-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-[#1A4E11] transition-all"
          >
            <IoSyncOutline
              className={loading ? "animate-spin" : ""}
              size={20}
            />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-[30px] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="group relative bg-white rounded-[30px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full">
                <Image
                  src={item.image}
                  alt="Gallery"
                  fill
                  className="object-cover transition-transform duration-700 md:group-hover:scale-110"
                />

                {/* Delete Button - Desktop Hover / Mobile Always Visible */}
                <div className="absolute inset-0 bg-black/20 md:bg-black/40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-4 right-4 md:top-1/2 md:right-1/2 md:translate-x-1/2 md:-translate-y-1/2">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-3.5 bg-red-500 md:bg-white/20 md:backdrop-blur-md rounded-2xl text-white md:hover:bg-red-500 transition-all shadow-lg md:shadow-none active:scale-90"
                    >
                      <IoTrashOutline size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Bottom */}
              <div className="p-5 flex justify-between items-center bg-white">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#1A4E11] uppercase tracking-widest">
                    {item.categoryId?.name || "General"}
                  </span>
                  <span className="text-[9px] font-bold text-gray-300 uppercase mt-1">
                    Sort: {item.sortOrder}
                  </span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManagementPage;
