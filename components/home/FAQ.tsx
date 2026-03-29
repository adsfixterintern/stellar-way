"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import pic1 from "../../assets/img/FAQ1.png";
import pic2 from "../../assets/img/FAQ2.png";

const faqData = [
  {
    question: "Do I need to make a reservation?",
    answer: "Yes, we have a variety of vegetarian and vegan dishes available. Please check our menu for more details.",
  },
  {
    question: "Do you offer vegetarian or vegan options?",
    answer: "Absolutely! We cater to all dietary preferences with a dedicated menu.",
  },
  {
    question: "Is parking available?",
    answer: "Yes, we have free parking space available for our customers.",
  },
  {
    question: "Do you host private events?",
    answer: "Yes, we have private halls for birthdays, corporate events, and parties.",
  },
  {
    question: "What are your opening hours?",
    answer: "We are open from 10:00 AM to 11:00 PM every day.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section id="faq-section" className="relative w-full py-24 bg-white overflow-hidden">
      {/* Container with Max Width and Auto Margin */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Decorative Images - পজিশন ঠিক রাখা হয়েছে */}
        <div className="absolute -top-10 -left-10 w-24 md:w-32 opacity-90 pointer-events-none">
          <Image src={pic1} alt="leaf" className="object-contain" />
        </div>
        <div className="absolute -bottom-16 -right-10 w-32 md:w-56 opacity-80 pointer-events-none">
          <Image src={pic2} alt="plant" className="object-contain" />
        </div>

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="superTitle tracking-[0.3em] text-[#4c6b4c] uppercase">
              FAQ
            </span>
            <div className="w-12 h-[1.5px] bg-[#4c6b4c]"></div>
          </div>
          <h2 className="secTitle md:text-[50px] font-bold text-[#1a1a1a] leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion Wrapper - কন্টেন্টকে মাঝখানে রাখার জন্য max-w-4xl */}
        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
          {faqData.map((item, index) => (
            <div
              key={index}
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
                <span className={`text-[18px] md:text-[20px] font-bold ${
                  openIndex === index ? "text-[#2d402d]" : "text-[#333333]"
                }`}>
                  {item.question}
                </span>
                <span className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <FiChevronUp className="text-2xl text-[#4c6b4c]" />
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
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center mt-16">
          <button className="blockBtn  font-bold text-[16px] transition-all active:scale-95 shadow-lg">
            See More
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;