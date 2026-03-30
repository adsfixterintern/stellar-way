/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, ReactNode, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, ShoppingBag, History, User, LogOut, Bell, Menu, X, Trash2 
} from "lucide-react";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import api from "@/utils/apiInstance";
import { motion, AnimatePresence } from "framer-motion";

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

  // ১. পুরাতন নোটিফিকেশন লোড করা
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

      const handleNewOrder = (data: any) => {
        const newNotif = {
          _id: data._id || Math.random().toString(), 
          title: data.title || "New Order Available!",
          message: data.message || "A new delivery request just arrived.",
          createdAt: new Date(),
        };

        setNotifications((prev) => [newNotif, ...prev]);

        toast.success(data.message || "New Order Available!", {
          duration: 6000,
          icon: '🛵',
        });

        const audio = new Audio("/notification.mp3");
        audio.play().catch(() => {});
      };

      socket.on("new-order-available", handleNewOrder);
      return () => { socket.off("new-order-available", handleNewOrder); };
    }
  }, [socket]);

  const removeNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    

    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.log("Delete error", err);
    }
  };

  const clearAllNotifications = async () => {
    const email = session?.user?.email;
    setNotifications([]);
    if (email) {
      try {
        await api.delete(`/notifications/clear/${email}`);
      } catch (err) {
        console.log("Clear all error", err);
      }
    }
  };

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
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e3316] text-white transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <span className="text-xl font-bold tracking-wider text-[#c2a15e]">RIDER PANEL</span>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><X /></button>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.path ? "bg-[#c2a15e] text-black font-bold" : "hover:bg-white/5 text-gray-300"}`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
          <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl mt-10">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-6">
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}><Menu /></button>
          
          <div className="flex items-center gap-5 ml-auto">
             {/* Notification Icon */}
             <div className="relative" ref={notifRef}>
                <div 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2.5 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-all relative"
                >
                   <Bell size={20} />
                   {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] flex items-center justify-center font-black rounded-full border-2 border-white animate-bounce">
                        {notifications.length}
                      </span>
                   )}
                </div>

                {/* Notification Dropdown */}
                <AnimatePresence>
                {notifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white border rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <span className="font-bold text-xs uppercase tracking-widest text-gray-500">Alerts</span>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearAllNotifications}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <AnimatePresence initial={false}>
                          {notifications.map((n) => (
                            <motion.div 
                              key={n._id}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ x: 50, opacity: 0 }}
                              className="p-4 border-b hover:bg-gray-50 transition-colors relative group"
                            >
                              <button 
                                onClick={() => removeNotification(n._id)}
                                className="absolute top-4 right-4 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-md opacity-0 group-hover:opacity-100"
                              >
                                <X size={14} />
                              </button>
                              <p className="text-xs font-bold text-gray-900 pr-6">{n.title}</p>
                              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                              <p className="text-[9px] text-gray-400 mt-2 font-medium">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      ) : (
                        <div className="p-12 text-center flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                             <Bell size={20} className="text-gray-300" />
                          </div>
                          <p className="text-gray-400 text-xs font-medium">No active notifications</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
             </div>

             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold leading-tight">{session?.user?.name || "Rider"}</p>
                   <p className="text-[9px] text-green-500 font-black uppercase tracking-tighter flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                   </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#1e3316] border-2 border-[#c2a15e] overflow-hidden relative">
                   {session?.user?.image ? (
                      <Image src={session.user.image} alt="profile" fill className="object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                        {session?.user?.name?.charAt(0)}
                      </div>
                   )}
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default RiderLayout;