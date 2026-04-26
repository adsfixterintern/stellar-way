/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiCheckCircle,
  FiPlus,
  FiInfo,
  FiEye,
  FiX,
  FiEdit3,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  createOfferApi,
  deleteOfferApi,
  updateOfferApi,
  getAllOffersApi,
} from "@/app/modules/offer/offer.api";
import { getMenus } from "@/app/modules/menu/menu.api";

const ManageOffers = () => {
  // --- STATES ---
  const [offers, setOffers] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [offerRes, menuRes] = await Promise.all([
        getAllOffersApi(),
        getMenus(),
      ]);

      // Robust data extraction based on common API responses
      const extractedOffers =
        offerRes?.data || (Array.isArray(offerRes) ? offerRes : []);
      const extractedMenus =
        menuRes?.data || (Array.isArray(menuRes) ? menuRes : []);

      setOffers(extractedOffers);
      setMenus(extractedMenus);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC ---
  const groupedMenus = useMemo(() => {
    return menus.reduce((acc: any, menu: any) => {
      const categoryName =
        menu?.categoryId?.name || menu?.category?.name || "General Items";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(menu);
      return acc;
    }, {});
  }, [menus]);

  const resetForm = () => {
    setFormData({
      title: "",
      discountPercentage: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setSelectedMenus([]);
    setEditingId(null);
    setShowModal(false);
    setOpenCategory(null);
  };

  const handleEditInit = (offer: any) => {
    setEditingId(offer._id);
    setFormData({
      title: offer.title || "",
      discountPercentage: offer.discountPercentage?.toString() || "",
      startDate: offer.startDate
        ? new Date(offer.startDate).toISOString().split("T")[0]
        : "",
      endDate: offer.endDate
        ? new Date(offer.endDate).toISOString().split("T")[0]
        : "",
      description: offer.description || "",
    });
    // Store IDs if they are objects
    const menuIds = offer.applicableMenus?.map((m: any) => m._id || m) || [];
    setSelectedMenus(menuIds);
    setShowModal(true);
  };

  const handleStatusToggle = async (offer: any) => {
    try {
      const newStatus = !offer.isActive;
      await updateOfferApi(offer._id, { isActive: newStatus });
      setOffers((prev) =>
        prev.map((o) =>
          o._id === offer._id ? { ...o, isActive: newStatus } : o,
        ),
      );
      toast.success(`Offer ${newStatus ? "Activated" : "Deactivated"}`);
    } catch {
      toast.error("Status update failed");
    }
  };

  const toggleMenuSelection = (id: string) => {
    setSelectedMenus((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    };

    try {
      if (editingId) {
        await updateOfferApi(editingId, payload);
        toast.success("Offer Updated!");
      } else {
        await createOfferApi({ ...payload, isActive: true });
        toast.success("Offer Launched!");
      }
      resetForm();
      await fetchInitialData();
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Remove Offer?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, Delete",
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
  const TableSkeleton = () => {
    return (
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Table Structure Skeleton */}
        <div className="bg-white rounded-[1.2rem] shadow-sm border border-gray-100 overflow-hidden">
          {/* Skeleton Header */}
          <div className="bg-[#F8FAF9] border-b border-gray-100 p-6 flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-24" />
          </div>

          {/* Skeleton Rows */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-6 border-b border-gray-50 flex items-center justify-between"
            >
              {/* Campaign & Description */}
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded-md w-48" />
                <div className="h-3 bg-gray-100 rounded-md w-32" />
              </div>

              {/* Discount Badge */}
              <div className="flex-1 flex justify-center">
                <div className="h-8 bg-gray-100 rounded-full w-20" />
              </div>

              {/* Status Toggle */}
              <div className="flex-1 flex justify-center">
                <div className="h-8 bg-gray-100 rounded-full w-12" />
              </div>

              {/* Actions */}
              <div className="flex-1 flex justify-end gap-3">
                <div className="h-10 bg-gray-50 rounded-xl w-10" />
                <div className="h-10 bg-gray-50 rounded-xl w-10" />
                <div className="h-10 bg-gray-50 rounded-xl w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="pt-40">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className=" md:p-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
              Promotional <span className="text-[#1A4E11]">Offers</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Manage and update active discounts.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-[#1A4E11] text-white px-4 md:px-8 py-4 rounded-[1rem] font-bold shadow-xl shadow-[#1A4E11]/20 hover:bg-black transition-all"
          >
            <FiPlus size={20} /> Create New Offer
          </button>
        </div>

        {/* OFFERS TABLE */}
        <div className="bg-white rounded-[1rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAF9] border-b border-gray-100">
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400">
                    Campaign
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-center">
                    Discount
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-center">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <tr
                      key={offer._id}
                      className={`border-b border-gray-50 transition-colors ${!offer.isActive ? "opacity-60 bg-gray-50/50" : ""}`}
                    >
                      <td className="p-4 md:p-6">
                        <div className="font-black text-gray-800 text-sm md:text-lg leading-tight">
                          {offer.title}
                        </div>
                        <div className="text-gray-400 text-xs mt-1">
                          {new Date(offer.startDate).toLocaleDateString()} -{" "}
                          {new Date(offer.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-6 text-center">
                        <span className="md:bg-[#1A4E11]/10 text-[#1A4E11] px-2 md:px-4 py-1.5 rounded-full text-sm font-black">
                          {offer.discountPercentage}% OFF
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => handleStatusToggle(offer)}
                          className={`text-3xl transition-colors ${offer.isActive ? "text-[#1A4E11]" : "text-gray-300"}`}
                        >
                          {offer.isActive ? (
                            <FiToggleRight />
                          ) : (
                            <FiToggleLeft />
                          )}
                        </button>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOffer(offer)}
                            className="p-3 text-gray-400 hover:text-[#1A4E11] transition-all"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditInit(offer)}
                            className="p-3 text-gray-400 hover:text-blue-500 transition-all"
                          >
                            <FiEdit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(offer._id)}
                            className="p-3 text-gray-400 hover:text-red-500 transition-all"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-20 text-gray-400 font-bold"
                    >
                      No offers found.
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white w-full max-w-xl p-8 rounded-[3rem] shadow-2xl border border-white"
            >
              <button
                onClick={() => setSelectedOffer(null)}
                className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full"
              >
                <FiX size={20} />
              </button>
              <div className="mb-6">
                <span className="bg-[#1A4E11] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Campaign View
                </span>
                <h2 className="text-3xl font-black text-gray-900 mt-4 leading-tight">
                  {selectedOffer.title}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase mb-1">
                    Discount
                  </div>
                  <div className="text-2xl font-black text-[#1A4E11]">
                    {selectedOffer.discountPercentage}%
                  </div>
                </div>
                <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-100">
                  <div className="text-[10px] font-black text-gray-400 uppercase mb-1">
                    Items
                  </div>
                  <div className="text-2xl font-black text-gray-700">
                    {selectedOffer.applicableMenus?.length || 0}
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3 ml-1">
                  About Campaign
                </h3>
                <p className="text-gray-600 font-bold text-sm bg-gray-50 p-4 rounded-2xl">
                  {selectedOffer.description || "No description provided."}
                </p>
              </div>
              <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {selectedOffer.applicableMenus?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white border border-gray-100 p-2 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image?.url && (
                        <img
                          src={item.image.url}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs font-black text-gray-800 truncate">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE/EDIT MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-black/20 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative bg-white w-full max-w-2xl p-8 md:p-12 rounded-[12px] shadow-2xl"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
                {editingId ? "Update" : "Setup"}{" "}
                <span className="text-[#1A4E11]">Offer</span>
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-4">
                      Campaign Title
                    </label>
                    <input
                      required
                      value={formData.title}
                      placeholder="e.g. Weekend Special"
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4E11]/10 font-bold text-gray-700"
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-4">
                      Discount (%)
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.discountPercentage}
                      placeholder="20"
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4E11]/10 font-bold text-gray-700"
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
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-4">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    placeholder="Brief details..."
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-[#1A4E11]/10 font-bold text-gray-700 resize-none"
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-4">
                      Start Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.startDate}
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700"
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-4">
                      End Date
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.endDate}
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-gray-700"
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* DROPDOWN SELECTION */}
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 block">
                    Applicable Menus ({selectedMenus.length})
                  </label>
                  <div className="space-y-3">
                    {Object.keys(groupedMenus).length > 0 ? (
                      Object.keys(groupedMenus).map((cat) => (
                        <div
                          key={cat}
                          className="border border-gray-100 rounded-[1.2rem] overflow-hidden bg-white shadow-sm"
                        >
                          <button
                            type="button"
                            className="w-full flex justify-between items-center p-4 bg-[#F8FAF9] hover:bg-gray-100 transition-all"
                            onClick={() =>
                              setOpenCategory(openCategory === cat ? null : cat)
                            }
                          >
                            <span className="font-black text-xs uppercase tracking-widest text-gray-700">
                              {cat}
                            </span>
                            {openCategory === cat ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </button>
                          <AnimatePresence>
                            {openCategory === cat && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-white border-t border-gray-50"
                              >
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {groupedMenus[cat].map((menu: any) => (
                                    <button
                                      key={menu._id}
                                      type="button"
                                      onClick={() =>
                                        toggleMenuSelection(menu._id)
                                      }
                                      className={`p-3 text-[10px] font-black border-2 rounded-xl flex justify-between items-center transition-all ${selectedMenus.includes(menu._id) ? "bg-[#1A4E11] text-white border-transparent" : "bg-gray-50 text-gray-500 hover:border-[#1A4E11]/20"}`}
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
                      ))
                    ) : (
                      <div className="text-center p-6 bg-gray-50 rounded-2xl text-gray-400 text-xs font-bold border border-dashed border-gray-200">
                        No menus available to select.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 p-5 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                  >
                    Discard
                  </button>
                  <button
                    disabled={submitLoading}
                    type="submit"
                    className="flex-1 p-5 bg-[#1A4E11] text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                  >
                    {submitLoading ? (
                      <BiLoaderAlt className="animate-spin" />
                    ) : editingId ? (
                      "Update Campaign"
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
