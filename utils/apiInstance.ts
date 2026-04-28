
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import toast from 'react-hot-toast';
import { logoutAndClear } from './authClient';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    try {
      // NextAuth route now refreshes token and returns latest session token.
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const session: any = await res.json();
      if (session?.error === "RoleChanged") {
        toast("Role updated by admin. Please login again.");
        await logoutAndClear("/login");
        return Promise.reject(new Error("RoleChanged"));
      }
      const accessToken = session?.accessToken as string | undefined;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch {
      // If session endpoint fails, proceed without Authorization header.
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message = error.response?.data?.message;
    const isBlockedUser =
      typeof message === "string" && message.toLowerCase().includes("blocked");
    const isRoleUpdated =
      typeof message === "string" &&
      message.toLowerCase().includes("role has been updated");

    // Do not auto-logout on generic 403 (role-based access can also return 403).
    if (isBlockedUser) {
      toast.error("Your account is blocked! Logging out...");
      await logoutAndClear("/login");
    }

    if (isRoleUpdated) {
      toast("Role updated by admin. Please login again.");
      await logoutAndClear("/login");
    }

    return Promise.reject(error);
  },
);

export default api;