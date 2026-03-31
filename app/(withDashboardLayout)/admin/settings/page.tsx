/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import {
  IoSettingsOutline,
  IoCloudUploadOutline,
  IoGlobeOutline,
  IoHammerOutline,
  IoBicycleOutline,
  IoReceiptOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline
} from "react-icons/io5";

// API মডিউল ইমপোর্ট
import { getSettingsApi, updateSettingsApi } from "@/app/modules/settings/settings.api";

interface SettingsData {
  siteName: string;
  maintenanceMode: boolean;
  tax: number;
  logo: string;
  email: string;
  phone: string;
  location: string;
  deliveryCharge: {
    insideDhaka: number;
    outsideDhaka: number;
  };
}

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<SettingsData>({
    siteName: "",
    maintenanceMode: false,
    tax: 0,
    logo: "",
    email: "",
    phone: "",
    location: "",
    deliveryCharge: {
      insideDhaka: 0,
      outsideDhaka: 0,
    },
  });

  // Fetch Settings via Module
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettingsApi();
        if (data.success) {
          setFormData(data.data);
          setImagePreview(data.data.logo);
        }
      } catch (err: any) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const updateData = new FormData();
      updateData.append("siteName", formData.siteName);
      updateData.append("maintenanceMode", String(formData.maintenanceMode));
      updateData.append("tax", String(formData.tax));
      updateData.append("email", formData.email);
      updateData.append("phone", formData.phone);
      updateData.append("location", formData.location);
      
      // Nested objects must be appended carefully
      updateData.append("deliveryCharge[insideDhaka]", String(formData.deliveryCharge.insideDhaka));
      updateData.append("deliveryCharge[outsideDhaka]", String(formData.deliveryCharge.outsideDhaka));
      
      if (logoFile) {
        updateData.append("logo", logoFile);
      }

      const data = await updateSettingsApi(updateData);

      if (data.success) {
        toast.success("Settings updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return (
    <div className="p-24 text-center">
      <div className="w-10 h-10 border-4 border-[#1A4E11] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="font-black uppercase text-[10px] tracking-[0.3em] text-gray-400">Syncing System Configurations...</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto pb-20 p-4 font-sans">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-3">
          <IoSettingsOutline className="text-[#1A4E11]" /> Site Settings
        </h1>
        <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[0.4em]">
          Global Control Panel & Branding
        </p>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Col: Branding & Status */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 block italic">Brand Identity</label>
            <label className="relative flex flex-col items-center justify-center w-full h-56 border-4 border-dashed border-gray-50 rounded-[25px] cursor-pointer hover:bg-gray-50 transition-all overflow-hidden group shadow-inner">
              {imagePreview ? (
                <img src={imagePreview} alt="Logo" className="w-full h-full object-contain p-6" />
              ) : (
                <div className="text-center">
                  <IoCloudUploadOutline size={48} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Upload Logo</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              <div className="absolute inset-0 bg-[#1A4E11]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Logo</span>
              </div>
            </label>
          </div>

          <div className="bg-white p-8 rounded-[30px] border border-gray-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 block italic">System Health</label>
            <div 
              onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
              className={`w-full flex items-center justify-between p-5 rounded-[22px] cursor-pointer transition-all border-2 ${formData.maintenanceMode ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-gray-50 border-gray-50 text-gray-400'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${formData.maintenanceMode ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                   <IoHammerOutline size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-tight">
                  Maintenance
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all shadow-inner ${formData.maintenanceMode ? 'bg-amber-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.maintenanceMode ? 'right-1.5' : 'left-1.5'}`}></div>
              </div>
            </div>
            <p className="text-[9px] font-bold text-gray-400 mt-4 px-2">Enable this to block customer access during updates.</p>
          </div>
        </div>

        {/* Right Col: Fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-100/50 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1 italic">Platform Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.siteName} 
                    onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    className="w-full border-2 border-gray-50 p-4.5 rounded-[20px] outline-none focus:border-[#1A4E11] focus:bg-white text-sm bg-gray-50 font-bold transition-all"
                  />
                  <IoGlobeOutline className="absolute right-5 top-4.5 text-gray-300" size={20} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1 italic">Govt. Tax (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.tax} 
                    onChange={(e) => setFormData({...formData, tax: Number(e.target.value)})}
                    className="w-full border-2 border-gray-50 p-4.5 rounded-[20px] outline-none focus:border-[#1A4E11] focus:bg-white text-sm bg-gray-50 font-bold transition-all"
                  />
                  <IoReceiptOutline className="absolute right-5 top-4.5 text-gray-300" size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:col-span-1">
                 <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1 italic">Shipping Charges (৳)</label>
                 </div>
                 <input 
                    type="number" 
                    placeholder="Inside"
                    value={formData.deliveryCharge.insideDhaka} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      deliveryCharge: {...formData.deliveryCharge, insideDhaka: Number(e.target.value)}
                    })}
                    className="w-full border-2 border-gray-50 p-4.5 rounded-[20px] outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-bold"
                  />
                  <input 
                    type="number" 
                    placeholder="Outside"
                    value={formData.deliveryCharge.outsideDhaka} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      deliveryCharge: {...formData.deliveryCharge, outsideDhaka: Number(e.target.value)}
                    })}
                    className="w-full border-2 border-gray-50 p-4.5 rounded-[20px] outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-bold"
                  />
              </div>

               <div className="md:col-span-2 space-y-8 pt-6 border-t border-dashed border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1 italic">Support Email</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full border-2 border-gray-50 p-4.5 rounded-[20px] outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-bold"
                        />
                        <IoMailOutline className="absolute right-5 top-4.5 text-gray-300" size={20} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1 italic">Hotline Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full border-2 border-gray-50 p-4.5 rounded-[20px] outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-bold"
                        />
                        <IoCallOutline className="absolute right-5 top-4.5 text-gray-300" size={20} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block ml-1 italic">Physical Address</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full border-2 border-gray-50 p-4.5 rounded-[20px] outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-bold"
                      />
                      <IoLocationOutline className="absolute right-5 top-4.5 text-gray-300" size={20} />
                    </div>
                  </div>
               </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-[#1A4E11] text-white py-5 rounded-[25px] font-black text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 disabled:bg-gray-200 transition-all shadow-2xl shadow-green-900/20 cursor-pointer"
              >
                {btnLoading ? "Synchronizing..." : "Update Global Settings"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;