/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSession as useAuthSession } from "next-auth/react";
import { useMyOrders } from "@/app/hooks/useMyOrders";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import {
  IoStar,
  IoCloseOutline,
  IoLocationOutline,
  IoChatbubbleEllipsesOutline,
  IoLockOpenOutline,
  IoFastFoodOutline,
  IoBicycleOutline,
} from "react-icons/io5";
import Image from "next/image";
import toast from "react-hot-toast";
import { useMenu } from "@/app/hooks/useMenu";
import { updateRiderRatingApi } from "@/app/modules/rider/rider.api";
import dynamic from "next/dynamic";
import api from "@/utils/apiInstance";

const OrderTrackingModal = dynamic(
  () => import('@/components/shared/OrderTrackingModal'),
  { ssr: false }
);

const MyOrdersPage = () => {
  const { data: session } = useAuthSession();

  const { data: ordersData, isLoading: ordersLoading } = useMyOrders(
    session?.user?.email as string,
  );
  const orders = ordersData?.data || [];
  const { data: allMenus } = useMenu();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<{
    [menuId: string]: { rating: number; comment: string };
  }>({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<any>(null);

  const [riderRating, setRiderRating] = useState(0);
  const [riderComment, setRiderComment] = useState("");

  const openReviewModal = (order: any) => {
    setSelectedOrder(order);
    setIsReviewModalOpen(true);
    setReviewData({});
    setRiderRating(0);
    setRiderComment("");
  };

  const handleTrackClick = (order: any) => {
    setSelectedTrackOrder(order);
    setIsTrackModalOpen(true);
  };

  const getMenuInfo = (id: string) => allMenus?.find((m: any) => m._id === id);

  const handleRatingChange = (menuId: string, rating: number) => {
    setReviewData((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], rating },
    }));
  };

  const handleCommentChange = (menuId: string, comment: string) => {
    setReviewData((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], comment },
    }));
  };

  const handleSubmitReviews = async () => {
    const menuIds = Object.keys(reviewData);
    const hasMenuRatings = menuIds.some((id) => reviewData[id]?.rating > 0);

    if (!hasMenuRatings && riderRating === 0) {
      return toast.error("Please provide at least one rating!");
    }

    setBtnLoading(true);
    try {
      const menuReviewPromises = menuIds.map((menuId) => {
        const payload = {
          rating: Number(reviewData[menuId].rating),
          review: reviewData[menuId].comment || "",
          userId: (session?.user as any)?.id,
        };
        return api.patch(`/menu/${menuId}`, payload);
      });

      if (riderRating > 0 && selectedOrder?.riderId?._id) {
        await updateRiderRatingApi({
          riderId: selectedOrder.riderId._id,
          userId: (session?.user as any)?.id,
          rating: riderRating,
          comment: riderComment,
        });
      }

      await Promise.all(menuReviewPromises);
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
      <h1 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">
        My Orders
      </h1>

      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">
                  Date/Transaction
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">
                  Status
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">
                  OTP
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400">
                  Total
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ordersLoading ? (
                <TableSkeleton />
              ) : (
                orders.map((order: any) => {
                  const isDelivered = order.deliveryStatus === "delivered";
                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/30 transition-colors"
                    >
                      <td className="p-5">
                        <p className="text-sm font-bold text-gray-800 uppercase tracking-tighter">
                          {order.transactionId?.slice(-10)}
                        </p>
                        <p className="text-[10px] text-gray-400 font-black uppercase mt-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                          )}
                        </p>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                            isDelivered
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {order.deliveryStatus || "Processing"}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-[#1A4E11] font-black text-sm">
                          <IoLockOpenOutline
                            size={14}
                            className="text-gray-400"
                          />
                          {order.deliveryOTP || "----"}
                        </div>
                      </td>
                      <td className="p-5 font-black text-gray-800 text-sm">
                        ৳{order.totalPrice}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Track Button: Only shows if NOT delivered */}
                          {!isDelivered && (
                            <button
                              onClick={() => handleTrackClick(order)}
                              className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase bg-[#1A4E11] text-white rounded-lg hover:opacity-90 transition-all"
                            >
                              <IoLocationOutline size={20} /> Track
                            </button>
                          )}
                          
                          {/* Review Button: ONLY shows if Delivered */}
                          {isDelivered && (
                            <button
                              onClick={() => openReviewModal(order)}
                              className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase bg-[#1A4E11] text-white rounded-lg hover:opacity-90 transition-all w-full justify-center"
                            >
                              <IoChatbubbleEllipsesOutline size={20} /> Rate Experience
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {isTrackModalOpen && selectedTrackOrder && (
        <OrderTrackingModal
          isOpen={isTrackModalOpen}
          onClose={() => {
            setIsTrackModalOpen(false);
            setSelectedTrackOrder(null);
          }}
          status={selectedTrackOrder?.deliveryStatus || "preparing"}
          order={{
            orderId: selectedTrackOrder?._id,
            orderNumber:
              selectedTrackOrder?.transactionId?.slice(-8).toUpperCase() ||
              "N/A",
            foodName:
              selectedTrackOrder?.items?.[0]?.menuId?.title || "Food Items",
            foodQuantity: selectedTrackOrder?.items?.length || 1,
            otp: selectedTrackOrder?.deliveryOTP,
            driver: {
              name: selectedTrackOrder?.riderId?.userId?.name || "Assigning...",
              avatarUrl: selectedTrackOrder?.riderId?.image || "",
              rating: 4.8,
              phone: selectedTrackOrder?.riderId?.phoneNumber || "",
            },
          }}
          currentUser={{
            id: (session?.user as any)?.id,
            role: (session?.user as any)?.role || "user",
          }}
          location={
            selectedTrackOrder?.riderId?.lastLocation || {
              lat: 23.8103,
              lng: 90.4125,
            }
          }
        />
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                  Feedback
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Order #{selectedOrder.transactionId?.slice(-8)}
                </p>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="hover:rotate-90 transition-transform"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* SECTION 1: FOOD REVIEW */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-green-100 text-[#1A4E11] rounded-lg">
                    <IoFastFoodOutline size={18} />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-gray-500">
                    Rate Food Items
                  </h3>
                </div>

                <div className="space-y-8">
                  {selectedOrder.items?.map((item: any, idx: number) => {
                    const mId = item.menuId?._id || item.menuId;
                    const menu = getMenuInfo(mId);
                    return (
                      <div
                        key={mId || idx}
                        className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-white rounded-xl relative overflow-hidden shrink-0 shadow-sm">
                            {menu?.image?.url ? (
                              <Image
                                src={menu.image.url}
                                alt="food"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-[6px] font-bold">
                                NO IMG
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-sm text-gray-900">
                              {menu?.title || "Food Item"}
                            </p>
                            <p className="text-[9px] text-gray-400 font-black uppercase">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1.5 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRatingChange(mId, star)}
                              className={`transition-all ${reviewData[mId]?.rating >= star ? "text-yellow-400 scale-110" : "text-gray-200"}`}
                            >
                              <IoStar size={24} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="What did you think of the taste?"
                          value={reviewData[mId]?.comment || ""}
                          onChange={(e) =>
                            handleCommentChange(mId, e.target.value)
                          }
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#1A4E11] font-medium resize-none"
                          rows={2}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: RIDER REVIEW */}
              {selectedOrder?.riderId && (
                <div className="pt-8 border-t border-dashed border-gray-200">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                      <IoBicycleOutline size={18} />
                    </div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-500">
                      Rate Delivery Service
                    </h3>
                  </div>

                  <div className="bg-orange-50/30 p-6 rounded-2xl border border-orange-100">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white overflow-hidden relative shadow-md mb-3">
                        <Image
                          src={
                            selectedOrder.riderId.image ||
                            "https://i.pravatar.cc/150"
                          }
                          alt="rider"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-black text-gray-900 text-base">
                        {selectedOrder.riderId.userId?.name || "Delivery Hero"}
                      </h4>
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-1">
                        Delivery Partner
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRiderRating(star)}
                          className={`transition-all ${riderRating >= star ? "text-orange-500 scale-125" : "text-gray-200"}`}
                        >
                          <IoStar size={32} />
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="How was the delivery experience?"
                      value={riderComment}
                      onChange={(e) => setRiderComment(e.target.value)}
                      className="w-full p-4 bg-white border border-orange-100 rounded-2xl text-xs outline-none focus:border-orange-500 font-medium resize-none shadow-sm"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50/50">
              <button
                onClick={handleSubmitReviews}
                disabled={btnLoading}
                className="w-full py-4 bg-[#1A4E11] text-white font-black rounded-2xl uppercase text-xs tracking-[0.2em] disabled:bg-gray-300 shadow-xl hover:shadow-green-900/20 active:scale-[0.98] transition-all"
              >
                {btnLoading ? "Submitting feedback..." : "Submit All Reviews"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;