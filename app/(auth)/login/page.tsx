/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUserApi } from "@/app/modules/auth/auth.api";
import toast from "react-hot-toast";
import AuthForm from "./_components/AuthForm";
import Image from "next/image";
import logo from '@/public/logo.png'
import Link from "next/link";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    phone: "",
    countryCode: "+880",
  });


  const validate = () => {
    const newErrors: any = {};
    if (!formData.email.includes("@")) newErrors.email = "Invalid email address";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!isLogin) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!/^\d{11}$/.test(formData.phone)) newErrors.phone = "Invalid phone (11 digits required)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    if (isLogin) {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Invalid Credentials");
      } else {
        toast.success("Welcome back! Login Successful.");
        router.push("/");
        router.refresh();
      }
    } else {
      try {
        const registrationData = {
          ...formData,
          phone: `${formData.countryCode}${formData.phone}`,
          role: "user",
        };
        const res = await registerUserApi(registrationData);
        
        if (res.success) {
          toast.success("Account Created Successfully! Please Login.");
          setIsLogin(true); 
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Registration failed. Try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF8] p-4 md:p-10">
      <div className="relative bg-white w-full max-w-275 min-h-150 md:h-175 shadow-[0px_25px_80px_rgba(26,78,17,0.15)] rounded-[30px] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row">
        
        <motion.div 
          initial={false}
          animate={{ x: isLogin ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-[#1a4e11] z-30 hidden md:flex flex-col items-center justify-center text-white p-16 text-center shadow-2xl"
        >
          <Link href={'/'}>
            <div className="mb-8 bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/20">
              <Image src={logo} alt="logo" width={150} height={50} priority />
            </div>
          </Link>
          <h2 className="secTitle text-white! text-[40px]! mb-4 leading-tight">{isLogin ? "Hello, Friend!" : "Welcome Back!"}</h2>
          <p className="description text-white/80! mb-8 normal-case text-base">
            {isLogin ? "Register with your personal details to use all of our features." : "To keep connected with us please login with your personal info."}
          </p>
          <button onClick={() => setIsLogin(!isLogin)} className="blockBtn bg-white! text-[#1a4e11]! border-2 border-white hover:bg-transparent! hover:text-white! transition-all! duration-500! w-45! shadow-lg">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </motion.div>

        {/* Mobile Header */}
        <div className="md:hidden bg-[#1a4e11] p-8 text-center text-white flex flex-col items-center">
            <Image src={logo} alt="logo" width={120} height={40} className="mb-4" />
            <p className="text-white/70 text-sm">{isLogin ? "Welcome back, please login" : "Create an account to get started"}</p>
        </div>
        
        {/* Sign In & Register Sides - একই লজিক */}
        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 transition-all duration-500 ${!isLogin ? 'hidden md:flex opacity-0' : 'flex opacity-100'}`}>
            <div className="w-full max-w-100 flex flex-col">
              <div className="mb-8">
                <span className="superTitle text-[12px]!">Welcome Back</span>
                <h3 className="subTitle text-black mt-1">Login to Account</h3>
              </div>
              <AuthForm isLogin={true} loading={loading} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} errors={errors} />
              {/* Mobile Toggle Button */}
              <div className="md:hidden mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                <p className="description text-[14px]! normal-case">Don't have an account?</p>
                <button type="button" onClick={() => setIsLogin(false)} className="blockBtn w-full! h-12! bg-white! text-[#1a4e11]! border-2 border-[#1a4e11] rounded-xl! font-bold">CREATE AN ACCOUNT</button>
              </div>
            </div>
        </div>

        <div className={`w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 transition-all duration-500 ${isLogin ? 'hidden md:flex opacity-0' : 'flex opacity-100'}`}>
            <div className="w-full max-w-100 flex flex-col">
              <div className="mb-8">
                <span className="superTitle text-[12px]!">Start for free</span>
                <h3 className="subTitle text-black mt-1">Create New Account</h3>
              </div>
              <AuthForm isLogin={false} loading={loading} onSubmit={handleSubmit} formData={formData} setFormData={setFormData} errors={errors} />
              {/* Mobile Toggle Button */}
              <div className="md:hidden mt-10 pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
                <p className="description text-[14px]! normal-case">Already have an account?</p>
                <button type="button" onClick={() => setIsLogin(true)} className="blockBtn w-full! h-12! bg-white! text-[#1a4e11]! border-2 border-[#1a4e11] rounded-xl! font-bold">SIGN IN INSTEAD</button>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;