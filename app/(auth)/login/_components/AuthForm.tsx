/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

interface AuthFormProps {
  isLogin: boolean;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  formData: any;
  setFormData: (data: any) => void;
  errors: any; 
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, loading, onSubmit, formData, setFormData, errors }) => {
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
      {!isLogin && (
        <>
          <div className="flex flex-col gap-1">
            <label className="nameText text-[14px]">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              onChange={handleChange}
              className={`w-full h-12.5 md:h-13.75 px-4 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-100'} rounded-xl outline-none focus:border-[#1a4e11] transition-all text-sm`}
            />
            {errors.name && <span className="text-red-500 text-[11px] ml-1">{errors.name}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="nameText text-[14px]">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="01700000000"
              onChange={handleChange}
              className={`w-full h-12.5 md:h-13.75 px-4 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-xl outline-none focus:border-[#1a4e11] transition-all text-sm`}
            />
            {errors.phone && <span className="text-red-500 text-[11px] ml-1">{errors.phone}</span>}
          </div>
        </>
      )}

      <div className="flex flex-col gap-1">
        <label className="nameText text-[14px]">Email Address</label>
        <input
          name="email"
          type="email"
          placeholder="email@example.com"
          onChange={handleChange}
          className={`w-full h-12.5 md:h-13.75 px-4 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-100'} rounded-xl outline-none focus:border-[#1a4e11] transition-all text-sm`}
        />
        {errors.email && <span className="text-red-500 text-[11px] ml-1">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="nameText text-[14px]">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••"
            onChange={handleChange}
            className={`w-full h-12.5 md:h-13.75 px-4 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-100'} rounded-xl outline-none focus:border-[#1a4e11] transition-all text-sm pr-12`}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span className="text-red-500 text-[11px] ml-1">{errors.password}</span>}
      </div>

      {/* Remember me & Forgot Password */}
      <div className="flex justify-between items-center mt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-[#1a4e11] w-4 h-4" />
          <span className="designationText text-[12px]! md:text-[13px]!">Remember me</span>
        </label>
        {isLogin && (
          <Link href="/forgot-password">
            <p className="designationText text-[12px]! md:text-[13px]! text-[#1a4e11]! hover:underline">Forgot password?</p>
          </Link>
        )}
      </div>

      <button type="submit" disabled={loading} className="blockBtn w-full! h-12.5! md:h-13.75! rounded-xl! mt-4 shadow-lg active:scale-95 transition-all font-bold tracking-wide">
        {loading ? "Please wait..." : isLogin ? "LOGIN" : "REGISTER"}
      </button>
    </form>
  );
};

export default AuthForm;