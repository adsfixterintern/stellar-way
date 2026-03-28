"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
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
  const BASE_URL = "http://localhost:8000/api/v1";

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Form State
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

  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/settings`);
        if (data.success) {
          setFormData(data.data);
          setImagePreview(data.data.logo);
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Update Settings
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
      updateData.append("deliveryCharge[insideDhaka]", String(formData.deliveryCharge.insideDhaka));
      updateData.append("deliveryCharge[outsideDhaka]", String(formData.deliveryCharge.outsideDhaka));
      
      if (logoFile) {
        updateData.append("logo", logoFile);
      }

      const { data } = await axios.patch(`${BASE_URL}/settings/update`, updateData);

      if (data.success) {
        toast.success("Settings updated successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase text-[10px] tracking-widest text-gray-400">Loading Settings...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <IoSettingsOutline /> Site Settings
        </h1>
        <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
          Configure your platform's global parameters
        </p>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Branding & Status */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[10px] border border-gray-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Site Logo</label>
            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all overflow-hidden group">
              {imagePreview ? (
                <img src={imagePreview} alt="Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <IoCloudUploadOutline size={40} className="text-gray-200" />
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-[10px] font-bold uppercase">Change Logo</span>
              </div>
            </label>
          </div>

          <div className="bg-white p-6 rounded-[10px] border border-gray-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Maintenance Mode</label>
            <div 
              onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
              className={`w-full flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${formData.maintenanceMode ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
            >
              <span className="text-sm font-bold flex items-center gap-2">
                <IoHammerOutline /> {formData.maintenanceMode ? "Enabled" : "Disabled"}
              </span>
              <div className={`w-10 h-5 rounded-full relative transition-all ${formData.maintenanceMode ? 'bg-amber-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Configuration */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[10px] border border-gray-100 shadow-sm space-y-6">
            
            {/* General Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Site Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.siteName} 
                    onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                  <IoGlobeOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Tax (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.tax} 
                    onChange={(e) => setFormData({...formData, tax: Number(e.target.value)})}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                  <IoReceiptOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Inside Dhaka Charge (৳)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.deliveryCharge.insideDhaka} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      deliveryCharge: {...formData.deliveryCharge, insideDhaka: Number(e.target.value)}
                    })}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                  <IoBicycleOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Outside Dhaka Charge (৳)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.deliveryCharge.outsideDhaka} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      deliveryCharge: {...formData.deliveryCharge, outsideDhaka: Number(e.target.value)}
                    })}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                  <IoBicycleOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

               <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Support Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                  <IoMailOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
               <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Contact Phone</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                  <IoCallOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Office Location</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                  <IoLocationOutline className="absolute right-4 top-4 text-gray-300" size={20} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-[#1A4E11] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[2px] hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-[#1A4E11]/20 cursor-pointer"
              >
                {btnLoading ? "Updating Settings..." : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;