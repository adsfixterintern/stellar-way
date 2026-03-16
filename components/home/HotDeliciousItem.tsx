// "use client";
// import React, { useState } from 'react';
// import Image from 'next/image';
// import { useMenu } from '@/app/hooks/useMenu';
// import { IMenu } from '@/types/menu';
// import { SkeletonCard } from '../shared/SkeletonCard';

// const categories = ['Chicken Fry', 'Pizza', 'Burger', 'Deserts'];

// const HotDeliciousItem = () => {
//   const [activeTab, setActiveTab] = useState('Chicken Fry');
//   const { menus, isLoading, isFetching } = useMenu(activeTab);

//   return (
//     <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
//       <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
//         <div>
//           <p className="superTitle text-primary">About Our Food</p>
//           <h2 className="secTitle">Hot Delicious Item</h2>
//         </div>

//         {/* Category Tabs */}
//         <div className="flex flex-wrap gap-3">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setActiveTab(cat)}
//               className={`px-8 py-2 rounded-full border transition-all duration-300 font-semibold ${
//                 activeTab === cat 
//                 ? 'bg-primary text-white border-primary' 
//                 : 'border-gray-200 text-gray-600 hover:border-primary'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Grid Display */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//         {isLoading || isFetching
//           ? Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
//           : menus?.slice(0, 4).map((item: IMenu) => (
//               <div key={item._id} className="flex flex-col items-center text-center group cursor-pointer">
//                 {/* Next.js Optimized Image */}
//                 <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-110">
//                   <Image 
//                     src={item.image?.url || '/fallback-food.png'} 
//                     alt={item.title}
//                     fill
//                     sizes="(max-width: 768px) 100vw, 200px"
//                     className="object-cover"
//                     priority={false}
//                   />
//                 </div>
                
//                 <h4 className="subTitle mb-2 group-hover:text-primary transition-colors">
//                   {item.title}
//                 </h4>
//                 <p className="description mb-4">
//                   Perfectly fried chicken with a rich, classic taste.
//                 </p>
//               </div>
//             ))}
//       </div>
//     </section>
//   );
// };




"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useMenu } from '@/app/hooks/useMenu';
import { IMenu } from '@/types/menu';
import { SkeletonCard } from '../shared/SkeletonCard';

const categories = ['Chicken Fry', 'Pizza', 'Burger', 'Deserts'];

const HotDeliciousItem = () => {
  const [activeTab, setActiveTab] = useState('Chicken Fry');
  
  // শুধুমাত্র isLoading নিন। 
  // isLoading শুধু প্রথমবার true হয়। 
  // এরপর auto-refetch এর সময় isFetching true হয়, কিন্তু isLoading false-ই থাকে।
  const { data: menus, isLoading } = useMenu();

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
      {/* Header & Tabs Part */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <p className="superTitle text-primary">About Our Food</p>
          <h2 className="secTitle">Hot Delicious Item</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-2 rounded-full border transition-all duration-300 font-semibold ${
                activeTab === cat 
                ? 'bg-primary text-white border-primary' 
                : 'border-gray-200 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {isLoading ? (
          // শুধুমাত্র প্রথমবার পেজ লোড হলে এটি আসবে
          Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)
        ) : (
          // ডাটা রিফেচ হলেও ইউজার এই লিস্টটিই দেখবে, 
          // নতুন ডাটা আসলে তা নীরবে রিপ্লেস হয়ে যাবে।
          menus?.slice(0, 4).map((item: IMenu) => (
            <div key={item._id} className="flex flex-col items-center text-center group">
              <div className="relative w-48 h-48 mb-6 overflow-hidden rounded-full border-2 border-transparent group-hover:border-primary transition-all duration-500">
                <Image 
                  src={item.image?.url || '/fallback-food.png'} 
                  alt={item.title}
                  fill
                  sizes="200px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <h4 className="subTitle mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="description mb-4">
                Classic taste with fresh ingredients.
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default HotDeliciousItem;

