"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Plus,
  Minus,
  X,
  ShoppingBag,
  Clock,
  Eye,
  ShoppingCart,
} from "lucide-react";
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
        setSelectedItems(parsedCart.map((item: ICartItem) => item._id));
      }

      if (userEmail) {
        try {
          const response = await getMyOrdersFromDB(userEmail);
          if (response.success) {
            const unpaid = response.data.filter(
              (order: any) => order.paymentStatus === "unpaid",
            );
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
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const filteredItems = cartItems.filter((item) =>
    selectedItems.includes(item._id),
  );
  const subtotal = filteredItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxes = filteredItems.length > 0 ? 10 : 0;
  const grandTotal = subtotal + taxes;

  const handleProceedToCheckout = () => {
    if (filteredItems.length === 0)
      return toast.error("Please select at least one item!");
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
      image: item.menuId?.image || "",
    }));

    localStorage.setItem("temp_checkout", JSON.stringify(itemsToCheckout));
    localStorage.setItem("pending_order_id", order._id);
    setSelectedOrderDetails(null);
    router.push("/checkout");
  };

 

  return (
    <div className="bg-white min-h-screen pb-20 relative">
      <Toaster position="top-center" />
      <SingleHero subtitle="Cart" title="Your Cart" isCenter={true} />

      <div className="max-w-7xl mx-auto px-4 mt-16">
        {unpaidOrders.length > 0 && (
          <div className="mb-12 p-8 bg-[#f8faf7] rounded-[40px] border border-[#e8f0e5] shadow-sm">
            <h3 className="text-sm font-bold text-[#3D5334] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={18} className="text-amber-500" /> Pending Unpaid
              Orders
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar">
              {unpaidOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrderDetails(order)}
                  className="min-w-[300px] bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-[#3D5334] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      #{order.transactionId.slice(-8)}
                    </span>
                    <Eye
                      size={16}
                      className="text-gray-300 group-hover:text-[#3D5334]"
                    />
                  </div>
                  <p className="text-2xl font-black text-[#1D3A15]">
                    ৳{order.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 font-bold mt-2">
                    {order.items.length} Items • Pay Now →
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CART CONTENT --- */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center bg-gray-50 rounded-[50px] border-2 border-dashed border-gray-200">
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-[#1D3A15]/5 rounded-full animate-pulse"></div>
              <ShoppingBag
                size={100}
                strokeWidth={1}
                className="text-[#1D3A15]/20 relative"
              />
            </div>

            <h3 className="text-3xl font-black text-[#1D3A15] mb-3">
              Your cart is feeling light!
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-medium">
              It looks like you haven't added any of our delicious skincare or
              items yet. Let's find something special for you.
            </p>

            <Link
              href="/"
              className="bg-[#1D3A15] text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl flex items-center gap-3 active:scale-95"
            >
              <ShoppingCart size={20} />
              START SHOPPING
            </Link>

            {unpaidOrders.length > 0 && (
              <p className="mt-8 text-sm font-bold text-amber-600 flex items-center gap-2">
                <Clock size={16} />
                But you have {unpaidOrders.length} pending orders below!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6"></div>
            <div className="lg:col-span-1">{/* Summary logic */}</div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <ShoppingBag
              size={80}
              strokeWidth={1}
              className="text-gray-100 mb-6"
            />
            <h3 className="text-2xl font-bold text-gray-400">
              Your cart is empty
            </h3>
            <Link
              href="/"
              className="mt-4 text-[#3D5334] font-bold hover:underline"
            >
              Go back to shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`relative bg-white border ${selectedItems.includes(item._id) ? "border-[#1D3A15]" : "border-gray-100"} rounded-[30px] p-5 flex gap-6 items-center shadow-sm transition-all`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[#1D3A15] cursor-pointer"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => toggleSelectItem(item._id)}
                  />
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    <Image
                      src={item.image?.url || item.image || "/placeholder.jpg"}
                      alt="Food"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {item.name || item.title}
                      </h3>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      ৳{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center border border-gray-200 w-fit rounded-xl px-2 py-1 gap-5 mt-4">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="p-1 text-gray-400 hover:text-black"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, 1)}
                        className="p-1 text-gray-400 hover:text-black"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 shadow-sm rounded-[35px] p-8 sticky top-10">
                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-600 font-bold text-lg">
                    Grand Total
                  </span>
                  <span className="text-2xl font-black text-[#1D3A15]">
                    ৳{grandTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-[#1D3A15] text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[45px] p-10 relative">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute right-8 top-8 p-2 bg-gray-50 rounded-full hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold text-[#1D3A15] mb-8">
              Order Breakdown
            </h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-3 mb-8">
              {selectedOrderDetails.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl"
                >
                  <span className="font-bold text-gray-800 text-sm">
                    {item.menuId?.name || item.menuId?.title || "Food Item"} (x
                    {item.quantity})
                  </span>
                  <span className="font-bold text-[#1D3A15]">
                    ৳{(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleExistingOrderPayment(selectedOrderDetails)}
              className="w-full bg-[#3D5334] text-white py-4 rounded-2xl font-bold hover:bg-[#1D3A15] transition-all"
            >
              Complete Payment (৳{selectedOrderDetails.totalPrice.toFixed(2)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
