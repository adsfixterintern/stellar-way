"use client";
import React, { useState, useEffect } from "react";
import SingleHero from "@/components/shared/SingleHero";
import { ICartItem } from "@/types/menu";
import { toast, Toaster } from "react-hot-toast";
import {
  createSSLOrder,
  createStripeOrder,
} from "@/app/modules/order/order.api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { data: session } = useSession();
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
    // ১. চেকআউট আইটেম লোড করা
    const tempCart = localStorage.getItem("temp_checkout");
    if (tempCart) {
      setCheckoutItems(JSON.parse(tempCart));
    } else {
      router.push("/cart");
    }

    // ২. ইউজার সেশন থেকে ডাটা প্রি-ফিল করা
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
    // ভ্যালিডেশন
    if (!formData.phone || !formData.address || !formData.town) {
      return toast.error("Please fill in Phone, Address and City!");
    }

    const pendingOrderId = localStorage.getItem("pending_order_id");

    const orderData = {
      orderId: pendingOrderId || null,
      customerInfo: {
        user: session?.user?.id || "65f1a2b3c4d5e6f7a8b9c0d1", // সেশন আইডি না থাকলে একটি ডিফল্ট আইডি
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

    const loadingToast = toast.loading(
      "Order placing, redirecting to payment gateway...",
    );

    try {
      const response =
        paymentMethod === "stripe"
          ? await createStripeOrder(orderData)
          : await createSSLOrder(orderData);

      if (response.success && response.data?.paymentUrl) {
        // --- ৩. কার্ট ক্লিনিং লজিক (ব্যাকএন্ড পরিবর্তন ছাড়াই) ---
        const mainCartRaw = localStorage.getItem("cart");
        if (mainCartRaw) {
          const mainCart = JSON.parse(mainCartRaw);
          // শুধুমাত্র সেই আইটেমগুলো রাখুন যেগুলো এখন অর্ডার করা হচ্ছে না
          const remainingCart = mainCart.filter(
            (mainItem: any) =>
              !checkoutItems.some(
                (checkItem) => checkItem._id === mainItem._id,
              ),
          );
          localStorage.setItem("cart", JSON.stringify(remainingCart));
        }

        // টেম্পোরারি স্টোরেজ ক্লিয়ার
        localStorage.removeItem("temp_checkout");
        localStorage.removeItem("pending_order_id");

        toast.success("Redirecting to payment...");

        // ৪. পেমেন্ট গেটওয়েতে রিডাইরেক্ট (window.location.href ব্যবহার করা হয়েছে)
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || "Failed to initiate payment gateway.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Something went wrong! Please try again.");
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
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-8 border border-gray-100 rounded-[40px] p-10 shadow-sm bg-white">
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
                disabled
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
              className="w-full bg-[#3D5334] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#1D3A15] transition-all shadow-xl active:scale-[0.98]"
            >
              PLACE ORDER & PAY (৳{grandTotal.toFixed(2)})
            </button>
          </div>

          {/* Sidebar Summary */}
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
                        {item.name || item.title}
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
