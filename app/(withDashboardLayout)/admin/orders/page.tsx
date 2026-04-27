/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { IoBagHandleOutline} from "react-icons/io5";
import { useAllOrders } from "@/app/hooks/useAllOrders";
import PaginationDashboard from "@/components/shared/PaginationDashboard";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import OrderDetailsModal from "@/components/admin-dashboard/OrderDetailsModal";


const OrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  const { data: response, isLoading, refetch } = useAllOrders(page, limit);
  const orders = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, limit: 10, totalPage: 1 };

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen ">
      <div className="w-full">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Management</h1>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[3px]">
              Total Records: {meta.total}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Transaction / Date</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Payment</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1A4E11]/5 flex items-center justify-center text-primary  group-hover:text-white transition-all">
                            <IoBagHandleOutline size={18} />
                          </div>
                          <div>
                            <p className="font-black text-gray-800 text-[12px] tracking-tighter uppercase">#{order.transactionId?.slice(-8)}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-gray-800 text-sm">{order.customerInfo?.name || "Guest"}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{order.customerInfo?.email}</p>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${order.paymentStatus === "paid" ? "bg-green-100 text-green-600" : "bg-red-50 text-red-500"}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#1A4E11]/10 text-primary">
                          {order.deliveryStatus || "pending"}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center gap-2 underline text-sm font-bold text-primary hover:text-[#1A4E11]/80 transition-colors"
                        >
                           View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-gray-50 bg-gray-50/20">
            <PaginationDashboard
              totalItems={meta.total}
              itemsPerPage={limit}
              currentPage={page}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>

     
      <OrderDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />
    </div>
  );
};

export default OrderPage;