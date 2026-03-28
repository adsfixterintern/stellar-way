/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react"; 
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import Image from "next/image";
import { Search, User, ShoppingCart, Menu, X, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios"; 

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- SEARCH LOGIC START ---
  const [searchOpen, setSearchOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [categories, setCategories] = useState<any[]>([]); 
  const [filteredCats, setFilteredCats] = useState<any[]>([]); 
  const searchRef = useRef<HTMLDivElement>(null); 

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/categories");
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // --- SEARCH LOGIC END ---

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [cartCount, setCartCount] = useState(0); 

  useEffect(() => {
    const updateCartBadge = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          const totalItems = cart.reduce(
            (acc: number, item: any) => acc + (item.quantity || 0),
            0,
          );
          setCartCount(totalItems);
        } catch (error) {
          console.log(error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartBadge();
    window.addEventListener("cartUpdated", updateCartBadge);
    window.addEventListener("storage", updateCartBadge);

    return () => {
      window.removeEventListener("cartUpdated", updateCartBadge);
      window.removeEventListener("storage", updateCartBadge);
    };
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
    <nav className="fixed top-8 left-0 right-0 z-50 px-4 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto border-2 rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#1e3316]/90 backdrop-blur-xl border-white/10 shadow-2xl"
            : "bg-white/15 backdrop-blur-lg border-white/24"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-1">
          <Image
            width={180}
            height={32}
            alt="savory logo"
            src={
              "https://res.cloudinary.com/dn5t9fhya/image/upload/v1773643312/Frame_2147225948_ezhifw.png"
            }
            className="brightness-0 invert"
          />
        </div>

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
                      : "hover:text-white transition opacity-80 hover:opacity-100"
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
            
            
            <div className="relative" ref={searchRef}>
              <Search 
                size={20} 
                strokeWidth={1.5} 
                className="cursor-pointer hover:text-white transition" 
                onClick={() => setSearchOpen(!searchOpen)} 
              />
              
              {searchOpen && (
                <div className="absolute right-0 top-12 w-64 bg-[#1e3316] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-white/5">
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Search category (e.g. Pizza)"
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
                          className="px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* --- SEARCH UI END --- */}

            {/* User Profile Logic (Your existing code) */}
            {session?.user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {/* Profile Toggle */}
                <div className="flex items-center gap-2 cursor-pointer bg-white/10 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/20 transition-all">
                  <div className="w-6 h-6 rounded-full bg-[#c2a15e] flex items-center justify-center text-[10px] font-bold text-black uppercase overflow-hidden">
                    {session.user.image ? (
                        <Image src={session.user.image} alt="user" width={24} height={24} className="object-cover" />
                    ) : (
                        session.user.name?.charAt(0) || "U"
                    )}
                  </div>
                  <span className="text-xs font-medium text-white">
                    {session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu Container */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full w-48 pt-2 z-50"> 
                    <div className="bg-[#1e3316] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in zoom-in duration-200">
                      {(session.user as any)?.role === "admin" && (
                        <Link 
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <User
                  size={20}
                  strokeWidth={1.5}
                  className="cursor-pointer hover:text-white transition"
                />
              </Link>
            )}

            <div className="relative cursor-pointer">
              <Link href="/cart">
                <ShoppingCart size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {status === "loading" ? (
            <div className="hidden sm:block w-24 h-9 bg-white/10 animate-pulse rounded-xl"></div>
          ) : session?.user ? null : (
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

      {/* Mobile Menu Content (Keep it as it was) */}
      {/* ... (বাকি কোড অপরিবর্তিত) */}
    </nav>
  );
};

export default Navbar;