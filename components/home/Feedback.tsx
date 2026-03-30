"use client";




import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllFeedbacks } from "@/app/modules/feedback/feedback.api";
import { IFeedback } from "@/app/modules/feedback/feedback.interface";
import { TableSkeleton } from "../shared/TableSkeleton";



const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);


  const DEFAULT_COMPANY_LOGO = "https://res.cloudinary.com/dme9eydlq/image/upload/v1774687915/Vector_4_fycstk.png"; 
  const DEFAULT_USER_IMAGE = "https://res.cloudinary.com/dme9eydlq/image/upload/v1774687813/da51eeb666b47082979fc8f73e09a33816df2fe2_xkxx8g.jpg"; 

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

  if (loading) return <TableSkeleton />;

  return (
    <section className="py-20 px-4 bg-[#E4F5DC]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="secTitle">
          What Our Guests Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16 description mt-10">
          Our guests rave about the warm ambiance, attentive service, and unforgettable experiences they enjoy here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
          {feedbacks.map((item) => (
            <div key={item._id} className="flex flex-col items-center">
              
              {/* Company Logo with Fallback */}
              <div className="relative h-12 w-32 mb-6 grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={item.companyLogo && item.companyLogo !== "https://example.com/logo.png" 
                    ? item.companyLogo 
                    : DEFAULT_COMPANY_LOGO} 
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <p className="text-gray-700 text-lg italic mb-8 leading-relaxed">
                "{item.description}"
              </p>

              <div className="flex flex-col items-center">
                {/* User Image with Fallback */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-4 shadow-sm bg-gray-100">
                  <Image
                    src={item.userImage ? item.userImage : DEFAULT_USER_IMAGE} 
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