/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { forgetPasswordApi } from "@/app/modules/auth/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.includes("@")) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);
    
    try {
      const res = await forgetPasswordApi(email);

      if (res.success) {
        toast.success(res.message || "Reset link sent to your email!");
        setEmail("");
      } else {
        toast.error(res.message || "Failed to send reset link");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] p-6">
      <div className="w-full max-w-md bg-white rounded-[30px] p-8 md:p-10 shadow-[0px_25px_80px_rgba(26,78,17,0.1)]">
        <Link href="/login" className="flex items-center gap-2 text-[#1a4e11] hover:underline mb-8 text-sm font-medium transition-all">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="mb-8">
          <h2 className="subTitle text-black! mb-2">Forgot Password?</h2>
          <p className="description text-sm normal-case">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="nameText text-[14px]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-13 px-4 pl-11 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#1a4e11] transition-all text-sm"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="blockBtn w-full! h-13! rounded-xl! shadow-lg active:scale-95 transition-all font-bold"
          >
            {loading ? "Sending..." : "SEND RESET LINK"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;