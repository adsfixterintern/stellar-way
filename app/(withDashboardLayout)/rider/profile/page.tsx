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
  IoCloseOutline,
  IoBicycleOutline,
  IoLocationOutline,
  IoCardOutline,
  IoStarOutline,
  IoCheckmarkDoneOutline
} from "react-icons/io5";
import { useSession } from "next-auth/react"; 

import { getMyProfileApi, updateProfileApi } from "@/app/modules/rider/rider.api";

const UserProfile = () => {
  const { data: session, update } = useSession();
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

  const fetchProfile = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getMyProfileApi(userId);
      console.log(data.data) ;     
      if (data.success) {
        setUser(data.data);
        // আপনার ডাটাবেজ অনুযায়ী name এবং phone সেট করা
        setFormData({
          name: data.data.name || data.data.userId?.name || "",
          phone: data.data.phoneNumber || data.data.phone || "",
        });
        setImagePreview(data.data.image || data.data.userId?.image || "");
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
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.data.name,
            image: data.data.image || session?.user?.image,
          },
        });
        toast.success("Profile Updated Successfully!");
        setUser(data.data);
        setIsEditing(false);
        setImage(""); 
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed!");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#1A4E11] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[3px] text-gray-400">Syncing Profile...</p>
    </div>
  );

  return (
    <div className="bg-gray-50/30 min-h-screen p-4 md:p-10 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Rider <span className="text-[#1A4E11]">Profile</span>
            </h1>
          </div>
          
          <button 
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
              isEditing ? "bg-red-50 text-red-500" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isEditing ? <><IoCloseOutline size={18}/> Cancel</> : <><IoPersonOutline size={16}/> Edit Profile</>}
          </button>
        </div>

        {/* Stats Section - Mapping exactly to your JSON fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm text-center">
                <IoStarOutline className="mx-auto text-yellow-500 mb-2" size={24} />
                <p className="text-xl font-black text-gray-900 italic">{user?.rating || 0}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Rating</p>
            </div>
            <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm text-center">
                <IoCheckmarkDoneOutline className="mx-auto text-blue-500 mb-2" size={24} />
                <p className="text-xl font-black text-gray-900 italic">{user?.totalDeliveries || 0}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Deliveries</p>
            </div>
            <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm text-center">
                <IoBicycleOutline className="mx-auto text-[#1A4E11] mb-2" size={24} />
                <p className="text-sm font-black text-gray-900 uppercase italic">{user?.vehicleType || "N/A"}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Vehicle</p>
            </div>
            <div className="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm text-center">
                <IoLocationOutline className="mx-auto text-red-500 mb-2" size={24} />
                <p className="text-sm font-black text-gray-900 uppercase italic">{user?.area || "N/A"}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Area</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 text-center relative overflow-hidden shadow-2xl shadow-gray-100">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4E11]"></div>
               
               <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 rounded-[50px] border-8 border-gray-50 overflow-hidden bg-gray-100 mx-auto flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-5xl font-black text-[#1A4E11]/10 uppercase italic">
                        {(formData.name || "R").charAt(0)}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-[#1A4E11] p-4 rounded-2xl text-white cursor-pointer hover:scale-110 transition-all">
                      <IoCameraOutline size={20} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e: any) => {
                         const file = e.target.files?.[0];
                         if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                               setImagePreview(reader.result as string);
                               setImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                         }
                      }} />
                    </label>
                  )}
               </div>

               <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{formData.name || "Rider"}</h2>
               <div className="inline-block px-4 py-1.5 bg-[#1A4E11]/5 text-[#1A4E11] text-[9px] font-black uppercase rounded-full mt-3 tracking-[0.2em]">
                 {user?.status?.toUpperCase() || 'ACTIVE'}
               </div>

               <div className="mt-10 pt-8 border-t border-gray-50 text-left space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 italic">Status</p>
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${user?.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                       <p className="text-[10px] font-bold uppercase">{user?.isOnline ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 italic">Email Address</p>
                    <div className="flex items-center gap-3 text-gray-600">
                       <IoMailOutline size={14}/>
                       <p className="text-xs font-bold truncate">{user?.userId?.email || session?.user?.email}</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100">
              <form onSubmit={handleUpdateProfile} className="space-y-10">
                
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1A4E11] border-b border-gray-50 pb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                    <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[22px] px-6 py-5 text-sm font-bold outline-none focus:border-[#1A4E11] disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Phone Number</label>
                    <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50/50 border-2 border-gray-50 rounded-[22px] px-6 py-5 text-sm font-bold outline-none focus:border-[#1A4E11] disabled:opacity-50"
                    />
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1A4E11] border-b border-gray-50 pb-4 pt-4">Rider Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">License No</label>
                    <input readOnly value={user?.licenseNumber || "N/A"} className="w-full bg-gray-100/30 border-2 border-gray-50 rounded-[22px] px-6 py-5 text-sm font-bold text-gray-400 outline-none cursor-not-allowed" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Identity Card (NID)</label>
                    <input readOnly value={user?.identityCard || "N/A"} className="w-full bg-gray-100/30 border-2 border-gray-50 rounded-[22px] px-6 py-5 text-sm font-bold text-gray-400 outline-none cursor-not-allowed" />
                  </div>
                </div>

                {isEditing && (
                  <button type="submit" disabled={updateLoading} className="w-full md:w-auto bg-[#1A4E11] text-white px-12 py-5 rounded-[25px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] transition-all">
                    {updateLoading ? "Saving..." : "Update Profile"}
                  </button>
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