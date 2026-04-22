/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { 
  IoPersonOutline, IoCallOutline, IoCameraOutline,
  IoShieldCheckmarkOutline, IoSaveOutline, IoCloseOutline, IoMailOutline
} from "react-icons/io5";
import { useSession } from "next-auth/react";
import { getMeApi, updateProfileApi } from "@/app/modules/auth/auth.api"; 

const UserProfile = () => {
  const { data: session, update } = useSession(); 
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(""); 

  const loadProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const res: any = await getMeApi(session.user.id);      
      if (res.success && res.data) {
        const profileData = res.data.user || res.data;
        setUser(profileData);
        setFormData({ name: profileData.name || "", phone: profileData.phone || "" });
        setImagePreview(profileData.image || ""); 
      }
    } catch (err: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const payload = new FormData();
      payload.append("userId", session?.user?.id as string);
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);
      if (imageFile) payload.append("file", imageFile); 

      const res: any = await updateProfileApi(payload);

      if (res.success) {
        const updatedUser = res.data?.user || res.data;
        
        // ✅ গ্লোবাল সেশন কন্টেক্সট আপডেট করা হচ্ছে
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: updatedUser.image,
            phone: formData.phone
          }
        });

        toast.success("Profile Updated & Synced!");
        setUser(updatedUser);
        setIsEditing(false);
        setImageFile(null);
      }
    } catch (err: any) {
      toast.error("Update failed!");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20">Loading Account...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 font-sans text-gray-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase italic leading-none">Account Settings</h1>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[4px] flex items-center gap-2">
            <IoShieldCheckmarkOutline className="text-[#1A4E11]" /> Manage Personal Identity
          </p>
        </div>
        <button 
          onClick={() => { if (isEditing) loadProfile(); setIsEditing(!isEditing); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isEditing ? "bg-red-50 text-red-500" : "bg-white text-gray-700 border border-gray-100"}`}
        >
          {isEditing ? <><IoCloseOutline size={18}/> Cancel</> : <><IoPersonOutline size={16}/> Edit Details</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[30px] border border-gray-100 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4E11]"></div>
             <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 mx-auto flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl font-black text-[#1A4E11]/20 uppercase">{user?.name?.charAt(0)}</div>
                  )}
                </div>
                {isEditing && (
                  <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-[#1A4E11] p-2 rounded-full text-white cursor-pointer hover:scale-110 transition-transform">
                    <IoCameraOutline size={20} />
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={(e: any) => {
                       const file = e.target.files?.[0];
                       if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                    }} />
                  </label>
                )}
             </div>
             <h2 className="text-lg font-black text-gray-900 uppercase truncate px-2">{user?.name}</h2>
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
                    <input type="text" disabled={!isEditing} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none disabled:opacity-50 transition-all" required />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">Phone</label>
                  <div className="relative">
                    <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" disabled={!isEditing} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none disabled:opacity-50 transition-all" />
                  </div>
                </div>
              </div>
              {isEditing && (
                <button type="submit" disabled={updateLoading} className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1A4E11] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-[#143d0d] shadow-xl disabled:opacity-70 transition-all">
                  {updateLoading ? "Updating..." : <><IoSaveOutline size={18}/> Update Account</>}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;