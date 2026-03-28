"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllFeedbacks } from "@/app/modules/feedback/feedback.api";
import { IFeedback } from "@/app/modules/feedback/feedback.interface";

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await getAllFeedbacks();
        if (res.success) {
          setFeedbacks(res.data);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) return <div className="py-20 text-center">Loading Feedbacks...</div>;

  return (
    <section className="py-20 px-4 bg-[#E4F5DC]">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
          What Our Guests Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          Our guests rave about the warm ambiance, attentive service, and unforgettable experiences they enjoy here.
        </p>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {feedbacks.map((item) => (
            <div key={item._id} className="flex flex-col items-center">
              {/* Company Logo */}
              <div className="relative h-12 w-32 mb-6 grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={item.companyLogo || "/placeholder-logo.png"}
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Feedback Text */}
              <p className="text-gray-700 text-lg italic mb-8 leading-relaxed">
                "{item.description}"
              </p>

              {/* User Info */}
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-4 shadow-sm">
                  <Image
                    src="/assets/img/FAQ1.png" // আপনার ডিফল্ট ইমেজ পাথ
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-bold text-[#1a1a1a] text-lg">{item.name}</h4>
                <p className="text-gray-500 text-sm uppercase tracking-wider">
                  {item.designation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;