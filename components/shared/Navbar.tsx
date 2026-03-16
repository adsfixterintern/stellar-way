
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); 
  const { data: session, status } = useSession();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Menu", path: "/menu" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto bg-white/15 backdrop-blur-lg border-2 border-white/24 rounded-2xl px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-white text-2xl font-serif italic font-bold tracking-tight">
            Savory
          </span>
          <span className="text-[#c2a15e] text-xl">🍴</span>
          <span className="text-white text-2xl font-serif italic font-bold tracking-tight">
            Nest
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 text-gray-300 font-medium">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.path;
            return (
              <li key={index}>
                <Link 
                  href={link.path} 
                  className={`${
                    isActive 
                    ? "text-white border-b-2 border-white pb-1" 
                    : "hover:text-white transition"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4 text-white/90">
            <Search size={20} strokeWidth={1.5} className="cursor-pointer" />
            
            {/* User Profile Logic */}
            {session?.user ? (
              <div className="group relative flex items-center gap-2 cursor-pointer bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-6 h-6 rounded-full bg-[#c2a15e] flex items-center justify-center text-[10px] font-bold text-black uppercase">
                  {session.user.image || "U"}
                </div>
                <span className="text-xs font-medium text-white">{session.user.name?.split(' ')[0]}</span>
               
              </div>
            ) : (
              <Link href="/login">
                <User size={20} strokeWidth={1.5} className="cursor-pointer hover:text-white transition" />
              </Link>
            )}

            <div className="relative cursor-pointer">
              <ShoppingCart size={20} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-[#2d4a22] text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </div>
          </div>

       
          {status === "loading" ? (
             <div className="hidden sm:block w-24 h-9 bg-white/10 animate-pulse rounded-xl"></div>
          ) : session?.user ? (
            <button 
              onClick={() => signOut()}
              className="hidden sm:flex items-center gap-2 bg-red-600/20 hover:bg-red-600 border border-red-600/50 text-white px-5 py-2 rounded-xl transition text-sm font-semibold"
            >
              <LogOut size={16} /> Sign out
            </button>
          ) : (
            <Link href="/login">
              <button className="hidden sm:block bg-[#1e3316] hover:bg-[#2d4a22] text-white px-6 py-2 rounded-xl transition text-sm font-semibold">
                Sign in
              </button>
            </Link>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden mt-4 max-w-7xl mx-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-2xl">
          <ul className="flex flex-col gap-5 text-gray-300 font-medium">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.path} 
                  onClick={() => setOpen(false)} 
                  className={`${
                    pathname === link.path 
                    ? "text-[#c2a15e] font-bold" 
                    : "hover:text-white transition"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            {session?.user ? (
               <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[#c2a15e] flex items-center justify-center text-black font-bold">
                        {session.user?.image || "U"}
                     </div>
                     <span className="text-white font-medium">{session.user.name}</span>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
               </div>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <button className="bg-[#1e3316] hover:bg-[#2d4a22] text-white px-6 py-3 rounded-xl font-semibold w-full">
                  Sign in
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;