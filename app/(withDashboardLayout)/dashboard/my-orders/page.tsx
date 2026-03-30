/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSession as useAuthSession } from "next-auth/react";
import { useMyOrders } from "@/app/hooks/useMyOrders"; 
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { IoStar, IoCloseOutline, IoLocationOutline, IoChatbubbleEllipsesOutline, IoLockOpenOutline } from "react-icons/io5";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { useMenu } from "@/app/hooks/useMenu";
import OrderTrackingModal from "@/components/OrderTrackingModal";

const MyOrdersPage = () => {
  const { data: session } = useAuthSession();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const { data: ordersData, isLoading: ordersLoading } = useMyOrders(session?.user?.email as string);
  const orders = ordersData?.data || [];
  const { data: allMenus } = useMenu(); 

  // States
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<{ [menuId: string]: { rating: number, comment: string } }>({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<any>(null);

  // Modal Handlers
  const openReviewModal = (order: any) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
    setReviewData({}); 
  };

  const handleTrackClick = (order: any) => {
    setSelectedTrackOrder(order);
    setIsTrackModalOpen(true);
  };
 
  const getMenuInfo = (id: string) => allMenus?.find((m: any) => m._id === id);

  // Review Logic
  const handleRatingChange = (menuId: string, rating: number) => {
    setReviewData(prev => ({ ...prev, [menuId]: { ...prev[menuId], rating } }));
  };

  const handleCommentChange = (menuId: string, comment: string) => {
    setReviewData(prev => ({ ...prev, [menuId]: { ...prev[menuId], comment } }));
  };

  const handleSubmitReviews = async () => {
    const menuIds = Object.keys(reviewData);
    const hasRatings = menuIds.some(id => reviewData[id]?.rating > 0);
    
    if (!hasRatings) return toast.error("Please provide at least one rating!");

    setBtnLoading(true);
    try {
      const reviewPromises = menuIds.map((menuId) => {
        const payload = {
          rating: Number(reviewData[menuId].rating),
          review: reviewData[menuId].comment || "",
          userId: (session?.user as any)?.id
        };
        return axios.patch(`${BASE_URL}/menu/${menuId}`, payload);
      });

      await Promise.all(reviewPromises);
      toast.success("Reviews submitted successfully!");
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit reviews.");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">My Orders</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">Date/Transaction</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">Status</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">OTP</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">Total</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ordersLoading ? <TableSkeleton /> : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No orders yet</td>
                </tr>
              ) :  orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-5">
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-tighter">{order.transactionId?.slice(-10)}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      order.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {order.deliveryStatus || 'Processing'}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-1.5 text-[#1A4E11] font-black text-sm">
                      <IoLockOpenOutline size={14} className="text-gray-400" />
                      {order.deliveryOTP || "----"}
                    </div>
                  </td>
                  <td className="p-5 font-black text-gray-800 text-sm">৳{order.totalPrice}</td>
                  <td className="p-5 text-right space-x-2">
                    <button onClick={() => handleTrackClick(order)} className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase bg-[#1A4E11] text-white rounded-lg hover:opacity-90 transition-all"><IoLocationOutline size={20}/> Track</button>
                    <button onClick={() => openReviewModal(order)} className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase bg-[#1A4E11] text-white rounded-lg hover:opacity-90 transition-all"><IoChatbubbleEllipsesOutline size={20} /> Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {isTrackModalOpen && selectedTrackOrder && (
        <OrderTrackingModal
          isOpen={isTrackModalOpen} 
          onClose={() => { setIsTrackModalOpen(false); setSelectedTrackOrder(null); }} 
          status={selectedTrackOrder?.deliveryStatus || 'preparing'} 
          order={{
            orderId: selectedTrackOrder?._id,
            orderNumber: selectedTrackOrder?.transactionId?.slice(-8).toUpperCase() || "N/A",
            foodName: selectedTrackOrder?.items?.[0]?.menuId?.title || "Food Items",
            foodQuantity: selectedTrackOrder?.items?.length || 1,
            otp: selectedTrackOrder?.deliveryOTP,
            driver: {
              name: selectedTrackOrder?.riderId?.userId?.name || "Assigning Rider...",
              avatarUrl: selectedTrackOrder?.riderId?.image || "",
              rating: 4.8,
              phone: selectedTrackOrder?.riderId?.phoneNumber || ""
            }
          }}
          currentUser={{ id: (session?.user as any)?.id, role: (session?.user as any)?.role || "user" }}
          location={selectedTrackOrder?.riderId?.lastLocation || { lat: 23.8103, lng: 90.4125 }} 
        />
      )}

      {/* --- Review Modal Part --- */}
      {isReviewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Rate Your Experience</h2>
              <button onClick={() => setIsReviewModalOpen(false)} className="hover:rotate-90 transition-transform"><IoCloseOutline size={28}/></button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-8 custom-scrollbar">
              {selectedOrder.items?.map((item: any, idx: number) => {
                const mId = item.menuId?._id || item.menuId;
                const menu = getMenuInfo(mId);

                return (
                  <div key={mId || idx} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex items-center gap-5 mb-5">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl relative overflow-hidden border border-gray-100 flex-shrink-0">
                        {menu?.image?.url ? (
                          <Image src={menu.image.url} alt="product" fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[8px] text-gray-300 font-bold uppercase">No Image</div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-base text-gray-900 leading-tight">{menu?.title || "Food Item"}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-widest">Qty: {item.quantity}</p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingChange(mId, star)}
                          className={`transition-all duration-200 transform active:scale-90 ${reviewData[mId]?.rating >= star ? "text-yellow-400 scale-110" : "text-gray-200"}`}
                        >
                          <IoStar size={28} />
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Share your feedback (optional)..."
                      value={reviewData[mId]?.comment || ""}
                      onChange={(e) => handleCommentChange(mId, e.target.value)}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs outline-none focus:border-[#1A4E11] font-medium resize-none"
                      rows={3}
                    />
                  </div>
                );
              })}
            </div>

            <div className="p-6 border-t bg-gray-50/30">
              <button
                onClick={handleSubmitReviews}
                disabled={btnLoading}
                className="w-full py-4 bg-[#1A4E11] text-white font-black rounded-2xl uppercase text-xs tracking-[0.2em] disabled:bg-gray-300 shadow-lg active:scale-[0.98] transition-all"
              >
                {btnLoading ? "Submitting..." : "Submit All Reviews"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;