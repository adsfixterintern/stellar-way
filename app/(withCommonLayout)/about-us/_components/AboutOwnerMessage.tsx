"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa"; 
import {
  getOwnerMessage,
  IOwnerMessage,
} from "@/app/modules/ownerMessage/ownerMessage.api";

const AboutOwnerMessage = () => {
  const [data, setData] = useState<IOwnerMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOwnerMessage();
        setData(res);
      } catch (error) {
        console.error("Error fetching owner message:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const Skeleton = () => (
    <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-12 animate-pulse">
      <div className="w-full md:w-1/3 flex flex-col items-center md:items-start space-y-4">
        <div className="w-64 h-80 bg-gray-200 rounded-[40px]" />
        <div className="h-6 w-40 bg-gray-200 rounded" />
      </div>
      <div className="w-full md:w-2/3 space-y-6 mt-10">
        <div className="h-10 w-3/4 bg-gray-200 rounded" />
        <div className="h-24 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );

  if (loading) return <Skeleton />;
  if (!data?.ownerName) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-16">
          {/* Left Side: Identity */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-5/12 lg:w-4/12 group"
          >
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#1A4E11]/20 rounded-[40px] -z-10" />

              <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl bg-gray-100">
                {data.image ? (
                  <Image
                    src={data.image}
                    alt={data.ownerName}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center md:text-left">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                {data.ownerName}
              </h3>
              <p className="text-[#1A4E11] font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
                {data.designation}
              </p>
            </div>
          </motion.div>

          {/* Right Side: Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-7/12 lg:w-7/12 self-center"
          >
            <div className="relative flex flex-col justify-center min-h-[300px] md:min-h-[400px]">
              {/* React Icon for Quotation */}
              <div className="text-[#1A4E11]/10 absolute top-24 -left-6">
                <FaQuoteLeft size={60} />
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight relative z-10">
                Word from <span className="text-[#1A4E11]">Leadership</span>
              </h2>

              <div className="relative">
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium italic mb-8 max-w-prose">
                  {data.message}
                </p>

                {/* Visual Divider Only */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-[#1A4E11]" />
                  <div className="w-2 h-2 rounded-full bg-[#1A4E11]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutOwnerMessage;
