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
  const taxes = checkoutItems.length > 0 ? 50 : 0;
  const grandTotal = subtotal + taxes;

  const handleOrderSubmit = async () => {
    if (status !== "authenticated") {
      toast.error("Please login to place an order!");
      return signIn();
    }

    if (!formData.phone || !formData.address || !formData.town) {
      return toast.error("Please fill in Phone, Address and City!");
    }

    const loadingToast = toast.loading("Processing your request...");

    try {
      const getCoords = (): Promise<{ lat: number; lng: number }> => {
        return new Promise((resolve) => {
          if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                resolve({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                }),
              () => resolve({ lat: 23.8103, lng: 90.4125 }),
              { timeout: 5000 },
            );
          } else {
            resolve({ lat: 23.8103, lng: 90.4125 });
          }
        });
      };

      const coords = await getCoords();
      const pendingOrderId = localStorage.getItem("pending_order_id");

      const orderData = {
        orderId: pendingOrderId || null,
        customerInfo: {
          user: session?.user?.id,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        phone: formData.phone,
        address: `${formData.address}, ${formData.town}, ${formData.district}`,
        deliveryLocation: { lat: coords.lat, lng: coords.lng },
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

      const response =
        paymentMethod === "stripe"
          ? await createStripeOrder(orderData)
          : await createSSLOrder(orderData);

      if (response.success && response.data?.paymentUrl) {
        // Clear logic...
        localStorage.removeItem("cart");
        localStorage.removeItem("temp_checkout");
        localStorage.removeItem("pending_order_id");
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error(response.message || "Failed to initiate payment.");
      }
    } catch (error: any) {
      toast.error("Something went wrong!");
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

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mt-10 md:mt-16">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1D3A15] mb-8 md:mb-12">
          Checkout
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Form Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="border border-gray-100 rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-sm bg-white relative">
              {/* Login Overlay - Adjusted for Mobile */}
              {status !== "authenticated" && (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[4px] rounded-[30px] md:rounded-[40px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-[#1D3A15] p-3 md:p-4 rounded-full mb-4 shadow-lg">
                    <Lock className="text-white size-6 md:size-8" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-[#1D3A15] mb-2 uppercase">
                    Login Required
                  </h3>
                  <p className="text-gray-500 max-w-xs mb-6 text-sm md:text-base font-medium">
                    Please login to provide shipping details and complete
                    payment.
                  </p>
                  <button
                    onClick={() => signIn()}
                    className="bg-[#1D3A15] text-white px-8 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest hover:bg-black transition-all"
                  >
                    Sign In Now
                  </button>
                </div>
              )}

              <div
                className={
                  status !== "authenticated"
                    ? "opacity-20 pointer-events-none"
                    : ""
                }
              >
                <section className="space-y-6">
                  <h3 className="text-lg md:text-xl font-bold border-b pb-2">
                    Contact & Shipping
                  </h3>

                  {/* Responsive Grid for Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="border-b py-2 outline-none focus:border-[#1D3A15] transition-all text-sm md:text-base"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Doe"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="border-b py-2 outline-none focus:border-[#1D3A15] transition-all text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className="w-full border-b py-2 outline-none opacity-60 text-sm md:text-base"
                      readOnly
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      placeholder="House No, Road, Area"
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full border-b py-2 outline-none focus:border-[#1D3A15] text-sm md:text-base"
                    />
                  </div>

                  {/* Responsive Grid for Location Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <input
                      type="text"
                      placeholder="City/Town"
                      onChange={(e) =>
                        setFormData({ ...formData, town: e.target.value })
                      }
                      className="border-b py-2 outline-none focus:border-[#1D3A15] text-sm md:text-base"
                    />
                    <input
                      type="text"
                      placeholder="District"
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      className="border-b py-2 outline-none focus:border-[#1D3A15] text-sm md:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="border-b py-2 outline-none font-bold text-[#1D3A15] focus:border-[#1D3A15] text-sm md:text-base"
                    />
                  </div>
                </section>

                <section className="mt-10 space-y-6">
                  <h3 className="text-lg md:text-xl font-bold border-b pb-2">
                    Payment Method
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-xl sm:border-none">
                      <input
                        type="radio"
                        checked={paymentMethod === "sslcommerz"}
                        onChange={() => setPaymentMethod("sslcommerz")}
                        className="accent-[#1D3A15] w-5 h-5"
                      />
                      <span className="text-sm md:text-base font-medium">
                        SSLCommerz (Local)
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-xl sm:border-none">
                      <input
                        type="radio"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="accent-[#1D3A15] w-5 h-5"
                      />
                      <span className="text-sm md:text-base font-medium">
                        Stripe (International)
                      </span>
                    </label>
                  </div>
                </section>

                <button
                  onClick={handleOrderSubmit}
                  disabled={status !== "authenticated"}
                  className={`w-full mt-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg transition-all shadow-xl active:scale-[0.98] ${
                    status === "authenticated"
                      ? "bg-[#1D3A15] text-white hover:bg-black"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  PAY NOW (৳{grandTotal.toFixed(2)})
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-gray-50 border border-gray-100 rounded-[25px] md:rounded-[30px] p-6 md:p-8 sticky top-10 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-6">
                Order Summary
              </h3>
              <div className="space-y-4 mb-6 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm items-center gap-4"
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 line-clamp-1">
                        {item.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-black text-[#1D3A15] shrink-0">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-6 mt-4 space-y-3">
                <div className="flex justify-between text-gray-500 text-xs md:text-sm">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs md:text-sm">
                  <span className="font-medium">Delivery Charge</span>
                  <span className="font-bold">৳{taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl md:text-2xl font-black text-[#1D3A15] pt-4 border-t">
                  <span className="text-xs uppercase tracking-widest text-gray-400">
                    Total
                  </span>
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
