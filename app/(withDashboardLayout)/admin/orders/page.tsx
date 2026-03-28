"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  IoBagHandleOutline, 
  IoTimeOutline, 
  IoPersonOutline, 
  IoCashOutline,
  IoChevronDownOutline 
} from "react-icons/io5";

const OrderPage = () => {
  const BASE_URL = "http://localhost:8000/api/v1"; 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_URL}/orders`); 
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // স্ট্যাটাস আপডেট ফাংশন
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/orders/delivery/${id}`, {
        status: newStatus // কন্ট্রোলার req.body.status রিসিভ করছে
      });

      if (data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // ডাটা রিফ্রেশ
      }
    } catch (err: any) {
      // ব্যাকএন্ডের ভ্যালিডেশন এরর মেসেজ দেখাবে
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen p-4 md:p-8 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Order Dashboard</h1>
          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-[3px]">Manage active food orders</p>
        </div>

        <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Transaction / Date</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer Info</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Payment Status</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Delivery Status</th>
                  <th className="p-5 text-[10px] font-black uppercase text-gray-400 text-right tracking-widest">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">Syncing with server...</td>
                  </tr>
                ) : orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1A4E11]/5 flex items-center justify-center text-[#1A4E11] shadow-inner"><IoBagHandleOutline size={18} /></div>
                        <div>
                          <p className="font-black text-gray-800 text-[12px] tracking-tighter">#{order.transactionId?.toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter opacity-70">
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
                    <td className="p-5">
                      {/* বর্তমান স্ট্যাটাস ব্যাজ */}
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#1A4E11]/10 text-[#1A4E11]`}>
                        {order.deliveryStatus || 'pending'}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      {/* স্ট্যাটাস চেঞ্জ ড্রপডাউন (Value গুলো আপনার স্কিমা অনুযায়ী হুবহু ছোট হাতের দেওয়া হয়েছে) */}
                      <div className="relative inline-block text-left">
                        <select 
                          value={order.deliveryStatus || 'pending'}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="appearance-none bg-gray-50 border border-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-wider rounded-lg pl-4 pr-10 py-2.5 outline-none cursor-pointer focus:ring-2 focus:ring-[#1A4E11]/20 focus:border-[#1A4E11] transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cooking">Cooking</option>
                          <option value="on-the-way">On The Way</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <IoChevronDownOutline className="absolute right-3 top-3 pointer-events-none text-gray-400" size={14} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;