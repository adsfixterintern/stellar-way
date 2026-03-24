"use client";

import React, { useState, useEffect } from "react";
import SingleHero from "@/components/shared/SingleHero";
import { ICartItem } from "@/types/menu";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

 useEffect(() => {
    const loadCheckoutData = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setIsLoaded(true);
    };
    loadCheckoutData();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = cartItems.length > 0 ? 10 : 0;
  const grandTotal = subtotal + taxes;
  if (!isLoaded) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section - Image Match */}
      <SingleHero
        subtitle="Checkout"
        title="Secure Checkout"
        description="Enter Your Details And Confirm Your Order To Enjoy Delicious Meals From Savory Nest."
        buttonTitle=""
        buttonLink=""
        isCenter={true}
      />

      <div className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="text-5xl font-bold text-[#1D3A15] mb-12">Checkout</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side: Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-gray-100 rounded-4xl p-8 shadow-sm space-y-8">
              {/* Contact Section */}
              <section>
                <h3 className="text-xl font-bold mb-6">Contact</h3>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border-b border-gray-200 py-3 focus:outline-none focus:border-[#1D3A15] transition-colors"
                />
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="news" className="accent-[#1D3A15]" />
                  <label htmlFor="news" className="text-sm text-gray-600">Email me with news and offers</label>
                </div>
              </section>

              {/* Address Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-bold">Address</h3>
                <select className="w-full border-b border-gray-200 py-3 focus:outline-none bg-transparent">
                  <option>Bangladesh</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="border-b border-gray-200 py-3 focus:outline-none" />
                  <input type="text" placeholder="Last Name" className="border-b border-gray-200 py-3 focus:outline-none" />
                </div>
                <input type="text" placeholder="House number and street name" className="w-full border-b border-gray-200 py-3 focus:outline-none" />
                <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full border-b border-gray-200 py-3 focus:outline-none" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" placeholder="Town / City" className="border-b border-gray-200 py-3 focus:outline-none" />
                  <input type="text" placeholder="District" className="border-b border-gray-200 py-3 focus:outline-none" />
                  <input type="text" placeholder="Postcode / ZIP" className="border-b border-gray-200 py-3 focus:outline-none" />
                </div>
                <input type="text" placeholder="Phone Number" className="w-full border-b border-gray-200 py-3 focus:outline-none" />
              </section>

              {/* Delivery Section */}
              <section className="space-y-4">
                <h3 className="text-xl font-bold">Delivery</h3>
                <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="delivery" id="free" className="accent-[#1D3A15]" defaultChecked />
                    <label htmlFor="free" className="font-medium">Free Shipping <span className="block text-xs text-gray-400 font-normal">For orders over ৳500</span></label>
                  </div>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <input type="radio" name="delivery" id="standard" className="accent-[#1D3A15]" />
                    <label htmlFor="standard" className="font-medium">Standard Delivery <span className="block text-xs text-gray-400 font-normal">30-40 minutes</span></label>
                  </div>
                  <span className="font-bold">৳80</span>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="space-y-6">
                <h3 className="text-xl font-bold">Payment Method</h3>
                <div className="flex flex-wrap gap-6">
                  {["Credit Card", "Bkash", "Nagad", "Cash On Delivery"].map((method) => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method.toLowerCase().replace(/ /g, "-")}
                        checked={paymentMethod === method.toLowerCase().replace(/ /g, "-")}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#1D3A15]"
                      />
                      <span className="text-sm font-medium">{method}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 mt-4 bg-gray-50/50 p-6 rounded-2xl">
                    <input type="text" placeholder="Cardholder Name" className="w-full border-b border-gray-200 py-3 bg-transparent focus:outline-none" />
                    <input type="text" placeholder="Card Number" className="w-full border-b border-gray-200 py-3 bg-transparent focus:outline-none" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Expiry Date (MM/YY)" className="border-b border-gray-200 py-3 bg-transparent focus:outline-none" />
                      <input type="text" placeholder="CVV" className="border-b border-gray-200 py-3 bg-transparent focus:outline-none" />
                    </div>
                  </div>
                )}
              </section>

              <button className="w-full bg-[#3D5334] text-white py-4 rounded-xl font-bold hover:bg-[#1D3A15] transition-colors shadow-lg">
                Place Order
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                Your Info will be saved to a Shop account. By continuing, you agree to Shop&apos;s Terms of Service and acknowledge the Privacy Policy.
              </p>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sticky top-10 shadow-sm">
              <div className="space-y-6">
                <div className="flex justify-between items-center text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">৳{subtotal.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Enter Discount Code</p>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden h-12">
                    <input
                      type="text"
                      placeholder="FLAT50"
                      className="grow px-4 focus:outline-none text-sm"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button className="bg-[#3D5334] text-white px-6 font-bold text-xs uppercase hover:bg-[#1D3A15]">Apply</button>
                  </div>
                </div>

                <div className="pt-4 space-y-4 border-t border-gray-50">
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span className="text-gray-900 font-bold">৳{taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-gray-900 font-bold uppercase">Free</span>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Grand Total</span>
                  <span className="text-2xl font-black text-gray-900">৳{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;