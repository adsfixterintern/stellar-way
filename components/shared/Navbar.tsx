"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-1">
          <span className="text-white text-2xl font-serif italic font-bold tracking-tight">
            Savory
          </span>

          <span className="text-[#c2a15e] text-xl">🍴</span>

          <span className="text-white text-2xl font-serif italic font-bold tracking-tight">
            Nest
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 text-gray-300 font-medium">
          <li>
            <Link href="/" className="text-white border-b-2 border-white pb-1">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-white transition">
              About
            </Link>
          </li>
          <li>
            <Link href="/menu" className="hover:text-white transition">
              Menu
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-white transition">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Icons */}
          <div className="hidden sm:flex items-center gap-4 text-white/90">
            <Search size={20} strokeWidth={1.5} />
            <User size={20} strokeWidth={1.5} />

            <div className="relative">
              <ShoppingCart size={20} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-[#2d4a22] text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            </div>
          </div>

          {/* Sign In */}
          <button className="hidden sm:block bg-[#1e3316] hover:bg-[#2d4a22] text-white px-6 py-2 rounded-xl transition text-sm font-semibold">
            Sign in
          </button>

          {/* Mobile Menu Button */}
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
        <div className="lg:hidden mt-4 max-w-7xl mx-auto bg-black/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
          <ul className="flex flex-col gap-5 text-gray-300 font-medium">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/menu">Menu</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>

          <button className="mt-6 bg-[#1e3316] hover:bg-[#2d4a22] text-white px-6 py-2 rounded-xl font-semibold">
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;