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
  Menu as MenuIcon,
  X,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Bell,
  Trash2,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "react-hot-toast";

// Import APIs
import {
  getUserNotifications,
  markNotificationAsReadApi,
  clearAllNotificationsApi,
  deleteNotificationApi,
} from "@/app/modules/notification/notification.api";
import { getMenus } from "@/app/api/menuApi";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const socket = useSocket();

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { cartItems } = useCart();
  const totalCartItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0,
  );

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<any[]>([]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  // 1. Initial Notification Fetch
  useEffect(() => {
    const fetchNotifications = async () => {
      if (session?.user?.email) {
        try {
          const res = await getUserNotifications(session.user.email);
          if (res.success) setNotifications(res.data);
        } catch (err) {
          console.error("Notification fetch failed", err);
        }
      }
    };
    fetchNotifications();
  }, [session?.user?.email]);

  // 2. Real-time Socket Updates
  useEffect(() => {
    if (socket && session?.user) {
      const userId = (session.user as any).id || (session.user as any)._id;
      socket.emit("join-notification", userId);

      const handleNewNotification = (data: any) => {
        setNotifications((prev) => [data, ...prev]);
        toast.success(data.title || "New notification", { icon: "🔔" });
        new Audio("/notification.mp3").play().catch(() => {});
      };

      socket.on("new-notification", handleNewNotification);
      return () => {
        socket.off("new-notification", handleNewNotification);
      };
    }
  }, [socket, session]);

  // 3. Search Logic with Safety Checks
  useEffect(() => {
    const fetchAllMenus = async () => {
      try {
        const data = await getMenus();
        setMenuItems(data || []);
      } catch (err) {
        console.error("Menu load failed", err);
      }
    };
    fetchAllMenus();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMenus([]);
    } else {
      // Filtering based on 'title' as per your data object
      const filtered = menuItems.filter((item) =>
        item?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredMenus(filtered);
    }
  }, [searchQuery, menuItems]);

  // 4. Notification Handlers
  const handleMarkAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, status: "read" } : n)),
      );
      await markNotificationAsReadApi(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await deleteNotificationApi(id);
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleClearAll = async () => {
    if (!session?.user?.email) return;
    setNotifications([]);
    try {
      await clearAllNotificationsApi(session.user.email);
      toast.success("All cleared");
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Utility Effects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      )
        setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
        className={`max-w-7xl mx-auto border-2 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-300 ${scrolled || open ? "bg-[#1e3316]/95 backdrop-blur-xl border-white/10 shadow-2xl" : "bg-white/10 backdrop-blur-md border-white/20"}`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            width={140}
            height={28}
            alt="logo"
            src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773643312/Frame_2147225948_ezhifw.png"
            className="brightness-0 invert w-32 md:w-44 h-auto"
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 text-gray-300 font-medium">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.path}
                className={`text-sm xl:text-base transition-all ${pathname === link.path ? "text-white border-b-2 border-white pb-1" : "hover:text-white opacity-80 hover:opacity-100"}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Dish Search Dropdown */}
          <div className="hidden sm:block relative" ref={searchRef}>
            <Search
              size={20}
              className="text-white/90 cursor-pointer hover:text-white"
              onClick={() => setSearchOpen(!searchOpen)}
            />
            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 bg-[#1e3316] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-3 border-b border-white/5">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search dish..."
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#c2a15e]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {filteredMenus.length > 0
                    ? filteredMenus.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            setSearchOpen(false);
                            router.push(`/menu/${item._id}`);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 cursor-pointer transition border-b border-white/5 last:border-0"
                        >
                          <div className="w-12 h-12 relative shrink-0">
                            <Image
                              src={item.image?.url || "/placeholder.png"}
                              alt={item.title}
                              fill
                              className="rounded-lg object-cover border border-white/10"
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            {/* Displaying Title and Price */}
                            <p className="text-xs text-white font-bold truncate">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-[#c2a15e] mt-0.5">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      ))
                    : searchQuery && (
                        <div className="p-6 text-center text-xs text-gray-500 italic">
                          No dishes found matching {searchQuery}
                        </div>
                      )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            {/* Bell Icon */}
            <Bell
              size={22}
              className="text-white/90 cursor-pointer hover:text-white"
              onClick={() => setNotifOpen(!notifOpen)}
            />

            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1e3316]">
                {unreadCount}
              </span>
            )}

            {/* Notifications Dropdown */}
            {notifOpen && (
              <div
                className="absolute 
      -left-12 -translate-x-1/2 
      md:left-auto md:right-0 md:translate-x-0 
      top-12 
      w-[90vw] max-w-80 
      bg-[#1e3316] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-[60]"
              >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-sm font-bold text-white">
                    Notifications
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-[10px] text-[#c2a15e] hover:text-white font-bold flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Clear All
                    </button>
                  )}
                </div>

                {/* Notification List Area */}
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleMarkAsRead(n._id)}
                        className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all relative group ${
                          n.status === "unread"
                            ? "bg-white/[0.07]"
                            : "opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 pr-6">
                          <p
                            className={`text-xs font-bold ${
                              n.status === "unread"
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          >
                            {n.title}
                          </p>
                          {n.status === "unread" && (
                            <div className="w-2 h-2 bg-[#c2a15e] rounded-full mt-1 shrink-0"></div>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[9px] text-gray-500 mt-2">
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </p>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => handleDeleteNotification(e, n._id)}
                          className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-all duration-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-xs text-gray-500">
                      No notifications yet
                    </div>
                  )}
                </div>
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
                      <Link
                        href={
                          (session.user as any)?.role === "admin"
                            ? "/admin"
                            : (session.user as any)?.role === "rider"
                              ? "/rider"
                              : "/dashboard"
                        }
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 hover:bg-white/10"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
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

          {/* Shopping Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart
              size={22}
              className="text-white/90 hover:text-white"
            />
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
            {open ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-[#1e3316] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <ul className="flex flex-col gap-5">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.path}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium block ${pathname === link.path ? "text-[#c2a15e]" : "text-gray-300"}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <hr className="my-6 border-white/10" />
          <div className="flex flex-col gap-4">
            {session ? (
              <>
                <Link
                  href={
                    (session.user as any)?.role === "admin"
                      ? "/admin"
                      : (session.user as any)?.role === "rider"
                        ? "/rider"
                        : "/dashboard"
                  }
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-white/5 text-[#c2a15e] p-3 rounded-xl border border-white/10 font-bold"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20 font-medium"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="bg-[#c2a15e] text-black text-center font-bold p-4 rounded-xl shadow-lg"
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
