"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  IoAddOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoImageOutline,
  IoCreateOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import Swal from "sweetalert2";
import { useMenu } from "@/app/hooks/useMenu";
import { useCategories } from "@/app/hooks/useCategories";
import { useChefs } from "@/app/hooks/useChefs";
import { IChef, IMenu } from "@/types/menu";
import { ICategory } from "@/types/category";
import Image from "next/image";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

const MenuPage: React.FC = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // React Query Hooks
  const {
    data: menus = [],
    isLoading: menuLoading,
    refetch: refetchMenus,
  } = useMenu();
  const { data: categories = [] } = useCategories();
  const { data: chefs = [] } = useChefs();

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [chefId, setChefId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("1");
  const [status, setStatus] = useState<string>("active");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = (menu: IMenu) => {
    setEditId(menu._id);
    setTitle(menu.title);
    setDescription(menu.description || "");
    setPrice(String(menu.price));
    setStock(String(menu.stock));

    // Type-safe selection for ID
    setCategoryId(menu.categoryId?._id || "");
    setChefId(menu.chefId?._id || "");
    setStatus(menu.status);
    setImagePreview(menu.image?.url || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("chefId", chefId);
      formData.append("categoryId", categoryId);
      formData.append("sortOrder", sortOrder);
      formData.append("status", status);
      if (imageFile) formData.append("image", imageFile);

      const url = editId
        ? `${BASE_URL}/menu/${editId}`
        : `${BASE_URL}/menu/create-menu`;
      const method = editId ? "patch" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(editId ? "Menu updated!" : "Menu created!");
        closeModal();
        refetchMenus();
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Operation failed");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setStock("");
    setChefId("");
    setCategoryId("");
    setSortOrder("1");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Item will be removed permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A4E11",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(`${BASE_URL}/menu/${id}`);
        if (data.success) {
          toast.success("Deleted");
          refetchMenus();
        }
      } catch (err) {
        console.log(err);
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Menu Management
          </h1>
          <p className="text-[10px] text-gray-400 font-black mt-1 uppercase tracking-widest">
            Total Items: {menus.length}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 blockBtn"
        >
          <IoAddOutline size={18} /> Add New Menu
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Product
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Price
                </th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">
                  Stock
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
              {menuLoading ? (
                <TableSkeleton />
              ) : menus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-[10px]">
                    No menus found
                  </td>
                </tr>
              ) : (
                menus.map((item: IMenu) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden border border-gray-100 relative">
                            {item.image?.url ? (
                              <Image
                                src={item.image.url}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <IoImageOutline
                                  size={20}
                                  className="text-gray-300"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">
                            {item.title}
                          </span>
                          <span className="text-[9px] text-gray-400 font-black uppercase truncate w-32">
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-gray-700 text-sm">
                      ৳{item.price}
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full ${item.stock < 10 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500"}`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === "active" ? "bg-green-50 text-[#1A4E11]" : "bg-gray-100 text-gray-400"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <IoCreateOutline size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <IoTrashOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-900">
                {editId ? "Edit Item" : "Add Item"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Item Name
                  </label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold resize-none"
                      placeholder="Enter item details..."
                    />
                    <IoDocumentTextOutline
                      className="absolute right-4 top-4 text-gray-300"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Category
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c: ICategory) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Chef
                  </label>
                  <select
                    required
                    value={chefId}
                    onChange={(e) => setChefId(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold appearance-none"
                  >
                    <option value="">Select Chef</option>
                    {chefs.map((c: IChef) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#1A4E11] text-sm bg-gray-50 font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 overflow-hidden">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <IoImageOutline size={30} className="text-gray-200" />
                        <span className="text-[9px] text-gray-400 mt-2 font-black uppercase tracking-widest">
                          Upload Image
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full bg-[#1A4E11] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[2px] shadow-xl shadow-[#1A4E11]/20"
              >
                {btnLoading ? "Processing..." : editId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
