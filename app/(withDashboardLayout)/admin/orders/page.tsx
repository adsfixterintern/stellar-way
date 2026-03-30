"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/apiInstance";
import toast from "react-hot-toast";

import { 
  IoBagHandleOutline, 
  IoChevronDownOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from "react-icons/io5";
import { useAllOrders } from "@/app/hooks/useAllOrders";

// ✅ Types
interface ICustomerInfo {
  name: string;
  email: string;
}

interface IOrder {
  _id: string;
  transactionId: string;
  createdAt: string;
  customerInfo: ICustomerInfo;
  paymentStatus: "paid" | "unpaid" | string;
  deliveryStatus: string;
}

interface IResponse {
  data: IOrder[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

const OrderPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: response, isLoading, refetch } = useAllOrders(page, limit);
  const orders: IOrder[] = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, limit, totalPage: 1 };

  // Update delivery status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { data } = await api.patch(`/orders/delivery/${id}`, { status: newStatus });
      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
        refetch();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  // Refetch on page change
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="">
      <div className="w-full p-2 md:p-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">
              Order Management
            </h1>
            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[3px]">
              Total Orders: {meta.total}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                    Transaction / Date
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Customer
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                    Payment
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Status
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">
                      Syncing...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#1A4E11]/5 flex items-center justify-center text-[#1A4E11]">
                            <IoBagHandleOutline size={18} />
                          </div>
                          <div>
                            <p className="font-black text-gray-800 text-[12px] tracking-tighter">
                              #{order.transactionId?.toUpperCase()}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-gray-800 text-sm">{order.customerInfo?.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{order.customerInfo?.email}</p>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#1A4E11]/10 text-[#1A4E11]">
                          {order.deliveryStatus || 'pending'}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="relative inline-block text-left">
                          <select 
                            value={order.deliveryStatus || 'pending'}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-100 text-gray-700 text-[10px] font-black uppercase rounded-lg pl-4 pr-10 py-2.5 outline-none cursor-pointer focus:border-[#1A4E11] transition-all"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cooking">Cooking</option>
                            <option value="on-the-way">On Way</option>
                            <option value="delivered">Delivered</option>
                          </select>
                          <IoChevronDownOutline className="absolute right-3 top-3 pointer-events-none text-gray-400" size={14} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination like AdminBookingDashboard */}
          {!isLoading && orders.length > 0 && (
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                Page {meta.page} of {meta.totalPage}
              </p>
              <div className="flex gap-3">
                <button
                  disabled={meta.page === 1}
                  onClick={() => setPage(meta.page - 1)}
                  className="flex items-center gap-1 px-4 py-2 text-[10px] font-black uppercase bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:border-[#1A4E11] hover:text-[#1A4E11] transition-all shadow-sm"
                >
                  <IoChevronBackOutline /> Prev
                </button>
                <button
                  disabled={meta.page >= meta.totalPage}
                  onClick={() => setPage(meta.page + 1)}
                  className="flex items-center gap-1 px-4 py-2 text-[10px] font-black uppercase bg-white border border-gray-200 rounded-xl disabled:opacity-30 hover:border-[#1A4E11] hover:text-[#1A4E11] transition-all shadow-sm"
                >
                  Next <IoChevronForwardOutline />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;