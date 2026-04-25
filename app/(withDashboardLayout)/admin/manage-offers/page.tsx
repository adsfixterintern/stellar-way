/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiCalendar,
  FiPercent,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiCheckCircle,
  FiPlus,
  FiInfo,
  FiEye,
  FiX, // Added for close icon
} from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  createOfferApi,
  getActiveOffersApi,
  deleteOfferApi,
} from "@/app/modules/offer/offer.api";
import { getMenus } from "@/app/modules/menu/menu.api";

const ManageOffers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null); 
  const [submitLoading, setSubmitLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [offerRes, menuRes] = await Promise.all([
        getActiveOffersApi(),
        getMenus(),
      ]);

      const extractedOffers = Array.isArray(offerRes)
        ? offerRes
        : offerRes?.data || offerRes?.result || [];

      const extractedMenus = Array.isArray(menuRes)
        ? menuRes
        : menuRes?.data || menuRes?.result || [];

      setOffers(extractedOffers);
      setMenus(extractedMenus);
    } catch (err) {
      console.error("Data Fetch Error:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const groupedMenus = menus.reduce((acc: any, menu: any) => {
    const categoryName =
      menu?.categoryId?.name ||
      menu?.category?.name ||
      menu?.category ||
      "General Items";

    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(menu);
    return acc;
  }, {});

  const toggleMenuSelection = (id: string) => {
    setSelectedMenus((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMenus.length === 0)
      return toast.error("Select at least one menu");

    setSubmitLoading(true);
    const payload = {
      ...formData,
      discountPercentage: Number(formData.discountPercentage),
      applicableMenus: selectedMenus,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      isActive: true,
    };

    try {
      const res = await createOfferApi(payload);
      if (res.success || res._id) {
        toast.success("Offer Launched Successfully!");
        setShowModal(false);
        setFormData({
          title: "",
          discountPercentage: "",
          startDate: "",
          endDate: "",
          description: "",
        });
        setSelectedMenus([]);
        setOpenCategory(null);
        await fetchInitialData();
      }
    } catch (err) {
      toast.error("Error creating offer");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Remove Offer?",
      text: "Users won't see this discount anymore.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOfferApi(id);
          setOffers((prev) => prev.filter((o) => o._id !== id));
          toast.success("Offer Deleted");
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <BiLoaderAlt className="animate-spin text-[#1A4E11]" size={50} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Promotional <span className="text-[#1A4E11]">Offers</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Configure and manage discounts for DevFixter.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1A4E11] text-white px-8 py-4 rounded-[1.2rem] font-bold shadow-xl shadow-[#1A4E11]/20 transition-all hover:bg-black"
          >
            <FiPlus size={20} /> Create New Offer
          </motion.button>
        </div>

        {/* OFFERS TABLE */}
        <div className="bg-white rounded-[1.2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Campaign & Description
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                    Discount
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Validity Period
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
                    Items
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={offer._id || offer.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="font-black text-gray-800 text-lg leading-tight">
                          {offer.title || offer.name || "Untitled Offer"}
                        </div>
                        <div className="text-gray-400 text-xs mt-1 max-w-xs line-clamp-1">
                          {offer.description || "Special promotional campaign."}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="inline-flex items-center gap-1 bg-[#1A4E11]/10 text-[#1A4E11] px-4 py-1.5 rounded-full text-sm font-black">
                          {offer.discountPercentage || offer.discount || 0}%
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                            <FiCalendar className="text-[#1A4E11]" size={14} />
                            {offer.startDate
                              ? new Date(offer.startDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                            <span className="w-4 h-[1px] bg-gray-200"></span>
                            {offer.endDate
                              ? new Date(offer.endDate).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs font-black text-[#1A4E11] bg-[#1A4E11]/5 py-2 rounded-xl">
                          <FiLayers /> {offer.applicableMenus?.length || 0}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOffer(offer)}
                            className="p-3 text-gray-300 hover:text-[#1A4E11] hover:bg-gray-100 rounded-xl transition-all"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(offer._id || offer.id)}
                            className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-24">
                      <FiInfo
                        className="mx-auto text-gray-200 mb-4"
                        size={50}
                      />
                      <p className="text-gray-400 font-bold">
                        No active offers found. Create one to get started!
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-xl p-8 rounded-[3rem] shadow-2xl overflow-hidden border border-white"
            >
              <button
                onClick={() => setSelectedOffer(null)}
                className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-all"
              >
                <FiX size={20} />
              </button>

              <div className="mb-6">
                <span className="bg-[#1A4E11] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Campaign Details
                </span>
                <h2 className="text-3xl font-black text-gray-900 mt-4 leading-tight">
                  {selectedOffer.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Discount Rate
                  </div>
                  <div className="text-2xl font-black text-[#1A4E11]">
                    {selectedOffer.discountPercentage}% OFF
                  </div>
                </div>
                <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Validity
                  </div>
                  <div className="text-sm font-black text-gray-700">
                    {new Date(selectedOffer.startDate).toLocaleDateString()} -{" "}
                    {new Date(selectedOffer.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  About Campaign
                </h3>
                <p className="text-gray-600 font-bold text-sm leading-relaxed bg-gray-50 p-4 rounded-2xl">
                  {selectedOffer.description ||
                    "No detailed description provided for this campaign."}
                </p>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
                  <FiLayers className="text-[#1A4E11]" /> Applicable Menus (
                  {selectedOffer.applicableMenus?.length || 0})
                </h3>
                <div className="max-h-60 overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
                  {selectedOffer.applicableMenus?.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-100 p-2 rounded-2xl flex items-center gap-4 hover:shadow-sm transition-all"
                      >
                        {/* ITEM IMAGE */}
                        <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-50">
                          {item.image ? (
                            <img
                              src={item.image.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiLayers size={16} />
                            </div>
                          )}
                        </div>

                        {/* ITEM INFO */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-black text-gray-800 truncate">
                            {item.name || item.title || "Untitled Item"}
                          </div>
                        </div>

                      </div>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl p-8 md:p-12 rounded-[12px] shadow-2xl overflow-hidden border border-white"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
                Setup <span className="text-[#1A4E11]">Offer</span>
              </h2>

              <form
                onSubmit={handleCreateOffer}
                className="space-y-5 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      Campaign Title
                    </label>
                    <input
                      required
                      placeholder="e.g. Weekend Special"
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4E11]/10 border-none font-bold text-gray-700"
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      Discount (%)
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="20"
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4E11]/10 border-none font-bold text-gray-700"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercentage: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief details about this offer..."
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4E11]/10 border-none font-bold text-gray-700 resize-none"
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      Start Date
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700"
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                      End Date
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700"
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2 block">
                    Applicable Menu Items ({selectedMenus.length})
                  </label>
                  <div className="space-y-3">
                    {Object.keys(groupedMenus).map((cat) => (
                      <div
                        key={cat}
                        className="border border-gray-100 rounded-[1.5rem] overflow-hidden bg-white shadow-sm"
                      >
                        <button
                          type="button"
                          className="w-full flex justify-between items-center p-5 bg-[#F8FAF9] hover:bg-gray-100 transition-all"
                          onClick={() =>
                            setOpenCategory(openCategory === cat ? null : cat)
                          }
                        >
                          <span className="font-black text-xs uppercase tracking-widest text-gray-700">
                            {cat}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold bg-white px-2 py-1 rounded-lg border border-gray-100 text-[#1A4E11]">
                              {groupedMenus[cat].length} Items
                            </span>
                            {openCategory === cat ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </div>
                        </button>

                        <AnimatePresence>
                          {openCategory === cat && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 grid grid-cols-2 gap-3 bg-white border-t border-gray-50">
                                {groupedMenus[cat].map((menu: any) => (
                                  <button
                                    key={menu._id}
                                    type="button"
                                    onClick={() =>
                                      toggleMenuSelection(menu._id)
                                    }
                                    className={`p-4 text-[10px] font-black border-2 rounded-2xl flex justify-between items-center transition-all ${
                                      selectedMenus.includes(menu._id)
                                        ? "bg-[#1A4E11] text-white border-transparent"
                                        : "bg-gray-50 text-gray-500 border-gray-50 hover:border-[#1A4E11]/20"
                                    }`}
                                  >
                                    <span className="truncate">
                                      {menu.name || menu.title}
                                    </span>
                                    {selectedMenus.includes(menu._id) && (
                                      <FiCheckCircle size={14} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 p-5 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                  >
                    Discard
                  </button>
                  <button
                    disabled={submitLoading}
                    type="submit"
                    className="flex-1 p-5 bg-[#1A4E11] text-white rounded-2xl font-black shadow-lg shadow-[#1A4E11]/20 hover:bg-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                  >
                    {submitLoading ? (
                      <BiLoaderAlt className="animate-spin" />
                    ) : (
                      "Launch Campaign"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOffers;
