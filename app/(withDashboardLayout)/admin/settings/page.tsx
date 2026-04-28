/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import {
  IoSettingsOutline,
  IoCloudUploadOutline,
  IoGlobeOutline,
  IoHammerOutline,
  IoReceiptOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";

// API মডিউল ইমপোর্ট
import {
  getSettingsApi,
  updateSettingsApi,
} from "@/app/modules/settings/settings.api";

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
      updateData.append(
        "deliveryCharge[insideDhaka]",
        String(formData.deliveryCharge.insideDhaka),
      );
      updateData.append(
        "deliveryCharge[outsideDhaka]",
        String(formData.deliveryCharge.outsideDhaka),
      );

      if (logoFile) {
        updateData.append("logo", logoFile);
      }

      const data = await updateSettingsApi(updateData);
      if (data.success) {
        toast.success("Settings updated!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <SettingsSkeleton />;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-10 pb-20 font-sans">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center justify-center md:justify-start gap-3">
          <IoSettingsOutline className="text-[#1A4E11]" /> Global Settings
        </h1>
        <p className="text-[9px] md:text-[10px] text-gray-400 font-black mt-1 uppercase tracking-[0.4em]">
          System Control & Branding Panel
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10"
      >
        {/* Left Column */}
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 block italic">
              Brand Logo
            </label>
            <label className="relative flex flex-col items-center justify-center w-full h-48 md:h-56 border-4 border-dashed border-gray-50 rounded-[25px] cursor-pointer hover:bg-gray-50 transition-all overflow-hidden group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Logo"
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center">
                  <IoCloudUploadOutline
                    size={40}
                    className="text-gray-200 mx-auto mb-2"
                  />
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    Upload
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="absolute inset-0 bg-[#1A4E11]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <span className="text-white text-[9px] font-black uppercase tracking-widest">
                  Replace
                </span>
              </div>
            </label>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 block italic">
              System Status
            </label>
            <div
              onClick={() =>
                setFormData({
                  ...formData,
                  maintenanceMode: !formData.maintenanceMode,
                })
              }
              className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] cursor-pointer transition-all border-2 ${formData.maintenanceMode ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-gray-50 border-gray-50 text-gray-400"}`}
            >
              <div className="flex items-center gap-3">
                <IoHammerOutline size={18} />
                <span className="text-[11px] font-black uppercase italic">
                  Maintenance
                </span>
              </div>
              <div
                className={`w-10 h-5 rounded-full relative transition-all ${formData.maintenanceMode ? "bg-amber-500" : "bg-gray-300"}`}
              >
                <div
                  className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.maintenanceMode ? "right-1" : "left-1"}`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">
                  Platform Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) =>
                      setFormData({ ...formData, siteName: e.target.value })
                    }
                    className="w-full bg-gray-50/50 border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm transition-all"
                  />
                  <IoGlobeOutline
                    className="absolute right-4 top-4 text-gray-300"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">
                  Tax (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.tax}
                    onChange={(e) =>
                      setFormData({ ...formData, tax: Number(e.target.value) })
                    }
                    className="w-full bg-gray-50/50 border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm"
                  />
                  <IoReceiptOutline
                    className="absolute right-4 top-4 text-gray-300"
                    size={18}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">
                    Shipping (Inside/Outside)
                  </label>
                </div>
                <input
                  type="number"
                  value={formData.deliveryCharge.insideDhaka}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryCharge: {
                        ...formData.deliveryCharge,
                        insideDhaka: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-gray-50/50 border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm"
                  placeholder="In"
                />
                <input
                  type="number"
                  value={formData.deliveryCharge.outsideDhaka}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deliveryCharge: {
                        ...formData.deliveryCharge,
                        outsideDhaka: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full bg-gray-50/50 border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm"
                  placeholder="Out"
                />
              </div>

              <div className="md:col-span-2 pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-gray-50/50 border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm"
                      />
                      <IoMailOutline
                        className="absolute right-4 top-4 text-gray-300"
                        size={18}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">
                      Phone
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-gray-50/50 border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm"
                      />
                      <IoCallOutline
                        className="absolute right-4 top-4 text-gray-300"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block italic">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-gray-50/50 border-2 border-gray-50 p-4 rounded-2xl outline-none focus:border-[#1A4E11] font-bold text-sm"
                    />
                    <IoLocationOutline
                      className="absolute right-4 top-4 text-gray-300"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={btnLoading}
              className="w-full md:w-auto px-10 bg-[#1A4E11] text-white py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#1A4E11]/10 active:scale-95 transition-all disabled:bg-gray-200"
            >
              {btnLoading ? "Syncing..." : "Update Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const SettingsSkeleton = () => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto animate-pulse space-y-10">
    <div className="h-10 w-64 bg-gray-200 rounded-xl"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="space-y-6">
        <div className="h-64 bg-white rounded-[2rem] border border-gray-50"></div>
        <div className="h-24 bg-white rounded-[2rem] border border-gray-50"></div>
      </div>
      <div className="lg:col-span-2">
        <div className="h-[500px] bg-white rounded-[2.5rem] border border-gray-50"></div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
