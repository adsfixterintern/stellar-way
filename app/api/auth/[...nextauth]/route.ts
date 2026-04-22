/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUserApi } from "../../../modules/auth/auth.api";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" }
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
              accessToken: res.data.token 
            };
          }
          return null;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Login failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role; 
        token.accessToken = (user as any).accessToken;
        token.name = (user as any).name;
        token.picture = (user as any).image;
        token.email = (user as any).email;
      }

      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image) token.picture = session.user.image;
        if (session.user.phone) token.phone = session.user.phone;
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          email: token.email,
          name: token.name,
          image: token.picture, 
          phone: token.phone,
        };
        session.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };