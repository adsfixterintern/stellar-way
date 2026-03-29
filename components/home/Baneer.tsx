import React from 'react';
import Image from 'next/image';
import Navbar from '../shared/Navbar';
import { Play, Star, Heart } from 'lucide-react';
import CustomButton from '../shared/CustomButton';

const Baneer = () => {

  const floatStyle = `
    @keyframes simpleFloat {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    .animate-float-custom {
      animation: simpleFloat 3s ease-in-out infinite;
    }
    .animate-float-delayed {
      animation: simpleFloat 3s ease-in-out infinite;
      animation-delay: 1.5s;
    }
  `;

  return (
    <div className="relative overflow-hidden">
      <style>{floatStyle}</style> 
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773563794/3afac52152e35e30010981a1553eb6b0add11db0_y6nelx.png"
          alt="Banner Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#031100CC] via-[#03110080] to-transparent z-10" />
      </div>

      <div className="relative z-50 ">
        <Navbar />
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto pt-32 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* pata icon */}
        <div className='absolute top-28 left-28 rotate-65'>
          <Image width={44} height={84} alt='pata icon' src={"https://res.cloudinary.com/dn5t9fhya/image/upload/v1773631792/5ac3ee29ac4640e424f5dc9bacca419667a64f4f_seh1ho.png"} />
        </div>

        {/* tomato icon */}
        <div className='absolute -right-26 top-10'>
          <Image width={209} height={290} alt='tomato' src={"https://res.cloudinary.com/dn5t9fhya/image/upload/v1773566661/9d94ced4fa581ea7095acfbdd8f900c7719fc123_sz9sqr.png"} className='-rotate-16' />
        </div>

        {/* Left Content */}
        <div className="w-full lg:w-1/2 space-y-8 px-4 lg:px-0">
          <div className="space-y-4 text-center lg:text-left">
            <h1 className="text-white text-5xl lg:text-7xl font-bold leading-[1.1]">
              Savor the <br />
              <span className="flex items-center justify-center lg:justify-start gap-3">
                Exquisite 
                <span className="relative inline-flex items-center justify-center w-24 h-12 rounded-full overflow-hidden border border-white/20 group cursor-pointer">
                  <Image src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" alt="food thumbnail" fill className="object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play size={16} className="text-white fill-white" />
                  </div>
                </span>
              </span>
              Flavors <br />
              at Savory Nest
            </h1>
            <p className="text-gray-300 text-lg lg:text-xl font-medium max-w-md mx-auto lg:mx-0">
              Experience Culinary Excellence in Every Bite
            </p>
          </div>
          <div className="flex justify-center lg:justify-start">
           <CustomButton title='Order Now' path='/menu' />
          </div>
        </div>

        {/* Right Content - Plate & Badges */}
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0">
          <div className="relative w-175 h-172">
            <Image 
              src="https://res.cloudinary.com/dn5t9fhya/image/upload/v1773564244/3ae59afda4b6c04a1e44916237d3441e07dd5c93_xtonf9.png" 
              alt="Plate of Food" 
              fill
              className="object-cover w-full h-full"
            />

    
            <div className="absolute top-28 -left-6 md:-left-6 bg-white rounded-2xl px-8 py-4 shadow-2xl flex items-center gap-3 animate-float-custom">
              <div>
                <Image width={50} height={50} alt='Delivery' src={"https://res.cloudinary.com/dn5t9fhya/image/upload/v1773566201/8cb4cec463a62b8b2a4551d6589e6c606fb5d2b6_czotqm.png"} />
              </div>
              <div>
                <p className="text-black font-bold text-sm md:text-base">Delivery</p>
                <p className="text-gray-500 text-[10px] md:text-xs font-semibold">in 30 mint</p>
              </div>
            </div>

            
            <div className="absolute bottom-16 -right-2 md:right-10 bg-white rounded-2xl p-3 md:p-4 shadow-2xl flex items-center gap-3 animate-float-delayed">
              <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full border-2 border-white">
                <Image src="https://i.pravatar.cc/150?u=ali" alt="user avatar" fill className="object-cover" />
              </div>
              <div>
                <p className="text-black font-bold text-sm md:text-base">Ali Ahmad</p>
                <div className="flex items-center gap-2">
                   <span className="flex items-center text-xs font-bold text-gray-700 gap-0.5">
                     <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.5
                   </span>
                   <span className="flex items-center text-xs font-bold text-gray-700 gap-0.5">
                     <Heart size={12} className="text-red-500 fill-red-500" /> 1k Likes
                   </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Baneer;