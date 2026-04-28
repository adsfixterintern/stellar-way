/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  IoArrowBackOutline,
  IoCartOutline,
  IoStar,
  IoCheckmarkCircleOutline,
  IoChatboxEllipsesOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { getSingleMenu } from "@/app/modules/menu/menu.api";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import SingleHero from "@/components/shared/SingleHero";

const MenuDetailsPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (typeof id === "string") {
          const data = await getSingleMenu(id);
          setItem(data);
        }
      } catch (error) {
        console.error("Failed to fetch menu details", error);
        toast.error("Could not load details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      try {
        addToCart(item);
        toast.success(`${item.title} added to cart`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to add to cart");
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A4E11]"></div>
      </div>
    );

  if (!item)
    return <div className="text-center p-20 font-bold">Item not found!</div>;

  return (
    <div>
      <SingleHero
        subtitle="MENU"
        title="Menu Details"
        description="Culinary Bliss, Delivered. Experience Savory Nest at your own table."
        buttonTitle=""
        buttonLink=""
        isCenter={true}
      />
      <div className="min-h-screen bg-[#FDFDFD] pb-20">
        {/* Navigation Header */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1A4E11] transition-all group"
          >
            <div className="p-2 rounded-lg border border-slate-200 group-hover:bg-[#1A4E11] group-hover:text-white transition-all">
              <IoArrowBackOutline size={20} />
            </div>
            <span className="font-black uppercase text-[11px] tracking-widest text-slate-600">
              Back to Menu
            </span>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Image Section */}
            <div className="relative aspect-square rounded-[8px] overflow-hidden shadow-sm border-8 border-white bg-white group">
              <Image
                src={item.image?.url || "/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              {item.status === "active" && (
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                  <IoCheckmarkCircleOutline
                    className="text-green-600"
                    size={18}
                  />
                  <span className="text-[10px] font-black uppercase text-slate-800 tracking-tighter">
                    Available Now
                  </span>
                </div>
              )}
            </div>

            {/* Right: Content Section */}
            <div className="flex flex-col space-y-8">
              <div>
                <span className="inline-block px-4 py-1.5 bg-green-50 text-[#1A4E11] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                  {item.categoryId?.name || "Category"}
                </span>
                <h1 className="secTitle capitalize">{item.title}</h1>
              </div>

              <p className="text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
                {item.description}
              </p>

              <div className="flex items-end gap-4">
                <span className="price  !font-bold ">৳{item.price}</span>
                <span className="text-slate-400 text-sm font-bold pb-2 uppercase tracking-widest">
                  {item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* Chef Info Card */}
              {item.chefId && (
                <div className="p-1 border border-slate-100 rounded-[8px] bg-white shadow-sm max-w-md">
                  <div className="p-6 flex items-center gap-5">
                    <div className="relative h-20 w-20 rounded-[25px] overflow-hidden shadow-lg border-2 border-white">
                      <Image
                        src={item.chefId.image}
                        alt={item.chefId.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#1A4E11] uppercase tracking-[0.2em] mb-1">
                        Master Chef
                      </p>
                      <h4 className="font-black text-slate-900 text-xl leading-none">
                        {item.chefId.name}
                      </h4>
                      <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-tighter">
                        {item.chefId.speciality}
                      </p>
                    </div>
                    <div className="bg-orange-50 px-3 py-2 rounded-2xl flex flex-col items-center">
                      <IoStar className="text-orange-400" size={16} />
                      <span className="text-xs font-black text-orange-600">
                        {item.chefId.rating}/5
                      </span>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                      "{item.chefId.bio}"
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={item.stock <= 0}
                  className="blockBtn w-full"
                >
                  <IoCartOutline size={20} />
                  Add to Basket
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-24 border-t border-slate-100 pt-16">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-[#1A4E11] text-white rounded-[8px]">
                <IoChatboxEllipsesOutline size={24} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
                  Guest Reviews
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Total {item.reviews?.length || 0} Experiences Shared
                </p>
              </div>
            </div>

            {item.reviews && item.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {item.reviews.map((rev: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-[12px] border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {/* User Avatar - If you have image in API, use rev.userId.image */}
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                          {rev.userId?.image ? (
                            <Image
                              src={rev.userId.image}
                              alt={rev.userId.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <IoPersonCircleOutline size={40} />
                          )}
                        </div>
                        <div>
                          <h5 className="font-black text-slate-800 text-sm">
                            {rev.userId?.name || "Verified Guest"}
                          </h5>
                          <div className="flex gap-0.5 text-orange-400">
                            {[...Array(5)].map((_, i) => (
                              <IoStar
                                key={i}
                                size={12}
                                fill={i < rev.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Date logic: check if createdAt exists in review, otherwise use a default or hide */}
                      {rev.createdAt && (
                        <span className="text-[10px] font-bold text-slate-300 uppercase">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed italic">
                      {rev.comment
                        ? `"${rev.comment}"`
                        : "The user didn't leave a written review, but gave a rating."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[8px] p-20 text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase text-[12px] tracking-[0.3em]">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetailsPage;
