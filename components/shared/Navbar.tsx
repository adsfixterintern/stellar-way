/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Cart Context
  const { cartItems } = useCart();
  const totalCartItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  // Search Logic
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredCats, setFilteredCats] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/categories"
        );
        if (data.success) setCategories(data.data);
      } catch (err) {
        console.log("Search categories load failed", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCats([]);
    } else {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCats(filtered);
    }
  }, [searchQuery, categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservation", path: "/reservation" },
    { name: "Event", path: "/event" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about-us" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-4 md:top-8 left-0 right-0 z-50 px-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto border-2 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled || open
            ? "bg-[#1e3316]/95 backdrop-blur-xl border-white/10 shadow-2xl"
            : "bg-white/10 backdrop-blur-md border-white/20"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            width={140}
            height={28}
            alt="savory logo"
            src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773643312/Frame_2147225948_ezhifw.png"
            className="brightness-0 invert w-32 md:w-44 h-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-gray-300 font-medium">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.path}
                className={`text-sm xl:text-base transition-all ${
                  pathname === link.path
                    ? "text-white border-b-2 border-white pb-1"
                    : "hover:text-white opacity-80 hover:opacity-100"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Tools */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search (Desktop) */}
          <div className="hidden sm:block relative" ref={searchRef}>
            <Search
              size={20}
              className="text-white/90 cursor-pointer hover:text-white transition"
              onClick={() => setSearchOpen(!searchOpen)}
            />
            {searchOpen && (
              <div className="absolute right-0 top-12 w-64 bg-[#1e3316] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-white/5">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search category..."
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#c2a15e]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {filteredCats.length > 0 && (
                  <div className="max-h-48 overflow-y-auto py-2">
                    {filteredCats.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                          router.push(`/menu?category=${cat.name}`);
                        }}
                        className="px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer"
                      >
                        {cat.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="hidden sm:block">
            {session?.user ? (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="flex items-center gap-2 cursor-pointer bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 transition-all">
                  <div className="w-6 h-6 rounded-full bg-[#c2a15e] flex items-center justify-center text-[10px] font-bold text-black uppercase overflow-hidden">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="user"
                        width={24}
                        height={24}
                      />
                    ) : (
                      session.user.name?.charAt(0)
                    )}
                  </div>
                  <span className="text-xs font-medium text-white">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className="text-white/70" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full w-48 pt-2 z-50">
                    <div className="bg-[#1e3316] border border-white/10 rounded-xl shadow-2xl py-2">
                      {(session.user as any)?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <User size={22} className="text-white/90 hover:text-white" />
              </Link>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={22} className="text-white/90 hover:text-white" />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#c2a15e] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1e3316]">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-1"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-[#1e3316] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.path}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium block ${
                    pathname === link.path ? "text-[#c2a15e]" : "text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          
          <hr className="my-6 border-white/10" />
          
          <div className="flex flex-col gap-4">
             {/* Mobile User/Login */}
             {session ? (
                <button 
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20"
                >
                  <LogOut size={18} /> Sign Out
                </button>
             ) : (
                <Link 
                  href="/login" 
                  onClick={() => setOpen(false)}
                  className="bg-[#c2a15e] text-black text-center font-bold p-3 rounded-xl"
                >
                  Sign In
                </Link>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;