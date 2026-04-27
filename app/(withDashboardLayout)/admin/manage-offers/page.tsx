/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiPlus,
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
      customClass: { popup: "rounded-3xl" },
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

  const TableSkeleton = () => (
    <div className="max-w-7xl mx-auto animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-white rounded-2xl border border-gray-100"
        />
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="p-6 md:p-10 pt-24 md:pt-32">
        <TableSkeleton />
      </div>
    );

  return (
    <div className=" min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 italic tracking-tighter uppercase">
              Promotional <span className="text-[#1A4E11]">Offers</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[3px] mt-1">
              Campaign Management Dashboard
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1A4E11] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1A4E11]/10 hover:bg-black transition-all active:scale-95"
          >
            <FiPlus size={18} /> New Campaign
          </button>
        </div>

        {/* OFFERS CONTENT */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Campaign Info
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                    Benefit
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                    Status
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {offers.map((offer) => (
                  <tr
                    key={offer._id}
                    className={`hover:bg-gray-50/30 transition-all ${!offer.isActive ? "opacity-60" : ""}`}
                  >
                    <td className="p-6">
                      <div className="font-black text-gray-800 text-base uppercase italic tracking-tight">
                        {offer.title}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold mt-1 uppercase">
                        {new Date(offer.startDate).toLocaleDateString()} —{" "}
                        {new Date(offer.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="bg-[#1A4E11] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {offer.discountPercentage}% OFF
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => handleStatusToggle(offer)}
                        className={`text-3xl transition-colors ${offer.isActive ? "text-[#1A4E11]" : "text-gray-300"}`}
                      >
                        {offer.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setSelectedOffer(offer)}
                          className="p-3 text-gray-400 hover:text-[#1A4E11]"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditInit(offer)}
                          className="p-3 text-gray-400 hover:text-blue-500"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="p-3 text-gray-400 hover:text-red-500"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST */}
          <div className="md:hidden divide-y divide-gray-50">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className={`p-6 space-y-4 ${!offer.isActive ? "bg-gray-50/50 opacity-70" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-gray-800 text-sm uppercase italic tracking-tight">
                      {offer.title}
                    </h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                      Ends: {new Date(offer.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-[#1A4E11] text-white px-3 py-1 rounded-full text-[9px] font-black">
                    {offer.discountPercentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleStatusToggle(offer)}
                    className={`text-3xl ${offer.isActive ? "text-[#1A4E11]" : "text-gray-300"}`}
                  >
                    {offer.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="p-2.5 bg-gray-50 rounded-xl text-gray-400"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditInit(offer)}
                      className="p-2.5 bg-gray-50 rounded-xl text-gray-400"
                    >
                      <FiEdit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="p-2.5 bg-gray-50 rounded-xl text-red-400"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {offers.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-[3px]">
              No Offers Found
            </div>
          )}
        </div>
      </div>

      {/* VIEW MODAL */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white w-full max-w-lg p-6 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedOffer(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
              <div className="mb-8">
                <span className="text-[#1A4E11] text-[10px] font-black uppercase tracking-[3px]">
                  Campaign Details
                </span>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mt-2">
                  {selectedOffer.title}
                </h2>
              </div>
              <div className="bg-gray-50 rounded-3xl p-6 mb-6">
                <p className="text-gray-600 font-bold text-sm leading-relaxed">
                  {selectedOffer.description || "No description provided."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                  <p className="text-[9px] font-black text-green-600 uppercase mb-1">
                    Discount
                  </p>
                  <p className="text-xl font-black text-[#1A4E11]">
                    {selectedOffer.discountPercentage}% OFF
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <p className="text-[9px] font-black text-blue-600 uppercase mb-1">
                    Items
                  </p>
                  <p className="text-xl font-black text-blue-900">
                    {selectedOffer.applicableMenus?.length || 0} Fixed
                  </p>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {selectedOffer.applicableMenus?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden">
                      {item.image?.url && (
                        <img
                          src={item.image.url}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-black text-gray-700 uppercase truncate">
                      {item.name || item.title}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORM MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="relative bg-white w-full max-w-2xl p-6 md:p-12 rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                  {editingId ? "Edit" : "New"}{" "}
                  <span className="text-[#1A4E11]">Campaign</span>
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Title
                    </label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-[#1A4E11]/5 font-bold text-sm"
                      placeholder="Weekend Blast"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Discount %
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountPercentage: e.target.value,
                        })
                      }
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm resize-none"
                    placeholder="Details about this offer..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Starts
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Ends
                    </label>
                    <input
                      required
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Applicable Items ({selectedMenus.length})
                  </label>
                  <div className="space-y-2">
                    {Object.keys(groupedMenus).map((cat) => (
                      <div
                        key={cat}
                        className="border border-gray-100 rounded-2xl overflow-hidden bg-white"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenCategory(openCategory === cat ? null : cat)
                          }
                          className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-gray-100 transition-all"
                        >
                          <span className="font-black text-[10px] uppercase tracking-widest text-gray-600">
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
                              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {groupedMenus[cat].map((menu: any) => (
                                  <button
                                    key={menu._id}
                                    type="button"
                                    onClick={() =>
                                      toggleMenuSelection(menu._id)
                                    }
                                    className={`p-3 text-[9px] font-black border-2 rounded-xl flex justify-between items-center transition-all ${selectedMenus.includes(menu._id) ? "bg-[#1A4E11] text-white border-transparent" : "bg-gray-50 text-gray-500"}`}
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

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:flex-1 p-5 text-gray-400 font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                  >
                    Discard
                  </button>
                  <button
                    disabled={submitLoading}
                    type="submit"
                    className="w-full sm:flex-1 p-5 bg-[#1A4E11] text-white rounded-2xl font-black shadow-xl shadow-[#1A4E11]/10 hover:bg-black transition-all flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest disabled:bg-gray-300"
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
