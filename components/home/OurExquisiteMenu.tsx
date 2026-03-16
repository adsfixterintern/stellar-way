

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { IMenu, IReview } from '@/types/menu';
import { ICategory } from '@/types/category';
import { SkeletonCard } from '../shared/SkeletonCard';
import { useMenu } from '@/app/hooks/useMenu';
import { useCategories } from '@/app/hooks/useCategories';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';

const OurExquisiteMenu = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('All');
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  const { data: categories = [] } = useCategories();
  const { data: allMenus, isLoading } = useMenu();

  const getAverageRating = (reviews: IReview[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return total / reviews.length;
  };

  const filteredMenus = activeCategoryId === 'All'
    ? allMenus
    : allMenus?.filter((item: IMenu) => (item.categoryId)?._id === activeCategoryId);


  const paginatedMenus = filteredMenus?.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  const totalPages = Math.ceil((filteredMenus?.length || 0) / ITEMS_PER_PAGE);

  return (
    <section className="bg-secondary py-16 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="superTitle mb-4">Our Menu</p>
          <h2 className="secTitle text-primary">Our Exquisite Menu</h2>
        </div>

        {/* Category Tabs & Navigation Row */}
        <div className="flex items-center justify-between my-20 ">
          <div className="flex gap-8 overflow-x-auto border-b border-gray-200">
            <button
              onClick={() => { setActiveCategoryId('All'); setPage(0); }}
              className={`pb-2 text-lg font-semibold transition-all ${activeCategoryId === 'All' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-primary'}`}
            >
              All
            </button>
            {categories.map((cat: ICategory) => (
              <button
                key={cat._id}
                onClick={() => { setActiveCategoryId(cat._id); setPage(0); }}
                className={`pb-2 text-lg font-semibold transition-all ${activeCategoryId === cat._id ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-primary'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 ">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-3 rounded-lg border border-gray-400 hover:bg-gray-200 disabled:opacity-30 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="p-3 rounded-lg bg-primary text-white hover:opacity-90 disabled:opacity-30 transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            paginatedMenus?.map((item: IMenu) => {
              const avgRating = getAverageRating(item.reviews);
              const reviewCount = item.reviews?.length || 0;

              return (
                <div key={item._id} className="bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-sm relative pt-24">
                  <div className="absolute -top-16 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden z-10 shadow-lg">
                    <Image
                      src={item.image?.url || '/fallback-food.png'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 220px) 128px, 160px"
                      className="object-cover"
                    />
                  </div>

                  <h4 className="cardTitle mt-6 text-primary">{item.title}</h4>

                  <div className="flex gap-1 mb-3 items-center justify-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.round(avgRating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                    <span className="text-gray-400 text-sm ml-2">({reviewCount})</span>
                  </div>

                  <p className="cardDescription text-primary mb-6 grow">
                    Delight in a crispy mixed pizza, topped with fresh veggies, savory meats, and melty cheese.
                  </p>

                  <div className="flex items-center justify-between w-full mt-auto pt-4 border-t h-16">
                    <span className="price pt-4">৳{item.price?.toFixed(2)}</span>
                    <button className="bg-primary p-2 rounded-lg text-white hover:opacity-90 transition-all">
                      <ShoppingCart />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="text-center mt-16">
          <button className="blockBtn">See More</button>
        </div>
      </div>
    </section>
  );
};

export default OurExquisiteMenu;