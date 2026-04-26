/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight, ShoppingCart } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import popularBg from "@/assets/img/popularItem_bg.png";
import SingleHero from "@/components/shared/SingleHero";
import { ICategory } from "@/types/category";
import { IMenu } from "@/types/menu";
import { getMenus } from "@/app/api/menuApi";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { getAllCategoriesApi } from "@/app/modules/category/category.api";

const MenuPage = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [menuItems, setMenuItems] = useState<IMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [catRes, menuData] = await Promise.all([
        getAllCategoriesApi(), 
        getMenus(),
      ]);

      setCategories(catRes.data || []); 
      setMenuItems(menuData);
    } catch (error) {
      console.error("Failed to fetch menu data", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);


  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen pb-20">
        <SingleHero
          subtitle="MENU"
          title="Our Exquisite Menu"
          description="Enjoy Savory Nest From The Comfort Of Your Home"
          buttonTitle=""
          buttonLink=""
          isCenter={true}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="space-y-16">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-8 bg-gray-100 w-48 mb-10 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((j) => (
                    <SkeletonCard key={j} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-10">
      <SingleHero
        subtitle="MENU"
        title="Our Exquisite Menu"
        description="Enjoy Savory Nest From The Comfort Of Your Home"
        buttonTitle=""
        buttonLink=""
        isCenter={true}
      />

      {/* Popular Categories Section */}
      <div
        className="py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(228, 245, 220, 0.9), rgba(228, 245, 220, 0.9)), url(${popularBg.src})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-left">
              <p className="superTitle">customer favorites</p>
              <h2 className="secTitle mt-2">Popular Categories</h2>
            </div>

            {/* Category Swiper Navigation */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="popular-prev p-2 rounded-lg border border-gray-400 text-primary hover:bg-primary hover:text-white transition">
                <ArrowLeft size={20} />
              </button>
              <button className="popular-next p-2 rounded-lg bg-primary text-white hover:bg-opacity-90 transition">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              prevEl: ".popular-prev",
              nextEl: ".popular-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {categories.map((cat) => {
              const categoryItems = menuItems.filter((item) => {
                const id =
                  typeof item.categoryId === "object"
                    ? (item.categoryId as any)?._id
                    : String(item.categoryId);
                return id === cat._id;
              });

              const firstItemImage = categoryItems[0]?.image?.url;
              const itemCount = categoryItems.length;

              return (
                <SwiperSlide key={cat._id}>
                  <div
                    onClick={() => scrollToCategory(cat._id)}
                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center cursor-pointer hover:-translate-y-2 mb-5"
                  >
                    <div className="relative w-32 h-32 mb-6">
                      <Image
                        src={firstItemImage || "/placeholder.png"}
                        alt={cat.name}
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <h3 className="nameText text-xl">{cat.name}</h3>
                    <p className="designationText mt-1">
                      ({itemCount} {itemCount > 1 ? "Items" : "Item"})
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center mb-16">
          <p className="superTitle">our menu</p>
          <h2 className="secTitle mt-2">Our Exquisite Menu</h2>
        </div>

        <div className="space-y-3">
          {categories.map((category) => {
            const filteredItems = menuItems.filter((item) => {
              if (!item || !item.categoryId) return false;

              const itemCatId =
                typeof item.categoryId === "object"
                  ? (item.categoryId as any)?._id
                  : String(item.categoryId);

              return itemCatId === category._id;
            });

            if (filteredItems.length === 0) return null;

            return (
              <div
                key={category._id}
                id={category._id}
                className="relative mb-3 scroll-mt-24"
              >
                <div className="flex justify-between items-center mb-10">
                  <p className="subTitle text-primary">{category.name}</p>
                  <div className="flex gap-3">
                    <button
                      className={`prev-${category._id} p-2 rounded-lg border border-gray-400 text-primary hover:bg-primary hover:text-white transition`}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <button
                      className={`next-${category._id} p-2 rounded-lg bg-primary text-white hover:bg-opacity-90 transition`}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>

                <Swiper
                  modules={[Navigation]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={{
                    prevEl: `.prev-${category._id}`,
                    nextEl: `.next-${category._id}`,
                  }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                >
                  {filteredItems.map((item) => (
                    <SwiperSlide key={item._id}>
                      <Link href={`/menu/${item._id}`}>
                        <div className="group relative mb-20">
                          <div className="relative h-85 w-full rounded-2xl overflow-hidden shadow-sm">
                            <Image
                              src={item.image?.url || ""}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  // e.stopPropagation();
                                  const title = addToCart(item);
                                  toast.success(`${title} added to cart 🛒`, {
                                    duration: 1500,
                                  });
                                }}
                                className="bg-white text-primary p-4 rounded-full hover:scale-110 transition-transform shadow-2xl"
                              >
                                <ShoppingCart size={24} />
                              </button>
                            </div>
                          </div>

                          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[85%] bg-white rounded-2xl p-5 text-center shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-gray-50 z-10 transform group-hover:-translate-y-3 transition-all duration-500">
                            <h4 className="cardTitle mb-1! text-lg line-clamp-1">
                              {item.title}
                            </h4>

                            <p className="menuDescription italic line-clamp-1">
                              {item.chefId
                                ? "Chef Special Recommendation"
                                : "Fresh and Delicious Meals"}
                            </p>

                            <div className="price mb-0! mt-3">
                              ৳{item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
