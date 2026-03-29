/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ChevronDown 
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
          const { data } = await api.get(`/notifications/${session.user.email}`);
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
      
      socket.on("new-order-available", (data: any) => {
        setNotifications((prev) => [data, ...prev]);
        toast.success(data.message || "New Order Available!", {
          duration: 8000,
          icon: '🛵'
        });
        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => {});
      });
    }
    return () => {
      socket?.off("new-order-available");
    };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/rider" },
    { name: "New Orders", icon: ShoppingBag, path: "/rider/new-orders" },
    { name: "My Deliveries", icon: History, path: "/rider/history" },
    { name: "Profile", icon: User, path: "/rider/profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e3316] text-white transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-0 shadow-2xl`}>
        <div className="flex items-center justify-between h-24 px-8 border-b border-white/5">
          <span className="text-xl font-black tracking-tighter text-[#c2a15e]">SAVORY RIDER</span>
          <button className="lg:hidden p-1 hover:bg-white/10 rounded" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        
        <nav className="mt-8 px-4 space-y-1.5">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                pathname === item.path 
                ? "bg-[#c2a15e] text-[#1e3316] font-bold shadow-lg shadow-[#c2a15e]/20" 
                : "hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <item.icon size={20} strokeWidth={pathname === item.path ? 2.5 : 2} />
              <span className="text-[15px]">{item.name}</span>
            </Link>
          ))}
          
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-red-400 hover:bg-red-500/10 rounded-2xl mt-12 transition-all"
          >
            <LogOut size={20} />
            <span className="font-bold text-[15px]">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10">
          <button className="lg:hidden p-2 bg-gray-50 rounded-lg text-[#1e3316]" onClick={() => setIsSidebarOpen(true)}><Menu size={24}/></button>
          
          <div className="flex items-center gap-5 ml-auto">
             {/* Notification Bell with Dropdown */}
             <div className="relative" ref={notifRef}>
                <div 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all relative border border-gray-100"
                >
                   <Bell size={22} className="text-gray-600" />
                   {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center font-black border-2 border-white rounded-full">
                        {notifications.length}
                      </span>
                   )}
                </div>

                {/* Dropdown Menu */}
                {notifOpen && (
                  <div className="absolute right-0 top-14 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                      <h4 className="text-sm font-black text-gray-800">Alerts</h4>
                      <span className="text-[10px] bg-[#c2a15e]/20 text-[#1e3316] px-2 py-0.5 rounded-full font-bold">New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n, i) => (
                          <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                            <p className="text-xs font-black text-gray-900">{n.title || "Order Update"}</p>
                            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                           <p className="text-xs font-bold uppercase tracking-widest">Everything is clear</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
             </div>

             {/* User Profile Info */}
             <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black text-gray-900 leading-none">{session?.user?.name || "Rider"}</p>
                   <p className="text-[10px] text-green-500 font-black uppercase mt-1 tracking-tighter">● Online</p>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="w-11 h-11 rounded-2xl bg-[#1e3316] flex items-center justify-center text-white font-black overflow-hidden border-2 border-[#c2a15e]/20">
                     {session?.user?.image ? (
                        <Image src={session.user.image} alt="rider" width={44} height={44} className="object-cover" />
                     ) : (
                        session?.user?.name?.charAt(0).toUpperCase()
                     )}
                  </div>
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RiderLayout;