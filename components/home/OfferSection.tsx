/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiChevronRight, FiX, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getActiveOffersApi } from "@/app/modules/offer/offer.api";

// --- CUSTOM HOOK: COUNTDOWN ---
const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// --- COMPONENT: SKELETON CARD ---
const OfferCardSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 h-[560px] flex flex-col animate-pulse shadow-sm">
    <div className="h-64 bg-gray-200" />
    <div className="p-8 space-y-6 flex-1">
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
        <div className="h-4 bg-gray-100 rounded-lg w-full" />
        <div className="h-4 bg-gray-100 rounded-lg w-5/6" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-14 bg-gray-50 rounded-2xl" />
        <div className="h-14 bg-gray-50 rounded-2xl" />
      </div>
      <div className="h-14 bg-gray-200 rounded-2xl w-full mt-auto" />
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const OfferSection = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await getActiveOffersApi();
        setOffers(response?.data || (Array.isArray(response) ? response : []));
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        // loading skeleton check করার জন্য ১ সেকেন্ড ডিলে দেওয়া হয়েছে
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchOffers();
  }, []);

  if(offers.length===0) return null;

  return (
    <section className="py-20 px-6 bg-[#FDFEFE] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#1A4E11] font-black text-xs uppercase tracking-[0.3em] mb-3 block"
          >
            Exclusive Deals
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight"
          >
            Special <span className="text-[#1A4E11]">Offers</span> for You
          </motion.h2>
        </div>

        {/* Grid with AnimatePresence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="wait">
            {loading ? (
              // রেন্ডার হবে যখন ডাটা ফেচ হচ্ছে
              <React.Fragment key="skeleton-group">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <OfferCardSkeleton />
                  </motion.div>
                ))}
              </React.Fragment>
            ) : offers.length > 0 ? (
              // রেন্ডার হবে যখন ডাটা চলে আসবে
              offers.map((offer, index) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  index={index}
                  onOpenMenu={() => setSelectedOffer(offer)}
                />
              ))
            ) : (
              // রেন্ডার হবে যখন কোনো অফার নেই
              <motion.div
                key="no-offers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20 text-gray-400 font-bold"
              >
                No active offers right now.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- MODAL (unchanged but wrapped for consistency) --- */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setSelectedOffer(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-full transition-colors z-20"
              >
                <FiX size={24} />
              </button>
              <div className="p-8 md:p-12">
                <div className="mb-8">
                  <span className="text-[#1A4E11] font-black text-[10px] uppercase tracking-widest bg-[#1A4E11]/5 px-4 py-2 rounded-full">
                    Menu List
                  </span>
                  <h3 className="text-3xl font-black text-gray-900 mt-4">
                    {selectedOffer.title}
                  </h3>
                </div>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOffer.applicableMenus?.map((menu: any) => (
                    <MenuListItem key={menu._id} menu={menu} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

// --- COMPONENT: MENU LIST ITEM ---
const MenuListItem = ({ menu }: { menu: any }) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/menu/${menu._id}`)}
      className="group flex items-center gap-4 p-4 rounded-3xl border border-gray-100 hover:border-[#1A4E11]/20 hover:bg-[#1A4E11]/5 transition-all cursor-pointer"
    >
      <img
        src={menu.image.url || "https://via.placeholder.com/150"}
        alt={menu.title}
        className="w-16 h-16 rounded-2xl object-cover group-hover:scale-110 transition-transform"
      />
      <div className="flex-1">
        <h4 className="font-black text-gray-800 text-lg leading-tight">
          {menu.title}
        </h4>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          View Details
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover:text-[#1A4E11] group-hover:translate-x-1 transition-all shadow-sm">
        <FiArrowRight />
      </div>
    </div>
  );
};

// --- COMPONENT: SINGLE OFFER CARD ---
const OfferCard = ({
  offer,
  index,
  onOpenMenu,
}: {
  offer: any;
  index: number;
  onOpenMenu: () => void;
}) => {
  const timeLeft = useCountdown(offer.endDate);
  const now = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);

  const isRunning = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;

  const fallbackImages = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -12 }}
      className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full"
    >
      {/* Discount Badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-[#1A4E11] text-white px-5 py-2 rounded-2xl font-black text-xl shadow-lg">
          {offer.discountPercentage}%{" "}
          <span className="text-[10px] block opacity-80 leading-none">Off (Dine-in Only)</span>
        </div>
      </div>

      <div className="relative h-64 overflow-hidden">
        <img
          src={
            offer.bannerImage || fallbackImages[index % fallbackImages.length]
          }
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
          {isRunning ? (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex justify-between items-center text-white">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-400 animate-pulse">
                  Live Now
                </span>
                <span className="text-[10px] font-bold">Ends In:</span>
              </div>
              <div className="flex gap-3">
                {[
                  { l: "D", v: timeLeft.days },
                  { l: "H", v: timeLeft.hours },
                  { l: "M", v: timeLeft.minutes },
                  { l: "S", v: timeLeft.seconds },
                ].map((t, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg font-black leading-none">
                      {t.v.toString().padStart(2, "0")}
                    </div>
                    <div className="text-[8px] font-bold opacity-60 uppercase">
                      {t.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isUpcoming ? (
            <div className="bg-[#1A4E11] text-white rounded-2xl p-4 text-center border border-white/10 shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                Starting On
              </span>
              <div className="text-sm font-black mt-1">
                {startDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/80 backdrop-blur-md text-white rounded-2xl p-4 text-center font-black uppercase text-[10px] tracking-widest">
              Offer Expired
            </div>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-[#1A4E11] transition-colors line-clamp-1">
          {offer.title}
        </h3>
        <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 italic leading-relaxed">
          {offer.description}
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <span className="text-[8px] font-black text-gray-400 uppercase block mb-1 tracking-tighter">
              Valid From
            </span>
            <span className="text-xs font-bold text-gray-700">
              {startDate.toLocaleDateString()}
            </span>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
            <span className="text-[8px] font-black text-gray-400 uppercase block mb-1 tracking-tighter">
              Valid To
            </span>
            <span className="text-xs font-bold text-[#1A4E11]">
              {endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <button
          onClick={onOpenMenu}
          className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 transition-all font-black text-xs uppercase tracking-widest bg-[#1A4E11] text-white hover:bg-[#153d0e] shadow-lg shadow-[#1A4E11]/20 active:scale-95"
        >
          View Applicable Menu <FiChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default OfferSection;
