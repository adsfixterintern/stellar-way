/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation"; 
import toast from "react-hot-toast";
import { resetPasswordApi } from "@/app/modules/auth/auth.api";

const ResetPassword = () => {
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const token = params.token as string; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    
    setLoading(true);
    try {
      const res = await resetPasswordApi(token, password);
      
      if (res.success) {
        toast.success("Password reset successful! Please login.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Link expired or invalid token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] p-6">
      <div className="w-full max-w-md bg-white rounded-[30px] p-8 md:p-10 shadow-[0px_25px_80px_rgba(26,78,17,0.1)]">
        <div className="mb-8 text-center">
          <h2 className="subTitle text-black! mb-2">Set New Password</h2>
          <p className="description text-sm normal-case">
            Token found. Please enter your new password to regain access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="nameText text-[14px]">New Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-13 px-4 pl-11 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#1a4e11] transition-all text-sm"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a4e11]"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="nameText text-[14px]">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-13 px-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#1a4e11] transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="blockBtn w-full! h-13! rounded-xl! shadow-lg active:scale-95 transition-all font-bold"
          >
            {loading ? "Updating..." : "RESET PASSWORD"}
          </button>
          
          {!token && <p className="text-red-500 text-xs text-center mt-2">Invalid or missing token in URL</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;