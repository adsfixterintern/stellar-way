

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, X, ShoppingBag, Clock, Eye } from "lucide-react";
import { ICartItem } from "@/types/menu";
import SingleHero from "@/components/shared/SingleHero";
import { toast, Toaster } from "react-hot-toast";
import { getMyOrdersFromDB } from "@/app/modules/order/order.api";
import { useSession } from "next-auth/react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [unpaidOrders, setUnpaidOrders] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  useEffect(() => {
    const fetchData = async () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        setSelectedItems(parsedCart.map((item: ICartItem, index: number) => item._id || `cart-item-${index}`));
      }

      if (userEmail) {
        try {
          const response = await getMyOrdersFromDB(userEmail);
          if (response.success) {
            const unpaid = response.data.filter((order: any) => order.paymentStatus === "unpaid");
            setUnpaidOrders(unpaid);
          }
        } catch (err) {
          console.error("Error fetching unpaid orders", err);
        }
      }
      setIsLoaded(true);
    };
    fetchData();
  }, [userEmail]);

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
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    updateCart(updatedCart);
  };

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
    <div className="bg-white min-h-screen pb-20 relative">
      <Toaster position="top-center" />
      <SingleHero 
        subtitle="CART" 
        title="Your Cart" 
        description="Review your selected items and proceed to checkout when you're ready." 
        isCenter={true} 
      />

      <div className="max-w-7xl mx-auto px-4 mt-20">
        
        {/* Pending Orders Section */}
        {unpaidOrders.length > 0 && (
          <div className="mb-12 p-6 bg-[#f8faf7] rounded-[30px] border border-[#e8f0e5]">
            <h3 className="text-[10px] font-black text-[#1A4E11] uppercase tracking-[3px] mb-4 flex items-center gap-2">
              <Clock size={14} /> Pending Unpaid Orders
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {unpaidOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrderDetails(order)}
                  className="min-w-[260px] bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#1A4E11] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-gray-400">ID: {order.transactionId.slice(-6)}</span>
                    <Eye size={14} className="text-gray-300 group-hover:text-[#1A4E11]" />
                  </div>
                  <p className="text-xl font-black text-[#1A4E11] mt-2">৳{order.totalPrice.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Click to Pay</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-5xl font-black text-[#1D3A15] mb-4">My Cart</h2>
        
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <input 
                    type="checkbox" 
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={() => {
                        if(selectedItems.length === cartItems.length) setSelectedItems([]);
                        else setSelectedItems(cartItems.map(i => i._id));
                    }}
                    className="w-4 h-4 accent-[#1D3A15] cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {selectedItems.length}/{cartItems.length} Items Selected
                </span>
            </div>
            <div className="flex gap-3">
                <button className="p-2.5 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={18}/>
                </button>
                <button className="px-6 py-2.5 border border-gray-200 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all text-gray-600">
                  Move to Wishlist
                </button>
            </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
            <ShoppingBag size={60} className="text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Your cart is empty</h3>
            <Link href="/" className="mt-4 text-[#1D3A15] font-black text-sm uppercase tracking-widest hover:underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-5">
              {cartItems.map((item, index) => (
                <div 
                  key={item._id || `cart-item-${index}`} 
                  className="group bg-[#FAFAFA] rounded-[30px] p-5 flex gap-6 items-center border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item._id)} 
                    onChange={() => toggleSelectItem(item._id)}
                    className="w-5 h-5 accent-[#1D3A15] cursor-pointer"
                  />
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-sm shrink-0">
                    <Image 
                      src={(typeof item.image === 'string' ? item.image : item.image?.url) || "/placeholder.jpg"} 
                      alt={item.title || "Food"} 
                      fill 
                      sizes="112px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">{item.name || item.title}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-wider">Size: {item.size || "Standard"}</p>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                        <X size={22} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xl font-black text-[#1D3A15]">৳{item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-1.5 shadow-sm">
                        <button 
                          onClick={() => handleQuantityChange(item._id, -1)} 
                          className="p-1.5 text-gray-300 hover:text-[#1D3A15] hover:bg-gray-50 rounded-lg transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item._id, 1)} 
                          className="p-1.5 text-gray-300 hover:text-[#1D3A15] hover:bg-gray-50 rounded-lg transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Checkout Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm sticky top-10">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-[2px] mb-8">Summary</h3>
                
                <div className="space-y-5 pb-8 border-b border-gray-50">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-gray-800">৳{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="py-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase mb-3 tracking-widest">Discount Code</p>
                    <div className="flex gap-2">
                        <input 
                          placeholder="PROMO20" 
                          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs w-full focus:outline-none focus:border-[#1D3A15] transition-all" 
                        />
                        <button className="bg-[#1D3A15] text-white text-[10px] font-black uppercase px-6 rounded-xl hover:bg-black transition-all">
                          Apply
                        </button>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Estimated Taxes</span>
                    <span className="text-gray-800">৳{taxes}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-600 uppercase text-xs">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-8">
                  <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Total Amount</span>
                  <span className="text-3xl font-black text-[#1D3A15]">৳{grandTotal.toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleProceedToCheckout}
                  className="w-full bg-white border-2 border-[#1D3A15] text-[#1D3A15] hover:bg-[#1D3A15] hover:text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-[3px] transition-all duration-300 shadow-lg hover:shadow-[#1D3A15]/20"
                >
                  Checkout Now
                </button>
                
                <p className="text-center text-[9px] text-gray-400 font-bold uppercase mt-6 tracking-widest">
                  Secure Payment Guaranteed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Unpaid Orders */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#1D3A15]"></div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-[#1D3A15]">Review Order</h3>
              <button 
                onClick={() => setSelectedOrderDetails(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-8">
              {selectedOrderDetails.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <span className="block text-xs font-black text-gray-800">{item.menuId?.name || "Food Item"}</span>
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-sm font-black text-[#1D3A15]">৳{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleExistingOrderPayment(selectedOrderDetails)} 
              className="w-full bg-[#1D3A15] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[3px] hover:bg-black transition-all"
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