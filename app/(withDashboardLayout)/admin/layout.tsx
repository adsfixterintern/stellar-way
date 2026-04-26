/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoCartOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoNotificationsOutline,
  IoStatsChartOutline,
  IoGridOutline,
  IoRestaurantOutline,
  IoCalendarOutline,
  IoBicycleOutline,
  IoNewspaperOutline,
  IoChatbubblesOutline,
  IoTicketOutline,
  IoCalendarNumberOutline,
  IoImagesOutline,
  IoBarChartOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import { SiAirtable } from "react-icons/si";
import { Toaster } from "react-hot-toast";
import logo from "@/assets/img/flogo.png";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LucideMessageSquareMore } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// SidebarContent
const SidebarContent = ({
  pathname,
  setIsSidebarOpen,
  menuItems,
}: {
  pathname: string;
  setIsSidebarOpen: (val: boolean) => void;
  menuItems: any[];
}) => (
  <div className="flex flex-col h-full max-h-screen overflow-y-auto bg-[#E4F5DC] p-6 shadow-sm border-r border-gray-100">
    <div className="mb-10 flex justify-center">
      <Link href="/">
        <div className="w-32 h-10 rounded flex items-center justify-center text-xs font-bold uppercase tracking-widest">
          <Image src={logo} alt="Seoul Mirage" className="h-auto" />
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

    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-auto flex items-center gap-3 px-4 py-3 w-full border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
    >
      <IoLogOutOutline className="text-xl" />
      Logout
    </button>
  </div>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", icon: <IoStatsChartOutline />, path: "/admin" },
    { name: "Category", icon: <IoGridOutline />, path: "/admin/category" },
    { name: "Menus", icon: <IoRestaurantOutline />, path: "/admin/menus" },
    { name: "Orders", icon: <IoCartOutline />, path: "/admin/orders" },
    { name: "Riders", icon: <IoBicycleOutline />, path: "/admin/riders" },
    { name: "Chefs", icon: <IoPeopleOutline />, path: "/admin/chef" },
    { name: "Blog", icon: <IoNewspaperOutline />, path: "/admin/blog" },
    { name: "Feedback", icon: <IoChatbubblesOutline />, path: "/admin/feedback" },
    { name: "Tables", icon: <SiAirtable />, path: "/admin/table" },
    { name: "Events", icon: <IoCalendarOutline />, path: "/admin/events" },
    {
      name: "Event Booking",
      icon: <IoTicketOutline />,
      path: "/admin/event-booking",
    },
    {
      name: "Booking",
      icon: <IoCalendarNumberOutline />,
      path: "/admin/booking",
    },
    {
      name: "User Management",
      icon: <IoPeopleOutline />,
      path: "/admin/user-management",
    },
    {
      name: "Gallery",
      icon: <IoImagesOutline />,
      path: "/admin/gallery",
    },
    {
      name: "Stats Management",
      icon: <IoBarChartOutline />,
      path: "/admin/stats",
    },
    {
      name: "Offers Management",
      icon: <IoBarChartOutline />,
      path: "/admin/manage-offers",
    },
    {
      name: "Owner Message",
      icon: <LucideMessageSquareMore />,
      path: "/admin/owner-message",
    },
    { name: "FAQ", icon: <IoHelpCircleOutline />, path: "/admin/faq" },
    { name: "Settings", icon: <IoSettingsOutline />, path: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFCFD] font-sans antialiased">
      <Toaster position="top-center" reverseOrder={false} />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-50">
        <SidebarContent
          pathname={pathname}
          setIsSidebarOpen={setIsSidebarOpen}
          menuItems={menuItems}
        />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="h-20 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-2xl p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <IoMenuOutline />
            </button>
            <h1 className="text-xl font-black text-gray-800 capitalize">
              {pathname.split("/").pop() || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-2xl text-gray-400 relative">
              <IoNotificationsOutline />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-sm font-bold">AU</span>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 w-full">
          <div className="min-h-screen">{children}</div>
        </main>
      </div>

      {/* MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          <div className="relative w-72 h-full max-h-screen overflow-y-auto bg-white shadow-2xl">
            <button
              className="absolute top-5 right-5 text-3xl"
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
