/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import { IoCloseOutline } from "react-icons/io5";

interface IOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const OrderDetailsModal: React.FC<IOrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-gray-100">
        
        {/* Modal Header */}
        <div className="bg-gray-50/50 p-6 flex justify-between items-center border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Order Details</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              TXN: {order.transactionId}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-400"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Section: Customer & Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-[#1A4E11] uppercase tracking-widest mb-3">Customer Info</h3>
              <p className="text-sm font-bold text-gray-800">{order.customerInfo?.name || "Guest User"}</p>
              <p className="text-xs text-gray-500 font-medium">{order.customerInfo?.email}</p>
              <p className="text-xs text-gray-500 font-medium">Phone: {order.phone || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-[#1A4E11] uppercase tracking-widest mb-3">Shipping Address</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                {order.address || "No address provided for this order."}
              </p>
            </div>
          </div>

          {/* Section: Ordered Items */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-[10px] font-black text-[#1A4E11] uppercase tracking-widest mb-4">Items Summary</h3>
            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 hover:border-[#1A4E11]/20 transition-colors">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                    <Image 
                      src={item.menuId?.image?.url || "/placeholder-food.jpg"} 
                      alt={item.menuId?.title || "Food"} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.menuId?.title}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                      Qty: {item.quantity} × ৳{item.price}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-[#1A4E11]">৳{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Footer Summary */}
          <div className="mt-8 pt-6 border-t border-dashed border-gray-200 flex flex-wrap justify-between items-end gap-4">
            <div className="flex gap-3">
               <div className="px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-[8px] font-black text-green-700 uppercase tracking-widest">Payment</p>
                  <span className="text-[10px] font-black text-green-600 uppercase">{order.paymentStatus}</span>
               </div>
               <div className="px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-[8px] font-black text-orange-700 uppercase tracking-widest">Status</p>
                  <span className="text-[10px] font-black text-orange-600 uppercase">{order.deliveryStatus}</span>
               </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total</p>
              <p className="text-3xl font-black text-gray-900 tracking-tighter leading-none">৳{order.totalPrice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;