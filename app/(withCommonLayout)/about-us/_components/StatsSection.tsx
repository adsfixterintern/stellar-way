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

// --- CountUp Component ---
const CountUp = ({ to }: { to: number }) => {
  const count = useMotionValue(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const springValue = useSpring(count, {
    damping: 30,
    stiffness: 100,
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
      icon: <IoPeopleOutline size={28} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      label: "Years Experience",
      value: stats?.yearsOfExperience || 0,
      icon: <IoRibbonOutline size={28} />,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      id: 3,
      label: "Total Dishes",
      value: stats?.totalDishes || 0,
      icon: <IoRestaurantOutline size={28} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      id: 4,
      label: "Awards Won",
      value: stats?.awards || 0,
      icon: <IoTrophyOutline size={28} />,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      id: 5,
      label: "Our Branches",
      value: stats?.branches || 0,
      icon: <IoGitBranchOutline size={28} />,
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
    <section className="py-24 bg-[#FDFDFD] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- Header Section (Title & Subtitle) --- */}
        <div className="text-center mb-16">
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-[#3A4D39] mb-4 tracking-tight"
          >
            We Pride Ourselves on <br className="hidden md:block" /> 
            Excellence & Quality
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
          >
            From the first dish we served to the thousands of smiles we have earned, 
            every number tells a story of passion and dedication.
          </motion.p>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
          {statItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center space-y-5 group"
            >
              {/* Icon Container */}
              <div
                className={`w-16 h-16 md:w-20 md:h-20 ${item.bg} ${item.color} rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:rounded-2xl group-hover:rotate-[10deg] shadow-sm`}
              >
                {item.icon}
              </div>

              {/* Counter Text */}
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center justify-center tracking-tight">
                  <CountUp to={item.value} />
                  <span className="text-[#1A4E11] ml-0.5">+</span>
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">
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