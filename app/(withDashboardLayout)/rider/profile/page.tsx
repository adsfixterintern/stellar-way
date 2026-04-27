
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { 
  IoPersonOutline, IoCameraOutline, IoSaveOutline, IoCloseOutline,
   IoIdCardOutline, IoDocumentTextOutline
} from "react-icons/io5";
import { useSession } from "next-auth/react"; 
import { getAllRidersApi, getSingleRiderApi, updateProfileApi, updateRiderApi } from "@/app/modules/rider/rider.api";

const UserProfile = () => {
  const { data: session, update } = useSession();
  const currentUserId = session?.user?.id; 
  
  const [riderData, setRiderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "", 
    phoneNumber: "", 
    vehicleType: "bike",
    area: "",
    isBusy: false,
    image: ""
  });

  const [imagePreview, setImagePreview] = useState("");

  const fetchProfile = async () => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      const result = await getAllRidersApi();
      
      if (result.success && Array.isArray(result.data)) {
        const matchedRider = result.data.find((r: any) => 
            (typeof r.userId === 'object' ? r.userId?._id : r.userId) === currentUserId
        );

        if (matchedRider) {
          const riderDetails = await getSingleRiderApi(matchedRider._id);
          if (riderDetails.success) {
            const d = riderDetails.data;
            setRiderData(d);
            
            setFormData({
              name: d.userId?.name || "",
              phone: d.userId?.phone || "",
              phoneNumber: d.phoneNumber || "",
              vehicleType: d.vehicleType || "bike",
              area: d.area || "",
              isBusy: d.isBusy || false,
              image: d.userId?.image || ""
            });
            setImagePreview(d.userId?.image || "");
          }
        }
      }
    } catch (err: any) {
      toast.error("Not able to load profile data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [currentUserId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true); 

    try {
      const userPayload = {
        name: formData.name,
        phone: formData.phone,
        userId: currentUserId as string,
        image: formData.image
      };
      await updateProfileApi(userPayload);

      const riderPayload = {
        phoneNumber: formData.phoneNumber,
        vehicleType: formData.vehicleType as any,
        area: formData.area,
        isBusy: formData.isBusy
      };
      const riderRes = await updateRiderApi(riderData._id, riderPayload);

      if (riderRes.success) {
        await update({
          ...session,
          user: { ...session?.user, name: formData.name, image: formData.image || session?.user?.image }
        });
        toast.success("সব তথ্য আপডেট হয়েছে!");
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err: any) {
      toast.error("Not able to update profile!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  // Skeleton UI Component
  if (loading) return (
    <div className="max-w-6xl mx-auto p-10 animate-pulse">
      <div className="h-12 w-64 bg-gray-200 rounded-xl mb-10"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 h-96 bg-gray-100 rounded-[40px]"></div>
        <div className="lg:col-span-8 h-96 bg-gray-100 rounded-[40px]"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50/30 min-h-screen p-4 md:p-10 font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
            Rider <span className="text-[#1A4E11]">Settings</span>
          </h1>
          <button 
            disabled={updateLoading}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${isEditing ? "bg-red-50 text-red-500" : "bg-white text-gray-700"}`}
          >
            {isEditing ? <IoCloseOutline size={18} className="inline mr-1"/> : <IoPersonOutline size={16} className="inline mr-1"/>}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 rounded-[40px] border border-gray-100 text-center relative shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4E11]"></div>
               
               <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 rounded-[50px] border-8 border-gray-50 overflow-hidden bg-gray-100 mx-auto flex items-center justify-center">
                    <img src={imagePreview || "https://ui-avatars.com/api/?name=Rider"} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-[#1A4E11] p-3 rounded-2xl text-white cursor-pointer hover:scale-110 transition-all shadow-lg">
                      <IoCameraOutline size={20} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
               </div>

               <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{formData.name}</h2>
               <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{riderData?.userId?.email}</p>
               
               <div className="mt-6 flex flex-col gap-3">
                    <div className="px-4 py-1.5 text-[9px] font-black uppercase rounded-full border bg-green-50 text-green-600 border-green-100 mx-auto">
                        Status: {riderData?.status || 'ACTIVE'}
                    </div>
                    <div className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-full border mx-auto transition-all ${formData.isBusy ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {formData.isBusy ? 'Currently Busy' : 'Ready to Deliver'}
                    </div>
               </div>

               {/* Stats Display */}
               <div className="mt-10 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg font-black text-gray-900 italic">{riderData?.rating || 0}</p>
                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Rating</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 italic">{riderData?.totalDeliveries || 0}</p>
                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Deliveries</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Fields */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-2xl">
                
                {/* Editable Section */}
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#1A4E11] border-b pb-4 mb-8">Personal & Rider Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                    <input disabled={!isEditing} type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-50 rounded-[22px] px-6 py-4 text-sm font-bold focus:border-[#1A4E11] outline-none transition-all disabled:opacity-60"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Public Phone</label>
                    <input disabled={!isEditing} type="text" value={formData.phoneNumber} onChange={(e)=>setFormData({...formData, phoneNumber: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-50 rounded-[22px] px-6 py-4 text-sm font-bold focus:border-[#1A4E11] outline-none transition-all disabled:opacity-60"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Vehicle Type</label>
                    <select disabled={!isEditing} value={formData.vehicleType} onChange={(e)=>setFormData({...formData, vehicleType: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-50 rounded-[22px] px-6 py-4 text-sm font-bold focus:border-[#1A4E11] outline-none appearance-none disabled:opacity-60">
                        <option value="bike">Motorcycle</option>
                        <option value="cycle">Cycle</option>
                        <option value="car">Car / Van</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Operation Area</label>
                    <input disabled={!isEditing} type="text" value={formData.area} onChange={(e)=>setFormData({...formData, area: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-50 rounded-[22px] px-6 py-4 text-sm font-bold focus:border-[#1A4E11] outline-none transition-all disabled:opacity-60"/>
                  </div>
                </div>

                {/* Read-Only Info Section (আপনার চাহিত licenseNumber & identityCard) */}
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 border-b pb-4 mb-8">Identification (Verified)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 opacity-70">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 flex items-center gap-2">
                        <IoDocumentTextOutline /> License Number
                    </label>
                    <div className="w-full bg-gray-100 rounded-[22px] px-6 py-4 text-sm font-bold text-gray-500">
                        {riderData?.licenseNumber || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1 flex items-center gap-2">
                        <IoIdCardOutline /> Identity Card (NID)
                    </label>
                    <div className="w-full bg-gray-100 rounded-[22px] px-6 py-4 text-sm font-bold text-gray-500">
                        {riderData?.identityCard || "N/A"}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                        <button 
                            type="button"
                            onClick={() => setFormData({...formData, isBusy: !formData.isBusy})}
                            className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-md ${formData.isBusy ? 'bg-orange-500 text-white' : 'bg-green-600 text-white'}`}
                        >
                            {formData.isBusy ? "Status: Busy" : "Status: Available"}
                        </button>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={updateLoading} 
                        className="w-full md:w-auto bg-[#1A4E11] text-white px-12 py-5 rounded-[25px] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:bg-gray-400 disabled:scale-100"
                    >
                      {updateLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Updating Details...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <IoSaveOutline size={18} /> Save All Changes
                        </span>
                      )}
                    </button>
                  </div>
                )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;