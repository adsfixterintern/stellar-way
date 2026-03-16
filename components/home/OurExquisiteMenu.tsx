"use client";
import React, { useState } from 'react';
import Image from 'next/image';

import { IMenu } from '@/types/menu';
import { SkeletonCard } from '../shared/SkeletonCard';
import { useMenu } from '@/app/hooks/useMenu';

const categories = ['Main Courses', 'Appetizers', 'Beverages', 'Desserts'];

const OurExquisiteMenu = () => {
  const [activeTab, setActiveTab] = useState('Appetizers');
  const { data: menus, isLoading } = useMenu();

  return (
    <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="superTitle">Our Menu</p>
        <h2 className="secTitle text-primary">Our Exquisite Menu</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 border-b border-gray-100 pb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`pb-2 px-4 transition-all duration-300 font-semibold ${
              activeTab === cat 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-400 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          menus?.slice(0, 4).map((item: IMenu) => (
            <div key={item._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center group">
              {/* Image Circle */}
              <div className="relative w-40 h-40 mb-6 overflow-hidden rounded-full border-4 border-gray-50">
                <Image 
                  src={item.image?.url || '/fallback-food.png'} 
                  alt={item.title}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Details */}
              <h4 className="cardTitle">{item.title}</h4>
              <p className="cardDescription">
                Delight in a crispy mix, topped with fresh veggies, savory meats, and melty cheese.
              </p>
              
              {/* Rating */}
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                <span className="text-gray-400 text-sm ml-2">(24)</span>
              </div>

              {/* Price & Cart */}
              <div className="flex items-center justify-between w-full mt-auto pt-4 border-t">
                <span className="price">৳{item.price.toFixed(2)}</span>
                <button className="bg-primary p-3 rounded-full text-white hover:bg-green-900 transition-colors">
                  🛒
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* See More Button */}
      <div className="text-center mt-12">
        <button className="bg-primary text-white px-10 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
          See More
        </button>
      </div>
    </section>
  );
};

export default OurExquisiteMenu;