/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useRef } from "react";
// import Image from "next/image";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import { ArrowLeft, ArrowRight, ShoppingCart, Star } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";

// import { useMenu } from "@/app/hooks/useMenu";
// import { useCategories } from "@/app/hooks/useCategories";
// import { IMenu, IReview } from "@/types/menu";
// import { ICategory } from "@/types/category";
// import { SkeletonCard } from "../shared/SkeletonCard";
// import Link from "next/link";

// const OurExquisiteMenu = () => {
//   const [activeCategoryId, setActiveCategoryId] = useState<string>("All");
//   const { data: categories = [] } = useCategories();
//   const { data: allMenus, isLoading } = useMenu();

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const swiperRef = useRef<any>(null);

//   const getAverageRating = (reviews: IReview[]) => {
//     if (!reviews || reviews.length === 0) return 0;
//     return (
//       reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
//       reviews.length
//     );
//   };

//   const filteredMenus =
//     activeCategoryId === "All"
//       ? allMenus
//       : allMenus?.filter(
//           (item: IMenu) => item.categoryId?._id === activeCategoryId,
//         );

//   const handlePrev = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slideTo(swiperRef.current.activeIndex - 4);
//     }
//   };

//   const handleNext = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slideTo(swiperRef.current.activeIndex + 4);
//     }
//   };

//   return (
//     <section className="bg-secondary py-16 px-4 md:px-16">
//       <div className="max-w-7xl mx-auto">
//         <div className=" mb-10 ">
//           <div className="text-center md:text-left">
//             <p className="superTitle mb-4">Our Menu</p>
//             <h2 className="secTitle text-primary">Our Exquisite Menu</h2>
//           </div>
//         </div>

//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 ">
//           <div className="flex gap-4 md:gap-8 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200">
//             <button
//               onClick={() => setActiveCategoryId("All")}
//               className={`whitespace-nowrap pb-2 text-lg font-semibold transition-all ${
//                 activeCategoryId === "All"
//                   ? "text-primary border-b-2 border-primary"
//                   : "text-gray-400"
//               }`}
//             >
//               All
//             </button>
//             {categories.map((cat: ICategory) => (
//               <button
//                 key={cat._id}
//                 onClick={() => setActiveCategoryId(cat._id)}
//                 className={`whitespace-nowrap pb-2 text-lg font-semibold transition-all ${
//                   activeCategoryId === cat._id
//                     ? "text-primary border-b-2 border-primary"
//                     : "text-gray-400"
//                 }`}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>

//           <div className="hidden md:flex gap-4 pb-2">
//             <button
//               onClick={handlePrev}
//               className="p-3 rounded-lg border border-gray-400 hover:bg-gray-200 transition-all text-primary"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <button
//               onClick={handleNext}
//               className="p-3 rounded-lg bg-primary text-white hover:opacity-90 transition-all"
//             >
//               <ArrowRight size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Swiper Slider */}
//         <div className="relative">
//           <Swiper
//             key={activeCategoryId}
//             onBeforeInit={(swiper) => {
//               swiperRef.current = swiper;
//             }}
//             modules={[Navigation]}
//             spaceBetween={20}
//             slidesPerView={4}
//             slidesPerGroup={1}
//             breakpoints={{
//               320: { slidesPerView: 1, slidesPerGroup: 1 },
//               768: { slidesPerView: 2, slidesPerGroup: 1 },
//               1024: { slidesPerView: 4, slidesPerGroup: 1 },
//             }}
//             className="px-2 py-20"
//           >
//             {isLoading
//               ? Array.from({ length: 4 }).map((_, i) => (
//                   <SwiperSlide key={i}>
//                     <SkeletonCard />
//                   </SwiperSlide>
//                 ))
//               : filteredMenus?.map((item: IMenu) => {
//                   const avgRating = getAverageRating(item.reviews);
//                   return (
//                     <SwiperSlide key={item._id} className="h-auto">
//                       <div className="bg-white p-6 rounded-3xl flex flex-col items-center text-center shadow-sm relative mt-20 h-102">
//                         <div className="absolute -top-16 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white z-20">
//                           <Image
//                             src={item.image?.url || "/fallback-food.png"}
//                             alt={item.title}
//                             fill
//                             sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
//                             className="object-cover"
//                           />
//                         </div>

//                         <div className="mt-20 flex flex-col grow w-full">
//                           <h4 className="cardTitle text-primary mb-2">
//                             {item.title}
//                           </h4>

//                           <div className="flex gap-1 mb-3 items-center justify-center">
//                             {[...Array(5)].map((_, i) => (
//                               <span
//                                 key={i}
//                                 className={
//                                   i < Math.round(avgRating)
//                                     ? "text-yellow-400"
//                                     : "text-gray-300"
//                                 }
//                               >
//                                 <Star size={16} fill="currentColor" />
//                               </span>
//                             ))}
//                             <span className="text-gray-400 text-sm ml-2">
//                               ({item.reviews?.length || 0})
//                             </span>
//                           </div>

//                           <p className=" py-4 menuDescription ">
//                             <span className="text-primary">
//                               Delight in a crispy mixed pizza, topped with fresh
//                               veggies, savory meats, and melty cheese.
//                             </span>
//                           </p>

