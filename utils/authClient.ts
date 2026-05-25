"use client";

import { signOut } from "next-auth/react";

export const clearCartStorage = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("cart");
  localStorage.removeItem("temp_checkout");
  localStorage.removeItem("pending_order_id");
};


// flkj

export const logoutAndClear = async (callbackUrl = "/login") => {
  clearCartStorage();
  await signOut({ callbackUrl });
};
