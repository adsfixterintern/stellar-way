/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; 
import {
  IoCartOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoNotificationsOutline,
  IoStatsChartOutline,
  IoPersonOutline,
  IoCalendarClearOutline,
} from "react-icons/io5";
import Image from "next/image";
import logo from '@/assets/img/flogo.png'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const SidebarContent = ({ 
  pathname, 
  setIsSidebarOpen, 
  menuItems 
}: { 
  pathname: string; 
  setIsSidebarOpen: (val: boolean) => void;
  menuItems: any[];
}) => (
  <div className="flex flex-col h-full bg-[#E4F5DC] p-6 shadow-sm border-r border-gray-100">
   <div className="mb-10 flex justify-center">
  <Link href="/">
    <div className="flex flex-col items-center justify-center gap-2 group transition-all duration-300">
      
      <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#E4F5DC] transition-colors">
        <Image 
          src={logo}
          alt="Savory Nest Logo"
          width={80} 
          height={80}
          className="h-auto w-auto object-contain"
          priority 
        />
      </div>

      <div className="h-0.5 w-5 bg-[#1A4E11] rounded-full scale-x-0 group-hover:scale-x-150 transition-transform duration-300"></div>
    </div>
  </Link>
</div>

    <nav className="flex-1 space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.name}
            href={item.path}
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              isActive
                ? "bg-[#1A4E11] text-white shadow-xl translate-x-1"
                : "text-gray-500 hover:bg-white/70 hover:text-black"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </Link>
        );
      })}
    </nav>

    {/* Logout Button with functionality */}
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="mt-auto flex items-center gap-3 px-4 py-3 w-full border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
    >
      <IoLogOutOutline className="text-xl" />
      Logout
    </button>
  </div>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { data: session } = useSession(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();

  
  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "U";
  };

  const menuItems = [
    { name: "Overview", icon: <IoStatsChartOutline />, path: "/dashboard" },
    { name: "My Orders", icon: <IoCartOutline />, path: "/dashboard/my-orders" },
    { name: "Profile", icon: <IoPersonOutline />, path: "/dashboard/profile" },
  { name: "My Booking", icon: <IoCalendarClearOutline />, path: "/dashboard/my-booking" }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFCFD] font-sans antialiased">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent 
          pathname={pathname} 
          setIsSidebarOpen={setIsSidebarOpen} 
          menuItems={menuItems} 
        />
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-2xl p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <IoMenuOutline />
            </button>
            <h1 className="text-xl font-black text-gray-800 tracking-tight capitalize">
              {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-2xl text-gray-400 hover:text-black transition-colors relative">
              <IoNotificationsOutline />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Current User Info Section */}
            <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {session?.user?.name || "Guest User"}
                </p>
                <p className="text-[9px] text-gray-400 font-black tracking-widest mt-0.5">
                  {session?.user?.email || "No Email Found"}
                </p>
              </div>
              
              <div className="w-10 h-10 rounded-full border-2 border-green-50 overflow-hidden bg-gray-100 shadow-sm flex items-center justify-center relative">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="User" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xs font-black text-[#1A4E11]">
                    {getInitials(session?.user?.name || "User")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <div className="min-h-screen">{children}</div>
        </main>
      </div>

      {/* 3. MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-60 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          <div className="relative w-72 h-full bg-white shadow-2xl">
            <button
              className="absolute top-5 right-5 z-10 text-3xl text-gray-400 hover:text-black transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <IoCloseOutline />
            </button>
            <SidebarContent 
              pathname={pathname} 
              setIsSidebarOpen={setIsSidebarOpen} 
              menuItems={menuItems} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;