//                           <div className="flex items-center justify-between w-full mt-auto pt-4">
//                             <span className="price font-bold pt-6">
//                               ৳{item.price?.toFixed(2)}
//                             </span>
//                             <Link href="/cart">
//                             <button className="bg-primary p-2 rounded-lg text-white hover:opacity-90 transition-all">
//                               <ShoppingCart size={20} />
//                             </button>
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     </SwiperSlide>
//                   );
//                 })}
//           </Swiper>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default OurExquisiteMenu;

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation"; // useRouter ইম্পোর্ট করুন

import "swiper/css";
import "swiper/css/navigation";

import { useMenu } from "@/app/hooks/useMenu";
import { useCategories } from "@/app/hooks/useCategories";
import { IMenu, IReview } from "@/types/menu";
import { ICategory } from "@/types/category";
import { SkeletonCard } from "../shared/SkeletonCard";

const OurExquisiteMenu = () => {
  const router = useRouter(); // router ইনিশিয়ালাইজ করুন
  const [activeCategoryId, setActiveCategoryId] = useState<string>("All");
  const { data: categories = [] } = useCategories();
  const { data: allMenus, isLoading } = useMenu();


  const swiperRef = useRef<any>(null);

  // --- Cart Logic Start ---
  const addToCart = (item: IMenu) => {
    // ১. আগের কার্ট ডাটা গেট করা
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

    // ২. চেক করা আইটেমটি অলরেডি আছে কিনা
    const isExist = existingCart.find((cartItem: any) => cartItem._id === item._id);

    let updatedCart;
    if (isExist) {
      // থাকলে কোয়ান্টিটি বাড়ানো
      updatedCart = existingCart.map((cartItem: any) =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      // না থাকলে নতুন অবজেক্ট হিসেবে পুশ করা
      updatedCart = [
        ...existingCart,
        {
          _id: item._id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: 1,
          size: "Medium", // ডিফল্ট সাইজ
        },
      ];
    }

    // ৩. LocalStorage-এ সেভ করা
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // ৪. কার্ট পেজে পাঠিয়ে দেয়া
    router.push("/cart");
  };
  // --- Cart Logic End ---

  const getAverageRating = (reviews: IReview[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / reviews.length;
  };

  const filteredMenus = activeCategoryId === "All"
    ? allMenus
    : allMenus?.filter((item: IMenu) => item.categoryId?._id === activeCategoryId);

  const handlePrev = () => swiperRef.current?.slideTo(swiperRef.current.activeIndex - 4);
  const handleNext = () => swiperRef.current?.slideTo(swiperRef.current.activeIndex + 4);

  return (
    <section className="bg-secondary py-16 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section (Same as before) */}
        <div className="text-center md:text-left mb-10">
          <p className="superTitle mb-4">Our Menu</p>
          <h2 className="secTitle text-primary">Our Exquisite Menu</h2>
        </div>

        {/* Categories & Navigation (Same as before) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex gap-4 md:gap-8 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200">
            {/* Category Buttons... */}
            <button onClick={() => setActiveCategoryId("All")} className={`whitespace-nowrap pb-2 text-lg font-semibold ${activeCategoryId === "All" ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}>All</button>
            {categories.map((cat: ICategory) => (
              <button key={cat._id} onClick={() => setActiveCategoryId(cat._id)} className={`whitespace-nowrap pb-2 text-lg font-semibold ${activeCategoryId === cat._id ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}>{cat.name}</button>
            ))}
          </div>
          <div className="hidden md:flex gap-4 pb-2">
            <button onClick={handlePrev} className="p-3 rounded-lg border border-gray-400 text-primary"><ArrowLeft size={20} /></button>
            <button onClick={handleNext} className="p-3 rounded-lg bg-primary text-white"><ArrowRight size={20} /></button>
          </div>
        </div>

        <div className="relative">
          <Swiper
            key={activeCategoryId}
            onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{ 320: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
            className="px-2 py-20"
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SwiperSlide key={i}><SkeletonCard /></SwiperSlide>)
            ) : (
              filteredMenus?.map((item: IMenu) => (
                <SwiperSlide key={item._id}>
                  <div className="bg-white p-6 rounded-3xl flex flex-col items-center text-center shadow-sm relative mt-20 h-102">
                    <div className="absolute -top-16 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white z-20">
                      <Image src={item.image?.url || "/fallback-food.png"} alt={item.title} fill sizes="160px" className="object-cover" />
                    </div>

                    <div className="mt-20 flex flex-col grow w-full">
                      <h4 className="cardTitle text-primary mb-2">{item.title}</h4>
                      {/* Rating Section... */}
                      <div className="flex gap-1 mb-3 justify-center">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className={i < Math.round(getAverageRating(item.reviews)) ? "text-yellow-400" : "text-gray-300"} />)}
                      </div>

                      <p className="py-4 menuDescription text-primary">Delight in a crispy mixed pizza, topped with fresh veggies, savory meats, and melty cheese.</p>

                      <div className="flex items-center justify-between w-full mt-auto pt-4">
                        <span className="price font-bold pt-6">৳{item.price?.toFixed(2)}</span>
                        
                        {/* বাটনটি আপডেট করা হয়েছে */}
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-primary p-2 rounded-lg text-white hover:opacity-90 transition-all"
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default OurExquisiteMenu;
