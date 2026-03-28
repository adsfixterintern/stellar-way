/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, X, ShoppingBag, Clock, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SingleHero from "@/components/shared/SingleHero";
import { toast, Toaster } from "react-hot-toast";
import { getMyOrdersFromDB } from "@/app/modules/order/order.api";
import { useSession } from "next-auth/react";

const CartPage = () => {

  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const [unpaidOrders, setUnpaidOrders] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectedItems(cartItems.map((item) => item._id));
    }

    if (userEmail) {
      getMyOrdersFromDB(userEmail).then((res) => {
        if (res.success) {
          const unpaid = res.data.filter((order: any) => order.paymentStatus === "unpaid");
          setUnpaidOrders(unpaid);
        }
      });
    }
    setIsLoaded(true);
  }, [userEmail, cartItems.length]);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const filteredItems = cartItems.filter((item) => selectedItems.includes(item._id));
  const subtotal = filteredItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = filteredItems.length > 0 ? 10 : 0;
  const grandTotal = subtotal + taxes;

  const handleProceedToCheckout = () => {
    if (filteredItems.length === 0) return toast.error("Please select at least one item!");
    localStorage.setItem("temp_checkout", JSON.stringify(filteredItems));
    localStorage.removeItem("pending_order_id");
    router.push("/checkout");
  };

  const handleExistingOrderPayment = (order: any) => {
    const itemsToCheckout = order.items.map((item: any) => ({
      _id: item.menuId?._id || item.menuId,
      name: item.menuId?.name || item.menuId?.title || "Food Item",
      price: item.price,
      quantity: item.quantity,
      image: item.menuId?.image || ""
    }));

    localStorage.setItem("temp_checkout", JSON.stringify(itemsToCheckout));
    localStorage.setItem("pending_order_id", order._id);
    setSelectedOrderDetails(null);
    router.push("/checkout");
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-white min-h-screen pb-20 relative font-sans">
      <Toaster position="top-center" />
      <SingleHero 
        subtitle="CART" 
        title="Your Cart" 
        description="Review your selected items and proceed to checkout when you're ready."
        isCenter={true} 
      />

      <div className="max-w-7xl mx-auto px-4 mt-20">
        
        {/* Unpaid Orders Section */}
        {unpaidOrders.length > 0 && (
          <div className="mb-12 p-8 bg-[#f8faf7] rounded-[40px] border border-[#e8f0e5] shadow-sm">
            <h3 className="text-[11px] font-black text-[#1A4E11] uppercase tracking-[3px] mb-6 flex items-center gap-2">
              <Clock size={16} /> Pending Unpaid Orders
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {unpaidOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrderDetails(order)}
                  className="min-w-[280px] bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#1A4E11]/20 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {order.transactionId.slice(-8)}</span>
                    <div className="p-2 bg-[#f8faf7] rounded-full text-[#1A4E11] group-hover:bg-[#1A4E11] group-hover:text-white transition-colors">
                       <Eye size={14} />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#1A4E11]">৳{order.totalPrice.toFixed(2)}</p>
                  <p className="text-[10px] text-red-400 font-black uppercase mt-2 tracking-tighter">Click to complete payment</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-5xl font-black text-[#1D3A15] mb-10 tracking-tight">My Cart</h2>
        
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-8 bg-[#FAFAFA] p-6 rounded-3xl border border-gray-50">
            <div className="flex items-center gap-4">
                <input 
                    type="checkbox" 
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={() => {
                        if(selectedItems.length === cartItems.length) setSelectedItems([]);
                        else setSelectedItems(cartItems.map(i => i._id));
                    }}
                    className="w-6 h-6 accent-[#1D3A15] cursor-pointer"
                />
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Selected ({selectedItems.length}/{cartItems.length})
                </span>
            </div>
            <button 
                onClick={clearCart}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
            >
                <Trash2 size={16}/> Clear Bag
            </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-24 bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
            <ShoppingBag size={64} className="text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-gray-400">Your shopping bag is empty</h3>
            <Link href="/menu" className="mt-8 bg-[#1D3A15] text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[3px] hover:scale-105 transition-transform shadow-lg shadow-[#1D3A15]/20">
              Explore Our Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="group bg-[#FAFAFA] rounded-[35px] p-6 flex gap-6 items-center border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-2xl transition-all duration-500"
                >
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item._id)} 
                    onChange={() => toggleSelectItem(item._id)}
                    className="w-6 h-6 accent-[#1D3A15] cursor-pointer"
                  />
                  <div className="relative w-32 h-32 rounded-[25px] overflow-hidden bg-white shadow-inner shrink-0">
                    <Image 
                      src={(typeof item.image === 'string' ? item.image : item.image?.url) || "/placeholder.jpg"} 
                      alt={"Food"} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black text-gray-800 leading-tight">{ item.title}</h3>
                        <div className="flex gap-2 mt-2">
                           <span className="text-[9px] font-black text-white bg-[#1D3A15] px-2.5 py-1 rounded-full uppercase tracking-widest">{item.size || "Standard"}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-2xl font-black text-[#1D3A15]">৳{(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center gap-5 bg-white rounded-2xl border border-gray-100 px-4 py-2 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)} 
                          className="text-gray-400 hover:text-[#1D3A15] transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-lg font-black min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)} 
                          className="text-gray-400 hover:text-[#1D3A15] transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-[45px] p-10 shadow-xl shadow-gray-100/50 sticky top-24">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-[3px] mb-10 border-b border-gray-50 pb-4">Order Summary</h3>
                
                <div className="space-y-6 pb-8">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-800 font-black">৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Taxes & Fees</span>
                    <span className="text-gray-800 font-black">৳{taxes.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-10 border-t border-gray-50">
                  <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Total Amount</span>
                  <span className="text-4xl font-black text-[#1D3A15] tracking-tighter">৳{grandTotal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  disabled={filteredItems.length === 0}
                  className="w-full bg-[#1D3A15] text-white py-6 rounded-[25px] font-black uppercase tracking-[4px] shadow-lg shadow-[#1D3A15]/20 hover:bg-black hover:shadow-2xl transition-all disabled:bg-gray-200 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Checkout Now
                </button>
                
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-6 tracking-widest">
                  Secure Checkout Process
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Unpaid Orders */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[45px] p-10 shadow-2xl relative animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-[#1D3A15]">Resume Payment</h3>
              <button 
                onClick={() => setSelectedOrderDetails(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-8 scrollbar-hide">
              {selectedOrderDetails.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-5 bg-[#FAFAFA] rounded-2xl border border-gray-100">
                  <div>
                    <span className="block text-sm font-black text-gray-800">{item.menuId?.name || "Food Item"}</span>
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-base font-black text-[#1D3A15]">৳{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleExistingOrderPayment(selectedOrderDetails)} 
              className="w-full bg-[#1D3A15] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[4px] hover:bg-black transition-all shadow-lg"
            >
                Pay ৳{selectedOrderDetails.totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;