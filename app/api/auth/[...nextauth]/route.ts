/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { loginUserApi } from "../../../modules/auth/auth.api";

const getTokenExpiryMs = (accessToken: string) => {
  try {
    const payloadBase64 = accessToken.split(".")[1];
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
    return payload?.exp ? payload.exp * 1000 : Date.now() + 60 * 1000;
  } catch {
    return Date.now() + 60 * 1000;
  }
};

const refreshAccessToken = async (token: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      { refreshToken: token.refreshToken },
      { withCredentials: true },
    );

    const newAccessToken = response?.data?.data?.token;
    const refreshedUser = response?.data?.data?.user;

    if (!newAccessToken) {
      return { ...token, error: "RefreshAccessTokenError" };
    }

    const nextRole = refreshedUser?.role || token.role;
    const nextId = refreshedUser?._id || token.id;
    const roleChangedForSameUser =
      Boolean(token.id) &&
      Boolean(nextId) &&
      String(token.id) === String(nextId) &&
      Boolean(token.role) &&
      Boolean(nextRole) &&
      String(token.role) !== String(nextRole);

    if (roleChangedForSameUser) {
      return {
        ...token,
        error: "RoleChanged",
      };
    }

    return {
      ...token,
      accessToken: newAccessToken,
      accessTokenExpires: getTokenExpiryMs(newAccessToken),
      role: refreshedUser?.role || token.role,
      id: refreshedUser?._id || token.id,
      name: refreshedUser?.name || token.name,
      email: refreshedUser?.email || token.email,
      picture: refreshedUser?.image || token.picture,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await loginUserApi({
            email: credentials?.email as string,
            password: credentials?.password as string,
          });
          if (res.success && res.data.user) {
            return {
              ...res.data.user,
              id: res.data.user._id,
              riderId: res.data.user?.riderId || null,
              accessToken: res.data.token,
              refreshToken: res.data.refreshToken,
              accessTokenExpires: getTokenExpiryMs(res.data.token),
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.riderId = (user as any).riderId;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires =
          (user as any).accessTokenExpires || Date.now() + 60 * 1000;
        token.name = (user as any).name;
        token.picture = (user as any).image;
        token.email = (user as any).email;
      }

      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image) token.picture = session.user.image;
        if (session.user.phone) token.phone = session.user.phone;
      }

      if (token.refreshToken) {
        // Always refresh from backend so session always carries latest access token.
        return refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          riderId: token.riderId,
          email: token.email,
          name: token.name,
          image: token.picture,
          phone: token.phone,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
