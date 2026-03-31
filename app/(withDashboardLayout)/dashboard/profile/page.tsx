/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { 
  IoPersonOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoCameraOutline,
  IoShieldCheckmarkOutline,
  IoSaveOutline,
  IoCloseOutline
} from "react-icons/io5";
import { useSession } from "next-auth/react";
import { getMeApi, updateProfileApi } from "@/app/modules/auth/auth.api"; 

const UserProfile = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [image, setImage] = useState(""); 
  const [imagePreview, setImagePreview] = useState("");

  const loadProfile = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res: any = await getMeApi(userId);      
      
      if (res.success && res.data) {
        // রেসপন্স স্ট্রাকচার অনুযায়ী ডাটা সেট করা
        const profileData = res.data.user ? res.data.user : res.data;

        setUser(profileData);
        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
        });
        setImagePreview(profileData.image || "");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error(err.response?.data?.message || "Failed to load profile settings");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          if (!ctx) {
            reject("Canvas context not found");
            return;
          }
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedData = await compressImage(file);
      setImagePreview(compressedData);
      setImage(compressedData);
    } catch (error) {
      console.error(error);
      toast.error("Image processing failed!");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setUpdateLoading(true);
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        userId: userId,
        ...(image && { image }) 
      };

      const res: any = await updateProfileApi(updatePayload);

      if (res.success) {
        toast.success("Profile Updated Successfully!");
        const updatedData = res.data?.user ? res.data.user : res.data;
        setUser(updatedData);
        setIsEditing(false);
        setImage(""); 
      }
    } catch (err: any) {
      if (err.response?.status === 413) {
        toast.error("Image is too large for the server.");
      } else {
        toast.error(err.response?.data?.message || "Update failed!");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#1A4E11] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Loading Account...</p>
    </div>
  );

  return (
    <div className="bg-gray-50/30 min-h-screen p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Account Settings</h1>
            <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[4px] flex items-center gap-2">
              <IoShieldCheckmarkOutline className="text-[#1A4E11]" /> Manage your personal identity
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              if (isEditing) loadProfile(); 
              setIsEditing(!isEditing);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
              isEditing ? "bg-red-50 text-red-500" : "bg-white text-gray-700 border border-gray-100"
            }`}
          >
            {isEditing ? <><IoCloseOutline size={18}/> Cancel Edit</> : <><IoPersonOutline size={16}/> Edit Details</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[30px] border border-gray-100 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4E11]"></div>
               <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 mx-auto flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl font-black text-[#1A4E11]/20 uppercase">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-[#1A4E11] p-2 rounded-full text-white cursor-pointer hover:scale-110 transition-transform">
                      <IoCameraOutline size={20} />
                      <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
               </div>
               <h2 className="text-lg font-black text-gray-900 uppercase">{user?.name}</h2>
               <span className="inline-block px-3 py-1 bg-[#1A4E11]/10 text-[#1A4E11] text-[9px] font-black uppercase rounded-full mt-2 tracking-widest">{user?.role || 'Member'}</span>
               <div className="mt-8 pt-6 border-t border-gray-50 text-left">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Email Address</p>
                  <p className="text-xs font-bold text-gray-700 truncate">{user?.email}</p>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-10 rounded-[30px] border border-gray-100">
              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400">Full Name</label>
                    <div className="relative">
                      <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400">Phone Number</label>
                    <div className="relative">
                      <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">Official Email</label>
                  <div className="relative">
                    <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="email" readOnly value={user?.email || ""} className="w-full bg-gray-100/50 border border-gray-100 rounded-2xl pl-12 py-4 text-sm font-bold text-gray-300 cursor-not-allowed" />
                  </div>
                </div>
                {isEditing && (
                  <div className="pt-6 border-t border-gray-50">
                    <button 
                      type="submit"
                      disabled={updateLoading}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1A4E11] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-[#143d0d] shadow-xl shadow-[#1A4E11]/20 disabled:opacity-70"
                    >
                      {updateLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><IoSaveOutline size={18}/> Update Account</>}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;