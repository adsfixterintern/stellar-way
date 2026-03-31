/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
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

// এপিআই মডিউল ইমপোর্ট
import { getMeApi, updateProfileApi } from "@/app/modules/auth/auth.api";

const UserProfile = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [image, setImage] = useState(""); 
  const [imagePreview, setImagePreview] = useState("");

  // ১. প্রোফাইল ডাটা ফেচ করা
  const fetchProfile = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getMeApi(userId);      
      if (data.success) {
        setUser(data.data);
        setFormData({
          name: data.data.name || "",
          phone: data.data.phone || "",
        });
        setImagePreview(data.data.image || "");
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      toast.error(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // ২. ইমেজ হ্যান্ডলিং
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large! Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result as string);
        setImage(reader.result as string);       
      }
    };
    reader.readAsDataURL(file);
  };

  // ৩. প্রোফাইল আপডেট
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setUpdateLoading(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        userId: userId, 
        image: image || undefined    
      };

      const data = await updateProfileApi(payload);

      if (data.success) {
        toast.success("Profile Updated Successfully!");
        setUser(data.data);
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
      <p className="mt-4 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Synchronizing Identity...</p>
    </div>
  );

  return (
    <div className="bg-gray-50/30 min-h-screen p-4 md:p-10 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Account <span className="text-[#1A4E11]">Settings</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-black mt-3 uppercase tracking-[0.4em] flex items-center gap-2">
              <IoShieldCheckmarkOutline className="text-[#1A4E11]" /> Secure Profile Management
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              setIsEditing(!isEditing);
              if(isEditing) fetchProfile(); 
            }}
            className={`flex items-center gap-2 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-gray-200/50 ${
              isEditing ? "bg-red-50 text-red-500 border border-red-100" : "bg-white text-gray-700 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {isEditing ? <><IoCloseOutline size={18}/> Cancel</> : <><IoPersonOutline size={16}/> Edit Profile</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Avatar Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 text-center relative overflow-hidden shadow-2xl shadow-gray-100">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4E11]"></div>
               
               <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 rounded-[50px] border-8 border-gray-50 overflow-hidden bg-gray-100 mx-auto flex items-center justify-center shadow-inner">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl font-black text-[#1A4E11]/10 uppercase italic">
                        {user?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <label 
                      htmlFor="image-upload"
                      className="absolute -bottom-2 -right-2 bg-[#1A4E11] p-4 rounded-2xl text-white cursor-pointer hover:scale-110 transition-all shadow-lg shadow-green-900/20"
                    >
                      <IoCameraOutline size={20} />
                      <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
               </div>

               <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{user?.name}</h2>
               <div className="inline-block px-4 py-1.5 bg-[#1A4E11]/5 text-[#1A4E11] text-[9px] font-black uppercase rounded-full mt-3 tracking-[0.2em] border border-[#1A4E11]/10">
                 {user?.role || 'Verified Member'}
               </div>

               <div className="mt-10 pt-8 border-t border-gray-50 text-left space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 italic">Contact Channel</p>
                    <div className="flex items-center gap-3 text-gray-600">
                       <div className="p-2 bg-gray-50 rounded-lg"><IoMailOutline size={14}/></div>
                       <p className="text-xs font-bold truncate">{user?.email}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-8">
            <div className="bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100">
              <form onSubmit={handleUpdateProfile} className="space-y-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Full Name</label>
                    <div className="relative">
                      <IoPersonOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[22px] pl-14 pr-6 py-5 text-sm font-bold text-gray-800 outline-none focus:border-[#1A4E11] focus:bg-white transition-all disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Mobile Access</label>
                    <div className="relative">
                      <IoCallOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[22px] pl-14 pr-6 py-5 text-sm font-bold text-gray-800 outline-none focus:border-[#1A4E11] focus:bg-white transition-all disabled:opacity-50"
                        placeholder="+880"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 italic">Security Email (Non-Editable)</label>
                  <div className="relative">
                    <IoMailOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
                    <input 
                      type="email"
                      readOnly
                      value={user?.email || ""}
                      className="w-full bg-gray-100/30 border-2 border-gray-50 rounded-[22px] pl-14 pr-6 py-5 text-sm font-bold text-gray-300 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-8 border-t border-gray-50">
                    <button 
                      type="submit"
                      disabled={updateLoading}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1A4E11] text-white px-12 py-5 rounded-[25px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-green-900/20 disabled:opacity-70"
                    >
                      {updateLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <><IoSaveOutline size={20}/> Save Changes</>
                      )}
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