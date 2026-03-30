
"use client";

import React, { useState, useEffect, ReactNode, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  History,
  User,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import api from "@/utils/apiInstance";

interface RiderLayoutProps {
  children: ReactNode;
}

const RiderLayout: React.FC<RiderLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [notifOpen, setNotifOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { data: session } = useSession();
  const pathname = usePathname();
  const socket = useSocket();
  const notifRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    if (session?.user?.email) {
      const fetchNotifs = async () => {
        try {
          const { data } = await api.get(
            `/notifications/${session.user.email}`,
          );
          if (data.success) setNotifications(data.data);
        } catch (err) {
          console.log("Notif fetch error", err);
        }
      };
      fetchNotifs();
    }
  }, [session]);

 
  useEffect(() => {
    if (socket) {
      socket.emit("join-rider-room");
      const handleNewOrder = (data: any) => {
        setNotifications((prev) => [
          {
            title: data.title || "New Order Available!",
            message: data.message || "A new delivery request just arrived.",
            createdAt: new Date(),
          },
          ...prev,
        ]);
        toast.success(data.message || "New Order Available!", {
          duration: 10000,
          icon: "🛵",
          position: "top-right",
        });
        const audio = new Audio("/notification.mp3");
        audio.play().catch((err) => console.log("Audio play blocked", err));
      };
      socket.on("new-order-available", handleNewOrder);
      return () => {
        socket.off("new-order-available", handleNewOrder);
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/rider" },
    // { name: "New Orders", icon: ShoppingBag, path: "/rider/new-orders" },
    { name: "My Deliveries", icon: History, path: "/rider/my-deliveries" },
    { name: "Profile", icon: User, path: "/rider/profile" },
  ];

  return (
    <div className="flex h-screen bg-[#FDFCFD] font-sans antialiased text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#E4F5DC] border-r border-gray-100 transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
      
        <div className="flex flex-col h-full">
          {/* logo*/}
          <div className="flex flex-col items-center justify-center h-28 px-6 border-b border-white/20">
            <span className="text-[10px] font-black tracking-[3px] text-[#1A4E11] uppercase">
              Rider Panel
            </span>
          <Link href="/">
             <h2 className="text-xl font-black text-gray-800 tracking-tighter mt-1">
              Stellar Way
            </h2>
          </Link>
          </div>

          {/* ২. nav-এ flex-1 দেওয়া হয়েছে যাতে এটি বাকি জায়গা দখল করে বাটনকে নিচে পাঠিয়ে দেয় */}
          <nav className="mt-8 px-4 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#1A4E11] text-white shadow-lg translate-x-1"
                      : "text-gray-500 hover:bg-white/70 hover:text-black"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* ৩. লগআউট বাটন সেকশন - এখন এটি সবসময় নিচে থাকবে */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-5 py-3.5 w-full text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold border border-transparent hover:border-red-100"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <button
            className="lg:hidden p-2 bg-gray-50 rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <h1 className="hidden sm:block text-lg font-black text-gray-800 tracking-tight capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h1>

          <div className="flex items-center gap-6 ml-auto">
            {/* Notification */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2.5 text-gray-400 hover:text-black bg-gray-50 rounded-full transition-all relative"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Notifications
                    </span>
                    <span className="text-[9px] bg-[#1A4E11] text-white px-2 py-0.5 rounded-full">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <div
                          key={i}
                          className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <p className="text-[11px] font-black text-gray-800 leading-tight">
                            {n.title}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        No Alerts
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {session?.user?.name || "Rider"}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    Online
                  </p>
                </div>
              </div>
              <div className="w-11 h-11 rounded-full border-2 border-green-50 overflow-hidden bg-gray-100 shadow-sm relative">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-black text-[#1A4E11] text-xs">
                    R
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-5 bg-[#FDFCFD]">
          <div className=" mx-auto min-h-screen">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default RiderLayout;
