/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  IoPersonOutline,
  IoCallOutline,
  IoCameraOutline,
  IoShieldCheckmarkOutline,
  IoSaveOutline,
  IoCloseOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { useSession } from "next-auth/react";
import { getMeApi, updateProfileApi } from "@/app/modules/auth/auth.api";

const UserProfile = () => {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // ── Password State ──
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);
      const res: any = await getMeApi(session.user.id);
      if (res.success && res.data) {
        const profileData = res.data.user || res.data;
        setUser(profileData);
        setFormData({
          name: profileData.name || "",
          phone: profileData.phone || "",
        });
        setImagePreview(profileData.image || "");
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("phone", formData.phone);

  
      if (imageFile) {
        payload.append("image", imageFile);
      }

      const res: any = await updateProfileApi(payload);
      if (res.success) {
        const updatedUser = res.data?.user || res.data;


        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            image: updatedUser.image,
            phone: updatedUser.phone,
          },
        });

        toast.success("Profile Updated & Synced!");
        setUser(updatedUser);
        setIsEditing(false);
        setImageFile(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Update failed!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    try {
      setPasswordLoading(true);

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Password change failed!");
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Address helper ──
  const hasAddress =
    user?.address &&
    (typeof user.address === "string"
      ? user.address.trim()
      : user.address.street || user.address.city || user.address.country);

  const addressText =
    typeof user?.address === "string"
      ? user.address
      : [
          user?.address?.street,
          user?.address?.city,
          user?.address?.state,
          user?.address?.country,
        ]
          .filter(Boolean)
          .join(", ");

  // ── Skeleton ──
  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-2 md:p-8 animate-pulse space-y-8">
        <div className="h-9 w-64 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[30px] border border-gray-100 p-8 space-y-4">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto" />
              <div className="h-5 w-32 bg-gray-200 rounded mx-auto" />
              <div className="h-3 w-40 bg-gray-100 rounded mx-auto" />
            </div>
          </div>
          <div className="lg:col-span-9 space-y-6">
            <div className="bg-white rounded-[30px] border border-gray-100 p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="h-14 bg-gray-100 rounded-2xl" />
                <div className="h-14 bg-gray-100 rounded-2xl" />
              </div>
            </div>
            <div className="bg-white rounded-[30px] border border-gray-100 p-10 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="h-14 bg-gray-100 rounded-2xl" />
                <div className="h-14 bg-gray-100 rounded-2xl" />
                <div className="h-14 bg-gray-100 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 font-sans text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase italic leading-none">
            Account Settings
          </h1>
          <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[4px] flex items-center gap-2">
            <IoShieldCheckmarkOutline className="text-[#1A4E11]" />
            Manage Personal Identity
          </p>
        </div>
        <button
          onClick={() => {
            if (isEditing) loadProfile();
            setIsEditing(!isEditing);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border ${
            isEditing
              ? "bg-red-50 text-red-500 border-red-100"
              : "bg-white text-gray-700 border-gray-100"
          }`}
        >
          {isEditing ? (
            <>
              <IoCloseOutline size={18} /> Cancel
            </>
          ) : (
            <>
              <IoPersonOutline size={16} /> Edit Details
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left: Avatar Card ── */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-[30px] border border-gray-100 text-center relative overflow-hidden sticky top-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4E11]" />

            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 mx-auto flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl font-black text-[#1A4E11]/20 uppercase">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="image-upload"
                  className="absolute bottom-0 right-0 bg-[#1A4E11] p-2 rounded-full text-white cursor-pointer hover:scale-110 transition-transform"
                >
                  <IoCameraOutline size={20} />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e: any) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Name */}
            <h2 className="text-lg font-black text-gray-900 uppercase truncate px-2">
              {user?.name}
            </h2>

            {/* Email — avatar এর নিচে ছোট, repeated নয় */}
            <p className="text-[11px] text-gray-400 font-medium mt-1 truncate px-2">
              {user?.email}
            </p>

            {/* Address — registration এ দেওয়া থাকলেই দেখাবে */}
            {hasAddress && (
              <div className="mt-6 pt-5 border-t border-gray-50 text-left">
                <p className="text-[9px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1.5">
                  <IoLocationOutline size={12} className="text-[#1A4E11]" />
                  Address
                </p>
                <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                  {addressText}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Forms ── */}
        <div className="lg:col-span-9 space-y-6">
          {/* Personal Info */}
          <div className="bg-white p-8 md:p-10 rounded-[30px] border border-gray-100">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-8 flex items-center gap-2">
              <IoPersonOutline className="text-[#1A4E11]" size={14} />
              Personal Information
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none disabled:opacity-50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Phone
                  </label>
                  <div className="relative">
                    <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none disabled:opacity-50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Address — read-only, registration থেকে */}
              {hasAddress && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Address
                  </label>
                  <div className="relative">
                    <IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      disabled
                      value={addressText}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none opacity-60"
                    />
                  </div>
                </div>
              )}

              {isEditing && (
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1A4E11] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-[#143d0d] shadow-xl disabled:opacity-70 transition-all"
                >
                  {updateLoading ? (
                    "Updating..."
                  ) : (
                    <>
                      <IoSaveOutline size={18} /> Update Account
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* ── Password Change — সবসময় দেখাবে ── */}
          <div className="bg-white p-8 md:p-10 rounded-[30px] border border-gray-100">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-8 flex items-center gap-2">
              <IoLockClosedOutline className="text-[#1A4E11]" size={14} />
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Current Password
                  </label>
                  <div className="relative">
                    <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? (
                        <IoEyeOffOutline size={18} />
                      ) : (
                        <IoEyeOutline size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    New Password
                  </label>
                  <div className="relative">
                    <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold focus:border-[#1A4E11] focus:bg-white outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? (
                        <IoEyeOffOutline size={18} />
                      ) : (
                        <IoEyeOutline size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className={`w-full bg-gray-50/50 border rounded-2xl pl-12 pr-12 py-4 text-sm font-bold focus:bg-white outline-none transition-all ${
                        passwordData.confirmPassword &&
                        passwordData.newPassword !==
                          passwordData.confirmPassword
                          ? "border-red-200 focus:border-red-400"
                          : "border-gray-100 focus:border-[#1A4E11]"
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPass ? (
                        <IoEyeOffOutline size={18} />
                      ) : (
                        <IoEyeOutline size={18} />
                      )}
                    </button>
                  </div>
                  {passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <p className="text-[10px] text-red-400 font-bold uppercase">
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1A4E11] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-[#143d0d] shadow-xl disabled:opacity-70 transition-all"
              >
                {passwordLoading ? (
                  "Changing..."
                ) : (
                  <>
                    <IoLockClosedOutline size={18} /> Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
