/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, X, ShoppingBag, Clock, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext"; // Context Import
import SingleHero from "@/components/shared/SingleHero";
import { toast, Toaster } from "react-hot-toast";
import { getMyOrdersFromDB } from "@/app/modules/order/order.api";
import { useSession } from "next-auth/react";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
  const [unpaidOrders, setUnpaidOrders] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  // Initial select all items
  useEffect(() => {
    setSelectedItems(cartItems.map(item => item._id));
  }, [cartItems.length]);

  useEffect(() => {
    if (userEmail) {
      getMyOrdersFromDB(userEmail).then(res => {
        if (res.success) {
          setUnpaidOrders(res.data.filter((o: any) => o.paymentStatus === "unpaid"));
        }
      });
    }
  }, [userEmail]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredItems = cartItems.filter(item => selectedItems.includes(item._id));
  const taxes = filteredItems.length > 0 ? 10 : 0;
  const grandTotal = filteredItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + taxes;

  const handleProceedToCheckout = () => {
    if (filteredItems.length === 0) return toast.error("Please select items!");
    localStorage.setItem("temp_checkout", JSON.stringify(filteredItems));
    localStorage.removeItem("pending_order_id");
    router.push("/checkout");
  };

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      <Toaster position="top-center" />
      <SingleHero subtitle="CART" title="Your Cart" isCenter={true} />

      <div className="max-w-7xl mx-auto px-4 mt-20">
        {unpaidOrders.length > 0 && (
          <div className="mb-12 p-6 bg-[#f8faf7] rounded-[30px] border border-[#e8f0e5]">
            <h3 className="text-[10px] font-black text-[#1A4E11] uppercase tracking-[3px] mb-4 flex items-center gap-2">
              <Clock size={14} /> Pending Unpaid Orders
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {unpaidOrders.map((order) => (
                <div key={order._id} onClick={() => setSelectedOrderDetails(order)} className="min-w-[260px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400">ID: {order.transactionId.slice(-6)}</span>
                    <Eye size={14} className="text-gray-300 group-hover:text-[#1A4E11]" />
                  </div>
                  <p className="text-xl font-black text-[#1A4E11] mt-2">৳{order.totalPrice.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-5xl font-black text-[#1D3A15] mb-4">My Cart</h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-20 bg-gray-50 rounded-[40px]">
            <ShoppingBag size={60} className="text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Your cart is empty</h3>
            <Link href="/" className="mt-4 text-[#1D3A15] font-black uppercase tracking-widest hover:underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart List */}
            <div className="lg:col-span-2 space-y-5">
              {cartItems.map((item) => (
                <div key={item._id} className="group bg-[#FAFAFA] rounded-[30px] p-5 flex gap-6 items-center border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-xl transition-all">
                  <input type="checkbox" checked={selectedItems.includes(item._id)} onChange={() => toggleSelectItem(item._id)} className="w-5 h-5 accent-[#1D3A15] cursor-pointer" />
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-sm shrink-0">
                    <Image src={(typeof item.image === 'string' ? item.image : item.image?.url) || "/placeholder.jpg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">{item.title}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-wider">Size: {item.size}</p>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-red-500"><X size={22} /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xl font-black text-[#1D3A15]">৳{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-1.5">
                        <button onClick={() => updateQuantity(item._id, -1)} className="p-1.5 text-gray-300 hover:text-[#1D3A15]"><Minus size={14} /></button>
                        <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="p-1.5 text-gray-300 hover:text-[#1D3A15]"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm sticky top-10">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-[2px] mb-8">Summary</h3>
                <div className="space-y-5 pb-8 border-b border-gray-50">
                  <div className="flex justify-between text-sm font-bold text-gray-400"><span>Subtotal</span><span className="text-gray-800">৳{grandTotal - taxes}</span></div>
                  <div className="flex justify-between text-sm font-bold text-gray-400"><span>Taxes</span><span className="text-gray-800">৳{taxes}</span></div>
                </div>
                <div className="flex justify-between items-center py-8">
                  <span className="text-gray-400 font-bold uppercase text-xs">Total Amount</span>
                  <span className="text-3xl font-black text-[#1D3A15]">৳{grandTotal.toFixed(2)}</span>
                </div>
                <button onClick={handleProceedToCheckout} className="w-full bg-white border-2 border-[#1D3A15] text-[#1D3A15] hover:bg-[#1D3A15] hover:text-white py-5 rounded-[20px] font-black uppercase tracking-[3px] transition-all">Checkout Now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;