/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  IoCloudUploadOutline,
  IoPersonOutline,
  IoIdCardOutline,
  IoChatbubbleEllipsesOutline,
  IoSaveOutline,
  IoTrashOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";

import {
  getOwnerMessage,
  createOwnerMessageApi,
  updateOwnerMessageApi,
  resetOwnerMessageApi,
  IOwnerMessage,
} from "@/app/modules/ownerMessage/ownerMessage.api";

const OwnerMessagePage = () => {
  const [data, setData] = useState<IOwnerMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [message, setMessage] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setIsFetching(true);
    try {
      const res = await getOwnerMessage();
      if (res && res._id) {
        setData(res);
        setMessage(res.message || "");
        setOwnerName(res.ownerName || "");
        setDesignation(res.designation || "");
        setPreview(res.image || "");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!ownerName || !message || !designation) {
      return toast.error("All text fields are required!");
    }
    if (!data?._id && !image) {
      return toast.error("Owner image is required!");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ownerName", ownerName);
      formData.append("designation", designation);
      formData.append("message", message);
      if (image) formData.append("image", image);

      const res =
        data && data._id
          ? await updateOwnerMessageApi(formData)
          : await createOwnerMessageApi(formData);

      if (res.success) {
        toast.success("Success!");
        fetchData();
        setImage(null);
      }
    } catch (err: any) {
      toast.error("Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Clear everything?")) return;
    try {
      await resetOwnerMessageApi();
      toast.success("Reset successful!");
      setData(null);
      setMessage("");
      setOwnerName("");
      setDesignation("");
      setPreview("");
      setImage(null);
    } catch {
      toast.error("Reset failed!");
    }
  };

  if (isFetching) return <PageSkeleton />;

  return (
    <div className=" min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
              <span className="text-[#1A4E11]">Executive</span> Message
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              Visionary Dashboard
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-3.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
          >
            <IoTrashOutline size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left Column: Editor (Order 1 on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 order-1"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 p-6 md:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] outline-none font-bold text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] outline-none font-bold text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Visionary Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] outline-none font-medium h-40 transition-all resize-none text-sm leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Profile Photo
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 transition-all group"
                >
                  <IoCloudUploadOutline
                    size={24}
                    className="text-gray-300 group-hover:text-[#1A4E11]"
                  />
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    Change Image
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#1A4E11] text-white py-5 rounded-xl font-black text-xs uppercase shadow-[#1A4E11]/10 hover:bg-black transition-all active:scale-95 disabled:bg-gray-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <IoRefreshOutline className="animate-spin" size={20} />
                ) : (
                  <>
                    <IoSaveOutline size={18} />
                    Update Content
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right Column: Preview (Order 2 on Mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 order-2"
          >
            <div className="sticky top-10 flex flex-col items-center">
              <div className="w-full bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.02)] border border-gray-50 p-8 md:p-12 text-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100">
                    {preview ? (
                      <img
                        src={preview}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200">
                        <IoPersonOutline size={50} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#1A4E11] rounded-full border-4 border-white flex items-center justify-center text-white">
                    <IoIdCardOutline size={18} />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                  {ownerName || "Full Name"}
                </h2>
                <p className="text-[#1A4E11] text-[10px] font-black uppercase tracking-[3px] mt-1">
                  {designation || "Executive"}
                </p>
                <div className="mt-8 px-2 relative">
                  <span className="text-4xl text-[#1A4E11]/10 absolute -top-4 -left-0">
                    “
                  </span>
                  <p className="text-gray-500 italic text-xs md:text-sm leading-loose">
                    {message ||
                      "Your message will provide insight into your brand vision..."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// SKELETON COMPONENT
const PageSkeleton = () => (
  <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded-xl"></div>
        <div className="h-3 w-24 bg-gray-100 rounded-full"></div>
      </div>
      <div className="h-12 w-12 bg-gray-100 rounded-2xl"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-7 space-y-6">
        <div className="h-80 bg-white rounded-[2.5rem] border border-gray-50"></div>
      </div>
      <div className="lg:col-span-5">
        <div className="h-96 bg-white rounded-[3.5rem] border border-gray-50"></div>
      </div>
    </div>
  </div>
);

export default OwnerMessagePage;
