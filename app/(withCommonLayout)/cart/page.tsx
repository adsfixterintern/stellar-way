"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, X, ShoppingBag } from "lucide-react";
import { ICartItem } from "@/types/menu";
import SingleHero from "@/components/shared/SingleHero";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  useEffect(() => {
    const loadData = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  const updateCart = (updatedCart: ICartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      updateCart([]);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxes = cartItems.length > 0 ? 10 : 0;
  const grandTotal = subtotal + taxes;

  if (!isLoaded) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <SingleHero
        subtitle="Cart"
        title="Your Cart"
        description="Review Your Selected Items And Proceed To Checkout When You're Ready."
        buttonTitle=""
        buttonLink=""
        isCenter={true}
      />

      <div className="max-w-7xl mx-auto px-3 mt-16">
        <h2 className="text-5xl font-bold text-[#1D3A15] mb-12">My Cart</h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="bg-gray-50 p-10 rounded-full mb-6 text-gray-300">
              <ShoppingBag size={80} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-bold text-gray-400">
              Your cart is empty
            </h3>
            <Link
              href="/"
              className="mt-4 text-primary font-bold hover:underline"
            >
              Go back to shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Side: Cart Items List */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="w-5 h-5 accent-[#1D3A15] rounded cursor-pointer"
                  />
                  <span className="text-gray-700 font-semibold text-lg">
                    {cartItems.length}/{cartItems.length} Items Selected
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={clearCart}
                    className="p-2 bg-pink-50 text-red-500 rounded-full hover:bg-red-100 transition-all border border-pink-100"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-tight transition-all">
                    Move to Wishlist
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="relative bg-white border border-gray-100 rounded-2xl p-4 flex gap-6 items-center shadow-sm group"
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={item.image.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="grow">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-gray-300 hover:text-red-500 transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ৳{item.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 mb-4 uppercase">
                        Size:{" "}
                        <span className="text-gray-600 font-bold">
                          {item.size || "Medium"}
                        </span>
                      </p>

                      <div className="flex items-center border border-gray-200 w-fit rounded-lg px-1 py-1 gap-4">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="p-1 text-gray-400 hover:text-primary transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-sm min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="p-1 text-gray-400 hover:text-primary transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Order Summary (Exact Match) */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 sticky top-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-gray-900 font-bold text-lg">
                      ৳{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2 font-medium">
                      Enter Discount Code
                    </p>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-12">
                      <input
                        type="text"
                        placeholder="FLAT50"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        className="grow px-4 py-2 text-gray-700 focus:outline-none bg-transparent h-full text-sm font-semibold"
                      />
                      <button className="bg-[#1D3A15] text-white px-6 h-full font-bold text-xs hover:bg-opacity-90 transition-all uppercase tracking-wider">
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">Taxes</span>
                      <span className="text-gray-900 font-bold">
                        ৳{taxes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">
                        Delivery Fee
                      </span>
                      <span className="text-gray-900 font-bold uppercase tracking-tighter">
                        Free
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-100 my-4" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-600 font-medium text-lg">
                      Grand Total
                    </span>
                    <span className="text-gray-900 font-extrabold text-xl">
                      ৳{grandTotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <Link href="/checkout" className="block w-full">
                    <button className="w-full bg-white border border-gray-300 text-gray-800 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
