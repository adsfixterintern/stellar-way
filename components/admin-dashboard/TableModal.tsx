
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoCloseOutline, IoCloudUploadOutline, IoSyncOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { createTableApi, updateTableApi } from "@/app/modules/table/table.api";
import { ITable } from "@/app/modules/table/table.interface";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: ITable | null;
  onSuccess: () => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  editData,
  onSuccess,
}) => {
  const [preview, setPreview] = useState<string | null>(null); 
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm();

 
  const selectedImage = watch("image");

  useEffect(() => {
    if (selectedImage && selectedImage[0]) {
      const file = selectedImage[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [selectedImage]);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setValue("tableNumber", editData.tableNumber);
        setValue("totalSeat", editData.totalSeat);
        setValue("position", editData.position);
        setValue("description", editData.description);
        setValue("status", editData.status);
        setPreview(null); 
      } else {
        reset();
        setPreview(null);
      }
    }
  }, [editData, setValue, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("tableNumber", data.tableNumber);
      formData.append("totalSeat", data.totalSeat);
      formData.append("position", data.position);
      formData.append("description", data.description);
      formData.append("status", data.status || "available");

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      let response;
      if (editData) {
        response = await updateTableApi(editData._id, formData);
      } else {
        response = await createTableApi(formData);
      }

      if (response.success) {
        toast.success(editData ? "Table updated successfully!" : "Table added successfully!");
        onSuccess();
        onClose();
        reset();
        setPreview(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-black text-gray-900">
            {editData ? "Edit Table" : "Add New Table"}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Table Number</label>
              <input
                {...register("tableNumber", { required: true })}
                placeholder="T-101"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Total Seat</label>
              <input
                type="number"
                {...register("totalSeat", { required: true })}
                placeholder="4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Position</label>
            <select
              {...register("position", { required: true })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
            >
              <option value="window-side">Window-side</option>
              <option value="center">Center</option>
              <option value="corner">Corner</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Description</label>
            <textarea
              {...register("description", { required: true })}
              rows={2}
              placeholder="Describe the location..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm resize-none"
            />
          </div>

          {/* Image Section with Preview */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">
              Table Image {editData && <span className="lowercase text-blue-500">(Leave empty to keep old)</span>}
            </label>
            
            <div className="flex gap-4 items-center">
              {/* Image Input Area */}
              <div className="relative group flex-1">
                <input
                  type="file"
                  {...register("image", { required: !editData })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 group-hover:border-[#1A4E11] transition-colors bg-gray-50/50">
                  <IoCloudUploadOutline size={20} className="text-gray-400 group-hover:text-[#1A4E11]" />
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center px-2">
                    {editData ? "Change Image" : "Upload Image"}
                  </span>
                </div>
              </div>

              {/* Preview Area (Current or New) */}
              <div className="w-20 h-20 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0 relative">
                {preview ? (
                  <img src={preview} alt="New Preview" className="w-full h-full object-cover" />
                ) : editData?.image ? (
                  <img src={editData.image} alt="Current" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IoSyncOutline className="text-gray-200" size={24} />
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-black/40 text-[8px] text-white px-1 font-bold">
                   {preview ? "NEW" : "LIVE"}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all uppercase text-xs tracking-widest disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[#1A4E11] text-white rounded-xl font-bold hover:bg-opacity-90 transition-all uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <IoSyncOutline className="animate-spin" size={18} />
                  {editData ? "Updating..." : "Saving..."}
                </>
              ) : (
                editData ? "Update Table" : "Save Table"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};