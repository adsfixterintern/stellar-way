/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoCloseOutline, IoImageOutline } from "react-icons/io5";
import Image from "next/image";
import { ICategory } from "@/types/category";
import { IChef } from "@/types/menu";
import { createMenu, updateMenu } from "@/app/modules/menu/menu.api";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: any | null;
  categories: ICategory[];
  chefs: IChef[];
  onSuccess: () => void;
}

export const MenuModal = ({ isOpen, onClose, editData, categories, chefs, onSuccess }: MenuModalProps) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [btnLoading, setBtnLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: "", description: "", price: "", stock: "",
    chefId: "", categoryId: "", sortOrder: "1", status: "active",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        price: String(editData.price || ""),
        stock: String(editData.stock || ""),
        chefId: editData.chefId?._id || editData.chefId || "",
        categoryId: editData.categoryId?._id || editData.categoryId || "",
        sortOrder: String(editData.sortOrder || "1"),
        status: editData.status || "active",
      });
      setImagePreview(editData.image?.url || null);
    } else if (!editData) {
      setFormData({ title: "", description: "", price: "", stock: "", chefId: "", categoryId: "", sortOrder: "1", status: "active" });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [editData, isOpen]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as string);
      });

      if (imageFile) {
        data.append("image", imageFile);
      }

      let response;
      if (editData) {
        response = await updateMenu(editData._id, data);
      } else {
        response = await createMenu(data);
      }

      if (response.success) {
        toast.success(editData ? "Menu updated!" : "Menu created!");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">

        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-50 flex-shrink-0">
          <h2 className="text-xl font-black text-gray-900">
            {editData ? "Edit Menu Item" : "Add New Menu"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300"
          style={{
            scrollbarWidth: 'thin', /* For Firefox */
            msOverflowStyle: 'none' /* For IE/Edge */
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Item Name</label>
              <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold" />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Description</label>
              <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold resize-none" />
            </div>

            {/* Select Category */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Category</label>
              <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full border border-gray-100 p-4 rounded-xl outline-none text-sm bg-gray-50 font-semibold">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Select Chef */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Chef</label>
              <select required value={formData.chefId} onChange={(e) => setFormData({ ...formData, chefId: e.target.value })} className="w-full border border-gray-100 p-4 rounded-xl outline-none text-sm bg-gray-50 font-semibold">
                <option value="">Select Chef</option>
                {chefs.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Price & Stock */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Price</label>
              <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full border border-gray-100 p-4 rounded-xl outline-none text-sm bg-gray-50 font-semibold" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Stock</label>
              <input type="number" required value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full border border-gray-100 p-4 rounded-xl outline-none text-sm bg-gray-50 font-semibold" />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Menu Image</label>
              <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 overflow-hidden transition-all">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center">
                    <IoImageOutline size={30} className="text-gray-200" />
                    <span className="text-[9px] text-gray-400 mt-2 font-black uppercase">Upload Image</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Submit Button inside scroll or keep outside if you want it sticky */}
          <button
            type="submit"
            disabled={btnLoading}
            className="w-full bg-[#1A4E11] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[2px] shadow-lg shadow-green-900/20 active:scale-95 transition-transform"
          >
            {btnLoading ? "Processing..." : editData ? "Update Item" : "Save Item"}
          </button>
        </form>
      </div>
    </div>
  );
};