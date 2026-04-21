"use client";

import React from "react";
import Image from "next/image";

const Testimonials = () => {
  // ✅ STATIC DATA INSIDE COMPONENT
  const feedbacks = [
    {
      id: 1,
      companyLogo: "/logo1.png",
      review:
        "Savory Nest offers an extraordinary dining experience. The food is exquisite, and the ambiance is perfect for a special night out.Highly recommended!",
      userImage: "/image1.png",
      name: "John Doe",
      designation: "Food Blogger",
    },
    {
      id: 2,
      companyLogo: "/logo2.png",
      review:
        "From the moment we walked in, we were treated like royalty. The service was impeccable, and the dishes were masterpieces. Can't wait to come back!",
      userImage: "/image2.png",
      name: "Michael Lee ",
      designation: "Content Creator",
    },
    {
      id: 3,
      companyLogo: "/logo3.png",
      review:
        "Savory Nest has become our go-to place for celebrations. The chef’s tasting menu is a culinary journey that never disappoints.",
      userImage: "/image3.png",
      name: "Michael Smith",
      designation: "Travel Vlogger",
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#E4F5DC]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="secTitle">What Our Guests Say</h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-16 description mt-10">
          Our guests rave about the warm ambiance, attentive service, and
          unforgettable experiences they enjoy here.
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
          {feedbacks.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center h-full text-center"
            >
              {/* COMPANY LOGO */}
              <div className="relative h-12 w-32 mb-6 grayscale hover:grayscale-0 transition-all duration-300">
                <Image
                  src={item.companyLogo}
                  alt="Company Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* REVIEW (equal height fix) */}
              <p className="text-gray-700 text-lg italic mb-8 leading-relaxed min-h-[120px] flex items-center justify-center">
                &ldquo;{item.review}&rdquo;
              </p>

              {/* USER INFO (bottom alignment fix) */}
              <div className="flex flex-col items-center mt-auto">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-4 shadow-sm bg-gray-100">
                  <Image
                    src={item.userImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h4 className="font-bold text-[#1a1a1a] text-lg">
                  {item.name}
                </h4>

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
