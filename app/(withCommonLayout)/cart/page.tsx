"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, X, ShoppingBag } from "lucide-react";
import { ICartItem } from "@/types/menu";

const CartPage = () => {
  const [discountCode, setDiscountCode] = useState("");

  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const savedCart = localStorage.getItem("cart");
      const parsedData = savedCart ? JSON.parse(savedCart) : [];
      setCartItems(parsedData);
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
    const confirmDelete = confirm("Are you sure you want to clear your cart?");
    if (confirmDelete) {
      updateCart([]);
    }
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxes = cartItems.length > 0 ? 10 : 0;
  const deliveryFee = 0;
  const grandTotal = subtotal + taxes + deliveryFee;

  if (!isLoaded) return null;

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-secondary p-10 rounded-full mb-6 text-primary">
          <ShoppingBag size={80} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-3">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          It looks like you haven&apos;t added any delicious items to your cart
          yet.
        </p>
        <Link
          href="/"
          className="bg-primary text-white px-10 py-4 rounded-2xl hover:bg-opacity-90 transition-all font-bold shadow-lg"
        >
          Go Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-10">My Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="w-5 h-5 rounded cursor-pointer"
                />
                <span className="text-gray-700 font-semibold text-lg">
                  {cartItems.length} {cartItems.length > 1 ? "Items" : "Item"}{" "}
                  Selected
                </span>
              </div>
              <div className="flex gap-6">
                <button
                onClick={clearCart}
                className=" text-red-500  bg-red-100 hover:bg-red-50 px-3 rounded-full  transition-all"
              >
                <Trash2 size={16} />
              </button>
              <button className="py-2 px-3 rounded-xl border">Move to Wishlist</button>
              </div>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-white border border-gray-100 shadow-sm rounded-3xl p-5 flex gap-6 items-center hover:shadow-md transition-all"
                >
                  <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-2xl overflow-hidden bg-secondary shrink-0 shadow-inner">
                    <Image
                      src={item.image.url}
                      alt={item.title}
                      fill
                      sizes="150px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-300 hover:text-red-500 hover:rotate-90 transition-all duration-300"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <p className="text-xl text-gray-900 mt-2">
                      ৳{item.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1 mb-2">
                      Standard Portion | Freshly Prepared
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-50 border border-gray-200 w-fit rounded-xl gap-1">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 hover:text-primary transition-all"
                        >
                          <Minus size={18} />
                        </button>
                        <span className="font-bold min-w-8 text-center text-lg text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 hover:text-primary transition-all"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Summary Card */}
          <div className="lg:col-span-1">
  <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 sticky top-10">
    <div className="space-y-4">
      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-medium">Subtotal</span>
        <span className="text-gray-900 font-bold text-lg">
          ৳{subtotal.toFixed(2)}
        </span>
      </div>

      {/* Promo Code Section */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Enter Discount Code</p>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-12">
          <input
            type="text"
            placeholder="FLAT50"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="grow px-4 py-2 text-gray-700 focus:outline-none bg-transparent h-full"
          />
          <button className="bg-[#1D3A15] text-white px-6 h-full font-semibold text-sm hover:bg-opacity-90 transition-all uppercase tracking-wider">
            Apply
          </button>
        </div>
      </div>

      {/* Taxes & Delivery */}
      <div className="pt-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Taxes</span>
          <span className="text-gray-900 font-bold">৳{taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Delivery Fee</span>
          <span className="text-gray-900 font-bold uppercase tracking-tighter">
            Free
          </span>
        </div>
      </div>

      <hr className="border-gray-100 my-4" />

      {/* Grand Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-600 font-medium text-lg">Grand Total</span>
        <span className="text-gray-900 font-extrabold text-xl">
          ৳{grandTotal.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <button className="w-full bg-white border border-gray-300 text-gray-800 py-3.5 rounded-lg font-bold text-base hover:bg-gray-50 transition-all shadow-sm">
        Proceed to Checkout
      </button>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
