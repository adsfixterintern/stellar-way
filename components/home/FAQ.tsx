/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import pic1 from "../../assets/img/FAQ1.png";
import pic2 from "../../assets/img/FAQ2.png";
import { useFaqs } from "@/app/hooks/useFaqs";
import { SkeletonFAQ } from "../shared/SkeletonFAQ";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const { data: faqData = [], isLoading } = useFaqs();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <section
      id="faq-section"
      className="relative w-full py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        <div className="absolute -top-10 -left-10 w-24 md:w-32 opacity-90 pointer-events-none">
          <Image src={pic1} alt="leaf" className="object-contain" />
        </div>
        <div className="absolute -bottom-16 -right-10 w-32 md:w-56 opacity-80 pointer-events-none">
          <Image src={pic2} alt="plant" className="object-contain" />
        </div>

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="superTitle ">FAQ</span>
            <div className="w-12 h-[1.5px] bg-[#4c6b4c]"></div>
          </div>
          <h2 className="secTitle ">Frequently Asked Questions</h2>
        </div>

        {/* Accordion Wrapper faq */}
        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
          {isLoading ? (
            <SkeletonFAQ></SkeletonFAQ>
          ) : faqData.length > 0 ? (
            faqData.map((item: any, index: number) => (
              <div
                key={item._id || index}
                className={`border rounded-2xl transition-all duration-300 ${
                  openIndex === index
                    ? "border-[#4c6b4c] bg-[#f1f8f1]/70 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                >
                  <span
                    className={`text-[18px] md:text-[20px] font-bold ${
                      openIndex === index ? "text-[#2d402d]" : "text-[#333333]"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span className="shrink-0 ml-4">
                    {openIndex === index ? (
                      <FiChevronUp className="text-2xl text-primary" />
                    ) : (
                      <FiChevronDown className="text-2xl text-gray-400" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-8 pb-8 text-[#555555] text-[16px] leading-relaxed border-t border-[#4c6b4c]/10 pt-5">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              No questions found at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
