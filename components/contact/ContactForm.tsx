/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoSendOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { FiUser, FiMail, FiPhone, FiMessageSquare } from "react-icons/fi";
import toast from "react-hot-toast";
import { sendContactMessageApi, IContactFormData } from "@/app/modules/contact/contact.api";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const target = e.target as HTMLFormElement;
    const payload: IContactFormData = {
      name: (target.elements.namedItem("name") as HTMLInputElement).value,
      email: (target.elements.namedItem("email") as HTMLInputElement).value,
      phone: (target.elements.namedItem("phone") as HTMLInputElement).value,
      message: (target.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await sendContactMessageApi(payload);
      if (res.success) {
        toast.success(res.message || "Message sent successfully!");
        target.reset(); 
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to send message!";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Light Glass Input Style
  const inputStyle = "w-full px-5 py-4 bg-white/40 border border-white/60 rounded-2xl outline-none transition-all placeholder:text-gray-400 text-gray-800 focus:bg-white/80 focus:border-[#1A4E11]/30 shadow-sm";

  return (
    // Light Background with soft colorful blobs
    <div className="w-full py-24 bg-[#F3F7F4] relative overflow-hidden">
      
      {/* Soft Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-green-200 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full md:w-[65%] lg:w-[55%] mx-auto relative z-10 px-4"
      >
        {/* Glass Container */}
        <div className="backdrop-blur-2xl bg-white/30 border border-white/80 p-8 md:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
              Let us Start a <span className="text-[#1A4E11]">Conversation</span>
            </h2>
            <p className="text-gray-600 text-sm font-medium max-w-sm">
              Have a question in mind? Reach out and feel free to ask.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="relative">
                <FiUser className="absolute left-5 top-5 text-gray-400" size={18} />
                <input
                  name="name" 
                  type="text"
                  placeholder="Full Name"
                  required
                  className={`${inputStyle} pl-12`}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail className="absolute left-5 top-5 text-gray-400" size={18} />
                <input
                  name="email" 
                  type="email"
                  placeholder="Email Address"
                  required
                  className={`${inputStyle} pl-12`}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="relative">
              <FiPhone className="absolute left-5 top-5 text-gray-400" size={18} />
              <input
                name="phone" 
                type="tel"
                placeholder="Phone Number"
                className={`${inputStyle} pl-12`}
              />
            </div>

            {/* Message */}
            <div className="relative">
              <FiMessageSquare className="absolute left-5 top-5 text-gray-400" size={18} />
              <textarea
                name="message"
                placeholder="Your project details..."
                required
                rows={4}
                className={`${inputStyle} pl-12 resize-none`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                whileTap={!loading ? { scale: 0.98 } : {}}
                disabled={loading}
                type="submit"
                className={`w-full py-5 rounded-2xl font-black tracking-widest flex items-center justify-center gap-3 transition-all duration-300
                  ${loading 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-[#1A4E11] text-white hover:bg-black shadow-lg shadow-[#1A4E11]/10"}`}
              >
                {loading ? (
                  <>
                    <BiLoaderAlt className="animate-spin" size={20} />
                    SENDING...
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <IoSendOutline size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;