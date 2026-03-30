"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import SingleHero from "@/components/shared/SingleHero";
import Link from "next/link";

const PaymentSuccessPage = () => {
  const { transactionId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const verifyAndUpdatePayment = async () => {
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/v1/orders/status-by-transaction/${transactionId}`,
          { status: "paid" }
        );

        if (response.data.success) {
          setStatus("success");
          toast.success("Payment confirmed and order updated!");
        }
      } catch (error) {
        console.error("Payment update error:", error);
        setStatus("error");
        toast.error("Could not update payment status. Contact support.");
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      verifyAndUpdatePayment();
    }
  }, [transactionId]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <Toaster position="top-center" />
      <SingleHero
        subtitle="Success"
        title="Payment Completed"
        isCenter={true}
      />

      <div className="max-w-3xl mx-auto px-4 mt-20 text-center">
        {loading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1D3A15] mx-auto"></div>
            <p className="text-xl font-medium text-gray-600">Verifying your payment, please wait...</p>
          </div>
        ) : status === "success" ? (
          <div className="bg-gray-50 border border-gray-100 rounded-[40px] p-12 shadow-sm">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
              ✓
            </div>
            <h2 className="text-4xl font-black text-[#1D3A15] mb-4">Thank You!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Your payment was successful. Your transaction ID is: <br />
              <span className="font-mono font-bold text-[#3D5334] bg-green-50 px-3 py-1 rounded-lg mt-2 inline-block">
                {transactionId}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/my-orders"
                className="bg-[#3D5334] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#1D3A15] transition-all shadow-lg"
              >
                VIEW MY ORDERS
              </Link>
              <Link
                href="/"
                className="border-2 border-[#1D3A15] text-[#1D3A15] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-[40px] p-12">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Update Failed</h2>
            <p className="text-gray-600 mb-8">
              Payment was received but we could not update your order status automatically. 
              Please keep your Transaction ID: <strong>{transactionId}</strong>
            </p>
            <Link
              href="/"
              className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all"
            >
              GO TO HOME
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;