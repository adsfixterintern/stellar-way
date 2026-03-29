/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import SingleHero from "@/components/shared/SingleHero";
import { ICartItem } from "@/types/menu";
import { toast, Toaster } from "react-hot-toast";
import {
  createSSLOrder,
  createStripeOrder,
} from "@/app/modules/order/order.api";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

const CheckoutPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkoutItems, setCheckoutItems] = useState<ICartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("sslcommerz");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    town: "",
    district: "",
  });

  useEffect(() => {
    const tempCart = localStorage.getItem("temp_checkout");
    if (tempCart) {
      setCheckoutItems(JSON.parse(tempCart));
    } else {
      router.push("/cart");
    }

    if (session?.user) {
      const names = session.user.name?.split(" ") || ["", ""];
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || "",
        firstName: names[0],
        lastName: names.slice(1).join(" "),
      }));
    }
    setIsLoaded(true);
  }, [session, router]);

  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxes = checkoutItems.length > 0 ? 10 : 0;
  const grandTotal = subtotal + taxes;

const handleOrderSubmit = async () => {
  
    if (status !== "authenticated") {
      toast.error("Please login to place an order!");
      return signIn();
    }

    // ২. ফিল্ড ভ্যালিডেশন
    if (!formData.phone || !formData.address || !formData.town) {
      return toast.error("Please fill in Phone, Address and City!");
    }

    // ৩. কার্টে আইটেম আছে কি না চেক
    if (checkoutItems.length === 0) {
      return toast.error("Your cart is empty!");
    }

    const pendingOrderId = localStorage.getItem("pending_order_id");

    // ৪. অর্ডার অবজেক্ট তৈরি
    const orderData = {
      orderId: pendingOrderId || null,
      customerInfo: {
        user: session?.user?.id,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
      },
      phone: formData.phone,
      address: `${formData.address}, ${formData.town}, ${formData.district}`,
      town: formData.town,
      district: formData.district,
      items: checkoutItems.map((item) => ({
        menuId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: grandTotal,
      paymentMethod: paymentMethod === "sslcommerz" ? "SSLCommerz" : "Stripe",
    };

    // ডিবাগিংয়ের জন্য ডাটা কনসোলে প্রিন্ট করা
    console.log("--- Sending Order Data to Backend ---", orderData);

    const loadingToast = toast.loading(
      "Order placing, redirecting to payment gateway...",
    );

    try {
      // ৫. এপিআই কল (SSLCommerz বা Stripe)
      const response =
        paymentMethod === "stripe"
          ? await createStripeOrder(orderData)
          : await createSSLOrder(orderData);

      console.log("--- Backend Response Received ---", response);

      if (response.success && response.data?.paymentUrl) {
        // ৬. মেইন কার্ট থেকে কেনা আইটেমগুলো রিমুভ করা
        const mainCartRaw = localStorage.getItem("cart");
        if (mainCartRaw) {
          const mainCart = JSON.parse(mainCartRaw);
          const remainingCart = mainCart.filter(
            (mainItem: any) =>
              !checkoutItems.some(
                (checkItem) => checkItem._id === mainItem._id,
              ),
          );
          localStorage.setItem("cart", JSON.stringify(remainingCart));
        }

        // ৭. লোকাল স্টোরেজ ক্লিন করা
        localStorage.removeItem("temp_checkout");
        localStorage.removeItem("pending_order_id");

        toast.success("Redirecting to payment...");
        
 
        window.location.href = response.data.paymentUrl;
      } else {
 
        console.warn("Payment Initiation Failed:", response.message);
        toast.error(response.message || "Failed to initiate payment gateway.");
      }
    } catch (error: any) {

      console.error("Critical Payment Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong! Please try again.");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <Toaster position="top-center" />
      <SingleHero
        subtitle="Checkout"
        title="Complete Your Order"
        isCenter={true}
      />

      <div className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="text-5xl font-bold text-[#1D3A15] mb-12">Checkout</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8 border border-gray-100 rounded-[40px] p-10 shadow-sm bg-white relative">
            {status !== "authenticated" && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-[40px] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#1D3A15] p-4 rounded-full mb-4 shadow-lg shadow-[#1D3A15]/20">
                  <Lock className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#1D3A15] mb-2 uppercase tracking-tight">Login Required</h3>
                <p className="text-gray-500 max-w-xs mb-6 font-medium">Please login to your account to provide shipping details and complete payment.</p>
                <button 
                  onClick={() => signIn()}
                  className="bg-[#1D3A15] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-[2px] hover:bg-black transition-all shadow-xl"
                >
                  Sign In Now
                </button>
              </div>
            )}

            <section className="space-y-6">
              <h3 className="text-xl font-bold">Contact & Shipping</h3>
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="border-b py-3 outline-none focus:border-[#1D3A15] transition-all"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="border-b py-3 outline-none focus:border-[#1D3A15] transition-all"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                className="w-full border-b py-3 outline-none opacity-60"
                readOnly
              />
              <input
                type="text"
                placeholder="House No, Road, Area"
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border-b py-3 outline-none focus:border-[#1D3A15]"
              />
              <div className="grid grid-cols-3 gap-6">
                <input
                  type="text"
                  placeholder="City/Town"
                  onChange={(e) =>
                    setFormData({ ...formData, town: e.target.value })
                  }
                  className="border-b py-3 outline-none focus:border-[#1D3A15]"
                />
                <input
                  type="text"
                  placeholder="District"
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="border-b py-3 outline-none focus:border-[#1D3A15]"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="border-b py-3 outline-none font-bold text-[#1D3A15] focus:border-[#1D3A15]"
                />
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-bold">Payment Method</h3>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    checked={paymentMethod === "sslcommerz"}
                    onChange={() => setPaymentMethod("sslcommerz")}
                    className="accent-[#1D3A15] w-4 h-4"
                  />
                  SSLCommerz (Local)
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="radio"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="accent-[#1D3A15] w-4 h-4"
                  />
                  Stripe (International)
                </label>
              </div>
            </section>

            <button
              onClick={handleOrderSubmit}
              disabled={status !== "authenticated"}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-[0.98] ${
                status === "authenticated" 
                ? "bg-[#3D5334] text-white hover:bg-[#1D3A15]" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              PLACE ORDER & PAY (৳{grandTotal.toFixed(2)})
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-100 rounded-[30px] p-8 sticky top-10 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {checkoutItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {item.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-300 pt-6 mt-4 space-y-2">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Delivery Charge</span>
                  <span>৳{taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-[#1D3A15] pt-2">
                  <span>Grand Total</span>
                  <span>৳{grandTotal.toFixed(2)}</span>
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