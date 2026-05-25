/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useMenu } from '@/app/hooks/useMenu';
import { IMenu } from '@/types/menu';
import { SkeletonCard } from '../shared/SkeletonCard';

const HotDeliciousItem = () => {
  const { data: menus, isLoading } = useMenu();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const processedData = useMemo(() => {
    if (!menus || menus.length === 0) return { topCategories: [], categoryItems: {} };

    const catStats: Record<string, { 
      totalRating: number; 
      count: number; 
      items: any[]; 
      name: string;
      status: string; 
    }> = {};

    menus.forEach((item: IMenu) => {
      const categoryObj = typeof item.categoryId === 'object' ? item.categoryId : null;
      if (categoryObj && categoryObj.status === 'inactive') {
        return; 
      }

      const itemAvgRating = item.reviews?.length 
        ? item.reviews.reduce((acc, rev) => acc + rev.rating, 0) / item.reviews.length 
        : 0;

      const catId = (categoryObj ? categoryObj._id : item.categoryId) as any;
      const catName = categoryObj ? categoryObj.name : "Category";

      if (!catStats[catId]) {
        catStats[catId] = { 
          totalRating: 0, 
          count: 0, 
          items: [], 
          name: catName,
          status: categoryObj?.status || 'active' 
        };
      }

      catStats[catId].totalRating += itemAvgRating;
      catStats[catId].count += 1;
      catStats[catId].items.push({ ...item, avgRating: itemAvgRating });
    });

    const sortedCategories = Object.keys(catStats)
      .map(id => ({
        id,
        name: catStats[id].name,
        avgScore: catStats[id].totalRating / catStats[id].count,
        status: catStats[id].status
      }))
      .filter(cat => cat.status === 'active') 
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3);

    const finalCategoryItems: Record<string, IMenu[]> = {};
    sortedCategories.forEach(cat => {
      finalCategoryItems[cat.id] = catStats[cat.id].items
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 4);
    });

    return {
      topCategories: sortedCategories,
      categoryItems: finalCategoryItems
    };
  }, [menus]);
  
  useEffect(() => {
    if (processedData.topCategories.length > 0 && !activeTab) {
      setActiveTab(processedData.topCategories[0].id);
    }
  }, [processedData, activeTab]);

  return (
    <section className='bg-[#F4F1EA]'>
      <div className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        
        {/* Header & Category Tabs */}
        <div className="flex flex-col md:flex-row justify-between md:items-start mb-12 gap-6">
          <div className='text-center md:text-start'>
            <p className="superTitle text-primary">About Our Food</p>
            <h2 className="secTitle">Hot Delicious Item</h2>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
            {processedData.topCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 md:px-8 py-2 rounded-full border transition-all duration-300 font-semibold ${
                  activeTab === cat.id 
                  ? 'bg-primary text-white border-primary' 
                  : 'border-gray-200 text-gray-600 hover:border-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-18">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
          ) : (
            processedData.categoryItems[activeTab || '']?.map((item: any) => (
              <div key={item._id} className="flex flex-col items-center text-center group">
                <div className="relative w-40 h-40 mb-6 overflow-hidden rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-500 shadow-lg">
                  <Image 
                    src={item.image?.url || '/fallback-food.png'} 
                    alt={item.title}
                    fill
                    sizes="(max-width: 220px) 128px, 160px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <h4 className="subTitle mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
              </div>
            ))
          )}
        </div>
        {/* comment */}
        {!isLoading && processedData.topCategories.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No highly rated items found.
          </div>
        )}
      </div>
    </section>
  );
};

export default HotDeliciousItem;