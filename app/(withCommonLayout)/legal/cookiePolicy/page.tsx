import SingleHero from '@/components/shared/SingleHero';
import React from 'react';

const CookiePolicy = () => {
  return (
    <div>
      {/* ১. হিরো সেকশন আপডেট করা হয়েছে */}
      <SingleHero
        isCenter={true}
        subtitle="Legal"
        title="Cookie Policy"
        description="Learn how Savory Nest uses cookies to enhance your online ordering and dining experience."
        buttonTitle="Back to Home"
        buttonLink="/"
      />

      {/* ২. কন্টেন্ট সেকশন */}
      <div className="bg-white py-16 px-6 sm:px-12 lg:px-24 font-sans text-gray-800">
        <div className="max-w-4xl mx-auto border border-gray-100 p-10 rounded-3xl ">
          <h1 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#1A4E11] rounded-full flex items-center justify-center text-white text-sm italic">
              C
            </span>
            Cookie Policy
          </h1>
          <p className="text-gray-500 mb-10 font-medium tracking-tight">
            This policy explains how we use cookies and similar technologies to improve your experience on Savory Nest.
          </p>

          <div className="grid gap-10">
            {/* What are Cookies */}
            <div className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group">
              <h3 className="font-bold text-[#1A4E11] mb-2 uppercase text-sm tracking-widest group-hover:translate-x-1 transition-transform">
                What are Cookies?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cookies are small text files stored on your device that help us remember your preferences, like your favorite food items, cart history, or your login session.
              </p>
            </div>

            {/* Necessary Cookies */}
            <div className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group">
              <h3 className="font-bold text-[#1A4E11] mb-2 uppercase text-sm tracking-widest group-hover:translate-x-1 transition-transform">
                Necessary Cookies
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                These are essential for the website to function properly. Without these, features like keeping you logged in or maintaining items in your shopping cart would not work.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group">
              <h3 className="font-bold text-[#1A4E11] mb-2 uppercase text-sm tracking-widest group-hover:translate-x-1 transition-transform">
                Analytics & Experience
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use these to understand which menu items are most popular and how users navigate our site, allowing us to serve you better and provide a smoother interface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;