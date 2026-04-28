// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken?: string;
    error?: string;
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
    };
    accessToken: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}