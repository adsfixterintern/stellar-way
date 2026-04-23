/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IFeedback } from "@/app/modules/feedback/feedback.interface";
import { getAllPublishedFeedbacks } from "@/app/modules/feedback/feedback.api";

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await getAllPublishedFeedbacks();
        setFeedbacks(res.data || []);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);


  if (loading || feedbacks.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-[#E4F5DC]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="secTitle">What Our Guests Say</h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-16 description mt-10">
          Our guests rave about the warm ambiance, attentive service, and
          unforgettable experiences they enjoy here.
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
          {feedbacks.slice(0, 3).map((item) => (
            <div
              key={item._id}
              
              className="flex flex-col items-center h-full text-center max-w-xs w-full"
            >
              {/* REVIEW */}
              <div className="min-h-[120px] flex items-center justify-center mb-8">
                <p className="text-gray-700 text-lg italic leading-relaxed">
                  &ldquo;{item.description}&rdquo;
                </p>
              </div>

              {/* USER INFO */}
              <div className="flex flex-col items-center mt-auto">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-4 shadow-sm bg-gray-100">
                  <Image
                   
                    src={(item.userId as any)?.image || "/placeholder-avatar.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h4 className="font-bold text-[#1a1a1a] text-lg">
                  {item.name}
                </h4>

                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-1">
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