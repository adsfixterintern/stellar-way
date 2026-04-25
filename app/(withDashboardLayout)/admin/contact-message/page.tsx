/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiCalendar,
  FiX,
  FiFilter,
  FiMessageSquare,
} from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  getAllMessagesApi,
  deleteContactMessageApi,
} from "@/app/modules/contact/contact.api";

const ManageMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);

  // Filtering States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await getAllMessagesApi();
      const data = res?.data || [];
      setMessages(data);
      setFilteredMessages(data);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Filter Logic
  useEffect(() => {
    let filtered = [...messages];

    if (startDate) {
      filtered = filtered.filter(
        (msg) => new Date(msg.createdAt) >= new Date(startDate),
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      filtered = filtered.filter((msg) => new Date(msg.createdAt) <= end);
    }

    setFilteredMessages(filtered);
  }, [startDate, endDate, messages]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteContactMessageApi(id);
          setMessages(messages.filter((msg) => msg._id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Message has been deleted.",
            icon: "success",
            confirmButtonColor: "#1A4E11",
          });
        } catch (err) {
          toast.error("Delete failed");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <BiLoaderAlt className="animate-spin text-[#1A4E11]" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#F3F7F4]/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Contact <span className="text-[#1A4E11]">Inquiries</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Showing {filteredMessages.length} of {messages.length} messages
            </p>
          </div>

          {/* Date Filter UI */}
          <div className="flex flex-wrap items-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white shadow-sm">
            <div className="flex items-center gap-2 px-3 text-gray-500">
              <FiFilter size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Filter by Date:
              </span>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-[#1A4E11]/20 transition-all"
            />
            <span className="text-gray-300">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border-none rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-[#1A4E11]/20 transition-all"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Messages Table Container */}
        <div className="backdrop-blur-md bg-white/70 border border-white rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1A4E11]/5 text-[#1A4E11] text-[11px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-6">Sender</th>
                  <th className="px-8 py-6">Contact Info</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((msg) => (
                  <motion.tr
                    key={msg._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/80 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-800">{msg.name}</div>
                      <div className="text-xs text-gray-400 line-clamp-1 mt-1 max-w-[250px]">
                        {msg.message}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                          <FiMail className="text-[#1A4E11]/60" /> {msg.email}
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FiPhone className="text-blue-400" /> {msg.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-400 font-bold">
                      {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setSelectedMsg(msg)}
                          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:text-[#1A4E11] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="text-gray-200" size={30} />
              </div>
              <p className="text-gray-400 font-bold tracking-tight">
                No messages found for this period.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message View Modal (Same as before but with enhanced styling) */}
      <AnimatePresence>
        {selectedMsg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMsg(null)}
              className="absolute inset-0 bg-black/10 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white"
            >
              <div className="p-10 md:p-12">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-14 h-14 bg-[#1A4E11]/5 rounded-3xl flex items-center justify-center text-[#1A4E11]">
                    <FiMessageSquare size={28} />
                  </div>
                  <button
                    onClick={() => setSelectedMsg(null)}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <h3 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
                  {selectedMsg.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <FiMail className="text-[#1A4E11]" />
                    <span className="text-xs font-bold truncate">
                      {selectedMsg.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <FiPhone className="text-blue-500" />
                    <span className="text-xs font-bold">
                      {selectedMsg.phone || "No Phone"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                    Message Detail
                  </label>
                  <div className="p-8 bg-[#1A4E11]/5 rounded-[2rem] text-gray-700 leading-relaxed text-sm font-medium border border-[#1A4E11]/10">
                    {selectedMsg.message}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <FiCalendar />{" "}
                    {new Date(selectedMsg.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    {new Date(selectedMsg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageMessages;
