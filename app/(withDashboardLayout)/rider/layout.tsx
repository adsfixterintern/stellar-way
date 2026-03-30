
"use client";

import React, { useState, useEffect, ReactNode, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  LayoutDashboard, History, User, LogOut, Bell, Menu, X, Trash2, Check 
} from "lucide-react";
import { useSocket } from "@/app/hooks/useSocket";
import { toast } from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

// Importing the Notification API Module
import { 
  getUserNotifications, 
  deleteNotificationApi, 
  clearAllNotificationsApi,
  markNotificationAsReadApi 
} from "@/app/modules/notification/notification.api";

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

  // 1. Initial fetch of notifications using the API module
  useEffect(() => {
    const fetchNotifs = async () => {
      if (session?.user?.email) {
        try {
          const res = await getUserNotifications(session.user.email);
          if (res.success) setNotifications(res.data);
        } catch (err) {
          console.error("Initial fetch error:", err);
        }
      }
    };
    fetchNotifs();
  }, [session?.user?.email]);

  // 2. Real-time socket listener for new orders
  useEffect(() => {
    if (socket) {
      socket.emit("join-rider-room");
      const handleNewOrder = (data: any) => {
        const newNotif = {
          _id: data._id || Math.random().toString(), 
          title: data.title || "New Order Available!",
          message: data.message || "A new delivery request just arrived.",
          status: 'unread',
          createdAt: new Date(),
        };
        setNotifications((prev) => [newNotif, ...prev]);
        toast.success(data.message || "New Order Available!", {
          duration: 6000,
          icon: '🛵',
        });
        new Audio("/notification.mp3").play().catch(() => {});
      };
      socket.on("new-order-available", handleNewOrder);
      return () => { socket.off("new-order-available", handleNewOrder); };
    }
  }, [socket]);

  // 3. Mark notification as read (Optimistic Update)
  const handleMarkAsRead = async (id: string) => {
    // Update UI immediately
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, status: "read" } : n))
    );
    try {
      await markNotificationAsReadApi(id);
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  // 4. Remove single notification
  const removeNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await deleteNotificationApi(id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 5. Clear all notifications
  const clearAllNotifications = async () => {
    const email = session?.user?.email;
    if (!email) return;

    setNotifications([]);
    try {
      await clearAllNotificationsApi(email);
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  // Close notification dropdown when clicking outside
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
    { name: "My Deliveries", icon: History, path: "/rider/my-deliveries" },
    { name: "Profile", icon: User, path: "/rider/profile" },
  ];

  return (
    <div className="flex h-screen bg-[#FDFCFD] font-sans antialiased text-gray-900 overflow-hidden">
      {/* Sidebar Section */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#E4F5DC] border-r border-gray-100 transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col items-center justify-center h-28 px-6 border-b border-white/20">
            <span className="text-[10px] font-black tracking-[3px] text-[#1A4E11] uppercase">Rider Panel</span>
            <h2 className="text-xl font-black text-gray-800 tracking-tighter mt-1">Stellar Way</h2>
          </div>

          <nav className="mt-8 px-4 space-y-2 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive ? "bg-[#1A4E11] text-white shadow-lg translate-x-1" : "text-gray-500 hover:bg-white/70 hover:text-black"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-5 py-3.5 w-full text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-bold"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b flex items-center justify-between px-6 shrink-0">
          <button className="lg:hidden p-2" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
          
          <div className="flex items-center gap-5 ml-auto">
             {/* Notification Section */}
             <div className="relative" ref={notifRef}>
                <div 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2.5 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-all relative"
                >
                   <Bell size={20} />
                   {notifications.filter(n => n.status !== 'read').length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] flex items-center justify-center font-black rounded-full border-2 border-white animate-bounce">
                        {notifications.filter(n => n.status !== 'read').length}
                      </span>
                   )}
                </div>

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
                        <button onClick={clearAllNotifications} className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1">
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
                              className={`p-4 border-b hover:bg-gray-50 transition-colors relative group ${n.status === 'read' ? 'opacity-60' : 'bg-green-50/30'}`}
                            >
                              <div className="flex justify-between items-start pr-8">
                                <p className="text-xs font-bold text-gray-900">{n.title}</p>
                                <div className="flex gap-2">
                                  {n.status !== 'read' && (
                                    <button 
                                      onClick={() => handleMarkAsRead(n._id)}
                                      className="p-1 text-green-600 hover:bg-green-100 rounded-md transition-all"
                                      title="Mark as read"
                                    >
                                      <Check size={14} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => removeNotification(n._id)}
                                    className="p-1 text-gray-300 hover:text-red-500 transition-all rounded-md opacity-0 group-hover:opacity-100"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      ) : (
                        <div className="p-10 text-center text-gray-400 text-xs font-medium">No notifications</div>
                      )}
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
             </div>

             {/* User Profile Info */}
             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold leading-tight">{session?.user?.name || "Rider"}</p>
                   <p className="text-[9px] text-green-500 font-black uppercase flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                   </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#1A4E11] border-2 border-[#c2a15e] overflow-hidden relative shadow-sm">
                   {session?.user?.image ? (
                      <Image src={session.user.image} alt="profile" fill className="object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold uppercase">
                        {session?.user?.name?.charAt(0) || "R"}
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

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiderLayout;