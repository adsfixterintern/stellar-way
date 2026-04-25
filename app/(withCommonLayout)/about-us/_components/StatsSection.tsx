/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  IoPeopleOutline,
  IoRestaurantOutline,
  IoRibbonOutline,
  IoTrophyOutline,
  IoGitBranchOutline,
} from "react-icons/io5";
import { getRestaurantStats } from "@/app/modules/stats/restaurantStats.api";

// --- CountUp Component (Framer Motion Engine) ---
const CountUp = ({ to }: { to: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // যখন স্ক্রিনে আসবে তখনই শুরু হবে

  // Spring animation config
  const springValue = useSpring(count, {
    damping: 30, // অ্যানিমেশন কতটা বাউন্সি হবে
    stiffness: 100, // গতি কেমন হবে
  });

  const displayValue = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [count, to, isInView]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

const StatsSection = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getRestaurantStats();
        if (res?.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    {
      id: 1,
      label: "Happy Clients",
      value: stats?.happyClients || 0,
      icon: <IoPeopleOutline size={24} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      label: "Years Experience",
      value: stats?.yearsOfExperience || 0,
      icon: <IoRibbonOutline size={24} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      id: 3,
      label: "Total Dishes",
      value: stats?.totalDishes || 0,
      icon: <IoRestaurantOutline size={24} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      id: 4,
      label: "Awards Won",
      value: stats?.awards || 0,
      icon: <IoTrophyOutline size={24} />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      id: 5,
      label: "Our Branches",
      value: stats?.branches || 0,
      icon: <IoGitBranchOutline size={24} />,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  if (isLoading)
    return (
      <div className="h-60 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1A4E11] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {statItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center text-center space-y-5 group"
            >
              {/* Icon Container with Hover Animation */}
              <div
                className={`w-20 h-20 ${item.bg} ${item.color} rounded-full flex items-center justify-center transition-all duration-500 group-hover:rounded-2xl group-hover:rotate-[10deg] shadow-sm`}
              >
                {item.icon}
              </div>

              {/* Counter Text */}
              <div>
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 flex items-center justify-center tracking-tight">
                  <CountUp to={item.value} />
                  <span className="text-primary ml-0.5">+</span>
                </h3>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;