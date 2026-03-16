"use client";
import React from 'react';
import Image from 'next/image';
import resbg from '../../assets/img/bg.png'; 
import res1 from '../../assets/img/reserve1.png';   
import res2 from '../../assets/img/rese2.png';     

const Reserve = () => {
  return (
    <section className="relative w-full py-12 md:py-20 px-4 md:px-10 overflow-hidden">
      {/* ব্যাকগ্রাউন্ড ডার্ক লেয়ার */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={resbg} 
          alt="background" 
          fill 
          className="object-cover brightness-[0.3]" 
          priority
        />
      </div>

      {/* মেইন হোয়াইট কার্ড */}
      <div className="relative z-10 max-w-7xl mx-auto bg-white rounded-[30px] md:rounded-[40px] shadow-2xl overflow-hidden">
        
        <div className="w-full flex flex-col lg:flex-row items-center relative min-h-[500px] lg:h-[450px]">
          
          {/* বাম পাশের ইমেজ (মোবাইলে হাইড থাকবে, ল্যাপটপে সুন্দরভাবে পজিশন হবে) */}
          <div className="hidden lg:block absolute bottom-0 left-0 w-[260px] xl:w-[300px] z-20 pointer-events-none">
            <Image 
              src={res1} 
              alt="kabab" 
              width={400}
              height={400}
              className="w-full h-auto object-contain translate-y-8"
            />
          </div>

          {/* মাঝখানের কন্টেন্ট - রেসপন্সিভ প্যাডিং এবং এলাইনমেন্ট */}
          <div className="z-30 w-full lg:max-w-xl mx-auto text-center py-16 px-6 md:px-12">
            <h2 className="text-3xl md:text-[44px] xl:text-[48px] font-bold text-[#1a1a1a] leading-[1.1] mb-5">
              Book Your Dining Experience Today!
            </h2>
            
            {/* আপনার গ্লোবাল CSS 'description' রাখা হয়েছে */}
            <p className="description mb-10 font-medium text-gray-500">
              Unlock a Culinary Journey Like No Other at Savory Nest.
            </p>
            
            {/* ইনপুট বক্স - মোবাইলে স্ট্যাক হবে না, ফ্লেক্সিবল থাকবে */}
            <div className="relative max-w-md mx-auto flex flex-col sm:flex-row items-center bg-[#f2f7e4] border border-[#e8f0d5] rounded-[20px] sm:rounded-full p-1.5 gap-2 sm:gap-0">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full flex-grow bg-transparent px-6 py-3 text-gray-700 outline-none placeholder:text-gray-400 text-[15px]"
              />
              <button className="w-full sm:w-auto bg-[#2d402d] hover:bg-[#1a261a] text-white px-8 py-3.5 rounded-[15px] sm:rounded-full font-bold text-[15px] transition-all whitespace-nowrap">
                Reserve Now
              </button>
            </div>
          </div>

      
          <div className="hidden lg:block absolute top-[-150] right-0 h-full w-[35%] xl:w-[40%] z-10">
            <div className="relative w-full h-full">
              <Image 
                src={res2} 
                alt="pan fry" 
                fill
                className="object-contain object-right" 
                priority
              />
            </div>
          </div>

          <div className="lg:hidden absolute bottom-[-20px] right-[-20px] w-32 opacity-20">
             <Image src={res2} alt="decoration" width={200} height={200} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reserve;