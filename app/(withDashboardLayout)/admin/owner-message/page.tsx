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

  // Form states
  const [message, setMessage] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetching logic
  const fetchData = async () => {
    setIsFetching(true);
    try {
      const res = await getOwnerMessage();
      const actualData = res;

      if (actualData && actualData._id) {
        setData(actualData);
        setMessage(actualData.message || "");
        setOwnerName(actualData.ownerName || "");
        setDesignation(actualData.designation || "");
        setPreview(actualData.image || "");
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
    // Basic Validation
    if (!ownerName || !message || !designation) {
      return toast.error("All text fields are required!");
    }

    // Create হলে ইমেজ ম্যান্ডেটরি
    if (!data?._id && !image) {
      return toast.error("Owner image is required for the first time!");
    }

    setLoading(true);
    try {
      const formData = new FormData();

      // গুরুত্বপূর্ণ: টেক্সট ডাটা আগে অ্যাপেন্ড করুন (Backend Compatibility এর জন্য)
      formData.append("ownerName", ownerName);
      formData.append("designation", designation);
      formData.append("message", message);

      if (image) {
        formData.append("image", image);
      }

      const res =
        data && data._id
          ? await updateOwnerMessageApi(formData)
          : await createOwnerMessageApi(formData);

      if (res.success) {
        toast.success(
          data?._id
            ? "Message updated successfully!"
            : "Message created successfully!",
        );
        fetchData(); // Refresh state
        setImage(null);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message || "Server validation failed!";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset the owner message? All fields will be cleared.",
      )
    )
      return;
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

  if (isFetching)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1A4E11]"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <IoChatbubbleEllipsesOutline className="text-[#1A4E11]" />{" "}
              Executive Message
            </h1>
          </div>
          <button
            onClick={handleReset}
            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm group"
            title="Reset to empty"
          >
            <IoTrashOutline
              size={20}
              className="group-active:scale-90 transition-transform"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <IoPersonOutline size={16} className="text-blue-500" /> Full
                    Name
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Enter owner name"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] focus:bg-white outline-none font-bold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <IoIdCardOutline size={16} className="text-amber-500" />{" "}
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Founder & CEO"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] focus:bg-white outline-none font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <IoChatbubbleEllipsesOutline
                    size={16}
                    className="text-green-500"
                  />{" "}
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share the visionary message..."
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#1A4E11] focus:bg-white outline-none font-medium h-44 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <IoCloudUploadOutline size={16} className="text-purple-500" />{" "}
                  Update Photo
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-[#1A4E11] transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#1A4E11]/10 transition-all">
                    <IoCloudUploadOutline
                      size={24}
                      className="text-gray-400 group-hover:text-[#1A4E11]"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700">
                      Change Profile Image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Recommended: Square 1:1 ratio
                    </p>
                  </div>
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
                className="w-full bg-[#1A4E11] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400 mt-4"
              >
                {loading ? (
                  <IoRefreshOutline className="animate-spin" size={24} />
                ) : (
                  <>
                    {" "}
                    <IoSaveOutline size={24} />{" "}
                    {data?._id ? "PUBLISH CHANGES" : "CREATE MESSAGE"}{" "}
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Right: Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-10 space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">
                Live Preview
              </label>
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 flex flex-col items-center text-center overflow-hidden">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Owner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <IoPersonOutline size={50} />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1A4E11] rounded-full border-4 border-white flex items-center justify-center text-white">
                    <IoIdCardOutline size={18} />
                  </div>
                </div>

                <div className="mt-8 space-y-1">
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {ownerName || "Full Name"}
                  </h2>
                  <p className="text-[#1A4E11] text-[10px] font-black uppercase tracking-[0.2em]">
                    {designation || "Executive Position"}
                  </p>
                </div>

                <div className="mt-6 relative px-4">
                  <span className="text-5xl text-[#1A4E11]/10 absolute -top-4 -left-2 font-serif select-none">
                    “
                  </span>
                  <p className="text-gray-500 italic text-sm md:text-base leading-relaxed relative z-10">
                    {message ||
                      "The owner's message will provide insight into the brand's vision and commitment to excellence. Your words inspire confidence in your clients."}
                  </p>
                  <span className="text-5xl text-[#1A4E11]/10 absolute -bottom-10 -right-2 font-serif select-none">
                    ”
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OwnerMessagePage;
